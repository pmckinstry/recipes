# Recipe App

A Next.js recipe management application with authentication, built with TypeScript, Tailwind CSS, and Prisma.

## Features

- 🔐 **Authentication** - Sign in with Google OAuth or email/password
- 📝 **Recipe Management** - Create, read, update, and delete recipes
- 🏷️ **Label System** - Organize recipes with custom labels and colors
- 👤 **User Ownership** - Users can only manage their own recipes
- 🎨 **Modern UI** - Beautiful interface built with Tailwind CSS
- 🗄️ **Database** - SQLite with Prisma ORM
- ⚡ **Fast** - Built with Next.js 15 and App Router
- 🧪 **Tested** - Comprehensive test suite with Jest and React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository:**

```bash
git clone <your-repo-url>
cd recipes
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**Note:** Generate a secure `NEXTAUTH_SECRET` using:

```bash
openssl rand -base64 32
```

4. **Set up the database:**

```bash
# Run database migrations to create tables
npx prisma migrate dev

# Seed the database with sample data
npx prisma db seed

# Generate the Prisma client
npx prisma generate
```

**What these commands do:**

- `npx prisma migrate dev` - Creates the database schema and applies all migrations
- `npx prisma db seed` - Populates the database with sample recipes, ingredients, and labels
- `npx prisma generate` - Generates the Prisma client for TypeScript support

5. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Database Setup Details

The application uses SQLite with Prisma ORM. The database file is created at `prisma/dev.db` and contains the following tables:

- **User** - User accounts and authentication
- **Recipe** - Recipe information (title, author, instructions, rating)
- **Ingredient** - Recipe ingredients with quantities and units
- **Label** - Custom labels for organizing recipes
- **RecipeLabel** - Many-to-many relationship between recipes and labels
- **Account** - OAuth account connections (NextAuth.js)
- **Session** - User sessions (NextAuth.js)
- **VerificationToken** - Email verification tokens (NextAuth.js)

### Sample Data

The seed script creates:

- 2 sample recipes with ingredients
- 8 predefined labels (Dessert, Quick, Healthy, etc.)
- Sample user data for testing

## Authentication Setup

### Google OAuth (Recommended)

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Add `http://localhost:3000/api/auth/callback/google` to the authorized redirect URIs
6. Copy the Client ID and Client Secret to your `.env.local` file

### Email/Password Authentication

The app also supports email/password authentication. Users can sign up and sign in with their email and password.

## Development

### Running Tests

The project includes a comprehensive test suite using Jest and React Testing Library.

#### Test Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (reruns on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- src/__tests__/components/RecipeCard.test.tsx

# Run tests matching a pattern
npm test -- --testNamePattern="RecipeCard"

# Run tests in verbose mode
npm test -- --verbose
```

#### Test Structure

The test suite is organized as follows:

```
src/__tests__/
├── actions/           # Server action tests
│   ├── recipe-actions.test.ts
│   └── label-actions.test.ts
└── components/        # Component tests
    ├── RecipeCard.test.tsx
    ├── RecipeForm.test.tsx
    └── MainContent.test.tsx
```

#### What's Tested

**Component Tests:**
- **RecipeCard** - Recipe display component rendering and interactions
- **RecipeForm** - Form validation, submission, and user interactions
- **MainContent** - Main page layout and recipe listing

**Server Action Tests:**
- **Recipe Actions** - CRUD operations for recipes (create, read, update, delete)
- **Label Actions** - CRUD operations for labels (create, read, update, delete)

#### Test Coverage

The test suite covers:
- ✅ **Component rendering** - All components render correctly
- ✅ **User interactions** - Form submissions, button clicks, navigation
- ✅ **Server actions** - Database operations and authentication checks
- ✅ **Error handling** - Invalid inputs, authentication failures
- ✅ **Edge cases** - Empty states, loading states, validation errors

#### Writing Tests

**Component Test Example:**
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecipeCard from '@/components/RecipeCard';

describe('RecipeCard', () => {
  it('displays recipe information correctly', () => {
    const recipe = {
      id: '1',
      title: 'Test Recipe',
      author: 'Test Author',
      rating: 5,
      // ... other properties
    };

    render(<RecipeCard recipe={recipe} />);
    
    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });
});
```

