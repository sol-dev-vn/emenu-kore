## Context

The eMenu system currently serves as a basic menu display platform without comprehensive customer ordering capabilities or staff management tools. This revamp transforms it into a sophisticated dual-purpose platform: a public-facing QR code ordering system and a role-based staff management portal. The solution must support 30+ restaurant locations with multiple user roles while maintaining security and performance standards.

## Goals / Non-Goals

**Goals:**
- Enable seamless QR code scanning and table-specific ordering for customers
- Provide comprehensive staff portal with role-based access control
- Implement phone number authentication for Vietnamese market (+84 default)
- Create scalable QR code generation and management system
- Ensure mobile-first design for customer-facing features
- Maintain existing CukCuk POS integration and data synchronization

**Non-Goals:**
- Payment processing integration (future scope)
- Advanced inventory management features
- Multi-language translation overhaul (existing system sufficient)
- Real-time kitchen order display (future enhancement)
- Customer loyalty program integration
- Advanced analytics dashboards (basic metrics only)

## Decisions

### 1. Authentication Strategy
**Decision**: Implement dual authentication system with phone number + password for staff, and session-based access for customers via QR codes.

**Rationale**: Phone numbers are the primary identifier in Vietnam and more reliable than email addresses for restaurant staff. QR sessions don't require authentication to reduce friction for customers. Session-based approach allows for anonymous ordering while maintaining table context.

**Alternatives considered**:
- Email-based authentication (less common in Vietnam)
- Social login (overkill for internal staff)
- OTP-only authentication (less secure for sensitive operations)

### 2. Role-Based Access Control Architecture
**Decision**: Implement hierarchical RBAC with data scoping at database level using Directus permissions.

**Rationale**: Directus already provides robust permission system with row-level security. Using built-in system reduces development complexity and ensures consistency. Database-level scoping prevents unauthorized data access even if frontend controls are bypassed.

**Alternatives considered**:
- Custom middleware-based RBAC (more maintenance)
- Third-party authorization service (additional dependency)
- Simple frontend-only role checks (insufficient security)

### 3. QR Code URL Structure
**Decision**: Use simple, readable URLs: `http://sol-menu.alphabits.team/qr/[table-id]`

**Rationale**: Short URLs are easier to print and scan. Table IDs are not sensitive information, and session-based security prevents unauthorized access. Clean URLs are more professional and easier for customers to manually enter if needed.

**Alternatives considered**:
- Encrypted tokens (unnecessary complexity)
- Long UUID-based URLs (hard to print and scan)
- Subdomain per branch (DNS management overhead)

### 4. Portal Route Structure
**Decision**: Rename `/portal` to `/hub` and implement route-based access control.

**Rationale**: "Hub" better reflects the comprehensive nature of the staff portal. Route-based control allows for clear separation of concerns and easier maintenance. Breaking change is acceptable as existing portal usage is minimal.

**Alternatives considered**:
- Keep `/portal` route (less descriptive)
- Use subdomain like `staff.sol-menu.alphabits.team` (SSL complexity)
- Implement route groups like `/hub/brand`, `/hub/branch` (overly complex)

### 5. Frontend Architecture
**Decision**: Extend existing SvelteKit architecture with new route groups and shared components.

**Rationale**: Maintaining consistency with existing codebase reduces learning curve. SvelteKit's file-based routing naturally supports the new structure. Shared components ensure UI consistency across customer and staff interfaces.

**Alternatives considered**:
- Separate applications for customer and staff (duplicated logic)
- SPA framework migration (unnecessary risk)
- Micro-frontend architecture (over-engineering for current scale)

### 6. State Management Strategy
**Decision**: Use Svelte 5 runes for local state and custom stores for global state management.

**Rationale**: Svelte 5 runes provide reactive state management without additional dependencies. Custom stores can handle complex state like user sessions and context. This approach keeps the solution lightweight while maintaining scalability.

**Alternatives considered**:
- External state management library (additional dependency)
- Context-only state management (limited for complex scenarios)
- Server-only state management (poor UX for interactive features)

