'use server';

import { prisma } from '@/lib/db';
import { Recipe } from '@/types/recipe';

export async function getRecipes() {
  const recipes = await prisma.recipe.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return recipes.map(recipe => ({
    ...recipe,
    ingredients: JSON.parse(recipe.ingredients),
  }));
}

export async function getRecipe(id: string) {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
  });

  if (!recipe) return null;

  return {
    ...recipe,
    ingredients: JSON.parse(recipe.ingredients),
  };
}

export async function createRecipe(recipe: Omit<Recipe, 'id'>) {
  const newRecipe = await prisma.recipe.create({
    data: {
      ...recipe,
      ingredients: JSON.stringify(recipe.ingredients),
    },
  });

  return {
    ...newRecipe,
    ingredients: JSON.parse(newRecipe.ingredients),
  };
}

export async function updateRecipe(id: string, recipe: Partial<Omit<Recipe, 'id'>>) {
  const updatedRecipe = await prisma.recipe.update({
    where: { id },
    data: {
      ...recipe,
      ingredients: recipe.ingredients ? JSON.stringify(recipe.ingredients) : undefined,
    },
  });

  return {
    ...updatedRecipe,
    ingredients: JSON.parse(updatedRecipe.ingredients),
  };
}

export async function deleteRecipe(id: string) {
  await prisma.recipe.delete({
    where: { id },
  });
} 