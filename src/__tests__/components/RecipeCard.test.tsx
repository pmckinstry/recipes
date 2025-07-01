import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import RecipeCard from '@/components/RecipeCard'
import { Recipe } from '@/types/recipe'

const mockRecipe: Recipe = {
  id: '1',
  title: 'Test Recipe',
  author: 'Test Author',
  instructions: 'Test instructions\nStep 2\nStep 3',
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
    {
      id: '2',
      quantity: 1,
      unit: 'cup',
      name: 'sugar',
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
  rating: 4,
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('RecipeCard', () => {
  it('renders recipe title', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    expect(screen.getByText('Test Recipe')).toBeInTheDocument()
  })

  it('renders recipe author', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    expect(screen.getByText('By Test Author')).toBeInTheDocument()
  })

  it('renders recipe rating with stars', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    expect(screen.getByText('(4/5)')).toBeInTheDocument()
  })

  it('renders all ingredients', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    expect(screen.getByText('2 cups flour')).toBeInTheDocument()
    expect(screen.getByText('1 cup sugar')).toBeInTheDocument()
  })

  it('renders recipe instructions', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    expect(screen.getByText(/Test instructions[\s\S]*Step 2[\s\S]*Step 3/)).toBeInTheDocument()
  })

  it('renders labels with correct colors', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    const label = screen.getByText('Dessert')
    expect(label).toBeInTheDocument()
    expect(label).toHaveStyle({ backgroundColor: '#F59E0B' })
  })

  it('renders recipe without labels', () => {
    const recipeWithoutLabels = { ...mockRecipe, labels: [] }
    render(<RecipeCard recipe={recipeWithoutLabels} />)
    expect(screen.queryByText('Dessert')).not.toBeInTheDocument()
  })

  it('handles decimal quantities correctly', () => {
    const recipeWithDecimal = {
      ...mockRecipe,
      ingredients: [
        {
          id: '1',
          quantity: 0.5,
          unit: 'cup',
          name: 'milk',
          recipeId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    }
    render(<RecipeCard recipe={recipeWithDecimal} />)
    expect(screen.getByText('0.5 cup milk')).toBeInTheDocument()
  })
}) 