'use client';

import { Recipe } from '@/types/recipe';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import { getRecipe } from '@/app/actions';
import MainContent from '@/components/MainContent';
import { useSession } from 'next-auth/react';

// Common fractions and their decimal values
const COMMON_FRACTIONS: { [key: number]: string } = {
  0.25: '1/4',
  0.5: '1/2',
  0.75: '3/4',
  0.333: '1/3',
  0.666: '2/3',
  0.125: '1/8',
  0.375: '3/8',
  0.625: '5/8',
  0.875: '7/8',
};

const decimalToFraction = (value: number): string => {
  // Check if it's a common fraction
  const rounded = Math.round(value * 1000) / 1000;
  if (COMMON_FRACTIONS[rounded]) {
    return COMMON_FRACTIONS[rounded];
  }

  // If not a common fraction, return the decimal as a string
  return value.toString();
};

interface RecipePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function RecipePage({ params }: RecipePageProps) {
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

  const isOwner = session && recipe.user && recipe.user.id === session.user?.id;

  return (
    <MainContent>
      <div className='max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-900'>{recipe.title}</h1>
          <div className='space-x-4'>
            <Link
              href='/recipes'
              className='text-indigo-600 hover:text-indigo-800'
            >
              ← Back to Recipes
            </Link>
            {isOwner && (
              <>
                <Link
                  href={`/recipes/${id}/edit`}
                  className='text-indigo-600 hover:text-indigo-800'
                >
                  Edit
                </Link>
                <Link
                  href={`/recipes/${id}/delete`}
                  className='text-red-600 hover:text-red-800'
                >
                  Delete
                </Link>
              </>
            )}
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
          <div className='mb-6'>
            <h2 className='text-xl font-semibold mb-2 text-gray-900'>Author</h2>
            <p className='text-gray-600'>{recipe.author}</p>
          </div>

          <div className='mb-6'>
            <h2 className='text-xl font-semibold mb-2 text-gray-900'>
              Ingredients
            </h2>
            <ul className='space-y-2'>
              {recipe.ingredients.map(ingredient => (
                <li key={ingredient.id} className='text-gray-600'>
                  {decimalToFraction(ingredient.quantity)} {ingredient.unit}{' '}
                  {ingredient.name}
                </li>
              ))}
            </ul>
          </div>

          <div className='mb-6'>
            <h2 className='text-xl font-semibold mb-2 text-gray-900'>
              Instructions
            </h2>
            <div className='prose max-w-none'>
              {recipe.instructions.split('\n').map((step, index) => (
                <p key={index} className='text-gray-600 mb-2'>
                  {step}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h2 className='text-xl font-semibold mb-2 text-gray-900'>Rating</h2>
            <div className='flex items-center'>
              <div className='flex text-yellow-400'>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${
                      i < recipe.rating ? 'fill-current' : 'text-gray-300'
                    }`}
                    viewBox='0 0 20 20'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                ))}
              </div>
              <span className='ml-2 text-gray-600'>{recipe.rating}/5</span>
            </div>
          </div>
        </div>
      </div>
    </MainContent>
  );
}
