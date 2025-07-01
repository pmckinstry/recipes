export interface Ingredient {
  id: string;
  quantity: number;
  unit: string;
  name: string;
  recipeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeLabel {
  id: string;
  recipeId: string;
  labelId: string;
  label: Label;
  createdAt: Date;
}

export interface Recipe {
  id: string;
  title: string;
  author: string;
  instructions: string;
  ingredients: Ingredient[];
  labels: RecipeLabel[];
  rating: number;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}
