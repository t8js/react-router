import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";

createRoot(document.querySelector("#app")!).render(<App />);
