import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { KanbanBoard } from '@/components/plan/kanban-board';
import { StoryDetailSheet } from '@/components/plan/story-detail-sheet';
import { useToast } from '@/hooks/use-toast';

interface Story {
  id: string;
  title: string;
  status: string;
  priority: string;
  storyPoints: number;
}

export default function PlanBoard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  const { data: storiesResponse, isLoading } = useQuery<{ items: Story[] }>({
    queryKey: ['/api/user-stories?pageSize=500'],
  });

  const updateStoryMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Story> }) => {
      const response = await apiRequest('PATCH', `/api/user-stories/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-stories'] });
    },
  });

  const handleStatusChange = async (storyId: string, newStatus: string) => {
    try {
      await updateStoryMutation.mutateAsync({
        id: storyId,
        updates: { status: newStatus }
      });
    } catch (error) {
      toast({
        title: "Failed to update status",
        variant: "destructive",
      });
      throw error;
    }
  };

  const stories = storiesResponse?.items || [];

  return (
    <>
      <KanbanBoard
        tasks={stories as any}
        onStatusChange={handleStatusChange}
        onTaskClick={(story) => setSelectedStoryId(story.id)}
        isLoading={isLoading}
      />
      
      <StoryDetailSheet
        storyId={selectedStoryId}
        open={!!selectedStoryId}
        onOpenChange={(open) => !open && setSelectedStoryId(null)}
      />
    </>
  );
}

