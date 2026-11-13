# Self-hosted site fonts

These unchanged WOFF2 files are the Google Fonts subsets previously bundled by
`next/font/google` for this site. The site now loads them with `next/font/local`,
so production builds do not depend on reaching Google Fonts.

- DM Sans: Latin and Latin Extended, normal variable weight.
- Cormorant Garamond: Latin, Latin Extended, Cyrillic, Cyrillic Extended and
  Vietnamese, normal variable weight.

Only the two Latin subsets are preloaded. Other subsets load when the rendered
text needs their characters. Scripts not covered by these font families use the
visitor's system fallback fonts.

Both families are distributed under the SIL Open Font License 1.1. The original
copyright notices and full licenses are included alongside the font files:

- `DM-Sans-OFL.txt`: https://github.com/google/fonts/blob/main/ofl/dmsans/OFL.txt
- `Cormorant-Garamond-OFL.txt`: https://github.com/google/fonts/blob/main/ofl/cormorantgaramond/OFL.txt
