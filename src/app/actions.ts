'use server';

import { prisma } from '@/lib/db';
import { Recipe, Ingredient } from '@/types/recipe';
import { auth } from '@/lib/auth';

export async function getRecipes() {
  const recipes = await prisma.recipe.findMany({
    include: {
      ingredients: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
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
      ingredients: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  return recipe;
}

export async function createRecipe(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('You must be logged in to create a recipe');
  }

  const newRecipe = await prisma.recipe.create({
    data: {
      title: recipe.title,
      author: recipe.author,
      instructions: recipe.instructions,
      rating: recipe.rating,
      userId: session.user.id,
      ingredients: {
        create: recipe.ingredients.map(ingredient => ({
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          name: ingredient.name
        }))
      }
    },
    include: {
      ingredients: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  return newRecipe;
}

export async function updateRecipe(id: string, recipe: Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('You must be logged in to update a recipe');
  }

  // Check if the recipe belongs to the current user
  const existingRecipe = await prisma.recipe.findUnique({
    where: { id },
    select: { userId: true }
  });

  if (!existingRecipe) {
    throw new Error('Recipe not found');
  }

  if (existingRecipe.userId !== session.user.id) {
    throw new Error('You can only update your own recipes');
  }

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
      ingredients: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  return updatedRecipe;
}

export async function deleteRecipe(id: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('You must be logged in to delete a recipe');
  }

  // Check if the recipe belongs to the current user
  const existingRecipe = await prisma.recipe.findUnique({
    where: { id },
    select: { userId: true }
  });

  if (!existingRecipe) {
    throw new Error('Recipe not found');
  }

  if (existingRecipe.userId !== session.user.id) {
    throw new Error('You can only delete your own recipes');
  }

  // The cascade delete will handle removing the ingredients
  await prisma.recipe.delete({
    where: { id }
  });
} 