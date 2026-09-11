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

Pattern definitions and construction live in `patterns.js`; literal book transcriptions live in `groff-patterns.js` and `crockett-patterns.js`. The library has 92 entries. Search by author and number (for example, `Crockett 14` or `Groff 27`); `#14` finds that number in both books. The 46 picks in Ember lattice are the complete supplied plan, not a claim that the color sequence repeats after 46 picks.

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

## Candace Crockett collection

All 20 numbered Pattern Drafts from the supplied 1973 edition of Candace Crockett’s *Card Weaving* (Watson-Guptill) are included, plus 10 complete teaching drafts: Sample A (Figure 41), the five Figure 69 studies, Five-Color Diamonds (81), Sample B (83), the angle study (87), and the double-weave sampler setup (135). Descriptive library titles identify designs that the book only numbers. Designer credits, source figures, printed/PDF pages, and paraphrased instructions accompany each draft. The PDF and its images are not published.

`crockett-patterns.js` preserves literal A–D or A–F rows and L/R arrows. Only `.` means an empty hole; a dash is a yarn symbol. Card order is left to right, including the two halves of draft 15’s split chart. Patterns 14 and 15 use six holes with 60° steps; pattern 18 has 63 tablets; pattern 20 has 44 threads and 28 empty holes.

The labelled card face in Crockett faces left. Turn reflects its hole order: Turn A/B/C/D = source A/D/C/B, or A/B/C/D/E/F = source A/F/E/D/C/B. Left arrows map to S and right arrows to Z, independently checked against Figure 72. The usual A upper-near start makes four toward turns expose source D/C/B/A, then four away expose A/B/C/D, including the duplicated reversal thread. Sample B and Figure 87 start with source B upper-near (Turn D, `startHole: 3`), following the AB-top setup; Figure 87’s inferred phase is disclosed. No change to the weaving model was needed. Regression checks cover the common edges of the smooth and broken Figure 69 studies.

Named yarn colors are approximated. Teaching drafts specify only values or symbols, so their notes identify the editable display hues as choices. Source checks preserve these discrepancies:

- 2: the overprinted C16 cell reads as a dash; its count conflicts with the key by one.
- 10: O appears 14 times but is omitted from the color key. The literal palette retains `hex: null` with an explicit cream `displayHex`; the imported draft has 96 actual threads, not 14 empty holes.
- 13: C16 is visibly X although the totals imply Z. Continuous turning starts toward the body as an explicit choice.
- 15: the printed X/O counts are reversed relative to the chart; its printed pink symbol resembles 2 rather than Z.
- 20: the general four-toward/four-away cycle is used because no separate turn plan is given.
- Sample B: step 7 repeats “away” while claiming to untwist the warp; the contradiction is flagged.

Pattern 17 stores the initial 64-turn passage (24 toward, 40 away) and the staged instructions for four separate wefts, group crossings, and rejoining. It is not a cyclic braid simulation. Sample B loads only its ordinary ground and includes all ten manual stages. Figure 135 loads its ground and explains the two-shed double-weave procedure, which the one-shed preview cannot simulate. These limitations appear in gallery descriptions, beside the preview, and in saved/exported notes. Photographs without complete drafts and turning instructions are not invented as extra presets.
