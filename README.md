# The URList - Next.js

A modern link sharing application built with Next.js, featuring local SQLite storage and OAuth authentication. Share collections of links with custom vanity URLs.

## Features

- 🔗 **Link Bundles**: Create and share collections of links with custom vanity URLs
- 🔐 **OAuth Authentication**: Sign in with GitHub, Google, or Twitter/X
- 💾 **Local SQLite Database**: All data stored locally using better-sqlite3
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Built with Bulma CSS for mobile and desktop
- 🔍 **Open Graph Metadata**: Automatically fetch titles, descriptions, and images from URLs
- ✅ **Real-time Validation**: Instant feedback on vanity URL availability
- 🔒 **Protected Routes**: Secure user-specific pages and API endpoints

## Technology Stack

- **Framework**: Next.js 16 with React 19
- **Database**: SQLite with better-sqlite3
- **Authentication**: NextAuth.js v5
- **Styling**: Bulma CSS
- **Language**: TypeScript
- **Image Handling**: Next.js Image optimization

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/burkeholland/the-urlist-nextjs.git
cd the-urlist-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
cp .env.local.example .env.local
```

4. Configure OAuth providers in `.env.local`:

#### Generate NextAuth Secret
```bash
openssl rand -base64 32
```
Add this to `NEXTAUTH_SECRET` in `.env.local`

#### GitHub OAuth
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
3. Copy Client ID and Client Secret to `.env.local`

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Client Secret to `.env.local`

#### Twitter/X OAuth (Optional)
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create an app and enable OAuth 2.0
3. Add callback URL: `http://localhost:3000/api/auth/callback/twitter`
4. Copy Client ID and Client Secret to `.env.local`

### Running the Application

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## Database

The SQLite database is automatically initialized on first run. The database file is created at `data/urlist.db`.

### Schema

- **users**: User accounts from OAuth providers
- **link_bundles**: Collections of links with vanity URLs
- **links**: Individual links within bundles

To reset the database, simply delete the `data/urlist.db` file.

## Usage

### Creating a Link Bundle

1. Sign in with your preferred OAuth provider
2. Click "Create New List" or "New List" in the navigation
3. Enter a unique vanity URL (e.g., `my-awesome-links`)
4. Add a title and description
5. Add links:
   - Enter the URL
   - Click "Fetch Info" to automatically get metadata
   - Or manually enter title and description
6. Click "Create List"

### Sharing a Link Bundle

After creating a bundle, share the URL: `http://localhost:3000/your-vanity-url`

### Managing Your Bundles

- View all your bundles at `/s/mylists`
- Edit a bundle by clicking "Edit" on any bundle card
- Delete a bundle by clicking "Delete" (confirmation required)

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth.js authentication
│   │   ├── links/        # Link bundle CRUD operations
│   │   ├── oginfo/       # Open Graph metadata fetching
│   │   ├── qrcode/       # QR code generation
│   │   └── user/         # User data endpoints
│   ├── s/                # Protected pages
│   │   ├── new/          # Create new bundle
│   │   ├── edit/         # Edit bundle
│   │   ├── mylists/      # User's bundles
│   │   └── terms/        # Terms of service
│   ├── [vanityUrl]/      # Public share pages
│   └── layout.tsx        # Root layout with providers
├── components/           # React components
│   ├── AuthProvider.tsx
│   ├── LinkBundleForm.tsx
│   ├── LinkItem.tsx
│   ├── NavBar.tsx
│   └── ThemeContext.tsx
├── lib/                  # Core libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # SQLite connection
│   ├── queries.ts        # Database queries
│   └── types.ts          # TypeScript types
├── db/
│   └── schema.sql        # Database schema
└── data/                 # SQLite database (gitignored)
```

## API Endpoints

### Public Endpoints
- `GET /api/links/[vanityUrl]` - Fetch a public link bundle

### Protected Endpoints (require authentication)
- `POST /api/links` - Create a new link bundle
- `PUT /api/links/[vanityUrl]` - Update a link bundle
- `DELETE /api/links/[vanityUrl]` - Delete a link bundle
- `GET /api/user` - Get user's link bundles

### Utility Endpoints
- `POST /api/oginfo` - Fetch Open Graph metadata for a URL
- `GET /api/qrcode?url=<url>` - Generate QR code for a URL

## Development

### Linting
```bash
npm run lint
```

### Building
```bash
npm run build
```

## Future Enhancements

- [ ] Drag-and-drop link reordering
- [ ] QR code generation with actual QR library
- [ ] localStorage persistence for draft bundles
- [ ] Social media sharing buttons
- [ ] Analytics and link tracking
- [ ] Import/export functionality
- [ ] Link bundle templates
- [ ] Collaborative editing
- [ ] Custom themes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Bulma](https://bulma.io/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)
- Database powered by [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
