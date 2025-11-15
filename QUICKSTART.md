# 🚀 Quick Start: Supabase Integration

## The Essential 3 Steps

### 1️⃣ Add Environment Variables
Create `.env.local` in root:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Get from: https://app.supabase.com → Project → Settings → API

### 2️⃣ Run Database Schema
In Supabase Dashboard → SQL Editor:
- Open `supabase/schema.sql`
- Copy & paste all SQL
- Click Run

### 3️⃣ Seed Mock Data
```bash
npm install -D tsx  # if needed
npx tsx scripts/seed.ts
```

Done! Start dev server:
```bash
npm run dev
```

---

## Testing Signup/Login

1. Go to http://localhost:5173/signup
2. Create account with email
3. (If email confirmation enabled) Check email, click link to confirm
4. Go to /login
5. Login with same email/password
6. ✅ Should see dashboard

---

## Key Files Changed

- `lib/supabaseClient.ts` — Supabase connection
- `contexts/AuthContext.tsx` — Auth logic
- `pages/SignupPage.tsx` — Signup form
- `scripts/seed.ts` — Data seeding

---

## What Works Now

✅ Email/password signup with confirmation  
✅ Email/password login  
✅ Session persistence  
✅ Role-based routing (admin → /admin, others → /dashboard)  
✅ Team registration & management  
✅ Contest data (rounds, MCQs, coding problems)  

---

## Email Configuration (Dev vs Prod)

**Dev/Testing:** In Supabase Dashboard → Authentication → Settings:
- Toggle OFF "Confirm email" → Users login immediately

**Production:** Keep enabled → Users must confirm email first

---

## Detailed Guides

- **Full Setup:** See `SUPABASE_SETUP.md`
- **Integration Summary:** See `INTEGRATION_COMPLETE.md`
- **Database Schema:** See `supabase/schema.sql`

---

**Questions?** Check troubleshooting in `SUPABASE_SETUP.md`
