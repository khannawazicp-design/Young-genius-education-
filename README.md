# Young Genius Education - setup (about 20 minutes, all free tiers)

1. **Supabase** (supabase.com): create a project. Authentication > Providers > Email: turn OFF "Allow new users to sign up".
   Authentication > Users > Add user: your email + a strong password (this is your admin login).
2. Open supabase.sql, replace YOUR_EMAIL_HERE with that same email, paste it in SQL Editor, click Run.
3. Project Settings > API: copy the Project URL and the anon public key.
4. **GitHub**: create a new repository and upload all files from this folder.
5. **Vercel** (vercel.com): Add New Project > import that repository. Under Environment Variables add
   NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY with the values from step 3. Click Deploy.
6. Your site is live. Log in at /admin with your email and password. Only that email can edit; everyone else can only view and register.

Not included yet: photo/video uploads and a gallery. Ask Claude to add them next.
