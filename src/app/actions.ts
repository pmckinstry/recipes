'use server';

import { prisma } from '@/lib/db';
import { Recipe, Ingredient } from '@/types/recipe';

export async function getRecipes() {
  const recipes = await prisma.recipe.findMany({
    include: {
      ingredients: true
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return recipes;
}

export async function getRecipe(id: string) {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      ingredients: true
    }
  });

  return recipe;
}

export async function createRecipe(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) {
  const newRecipe = await prisma.recipe.create({
    data: {
      title: recipe.title,
      author: recipe.author,
      instructions: recipe.instructions,
      rating: recipe.rating,
      ingredients: {
        create: recipe.ingredients.map(ingredient => ({
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          name: ingredient.name
        }))
      }
    },
    include: {
      ingredients: true
    }
  });

  return newRecipe;
}

export async function updateRecipe(id: string, recipe: Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>) {
  // First, delete all existing ingredients
  await prisma.ingredient.deleteMany({
    where: { recipeId: id }
  });

  // Then update the recipe and create new ingredients
  const updatedRecipe = await prisma.recipe.update({
    where: { id },
    data: {
      title: recipe.title,
      author: recipe.author,
      instructions: recipe.instructions,
      rating: recipe.rating,
      ingredients: {
        create: recipe.ingredients?.map(ingredient => ({
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          name: ingredient.name
        })) || []
      }
    },
    include: {
      ingredients: true
    }
  });

  return updatedRecipe;
}

export async function deleteRecipe(id: string) {
  // The cascade delete will handle removing the ingredients
  await prisma.recipe.delete({
    where: { id }
  });
} 