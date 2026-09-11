# Turn — Tablet Weaving Studio

A dependency-free, browser-based tablet weaving drafter. Supports 3–8 perimeter holes, 2–48 tablets, and 4–160 picks, with color/empty-hole painting, S/Z threading, adjustable starting position, individual and repeating turns, undo/redo, JSON save/open, SVG export, and printable instructions.

Run `npm start` and open `http://localhost:5173`. Run the model regression checks with `npm test`. The static website files live at the repository root; no build step is required.

## Publishing

Live at [peterefrancis.com/turn](https://peterefrancis.com/turn/). GitHub Pages serves the root of the `main` branch in [PeterEFrancis/turn](https://github.com/PeterEFrancis/turn). Push changes to `main` to update the website. The custom domain is inherited from the main personal website; this project does not need a CNAME file.

## Pattern library

Choose **Browse pattern library** or the **Starting pattern** menu. Seven detailed four-hole bands are included alongside the original starters:

- Rose vine is an original four-thread adaptation of the photographed Dublin-dragon motif, with a continuous stem and alternating curled eyes. It uses 16 tablets and a 24-pick visual repeat shown twice; some tablets accumulate a full turn per repeat. It is not a transcription of the handwritten missed-hole chart.
- Ivory braid follows the handwritten two-thread chart in the supplied ivory-and-blue photo: 12 Z-threaded pattern tablets, each with one ivory and one blue thread in opposite holes and two empty holes. In source A–D order, `.B.I`, `B.I.`, `.I.B`, `I.B.` repeat three times (`.` = empty, B = blue, I = ivory). The 12 source picks repeat four times. Two fully threaded blue/gold border tablets on each side are inferred from the photographed band, bringing the total to 16 tablets and 40 warp threads. The visible start sketch appears to put A upper-near; the preset keeps that setting and the source hole letters. The napkin does not show the complete hole-label cycle, a turn legend, or a row-numbering arrow: Turn assumes its usual clockwise labels, reads the table downward, and interprets T as *tilbage* (toward/backward), with blanks forward. These convention assumptions are not an exact-source claim. The upper-near starting hole is editable. [Stringpage’s two-hole weaving explanation](https://www.stringpage.com/tw/twohole.html) describes the long floats and short pebbles produced by opposite-hole threading.
- Golden ram’s horns follows the Sulawesi design in [Saga Wool Craft’s original photo gallery](https://sagawoolcraft.com/?page_id=2680), using 16 pattern tablets in alternating SS/ZZ pairs plus four borders. Each pair has offset threading and turns together twice per design row, following the artist’s [threading](https://sagawoolcraft.com/?page_id=129) and [chart notation](https://sagawoolcraft.com/?page_id=192). The 36-pick repeat is reconstructed from a clear section of the supplied graph and shown twice. Gold/red/charcoal colors, ivory design threads on the four center tablets, and the borders are color adaptations; this is not an exact transcription of the entire cropped graph.
- Ember lattice (28 tablets, 46 picks), Blue scroll (18, 20), Scarlet diamonds (24, 32), and Turquoise braid (16, 32) follow the supplied charts’ A–D threading, S/Z directions, and chronological turning plans. JPEG colors are approximations. The source diagrams read upward; Turn keeps pick 1 at the top.

Detailed presets load their own palette and dimensions. The four everyday starters retain the current 3–8-hole setup. Loading is undoable and every preset is a normal draft compatible with editing, JSON save/open, SVG export, and printing. Gallery thumbnails are rendered from the same threading and turns as the editor; no reference photos are hosted.

Pattern definitions and construction live in `patterns.js`. The 46 picks in Ember lattice are the complete supplied plan, not a claim that the color sequence repeats after 46 picks.

## Draft convention

Read the labelled card face from the right. Holes are clockwise from A, with the selected starting hole upper-near and the next letter upper-far. The default is A upper-far and the final hole upper-near. A forward step turns the top away by 360°/hole count. With the default start, a fully threaded four-hole forward cycle shows D, C, B, A. On fully threaded tablets, reversal repeats the preceding surface thread. S/Z affects stitch slant independently of hole lookup. Pick 1 is at the top of both charts and preview.

The preview is schematic. Sparse tablets show actual occupied holes above the weft, joining consecutive exposure of the same thread into one float. For more than one exposed thread, the highest thread is shown; exposed weft is neutral. It does not model yarn tension, overlap of multiple upper threads, unequal face coverage of odd-hole cards, or the physical shape and width of long floats. All tablets within one draft share a hole count.

Conventions follow [Tablet Weaving Draft Designer](https://www.tabletweavingintheoryandpractice.co.uk/2021/02/getting-most-from-tablet-weaving-draft.html) and [Stringpage's threading explanation](https://www.stringpage.com/tw/threading.html).

In version 1 JSON drafts, a thread color is a six-digit hex string; `null` means an empty hole. Optional `startHole` is the zero-based hole index placed upper-near (omitted in older drafts, which start with the final hole upper-near).

Drafts stay in memory until downloaded using Save draft. JSON files can be reopened. There are no accounts or application data uploads. The app also exposes feature-detected WebMCP tools for reading a draft, changing dimensions, applying turning repeats, listing patterns, and loading a preset.
