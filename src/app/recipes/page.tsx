'use client';

import Link from 'next/link';
import { Recipe } from '@/types/recipe';
import { getRecipes } from '@/app/actions';
import { useEffect, useState } from 'react';
import MainContent from '@/components/MainContent';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
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
        <h1 className="text-4xl font-bold">Recipes</h1>
        <Link
          href="/recipes/new"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Add New Recipe
        </Link>
      </div>
      <div className="grid gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="relative">
            <Link href={`/recipes/${recipe.id}`} className="block">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
                <p className="text-gray-600">By {recipe.author}</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1 text-gray-600">{recipe.rating}/10</span>
                </div>
              </div>
            </Link>
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
          </div>
        ))}
      </div>
    </MainContent>
  );
} 