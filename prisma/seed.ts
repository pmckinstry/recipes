import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Create a default user if it doesn't exist
  const defaultUser = await prisma.user.upsert({
    where: { email: 'default@example.com' },
    update: {},
    create: {
      email: 'default@example.com',
      name: 'Default User',
    },
  });

  // Create sample labels
  const labels = [
    { name: 'Dessert', color: '#F59E0B' },
    { name: 'Italian', color: '#10B981' },
    { name: 'Quick', color: '#3B82F6' },
    { name: 'Vegetarian', color: '#8B5CF6' },
    { name: 'Gluten-Free', color: '#EF4444' },
    { name: 'Breakfast', color: '#06B6D4' },
    { name: 'Dinner', color: '#84CC16' },
    { name: 'Snack', color: '#F97316' }
  ];

  const createdLabels = [];
  for (const label of labels) {
    const createdLabel = await prisma.label.upsert({
      where: { name: label.name },
      update: {},
      create: label,
    });
    createdLabels.push(createdLabel);
  }

  const recipes = [
    {
      title: 'Classic Chocolate Chip Cookies',
      author: 'Jane Smith',
      instructions: '1. Preheat oven to 375°F\n2. Mix butter and sugars\n3. Add eggs and vanilla\n4. Mix in dry ingredients\n5. Fold in chocolate chips\n6. Bake for 10-12 minutes',
      rating: 5,
      userId: defaultUser.id,
      ingredients: [
        { quantity: 2.25, unit: 'cups', name: 'flour' },
        { quantity: 1, unit: 'cup', name: 'butter' },
        { quantity: 0.75, unit: 'cup', name: 'sugar' },
        { quantity: 2, unit: '', name: 'eggs' },
        { quantity: 1, unit: 'tsp', name: 'vanilla' },
        { quantity: 2, unit: 'cups', name: 'chocolate chips' }
      ],
      labelNames: ['Dessert', 'Snack']
    },
    {
      title: 'Homemade Pizza',
      author: 'John Doe',
      instructions: '1. Mix yeast with warm water\n2. Add flour and salt\n3. Knead for 10 minutes\n4. Let rise for 1 hour\n5. Roll out dough\n6. Add toppings\n7. Bake at 450°F for 15-20 minutes',
      rating: 4,
      userId: defaultUser.id,
      ingredients: [
        { quantity: 3, unit: 'cups', name: 'flour' },
        { quantity: 1, unit: 'cup', name: 'warm water' },
        { quantity: 2.25, unit: 'tsp', name: 'yeast' },
        { quantity: 1, unit: 'tsp', name: 'salt' },
        { quantity: 1, unit: 'tbsp', name: 'olive oil' },
        { quantity: 1, unit: 'cup', name: 'pizza sauce' },
        { quantity: 2, unit: 'cups', name: 'mozzarella cheese' }
      ],
      labelNames: ['Italian', 'Dinner']
    }
  ];

  for (const recipe of recipes) {
    const { ingredients, labelNames, ...recipeData } = recipe;
    
    const createdRecipe = await prisma.recipe.create({
      data: {
        ...recipeData,
        ingredients: {
          create: ingredients.map(ing => ({
            quantity: ing.quantity,
            unit: ing.unit,
            name: ing.name
          }))
        }
      }
    });

    // Add labels to the recipe
    if (labelNames) {
      for (const labelName of labelNames) {
        const label = createdLabels.find(l => l.name === labelName);
        if (label) {
          await prisma.recipeLabel.create({
            data: {
              recipeId: createdRecipe.id,
              labelId: label.id,
            }
          });
        }
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 