/**
 * Category configuration for SOL brands
 * Defines brand-specific and common categories
 */

// Common categories that apply to most brands
export const commonCategories = [
  {
    name: 'Appetizers',
    slug: 'appetizers',
    description: 'Start your meal with our delicious appetizers'
  },
  {
    name: 'Main Course',
    slug: 'main-course',
    description: 'Hearty main dishes prepared with authentic Japanese techniques'
  },
  {
    name: 'Desserts',
    slug: 'desserts',
    description: 'Sweet endings to perfect your meal'
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    description: 'Refreshing drinks and traditional Japanese beverages'
  }
];

// Brand-specific categories
export const brandSpecificCategories = {
  'miwaku-premium': [
    { name: 'Premium Appetizers', slug: 'premium-appetizers', description: 'Luxurious starters with premium ingredients' },
    { name: 'Main Course', slug: 'main-course', description: 'Premium main dishes with international influences' },
    { name: 'Premium Desserts', slug: 'premium-desserts', description: 'Artisanal desserts with premium ingredients' },
    { name: 'Wine Pairing', slug: 'wine-pairing', description: 'Carefully selected wines to complement your meal' },
    { name: 'Signature Dishes', slug: 'signature-dishes', description: 'Chef\'s signature creations' }
  ],

  's79-teppanyaki': [
    { name: 'Teppanyaki Starters', slug: 'teppanyaki-starters', description: 'Appetizers prepared on the iron grill' },
    { name: 'Main Grill', slug: 'main-grill', description: 'Premium meats and seafood grilled to perfection' },
    { name: 'Seafood Specialties', slug: 'seafood-specialties', description: 'Fresh seafood teppanyaki style' },
    { name: 'Vegetarian Options', slug: 'vegetarian-options', description: 'Delicious vegetarian teppanyaki dishes' },
    { name: 'Desserts', slug: 'desserts', description: 'Sweet endings to your teppanyaki experience' }
  ],

  'kohaku-sashimi-yakiniku': [
    { name: 'Sashimi & Sushi', slug: 'sashimi-sushi', description: 'Fresh sashimi and traditional sushi' },
    { name: 'Yakiniku Grill', slug: 'yakiniku-grill', description: 'Japanese BBQ grilled at your table' },
    { name: 'Hot Pot', slug: 'hot-pot', description: 'Comforting Japanese hot pot dishes' },
    { name: 'Rice & Noodles', slug: 'rice-noodles', description: 'Traditional rice and noodle dishes' },
    { name: 'Beverages', slug: 'beverages', description: 'Traditional Japanese drinks' }
  ],

  'kohaku-sushi': [
    { name: 'Sushi Rolls', slug: 'sushi-rolls', description: 'Classic and creative sushi rolls' },
    { name: 'Nigiri Sushi', slug: 'nigiri-sushi', description: 'Traditional nigiri with fresh toppings' },
    { name: 'Sashimi', slug: 'sashimi', description: 'Fresh sliced fish and seafood' },
    { name: 'Temaki', slug: 'temaki', description: 'Hand-rolled sushi cones' },
    { name: 'Special Rolls', slug: 'special-rolls', description: 'Chef\'s special sushi creations' },
    { name: 'Beverages', slug: 'beverages', description: 'Sake and traditional drinks' }
  ],

  'kohaku-udon-ramen': [
    { name: 'Ramen Bowls', slug: 'ramen-bowls', description: 'Rich and flavorful ramen bowls' },
    { name: 'Udon Noodles', slug: 'udon-noodles', description: 'Hearty udon noodle dishes' },
    { name: 'Appetizers', slug: 'appetizers', description: 'Japanese starters and small plates' },
    { name: 'Gyoza & Dumplings', slug: 'gyoza-dumplings', description: 'Pan-fried and steamed dumplings' },
    { name: 'Drinks', slug: 'drinks', description: 'Traditional Japanese beverages' }
  ],

  'date-nariya': [
    { name: 'Gyutan Specialties', slug: 'gyutan-specialties', description: 'Premium beef tongue dishes' },
    { name: 'Grilled Meats', slug: 'grilled-meats', description: 'High-quality grilled meats' },
    { name: 'Appetizers', slug: 'appetizers', description: 'Japanese starters and sides' },
    { name: 'Rice Dishes', slug: 'rice-dishes', description: 'Japanese rice preparations' },
    { name: 'Beverages', slug: 'beverages', description: 'Traditional drinks' }
  ],

  'machida-shoten': [
    { name: 'Izakaya Small Plates', slug: 'izakaya-small-plates', description: 'Traditional Japanese small plates' },
    { name: 'Yakitori', slug: 'yakitori', description: 'Grilled skewers and BBQ' },
    { name: 'Sashimi', slug: 'sashimi', description: 'Fresh sashimi and seafood' },
    { name: 'Sake Selection', slug: 'sake-selection', description: 'Premium sake and Japanese spirits' },
    { name: 'Desserts', slug: 'desserts', description: 'Traditional Japanese sweets' }
  ]
};

// Helper function to get categories for a brand
export function getCategoriesForBrand(brandId) {
  return brandSpecificCategories[brandId] || commonCategories.slice(0, 5);
}

// Helper function to get all category names
export function getAllCategoryNames() {
  const allCategories = new Set();

  // Add common categories
  commonCategories.forEach(cat => allCategories.add(cat.name));

  // Add brand-specific categories
  Object.values(brandSpecificCategories).forEach(categories => {
    categories.forEach(cat => allCategories.add(cat.name));
  });

  return Array.from(allCategories);
}