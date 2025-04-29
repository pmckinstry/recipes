'use client';

import { Recipe } from '@/types/recipe';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import { getRecipe } from '@/app/actions';
import MainContent from '@/components/MainContent';

interface ShowRecipePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ShowRecipePage({ params }: ShowRecipePageProps) {
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = use(params);

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

  if (loading) {
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

  return (
    <MainContent>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">{recipe.title}</h1>
          <div className="space-x-4">
            <Link
              href="/recipes"
              className="text-indigo-600 hover:text-indigo-800"
            >
              ← Back to Recipes
            </Link>
            <Link
              href={`/recipes/${id}/edit`}
              className="text-indigo-600 hover:text-indigo-800"
            >
              Edit
            </Link>
            <Link
              href={`/recipes/${id}/delete`}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Author</h2>
            <p className="text-gray-600">{recipe.author}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
            <ul className="list-disc list-inside text-gray-600">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Instructions</h2>
            <div className="prose max-w-none">
              {recipe.instructions.split('\n').map((step, index) => (
                <p key={index} className="text-gray-600 mb-2">
                  {step}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Rating</h2>
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${
                      i < recipe.rating ? 'fill-current' : 'text-gray-300'
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-gray-600">{recipe.rating}/10</span>
            </div>
          </div>
        </div>
      </div>
    </MainContent>
  );
} 