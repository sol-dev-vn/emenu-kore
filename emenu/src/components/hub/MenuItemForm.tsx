'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Upload,
  Trash2,
  ChefHat,
  DollarSign,
  Tag
} from 'lucide-react';
import { MenuItem } from '@/hooks/use-brand-menus';

interface MenuItemFormProps {
  item?: MenuItem | null;
  brandMenuId?: string;
  onSave: (itemData: Partial<MenuItem>) => Promise<void>;
  loading?: boolean;
}

export function MenuItemForm({ item, brandMenuId, onSave, loading = false }: MenuItemFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const brandId = brandMenuId || searchParams.get('brand') || '';

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    price: 0,
    category_id: '',
    is_active: true,
    is_available: true,
    unit_name: '',
    print_group: '',
    preparation_time: 15,
    spice_level: 0,
    dietary_info: [] as string[],
    allergens: [] as string[],
    image_url: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Initialize form data when editing an item
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        code: item.code || '',
        description: item.description || '',
        price: item.price || 0,
        category_id: item.category_id?.toString() || '',
        is_active: item.is_active ?? true,
        is_available: item.is_available ?? true,
        unit_name: item.unit_name || '',
        print_group: item.print_group || '',
        preparation_time: item.prepTime || 15,
        spice_level: item.spiceLevel || 0,
        dietary_info: item.dietaryInfo || [],
        allergens: item.allergenInfo || [],
        image_url: item.image_url || ''
      });
      setImagePreview(item.image_url || '');
    }
  }, [item]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleArrayInputChange = (field: 'dietary_info' | 'allergens', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(Boolean)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }
    if (!formData.code.trim()) {
      newErrors.code = 'Item code is required';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSave({
        ...formData,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        image: imageFile
      });
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleCancel = () => {
    if (brandId) {
      router.push(`/hub/brands/menu?brand=${brandId}`);
    } else {
      router.push('/hub/brands/menu');
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {item ? 'Edit Menu Item' : 'Create New Menu Item'}
        </h1>
        <Button
          variant="outline"
          onClick={handleCancel}
          className="text-gray-600"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Menu
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Item Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter menu item name"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="code">Item Code *</Label>
                    <Input
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="Enter unique item code"
                      className={errors.code ? 'border-red-500' : ''}
                    />
                    {errors.code && <p className="text-sm text-red-600">{errors.code}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter item description"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        className={`pl-10 ${errors.price ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
                  </div>

                  <div>
                    <Label htmlFor="category_id">Category</Label>
                    <Input
                      id="category_id"
                      name="category_id"
                      type="number"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      placeholder="Category ID"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="unit_name">Unit Name</Label>
                    <Input
                      id="unit_name"
                      name="unit_name"
                      value={formData.unit_name}
                      onChange={handleInputChange}
                      placeholder="e.g., pieces, bowl, portion"
                    />
                  </div>

                  <div>
                    <Label htmlFor="print_group">Print Group</Label>
                    <Input
                      id="print_group"
                      name="print_group"
                      value={formData.print_group}
                      onChange={handleInputChange}
                      placeholder="e.g., appetizers, mains"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preparation_time">Prep Time (minutes)</Label>
                    <Input
                      id="preparation_time"
                      name="preparation_time"
                      type="number"
                      min="1"
                      value={formData.preparation_time}
                      onChange={handleInputChange}
                      placeholder="15"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dietary & Allergen Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Dietary & Allergen Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="spice_level">Spice Level (0-3)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="spice_level"
                      name="spice_level"
                      type="range"
                      min="0"
                      max="3"
                      value={formData.spice_level}
                      onChange={handleInputChange}
                      className="flex-1"
                    />
                    <span className="w-16 text-center font-medium">
                      {'🌶️'.repeat(formData.spice_level)} {formData.spice_level}/3
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="dietary_info">Dietary Information (comma-separated)</Label>
                  <Input
                    id="dietary_info"
                    name="dietary_info"
                    value={formData.dietary_info.join(', ')}
                    onChange={(e) => handleArrayInputChange('dietary_info', e.target.value)}
                    placeholder="vegetarian, vegan, gluten-free, dairy-free"
                  />
                </div>

                <div>
                  <Label htmlFor="allergens">Allergens (comma-separated)</Label>
                  <Input
                    id="allergens"
                    name="allergens"
                    value={formData.allergens.join(', ')}
                    onChange={(e) => handleArrayInputChange('allergens', e.target.value)}
                    placeholder="nuts, shellfish, dairy, eggs, gluten"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    id="is_active"
                    name="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="is_active" className="font-medium">
                    Active
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    id="is_available"
                    name="is_available"
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="is_available" className="font-medium">
                    Available for ordering
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Item Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Menu item preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="w-12 h-12 mb-2" />
                      <p className="text-sm">No image</p>
                    </div>
                  )}
                </div>

                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Image
                  </Button>
                </div>

                <p className="text-xs text-gray-500">
                  Recommended: Square image, at least 400x400px
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                    style={{backgroundColor: '#9B1D20'}}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : (item ? 'Update Item' : 'Create Item')}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="w-full"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}