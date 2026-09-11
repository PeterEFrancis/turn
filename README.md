# Turn — Tablet Weaving Studio

A dependency-free, browser-based tablet weaving drafter. Supports 3–8 perimeter holes, 2–48 tablets, and 4–160 picks, with color painting, S/Z threading, individual and repeating turns, undo/redo, JSON save/open, SVG export, and printable instructions.

Run `npm start` and open `http://localhost:5173`. Run the model regression checks with `npm test`. Authored static website files are in `dist/`; no build step is required.

## Draft convention

Read the labelled card face from the right. Holes are clockwise from A, with A upper-far and the final hole upper-near. A forward step turns the top away by 360°/hole count. A four-hole forward cycle shows D, C, B, A. Reversal repeats the preceding surface thread. S/Z affects stitch slant independently of hole lookup. Pick 1 is at the top of both charts and preview.

The preview is schematic. It does not model yarn tension, unequal face coverage of odd-hole cards, or the physical shape of long floats. All tablets within one draft share a hole count.

Conventions follow [Tablet Weaving Draft Designer](https://www.tabletweavingintheoryandpractice.co.uk/2021/02/getting-most-from-tablet-weaving-draft.html) and [Stringpage's threading explanation](https://www.stringpage.com/tw/threading.html).

Drafts stay in memory until downloaded using Save draft. JSON files can be reopened. There are no accounts or application data uploads. The app also exposes feature-detected WebMCP tools for reading a draft, changing dimensions, and applying turning repeats.
