# Frontend Conversion TODO Tracker

## Current Phase: Phase 3 - Style System Migration (Starting)

### Phase 1: Home Page Baseline
- [x] Keep current Pi brand color palette and core layout structure in React homepage.
- [x] Port core homepage sections (hero, services preview, highlights, trust).
- [x] Replace all remaining placeholder links with real React routes.
- [ ] Add responsive QA checklist for mobile, tablet, and desktop.

### Phase 2: App Shell and Routing
- [x] Create route map from legacy HTML pages to React routes.
- [x] Add shared layout component for header/footer/nav.
- [x] Add 404 page and safe redirects for old URLs.
- [x] Define route-level code splitting for large sections.

### Phase 3: Style System Migration
- [x] Extract design tokens (colors, spacing, radius, shadows) from legacy CSS.
- [x] Extract design tokens (colors, spacing, radius, shadows) from legacy CSS.
- [x] Move repeated styles into reusable React-friendly CSS modules or styled components. (HomePage.module.css + HomePage.tsx migrated, design-tokens.css injected)
- [x] Keep visual parity first, then clean up duplicated CSS.
- [x] Build a reusable section/card/button component set. (Button.tsx + ProductCard.module.css)

**Phase 3 complete! Next: Phase 4 - Convert community, developers, partners pages.**
- [ ] Build a reusable section/card/button component set.

**Next step: Create design-tokens.css for CSS vars, migrate more pages/components (Phase 3 #3).**
- [ ] Move repeated styles into reusable React-friendly CSS modules or styled components.
- [ ] Keep visual parity first, then clean up duplicated CSS.
- [ ] Build a reusable section/card/button component set.

### Phase 4: Content/Page Conversion
- [x] Convert about, services, how-it-works, pricing, faq, and contact.
- [ ] Convert community, developers, partners, and legal pages.
- [ ] Convert blog listing and blog post templates into typed content models.
- [ ] Convert dashboard-related static pages into authenticated React views.

### Phase 5: Behavior and JS Logic
- [ ] Port shared menu and interaction logic from vanilla JS into React hooks/components.
- [ ] Port page-specific scripts (faq, community, portfolio, etc.) with typed state.
- [ ] Remove direct DOM mutation patterns and replace with React state flow.
- [ ] Add event tracking hooks for key CTA clicks.

### Phase 6: Pi Demo Integration
- [ ] Wire Pi auth flow and wallet-aware session state.
- [ ] Connect storefront and engagement tasks to backend APIs.
- [ ] Add typed API client layer and request error handling.
- [ ] Add loading/empty/error states across all data views.

### Phase 7: Quality and Release
- [ ] Add unit tests for core components and route guards.
- [ ] Add integration tests for critical user flows.
- [ ] Run Lighthouse and performance pass on homepage + top routes.
- [ ] Prepare release checklist and deployment notes for Pi Demo frontend.

**Next step: Extract design tokens from legacy CSS (Phase 3 #1).**
