'use client';

import RecipeForm from '@/components/RecipeForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Recipe } from '@/types/recipe';
import { createRecipe } from '@/app/actions';

export default function NewRecipePage() {
  const router = useRouter();

  const handleSubmit = async (recipe: Omit<Recipe, 'id'>) => {
    try {
      await createRecipe(recipe);
      router.push('/recipes');
    } catch (error) {
      console.error('Error creating recipe:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Add New Recipe</h1>
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
        />
      </div>
    </main>
  );
} 