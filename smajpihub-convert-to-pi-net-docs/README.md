[README.md](https://github.com/user-attachments/files/27158473/README.md)
# SMAJ PI HUB

All-in-one frontend platform for Pi ecosystem services.

## Overview

SMAJ PI HUB brings multiple Pi-powered services into one user flow:
- E-commerce and marketplace access
- Digital services and onboarding guides
- Community and developer ecosystem pages
- Wallet-first experience with Pi branding

This repository is currently frontend-focused (HTML, CSS, Vanilla JS).

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6)
- Boxicons
- Pi SDK script integration in page templates

## Project Structure

```text
smajpihub/
|-- index.html
|-- assets/
|   `-- images/
|-- css/
|   |-- style.css
|   |-- responsive.css
|   |-- homepage.css
|   `-- [page-specific css files]
|-- js/
|   |-- main.js
|   `-- [page-specific js files]
`-- pages/
    |-- about.html
    |-- service.html
    |-- how-it-works.html
    |-- pricing.html
    |-- portfolio.html
    |-- marketplace/markerplace.html
    |-- blog.html
    |-- blog-post.html
    |-- community.html
    |-- developers.html
    |-- faq.html
    |-- contact.html
    |-- dashboard/
    |-- auth/
    `-- legal/
```

## Rebuilt Pages (Recent)

- `index.html` (homepage structure and hub messaging)
- `pages/service.html`
- `pages/dashboard/client.html`
- `pages/how-it-works.html`
- `pages/pricing.html`
- `pages/marketplace/markerplace.html`
- `pages/faq.html`
- `pages/contact.html`
- `pages/about.html` (except protected team/founder sections as requested)
- `pages/blog.html`
- `pages/blog-post.html`
- `pages/community.html`
- `pages/developers.html`
- `pages/portfolio.html`

## Run Locally

1. Open project folder in VS Code.
2. Run with Live Server (or any static server).
3. Start from `index.html`.

## Navigation and Menu Notes

## Repository Check Update

- Verified repository write access by updating this README.
- Added this note as a lightweight commit-test change on April 25, 2026.

- Shared mobile menu uses:
  - `#menuToggle`
  - `#menuOverlay`
  - `#menuClose`
  - `#navMenu`
- Shared behavior is controlled by `js/main.js`.

## What Next (Recommended Checks)

1. Check all nav links on every page (desktop + mobile).
2. Validate mobile menu open/close on each page.
3. Replace all `href="#"` placeholders (social and CTA links) with real URLs.
4. Run visual QA for spacing/typography consistency across rebuilt pages.
5. Test `js/portfolio.js` filters/counters and `js/community.js` category filters.
6. Fix file naming typos in future cleanup:
   - `pages/marketplace/markerplace.html` (typo in filename)
   - `js/contant.js` (typo in filename)
7. Add SEO basics per page:
   - unique `<title>`
   - meta description
   - Open Graph tags

## Notes

- Keep shared header/footer structure consistent across all pages.
- Keep branding colors and typography from base styles unless intentionally redesigning.

## Maintenance

- Repository write-access verification note added on April 25, 2026.
- Apply the same README verification pattern in the `smaj-pi-hub-demo` repository when working there.
