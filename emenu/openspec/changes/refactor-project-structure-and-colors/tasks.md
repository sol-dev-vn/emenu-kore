## 1. Layout System Consolidation
- [ ] 1.1 Update root layout.tsx routing logic to use exactly 2 layouts
- [ ] 1.2 Remove inline layout from [[...permalink]]/page.tsx and route to PublicLayout
- [ ] 1.3 Update login page to use PublicLayout instead of inline layout
- [ ] 1.4 Remove any remaining custom layouts and route to appropriate standard layout
- [ ] 1.5 Update getLayoutType() function to handle all route patterns consistently

## 2. Hub Layout Standardization
- [ ] 2.1 Review and enhance HubLayout component for D.R.Y principles
- [ ] 2.2 Ensure HubAuthGuard is applied consistently to all /hub/* routes
- [ ] 2.3 Update HubSidebar navigation to reflect current route structure
- [ ] 2.4 Verify HubHeader and Breadcrumb components work with all hub pages
- [ ] 2.5 Test responsive behavior of HubLayout across all device sizes

## 3. Color System Implementation
- [ ] 3.1 Update styling-constants.ts with comprehensive color utilities
- [ ] 3.2 Extend CSS variables in globals.css for complete color system
- [ ] 3.3 Create TypeScript color types and safety utilities
- [ ] 3.4 Update tailwind.config.ts to enforce brand color usage
- [ ] 3.5 Add build-time color validation to prevent hardcoded values

## 4. Hardcoded Color Migration - High Priority Files
- [ ] 4.1 Update src/components/hub/ErrorBoundary.tsx - remove all red-xxx classes
- [ ] 4.2 Update src/components/hub/LoadingSkeleton.tsx - replace hardcoded #FFE4E1
- [ ] 4.3 Update src/components/hub/BranchHeader.tsx - replace hardcoded #9B1D20 values
- [ ] 4.4 Update src/lib/hub-navigation.ts - replace bg-red-600 with brand colors
- [ ] 4.5 Update src/components/hub/SearchBar.tsx - replace focus:ring-red-500

## 5. Hardcoded Color Migration - Medium Priority Files
- [ ] 5.1 Update all hub page components in src/app/hub/
- [ ] 5.2 Update remaining components with hardcoded color values
- [ ] 5.3 Replace all default Tailwind red variants with brand equivalents
- [ ] 5.4 Update error states and loading indicators across all components
- [ ] 5.5 Replace inline style attributes with CSS variables or brand classes

## 6. Authentication Pattern Standardization
- [ ] 6.1 Review HubAuthGuard implementation and ensure proper role checking
- [ ] 6.2 Remove any manual authentication logic from individual pages
- [ ] 6.3 Ensure consistent redirect patterns (/) for unauthenticated access
- [ ] 6.4 Verify permission checking works across all hub routes
- [ ] 6.5 Test loading and error states in authentication flow

## 7. Testing and Validation
- [ ] 7.1 Test all public pages use PublicLayout consistently
- [ ] 7.2 Test all hub pages use HubLayout and require authentication
- [ ] 7.3 Validate color consistency across all components and pages
- [ ] 7.4 Test responsive behavior on mobile and desktop
- [ ] 7.5 Perform visual regression testing for color changes

## 8. Documentation and Cleanup
- [ ] 8.1 Update project documentation with layout and color guidelines
- [ ] 8.2 Create developer guidelines for color usage
- [ ] 8.3 Remove unused layout components and files
- [ ] 8.4 Clean up any remaining code duplication
- [ ] 8.5 Update README with development standards for colors and layouts