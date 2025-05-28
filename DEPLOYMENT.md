# Deployment Guide for UntraddCareer

## Issues Fixed

### 1. TypeScript Compilation Errors
- ✅ Added missing `userType` property to `IUser` interface
- ✅ Fixed Express Request type declaration for `req.user`
- ✅ Fixed error handling in webhook routes
- ✅ Added missing `svix` dependency to server

### 2. Missing Routes
- ✅ Added missing `/api/users` route to server
- ✅ Fixed port inconsistencies between client configs

### 3. CORS Configuration
- ✅ Updated CORS to include proper Vercel and Render URLs

## Environment Variables

### Client (Vercel)
Create these environment variables in your Vercel dashboard:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_API_URL=https://your-server-url.onrender.com/api
```

### Server (Render)
Create these environment variables in your Render dashboard:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NODE_ENV=production
PORT=10000
```

## Deployment Steps

### 1. Server Deployment (Render)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use these settings:
   - **Build Command**: `cd server && npm install && npm run build`
   - **Start Command**: `cd server && npm start`
   - **Environment**: Node
   - **Plan**: Free (or paid for better performance)

4. Add the environment variables listed above

### 2. Client Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set the root directory to `client`
3. Vercel will auto-detect it's a Vite project
4. Add the environment variables listed above

### 3. Webhook Configuration (Clerk)

1. Go to your Clerk Dashboard
2. Navigate to Webhooks
3. Add a new webhook endpoint: `https://your-server-url.onrender.com/api/webhooks/clerk`
4. Select these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Copy the webhook secret and add it to your Render environment variables

## Common Issues & Solutions

### 1. CORS Errors
- Ensure your Vercel URL is added to the `allowedOrigins` array in `server/src/index.ts`
- Check that the `VITE_API_URL` environment variable is correctly set

### 2. 404 Errors on API Calls
- Verify the server is running and accessible
- Check that all routes are properly mounted in `server/src/index.ts`
- Ensure the API URL in client matches your server URL

### 3. Authentication Issues
- Verify Clerk publishable key is set correctly
- Check that webhook secret matches between Clerk and Render
- Ensure webhook endpoint is accessible

### 4. Database Connection Issues
- Verify MongoDB URI is correct and accessible
- Check that your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0)

## Testing Deployment

1. **Health Check**: Visit `https://your-server-url.onrender.com/health`
2. **API Root**: Visit `https://your-server-url.onrender.com/`
3. **Client**: Visit your Vercel URL and test authentication

## Build Commands Summary

### Server
```bash
cd server
npm install
npm run build
npm start
```

### Client
```bash
cd client
npm install
npm run build
```

## Port Configuration

- **Development**: Server runs on port 5000, Client on port 5173
- **Production**: Server runs on port 10000 (Render), Client served by Vercel CDN 