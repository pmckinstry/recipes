'use client';

import { Recipe } from '@/types/recipe';
import { useState } from 'react';

interface RecipeFormProps {
  initialData?: Partial<Recipe>;
  onSubmit: (recipe: Omit<Recipe, 'id'>) => Promise<void>;
  submitLabel: string;
}

export default function RecipeForm({ initialData, onSubmit, submitLabel }: RecipeFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [author, setAuthor] = useState(initialData?.author || '');
  const [instructions, setInstructions] = useState(initialData?.instructions || '');
  const [ingredients, setIngredients] = useState(initialData?.ingredients?.join('\n') || '');
  const [rating, setRating] = useState(initialData?.rating?.toString() || '5');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      author,
      instructions,
      ingredients: ingredients.split('\n').filter(i => i.trim()),
      rating: parseInt(rating),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (1-10)</label>
        <input
          type="number"
          id="rating"
          min="1"
          max="10"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">Ingredients (one per line)</label>
        <textarea
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions</label>
        <textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
} 