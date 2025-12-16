import { ReactRenderer } from '@tiptap/react';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import Mention from '@tiptap/extension-mention';
import { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import { MentionList, MentionListRef } from './mention-list';

export interface MentionItem {
  id: string;
  entityType: string;
  title: string;
  status: string;
  url: string;
  metadata?: Record<string, any>;
}

// Configure the mention extension with custom suggestion
export const createMentionExtension = () => {
  return Mention.configure({
    HTMLAttributes: {
      class: 'mention',
    },
    renderHTML({ options, node }) {
      const entityType = node.attrs.entityType || 'page';
      const status = node.attrs.status || 'active';
      
      // Status-aware styling
      const statusColors: Record<string, string> = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        done: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
        deprecated: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
        sunset: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        open: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        closed: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
        backlog: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
        draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      };

      // Entity type icons (mapped to Unicode for simplicity)
      const typeIcons: Record<string, string> = {
        user_story: '📋',
        epic: '🎯',
        defect: '🐛',
        model: '📊',
        object: '🔷',
        page: '📄',
        application: '💻',
        capability: '⚡',
        user: '👤',
        adr: '📝',
        requirement: '📌',
      };

      const colorClass = statusColors[status] || statusColors.active;
      const icon = typeIcons[entityType] || '🔗';

      return [
        'span',
        {
          class: `mention inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-sm font-medium cursor-pointer transition-colors hover:opacity-80 ${colorClass}`,
          'data-type': 'mention',
          'data-id': node.attrs.id,
          'data-entity-type': entityType,
          'data-status': status,
          'data-url': node.attrs.url,
        },
        `${icon} ${node.attrs.label ?? node.attrs.id}`,
      ];
    },
    suggestion: {
      items: async ({ query }): Promise<MentionItem[]> => {
        if (!query || query.length < 1) {
          return [];
        }

        try {
          const response = await fetch(`/api/entities/search?q=${encodeURIComponent(query)}&limit=10`);
          if (!response.ok) {
            return [];
          }
          const data = await response.json();
          return data.results || [];
        } catch (error) {
          console.error('Error fetching mentions:', error);
          return [];
        }
      },
      render: () => {
        let component: ReactRenderer<MentionListRef> | null = null;
        let popup: TippyInstance[] | null = null;

        return {
          onStart: (props: SuggestionProps<MentionItem>) => {
            component = new ReactRenderer(MentionList, {
              props,
              editor: props.editor,
            });

            if (!props.clientRect) {
              return;
            }

            popup = tippy('body', {
              getReferenceClientRect: props.clientRect as () => DOMRect,
              appendTo: () => document.body,
              content: component.element,
              showOnCreate: true,
              interactive: true,
              trigger: 'manual',
              placement: 'bottom-start',
              maxWidth: 400,
            });
          },

          onUpdate(props: SuggestionProps<MentionItem>) {
            component?.updateProps(props);

            if (!props.clientRect) {
              return;
            }

            popup?.[0]?.setProps({
              getReferenceClientRect: props.clientRect as () => DOMRect,
            });
          },

          onKeyDown(props: { event: KeyboardEvent }) {
            if (props.event.key === 'Escape') {
              popup?.[0]?.hide();
              return true;
            }

            return component?.ref?.onKeyDown(props.event) ?? false;
          },

          onExit() {
            popup?.[0]?.destroy();
            component?.destroy();
          },
        };
      },
    },
  });
};

export default createMentionExtension;

