import '@testing-library/jest-dom'

// Mock the entire actions module
jest.mock('@/app/actions', () => ({
  getAllLabels: jest.fn(),
  getLabel: jest.fn(),
  createLabel: jest.fn(),
  updateLabel: jest.fn(),
  deleteLabel: jest.fn(),
  getRecipesByLabel: jest.fn(),
}))

// Import the mocked functions
import {
  getAllLabels,
  getLabel,
  createLabel,
  updateLabel,
  deleteLabel,
  getRecipesByLabel,
} from '@/app/actions'

// Type the mocked functions
const mockGetAllLabels = getAllLabels as jest.MockedFunction<typeof getAllLabels>
const mockGetLabel = getLabel as jest.MockedFunction<typeof getLabel>
const mockCreateLabel = createLabel as jest.MockedFunction<typeof createLabel>
const mockUpdateLabel = updateLabel as jest.MockedFunction<typeof updateLabel>
const mockDeleteLabel = deleteLabel as jest.MockedFunction<typeof deleteLabel>
const mockGetRecipesByLabel = getRecipesByLabel as jest.MockedFunction<typeof getRecipesByLabel>

describe('Label Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllLabels', () => {
    it('returns all labels', async () => {
      const mockLabels = [
        {
          id: '1',
          name: 'Dessert',
          color: '#F59E0B',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Quick',
          color: '#10B981',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      mockGetAllLabels.mockResolvedValue(mockLabels)

      const result = await getAllLabels()

      expect(mockGetAllLabels).toHaveBeenCalledWith()
      expect(result).toEqual(mockLabels)
    })

    it('handles errors', async () => {
      mockGetAllLabels.mockRejectedValue(new Error('Database error'))

      await expect(getAllLabels()).rejects.toThrow('Database error')
    })
  })

  describe('getLabel', () => {
    it('returns a label by id', async () => {
      const mockLabel = {
        id: '1',
        name: 'Dessert',
        color: '#F59E0B',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockGetLabel.mockResolvedValue(mockLabel)

      const result = await getLabel('1')

      expect(mockGetLabel).toHaveBeenCalledWith('1')
      expect(result).toEqual(mockLabel)
    })

    it('returns null for non-existent label', async () => {
      mockGetLabel.mockResolvedValue(null)

      const result = await getLabel('999')

      expect(mockGetLabel).toHaveBeenCalledWith('999')
      expect(result).toBeNull()
    })
  })

  describe('createLabel', () => {
    it('creates a new label', async () => {
      const newLabel = {
        name: 'New Label',
        color: '#3B82F6',
      }

      const createdLabel = {
        id: '3',
        ...newLabel,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockCreateLabel.mockResolvedValue(createdLabel)

      const result = await createLabel(newLabel)

      expect(mockCreateLabel).toHaveBeenCalledWith(newLabel)
      expect(result).toEqual(createdLabel)
    })

    it('throws error when user is not authenticated', async () => {
      const newLabel = {
        name: 'New Label',
        color: '#3B82F6',
      }

      mockCreateLabel.mockRejectedValue(new Error('You must be logged in to create labels'))

      await expect(createLabel(newLabel)).rejects.toThrow('You must be logged in to create labels')
    })
  })

  describe('updateLabel', () => {
    it('updates an existing label', async () => {
      const updateData = {
        name: 'Updated Label',
        color: '#EF4444',
      }

      const updatedLabel = {
        id: '1',
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockUpdateLabel.mockResolvedValue(updatedLabel)

      const result = await updateLabel('1', updateData)

      expect(mockUpdateLabel).toHaveBeenCalledWith('1', updateData)
      expect(result).toEqual(updatedLabel)
    })

    it('throws error when user is not authenticated', async () => {
      const updateData = {
        name: 'Updated Label',
        color: '#EF4444',
      }

      mockUpdateLabel.mockRejectedValue(new Error('You must be logged in to update labels'))

      await expect(updateLabel('1', updateData)).rejects.toThrow('You must be logged in to update labels')
    })
  })

  describe('deleteLabel', () => {
    it('deletes a label', async () => {
      const deletedLabel = {
        id: '1',
        name: 'Dessert',
        color: '#F59E0B',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockDeleteLabel.mockResolvedValue(deletedLabel as any)

      const result = await deleteLabel('1')

      expect(mockDeleteLabel).toHaveBeenCalledWith('1')
      expect(result).toEqual(deletedLabel)
    })

    it('throws error when label is used by recipes', async () => {
      mockDeleteLabel.mockRejectedValue(new Error('Cannot delete label that is being used by recipes'))

      await expect(deleteLabel('1')).rejects.toThrow('Cannot delete label that is being used by recipes')
    })

    it('throws error when user is not authenticated', async () => {
      mockDeleteLabel.mockRejectedValue(new Error('You must be logged in to delete labels'))

      await expect(deleteLabel('1')).rejects.toThrow('You must be logged in to delete labels')
    })
  })

  describe('getRecipesByLabel', () => {
    it('returns recipes for a specific label', async () => {
      const mockRecipes = [
        {
          id: '1',
          title: 'Chocolate Cake',
          author: 'Chef John',
          instructions: 'Mix ingredients...',
          rating: 5,
          user: {
            id: '1',
            name: 'Chef John',
            email: 'john@example.com',
          },
          ingredients: [],
          labels: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      mockGetRecipesByLabel.mockResolvedValue(mockRecipes)

      const result = await getRecipesByLabel('1')

      expect(mockGetRecipesByLabel).toHaveBeenCalledWith('1')
      expect(result).toEqual(mockRecipes)
    })
  })
}) 