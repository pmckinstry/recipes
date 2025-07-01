'use server';

import { prisma } from '@/lib/db';
import { Recipe, Ingredient, Label } from '@/types/recipe';
import { auth } from '@/lib/auth';

export async function getRecipes() {
  const recipes = await prisma.recipe.findMany({
    include: {
      ingredients: true,
      labels: {
        include: {
          label: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
      labels: {
        include: {
          label: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return recipe;
}

export async function getAllLabels() {
  const labels = await prisma.label.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return labels;
}

export async function createRecipe(
  recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>
) {
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
          name: ingredient.name,
        })),
      },
      labels: {
        create:
          recipe.labels?.map(recipeLabel => ({
            labelId: recipeLabel.labelId,
          })) || [],
      },
    },
    include: {
      ingredients: true,
      labels: {
        include: {
          label: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return newRecipe;
}

export async function updateRecipe(
  id: string,
  recipe: Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('You must be logged in to update a recipe');
  }

  // Check if the recipe belongs to the current user
  const existingRecipe = await prisma.recipe.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!existingRecipe) {
    throw new Error('Recipe not found');
  }

  if (existingRecipe.userId !== session.user.id) {
    throw new Error('You can only update your own recipes');
  }

  // First, delete all existing ingredients and labels
  await prisma.ingredient.deleteMany({
    where: { recipeId: id },
  });

  await prisma.recipeLabel.deleteMany({
    where: { recipeId: id },
  });

  // Then update the recipe and create new ingredients and labels
  const updatedRecipe = await prisma.recipe.update({
    where: { id },
    data: {
      title: recipe.title,
      author: recipe.author,
      instructions: recipe.instructions,
      rating: recipe.rating,
      ingredients: {
        create:
          recipe.ingredients?.map(ingredient => ({
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            name: ingredient.name,
          })) || [],
      },
      labels: {
        create:
          recipe.labels?.map(recipeLabel => ({
            labelId: recipeLabel.labelId,
          })) || [],
      },
    },
    include: {
      ingredients: true,
      labels: {
        include: {
          label: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
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
    select: { userId: true },
  });

  if (!existingRecipe) {
    throw new Error('Recipe not found');
  }

  if (existingRecipe.userId !== session.user.id) {
    throw new Error('You can only delete your own recipes');
  }

  // The cascade delete will handle removing the ingredients
  await prisma.recipe.delete({
    where: { id },
  });
}

export async function createLabel(
  label: Omit<Label, 'id' | 'createdAt' | 'updatedAt'>
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('You must be logged in to create labels');
  }

  const newLabel = await prisma.label.create({
    data: {
      name: label.name,
      color: label.color,
    },
  });

  return newLabel;
}

export async function updateLabel(
  id: string,
  label: Partial<Omit<Label, 'id' | 'createdAt' | 'updatedAt'>>
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('You must be logged in to update labels');
  }

  const updatedLabel = await prisma.label.update({
    where: { id },
    data: {
      name: label.name,
      color: label.color,
    },
  });

  return updatedLabel;
}

export async function deleteLabel(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('You must be logged in to delete labels');
  }

  // Check if the label is being used by any recipes
  const recipeLabels = await prisma.recipeLabel.findMany({
    where: { labelId: id },
  });

  if (recipeLabels.length > 0) {
    throw new Error('Cannot delete label that is being used by recipes');
  }

  await prisma.label.delete({
    where: { id },
  });
}

export async function getLabel(id: string) {
  const label = await prisma.label.findUnique({
    where: { id },
  });

  return label;
}

export async function getRecipesByLabel(labelId: string) {
  const recipes = await prisma.recipe.findMany({
    where: {
      labels: {
        some: {
          labelId: labelId,
        },
      },
    },
    include: {
      ingredients: true,
      labels: {
        include: {
          label: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return recipes;
}
