import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Signal to prerenderer that the app has finished rendering
document.dispatchEvent(new Event("render-event"));
