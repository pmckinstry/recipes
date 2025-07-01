'use client';

import { Recipe } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
}

const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}
      >
        ★
      </span>
    );
  }
  return <span className='text-lg'>{stars}</span>;
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-2xl font-bold mb-2'>{recipe.title}</h2>
      <div className='flex items-center mb-4'>
        <span className='text-gray-600'>By {recipe.author}</span>
        <div className='ml-4 flex items-center'>
          <StarRating rating={recipe.rating} />
          <span className='ml-2 text-sm text-gray-600'>
            ({recipe.rating}/5)
          </span>
        </div>
      </div>

      {recipe.labels && recipe.labels.length > 0 && (
        <div className='mb-4'>
          <div className='flex flex-wrap gap-2'>
            {recipe.labels.map(recipeLabel => (
              <span
                key={recipeLabel.id}
                className='text-xs px-2 py-1 rounded-full text-white font-medium'
                style={{ backgroundColor: recipeLabel.label.color }}
              >
                {recipeLabel.label.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className='mb-4'>
        <h3 className='text-lg font-semibold mb-2'>Ingredients:</h3>
        <ul className='list-disc list-inside'>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className='text-gray-700'>
              {ingredient.quantity} {ingredient.unit} {ingredient.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-2'>Instructions:</h3>
        <p className='text-gray-700 whitespace-pre-wrap'>
          {recipe.instructions}
        </p>
      </div>
    </div>
  );
}
