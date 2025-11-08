# Architecture Overview

## Technology Stack

### Frontend
- **Framework**: Next.js 16.0.1 with App Router
- **UI Library**: React 19.2.0
- **CSS Framework**: Bulma 1.0.2
- **Language**: TypeScript 5

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Database**: SQLite (local development)
- **ORM**: Prisma 6.19.0
- **Authentication**: Supabase Auth

### State Management
- **Pattern**: React Context API
- **Provider**: AuthContext for authentication state

## Project Structure

```
the-urlist-nextjs/
├── app/                          # Next.js App Router directory
│   ├── api/                      # API routes (server-side)
│   │   ├── bundles/              # Bundle CRUD endpoints
│   │   │   ├── route.ts          # GET (list), POST (create)
│   │   │   └── [id]/route.ts     # GET, PUT, DELETE by ID
│   │   └── links/                # Link CRUD endpoints
│   │       ├── route.ts          # POST (create)
│   │       └── [id]/route.ts     # PUT, DELETE by ID
│   ├── auth/                     # Authentication pages
│   │   ├── login/page.tsx        # Sign in page
│   │   └── signup/page.tsx       # Sign up page
│   ├── dashboard/                # Main application page
│   │   └── page.tsx              # Dashboard with bundles and links
│   ├── context/                  # React Context providers
│   │   └── AuthContext.tsx       # Authentication state management
│   ├── lib/                      # Utility functions and clients
│   │   ├── prisma.ts             # Prisma client singleton
│   │   └── supabase/             # Supabase client configuration
│   │       ├── client.ts         # Browser-side client
│   │       └── server.ts         # Server-side client
│   ├── globals.css               # Global styles (imports Bulma)
│   ├── layout.tsx                # Root layout with AuthProvider
│   └── page.tsx                  # Landing page
├── prisma/                       # Database schema and migrations
│   ├── migrations/               # Database migration files
│   ├── schema.prisma             # Prisma schema definition
│   └── dev.db                    # SQLite database file (gitignored)
├── public/                       # Static assets
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Example environment configuration
├── package.json                  # Node.js dependencies
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
└── README.md                     # Project documentation
```

## Data Flow

### Authentication Flow

1. **Sign Up:**
   ```
   User → Signup Form → AuthContext.signUp() → Supabase API → 
   User Record Created → Redirect to Login
   ```

2. **Sign In:**
   ```
   User → Login Form → AuthContext.signIn() → Supabase API → 
   Session Created → User State Updated → Redirect to Dashboard
   ```

3. **Protected Routes:**
   ```
   Page Load → useAuth() → Check User State → 
   If Not Authenticated: Redirect to Login
   If Authenticated: Render Page
   ```

### API Request Flow

1. **Create Bundle:**
   ```
   Dashboard → POST /api/bundles → Verify Auth → 
   Prisma.bundle.create() → SQLite → Response → UI Update
   ```

2. **Add Link:**
   ```
   Dashboard → POST /api/links → Verify Auth → 
   Verify Bundle Ownership → Prisma.link.create() → 
   SQLite → Response → UI Update
   ```

3. **Delete Operations:**
   ```
   Dashboard → DELETE /api/bundles/[id] → Verify Auth → 
   Verify Ownership → Prisma.bundle.delete() → 
   CASCADE deletes links → SQLite → Response → UI Update
   ```

## Database Schema

### User Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `name` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- **Relations**: One-to-Many with Bundles

### Bundle Table
- `id` (UUID, Primary Key)
- `name` (String)
- `description` (String, Optional)
- `userId` (UUID, Foreign Key → User)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- **Relations**: 
  - Many-to-One with User
  - One-to-Many with Links
  - Cascade delete to Links

### Link Table
- `id` (UUID, Primary Key)
- `url` (String)
- `title` (String)
- `description` (String, Optional)
- `bundleId` (UUID, Foreign Key → Bundle)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- **Relations**: Many-to-One with Bundle

## Security Model

### Authentication
- **Provider**: Supabase Auth
- **Method**: Email/Password
- **Session Storage**: HTTP-only cookies (managed by Supabase)
- **Token**: JWT tokens in cookies

### Authorization
- **API Routes**: All protected routes verify user session
- **Data Isolation**: Users can only access their own bundles and links
- **Ownership Verification**: Every mutation checks resource ownership

### Data Protection
- **SQL Injection**: Prevented by Prisma's parameterized queries
- **XSS**: React automatically escapes output
- **CSRF**: Next.js API routes use built-in CSRF protection
- **Secrets**: Stored in environment variables, not in code

## API Endpoints

### Bundles
- `GET /api/bundles` - List all bundles for authenticated user
- `POST /api/bundles` - Create a new bundle
  - Body: `{ name: string, description?: string }`
- `GET /api/bundles/[id]` - Get a specific bundle with links
- `PUT /api/bundles/[id]` - Update bundle details
  - Body: `{ name?: string, description?: string }`
- `DELETE /api/bundles/[id]` - Delete bundle and all its links

### Links
- `POST /api/links` - Create a new link
  - Body: `{ url: string, title: string, description?: string, bundleId: string }`
- `PUT /api/links/[id]` - Update link details
  - Body: `{ url?: string, title?: string, description?: string }`
- `DELETE /api/links/[id]` - Delete a link

## State Management

### AuthContext
**Purpose**: Manage authentication state across the application

**State:**
- `user`: Current user object or null
- `loading`: Boolean indicating auth initialization status

**Methods:**
- `signIn(email, password)`: Authenticate user
- `signUp(email, password, name?)`: Create new account
- `signOut()`: End user session

**Usage:**
```typescript
const { user, loading, signIn, signOut } = useAuth()
```

## Environment Variables

### Required
- `DATABASE_URL`: SQLite connection string (file:./dev.db)
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

### Development vs Production
- Development uses local SQLite
- Production could use PostgreSQL or other Prisma-supported databases
- Supabase configuration same for both environments

## Build and Deployment

### Development
```bash
npm install        # Install dependencies
npx prisma migrate dev  # Set up database
npm run dev        # Start dev server on port 3000
```

### Production
```bash
npm run build      # Create optimized production build
npm start          # Start production server
```

### Build Output
- Static pages: `/`, `/auth/login`, `/auth/signup`, `/dashboard`
- API routes: Server-side rendered on demand
- Assets: Optimized and bundled by Next.js

## Performance Considerations

1. **Database**: SQLite is sufficient for development and small-scale deployments
2. **Caching**: Next.js automatically caches static pages
3. **Code Splitting**: Automatic code splitting by Next.js
4. **Server Components**: Default server components reduce client bundle size
5. **Static Generation**: Authentication pages pre-rendered at build time

## Future Enhancements

Potential improvements for production:
1. Migrate to PostgreSQL for better concurrency
2. Add caching layer (Redis)
3. Implement pagination for large link collections
4. Add search and filter functionality
5. Implement link preview generation
6. Add tags and categories for links
7. Enable sharing bundles publicly
8. Add collaborative features
9. Implement analytics for link clicks
10. Add import/export functionality
