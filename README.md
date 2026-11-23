# Huang Yuting — Portfolio

An English-language, click-through portfolio built with plain HTML, CSS, and JavaScript. The site uses a hand-drawn paper style with blue crayon-filled lettering, grid-paper backgrounds, and illustrated cat navigation.

## Page flow

- The cover shows only the hand-lettered “PORTFOLIO” wordmark, cat artwork, and stars.
- Clicking the blue star opens the project index.
- Hovering or focusing a cat reveals its English project title. Clicking the cat opens that project page.
- Project pages include the supporting details, original visuals, external work links, and previous/next navigation.
- The About and Contact pages are accessed through the header or in-page navigation.
- Desktop uses one fixed landscape page at a time. Mobile allows scrolling inside the active page when its content needs more room.

## Files

```text
.
├─ index.html
├─ styles.css
├─ script.js
├─ assets/
│  ├─ fonts/                       Local Londrina Solid and Nunito font files
│  ├─ crayon-fill.svg              Uneven crayon fill used by the display title
│  ├─ grid-paper.svg               Blue grid-paper texture
│  ├─ paper-corners.svg            Hand-drawn corner hatching and stars
│  ├─ 黄钰婷简历.pdf
│  └─ project images and campaign files
└─ README.md
```

## Local preview

Open `index.html` directly, or run:

```powershell
python -m http.server 8090
```

Then visit `http://localhost:8090/`.

Live site: [https://iris-hyt.github.io/yuting-pixel-portfolio/](https://iris-hyt.github.io/yuting-pixel-portfolio/)
