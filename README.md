# MOSAIKO

A cinematic, work-first demo portfolio for **Karen Joyce P. Dicang**, built with the existing Vite + React + TypeScript setup. Front-end only: no backend, accounts, database, CMS, or form service.

The opening presents Photography, Film, Social Media, and Collaborations immediately. Each category opens an accessible full-screen gallery; each project opens a focused detail view with media, description, category, and Karen’s role. The client-logo section is separate and hidden by default.

## Run and build

Use Node.js 24 and run:

```sh
npm install
npm run dev
```

On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`. Open the URL printed by Vite.

```sh
npm run build
npm run preview
```

The production output is `dist/`. With the dev server running and Google Chrome installed, `node scripts/check-browser.mjs` checks category navigation, all nine project details, concept labels, keyboard focus, mobile menus, layout widths, visible opening work, reduced motion, images, and console errors. Screenshots go to `artifacts/`. It also generates `public/social-cover.png` from the demo design. `TEST_URL` can point the interaction checks at a preview server.

## Files to edit when Karen sends content

| File | What to change |
| --- | --- |
| `src/data/projects.ts` | Category visibility/covers, project titles, descriptions, roles, concept flags, image/video media, captions, credits, sources |
| `src/data/site.ts` | Opening tagline/backdrop, About introduction and story approval, portrait, creative approach approval/image, showreel |
| `src/data/services.ts` | Four service descriptions |
| `src/data/contact.ts` | Email, inquiry subject, approved social URLs |
| `src/data/collaborators.ts` | Approved client/collaborator names, logos, links, visibility |
| `src/fonts.css` | Licensed font faces and centralized display/body font families |
| `src/styles.css` | `:root` colors, type sizes, spacing, layout widths, radii; responsive presentation |
| `public/media/` | Local photographs, videos, posters, caption files |
| `index.html` | SEO and Open Graph metadata |
| `public/social-cover.png`, `public/favicon.svg` | Demo social-sharing cover and favicon placeholder |

## Replace a concept project with real photos

1. Put approved images in `public/media/`. Prefer compressed WebP or AVIF, around 1600–2000 pixels wide for full-width images. Use meaningful filenames.
2. In `src/data/projects.ts`, replace a project’s `title`, `subtitle`, `description`, `cover`, and `coverAlt`. Set its `category` to `photography`, `film`, `social-media`, or `collaborations`.
3. Set `role` to Karen’s actual, approved contribution. Never infer credits from a service listing. Concept projects currently say that no role is assigned and Karen has not produced the project.
4. Replace `media` with as many assets as needed. Image example:

```ts
{
  type: 'image',
  src: '/media/approved-shoot-01.webp',
  alt: 'Describe the actual photograph meaningfully',
  caption: 'Approved caption',
  credit: 'Approved photographer and production credits',
  source: 'Karen’s supplied original file',
}
```

5. Set `isConcept: false` **only after all media, copy, and role information are real and approved**. Concept labels disappear automatically from the card and detail. Replace the category’s `cover`/`coverAlt` and set its own `isConcept: false` when its entry image is approved real work. Project badges remain independent when a category mixes real and demo work. The homepage demo notice disappears automatically when no visible category has concept projects.

Image errors produce a designed fallback instead of a broken image. Photography colors are preserved; readability gradients sit over entry cards, with full unfiltered imagery shown in detail galleries. Current assets are local original vector illustrations, not stock photographs or Karen’s work. Credits and sources are stored with each asset and rendered in the project detail. Preserve required attribution if stock is added later.

## Add project videos

Use a native playable media entry in any category:

```ts
{
  type: 'video',
  src: '/media/approved-film.mp4',
  poster: '/media/approved-film-poster.webp',
  captions: '/media/approved-film-en.vtt',
  alt: 'Accessible title for the film',
  caption: 'Approved caption',
  credit: 'Approved production credits',
  source: 'Karen’s supplied video',
}
```

Videos use native controls, `playsInline`, `preload="none"`, and no autoplay. For a mock video, keep `src: ''` and supply a poster: the component displays **Video sample coming soon**, without a play button. Failed real videos show an unavailable poster. Add WebVTT captions for speech and meaningful audio, and a descriptive alternative as appropriate for the work. Optimize video files before upload; a stable HTTPS video URL is also supported. Avoid enormous raw camera files.

## Showreel and portrait

In `src/data/site.ts`, set `reel.src`, `reel.poster`, and, when needed, `reel.captions`. A real URL replaces the **Showreel coming soon** poster with the same accessible native player. Set `portrait` to `{ src: '/media/karen.webp', alt: 'An accurate portrait description' }`; the portrait placeholder label is removed automatically. Never use the résumé screenshot as a portrait.

## Approve the About copy and creative approach

`site.intro` and `site.background` use only the supplied résumé facts. Replace `originPlaceholder` with Karen’s approved story, then set `storyApproved: true` to remove the placeholder label. Replace `approachDraft` with Karen’s approved wording and set `approachApproved: true`. The draft is not presented as a verified personal quote. Review the tagline, service descriptions, and other promotional copy before launch.

## Hide or enable categories

Set `enabled: false` on any entry in `categories` in `src/data/projects.ts`. This removes its opening card without deleting projects; re-enable with `true`. Collaborations is intentionally independent from the optional client-logo section. An enabled category with no projects has a concise empty state. The opening grid adapts when categories are hidden.

To display client logos, add approved `{ name, logo?, url? }` entries in `src/data/collaborators.ts`, then set `showCollaborators = true`. It remains hidden while the list is empty. Do not invent names, logos, or partnerships.

## Contact and social links

Update `src/data/contact.ts`. Start a Project opens the visitor’s email app with a subject; it does not send anything or display false success. The email address can also be copied. Add approved `{ label, url }` entries to `socials` to show links; the section stays hidden while empty. No phone or full address is displayed.

## Client-approved typography

No licensed **Georgia Pro Condensed** or **Gotham** files were found in the repository. The site makes no external font requests and downloads no proprietary fonts. Temporary fallbacks are Georgia for display and Avenir Next/Arial for body copy.

After confirming the font license permits web embedding, place the supplied WOFF2 files in `public/fonts/`. Uncomment/update the matching `@font-face` templates in `src/fonts.css`; the templates use `font-display: swap`. Map each supplied weight and italic style correctly. Both centralized family stacks already name the client-approved fonts first. Do not claim a static regular file is a variable font or assign it multiple weights. Recheck line breaks once the actual fonts load; preload only a critical heading font if measurement shows a benefit.

## Demo inventory

- Nine projects, all `isConcept: true`: **Somewhere, slow; Ordinary poetry; A place to pause; The in-between; Where light lingers; Small observations; A slower feed; The weekend edit; Shared perspectives**.
- Four illustrated category entry images, decorative opening backdrop, all project media, portrait placeholder, approach illustration, and showreel poster.
- Three empty video slots: the two Film projects and The weekend edit; each renders a coming-soon poster.
- Personal-story placeholder and clearly labeled draft creative approach; tagline, service descriptions, and other promotional copy awaiting review.
- Temporary font fallbacks, favicon, and social-sharing image. No clients, outcomes, testimonials, awards, or actual collaboration roles are invented.
- All original SVG assets are reproducible with `node scripts/create-art.mjs` and `node scripts/create-social-art.mjs`. These scripts overwrite the demo SVG filenames only; do not reuse those filenames for real work if rerunning the generators.

The supplied screenshot informs the warm editorial character. `FLOW.md` was empty at inspection; the latest written brief supplies the flow.

## Deploy to Vercel

1. Push this folder to a Git repository and import it in Vercel.
2. Use **Vite**, Node.js **24**, build command **`npm run build`**, output directory **`dist`**.
3. Deploy. No environment variables, backend, or routing rewrites are required: navigation uses anchors and modal category/detail views.
4. Once the final domain is known, set `og:image` to its absolute `/social-cover.png` URL, add `og:url` and a canonical link to `index.html`, and review the title/description. Replace the demo sharing image when approved work is ready.

Reduced-motion support, visible focus, dialog focus containment/restoration, and Escape dismissal are built in. Below-opening images are lazy-loaded; opening imagery is eager so the work appears immediately.
