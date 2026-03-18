import { EditorView } from "@codemirror/view";

export const daisyUiBridge = EditorView.theme({
  "&": {
    // 1. Force transparent background so the parent's "dark" theme shows through
    backgroundColor: "transparent !important", 
    height: "100%",
  },
  ".cm-content": {
    caretColor: "oklch(var(--p))",
  },
  "&.cm-focused .cm-selectionBackground, ::selection": {
    backgroundColor: "oklch(var(--p) / 0.2)",
  },
  ".cm-gutters": {
    // 2. Make gutter transparent too, or match your theme's base-200
    backgroundColor: "transparent !important", 
    color: "oklch(var(--bc) / 0.5)",
    border: "none",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
    color: "oklch(var(--p))",
  }
});