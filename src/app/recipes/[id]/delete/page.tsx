'use client';

import { Recipe } from '@/types/recipe';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import { getRecipe, deleteRecipe } from '@/app/actions';
import MainContent from '@/components/MainContent';
import { useSession } from 'next-auth/react';

interface DeleteRecipePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DeleteRecipePage({ params }: DeleteRecipePageProps) {
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { id } = use(params);
  const { data: session, status } = useSession();

  useEffect(() => {
    async function loadRecipe() {
      try {
        const data = await getRecipe(id);
        if (!data) {
          setError('Recipe not found');
          return;
        }
        setRecipe(data);
      } catch (err) {
        setError('Failed to load recipe');
        console.error('Error loading recipe:', err);
      } finally {
        setLoading(false);
      }
    }

    loadRecipe();
  }, [id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteRecipe(id);
      router.push('/recipes');
    } catch (err) {
      setError('Failed to delete recipe');
      console.error('Error deleting recipe:', err);
      setIsDeleting(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <MainContent>
        <div className="text-center">
          Loading...
        </div>
      </MainContent>
    );
  }

  if (error || !recipe) {
    return (
      <MainContent>
        <div className="text-center text-red-600">
          {error || 'Recipe not found'}
        </div>
      </MainContent>
    );
  }

  // Check if user is authenticated and owns the recipe
  if (!session) {
    return (
      <MainContent>
        <div className="text-center text-red-600">
          You must be logged in to delete recipes.
        </div>
      </MainContent>
    );
  }

  if (!recipe.user || recipe.user.id !== session.user?.id) {
    return (
      <MainContent>
        <div className="text-center text-red-600">
          You can only delete your own recipes.
        </div>
      </MainContent>
    );
  }

  return (
    <MainContent>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Delete Recipe</h1>
          <Link
            href={`/recipes/${id}`}
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Recipe
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{recipe.title}</h2>
          <p className="text-gray-600 mb-4">By {recipe.author}</p>
          <p className="text-red-600 mb-6">
            Are you sure you want to delete this recipe? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-4">
            <Link
              href={`/recipes/${id}`}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 ${
                isDeleting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isDeleting ? 'Deleting...' : 'Delete Recipe'}
            </button>
          </div>
        </div>
      </div>
    </MainContent>
  );
} 