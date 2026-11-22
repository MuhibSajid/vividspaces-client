This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment

Create `.env` (see `.env.example`) before running or deploying:

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | browser + server | Base URL of the VividSpaces API (production default: `https://vividspaces-server.vercel.app`). Inlined at build time — redeploy after changing it. |
| `BETTER_AUTH_SECRET` | server | better-auth signing secret. |
| `BETTER_AUTH_URL` | server | Public URL of this app, e.g. `https://vividspaces-client.vercel.app`. |
| `MONGODB_CLIENT_URL` | server | MongoDB Atlas connection string. |

On Vercel, set all four under **Project → Settings → Environment Variables**, then redeploy. Use `https://vividspaces-server.vercel.app` for `NEXT_PUBLIC_API_URL`; verify it responds at `https://vividspaces-server.vercel.app/api/studios?limit=1`. Without a reachable API (or with the localhost fallback), every studio/booking fetch fails in production. The backend also needs its own `MONGODB_SERVER_URL` set in the **server** Vercel project.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
