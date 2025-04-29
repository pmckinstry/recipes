'use client';

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 pt-8 pb-12">
      <div className="container mx-auto px-4">
        {children}
      </div>
    </main>
  );
} 