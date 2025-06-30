'use client';

import RecipeForm from '@/components/RecipeForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Recipe } from '@/types/recipe';
import { createRecipe } from '@/app/actions';
import { useSession } from 'next-auth/react';
import MainContent from '@/components/MainContent';

export default function NewRecipePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSubmit = async (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createRecipe(recipe);
      router.push('/recipes');
    } catch (error) {
      console.error('Error creating recipe:', error);
      // You might want to show an error message to the user here
    }
  };

  if (status === 'loading') {
    return (
      <MainContent>
        <div className="text-center">
          Loading...
        </div>
      </MainContent>
    );
  }

  if (!session) {
    return (
      <MainContent>
        <div className="text-center text-red-600">
          You must be logged in to create recipes.
        </div>
      </MainContent>
    );
  }

  return (
    <MainContent>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Add New Recipe</h1>
        <Link
          href="/recipes"
          className="text-indigo-600 hover:text-indigo-800"
        >
          ← Back to Recipes
        </Link>
      </div>
      <RecipeForm
        onSubmit={handleSubmit}
        submitLabel="Create Recipe"
        initialData={{ author: session.user?.name || '' }}
      />
    </MainContent>
  );
} 