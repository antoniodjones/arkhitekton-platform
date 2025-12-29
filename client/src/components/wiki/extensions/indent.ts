/**
 * Indent Extension for TipTap
 * Enables paragraph indentation controls (indent/outdent)
 */

import { Extension } from "@tiptap/react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
      setIndent: (level: number) => ReturnType;
      unsetIndent: () => ReturnType;
    };
  }
}

export const IndentExtension = Extension.create({
  name: "indent",

  addOptions() {
    return {
      types: ["paragraph", "heading"],
      minIndent: 0,
      maxIndent: 10,
      indentUnit: 24, // pixels per indent level
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) => {
              const marginLeft = parseInt(element.style.marginLeft || '0', 10);
              return Math.round(marginLeft / this.options.indentUnit);
            },
            renderHTML: (attributes) => {
              if (!attributes.indent || attributes.indent === 0) {
                return {};
              }
              return {
                style: `margin-left: ${attributes.indent * this.options.indentUnit}px`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from, to } = selection;

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              const currentIndent = node.attrs.indent || 0;
              const newIndent = Math.min(currentIndent + 1, this.options.maxIndent);
              tr = tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                indent: newIndent,
              });
            }
          });

          if (dispatch) dispatch(tr);
          return true;
        },
      outdent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from, to } = selection;

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              const currentIndent = node.attrs.indent || 0;
              const newIndent = Math.max(currentIndent - 1, this.options.minIndent);
              tr = tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                indent: newIndent,
              });
            }
          });

          if (dispatch) dispatch(tr);
          return true;
        },
      setIndent:
        (level: number) =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from, to } = selection;
          const clampedLevel = Math.max(
            this.options.minIndent,
            Math.min(level, this.options.maxIndent)
          );

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              tr = tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                indent: clampedLevel,
              });
            }
          });

          if (dispatch) dispatch(tr);
          return true;
        },
      unsetIndent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from, to } = selection;

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              tr = tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                indent: 0,
              });
            }
          });

          if (dispatch) dispatch(tr);
          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.indent(),
      "Shift-Tab": () => this.editor.commands.outdent(),
    };
  },
});

