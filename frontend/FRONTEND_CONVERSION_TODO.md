# SMAJ PI HUB Frontend Conversion TODO

Goal: convert `smajpihub-convert-to-pi-net-docs` into the Vite React + TypeScript frontend, starting with homepage-first delivery.

## Phase 1: Home Page Baseline

- [x] Keep current Pi brand color palette and core layout structure in React homepage.
- [x] Port core homepage sections (`hero`, `services preview`, `highlights`, `trust`).
- [x] Replace all remaining placeholder links with real React routes.
- [ ] Add responsive QA checklist for mobile, tablet, and desktop.

## Phase 2: App Shell and Routing

- [x] Create route map from legacy HTML pages to React routes.
- [x] Add shared layout component for header/footer/nav.
- [x] Add 404 page and safe redirects for old URLs.
- [ ] Define route-level code splitting for large sections.

## Phase 3: Style System Migration

- [ ] Extract design tokens (colors, spacing, radius, shadows) from legacy CSS.
- [ ] Move repeated styles into reusable React-friendly CSS modules or styled components.
- [ ] Keep visual parity first, then clean up duplicated CSS.
- [ ] Build a reusable section/card/button component set.

## Phase 4: Content/Page Conversion

- [x] Convert `about`, `services`, `how-it-works`, `pricing`, `faq`, and `contact`.
- [ ] Convert `community`, `developers`, `partners`, and legal pages.
- [ ] Convert blog listing and blog post templates into typed content models.
- [ ] Convert dashboard-related static pages into authenticated React views.

## Phase 5: Behavior and JS Logic

- [x] Port shared menu and interaction logic from vanilla JS into React hooks/components.
- [ ] Port page-specific scripts (`faq`, `community`, `portfolio`, etc.) with typed state.
- [ ] Remove direct DOM mutation patterns and replace with React state flow.
- [ ] Add event tracking hooks for key CTA clicks.

## Phase 6: Pi Demo Integration

- [x] Wire Pi auth flow and wallet-aware session state. (Header implementation complete)
- [x] Implement redirect/modal logic for `onIncompletePaymentFound` in Header.
- [x] Add visual "Active" route indicators to the Mobile Navigation drawer.
- [x] Add a User Profile dropdown menu (Logout/Profile) for authenticated users.
- [x] Add loading states for the Login/Session check transition.
- [ ] Connect storefront and engagement tasks to backend APIs.
- [ ] Add typed API client layer and request error handling.
- [ ] Add loading/empty/error states across all data views.

## Phase 7: Quality and Release

- [ ] Add unit tests for core components and route guards.
- [ ] Add integration tests for critical user flows.
- [ ] Run Lighthouse and performance pass on homepage + top routes.
- [ ] Prepare release checklist and deployment notes for Pi Demo frontend.
