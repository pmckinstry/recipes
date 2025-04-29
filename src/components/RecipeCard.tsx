'use client';

import { Recipe } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
      <div className="flex items-center mb-4">
        <span className="text-gray-600">By {recipe.author}</span>
        <span className="ml-4 text-yellow-500">★ {recipe.rating}/10</span>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
        <ul className="list-disc list-inside">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="text-gray-700">{ingredient}</li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{recipe.instructions}</p>
      </div>
    </div>
  );
} 