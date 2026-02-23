# Coolify Deployment Guide

This guide will help you deploy Movefwd.today to your VPS using Coolify.

## Prerequisites

- VPS with Coolify installed
- Domain configured (e.g., movefwd.today)
- Supabase instance running
- Mapbox token configured

## Environment Variables

Before deploying, make sure you have these environment variables set in Coolify:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://supabse.binhvo.me:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_APP_URL=https://movefwd.today
```

## Deployment Steps

### 1. Push Code to Git Repository

First, commit and push your code to a Git repository (GitHub, GitLab, or Bitbucket):

```bash
git add .
git commit -m "Add Docker configuration for Coolify deployment"
git push origin main
```

### 2. Create New Application in Coolify

1. Log in to your Coolify dashboard
2. Click **"New Application"**
3. Select your Git provider
4. Choose the repository
5. Select the branch (usually `main`)

### 3. Configure Application Settings

**Build Settings:**

- **Dockerfile Path:** `Dockerfile`
- **Docker Context:** `/`
- **Build Command:** (leave empty - handled by Dockerfile)

**Environment Variables:**
Add all the environment variables listed above in the Coolify environment variables section.

**Port:**

- **Container Port:** `3000`

### 4. Configure Domain

1. Go to the **Domains** tab in Coolify
2. Add your domain (e.g., `movefwd.today`)
3. Coolify will provide you with DNS records to add
4. Update your domain's DNS settings with the provided records

### 5. Deploy

Click the **Deploy** button in Coolify. The deployment process will:

1. Pull the latest code from Git
2. Build the Docker image
3. Start the container
4. Configure SSL certificates automatically

## Local Testing with Docker

Before deploying to Coolify, you can test locally:

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build and run manually
docker build -t movefwd-today .
docker run -p 3000:3000 --env-file .env.local movefwd-today
```

## Troubleshooting

### Build Fails

- Check the build logs in Coolify
- Ensure all dependencies are in `package.json`
- Verify the Dockerfile syntax

### Application Won't Start

- Check container logs in Coolify
- Verify all environment variables are set
- Ensure the port (3000) is not blocked

### Database Connection Issues

- Verify Supabase URL is accessible from the VPS
- Check if the anon key is correct
- Ensure Supabase allows connections from your VPS IP

### SSL Certificate Issues

- Wait a few minutes for Let's Encrypt to issue the certificate
- Verify DNS records are correctly configured
- Check Coolify logs for certificate errors

## Monitoring

- View logs in Coolify dashboard
- Monitor resource usage (CPU, Memory, Disk)
- Set up uptime monitoring (e.g., UptimeRobot)

## Updates

To update the application:

1. Push changes to Git
2. Click **Deploy** in Coolify
3. Coolify will automatically pull and deploy the latest changes

## Security Notes

- Never commit `.env.local` to Git
- Use strong, unique secrets
- Keep dependencies updated
- Enable automatic security updates on your VPS
- Regularly backup your database

---

**Need help?** Check the [Coolify Documentation](https://coolify.io/docs)
