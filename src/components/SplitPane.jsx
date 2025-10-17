// Import the custom hook to access the global state management store (Zustand).
import { useSplitStore } from "../store/splitStore";
// Import the controls component that contains the split and remove buttons.
import SplitControls from "./SplitControls";

// This is a recursive component that renders a pane.
// It can either be a container for more panes or a final, colored pane.
export default function SplitPane({ pane }) {
  // Destructure the `splitPane` and `removePane` actions from the Zustand store.
  const { splitPane, removePane } = useSplitStore();

  // This condition checks if the current pane has been split.
  // A pane with a `direction` property is a container for other panes.
  if (pane.direction) {
    // Determine the flexbox direction based on the split direction.
    // 'v' for vertical split (flex-col), otherwise horizontal (flex-row).
    const flexDir = pane.direction === "v" ? "flex-col" : "flex-row";

    // Render a container div that will hold the child panes.
    return (
      <div className={`flex ${flexDir} h-full w-full`}>
        {/* Map over the children of the current pane and recursively render a SplitPane for each one. */}
        {pane.children.map((child) => (
          // Each child is wrapped in a div that takes up equal space (`flex-1`).
          // The `key` is essential for React to efficiently update the list.
          <div key={child.id} className="flex-1 border">
            <SplitPane pane={child} />
          </div>
        ))}
      </div>
    );
  }

  // This is the "base case" for the recursion.
  // It renders if the pane has no `direction`, meaning it's a leaf node in the tree.
  return (
    <div
      // This div represents the final, colored pane.
      className="relative flex items-center justify-center w-full h-full border"
      // The background color is set from the pane's `color` property.
      style={{ backgroundColor: pane.color }}
    >
      {/* Render the control buttons (split V, split H, remove) inside the pane. */}
      <SplitControls
        // Pass a function to the `onSplit` prop that calls the store's `splitPane` action with this pane's ID and the chosen direction.
        onSplit={(dir) => splitPane(pane.id, dir)}
        // Pass a function to the `onRemove` prop that calls the store's `removePane` action with this pane's ID.
        onRemove={() => removePane(pane.id)}
      />
    </div>
  );
}
