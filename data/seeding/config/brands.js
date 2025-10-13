/**
 * Brand configuration data for SOL restaurant brands
 * This configuration defines the 7 main brands with their properties
 */

export const brands = [
  {
    id: 'miwaku-premium',
    name: 'Miwaku Premium',
    slug: 'miwaku-premium',
    description: 'Iconic Anniversary Restaurant at Landmark 81 offering premium dining experience with breathtaking views of Ho Chi Minh City',
    brand_color: '#D4AF37', // Gold
    secondary_color: '#1A1A1A', // Dark Black
    website_url: 'https://www.sol.com.vn',
    contact_email: 'miwaku@sol.com.vn',
    contact_phone: '0888104799',
    cuisine_type: 'premium_japanese',
    price_range: '$$$$',
    special_features: ['anniversary_restaurant', 'landmark_81', 'premium_dining', 'city_views'],
    default_categories: ['Premium Appetizers', 'Main Course', 'Premium Desserts', 'Wine Pairing', 'Signature Dishes'],
    sample_items: ['Lobster Thermidor', 'Wagyu Steak', 'Caviar Platter', 'Champagne Pairing'],
    sort: 1
  },
  {
    id: 's79-teppanyaki',
    name: 'S79 Japanese Teppanyaki',
    slug: 's79-japanese-teppanyaki',
    description: 'Premium teppanyaki experience with skilled chefs preparing authentic Japanese dishes on iron grills',
    brand_color: '#DC143C', // Crimson Red
    secondary_color: '#2F4F4F', // Dark Slate Gray
    website_url: 'https://www.sol.com.vn',
    contact_email: 's79@sol.com.vn',
    contact_phone: '0888104799',
    cuisine_type: 'teppanyaki',
    price_range: '$$$',
    special_features: ['teppanyaki', 'live_cooking', 'chef_table', 'japanese_grill'],
    default_categories: ['Teppanyaki Starters', 'Main Grill', 'Seafood Specialties', 'Vegetarian Options', 'Desserts'],
    sample_items: ['Teppanyaki Beef Set', 'Grilled Lobster', 'Vegetable Medley', 'Sakura Ice Cream'],
    sort: 2
  },
  {
    id: 'kohaku-sashimi-yakiniku',
    name: 'Kohaku Sashimi & Yakiniku',
    slug: 'kohaku-sashimi-yakiniku',
    description: 'Traditional Japanese cuisine specializing in fresh sashimi and premium yakiniku grilled meats',
    brand_color: '#8B4513', // Saddle Brown
    secondary_color: '#F5DEB3', // Wheat
    website_url: 'https://www.sol.com.vn',
    contact_email: 'kohaku@sol.com.vn',
    contact_phone: '0888104799',
    cuisine_type: 'traditional_japanese',
    price_range: '$$$',
    special_features: ['sashimi', 'yakiniku', 'japanese_bbq', 'fresh_fish'],
    default_categories: ['Sashimi & Sushi', 'Yakiniku Grill', 'Hot Pot', 'Rice & Noodles', 'Beverages'],
    sample_items: ['Salmon Sashimi Platter', 'Wagyu Yakiniku', 'Mixed Sashimi Bowl', 'Grilled Seafood'],
    sort: 3
  },
  {
    id: 'kohaku-sushi',
    name: 'Kohaku Sushi',
    slug: 'kohaku-sushi',
    description: 'Authentic sushi and sashimi restaurant with master chefs preparing traditional Japanese delicacies',
    brand_color: '#000080', // Navy Blue
    secondary_color: '#FFFFFF', // White
    website_url: 'https://www.sol.com.vn',
    contact_email: 'sushi@sol.com.vn',
    contact_phone: '0888104799',
    cuisine_type: 'sushi',
    price_range: '$$$',
    special_features: ['sushi', 'sashimi', 'sushi_bar', 'japanese_artisan'],
    default_categories: ['Sushi Rolls', 'Nigiri Sushi', 'Sashimi', 'Temaki', 'Special Rolls', 'Beverages'],
    sample_items: ['Salmon Nigiri', 'California Roll', 'Dragon Roll', 'Tuna Sashimi', 'Unagi Roll'],
    sort: 4
  },
  {
    id: 'kohaku-udon-ramen',
    name: 'Kohaku Udon & Ramen',
    slug: 'kohaku-udon-ramen',
    description: 'Japanese noodle house specializing in hearty udon soups and flavorful ramen bowls',
    brand_color: '#FF8C00', // Dark Orange
    secondary_color: '#8B0000', // Dark Red
    website_url: 'https://www.sol.com.vn',
    contact_email: 'udon-ramen@sol.com.vn',
    contact_phone: '0888104799',
    cuisine_type: 'noodles',
    price_range: '$$',
    special_features: ['udon', 'ramen', 'japanese_noodles', 'soup_bowls'],
    default_categories: ['Ramen Bowls', 'Udon Noodles', 'Appetizers', 'Gyoza & Dumplings', 'Drinks'],
    sample_items: ['Tonkotsu Ramen', 'Beef Udon', 'Chicken Ramen', 'Vegetable Udon', 'Pork Gyoza'],
    sort: 5
  },
  {
    id: 'date-nariya',
    name: 'Date Nariya',
    slug: 'date-nariya',
    description: 'Specialized Japanese Gyutan steak restaurant featuring premium beef tongue and grilled specialties',
    brand_color: '#800020', // Burgundy
    secondary_color: '#FFD700', // Gold
    website_url: 'https://www.sol.com.vn',
    contact_email: 'datenariya@sol.com.vn',
    contact_phone: '0888104799',
    cuisine_type: 'gyutan_steak',
    price_range: '$$$',
    special_features: ['gyutan', 'beef_tongue', 'japanese_steak', 'grill_specialties'],
    default_categories: ['Gyutan Specialties', 'Grilled Meats', 'Appetizers', 'Rice Dishes', 'Beverages'],
    sample_items: ['Grilled Gyutan Set', 'Beef Tongue Steak', 'Mixed Grill Plate', 'Barley Rice', 'Grilled Vegetables'],
    sort: 6
  },
  {
    id: 'machida-shoten',
    name: 'Machida Shoten',
    slug: 'machida-shoten',
    description: 'Traditional Japanese izakaya offering authentic atmosphere with extensive sake selection and Japanese tapas',
    brand_color: '#2F4F4F', // Dark Slate Gray
    secondary_color: '#DAA520', // Goldenrod
    website_url: 'https://www.sol.com.vn',
    contact_email: 'machida@sol.com.vn',
    contact_phone: '0888104799',
    cuisine_type: 'izakaya',
    price_range: '$$',
    special_features: ['izakaya', 'sake_bar', 'japanese_tapas', 'casual_dining'],
    default_categories: ['Izakaya Small Plates', 'Yakitori', 'Sashimi', 'Sake Selection', 'Desserts'],
    sample_items: ['Yakitori Skewers', 'Karaage Chicken', 'Edamame', 'Sake Flight', 'Tempura Platter'],
    sort: 7
  }
];

// Helper function to get brand by ID
export function getBrandById(id) {
  return brands.find(brand => brand.id === id);
}

// Helper function to get brand by slug
export function getBrandBySlug(slug) {
  return brands.find(brand => brand.slug === slug);
}

// Helper function to get all brands sorted by sort order
export function getAllBrands() {
  return brands.sort((a, b) => a.sort - b.sort);
}