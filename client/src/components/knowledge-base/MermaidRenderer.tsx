import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
  code: string;
  className?: string;
}

export function MermaidRenderer({ code, className }: MermaidRendererProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderMermaid = async () => {
      if (elementRef.current && code) {
        try {
          // Configure mermaid
          mermaid.initialize({ 
            startOnLoad: false,
            theme: 'default',
            themeVariables: {
              primaryColor: '#10b981',
              primaryTextColor: '#1f2937',
              primaryBorderColor: '#059669',
              lineColor: '#6b7280',
              secondaryColor: '#f3f4f6',
              tertiaryColor: '#ffffff'
            }
          });

          // Generate unique ID for this diagram
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          
          // Clear previous content
          elementRef.current.innerHTML = '';
          
          // Render the diagram
          const { svg } = await mermaid.render(id, code);
          elementRef.current.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          elementRef.current.innerHTML = `
            <div class="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p class="text-red-700 dark:text-red-400 text-sm font-medium">Diagram Rendering Error</p>
              <p class="text-red-600 dark:text-red-500 text-xs mt-1">Please check your Mermaid syntax</p>
            </div>
          `;
        }
      }
    };

    renderMermaid();
  }, [code]);

  return (
    <div 
      ref={elementRef} 
      className={`mermaid-container p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 ${className}`}
      data-testid="mermaid-diagram"
    />
  );
}