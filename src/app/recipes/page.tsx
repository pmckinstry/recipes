'use client';

import Link from 'next/link';
import { Recipe } from '@/types/recipe';
import { getRecipes } from '@/app/actions';
import { useEffect, useState } from 'react';
import MainContent from '@/components/MainContent';
import { useSession } from 'next-auth/react';

const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}>
        ★
      </span>
    );
  }
  return <span className="text-lg">{stars}</span>;
};

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await getRecipes();
        setRecipes(data);
      } catch (err) {
        setError('Failed to load recipes');
        console.error('Error loading recipes:', err);
      } finally {
        setLoading(false);
      }
    }

    loadRecipes();
  }, []);

  if (loading || status === 'loading') {
    return (
      <MainContent>
        <div className="text-center">
          Loading recipes...
        </div>
      </MainContent>
    );
  }

  if (error) {
    return (
      <MainContent>
        <div className="text-center text-red-600">
          {error}
        </div>
      </MainContent>
    );
  }

  return (
    <MainContent>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Recipes</h1>
        {session && (
          <Link
            href="/recipes/new"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Add New Recipe
          </Link>
        )}
      </div>
      <div className="grid gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="relative">
            <Link href={`/recipes/${recipe.id}`} className="block">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-bold mb-2 text-gray-900">{recipe.title}</h2>
                <p className="text-gray-600">By {recipe.author}</p>
                <div className="flex items-center mt-2">
                  <StarRating rating={recipe.rating} />
                  <span className="ml-2 text-sm text-gray-600">({recipe.rating}/5)</span>
                </div>
                {recipe.labels && recipe.labels.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {recipe.labels.map((recipeLabel) => (
                      <span
                        key={recipeLabel.id}
                        className="text-xs px-2 py-1 rounded-full text-white font-medium"
                        style={{ backgroundColor: recipeLabel.label.color }}
                      >
                        {recipeLabel.label.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
            {session && recipe.user && recipe.user.id === session.user?.id && (
              <div className="absolute top-4 right-4 space-x-2">
                <Link
                  href={`/recipes/${recipe.id}/edit`}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </Link>
                <Link
                  href={`/recipes/${recipe.id}/delete`}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </MainContent>
  );
} 