### 7. Database Schema Changes
**Decision**: Extend existing Directus schema rather than major restructuring.

**Rationale**: Current schema already supports the necessary brand/branch/table structure. Adding phone number authentication and QR code management as extensions preserves existing functionality and reduces migration risk.

**Alternatives considered**:
- Complete schema redesign (high migration risk)
- Separate authentication database (integration complexity)
- NoSQL document store (loss of relational integrity)

## Risks / Trade-offs

### Security Risks
- **Phone number exposure**: Mitigation through encryption and access controls
- **QR code spoofing**: Mitigation through session validation and table verification
- **Role escalation**: Mitigation through strict Directus permissions and regular audits

### Performance Trade-offs
- **Real-time data sync vs performance**: Choose near real-time (5-10 second intervals) for acceptable UX
- **Rich media vs load times**: Implement progressive loading and image optimization
- **Complex permissions vs query speed**: Optimize database indexes and query patterns

### Operational Risks
- **Staff adoption**: Mitigation through training and intuitive UI design
- **QR code printing logistics**: Provide multiple template options and clear instructions
- **Mobile device compatibility**: Extensive testing across popular devices in Vietnam

### Technical Trade-offs
- **SvelteKit adoption vs team expertise**: Investment in modern tech stack vs learning curve
- **Directus customization vs maintainability**: Balance between custom features and system stability
- **Monorepo structure vs deployment complexity**: Unified codebase vs independent deployment

## Migration Plan

### Phase 1: Foundation (Week 1-2)
1. Database schema updates (phone number, permissions)
2. Basic authentication system enhancement
3. Create new route structure
4. Set up development environment with role-based testing

### Phase 2: Core Features (Week 3-4)
1. Implement QR code scanning interface
2. Build basic staff portal layout
3. Create role-based access controls
4. Develop user context management

### Phase 3: Advanced Features (Week 5-6)
1. QR code generation and PDF printing
2. Role-specific dashboards
3. Context switching functionality
4. Advanced permission testing

### Phase 4: Integration & Testing (Week 7-8)
1. API integration and testing
2. End-to-end workflow testing
3. Performance optimization
4. Security audit and penetration testing

### Phase 5: Deployment (Week 9-10)
1. Production deployment preparation
2. User training and documentation
3. Gradual rollout with monitoring
4. Post-launch support and optimization

### Rollback Procedures
- Database migrations are reversible with automated scripts
- Feature flags allow immediate rollback of problematic features
- Previous version can be redeployed within 30 minutes
- Customer-facing QR codes will redirect to maintenance page during rollback

## Open Questions

1. **Phone Number Verification**: Should we implement SMS verification for new phone numbers?
2. **Offline Capability**: What level of offline menu browsing is required for poor connectivity areas?
3. **Multi-branch User Access**: How should we handle users with permissions across multiple branches?
4. **QR Code Expiration**: Should table QR codes have expiration dates for security?
5. **Analytics Scope**: What level of usage analytics should be collected for business intelligence?
6. **Device Support**: Which older mobile devices should we support for QR scanning?
7. **Print Quality**: What print quality requirements exist for QR code generation (DPI, size, etc.)?

## Technical Specifications

### Performance Requirements
- QR code scanning: <3 seconds from camera access to menu load
- Staff portal page loads: <2 seconds on mobile networks
- Concurrent users: 1000+ per branch during peak hours
- API response time: <500ms for 95th percentile

### Security Requirements
- Phone numbers encrypted at rest
- Session timeout: 30 minutes for staff portal
- QR code session duration: 2 hours maximum
- Failed login lockout: 5 attempts, 15-minute lockout

### Browser Support
- Modern browsers: Chrome 90+, Safari 14+, Firefox 88+
- Mobile browsers: iOS Safari 14+, Chrome Mobile 90+
- Progressive enhancement for older browsers
- QR scanning requires modern camera APIs

### Integration Points
- Directus CMS: Authentication, permissions, data management
- CukCuk API: Menu synchronization, order management
- File storage: Directus files for images and PDFs
- Email system: User notifications and password resets