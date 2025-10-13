/**
 * Data validation utilities for seeding process
 */

export function validateBrandData(brand) {
  const required = ['id', 'name', 'slug', 'description', 'brand_color'];
  const missing = required.filter(field => !brand[field]);

  if (missing.length > 0) {
    throw new Error(`Brand ${brand.name || 'unknown'} missing required fields: ${missing.join(', ')}`);
  }

  // Validate color format (hex)
  if (!/^#[0-9A-Fa-f]{6}$/.test(brand.brand_color)) {
    throw new Error(`Brand ${brand.name} has invalid color format: ${brand.brand_color}`);
  }

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(brand.slug)) {
    throw new Error(`Brand ${brand.name} has invalid slug format: ${brand.slug}`);
  }

  return true;
}

export function validateBrandMenuData(menu) {
  const required = ['brand', 'name', 'default_currency', 'tax_rate', 'service_rate'];
  const missing = required.filter(field => menu[field] === undefined || menu[field] === null);

  if (missing.length > 0) {
    throw new Error(`Brand menu missing required fields: ${missing.join(', ')}`);
  }

  // Validate currency format
  if (!/^[A-Z]{3}$/.test(menu.default_currency)) {
    throw new Error(`Invalid currency format: ${menu.default_currency}`);
  }

  // Validate rates are non-negative numbers
  if (typeof menu.tax_rate !== 'number' || menu.tax_rate < 0) {
    throw new Error(`Tax rate must be a non-negative number: ${menu.tax_rate}`);
  }

  if (typeof menu.service_rate !== 'number' || menu.service_rate < 0) {
    throw new Error(`Service rate must be a non-negative number: ${menu.service_rate}`);
  }

  return true;
}

export function validateCategoryData(category) {
  const required = ['name', 'slug', 'brand'];
  const missing = required.filter(field => !category[field]);

  if (missing.length > 0) {
    throw new Error(`Category missing required fields: ${missing.join(', ')}`);
  }

  return true;
}