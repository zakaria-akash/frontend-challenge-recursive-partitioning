# Recursive Partitioning Frontend Challenge

This project is a small application that demonstrates recursive partitioning of a UI. Users can split blocks vertically or horizontally, and remove them. The state is managed with Zustand.

## Code Explanation

Here is a file-by-file breakdown of the core logic:

### `store/splitStore.js`

This file sets up a "store" using Zustand. A store is a central place to keep the application's data (the "state") and the functions that can change that data (the "actions").

**Key Parts:**

*   **`randomColor()`**: A simple helper function that generates a random color in HSL format (e.g., `hsl(120, 100%, 50%)`). This is used to give each new block a unique color.
*   **`useSplitStore = create(...)`**: This is the main part. It creates the store.
    *   **`root`**: This is the initial state of your application. It represents the single, main block you see when the app first loads. It's an object with an `id`, a `color`, no `direction` of split yet, and an empty `children` array.
    *   **`splitPane(id, direction)`**: This is an "action" that splits a block.
        *   It finds the block (pane) with the matching `id`.
        *   It sets the `direction` of that block to either `'v'` (vertical) or `'h'` (horizontal).
        *   It creates two new children for that block. The first child gets the parent's original color, and the second gets a new random color.
    *   **`removePane(id)`**: This action removes a block.
        *   It finds the block to remove by its `id`.
        *   The logic here is clever: if a block's sibling is removed, the parent container collapses, and the remaining block takes its place. This prevents you from having empty container blocks.
*   **`findPane(node, id)` and `removePaneById(node, id)`**: These are recursive helper functions. Because your blocks are nested inside each other (a tree structure), these functions travel through the `root` object and its `children` to find or remove the correct block.

### `components/SplitControls.jsx`

This is a simple React component that shows the three buttons (`v`, `h`, `-`) inside each colored block.

**Key Parts:**

*   **`export default function SplitControls({ onSplit, onRemove })`**: It receives two functions, `onSplit` and `onRemove`, as props from its parent component (`SplitPane`).
*   **`<button onClick={() => onSplit("v")}>`**: When the "v" button is clicked, it calls the `onSplit` function and tells it the split direction is vertical.
*   **`<button onClick={() => onSplit("h")}>`**: Similarly, this calls `onSplit` for a horizontal split.
*   **`<button onClick={onRemove}>`**: When the "-" button is clicked, it calls the `onRemove` function.

This component doesn't know *how* to split or remove a block; it just knows to call the functions it was given when a button is clicked.

### `components/SplitPane.jsx`

This is the most important component. It's a **recursive component**, which means it can render itself. This is how you get the nested block structure.

**Key Parts:**

*   **`export default function SplitPane({ pane })`**: It receives a `pane` object as a prop. This `pane` object is one of the blocks from your `splitStore`.
*   **`const { splitPane, removePane } = useSplitStore()`**: It gets the `splitPane` and `removePane` actions from your Zustand store so it can use them.
*   **`if (pane.direction)`**: This is the **recursive** part.
    *   If a pane has a `direction` (meaning it has been split), it's a container.
    *   It renders a `<div>` with either `flex-col` (for a vertical split) or `flex-row` (for a horizontal split).
    *   Inside this div, it maps over the `pane.children` and renders a `<SplitPane />` for each child. This is the recursion!
*   **`else` (the `return` at the bottom)**: This is the **base case**.
    *   If a pane does *not* have a `direction`, it's a final, colored block.
    *   It renders a single `<div>` with the background color set to `pane.color`.
    *   Inside this colored block, it renders the `<SplitControls />`.
    *   It passes down the `splitPane` and `removePane` actions to `SplitControls`, but wraps them in functions that already know the `id` of the current pane. For example: `onSplit={(dir) => splitPane(pane.id, dir)}`.

### `App.jsx`

This is the main entry point for your React application. It's very simple.

**Key Parts:**

*   **`const { root } = useSplitStore()`**: It connects to the Zustand store and gets the `root` object. The `root` object is the top-level block that contains everything else.
*   **`<SplitPane pane={root} />`**: It renders the very first `<SplitPane />` and passes the `root` object to it. This single component then starts the recursive process of rendering all the other nested blocks.

### Summary of How It All Works Together:

1.  `App.jsx` starts by rendering a single `SplitPane` with the initial `root` block from the `splitStore`.
2.  This `SplitPane` is a colored block with control buttons.
3.  When you click "v" or "h" on that block, the `SplitControls` component calls the `splitPane` action from the store.
4.  The `splitStore` updates the `root` object, giving it a `direction` and two `children`.
5.  Because the store's state has changed, React re-renders the components.
6.  Now, when `App.jsx` re-renders, the `root` object passed to `SplitPane` has a `direction`. The `SplitPane` sees this and renders two new `SplitPane` components, one for each child.
7.  This process continues for as long as you keep splitting blocks. When you remove a block, the store updates, and the components re-render to reflect the change.
