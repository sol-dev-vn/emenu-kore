# Design Document: Enhanced Hub Portal

## Architecture Overview

The enhanced hub portal transforms the current static prototype into a fully functional staff management interface with real-time data, proper authentication, and professional user experience.

## Component Architecture

### Authentication Layer
```
/auth/login (route)
├── LoginForm component
├── Phone/Email validation
├── Directus SDK integration
└── Session management
```

### Hub Layout Structure
```
/hub (layout)
├── NavigationHeader
│   ├── Brand/Branch context
│   ├── User profile
│   └── Notification center
├── SidebarNavigation
│   ├── Role-based menu items
│   ├── Quick stats widget
│   └── Context switcher
└── MainContentArea
    ├── Loading states and transitions
    ├── Route-specific content
    └── Error boundaries
```

### Core Components
```
/components/
├── ui/
│   ├── Flowbite Components/
│   │   ├── Button, Card, Modal, Dropdown from Flowbite Svelte
│   │   ├── Table, Badge, Alert, Tooltip from Flowbite Svelte
│   │   ├── Form components: Input, Select, Checkbox from Flowbite Svelte
│   │   ├── Navigation: Navbar, Sidebar, Breadcrumb from Flowbite Svelte
│   │   └── Data Display: Chart, Timeline, Pagination from Flowbite Svelte
│   ├── Custom Components/
│   │   ├── Loading/
│   │   │   ├── SkeletonLoader.svelte
│   │   │   ├── BlurTransition.svelte
│   │   │   └── ProgressBar.svelte
│   │   ├── Tables/
│   │   │   ├── TableGrid.svelte (extends Flowbite Table)
│   │   │   ├── TableCard.svelte (extends Flowbite Card)
│   │   │   └── ZoneLayout.svelte
│   │   ├── Dashboard/
│   │   │   ├── MetricCard.svelte (extends Flowbite Card)
│   │   │   ├── ActivityFeed.svelte
│   │   │   └── StatusIndicator.svelte (extends Flowbite Badge)
│   │   └── QR/
│   │       ├── QRGenerator.svelte
│   │       ├── QRPreview.svelte
│   │       └── PDFExport.svelte
│   └── Layout Components/
│       ├── Sidebar.svelte (based on Flowbite Sidebar)
│       ├── Header.svelte (based on Flowbite Navbar)
│       └── Footer.svelte (based on Flowbite components)
```

## Data Flow Architecture

### Authentication Flow
1. **Login Request**: User submits email/phone + password
2. **Directus Auth**: Authenticate via Directus REST API
3. **Token Management**: Store access/refresh tokens securely
4. **Session Context**: Set user context with permissions
5. **Route Protection**: Protect routes based on user roles

### Real-time Data Flow
1. **Initial Load**: Server-side data fetching for initial state
2. **Client Updates**: WebSocket connections for real-time updates
3. **Cache Management**: Local state with optimistic updates
4. **Error Handling**: Graceful degradation when connection lost

### Branch Context Switching
1. **Permission Check**: Verify user has access to target branch
2. **Data Reload**: Fetch all data for new branch context
3. **UI Updates**: Transition animations while loading
4. **State Persistence**: Maintain user preference for future sessions

## Tailwind CSS Design System

### Color Palette Extension
```scss
// Bright theme design tokens
$primary-gradient: linear-gradient(135deg, #06b6d4, #14b8a6);
$success-gradient: linear-gradient(135deg, #10b981, #06b6d4);
$warning-gradient: linear-gradient(135deg, #f59e0b, #f97316);
$danger-gradient: linear-gradient(135deg, #ef4444, #dc2626);

// Bright theme surface colors
$surface-primary: #ffffff;
$surface-secondary: #f8fafc;
$surface-tertiary: #f1f5f9;
$surface-border: #e2e8f0;
$surface-hover: #f1f5f9;

// Bright theme text colors
$text-primary: #0f172a;
$text-secondary: #1e293b;
$text-tertiary: #334155;
$text-muted: #64748b;

// Dark theme design tokens
$primary-gradient-dark: linear-gradient(135deg, #22d3ee, #2dd4bf);
$success-gradient-dark: linear-gradient(135deg, #34d399, #22d3ee);
$warning-gradient-dark: linear-gradient(135deg, #fbbf24, #f59e0b);
$danger-gradient-dark: linear-gradient(135deg, #f87171, #ef4444);

// Dark theme surface colors
$surface-primary-dark: #0f172a;
$surface-secondary-dark: #1e293b;
$surface-tertiary-dark: #334155;
$surface-border-dark: #475569;
$surface-hover-dark: #475569;

// Dark theme text colors
$text-primary-dark: #f1f5f9;
$text-secondary-dark: #e2e8f0;
$text-tertiary-dark: #cbd5e1;
$text-muted-dark: #94a3b8;

// SOL brand colors (theme optimized)
$cyan-accent: #06b6d4;
$cyan-accent-dark: #22d3ee;
$medium-teal: #14b8a6;
$medium-teal-dark: #2dd4bf;
$light-mint: #a7f3d0;
$blue-accent: #3b82f6;

// Status colors (high contrast)
$success: #10b981;
$success-dark: #34d399;
$warning: #f59e0b;
$warning-dark: #fbbf24;
$error: #ef4444;
$error-dark: #f87171;
$info: #3b82f6;
```

