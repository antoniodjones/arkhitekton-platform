import React, { useState } from 'react';
import { SprintBacklogSplit } from '@/components/plan/sprint-backlog-split';
import { StoryDetailSheet } from '@/components/plan/story-detail-sheet';

export default function PlanBacklog() {
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  return (
    <>
      <SprintBacklogSplit 
        onStoryClick={(story) => setSelectedStoryId(story.id)}
      />
      
      <StoryDetailSheet
        storyId={selectedStoryId}
        open={!!selectedStoryId}
        onOpenChange={(open) => !open && setSelectedStoryId(null)}
      />
    </>
  );
}

