import '@testing-library/jest-dom';

// Mock the entire actions module
jest.mock('@/app/actions', () => ({
  getRecipes: jest.fn(),
  getRecipe: jest.fn(),
  createRecipe: jest.fn(),
  updateRecipe: jest.fn(),
  deleteRecipe: jest.fn(),
}));

// Import the mocked functions
import {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '@/app/actions';

// Type the mocked functions
const mockGetRecipes = getRecipes as jest.MockedFunction<typeof getRecipes>;
const mockGetRecipe = getRecipe as jest.MockedFunction<typeof getRecipe>;
const mockCreateRecipe = createRecipe as jest.MockedFunction<
  typeof createRecipe
>;
const mockUpdateRecipe = updateRecipe as jest.MockedFunction<
  typeof updateRecipe
>;
const mockDeleteRecipe = deleteRecipe as jest.MockedFunction<
  typeof deleteRecipe
>;

describe('Recipe Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRecipes', () => {
    it('should return all recipes with ingredients and labels', async () => {
      const mockRecipes = [
        {
          id: '1',
          title: 'Test Recipe',
          author: 'Test Author',
          instructions: 'Test instructions',
          rating: 4,
          ingredients: [
            {
              id: '1',
              quantity: 2,
              unit: 'cups',
              name: 'flour',
              recipeId: '1',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          labels: [
            {
              id: '1',
              recipeId: '1',
              labelId: '1',
              label: {
                id: '1',
                name: 'Dessert',
                color: '#F59E0B',
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              createdAt: new Date(),
            },
          ],
          user: { id: '1', name: 'Test User', email: 'test@example.com' },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockGetRecipes.mockResolvedValue(mockRecipes);

      const result = await getRecipes();

      expect(mockGetRecipes).toHaveBeenCalledWith();
      expect(result).toEqual(mockRecipes);
    });
  });

  describe('getRecipe', () => {
    it('should return a single recipe by id', async () => {
      const mockRecipe = {
        id: '1',
        title: 'Test Recipe',
        author: 'Test Author',
        instructions: 'Test instructions',
        rating: 4,
        ingredients: [
          {
            id: '1',
            quantity: 2,
            unit: 'cups',
            name: 'flour',
            recipeId: '1',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        labels: [
          {
            id: '1',
            recipeId: '1',
            labelId: '1',
            label: {
              id: '1',
              name: 'Dessert',
              color: '#F59E0B',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            createdAt: new Date(),
          },
        ],
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockGetRecipe.mockResolvedValue(mockRecipe);

      const result = await getRecipe('1');

      expect(mockGetRecipe).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockRecipe);
    });
  });

  describe('createRecipe', () => {
    it('should create a recipe when user is authenticated', async () => {
      const recipeData = {
        title: 'New Recipe',
        author: 'New Author',
        instructions: 'New instructions',
        rating: 5,
        ingredients: [
          {
            quantity: 2,
            unit: 'cups',
            name: 'flour',
            id: '',
            recipeId: '',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        labels: [],
      };

      const createdRecipe = {
        id: '2',
        ...recipeData,
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreateRecipe.mockResolvedValue(createdRecipe);

      const result = await createRecipe(recipeData);

      expect(mockCreateRecipe).toHaveBeenCalledWith(recipeData);
      expect(result).toEqual(createdRecipe);
    });

    it('should throw error when user is not authenticated', async () => {
      const recipeData = {
        title: 'New Recipe',
        author: 'New Author',
        instructions: 'New instructions',
        rating: 5,
        ingredients: [
          {
            quantity: 2,
            unit: 'cups',
            name: 'flour',
            id: '',
            recipeId: '',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        labels: [],
      };

      mockCreateRecipe.mockRejectedValue(
        new Error('You must be logged in to create a recipe')
      );

      await expect(createRecipe(recipeData)).rejects.toThrow(
        'You must be logged in to create a recipe'
      );
    });
  });

  describe('updateRecipe', () => {
    it('should update a recipe when user owns it', async () => {
      const updateData = {
        title: 'Updated Recipe',
        author: 'Updated Author',
        instructions: 'Updated instructions',
        rating: 3,
        ingredients: [
          {
            quantity: 1,
            unit: 'cup',
            name: 'sugar',
            id: '',
            recipeId: '',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        labels: [],
      };

      const updatedRecipe = {
        id: '1',
        ...updateData,
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUpdateRecipe.mockResolvedValue(updatedRecipe);

      const result = await updateRecipe('1', updateData);

      expect(mockUpdateRecipe).toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual(updatedRecipe);
    });

    it('should throw error when user does not own the recipe', async () => {
      const updateData = {
        title: 'Updated Recipe',
        author: 'Updated Author',
        instructions: 'Updated instructions',
        rating: 3,
        ingredients: [],
        labels: [],
      };

      mockUpdateRecipe.mockRejectedValue(
        new Error('You can only update your own recipes')
      );

      await expect(updateRecipe('1', updateData)).rejects.toThrow(
        'You can only update your own recipes'
      );
    });
  });

  describe('deleteRecipe', () => {
    it('should delete a recipe when user owns it', async () => {
      mockDeleteRecipe.mockResolvedValue(undefined);

      await deleteRecipe('1');

      expect(mockDeleteRecipe).toHaveBeenCalledWith('1');
    });

    it('should throw error when user does not own the recipe', async () => {
      mockDeleteRecipe.mockRejectedValue(
        new Error('You can only delete your own recipes')
      );

      await expect(deleteRecipe('1')).rejects.toThrow(
        'You can only delete your own recipes'
      );
    });
  });
});
