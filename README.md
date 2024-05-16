# R&D

## Setup
- Install Supabase CLI https://supabase.com/docs/guides/cli/getting-started
- Copy `.env.example` to `.env` (values should be ok)
- Run `supabase init` to create the required local host config
- Run `supabase start && npx electric-sql start` to start. Wait for it to be ready.
- Run `npm run db:server:migration:deploy:proxy` to deploy the migrations
- Run `npm run dev` to start the dev server