# QR Scanning Integration Test Suite

## Overview
This document outlines the comprehensive integration test suite for the SOL eMenu QR scanning functionality, ensuring that table QR codes work correctly from generation to menu display.

## Current Architecture Analysis

### QR Code Flow
1. **QR Code Generation**: QR codes contain URLs pointing to `/qr?table=TABLE_ID`
2. **QR Scan Redirect**: User scans QR code → browser opens URL
3. **Table Validation**: Frontend validates table ID via `/api/tables/[tableId]`
4. **Branch Lookup**: Frontend fetches branch info via `/api/branches/[branchId]`
5. **Menu Display**: QR menu page displays table and branch information

### Current Components
- **QRMenuPage** (`/src/app/qr/QRMenuPageContent.tsx`): Main QR scanning interface
- **Table API** (`/src/app/api/tables/[tableId]/route.ts`): Table lookup endpoint
- **Branch API** (`/src/app/api/branches/[branchId]/route.ts`): Branch lookup endpoint
- **Mock Data**: Current implementation uses mock data for tables and branches

## Test Suite Structure

### 1. QR Code Generation and Validation Tests

#### 1.1 QR Code Format Tests
- **Test**: QR code URL format validation
- **Expected**: `https://domain.com/qr?table=TABLE_ID`
- **Test Cases**:
  - Valid table ID formats (A01, B02, C01, etc.)
  - Case sensitivity handling
  - Special characters in table IDs
  - Invalid table ID formats

#### 1.2 QR Code Content Tests
- **Test**: QR code contains correct URL structure
- **Expected**: Properly encoded URL with table parameter
- **Test Cases**:
  - Standard ASCII table IDs
  - Unicode characters in table IDs
  - URL encoding of special characters
  - Malformed URL handling

### 2. Table-to-URL Mapping Tests

#### 2.1 Table Existence Tests
- **Test**: API returns correct table data for valid table IDs
- **Expected**: Table object with id, name, code, capacity, zone, branch_id, status
- **Test Cases**:
  - Valid existing tables (A01, A02, B01, C01)
  - Non-existent tables (X99, INVALID)
  - Case variations (a01, A01)
  - Empty table ID
  - Null table ID

#### 2.2 Branch Association Tests
- **Test**: Correct branch information for each table
- **Expected**: Accurate branch data for each table's branch_id
- **Test Cases**:
  - Tables in same branch
  - Tables in different branches
  - Invalid branch associations
  - Missing branch information

#### 2.3 API Response Tests
- **Test**: API handles various request scenarios correctly
- **Expected**: Proper HTTP status codes and response formats
- **Test Cases**:
  - Valid table ID → 200 OK
  - Invalid table ID → 404 Not Found
  - Malformed requests → 400 Bad Request
  - Server errors → 500 Internal Server Error

### 3. QR Scan Redirect Flow Tests

#### 3.1 URL Parameter Tests
- **Test**: Frontend correctly parses and validates table parameters
- **Expected**: Proper extraction of table ID from URL query parameters
- **Test Cases**:
  - Standard table parameter: `?table=A01`
  - Missing table parameter
  - Empty table parameter: `?table=`
  - Multiple parameters: `?table=A01&other=value`
  - Encoded table IDs: `?table=A%2001`

#### 3.2 Data Loading Tests
- **Test**: Sequential loading of table and branch data
- **Expected**: Successful API calls and proper data handling
- **Test Cases**:
  - Valid table and branch data loading
  - Network error handling
  - API timeout handling
  - Malformed API response handling
  - Loading state management

#### 3.3 Error Handling Tests
- **Test**: Graceful error handling for various failure scenarios
- **Expected**: User-friendly error messages and recovery options
- **Test Cases**:
  - Table not found error
  - Branch not found error
  - Network connectivity issues
  - API server unavailable
  - Invalid JSON responses

### 4. User Interface Tests

#### 4.1 Loading States
- **Test**: Proper loading indicators during data fetching
- **Expected**: Spinner or loading message visible
- **Test Cases**:
  - Initial page load
  - Table data loading
  - Branch data loading
  - Loading text localization

#### 4.2 Error Display
- **Test**: Clear error messages for different failure types
- **Expected**: User-friendly error messages with actions
- **Test Cases**:
  - Table not found message
  - Network error message
  - Generic error fallback
  - Error recovery options (Go Back, Home)

#### 4.3 Success State
- **Test**: Correct display of table and branch information
- **Expected**: Accurate information display
- **Test Cases**:
  - Table name display
  - Branch name display
  - Welcome message formatting
  - UI layout responsiveness