### Animation System
```scss
// Loading and transition animations
@keyframes blur-in {
  from {
    filter: blur(8px);
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    filter: blur(0);
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
```

### Component Patterns
- **Card-based layouts** with consistent spacing and shadows
- **Glassmorphism effects** for modern, layered interface
- **Micro-interactions** for hover states and transitions
- **Responsive grids** using Tailwind's grid system

## Flowbite Svelte Integration

### UI Component Library Strategy
The system shall leverage Flowbite Svelte as the primary UI component library to accelerate development and ensure consistency.

#### Component Library Benefits
- **Rapid Development**: Pre-built, accessible components for common UI patterns
- **Consistent Design**: Built-in design system with Tailwind CSS integration
- **Accessibility**: WCAG compliant components with proper ARIA support
- **Customization**: Easy theming and customization through Tailwind classes
- **Documentation**: Comprehensive documentation with examples and best practices

#### Flowbite Component Categories
1. **Navigation Components**: Navbar, Sidebar, Breadcrumb, Pagination
2. **Form Components**: Input, Select, Checkbox, Radio, Textarea
3. **Data Display**: Table, Card, Badge, Alert, Tooltip
4. **Feedback**: Modal, Dropdown, Toast, Spinner
5. **Layout**: Container, Grid, Flex utilities

#### Custom Component Integration
- **Extended Components**: Custom components that extend Flowbite base components
- **Theme Consistency**: Apply bright theme to Flowbite components using CSS custom properties
- **Animation Layer**: Add custom animations and transitions to Flowbite components
- **Business Logic**: Wrap Flowbite components with business-specific functionality

### Flowbite Implementation Strategy
1. **Base Setup**: Install and configure Flowbite Svelte with Tailwind CSS
2. **Theme Integration**: Apply bright theme to Flowbite component styles
3. **Component Wrapping**: Create wrapper components for common patterns
4. **Custom Extensions**: Extend Flowbite components for specific business needs
5. **Documentation**: Document custom components and usage patterns

## Performance Considerations

### Loading Strategy
1. **Progressive Loading**: Load critical content first, then enhance
2. **Skeleton States**: Show content structure during data loading
3. **Optimistic Updates**: Update UI immediately, rollback if needed
4. **Caching**: Cache frequently accessed data (branch info, user data)

### Real-time Updates
1. **WebSocket Connection**: Maintain persistent connection for live data
2. **Batch Updates**: Group multiple updates to reduce render cycles
3. **Connection Management**: Automatic reconnection with exponential backoff
4. **Resource Management**: Cleanup connections when component unmounts

### Mobile Optimization
1. **Touch Interactions**: Large touch targets for mobile devices
2. **Responsive Layouts**: Adaptive layouts for different screen sizes
3. **Performance**: Optimize for mobile network conditions
4. **Offline Support**: Basic functionality when connection lost

## Security Architecture

### Authentication Security
1. **Token Storage**: Use httpOnly cookies for access tokens
2. **CSRF Protection**: Implement CSRF token validation
3. **Session Management**: Automatic token refresh and expiration
4. **Role Validation**: Server-side permission checking

### Data Security
1. **API Security**: All API calls through backend proxy
2. **Input Validation**: Client and server-side validation
3. **XSS Prevention**: Proper content sanitization
4. **Secure Headers**: Implement security headers

## Integration Points

### Directus Integration
- **Authentication**: Using Directus auth endpoints
- **Data Fetching**: Directus SDK for CRUD operations
- **Real-time**: Directus webhook system for events
- **File Management**: Directus file handling for QR codes

### CukCuk Integration
- **Menu Synchronization**: Existing sync scripts integration
- **Order Management**: Future order system integration
- **Table Status**: Real-time table status synchronization
- **Performance Data**: Sales and operational metrics

## Error Handling Strategy

### Client-side Errors
1. **Network Errors**: Retry with exponential backoff
2. **Validation Errors**: Inline form validation feedback
3. **Permission Errors**: Redirect to appropriate page or show access denied
4. **Unknown Errors**: Generic error page with retry option

### Server-side Errors
1. **Authentication Errors**: Clear tokens and redirect to login
2. **Data Errors**: Show error state with option to retry
3. **Connection Errors**: Queue updates and sync when reconnected
4. **Service Errors**: Graceful degradation with offline mode

This design ensures a robust, performant, and user-friendly hub portal that meets the requirements for real restaurant operations while maintaining security and best practices.