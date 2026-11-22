# 10 · Photo Gallery

This project shows that TypeScript does not have to be everywhere. The UI (`App.jsx`, `main.js`) is plain JavaScript and JSX. Data types live in `photos.ts`, and JSDoc comments (`@typedef`, `@param`, `@type`) combined with `"allowJs"` and `"checkJs"` let `tsc` type-check the JSX too. For example, a typo like `photo.authr` fails the build.

- API: `https://picsum.photos/v2/list` for the list and `https://picsum.photos/id/{id}/{w}/{h}` for images
- Features: pagination, lazy thumbnails with a fallback when an image fails, and a lightbox you can browse with ← → and close with Esc.

```bash
cd Projects
npm run build
npm run serve
# open http://localhost:<port>/10-PhotoGallery/
```
