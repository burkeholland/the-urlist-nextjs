# The URList - Next.js

The URList is an application that lets you create lists of URLs that you can share with others. This is a Next.js conversion of the original Blazor application.

## Features

- Create and manage lists of links
- Share lists with custom vanity URLs
- Authentication via Supabase (GitHub, Google)
- Local SQLite database for data storage
- Automatic OpenGraph metadata fetching for links
- Responsive UI with Bulma CSS

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **SQLite** (better-sqlite3) - Local database
- **Supabase** - Authentication provider
- **Bulma CSS** - CSS framework
- **React Context** - Built-in state management

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works fine)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/burkeholland/the-urlist-nextjs.git
cd the-urlist-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API
   - Copy the Project URL and anon/public key

4. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

5. Update `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

6. Configure Supabase Authentication:
   - Go to Authentication > Providers in your Supabase dashboard
   - Enable GitHub and/or Google OAuth
   - Add your callback URL: `http://localhost:3000/api/auth/callback`

7. Run the development server:
```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database

The application uses SQLite for local data storage. The database is automatically initialized on first run. The database file (`urlist.db`) is created in the project root directory and is excluded from git.

### Schema

- **link_bundles**: Stores list metadata (vanity URL, description, user info)
- **links**: Stores individual links within bundles

## API Routes

- `GET /api/user` - Get link bundles for authenticated user
- `POST /api/links` - Create new link bundle
- `GET /api/links/[id]` - Get link bundle by ID or vanity URL
- `PUT /api/links/[id]` - Update link bundle
- `DELETE /api/links/[id]` - Delete link bundle
- `GET /api/opengraph` - Get OpenGraph metadata for a URL

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── s/                # Authenticated pages
│   │   ├── mylists/      # User's link bundles
│   │   ├── new/          # Create new bundle
│   │   └── edit/[id]/    # Edit bundle
│   ├── [vanityUrl]/      # Public list view
│   └── page.tsx          # Home page
├── components/           # React components
├── contexts/            # React contexts (Auth)
├── lib/                 # Utilities and database
└── public/              # Static assets
```

## Development

### Building

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Contributing

Pull requests are welcome! Please file an issue for anything new, and communicate in advance before doing any major work.

## License

See the [LICENSE](LICENSE) file for details.
