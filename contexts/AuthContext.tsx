import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, UserRole, Team, TeamMember } from '../types';
import { supabase } from '../lib/supabaseClient';
import { mockTeams } from '../data/mockData';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [teams, setTeams] = useState<Team[]>(mockTeams);
    const [loading, setLoading] = useState(true);

    // Fetch teams from DB (fallback to mock)
    const loadTeams = async () => {
        try {
            const { data, error } = await supabase.from('teams').select('*');
            if (!error && data) {
                // Fetch team members in bulk
                const teamIds = data.map((t: any) => t.id);
                let membersByTeam: Record<string, any[]> = {};
                try {
                    const { data: membersData, error: memErr } = await supabase.from('team_members').select('*').in('team_id', teamIds);
                    if (!memErr && membersData) {
                        membersByTeam = membersData.reduce((acc: Record<string, any[]>, m: any) => {
                            acc[m.team_id] = acc[m.team_id] || [];
                            acc[m.team_id].push({ id: m.id, name: m.name, email: m.email, role: m.role });
                            return acc;
                        }, {} as Record<string, any[]>);
                    }
                } catch (e) {
                    console.warn('Failed to load team members', e);
                }

                // Map DB rows to Team type (screenshot URLs are already public, stored directly from upload)
                const mapped: Team[] = data.map((t: any) => ({
                    id: t.id,
                    name: t.name,
                    college: t.college,
                    members: membersByTeam[t.id] || [],
                    paymentScreenshotUrl: t.payment_screenshot_url || null,
                    status: t.status,
                }) as Team);

                setTeams(mapped);
                return;
            }
        } catch (e) {
            console.warn('Failed to load teams from DB, using mock teams', e);
        }
        setTeams(mockTeams);
    };

    useEffect(() => {
        let authListener: { data: { subscription: any } } | null = null;
        let teamsChannel: any = null;
        let usersChannel: any = null;

        const init = async () => {
            // Load existing session
            try {
                const {
                    data: { session }
                } = await supabase.auth.getSession();

                if (session?.user) {
                    await hydrateUserFromProfile(session.user.id);
                }
            } catch (e) {
                console.warn('Error fetching session', e);
            }

            // Listen to auth state changes
            authListener = supabase.auth.onAuthStateChange((_event, session) => {
                if (session?.user) {
                    hydrateUserFromProfile(session.user.id);
                } else {
                    setUser(null);
                }
            });

            // Load teams
            await loadTeams();

            // Subscribe to realtime changes on teams and team_members so admin sees pending teams live
            try {
                teamsChannel = supabase.channel('public:teams')
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, () => {
                        loadTeams();
                    })
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, () => {
                        loadTeams();
                    })
                    .subscribe();
            } catch (e) {
                console.warn('Failed to subscribe to realtime team updates', e);
            }

            // Subscribe to realtime changes on users table so approved users see status updates immediately
            try {
                usersChannel = supabase.channel('public:users')
                    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users' }, (payload: any) => {
                        // If current user is updated, refresh their profile
                        if (user && payload.new.id === user.id) {
                            const updated: User = {
                                id: payload.new.id,
                                name: payload.new.name,
                                email: payload.new.email,
                                role: payload.new.role as UserRole,
                                teamId: payload.new.team_id || undefined,
                            };
                            setUser(updated);
                            localStorage.setItem('hackathon-user', JSON.stringify(updated));
                        }
                        // Always reload teams to reflect any changes
                        loadTeams();
                    })
                    .subscribe();
            } catch (e) {
                console.warn('Failed to subscribe to realtime user updates', e);
            }

            setLoading(false);
        };

        init();

        return () => {
            if (authListener && authListener.data && authListener.data.subscription) {
                authListener.data.subscription.unsubscribe();
            }
            if (teamsChannel && typeof teamsChannel.unsubscribe === 'function') {
                try { teamsChannel.unsubscribe(); } catch (e) { /* ignore */ }
            }
            if (usersChannel && typeof usersChannel.unsubscribe === 'function') {
                try { usersChannel.unsubscribe(); } catch (e) { /* ignore */ }
            }
        };
    }, []);

    const hydrateUserFromProfile = async (authId: string): Promise<User | null> => {
        try {
            const { data, error } = await supabase.from('users').select('*').eq('id', authId).single();
            if (!error && data) {
                const profileUser: User = {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    role: data.role as UserRole,
                    teamId: data.team_id || undefined,
                };
                setUser(profileUser);
                localStorage.setItem('hackathon-user', JSON.stringify(profileUser));
                return profileUser;
            }
            // If no profile found, create a basic one using auth user metadata
            const { data: authUserData } = await supabase.auth.getUser();
            const authUser = authUserData?.user ?? null;
            const email = authUser?.email ?? '';
            const name = (authUser?.user_metadata as any)?.name ?? '';
            const newProfile = {
                id: authId,
                name,
                email,
                role: UserRole.GUEST,
                team_id: null,
            };
            await supabase.from('users').insert(newProfile);
            const createdUser: User = { id: authId, name, email, role: UserRole.GUEST };
            setUser(createdUser);
            localStorage.setItem('hackathon-user', JSON.stringify(createdUser));
            return createdUser;
        } catch (e) {
            console.error('Failed to hydrate user profile', e);
            return null;
        }
    };


    const login = async (email: string, pass: string): Promise<User> => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) {
            throw error;
        }
        if (!data?.user) throw new Error('No user in session after login');

        const profile = await hydrateUserFromProfile(data.user.id);
        if (profile) return profile;

        // fallback to localStorage
        const stored = localStorage.getItem('hackathon-user');
        if (stored) return JSON.parse(stored) as User;
        throw new Error('Failed to load user after login');
    };

    const signup = async (name: string, email: string, pass: string): Promise<void> => {
        // Use Supabase auth signUp which will send a confirmation email based on your Supabase settings
        const { data, error } = await supabase.auth.signUp({ email, password: pass, options: { data: { name } } });
        if (error) throw error;

        // If the user object is present (depending on confirm settings), create profile row
        if (data?.user?.id) {
            const profile = {
                id: data.user.id,
                name,
                email,
                role: UserRole.GUEST,
                team_id: null,
            };
            await supabase.from('users').upsert(profile);
        }

        // Do NOT log the user in here; Supabase may require email confirmation. Inform UI to check email.
    };

    const signupAdmin = async (name: string, email: string, pass: string): Promise<void> => {
        // This creates an auth user and a profile with admin role
        const { data, error } = await supabase.auth.signUp({ email, password: pass, options: { data: { name } } });
        if (error) throw error;
        if (data?.user?.id) {
            const profile = {
                id: data.user.id,
                name,
                email,
                role: UserRole.ADMIN,
                team_id: null,
            };
            await supabase.from('users').upsert(profile);
        }
    };

    const registerTeam = async (teamName: string, college: string, members: TeamMember[], paymentScreenshot: File): Promise<string> => {
        if (!user) throw new Error("You must be logged in to register a team.");
        if (user.teamId) throw new Error("You are already part of a team.");

        // Upload payment screenshot to Supabase storage
        let screenshotUrl: string | null = null;
        try {
            const fileName = `payment-${Date.now()}-${paymentScreenshot.name}`;
            const upload = await supabase.storage.from('payments').upload(fileName, paymentScreenshot);
            if (upload.error) {
                console.error('Failed to upload screenshot', upload.error);
                // Surface upload error so UI shows meaningful message
                throw new Error('Failed to upload screenshot: ' + (upload.error.message || JSON.stringify(upload.error)));
            }
            
            // After upload, get and store the public URL directly in DB
            const pub = supabase.storage.from('payments').getPublicUrl(fileName) as any;
            const publicUrl = pub?.data?.publicUrl;
            if (!publicUrl) {
                throw new Error('Failed to get public URL for uploaded screenshot');
            }
            screenshotUrl = publicUrl;
        } catch (e) {
            console.error('Error uploading screenshot', e);
            throw e;
        }

        // Insert team and let the database generate a UUID for the `id` column.
        // Use `.select().single()` so Supabase returns the inserted row with its generated id.
        const { data: insertedTeam, error: teamInsertError } = await supabase
            .from('teams')
            .insert({ name: teamName, college, payment_screenshot_url: screenshotUrl, status: 'Pending' })
            .select()
            .single();
        if (teamInsertError) throw teamInsertError;
        const newTeamId = (insertedTeam as any).id as string;

        // Insert team members
        const memberInserts = members.map(m => ({ team_id: newTeamId, name: m.name, email: m.email, role: m.role }));
        const { error: membersError } = await supabase.from('team_members').insert(memberInserts);
        if (membersError) {
            console.warn('Failed to insert team members', membersError);
        }

        // Update user profile to be team leader
        await supabase.from('users').update({ role: UserRole.TEAM_LEADER, team_id: newTeamId }).eq('id', user.id);

        // Also, if some team members already have user profiles (registered users), assign their team_id and role
        const memberEmails = members.map(m => m.email).filter(Boolean);
        if (memberEmails.length > 0) {
            const { error: updateMembersError } = await supabase
                .from('users')
                .update({ role: UserRole.TEAM_MEMBER, team_id: newTeamId })
                .in('email', memberEmails);
            if (updateMembersError) {
                console.warn('Failed to update existing users with team id', updateMembersError);
            }
        }

        const updatedUser = { ...user, role: UserRole.TEAM_LEADER, teamId: newTeamId };
        setUser(updatedUser);
        localStorage.setItem('hackathon-user', JSON.stringify(updatedUser));

        // Refresh teams
        await loadTeams();

        return newTeamId;
    };

    const approveTeam = async (teamId: string) => {
        // Mark team as approved
        const { error } = await supabase.from('teams').update({ status: 'Approved' }).eq('id', teamId);
        if (error) throw error;

        // Fetch team members and update their user profiles (if they exist)
        const { data: members, error: membersErr } = await supabase.from('team_members').select('email, role').eq('team_id', teamId);
        if (membersErr) {
            console.warn('Failed to fetch team members for approval', membersErr);
        } else if (members && members.length > 0) {
            const emails = members.map((m: any) => m.email).filter(Boolean);
            if (emails.length > 0) {
                const { error: updErr } = await supabase.from('users').update({ team_id: teamId, role: UserRole.TEAM_MEMBER }).in('email', emails);
                if (updErr) console.warn('Failed to update users on team approval', updErr);
            }

            // If a leader is present in team_members, make sure leader role is set
            const leader = members.find((m: any) => m.role === 'Leader');
            if (leader && leader.email) {
                const { error: leaderErr } = await supabase.from('users').update({ role: UserRole.TEAM_LEADER, team_id: teamId }).eq('email', leader.email);
                if (leaderErr) console.warn('Failed to update leader role on approval', leaderErr);
            }
        }

        // If current user is part of this team, refresh their profile in context
        if (user?.teamId === teamId) {
            try {
                const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
                if (data) {
                    const refreshed: User = { id: data.id, name: data.name, email: data.email, role: data.role as UserRole, teamId: data.team_id || undefined };
                    setUser(refreshed);
                    localStorage.setItem('hackathon-user', JSON.stringify(refreshed));
                }
            } catch (e) {
                console.warn('Failed to refresh current user after team approval', e);
            }
        }

        await loadTeams();
    };

    const rejectTeam = async (teamId:string) => {
        // Mark team as rejected
        const { error } = await supabase.from('teams').update({ status: 'Rejected' }).eq('id', teamId);
        if (error) throw error;

        // Remove team assignment from any users who were assigned this team
        const { error: updErr } = await supabase.from('users').update({ team_id: null, role: UserRole.GUEST }).eq('team_id', teamId);
        if (updErr) console.warn('Failed to clear user team assignments on rejection', updErr);

        await loadTeams();
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        localStorage.removeItem('hackathon-user');
    };

    return (
        <AuthContext.Provider value={{ user, teams, login, signup, signupAdmin, logout, loading, registerTeam, approveTeam, rejectTeam }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};