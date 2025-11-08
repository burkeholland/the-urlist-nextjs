# Setup and Testing Guide

## Quick Start for Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up
3. Go to **Project Settings** > **API**
4. Copy your **Project URL** and **anon/public key**

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Configure Supabase Authentication

1. Go to **Authentication** > **Providers** in your Supabase dashboard
2. Enable **GitHub** provider:
   - Create a GitHub OAuth App at https://github.com/settings/developers
   - Set callback URL to: `https://your-project-ref.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase
3. Enable **Google** provider:
   - Create OAuth credentials at https://console.cloud.google.com/apis/credentials
   - Set authorized redirect URI to: `https://your-project-ref.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase
4. Add your local development URL to **Site URL** in Supabase Auth settings:
   - Add `http://localhost:3000` to Redirect URLs

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing Checklist

### Authentication Flow
- [ ] Click "Sign In with GitHub" - should redirect to GitHub OAuth
- [ ] Complete GitHub authentication - should redirect back and show user as logged in
- [ ] Click "Sign In with Google" - should redirect to Google OAuth
- [ ] Complete Google authentication - should redirect back and show user as logged in
- [ ] Click "Sign Out" - should log user out and show sign in buttons again

### Create New List
- [ ] On home page, enter a URL in the "Get Started" section
- [ ] Should fetch metadata and redirect to /s/new
- [ ] Add more links if desired
- [ ] Enter a custom vanity URL (optional)
- [ ] Enter a description (optional)
- [ ] Click "Save List" (must be signed in)
- [ ] Should redirect to public view of the list

### View My Lists
- [ ] Click "My Lists" in navigation
- [ ] Should show all lists created by the authenticated user
- [ ] Click on a list card - should navigate to edit page

### Edit List
- [ ] From My Lists, click on a list
- [ ] Should load with existing data
- [ ] Modify vanity URL, description, or links
- [ ] Click "Save Changes" - should update successfully
- [ ] Click "Delete List" - should confirm and delete

### Public Viewing
- [ ] Access a list via its vanity URL: `http://localhost:3000/[vanityUrl]`
- [ ] Should display all links without authentication
- [ ] Click "Share" button - should copy URL to clipboard
- [ ] All links should be clickable and open in new tab

### Database
- [ ] After creating lists, check that `urlist.db` file is created in project root
- [ ] Database should persist between server restarts

## Common Issues

### "supabaseUrl is required" error
- Make sure `.env.local` exists with valid Supabase credentials
- Restart the dev server after creating `.env.local`

### OAuth redirect loop
- Verify redirect URLs are correctly configured in Supabase dashboard
- Check that callback URL is: `http://localhost:3000/api/auth/callback`

### Database locked error
- Close any other processes accessing the database
- Restart the dev server

### Links not fetching metadata
- OpenGraph fetching may fail for some sites (CORS, no meta tags, etc.)
- Link will still be added with URL as title
- Timeout is set to 10 seconds per request

## Production Deployment

For production deployment:

1. Update `.env.local` values for production
2. Configure production redirect URLs in Supabase
3. Consider using a cloud database instead of SQLite
4. Set up proper error logging
5. Configure CORS and CSP headers as needed
