import { useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { PlanLayout } from '@/components/plan/plan-layout';
import { StoryDetailSheet } from '@/components/plan/story-detail-sheet';

/**
 * Story Detail Page Component
 * 
 * Handles deep linking to specific user stories from global search
 * Route: /plan/stories/:id
 * 
 * Related User Story: US-SEARCH-005 (Quick Navigation)
 * Acceptance Criteria:
 * - Single click navigates to detail page
 * - Browser back button returns to Dashboard with search preserved
 * - Cmd/Ctrl+Click opens in new tab
 */
export default function StoryDetailPage() {
  const [, params] = useRoute('/plan/stories/:id');
  const [, setLocation] = useLocation();
  const storyId = params?.id;

  useEffect(() => {
    // If no story ID, redirect to stories list
    if (!storyId) {
      setLocation('/plan/stories');
    }
  }, [storyId, setLocation]);

  const handleClose = () => {
    // Navigate back to stories list when sheet closes
    setLocation('/plan/stories');
  };

  return (
    <PlanLayout>
      <div className="h-full">
        {/* Render the stories list in the background */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">User Stories</h1>
          <p className="text-muted-foreground">Loading story details...</p>
        </div>

        {/* Story detail sheet overlays on top */}
        <StoryDetailSheet
          storyId={storyId || null}
          open={!!storyId}
          onOpenChange={(open) => {
            if (!open) {
              handleClose();
            }
          }}
        />
      </div>
    </PlanLayout>
  );
}

