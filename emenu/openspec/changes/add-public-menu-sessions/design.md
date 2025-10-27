# Design Considerations for Public Menu Layout

## Layout Architecture

### Three Layout System
The existing refactor proposal establishes 2 layouts (PublicLayout and HubLayout). This change introduces a third specialized layout:

- **PublicLayout**: Centered landing pages (home, login)
- **HubLayout**: Admin dashboard with sidebar navigation
- **MenuLayout**: Guest-facing mobile-optimized menu interface

### Layout Detection Strategy
```typescript
// Updated layout-utils.ts structure
export function getLayoutType(pathname: string): LayoutType {
  if (pathname === '/' || pathname === '/login') {
    return 'public';
  }
  if (pathname.startsWith('/hub')) {
    return 'hub';
  }
  if (pathname.startsWith('/menu')) {
    return 'menu';
  }
  return 'default';
}
```

## Guest User Session Design

### Session State Management
- No authentication required
- Temporary session tied to table + device
- In-memory state with optional localStorage persistence
- Session expiration tied to restaurant operational hours

### Profile Management
- Default naming: "Guest 1", "Guest 2", etc.
- Custom display names without account creation
- Avatar selection from predefined options
- Session-local preference storage

## Mobile-First Interface Design

### Responsive Breakpoints
- Mobile: 320px - 768px (primary target)
- Tablet: 768px - 1024px (secondary optimization)
- Desktop: 1024px+ (minor consideration)

### Touch Interaction Patterns
- Large tap targets (44px minimum)
- Swipe gestures for category navigation
- Pull-to-refresh for menu updates
- Long-press for item details

## Information Architecture

### Menu Organization
```
/menu
├── Categories (horizontal scroll)
│   ├── Appetizers
│   ├── Main Courses
│   ├── Desserts
│   └── Beverages
├── Menu Items (grid layout)
│   ├── Image
│   ├── Name & Price
│   ├── Dietary badges
│   └── Quick add button
└── Guest Profile (floating action)
    ├── Display name
    ├── Edit option
    └── Session info
```

### Data Flow
1. QR Code Scan → Table Session Creation
2. Table Session → Branch Context Loading
3. Branch Context → Menu Items Filtering
4. Guest Profile → Session Association
5. Menu Interaction → Order Preparation (future scope)

## Technical Integration Points

### Directus Schema Alignment
Mock data structures will mirror these Directus collections:
- `brands` → Restaurant branding information
- `branches` → Location-specific data and menus
- `menu_items` → Individual menu items with metadata
- `tables` → Table session management

### Component Hierarchy
```
MenuLayout
├── Header (brand info, table number)
├── CategoryNavigation
├── MenuGrid
│   └── MenuItemCard
├── GuestProfile (FAB)
└── SessionProvider
```

## Styling Integration

### Color System Application
- Primary ruby red (#9B1D20): Actions, accents, important info
- Peach-red background (#FFE4E1): Soft backgrounds, highlights
- Dark gray text (#333333): Primary content text
- Light gray (#F5F5F5): Secondary backgrounds, dividers

### Typography Scale
- Mobile-optimized font sizes
- High contrast for readability
- Hierarchical information display
- Consistent with admin interface

## Performance Considerations

### Mobile Optimization
- Minimal JavaScript bundle size
- Optimized images for mobile networks
- Smooth 60fps animations
- Progressive loading of menu categories

### Offline Capabilities
- Basic menu caching for poor connectivity
- Guest profile preservation in localStorage
- Graceful degradation for network issues