### 5. End-to-End Workflow Tests

#### 5.1 Complete QR Scan Flow
- **Test**: Full user journey from QR scan to menu display
- **Expected**: Seamless navigation through all steps
- **Test Cases**:
  - Happy path: Valid QR code → Menu display
  - Invalid QR code → Error page
  - Malformed URL → Error handling
  - Network issues → Retry mechanisms

#### 5.2 Cross-Device Compatibility
- **Test**: QR scanning works across different devices and browsers
- **Expected**: Consistent behavior across platforms
- **Test Cases**:
  - iOS devices (Safari, Chrome)
  - Android devices (Chrome, Firefox)
  - Desktop browsers
  - Tablet responsiveness

#### 5.3 Performance Tests
- **Test**: Page load times and responsiveness
- **Expected**: Fast loading and smooth interactions
- **Test Cases**:
  - Initial page load time (< 2 seconds)
  - API response times (< 1 second)
  - Loading state transitions
  - Memory usage on mobile devices

### 6. Integration with Directus Tests

#### 6.1 Database Connection Tests
- **Test**: Directus API connectivity and data retrieval
- **Expected**: Successful data fetching from Directus collections
- **Test Cases**:
  - Tables collection queries
  - Branches collection queries
  - Related data fetching
  - API authentication
  - Rate limiting handling

#### 6.2 Data Synchronization Tests
- **Test**: Data consistency between CukCuk sync and Directus
- **Expected**: Up-to-date table and branch information
- **Test Cases**:
  - Real-time data sync
  - Stale data handling
  - Cache invalidation
  - Data conflict resolution

## Test Implementation Plan

### Phase 1: Unit Tests
1. **QR Code Validation Utils**
   - URL format validation
   - Table ID parsing
   - Error handling utilities

2. **API Endpoint Tests**
   - Table endpoint responses
   - Branch endpoint responses
   - Error scenarios

3. **Component Tests**
   - QRMenuPage component rendering
   - Loading state management
   - Error boundary handling

### Phase 2: Integration Tests
1. **API Integration Tests**
   - Frontend-API communication
   - Data flow validation
   - Error propagation

2. **Route Handling Tests**
   - URL parameter parsing
   - Navigation flow
   - Redirect behavior

### Phase 3: End-to-End Tests
1. **Full User Journey Tests**
   - QR code scanning simulation
   - Complete workflow validation
   - Cross-browser testing

2. **Performance Tests**
   - Load testing
   - Stress testing
   - Mobile performance

## Test Tools and Framework

### Testing Frameworks
- **Jest**: Unit and integration tests
- **React Testing Library**: Component testing
- **Playwright**: End-to-end testing
- **MSW**: API mocking for tests

### Test Utilities
- **QR Code Generator**: Mock QR code creation
- **Network Simulation**: Slow/fast network testing
- **Device Simulation**: Mobile/desktop testing
- **Performance Monitoring**: Load time tracking

## Success Criteria

### Functional Requirements
- ✅ All valid table IDs load successfully
- ✅ Invalid table IDs show appropriate errors
- ✅ Network issues are handled gracefully
- ✅ UI displays correctly on all devices
- ✅ Performance meets target benchmarks

### Non-Functional Requirements
- ✅ Page load time < 2 seconds
- ✅ API response time < 1 second
- ✅ 99.9% uptime for QR scanning flow
- ✅ Cross-browser compatibility
- ✅ Mobile-first responsive design

## Risk Mitigation

### Identified Risks
1. **Network Connectivity**: Offline mode or poor connections
2. **Invalid QR Codes**: Malformed or outdated QR codes
3. **Data Synchronization**: Stale or inconsistent data
4. **Cross-Platform Issues**: Browser/OS compatibility
5. **Performance Bottlenecks**: Slow loading or API delays

### Mitigation Strategies
1. **Error Recovery**: Retry mechanisms and fallback options
2. **Input Validation**: Robust validation and sanitization
3. **Caching Strategy**: Smart caching with invalidation
4. **Testing Coverage**: Comprehensive cross-platform testing
5. **Performance Optimization**: Code splitting and lazy loading

## Next Steps

1. **Set up testing environment** with required frameworks
2. **Implement unit tests** for core utilities and components
3. **Create API integration tests** for backend endpoints
4. **Build end-to-end test scenarios** for complete user flows
5. **Establish CI/CD pipeline** for automated testing
6. **Monitor and maintain** test coverage and performance metrics

---

*This test suite will ensure the QR scanning functionality works reliably across all scenarios and provides a seamless experience for restaurant customers.*