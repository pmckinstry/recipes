'use client';

import Link from 'next/link';
import MainContent from '@/components/MainContent';

export default function HelpPage() {
  return (
    <MainContent>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Help & FAQ</h1>
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">How do I add a new recipe?</h3>
                <p className="text-gray-600">
                  Click on the "Recipes" link in the navigation bar, then click the "Add New Recipe" button. 
                  Fill in the recipe details including title, author, ingredients, instructions, and rating.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">How do I edit a recipe?</h3>
                <p className="text-gray-600">
                  Navigate to the recipe you want to edit, then click the "Edit" button in the top right corner. 
                  Make your changes and click "Update Recipe" to save.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Managing Recipes</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">How do I delete a recipe?</h3>
                <p className="text-gray-600">
                  Go to the recipe you want to delete and click the "Delete" button. 
                  You'll be asked to confirm before the recipe is permanently removed.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">How do I rate a recipe?</h3>
                <p className="text-gray-600">
                  When adding or editing a recipe, you can set a rating from 1 to 10. 
                  This helps you keep track of your favorite recipes.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Tips & Tricks</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Organizing Ingredients</h3>
                <p className="text-gray-600">
                  When adding ingredients, enter each ingredient on a new line. 
                  This makes it easier to read and follow the recipe.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Writing Instructions</h3>
                <p className="text-gray-600">
                  Break down your instructions into clear, numbered steps. 
                  Each step should be on a new line for better readability.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </MainContent>
  );
} 