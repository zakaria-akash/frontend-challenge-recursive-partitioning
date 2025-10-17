// This is a presentational component that renders the control buttons for a pane.
// It receives two functions as props: `onSplit` and `onRemove`, which are called when the user interacts with the buttons.
export default function SplitControls({ onSplit, onRemove }) {
  return (
    // The main container for the controls.
    // It's styled to be a small, semi-transparent bar with rounded corners, using Tailwind CSS classes.
    <div className="flex gap-1 bg-white/70 text-xs rounded p-1">
      {/* Button to trigger a vertical split. */}
      {/* When clicked, it calls the `onSplit` function passed via props, with 'v' as the argument to indicate a vertical split. */}
      <button onClick={() => onSplit("v")} className="border px-1">
        v
      </button>
      {/* Button to trigger a horizontal split. */}
      {/* When clicked, it calls the `onSplit` function passed via props, with 'h' as the argument to indicate a horizontal split. */}
      <button onClick={() => onSplit("h")} className="border px-1">
        h
      </button>
      {/* Button to trigger the removal of the pane. */}
      {/* When clicked, it directly calls the `onRemove` function passed via props. */}
      <button onClick={onRemove} className="border px-1">
        -
      </button>
    </div>
  );
}
