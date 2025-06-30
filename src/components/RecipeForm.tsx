'use client';

import { Recipe, Ingredient, Label } from '@/types/recipe';
import { useState, useEffect } from 'react';
import { getAllLabels } from '@/app/actions';

interface RecipeFormProps {
  initialData?: Partial<Recipe>;
  onSubmit: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  submitLabel: string;
}

type FormIngredient = {
  quantity: string | number;
  unit: string;
  name: string;
};

type FormRecipe = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;

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

const evaluateFraction = (value: string | number): number => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  
  // Check if the value is a fraction
  const fractionMatch = value.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const numerator = parseFloat(fractionMatch[1]);
    const denominator = parseFloat(fractionMatch[2]);
    return numerator / denominator;
  }
  
  // If it's not a fraction, parse as float
  return parseFloat(value);
};

export default function RecipeForm({ initialData, onSubmit, submitLabel }: RecipeFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [author, setAuthor] = useState(initialData?.author || '');
  const [instructions, setInstructions] = useState(initialData?.instructions || '');
  const [rating, setRating] = useState(initialData?.rating?.toString() || '5');
  const [ingredients, setIngredients] = useState<FormIngredient[]>(
    initialData?.ingredients?.map(i => ({
      quantity: decimalToFraction(i.quantity),
      unit: i.unit,
      name: i.name
    })) || []
  );
  const [availableLabels, setAvailableLabels] = useState<Label[]>([]);
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>(
    initialData?.labels?.map(l => l.labelId) || []
  );

  useEffect(() => {
    const loadLabels = async () => {
      try {
        const labels = await getAllLabels();
        setAvailableLabels(labels);
      } catch (error) {
        console.error('Failed to load labels:', error);
      }
    };
    loadLabels();
  }, []);

  const addIngredient = () => {
    setIngredients([...ingredients, { quantity: '', unit: '', name: '' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof FormIngredient, value: string | number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value
    };
    setIngredients(newIngredients);
  };

  const handleLabelToggle = (labelId: string) => {
    setSelectedLabelIds(prev => 
      prev.includes(labelId) 
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData: FormRecipe = {
      title,
      author,
      instructions,
      ingredients: ingredients.map(ing => ({
        quantity: evaluateFraction(ing.quantity),
        unit: ing.unit,
        name: ing.name,
        id: '', // These fields will be set by the server
        recipeId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      })) as Ingredient[],
      labels: selectedLabelIds.map(labelId => ({
        id: '',
        recipeId: '',
        labelId,
        label: availableLabels.find(l => l.id === labelId)!,
        createdAt: new Date()
      })),
      rating: parseInt(rating),
    };
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-900">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
        />
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-900">Author</label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
        />
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-900">Rating (1-5)</label>
        <input
          type="number"
          id="rating"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Labels</label>
        <div className="grid grid-cols-2 gap-3">
          {availableLabels.map((label) => (
            <label key={label.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLabelIds.includes(label.id)}
                onChange={() => handleLabelToggle(label.id)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span 
                className="text-sm px-2 py-1 rounded-full text-white"
                style={{ backgroundColor: label.color }}
              >
                {label.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-900">Ingredients</label>
          <button
            type="button"
            onClick={addIngredient}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            + Add Ingredient
          </button>
        </div>
        <div className="space-y-4">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  value={ingredient.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                  placeholder="Quantity (e.g., 1/2, 3/4, 2)"
                  required
                  pattern="^[0-9]*[1-9][0-9]*(\/[0-9]*[1-9][0-9]*)?$|^[0-9]*[1-9][0-9]*\.[0-9]+$"
                  title="Please enter a valid number or fraction (e.g., 1/2, 3/4, 2)"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={ingredient.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  placeholder="Unit (e.g., cups, tbsp)"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                />
              </div>
              <div className="flex-2">
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  placeholder="Ingredient name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                />
              </div>
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="mt-1 text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="instructions" className="block text-sm font-medium text-gray-900">Instructions</label>
        <textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
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