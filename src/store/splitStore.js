// Import the `create` function from Zustand, which is the core utility for creating a store.
import { create } from "zustand";

// A helper function to generate a random HSL color string.
// This adds visual distinction to new panes when they are created.
function randomColor() {
  return `hsl(${Math.random() * 360}, 100%, 50%)`;
}

// Create the Zustand store. `create` is the main function from Zustand.
// It takes a setup function that receives `set` (and optionally `get`) as arguments.
// `set` is used to immutably update the store's state.
export const useSplitStore = create((set) => ({
  // This is the initial state of the store.
  // `root` represents the top-level pane of the entire application.
  // It starts as a single, colored pane with no children or split direction.
  root: { id: "root", color: randomColor(), direction: null, children: [] },

  // This is an action to split a pane into two new panes.
  // It takes the `id` of the pane to split and the `direction` of the split ('v' or 'h').
  splitPane: (id, direction) => set((state) => {
    // Create a deep copy of the current state to ensure immutability.
    // `structuredClone` is a modern and effective way to deep-clone objects,
    // preventing direct mutation of the original state.
    const newState = structuredClone(state.root);
    // Find the specific pane object within the state tree that needs to be split.
    const target = findPane(newState, id);

    // If the pane isn't found (a safe-guard), return the original state without changes.
    if (!target) return state;

    // Update the target pane to become a container.
    // Set its `direction` to indicate how its children should be laid out (flex-col or flex-row).
    target.direction = direction;
    // Create two new child panes.
    target.children = [
      // The first child inherits the color of the parent pane it's replacing.
      { id: crypto.randomUUID(), color: target.color, direction: null, children: [] },
      // The second child gets a new random color for visual feedback.
      { id: crypto.randomUUID(), color: randomColor(), direction: null, children: [] },
    ];
    // Return the new state object to update the store.
    return { root: newState };
  }),

  // This is an action to remove a pane from the tree.
  removePane: (id) => set((state) => {
    // Create a deep copy of the state for immutable updates.
    const newState = structuredClone(state.root);
    // Call the recursive helper function to find and remove the pane.
    removePaneById(newState, id);
    // Return the updated state.
    return { root: newState };
  }),
}));

// A recursive helper function to find a pane by its ID within the nested state tree.
function findPane(node, id) {
  // Base case: If the current node's ID matches the target ID, we've found it.
  if (node.id === id) return node;
  // Recursive step: If the node has children, iterate through them.
  for (const child of node.children || []) {
    // Call `findPane` on each child.
    const found = findPane(child, id);
    // If the pane is found in a child branch, return it immediately.
    if (found) return found;
  }
  // If the loop completes without finding the pane, it's not in this branch.
  return null;
}

// A recursive helper function to remove a pane by its ID.
function removePaneById(node, id, parent = null) {
  // If the current node has no children, there's nothing to do in this branch.
  if (!node.children || node.children.length === 0) return;

  // Filter the children array. This creates a new array, which is good for immutability.
  node.children = node.children.filter((child) => {
    if (child.id === id) {
      // This is the core logic for collapsing a pane.
      // If a parent has exactly two children and one is being removed,
      // the parent should "collapse" and be replaced by the surviving child.
      if (node.children.length === 2) {
        // Find the child that is NOT being removed (the "survivor").
        const survivor = node.children.find((c) => c.id !== id);
        // Promote the survivor by copying its properties (id, color, children, etc.)
        // onto its parent node. This effectively replaces the parent with the child.
        Object.assign(node, { ...survivor, id: node.id });
      }
      // Return false to remove the current child from the filtered array.
      return false;
    }
    // If the child's ID doesn't match, recursively call this function on it to check its children.
    removePaneById(child, id, node);
    // Return true to keep this child in the filtered array.
    return true;
  });
}
