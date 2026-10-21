# Villa Mangal — website

Static website for **Villa Mangal**, a family-run Turkish restaurant at 13 Hill Avenue, Amersham HP6 5BD (01494 729055).

Plain HTML, CSS and JavaScript with no build step. It can be hosted on GitHub Pages, Netlify or any static host.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home: hero, signature grills, meze/veg/kids, fish, visit us, order CTA |
| `menu.html` | Full menu, rendered from `data/menu.json`, with section links and a vegetarian filter |
| `about.html` | The restaurant's story and photo gallery |
| `contact.html` | Address, map, opening hours, bookings and delivery |
| `404.html` | Not-found page |

## Editing

- **Menu and prices:** edit `data/menu.json`. Each item has `name`, `desc`, `price` and `tags` (`v` vegetarian, `spicy`, `popular`, `share`). The menu page updates automatically.
- **Opening hours:** currently 12pm–10pm every day. Update the `HOURS` object in `assets/js/main.js` (drives the "Open now" badge), the hours table in `contact.html`, the footer text on every page, and the `openingHoursSpecification` in `index.html`.
- **Drinks:** the menu page shows a "drinks list coming soon" note. Add a `drinks` category to `data/menu.json` once confirmed, and remove the note from `menu.html`.
- **Header and footer** are repeated in each HTML file, so change them in every page.

## Brand assets (`assets/img/`)

- `logo.svg` / `logo.png`: full logo for light backgrounds (navy and red)
- `logo-light.svg` / `logo-light.png`: full logo for dark backgrounds
- `logo-mark.svg` / `logo-mark.png` / `logo-mark-light.svg`: emblem only
- `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png`: site icons
- Photos: `storefront`, `lamb-ribs`, `sea-bass`, `turkish-tea` (`.webp` with `.jpg` fallback), `og-image.jpg` (social share image)

The logo is redrawn from the shop sign. The lettering is Josefin Sans converted to outlines, so the SVGs need no font. The site uses Josefin Sans for headings and Source Sans 3 for body text (Google Fonts).

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

The menu is loaded with `fetch`, so open the site through a local server rather than straight from the file system.

## Before launch

- Once a domain is chosen, make the `og:image` and JSON-LD `image`/`logo`/`hasMenu` URLs absolute, and add a `sitemap.xml`.
- Confirm drinks with the restaurant.
