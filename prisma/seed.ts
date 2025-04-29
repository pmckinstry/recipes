import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const recipes = [
    {
      title: 'Classic Chocolate Chip Cookies',
      author: 'Jane Smith',
      instructions: '1. Preheat oven to 375°F\n2. Mix butter and sugars\n3. Add eggs and vanilla\n4. Mix in dry ingredients\n5. Fold in chocolate chips\n6. Bake for 10-12 minutes',
      ingredients: JSON.stringify([
        '2 1/4 cups flour',
        '1 cup butter',
        '3/4 cup sugar',
        '2 eggs',
        '1 tsp vanilla',
        '2 cups chocolate chips'
      ]),
      rating: 9
    },
    {
      title: 'Homemade Pizza',
      author: 'John Doe',
      instructions: '1. Mix yeast with warm water\n2. Add flour and salt\n3. Knead for 10 minutes\n4. Let rise for 1 hour\n5. Roll out dough\n6. Add toppings\n7. Bake at 450°F for 15-20 minutes',
      ingredients: JSON.stringify([
        '3 cups flour',
        '1 cup warm water',
        '2 1/4 tsp yeast',
        '1 tsp salt',
        '1 tbsp olive oil',
        'Pizza sauce',
        'Mozzarella cheese',
        'Your favorite toppings'
      ]),
      rating: 8
    }
  ];

  for (const recipe of recipes) {
    await prisma.recipe.create({
      data: recipe
    });
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