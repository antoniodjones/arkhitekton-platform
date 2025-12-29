/**
 * Superscript Extension for TipTap
 * Enables superscript text formatting (e.g., x²)
 */

import { Mark, mergeAttributes } from "@tiptap/core";

export interface SuperscriptOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    superscript: {
      setSuperscript: () => ReturnType;
      toggleSuperscript: () => ReturnType;
      unsetSuperscript: () => ReturnType;
    };
  }
}

export const SuperscriptExtension = Mark.create<SuperscriptOptions>({
  name: "superscript",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: "sup",
      },
      {
        style: "vertical-align",
        getAttrs: (value) => {
          if (value === "super") {
            return {};
          }
          return false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["sup", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setSuperscript:
        () =>
        ({ commands }) => {
          return commands.setMark(this.name);
        },
      toggleSuperscript:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },
      unsetSuperscript:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-.": () => this.editor.commands.toggleSuperscript(),
    };
  },
});

