/**
 * File upload utilities for seeding process
 * Handles placeholder image creation and file management
 */

import fs from 'fs/promises';
import path from 'path';

export class FileUploader {
  constructor(directusUrl, token) {
    this.directusUrl = directusUrl;
    this.token = token;
  }

  /**
   * Create a placeholder SVG image for brands
   */
  createBrandPlaceholder(brandName, brandColor, backgroundColor = '#FFFFFF') {
    const svg = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="${backgroundColor}"/>
        <rect width="200" height="200" fill="${brandColor}" opacity="0.1"/>
        <circle cx="100" cy="80" r="40" fill="${brandColor}" opacity="0.8"/>
        <text x="100" y="150" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="${brandColor}">
          ${brandName}
        </text>
        <text x="100" y="170" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#666">
          Brand Logo
        </text>
      </svg>
    `.trim();

    return Buffer.from(svg);
  }

  /**
   * Create a placeholder SVG image for categories
   */
  createCategoryPlaceholder(categoryName, color = '#E5E7EB') {
    const svg = `
      <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="150" height="150" fill="${color}"/>
        <rect x="20" y="20" width="110" height="110" fill="#FFFFFF" opacity="0.9" rx="8"/>
        <circle cx="75" cy="60" r="15" fill="#9CA3AF"/>
        <rect x="40" y="85" width="70" height="8" fill="#D1D5DB" rx="4"/>
        <rect x="40" y="100" width="50" height="6" fill="#E5E7EB" rx="3"/>
        <text x="75" y="130" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#666">
          ${categoryName}
        </text>
      </svg>
    `.trim();

    return Buffer.from(svg);
  }

  /**
   * Upload a file to Directus
   */
  async uploadFile(fileBuffer, filename, folder = null) {
    try {
      const formData = new FormData();
      const blob = new Blob([fileBuffer], { type: 'image/svg+xml' });
      formData.append('file', blob, filename);

      if (folder) {
        formData.append('folder', folder);
      }

      const response = await fetch(`${this.directusUrl}/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`Error uploading file ${filename}:`, error);
      throw error;
    }
  }

  /**
   * Ensure brand logos folder exists
   */
  async ensureBrandLogosFolder() {
    try {
      // Check if folder exists
      const response = await fetch(`${this.directusUrl}/folders?filter[name][_eq]=brands/logos`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        }
      });

      const result = await response.json();

      if (result.data.length > 0) {
        return result.data[0].id;
      }

      // Create folder
      const createResponse = await fetch(`${this.directusUrl}/folders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'logos',
          parent: await this.ensureBrandsFolder()
        })
      });

      if (!createResponse.ok) {
        throw new Error(`Failed to create logos folder: ${createResponse.statusText}`);
      }

      const createResult = await createResponse.json();
      return createResult.data.id;
    } catch (error) {
      console.error('Error ensuring brand logos folder:', error);
      return null;
    }
  }

  /**
   * Ensure brands folder exists
   */
  async ensureBrandsFolder() {
    try {
      const response = await fetch(`${this.directusUrl}/folders?filter[name][_eq]=brands`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        }
      });

      const result = await response.json();

      if (result.data.length > 0) {
        return result.data[0].id;
      }

      // Create folder
      const createResponse = await fetch(`${this.directusUrl}/folders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'brands'
        })
      });

      if (!createResponse.ok) {
        throw new Error(`Failed to create brands folder: ${createResponse.statusText}`);
      }

      const createResult = await createResponse.json();
      return createResult.data.id;
    } catch (error) {
      console.error('Error ensuring brands folder:', error);
      return null;
    }
  }

  /**
   * Upload brand logo
   */
  async uploadBrandLogo(brandName, brandColor, backgroundColor = '#FFFFFF') {
    try {
      const filename = `${brandName.toLowerCase().replace(/\s+/g, '-')}-logo.svg`;
      const imageBuffer = this.createBrandPlaceholder(brandName, brandColor, backgroundColor);
      const folderId = await this.ensureBrandLogosFolder();

      return await this.uploadFile(imageBuffer, filename, folderId);
    } catch (error) {
      console.error(`Error uploading brand logo for ${brandName}:`, error);
      return null;
    }
  }
}