'use client';

import { Recipe } from '@/types/recipe';
import RecipeForm from '@/components/RecipeForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import { getRecipe, updateRecipe } from '@/app/actions';
import MainContent from '@/components/MainContent';
import { useSession } from 'next-auth/react';

interface EditRecipePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditRecipePage({ params }: EditRecipePageProps) {
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const handleSubmit = async (
    updatedRecipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      await updateRecipe(id, updatedRecipe);
      router.push(`/recipes/${id}`);
    } catch (err) {
      setError('Failed to update recipe');
      console.error('Error updating recipe:', err);
    }
  };

  if (loading || status === 'loading') {
    return (
      <MainContent>
        <div className='text-center'>Loading...</div>
      </MainContent>
    );
  }

  if (error || !recipe) {
    return (
      <MainContent>
        <div className='text-center text-red-600'>
          {error || 'Recipe not found'}
        </div>
      </MainContent>
    );
  }

  // Check if user is authenticated and owns the recipe
  if (!session) {
    return (
      <MainContent>
        <div className='text-center text-red-600'>
          You must be logged in to edit recipes.
        </div>
      </MainContent>
    );
  }

  if (!recipe.user || recipe.user.id !== session.user?.id) {
    return (
      <MainContent>
        <div className='text-center text-red-600'>
          You can only edit your own recipes.
        </div>
      </MainContent>
    );
  }

  return (
    <MainContent>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-4xl font-bold text-gray-900'>Edit Recipe</h1>
        <Link
          href={`/recipes/${id}`}
          className='text-indigo-600 hover:text-indigo-800'
        >
          ← Back to Recipe
        </Link>
      </div>
      <RecipeForm
        initialData={recipe}
        onSubmit={handleSubmit}
        submitLabel='Update Recipe'
      />
    </MainContent>
  );
}
