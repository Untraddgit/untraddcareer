# Fix for Render Deployment Issue

## Problem
Render is running `npm run dev` instead of `npm start`, causing TypeScript compilation errors in production.

## Solution

### 1. Manual Render Configuration (Recommended)

Instead of using render.yaml, configure manually in Render dashboard:

1. **Go to your Render dashboard**
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Use these exact settings:**

   - **Name**: `untraddcareer-server`
   - **Environment**: `Node`
   - **Region**: Choose your preferred region
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid)

5. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_connection_string
   CLERK_WEBHOOK_SECRET=your_webhook_secret
   ```

### 2. Alternative: Update package.json

If Render still runs dev mode, update the server package.json:

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "seed": "ts-node src/scripts/seedQuizzes.ts"
  }
}
```

### 3. Verify Deployment

After deployment, check:
1. **Logs**: Should show "Server is running on port 10000"
2. **Health Check**: Visit `https://your-app.onrender.com/health`
3. **No TypeScript errors**: Should compile to JavaScript first

## User Flow Confirmation

✅ **Clerk Signup → MongoDB Users Collection**

When a user signs up with Clerk:
1. Clerk sends webhook to `/api/webhooks/clerk`
2. Webhook extracts user data (clerkId, email, firstName, lastName)
3. Creates/updates user in MongoDB "users" collection
4. User gets default `userType: 'student'`

## Testing the Fix

1. **Deploy with correct settings**
2. **Check Render logs** - should see production build, not ts-node
3. **Test signup flow** - new users should appear in MongoDB
4. **Verify API endpoints** work correctly

## If Still Having Issues

1. Delete the current Render service
2. Create a new one with manual configuration
3. Ensure "Root Directory" is set to `server`
4. Double-check the start command is `npm start` 