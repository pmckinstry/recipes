'use client';

import { Label, Recipe } from '@/types/recipe';
import Link from 'next/link';
import { useState, useEffect, use } from 'react';
import { getLabel, getRecipesByLabel } from '@/app/actions';
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

interface LabelPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function LabelPage({ params }: LabelPageProps) {
  const [label, setLabel] = useState<Label | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = use(params);
  const { data: session, status } = useSession();

  useEffect(() => {
    async function loadLabelAndRecipes() {
      try {
        const [labelData, recipesData] = await Promise.all([
          getLabel(id),
          getRecipesByLabel(id)
        ]);
        
        if (!labelData) {
          setError('Label not found');
          return;
        }
        
        setLabel(labelData);
        setRecipes(recipesData);
      } catch (err) {
        setError('Failed to load label');
        console.error('Error loading label:', err);
      } finally {
        setLoading(false);
      }
    }

    loadLabelAndRecipes();
  }, [id]);

  if (loading || status === 'loading') {
    return (
      <MainContent>
        <div className="text-center">
          Loading...
        </div>
      </MainContent>
    );
  }

  if (error || !label) {
    return (
      <MainContent>
        <div className="text-center text-red-600">
          {error || 'Label not found'}
        </div>
      </MainContent>
    );
  }

  return (
    <MainContent>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <span 
              className="px-4 py-2 rounded-full text-white font-medium text-lg"
              style={{ backgroundColor: label.color }}
            >
              {label.name}
            </span>
            <span className="text-sm text-gray-500">#{label.color}</span>
          </div>
          <div className="space-x-4">
            <Link
              href="/labels"
              className="text-indigo-600 hover:text-indigo-800"
            >
              ← Back to Labels
            </Link>
            {session && (
              <Link
                href={`/labels/${id}/edit`}
                className="text-indigo-600 hover:text-indigo-800"
              >
                Edit Label
              </Link>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recipes with this label ({recipes.length})
          </h2>
          
          {recipes.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No recipes found with this label.
            </div>
          ) : (
            <div className="grid gap-6">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="relative">
                  <Link href={`/recipes/${recipe.id}`} className="block">
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{recipe.title}</h3>
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
          )}
        </div>
      </div>
    </MainContent>
  );
} 