**Server Action Test Example:**
```typescript
import { createRecipe } from '@/app/actions';

// Mock the entire actions module
jest.mock('@/app/actions', () => ({
  createRecipe: jest.fn(),
}));

describe('Recipe Actions', () => {
  it('creates a recipe successfully', async () => {
    const mockCreateRecipe = createRecipe as jest.MockedFunction<typeof createRecipe>;
    const recipeData = { title: 'New Recipe', author: 'Author' };
    
    mockCreateRecipe.mockResolvedValue({ id: '1', ...recipeData });
    
    const result = await createRecipe(recipeData);
    expect(result.title).toBe('New Recipe');
  });
});
```

#### Test Configuration

The project uses:
- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers
- **@testing-library/user-event** - User interaction simulation

#### Debugging Tests

```bash
# Run tests with detailed output
npm test -- --verbose

# Run a single test file with debugging
npm test -- src/__tests__/components/RecipeCard.test.tsx --verbose

# Run tests and watch for changes
npm run test:watch

# Generate coverage report
npm run test:coverage
```

#### Continuous Integration

Tests are automatically run in CI/CD pipelines:
- All tests must pass before merging
- Coverage reports are generated
- Test results are reported in pull requests

### Code Quality

```bash
# Format code with Prettier
npm run format

# Check code formatting
npm run format:check

# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Run TypeScript type checking
npm run type-check
```

### Database Management

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database (deletes all data)
npx prisma migrate reset

# Create a new migration
npx prisma migrate dev --name migration_name

# Deploy migrations to production
npx prisma migrate deploy
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   │   ├── auth/       # NextAuth.js authentication
│   │   └── profile/    # User profile endpoints
│   ├── auth/           # Authentication pages
│   ├── labels/         # Label management pages
│   ├── recipes/        # Recipe management pages
│   └── help/           # Help and documentation
├── components/         # React components
├── lib/               # Utility functions and configurations
├── types/             # TypeScript type definitions
└── __tests__/         # Test files
    ├── actions/       # Server action tests
    └── components/    # Component tests
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Prisma** - Database ORM
- **NextAuth.js** - Authentication library
- **SQLite** - Database
- **Jest** - Testing framework
- **React Testing Library** - Component testing utilities
- **Prettier** - Code formatting

## Troubleshooting

### Common Issues

1. **Database connection errors:**
   - Ensure you've run `npx prisma migrate dev`
   - Check that `.env.local` has the correct `DATABASE_URL`
   - Verify the database file exists at `prisma/dev.db`

2. **Authentication not working:**
   - Check that `NEXTAUTH_SECRET` is set in `.env.local`
   - Verify Google OAuth credentials if using Google sign-in
   - Ensure `NEXTAUTH_URL` matches your development URL

3. **Prisma client errors:**
   - Run `npx prisma generate` after schema changes
   - Restart the development server after generating the client

4. **Test failures:**
   - Ensure all dependencies are installed: `npm install`
   - Check that Jest configuration is correct
   - Verify that test environment variables are set

5. **Formatting issues:**
   - Run `npm run format` to format all files
   - Check `npm run format:check` to see what needs formatting
   - Ensure your editor is configured to use Prettier

### Reset Everything

If you need to start fresh:

```bash
# Remove database and node_modules
rm -rf prisma/dev.db node_modules

# Reinstall dependencies
npm install

# Recreate database
npx prisma migrate dev
npx prisma db seed
npx prisma generate

# Start development server
npm run dev
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Prettier Documentation](https://prettier.io/docs/en/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
