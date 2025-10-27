## 1. Setup Directus Integration Layer
- [ ] 1.1 Create Directus client configuration and service
- [ ] 1.2 Implement error handling and retry logic
- [ ] 1.3 Add data caching mechanism

## 2. Create Data Access Hooks
- [ ] 2.1 Implement `useBrands` hook for brand data fetching
- [ ] 2.2 Implement `useBranches` hook for branch data with brand relationships
- [ ] 2.3 Implement `useMenuItems` hook for menu data management
- [ ] 2.4 Implement `useTableLayouts` hook for layout and table data
- [ ] 2.5 Implement `useRealTimeSync` hook for live updates

## 3. Update Brand Management Components
- [ ] 3.1 Replace mock data in `BrandGroupedList.tsx` with Directus integration
- [ ] 3.2 Update `BrandGroup.tsx` to use real branch and table counts
- [ ] 3.3 Add loading states and error handling
- [ ] 3.4 Update `BranchCard.tsx` with real-time table data

## 4. Update Menu Management Pages
- [ ] 4.1 Replace mock brand menus in `menus/page.tsx` with Directus data
- [ ] 4.2 Implement brand menu to branch menu relationship logic
- [ ] 4.3 Add menu item availability management per branch
- [ ] 4.4 Update menu item statistics and counts

## 5. Update Layout Management
- [ ] 5.1 Replace mock layouts data in `layouts/page.tsx`
- [ ] 5.2 Implement real table count and zone management
- [ ] 5.3 Add QR code generation with real table data
- [ ] 5.4 Update layout templates with actual configurations

## 6. Add Data Synchronization Features
- [ ] 6.1 Implement automatic data refresh on changes
- [ ] 6.2 Add conflict resolution for concurrent updates
- [ ] 6.3 Create data validation and error reporting
- [ ] 6.4 Add offline mode with data persistence

## 7. Testing and Validation
- [ ] 7.1 Test data loading and error states
- [ ] 7.2 Validate brand-branch-menu relationships
- [ ] 7.3 Test real-time updates and synchronization
- [ ] 7.4 Performance testing with large datasets
- [ ] 7.5 User acceptance testing for all hub pages

## 8. Documentation and Deployment
- [ ] 8.1 Document data models and API usage
- [ ] 8.2 Create migration guide from mock to live data
- [ ] 8.3 Update component documentation
- [ ] 8.4 Deploy and monitor data integration performance