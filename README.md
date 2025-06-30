# Recipe App

A Next.js recipe management application with authentication, built with TypeScript, Tailwind CSS, and Prisma.

## Features

- 🔐 **Authentication** - Sign in with Google OAuth or email/password
- 📝 **Recipe Management** - Create, read, update, and delete recipes
- 👤 **User Ownership** - Users can only manage their own recipes
- 🎨 **Modern UI** - Beautiful interface built with Tailwind CSS
- 🗄️ **Database** - SQLite with Prisma ORM
- ⚡ **Fast** - Built with Next.js 15 and App Router

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd recipes
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Copy the example file and adjust the values:
```bash
cp .env.example .env.local
```
`.env.example` contains all required environment variables:
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

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/auth/       # NextAuth.js API routes
│   ├── auth/           # Authentication pages
│   └── recipes/        # Recipe management pages
├── components/         # React components
├── lib/               # Utility functions and configurations
└── types/             # TypeScript type definitions
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Prisma** - Database ORM
- **NextAuth.js** - Authentication library
- **SQLite** - Database

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
