/**
 * Sample menu items configuration for SOL brands
 * Defines realistic menu items with pricing and descriptions
 */

export const sampleMenuItems = {
  'miwaku-premium': [
    {
      name: 'Lobster Thermidor',
      description: 'Fresh lobster baked in cream sauce with cognac, topped with cheese and herbs',
      price: 850000,
      is_featured: true,
      preparation_time: 25,
      dietary_info: ['gluten', 'dairy']
    },
    {
      name: 'Wagyu Steak',
      description: 'Premium Japanese A5 wagyu beef grilled to perfection, served with seasonal vegetables',
      price: 1200000,
      is_featured: true,
      preparation_time: 20,
      dietary_info: []
    },
    {
      name: 'Caviar Platter',
      description: 'Ossetra caviar served with traditional accompaniments and champagne',
      price: 1500000,
      is_featured: false,
      preparation_time: 15,
      dietary_info: []
    },
    {
      name: 'Champagne Pairing',
      description: 'Premium champagne selection to complement your meal',
      price: 450000,
      is_featured: false,
      preparation_time: 5,
      dietary_info: []
    }
  ],

  's79-teppanyaki': [
    {
      name: 'Teppanyaki Beef Set',
      description: 'Premium beef fillet with vegetables, fried rice, and teppanyaki sauce',
      price: 380000,
      is_featured: true,
      preparation_time: 25,
      dietary_info: ['soy_sauce']
    },
    {
      name: 'Grilled Lobster',
      description: 'Fresh lobster grilled with garlic butter, served with seasonal vegetables',
      price: 580000,
      is_featured: true,
      preparation_time: 20,
      dietary_info: ['dairy', 'shellfish']
    },
    {
      name: 'Vegetable Medley',
      description: 'Seasonal vegetables grilled teppanyaki style with sesame oil',
      price: 150000,
      is_featured: false,
      preparation_time: 15,
      dietary_info: ['vegan']
    },
    {
      name: 'Sakura Ice Cream',
      description: 'House-made ice cream with cherry blossom flavor',
      price: 85000,
      is_featured: false,
      preparation_time: 5,
      dietary_info: ['dairy']
    }
  ],

  'kohaku-sashimi-yakiniku': [
    {
      name: 'Salmon Sashimi Platter',
      description: 'Fresh Atlantic salmon sashimi with wasabi and pickled ginger',
      price: 280000,
      is_featured: true,
      preparation_time: 10,
      dietary_info: ['raw_fish']
    },
    {
      name: 'Wagyu Yakiniku',
      description: 'Premium wagyu beef slices for grilling, served with yakiniku sauce',
      price: 450000,
      is_featured: true,
      preparation_time: 20,
      dietary_info: ['soy_sauce']
    },
    {
      name: 'Mixed Sashimi Bowl',
      description: 'Assorted fresh sashimi over sushi rice with premium toppings',
      price: 320000,
      is_featured: false,
      preparation_time: 15,
      dietary_info: ['raw_fish', 'rice']
    },
    {
      name: 'Grilled Seafood',
      description: 'Mixed seafood platter grilled with Japanese herbs and spices',
      price: 380000,
      is_featured: false,
      preparation_time: 25,
      dietary_info: ['shellfish']
    }
  ],

  'kohaku-sushi': [
    {
      name: 'Salmon Nigiri',
      description: 'Fresh salmon over seasoned sushi rice',
      price: 85000,
      is_featured: true,
      preparation_time: 5,
      dietary_info: ['raw_fish', 'rice']
    },
    {
      name: 'California Roll',
      description: 'Crab, avocado, and cucumber roll with sesame seeds',
      price: 120000,
      is_featured: true,
      preparation_time: 10,
      dietary_info: ['rice', 'shellfish']
    },
    {
      name: 'Dragon Roll',
      description: 'Eel and cucumber roll topped with avocado',
      price: 180000,
      is_featured: false,
      preparation_time: 15,
      dietary_info: ['rice', 'fish']
    },
    {
      name: 'Tuna Sashimi',
      description: 'Fresh bluefin tuna sashimi with wasabi',
      price: 150000,
      is_featured: false,
      preparation_time: 5,
      dietary_info: ['raw_fish']
    },
    {
      name: 'Unagi Roll',
      description: 'Freshwater eel with cucumber and sweet eel sauce',
      price: 160000,
      is_featured: false,
      preparation_time: 12,
      dietary_info: ['rice', 'fish']
    }
  ],

  'kohaku-udon-ramen': [
    {
      name: 'Tonkotsu Ramen',
      description: 'Rich pork bone broth with ramen noodles, chashu, and soft-boiled egg',
      price: 125000,
      is_featured: true,
      preparation_time: 15,
      dietary_info: ['pork', 'eggs']
    },
    {
      name: 'Beef Udon',
      description: 'Thick udon noodles with tender beef and sweet soy sauce',
      price: 110000,
      is_featured: true,
      preparation_time: 12,
      dietary_info: ['beef', 'soy_sauce']
    },
    {
      name: 'Chicken Ramen',
      description: 'Clear chicken broth with ramen noodles and vegetables',
      price: 95000,
      is_featured: false,
      preparation_time: 12,
      dietary_info: ['chicken']
    },
    {
      name: 'Vegetable Udon',
      description: 'Udon noodles with seasonal vegetables in light broth',
      price: 85000,
      is_featured: false,
      preparation_time: 10,
      dietary_info: ['vegetarian']
    },
    {
      name: 'Pork Gyoza',
      description: 'Pan-fried pork dumplings with dipping sauce',
      price: 65000,
      is_featured: false,
      preparation_time: 10,
      dietary_info: ['pork']
    }
  ],

  'date-nariya': [
    {
      name: 'Grilled Gyutan Set',
      description: 'Premium beef tongue grilled with vegetables and rice',
      price: 280000,
      is_featured: true,
      preparation_time: 20,
      dietary_info: ['beef']
    },
    {
      name: 'Beef Tongue Steak',
      description: 'Tender beef tongue steak grilled to perfection',
      price: 320000,
      is_featured: true,
      preparation_time: 18,
      dietary_info: ['beef']
    },
    {
      name: 'Mixed Grill Plate',
      description: 'Assorted grilled meats with seasonal vegetables',
      price: 380000,
      is_featured: false,
      preparation_time: 25,
      dietary_info: ['beef', 'pork']
    },
    {
      name: 'Barley Rice',
      description: 'Traditional Japanese barley rice with herbs',
      price: 45000,
      is_featured: false,
      preparation_time: 8,
      dietary_info: ['gluten']
    },
    {
      name: 'Grilled Vegetables',
      description: 'Seasonal vegetables grilled with Japanese herbs',
      price: 75000,
      is_featured: false,
      preparation_time: 12,
      dietary_info: ['vegetarian']
    }
  ],

  'machida-shoten': [
    {
      name: 'Yakitori Skewers',
      description: 'Grilled chicken skewers with traditional tare sauce',
      price: 45000,
      is_featured: true,
      preparation_time: 15,
      dietary_info: ['chicken', 'soy_sauce']
    },
    {
      name: 'Karaage Chicken',
      description: 'Japanese fried chicken with dipping sauce',
      price: 85000,
      is_featured: true,
      preparation_time: 12,
      dietary_info: ['chicken']
    },
    {
      name: 'Edamame',
      description: 'Steamed soybeans with sea salt',
      price: 35000,
      is_featured: false,
      preparation_time: 5,
      dietary_info: ['soy']
    },
    {
      name: 'Sake Flight',
      description: 'Three different types of premium sake',
      price: 180000,
      is_featured: false,
      preparation_time: 5,
      dietary_info: []
    },
    {
      name: 'Tempura Platter',
      description: 'Mixed vegetables and shrimp in light tempura batter',
      price: 120000,
      is_featured: false,
      preparation_time: 15,
      dietary_info: ['shellfish', 'gluten']
    }
  ]
};

// Helper function to get sample items for a brand
export function getSampleItemsForBrand(brandId) {
  return sampleMenuItems[brandId] || [];
}

// Helper function to get featured items for a brand
export function getFeaturedItemsForBrand(brandId) {
  const items = getSampleItemsForBrand(brandId);
  return items.filter(item => item.is_featured);
}

// Helper function to get all sample item names
export function getAllSampleItemNames() {
  const allItems = new Set();

  Object.values(sampleMenuItems).forEach(items => {
    items.forEach(item => allItems.add(item.name));
  });

  return Array.from(allItems);
}