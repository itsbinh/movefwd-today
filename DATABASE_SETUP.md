# Database Setup Instructions

## Run migrations on your Supabase

### Option 1: Using psql (recommended)

Run the schema migration:
```bash
psql "postgresql://postgres:$SERVICE_PASSWORD@supabse.binhvo.me:5432/postgres" -f supabase/migrations/001_initial_schema.sql
```

Run the seed data:
```bash
psql "postgresql://postgres:$SERVICE_PASSWORD@supabse.binhvo.me:5432/postgres" -f supabase/seed/001_sample_data.sql
```

### Option 2: Using Supabase CLI

```bash
# Set your project reference
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push

# Seed data
supabase db seed
```

### Option 3: Via Dashboard

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click **Run**
5. Repeat with `supabase/seed/001_sample_data.sql`

---

**Files created:**
- `supabase/migrations/001_initial_schema.sql` - Database tables
- `supabase/seed/001_sample_data.sql` - Sample resources

Let me know once you've run the migrations and I'll verify the connection works!
