# Testing Guide for The URList

## Prerequisites

Before you can run and test the application, you need to:

1. **Set up Supabase Account**
   - Go to [supabase.com](https://supabase.com) and create a free account
   - Create a new project
   - Wait for the project to be provisioned (takes about 2 minutes)

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Go to your Supabase project settings
   - Navigate to Settings > API
   - Copy your Project URL and paste it as `NEXT_PUBLIC_SUPABASE_URL`
   - Copy your anon/public key and paste it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Enable Email Authentication in Supabase**
   - In your Supabase dashboard, go to Authentication > Providers
   - Ensure Email provider is enabled
   - You may want to disable email confirmation for testing (Settings > Authentication > Enable email confirmations)

## Running the Application

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Database**
   ```bash
   npx prisma migrate dev
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## Testing the Features

### 1. User Authentication

**Sign Up:**
1. Click "Sign Up" on the homepage
2. Enter your email, password, and optional name
3. Click "Sign Up" button
4. Check your email for confirmation (if email confirmation is enabled)
5. You should be redirected to the login page

**Sign In:**
1. Click "Sign In" on the homepage (or go directly to `/auth/login`)
2. Enter your email and password
3. Click "Sign In" button
4. You should be redirected to the dashboard

### 2. Bundle Management

**Create a Bundle:**
1. After signing in, you'll see the dashboard
2. Click "Create Bundle" button
3. Enter a name (required) and description (optional)
4. Click "Create"
5. The new bundle should appear in your list

**Delete a Bundle:**
1. Find the bundle you want to delete
2. Click the delete icon (×) in the card header
3. Confirm the deletion
4. The bundle and all its links will be removed

### 3. Link Management

**Add a Link:**
1. Find the bundle you want to add a link to
2. Click "Add Link" button
3. Enter:
   - Title (required) - e.g., "React Documentation"
   - URL (required) - e.g., "https://react.dev"
   - Description (optional) - e.g., "Official React docs"
4. Click "Add Link"
5. The link should appear in the bundle

**Delete a Link:**
1. Find the link in a bundle
2. Click the "Delete" button next to the link
3. Confirm the deletion
4. The link will be removed

**Open a Link:**
1. Click on any link title
2. It will open in a new tab

### 4. Sign Out

1. Click the "Sign Out" button in the navigation bar
2. You should be redirected to the homepage
3. You are now logged out

## Expected Behavior

- **Unauthenticated users** cannot access the dashboard and will be redirected to login
- **Authenticated users** see only their own bundles and links
- **Database persistence** - your data is stored in SQLite locally
- **Responsive design** - the UI should work on different screen sizes

## Troubleshooting

### "Supabase is not configured" error
- Make sure you've set up the `.env` file with valid Supabase credentials
- Restart the development server after changing `.env`

### "Unauthorized" error on API calls
- Make sure you're logged in
- Check that your session hasn't expired
- Try logging out and back in

### Database errors
- Make sure you've run `npx prisma migrate dev`
- Check that `prisma/dev.db` exists
- Try deleting the database and running migrations again

### Build errors
- Make sure all dependencies are installed: `npm install`
- Clear Next.js cache: `rm -rf .next` and rebuild

## Data Location

- **SQLite Database**: `prisma/dev.db`
- **User Authentication**: Managed by Supabase (remote)
- **User/Bundle/Link Data**: Stored in local SQLite database

## Development Tips

- Use the browser's Developer Tools to inspect network requests
- Check the console for any JavaScript errors
- The API routes return JSON responses that you can inspect
- Prisma logs all queries to the console in development mode
