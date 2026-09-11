# Turn — Tablet Weaving Studio

A dependency-free, browser-based tablet weaving drafter. Supports 3–8 perimeter holes, 2–64 tablets, and 4–160 picks, with color/empty-hole painting, S/Z threading, adjustable starting position, individual and repeating turns, undo/redo, JSON save/open, SVG export, and printable instructions.

Run `npm start` and open `http://localhost:5173`. Run the model regression checks with `npm test`. The static website files live at the repository root; no build step is required.

## Publishing

Live at [peterefrancis.com/turn](https://peterefrancis.com/turn/). GitHub Pages serves the root of the `main` branch in [PeterEFrancis/turn](https://github.com/PeterEFrancis/turn). Push changes to `main` to update the website. The custom domain is inherited from the main personal website; this project does not need a CNAME file.

## Pattern library

Choose **Browse pattern library** or the **Starting pattern** menu. Five detailed four-hole bands are included alongside the original starters:

- Rose vine is an original four-thread adaptation of the photographed Dublin-dragon motif, with a continuous stem and alternating curled eyes. It uses 16 tablets and a 24-pick visual repeat shown twice; some tablets accumulate a full turn per repeat. It is not a transcription of the handwritten missed-hole chart.
- Ember lattice (28 tablets, 46 picks), Blue scroll (18, 20), Scarlet diamonds (24, 32), and Turquoise braid (16, 32) follow the supplied charts’ A–D threading, S/Z directions, and chronological turning plans. JPEG colors are approximations. The source diagrams read upward; Turn keeps pick 1 at the top.

Detailed presets load their own palette and dimensions. The four everyday starters retain the current 3–8-hole setup. Loading is undoable and every preset is a normal draft compatible with editing, JSON save/open, SVG export, and printing. Gallery thumbnails are rendered from the same threading and turns as the editor; no reference photos are hosted.

Pattern definitions and construction live in `patterns.js`; the literal Groff transcription lives in `groff-patterns.js`. The 46 picks in Ember lattice are the complete supplied plan, not a claim that the color sequence repeats after 46 picks.

## Draft convention

Read the labelled card face from the right. Holes are clockwise from A, with the selected starting hole upper-near and the next letter upper-far. The default is A upper-far and the final hole upper-near. A forward step turns the top away by 360°/hole count. With the default start, a fully threaded four-hole forward cycle shows D, C, B, A. On fully threaded tablets, reversal repeats the preceding surface thread. S/Z affects stitch slant independently of hole lookup. Pick 1 is at the top of both charts and preview.

The preview is schematic. Sparse tablets show actual occupied holes above the weft, joining consecutive exposure of the same thread into one float. For more than one exposed thread, the highest thread is shown; exposed weft is neutral. It does not model yarn tension, overlap of multiple upper threads, unequal face coverage of odd-hole cards, or the physical shape and width of long floats. All tablets within one draft share a hole count.

Conventions follow [Tablet Weaving Draft Designer](https://www.tabletweavingintheoryandpractice.co.uk/2021/02/getting-most-from-tablet-weaving-draft.html) and [Stringpage's threading explanation](https://www.stringpage.com/tw/threading.html).

In version 1 JSON drafts, a thread color is a six-digit hex string; `null` means an empty hole. Optional `startHole` is the zero-based hole index placed upper-near (omitted in older drafts, which start with the final hole upper-near).

Drafts stay in memory until downloaded using Save draft. JSON files can be reopened. There are no accounts or application data uploads. The app also exposes feature-detected WebMCP tools for reading a draft, changing dimensions, applying turning repeats, listing patterns, and loading a preset.

## Russell E. Groff collection

The library contains all 53 numbered patterns from *Card Weaving* by Russell E. Groff (Robin & Russ Handweavers), transcribed from the supplied scanned book. These entries are searchable by number and title and load editable four-hole drafts. Each retains the printed page, PDF page, named yarn colors, turning sequence, and paraphrased weaving instructions. Existing reference and everyday presets remain available. The PDF and photographs are not hosted.

`groff-patterns.js` retains the literal A–D rows, U/D threading arrows, chronological quarter-turn sequence, and any uncertain details. Colors are approximations of the named yarns. `patterns.js` converts source A/D/C/B into Turn A/B/C/D, source up/down arrows into S/Z, and starts with Turn A upper-near (`startHole: 0`). This makes forward weaving expose source A/B/C/D and matches the direction of the photographed chevrons. Card order is preserved. A gallery sample uses complete repetitions of the written turning plan to show at least 32 turns; this does not assert that every plan returns all cards to the starting orientation.

The book is inconsistent about its home position: printed p. 11 places A upper-far/B upper-near, while printed p. 45 reverses those labels. Its square drawdown on p. 46 also omits the repeated surface thread at reversal. Turn uses its established physical reversal convention and documents the normalization instead of changing the renderer to reproduce that square sketch. Photos can show either fabric face and yarns of unequal thickness, so the equal-width preview is a schematic rather than a facsimile.

Source checks remain visible in the loaded draft and in saved/exported instructions:

- 11: the aqua yarn-finish description is cropped; chart and color are readable.
- 26: consecutive 12F and 2F instructions are preserved as 14F.
- 27: source A2 is overwritten W/G. The literal row retains `?`; an explicit cell resolution selects white and the draft flags it for verification.
- 34: the printed 4F/1B/1F/1B is retained despite conflicting “evenly balanced” wording.
- 38: unkeyed Y at A21 is interpreted as gold from related pattern 48.
- 42: clipped tablet 39 is inferred O/X/O/H with a down arrow from visible fragments and the adjacent repeat.
- 49: unkeyed G is inferred as dark green from related pattern 33; the book’s general 4F/4B repeat is used because no separate sequence is given.
- 50: gutter-hidden tablet 39 uses four black threads from the border instruction and a down arrow from the repeated group. The prose’s 29–39 group conflicts with three groups of 13 and is interpreted as 27–39.

Pattern 14 has 72 turn rows, including two 12-turn sections without weft. The turning chart includes editable weft checkboxes and marks these rows with an asterisk. All turns advance tablet positions, but the preview shows only woven sections: the braided gaps and their length are not simulated. Pattern 50 includes the separate weaving, crossing, and rejoining instructions for three 13-tablet groups; its preview shows their initial flat threading, not the crossed assembly. Pattern 47’s red sequins are a finishing step described in its notes.

Optional version-1 JSON fields `source` (text), `notes` (text array), and `weft` (one boolean per turn row) preserve these instructions through editing, undo/redo, resizing, and save/open. Omitted `weft` means insert weft on every row. SVG and print exports include the instructions and no-weft markers. The tablet limit is 64 to accommodate pattern 27’s 56 tablets.
