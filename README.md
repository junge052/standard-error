# Standard Error — Typeface Website

Editable HTML, CSS, and JavaScript, with your original variable font included.

Updated visual direction: white background, black text and rules, compact spacing. All interface text and specimens use the included Standard Error font.

## Run in VS Code

Open this folder in VS Code. In the terminal:

```sh
python3 -m pip install -r requirements.txt
python3 server.py
```

Open http://localhost:8000 in your browser. On Windows, use `python` if `python3` is unavailable.

Use the included server for working static font downloads. Live Server can display the site, but cannot generate custom fonts.

## Files

- `index.html`: three sections and page content
- `style.css`: responsive layout, colors, borders, typography
- `script.js`: five presets, axis controls, tabs, download, mockup list
- `server.py`: local web server and fontTools static font export
- `fonts/StandardErrorVF.ttf`: your supplied original font
- `mockups/`: add your designed documents and preview images here

## Add documentation

Edit `const mockups = []` in script.js, for example:

```js
const mockups = [
  {title:'Poster 01', image:'mockups/poster.jpg', file:'mockups/poster.pdf'},
  {title:'Letterhead', image:'mockups/letterhead.jpg', file:'mockups/letterhead.pdf'}
];
```

The empty archive frames are intentional placeholders. No mockups or study citations have been invented. Replace the research overview with your final writing and verified sources in index.html.

## Font behavior

All five axes range from 0 to 100. Selecting a preset sets its axis to 100 and the other four to zero. Reset returns to Regular. Sliders can mix axes. A download captures all five current values, fixes the variation data into static outlines with fontTools, and assigns a distinct family name to the export. This is a full font export, not a screenshot or renamed variable font.

## Hosting

This package runs locally. Public deployment with custom downloads requires a Python-capable host and production request/resource limits. GitHub Pages alone can display the frontend but cannot execute server.py. The local server binds only to your computer.
