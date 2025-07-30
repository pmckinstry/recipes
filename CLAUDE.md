# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack (http://localhost:3000)
- `npm run build` - Build production version
- `npm start` - Start production server

### Testing
- `npm test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode (reruns on file changes)
- `npm run test:coverage` - Run tests with coverage report
- `npm test -- src/__tests__/components/RecipeCard.test.tsx` - Run specific test file
- `npm test -- --testNamePattern="RecipeCard"` - Run tests matching pattern

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

### Database Operations
- `npx prisma migrate dev` - Apply database migrations
- `npx prisma db seed` - Seed database with sample data
- `npx prisma generate` - Generate Prisma client
- `npx prisma studio` - Open Prisma Studio database browser
- `npx prisma migrate reset` - Reset database (deletes all data)

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router and Server Components
- **Language**: TypeScript with strict type checking
- **Database**: SQLite with Prisma ORM (custom client generated to src/generated/prisma)
- **Authentication**: NextAuth.js v5 (Google OAuth + email/password)
- **Styling**: Tailwind CSS v4
- **Testing**: Jest + React Testing Library

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── actions.ts         # Server actions for CRUD operations
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth.js endpoints
│   │   └── profile/       # User profile endpoints
│   ├── auth/              # Authentication pages
│   ├── labels/            # Label management pages
│   ├── recipes/           # Recipe management pages
│   └── help/              # Help documentation
├── components/            # Reusable React components
├── lib/                   # Utility functions and configurations
│   ├── auth.ts           # NextAuth.js configuration
│   └── db.ts             # Prisma client setup
├── types/                 # TypeScript type definitions
└── __tests__/            # Test files
    ├── actions/          # Server action tests
    └── components/       # Component tests
```

### Database Schema
- **User**: Authentication and user data
- **Recipe**: Core recipe entity with title, author, instructions, rating
- **Ingredient**: Recipe ingredients with quantity, unit, name
- **Label**: Organizational tags with colors
- **RecipeLabel**: Many-to-many relationship between recipes and labels
- **Account/Session**: NextAuth.js authentication tables

### Authentication Flow
Uses NextAuth.js v5 with:
- Google OAuth provider
- Email/password credentials provider
- JWT session strategy
- Custom signin page at `/auth/signin`
- User ownership model (users can only access their own recipes)

### Server Actions Pattern
The app uses Next.js Server Actions (in `src/app/actions.ts`) for all CRUD operations:
- All actions include authentication checks via `auth()`
- User ownership validation for data access
- Optimistic updates on the client side
- Type-safe operations with Prisma

### Key Components
- **RecipeCard**: Displays recipe information with labels and ratings
- **RecipeForm**: Form for creating/editing recipes with ingredients and label selection
- **TopNav**: Main navigation with authentication state
- **MainContent**: Layout wrapper for pages

## Development Guidelines

### Adding New Features
1. Always check authentication first in server actions
2. Validate user ownership for data access
3. Use TypeScript interfaces from `src/types/recipe.ts`
4. Include tests for both components and server actions
5. Follow existing patterns for database queries with Prisma includes

### Testing Strategy
- Component tests in `src/__tests__/components/`
- Server action tests in `src/__tests__/actions/`
- Use React Testing Library for component testing
- Mock server actions in component tests
- Test both success and error scenarios

### Database Changes
1. Modify `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name descriptive_name`
3. Update TypeScript types if needed
4. Regenerate client with `npx prisma generate`
5. Update seed file if needed

### Environment Setup
Required environment variables in `.env.local`:
- `DATABASE_URL="file:./dev.db"`
- `NEXTAUTH_URL="http://localhost:3000"`
- `NEXTAUTH_SECRET="generated-secret"`
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (optional)

### Code Quality Checklist
Always run before committing:
1. `npm run type-check` - TypeScript validation
2. `npm run lint` - ESLint validation
3. `npm run format:check` - Prettier formatting
4. `npm test` - All tests passing

### Common Patterns
- Server Components for data fetching and initial render
- Client Components for interactive elements (use "use client")
- Server Actions for mutations with proper error handling
- Prisma includes for related data (ingredients, labels, user info)
- User ownership validation in all mutation actions