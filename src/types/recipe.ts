export interface Ingredient {
  id: string;
  quantity: number;
  unit: string;
  name: string;
  recipeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recipe {
  id: string;
  title: string;
  author: string;
  instructions: string;
  ingredients: Ingredient[];
  rating: number;
  createdAt: Date;
  updatedAt: Date;
} 