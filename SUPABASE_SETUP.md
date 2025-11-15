# Supabase Integration Setup Guide

This guide walks you through setting up Supabase for the Hack Sphere hackathon platform with email/password authentication and email verification.

---

## Step 1: Environment Configuration

Create a `.env.local` (or update `.env`) file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

**Where to find these values:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API** (left sidebar)
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon (public) Key** → `VITE_SUPABASE_ANON_KEY`

> **Important:** Never commit `.env.local` to version control. Add it to `.gitignore` if not already present.

---

## Step 2: Configure Email Authentication

### Option A: Email/Password with Email Confirmation (Recommended)

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Ensure **Email** provider is enabled (it is by default)
3. Go to **Authentication** → **Email Templates**
4. Customize the "Confirm signup" email template if desired
5. Go to **Authentication** → **Settings**
6. Under **Email Settings:**
   - Set **Sender name** and **Sender email** (if using custom SMTP)
   - Under **Redirect URLs**, add your app's callback URL:
     ```
     http://localhost:5173/dashboard
     https://your-domain.com/dashboard
     ```

### Option B: Email/Password without Email Confirmation (Dev Only)

For **local development/testing only**, disable email confirmation:

1. In Supabase Dashboard, go to **Authentication** → **Settings**
2. Disable **Confirm email** toggle (set to OFF)
3. Users will be able to log in immediately after signup

⚠️ **Never disable email confirmation in production.**

---

## Step 3: Enable Storage for Payment Screenshots (Optional)

If you want to upload payment screenshots to Supabase Storage:

1. In Supabase Dashboard, go to **Storage**
2. Create a new bucket called `payments` (or your preferred name)
3. Configure RLS policies if needed (public read/private write recommended)
4. In your code, the `registerTeam` function will automatically upload to this bucket

---

## Step 4: Run Database Migrations

Your database schema (tables, columns) should already be set up. If not, run the SQL from `supabase/schema.sql` in the Supabase SQL Editor:

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New Query**
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **Run**

---

## Step 5: Seed Mock Data (Optional)

To populate your database with mock data (teams, rounds, MCQs, coding problems, etc.):

### Prerequisites:
- Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are in your `.env.local`
- Install `tsx` (if not already installed):
  ```bash
  npm install -D tsx
  ```

### Run Seed Script:
```bash
npx tsx scripts/seed.ts
```

The script will:
- ✅ Seed 4 teams from mock data
- ✅ Seed 3 rounds
- ✅ Seed 2 MCQs with options
- ✅ Seed 1 coding problem with test cases
- ✅ Seed Round 2 problem
- ✅ Seed certificates

**Check the console output for any errors.**

---

## Step 6: Start the Development Server

```bash
npm install
npm run dev
```

The app will run at `http://localhost:5173` (or another port if 5173 is busy).

---

## Authentication Flow

### Signup
1. User fills form on `/signup` with **name**, **email**, **password**
2. Frontend calls `auth.signup(name, email, password)`
3. Supabase creates an auth user and sends a **confirmation email**
4. If email confirmation is enabled, user must click the link in the email
5. A profile row is inserted into the `users` table with `role = 'guest'`
6. Frontend shows: *"Check your email to confirm your account"*

### Login
1. User fills form on `/login` with **email**, **password**
2. Frontend calls `auth.login(email, password)`
3. Supabase validates credentials
4. On success, the user's profile is loaded from the `users` table
5. User is redirected to `/dashboard` (or `/admin` if admin role)

### Logout
1. User clicks logout
2. Frontend calls `auth.logout()`
3. Supabase auth session is cleared
4. User is redirected to `/`

---

## Database Tables Overview

| Table | Purpose |
|-------|---------|
| `users` | User profiles (id, name, email, role, team_id) |
| `teams` | Hackathon teams |
| `team_members` | Members of each team |
| `rounds` | Contest rounds (Round 1, Round 2, Round 3) |
| `mcqs` | Multiple-choice questions |
| `mcq_options` | Options for each MCQ |
| `coding_problems` | Coding challenges |
| `coding_problem_test_cases` | Test cases (visible & hidden) |
| `round1_submissions` | Team submissions for Round 1 |
| `round1_mcq_answers` | MCQ answers per submission |
| `round1_coding_answers` | Code & results per submission |
| `round2_problem` | Project brief for Round 2 |
| `certificates` | Awarded certificates |

---

## Important Notes

### User ID Mapping
- Supabase `auth.user.id` is a **UUID** (e.g., `550e8400-e29b-41d4-a716-446655440000`)
- Store this UUID in the `users` table's `id` column as the primary key
- Use this ID to join with other tables

### Password Security
- **Never** store passwords in the `users` table (or anywhere except Supabase Auth)
- Supabase Auth handles password hashing and storage securely
- The `password` column in your schema (if it exists) should be removed or unused

### Session Persistence
- Sessions are stored in `localStorage` under key `hackathon-user`
- The browser automatically refreshes the session when needed
- Auth state listeners are set up in `contexts/AuthContext.tsx`

### Email Verification
- If email confirmation is **enabled**, users receive a confirmation email
- The email contains a link that sets the user's `email_confirmed_at` timestamp
- Users cannot log in until they confirm (unless you skip this step manually in the dashboard)
- If email confirmation is **disabled**, users can log in immediately

---

## Troubleshooting

### "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY"
- Check your `.env.local` file (or `.env`)
- Verify the values are copied correctly from Supabase dashboard
- Restart the dev server after updating `.env`

### Auth fails with "Invalid credentials"
- Check if the user exists in Supabase **Auth** tab (not just `users` table)
- If email confirmation is enabled, ensure the user has confirmed their email
- Check the email for a confirmation link if signup succeeded

### Seed script fails
- Ensure database tables exist (run schema.sql first)
- Check that `.env.local` has correct credentials
- Review console output for specific table errors

### "User not found" after login
- The `hydrateUserFromProfile` function should auto-create a profile if missing
- Check Supabase **Logs** in the dashboard for detailed errors
- Manually insert a row into `users` table matching the auth user's ID

---

## Next Steps

1. **Test Signup & Login:**
   - Try creating a new account on `/signup`
   - Check your email inbox for a confirmation link (if enabled)
   - Log in with the same credentials on `/login`

2. **Set Up Admin Account:**
   - Manually create an admin auth user in Supabase dashboard
   - Insert an admin profile row in the `users` table
   - Test login with admin credentials

3. **Customize Email Templates:**
   - Go to **Authentication** → **Email Templates** in Supabase
   - Edit the confirmation email to match your branding

4. **Deploy to Production:**
   - Update `.env` in your hosting platform with production Supabase credentials
   - Ensure email confirmation is **enabled** for production
   - Test the signup/login flow in production

---

## Support & Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [JavaScript Client Library](https://supabase.com/docs/reference/javascript/introduction)

