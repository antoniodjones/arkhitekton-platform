/**
 * Subscript Extension for TipTap
 * Enables subscript text formatting (e.g., H₂O)
 */

import { Mark, mergeAttributes } from "@tiptap/core";

export interface SubscriptOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    subscript: {
      setSubscript: () => ReturnType;
      toggleSubscript: () => ReturnType;
      unsetSubscript: () => ReturnType;
    };
  }
}

export const SubscriptExtension = Mark.create<SubscriptOptions>({
  name: "subscript",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: "sub",
      },
      {
        style: "vertical-align",
        getAttrs: (value) => {
          if (value === "sub") {
            return {};
          }
          return false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["sub", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setSubscript:
        () =>
        ({ commands }) => {
          return commands.setMark(this.name);
        },
      toggleSubscript:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },
      unsetSubscript:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-,": () => this.editor.commands.toggleSubscript(),
    };
  },
});

