# Deployment Guide - TOKİCheck

This guide covers deploying TOKİCheck to Vercel and other platforms.

## 🚀 Deploy to Vercel (Recommended)

Vercel is the recommended platform for deploying TOKİCheck as it's optimized for Next.js applications.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/measses/TokiCheck)

### Manual Deployment

#### Step 1: Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..." → "Project"**
3. Import your GitHub repository: `measses/TokiCheck`

#### Step 2: Configure Build Settings

Vercel should auto-detect these settings, but verify:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (leave empty, monorepo handled automatically)
- **Build Command**: `npm run vercel-build` (or leave default)
- **Output Directory**: `apps/web/.next` (auto-detected)
- **Install Command**: `npm install`

#### Step 3: Environment Variables (Optional)

Currently, no environment variables are required for basic deployment.

For future features, you may add:
```env
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

#### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Your app will be live at `https://your-project.vercel.app`

### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `tokicheck.com`)
3. Follow DNS configuration instructions
4. SSL certificate is automatically provisioned

---

## 🐳 Docker Deployment (Alternative)

For self-hosting, you can use Docker.

### Create Dockerfile

```dockerfile
# Dockerfile (root)
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
COPY packages ./packages
COPY apps/web/package*.json ./apps/web/
RUN npm ci

# Build packages
FROM base AS build-packages
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./
COPY packages ./packages
COPY tsconfig.json ./
RUN npm run build:packages

# Build app
FROM base AS build-app
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build-packages /app/packages ./packages
COPY apps/web ./apps/web
COPY package*.json ./
RUN npm run build --workspace=apps/web

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build-app /app/apps/web/public ./apps/web/public
COPY --from=build-app --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=build-app --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "apps/web/server.js"]
```

### Build and Run

```bash
# Build image
docker build -t tokicheck .

# Run container
docker run -p 3000:3000 tokicheck
```

---

## 📦 Static Export (Not Recommended)

TOKİCheck uses server-side features (i18n routing), so static export is not recommended. However, for limited deployments:

### Update next.config.js

```javascript
module.exports = {
  output: 'export',
  images: { unoptimized: true },
  // ... other config
};
```

### Build

```bash
npm run build
# Output in apps/web/out/
```

### Deploy to Static Hosts

- **Netlify**: Drag `apps/web/out/` folder
- **GitHub Pages**: Push to `gh-pages` branch
- **AWS S3**: Upload to S3 bucket with static website hosting

---

## 🔧 Environment Variables Reference

### Production Variables

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://tokicheck.vercel.app

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=tokicheck.com

# Feature Flags
NEXT_PUBLIC_ENABLE_CHARTS=true
NEXT_PUBLIC_ENABLE_EXPORT=true
```

### Development Variables

```env
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚦 Deployment Checklist

Before deploying to production:

- [ ] All tests pass (`npm test`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] Environment variables configured
- [ ] Custom domain DNS configured (if applicable)
- [ ] Analytics setup (if using)
- [ ] Error monitoring setup (Sentry, etc.)

---

## 🐛 Troubleshooting

### Build Fails with "Module not found"

**Solution**: Ensure packages are built first:
```bash
npm run build:packages
npm run build --workspace=apps/web
```

### Vercel Build Timeout

**Solution**: Optimize build:
- Check `vercel.json` configuration
- Ensure `outputFileTracingRoot` is set in `next.config.js`

### i18n Routing Not Working

**Solution**:
- Verify `middleware.ts` is in the correct location
- Check `next.config.js` doesn't have conflicting i18n config

### Module Resolution Errors

**Solution**: Verify workspace configuration:
```json
// package.json
"workspaces": [
  "apps/*",
  "packages/*"
]
```

---

## 📊 Performance Optimization

### Vercel Edge Functions

For better performance, consider using Edge Runtime:

```typescript
// apps/web/src/app/api/calculate/route.ts
export const runtime = 'edge';
```

### Caching Strategy

- Static pages: Cached indefinitely
- Dynamic routes: Revalidate every 60 seconds
- API routes: No caching (real-time calculations)

---

## 🔒 Security Considerations

- No sensitive data stored (all calculations client-side)
- HTTPS enforced on production
- CSP headers configured
- Rate limiting recommended for API routes (future)

---

## 📈 Monitoring

Recommended monitoring tools:

- **Vercel Analytics**: Built-in, free tier available
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Plausible/Umami**: Privacy-friendly analytics

---

## 🆘 Support

If you encounter deployment issues:

1. Check [GitHub Issues](https://github.com/measses/TokiCheck/issues)
2. Review [Vercel Documentation](https://vercel.com/docs)
3. Open a new issue with deployment logs

---

**Last Updated**: 2025-10-29
