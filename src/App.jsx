// Import the custom hook to access the global state from the Zustand store.
import { useSplitStore } from "./store/splitStore";
// Import the main recursive component that handles rendering the panes.
import SplitPane from "./components/SplitPane";

// This is the root component of the application.
// Its primary role is to fetch the top-level state and render the initial UI component.
export default function App() {
  // Use the Zustand store hook to subscribe to state changes.
  // We are destructuring the `root` object from the store's state.
  // The `root` object represents the top-level node of our entire pane tree structure.
  const { root } = useSplitStore();
  return (
    // This div acts as the main container for the entire application,
    // styled with Tailwind CSS to take up the full width and height of the screen.
    <div className="w-screen h-screen">
      {/* Render the initial SplitPane component. */}
      {/* We pass the `root` object from our state as the initial `pane` prop. */}
      {/* This single line kicks off the recursive rendering process for all panes. */}
      <SplitPane pane={root} />
    </div>
  );
}
