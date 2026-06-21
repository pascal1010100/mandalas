# Deploy

## Production

- **Branch**: `main`
- **Public URL**: https://www.mandalashostels.com
- **Canonical redirect**: `mandalashostels.com` redirects to `www.mandalashostels.com`
- **Platform**: Vercel

Pushes to `main` trigger the production CI/CD workflow. A deployment can also be created manually with `vercel --prod`.

## Deployment commands

```bash
pnpm build
pnpm start
```

## Environment variables

```bash
NEXT_PUBLIC_APP_URL=https://www.mandalashostels.com
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
RESEND_API_KEY=your-resend-api-key
ENABLE_ADMIN=false
ENABLE_GUEST_PORTAL=false
```

## Health checks

After deployment, verify:

- [ ] Homepage, `/pueblo`, `/hideout`, and `/contact` load correctly.
- [ ] WhatsApp links open with the correct number.
- [ ] `robots.txt` and `sitemap.xml` respond successfully.
- [ ] `/admin` and `/my-booking` redirect to the public homepage.
