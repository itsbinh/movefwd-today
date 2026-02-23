# Deployment Checklist for Coolify

## ✅ Completed Setup

- [x] Next.js application builds successfully
- [x] Database migration completed
- [x] Dockerfile created for Coolify
- [x] Docker Compose configuration added
- [x] Next.js configured for standalone output
- [x] Environment variables documented
- [x] Deployment guide created

## 📋 Next Steps

### 1. Commit and Push Changes

```bash
# Add all new files
git add .

# Commit changes
git commit -m "Add Docker configuration for Coolify deployment"

# Push to repository
git push origin main
```

### 2. Configure Coolify

1. **Create New Application**
   - Log in to Coolify dashboard
   - Click "New Application"
   - Select your Git provider
   - Choose `movefwd-today` repository
   - Select `main` branch

2. **Configure Build Settings**
   - Dockerfile Path: `Dockerfile`
   - Docker Context: `/`
   - Container Port: `3000`

3. **Add Environment Variables**

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
   NEXT_PUBLIC_APP_URL=https://movefwd.today
   ```

4. **Configure Domain**
   - Add your domain (e.g., `movefwd.today`)
   - Update DNS records as provided by Coolify
   - Wait for SSL certificate to be issued

5. **Deploy**
   - Click "Deploy" button
   - Monitor build logs
   - Wait for deployment to complete

### 3. Verify Deployment

- [ ] Application loads at your domain
- [ ] SSL certificate is active
- [ ] Database connection works
- [ ] Mapbox maps render correctly
- [ ] No console errors

### 4. Post-Deployment

- [ ] Set up monitoring (uptime, logs)
- [ ] Configure backups
- [ ] Set up error tracking (optional)
- [ ] Update DNS if needed
- [ ] Test all features

## 🔧 Troubleshooting

### Build Issues

- Check Coolify build logs
- Verify Dockerfile syntax
- Ensure all dependencies are in package.json

### Runtime Issues

- Check container logs in Coolify
- Verify environment variables
- Test database connectivity from VPS

### SSL Issues

- Wait 5-10 minutes for certificate
- Verify DNS records
- Check Coolify logs for errors

## 📚 Documentation

- Full deployment guide: `DEPLOYMENT.md`
- Database setup: `DATABASE_SETUP.md`
- Agent instructions: `AGENTS.md`

---

**Ready to deploy?** Push your changes and follow the steps above!
