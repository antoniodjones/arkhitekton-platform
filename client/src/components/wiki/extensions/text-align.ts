/**
 * TextAlign Extension for TipTap
 * Enables text alignment (left, center, right, justify) for paragraphs and headings
 */

import { Extension } from "@tiptap/react";

export type TextAlignValue = 'left' | 'center' | 'right' | 'justify';

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    textAlign: {
      setTextAlign: (alignment: TextAlignValue) => ReturnType;
      unsetTextAlign: () => ReturnType;
    };
  }
}

export const TextAlignExtension = Extension.create({
  name: "textAlign",

  addOptions() {
    return {
      types: ["paragraph", "heading"],
      alignments: ["left", "center", "right", "justify"] as TextAlignValue[],
      defaultAlignment: "left" as TextAlignValue,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textAlign: {
            default: this.options.defaultAlignment,
            parseHTML: (element) => {
              const alignment = element.style.textAlign;
              return this.options.alignments.includes(alignment as TextAlignValue)
                ? alignment
                : this.options.defaultAlignment;
            },
            renderHTML: (attributes) => {
              if (!attributes.textAlign || attributes.textAlign === this.options.defaultAlignment) {
                return {};
              }
              return {
                style: `text-align: ${attributes.textAlign}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setTextAlign:
        (alignment: TextAlignValue) =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from, to } = selection;

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              tr = tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                textAlign: alignment,
              });
            }
          });

          if (dispatch) dispatch(tr);
          return true;
        },
      unsetTextAlign:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from, to } = selection;

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              tr = tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                textAlign: this.options.defaultAlignment,
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
      "Mod-Shift-l": () => this.editor.commands.setTextAlign("left"),
      "Mod-Shift-e": () => this.editor.commands.setTextAlign("center"),
      "Mod-Shift-r": () => this.editor.commands.setTextAlign("right"),
      "Mod-Shift-j": () => this.editor.commands.setTextAlign("justify"),
    };
  },
});

