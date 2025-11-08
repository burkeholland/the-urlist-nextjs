# The URList - Next.js

A modern URL bookmarking application built with Next.js, featuring local SQLite storage and Supabase authentication.

## Features

- 🔐 **Authentication**: Secure user authentication powered by Supabase
- 📦 **Bundle Management**: Organize links into custom bundles/collections
- 🔗 **Link Management**: Add, edit, and delete links with descriptions
- 💾 **Local Storage**: SQLite database for fast local development
- 🎨 **Modern UI**: Clean interface built with Bulma CSS
- ⚡ **Fast**: Built on Next.js 16 with React 19

## Tech Stack

- **Framework**: Next.js 16.0.1
- **UI Library**: React 19.2.0
- **CSS Framework**: Bulma 1.0.2
- **Database**: SQLite with Prisma ORM
- **Authentication**: Supabase
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 20+ installed
- A Supabase account (free tier works fine)

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

3. Set up environment variables:
   - Copy `.env.example` to `.env` (if available) or create a `.env` file
   - Update the Supabase credentials:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Setting Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings > API
4. Copy your project URL and anon key to the `.env` file
5. Enable Email authentication in Authentication > Providers

## Project Structure

```
app/
├── api/              # API routes for bundles and links
├── auth/             # Authentication pages (login/signup)
├── components/       # Reusable components
├── context/          # React Context for state management
├── dashboard/        # Main dashboard page
├── lib/              # Utility functions and clients
│   ├── prisma.ts     # Prisma client
│   └── supabase/     # Supabase client configs
├── layout.tsx        # Root layout with AuthProvider
└── page.tsx          # Landing page

prisma/
├── schema.prisma     # Database schema
└── migrations/       # Database migrations
```

## Database Schema

The app uses three main models:

- **User**: Stores user information (synced with Supabase)
- **Bundle**: Collections of links created by users
- **Link**: Individual URLs with metadata

## State Management

The application uses React Context API for state management:
- `AuthContext`: Manages authentication state and user sessions

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

