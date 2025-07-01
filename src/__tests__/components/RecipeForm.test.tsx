import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecipeForm from '@/components/RecipeForm';
import { getAllLabels } from '@/app/actions';

// Mock the server actions
jest.mock('@/app/actions', () => ({
  getAllLabels: jest.fn(),
}));

const mockGetAllLabels = getAllLabels as jest.MockedFunction<
  typeof getAllLabels
>;

describe('RecipeForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    // Mock labels data
    mockGetAllLabels.mockResolvedValue([
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
    ]);
  });

  it('renders form fields', async () => {
    render(<RecipeForm onSubmit={mockOnSubmit} submitLabel='Create Recipe' />);

    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
      expect(screen.getByLabelText('Author')).toBeInTheDocument();
      expect(screen.getByLabelText('Rating (1-5)')).toBeInTheDocument();
      expect(screen.getByLabelText('Instructions')).toBeInTheDocument();
    });
  });

  it('allows adding ingredients', async () => {
    const user = userEvent.setup();
    render(<RecipeForm onSubmit={mockOnSubmit} submitLabel='Create Recipe' />);

    await waitFor(() => {
      expect(screen.getByText('+ Add Ingredient')).toBeInTheDocument();
    });

    const addButton = screen.getByText('+ Add Ingredient');
    await user.click(addButton);

    // There should be one ingredient quantity input now (since the form starts with 0)
    const quantityInputs = screen.getAllByPlaceholderText(
      'Quantity (e.g., 1/2, 3/4, 2)'
    );
    expect(quantityInputs).toHaveLength(1);
  });

  it('allows removing ingredients', async () => {
    const user = userEvent.setup();
    render(<RecipeForm onSubmit={mockOnSubmit} submitLabel='Create Recipe' />);

    // Add an ingredient first
    const addButton = screen.getByText('+ Add Ingredient');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('×')).toBeInTheDocument();
    });

    const removeButton = screen.getByText('×');
    await user.click(removeButton);

    // After removing, there should be no ingredient inputs
    const quantityInputs = screen.queryAllByPlaceholderText(
      'Quantity (e.g., 1/2, 3/4, 2)'
    );
    expect(quantityInputs).toHaveLength(0);
  });

  it('submits form with correct data', async () => {
    const user = userEvent.setup();
    render(<RecipeForm onSubmit={mockOnSubmit} submitLabel='Create Recipe' />);

    // Add an ingredient first
    const addButton = screen.getByText('+ Add Ingredient');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
    });

    // Fill out the form
    await user.type(screen.getByLabelText('Title'), 'New Recipe');
    await user.type(screen.getByLabelText('Author'), 'New Author');
    await user.type(screen.getByLabelText('Instructions'), 'New instructions');

    // Fill out the ingredient
    const quantityInput = screen.getByPlaceholderText(
      'Quantity (e.g., 1/2, 3/4, 2)'
    );
    const unitInput = screen.getByPlaceholderText('Unit (e.g., cups, tbsp)');
    const nameInput = screen.getByPlaceholderText('Ingredient name');

    await user.type(quantityInput, '2');
    await user.type(unitInput, 'cups');
    await user.type(nameInput, 'flour');

    // Submit the form
    const submitButton = screen.getByText('Create Recipe');
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Recipe',
        author: 'New Author',
        instructions: 'New instructions',
        ingredients: expect.arrayContaining([
          expect.objectContaining({
            quantity: 2,
            unit: 'cups',
            name: 'flour',
          }),
        ]),
      })
    );
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<RecipeForm onSubmit={mockOnSubmit} submitLabel='Create Recipe' />);

    await waitFor(() => {
      expect(screen.getByText('Create Recipe')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('Create Recipe');
    await user.click(submitButton);

    // Form should not submit without required fields
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('handles fraction input correctly', async () => {
    const user = userEvent.setup();
    render(<RecipeForm onSubmit={mockOnSubmit} submitLabel='Create Recipe' />);

    // Add an ingredient first
    const addButton = screen.getByText('+ Add Ingredient');
    await user.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Quantity (e.g., 1/2, 3/4, 2)')
      ).toBeInTheDocument();
    });

    const quantityInput = screen.getByPlaceholderText(
      'Quantity (e.g., 1/2, 3/4, 2)'
    );
    await user.type(quantityInput, '1/2');

    expect(quantityInput).toHaveValue('1/2');
  });

  it('handles decimal input correctly', async () => {
    const user = userEvent.setup();
    render(<RecipeForm onSubmit={mockOnSubmit} submitLabel='Create Recipe' />);

    // Add an ingredient first
    const addButton = screen.getByText('+ Add Ingredient');
    await user.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Quantity (e.g., 1/2, 3/4, 2)')
      ).toBeInTheDocument();
    });

    const quantityInput = screen.getByPlaceholderText(
      'Quantity (e.g., 1/2, 3/4, 2)'
    );
    await user.type(quantityInput, '0.5');

    expect(quantityInput).toHaveValue('0.5');
  });

  it('allows selecting labels', async () => {
    const user = userEvent.setup();
    render(<RecipeForm onSubmit={mockOnSubmit} submitLabel='Create Recipe' />);

    await waitFor(() => {
      expect(screen.getByText('Dessert')).toBeInTheDocument();
      expect(screen.getByText('Quick')).toBeInTheDocument();
    });

    const dessertCheckbox = screen.getByLabelText('Dessert');
    await user.click(dessertCheckbox);

    expect(dessertCheckbox).toBeChecked();
  });

  it('pre-fills form with initial data', async () => {
    const initialData = {
      title: 'Initial Recipe',
      author: 'Initial Author',
      instructions: 'Initial instructions',
      rating: 3,
    };

    render(
      <RecipeForm
        onSubmit={mockOnSubmit}
        submitLabel='Update Recipe'
        initialData={initialData}
      />
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Initial Recipe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Initial Author')).toBeInTheDocument();
      expect(
        screen.getByDisplayValue('Initial instructions')
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue('3')).toBeInTheDocument();
    });
  });
});
