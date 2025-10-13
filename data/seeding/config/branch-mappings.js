/**
 * Branch to brand mappings for SOL restaurants
 * Maps existing branches to their appropriate brands based on restaurant type
 */

export const branchBrandMappings = [
  // Miwaku Premium - Landmark 81
  {
    branchName: 'Miwaku Premium Landmark 81',
    branchCode: 'MIWAKU_LANDMARK',
    brandId: 'miwaku-premium',
    description: 'Miwaku Premium restaurant at Landmark 81'
  },

  // S79 Japanese Teppanyaki branches
  {
    branchName: 'S79 Teppanyaki District 1',
    branchCode: 'S79_D1',
    brandId: 's79-teppanyaki',
    description: 'S79 Japanese Teppanyaki in District 1'
  },
  {
    branchName: 'S79 Teppanyaki District 7',
    branchCode: 'S79_D7',
    brandId: 's79-teppanyaki',
    description: 'S79 Japanese Teppanyaki in District 7'
  },

  // Kohaku Sashimi & Yakiniku branches
  {
    branchName: 'Kohaku Sashimi & Yakiniku District 1',
    branchCode: 'KOHAKU_SASHIMI_D1',
    brandId: 'kohaku-sashimi-yakiniku',
    description: 'Kohaku Sashimi & Yakiniku in District 1'
  },
  {
    branchName: 'Kohaku Sashimi & Yakiniku Thao Dien',
    branchCode: 'KOHAKU_SASHIMI_TD',
    brandId: 'kohaku-sashimi-yakiniku',
    description: 'Kohaku Sashimi & Yakiniku in Thao Dien'
  },

  // Kohaku Sushi branches
  {
    branchName: 'Kohaku Sushi District 1',
    branchCode: 'KOHAKU_SUSHI_D1',
    brandId: 'kohaku-sushi',
    description: 'Kohaku Sushi in District 1'
  },
  {
    branchName: 'Kohaku Sushi Phu My Hung',
    branchCode: 'KOHAKU_SUSHI_PMH',
    brandId: 'kohaku-sushi',
    description: 'Kohaku Sushi in Phu My Hung'
  },

  // Kohaku Udon & Ramen branches
  {
    branchName: 'Kohaku Udon & Ramen District 1',
    branchCode: 'KOHAKU_UDON_D1',
    brandId: 'kohaku-udon-ramen',
    description: 'Kohaku Udon & Ramen in District 1'
  },
  {
    branchName: 'Kohaku Udon & Ramen District 3',
    branchCode: 'KOHAKU_UDON_D3',
    brandId: 'kohaku-udon-ramen',
    description: 'Kohaku Udon & Ramen in District 3'
  },

  // Date Nariya branches
  {
    branchName: 'Date Nariya District 1',
    branchCode: 'DATE_NARIYA_D1',
    brandId: 'date-nariya',
    description: 'Date Nariya Gyutan Steak in District 1'
  },
  {
    branchName: 'Date Nariya Thao Dien',
    branchCode: 'DATE_NARIYA_TD',
    brandId: 'date-nariya',
    description: 'Date Nariya Gyutan Steak in Thao Dien'
  },

  // Machida Shoten branches
  {
    branchName: 'Machida Shoten District 1',
    branchCode: 'MACHIDA_D1',
    brandId: 'machida-shoten',
    description: 'Machida Shoten Izakaya in District 1'
  },
  {
    branchName: 'Machida Shoten Binh Thanh',
    branchCode: 'MACHIDA_BT',
    brandId: 'machida-shoten',
    description: 'Machida Shoten Izakaya in Binh Thanh'
  }
];

// Helper function to get brand ID for a branch
export function getBrandIdForBranch(branchName, branchCode) {
  const mapping = branchBrandMappings.find(
    mapping => mapping.branchName === branchName || mapping.branchCode === branchCode
  );
  return mapping?.brandId || null;
}

// Helper function to get all branches for a brand
export function getBranchesForBrand(brandId) {
  return branchBrandMappings.filter(mapping => mapping.brandId === brandId);
}

// Helper function to get all branch mappings
export function getAllBranchMappings() {
  return branchBrandMappings;
}