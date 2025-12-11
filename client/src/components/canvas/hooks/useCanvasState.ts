import { useState, useCallback } from 'react';
import Konva from 'konva';

interface CanvasState {
    scale: number;
    x: number;
    y: number;
}

interface UseCanvasStateProps {
    initialScale?: number;
    initialX?: number;
    initialY?: number;
}

export const useCanvasState = ({
    initialScale = 1,
    initialX = 0,
    initialY = 0,
}: UseCanvasStateProps = {}) => {
    const [stageState, setStageState] = useState<CanvasState>({
        scale: initialScale,
        x: initialX,
        y: initialY,
    });

    const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();

        const scaleBy = 1.1;
        const stage = e.target.getStage();

        if (!stage) return;

        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        if (!pointer) return;

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        // Calculate new scale
        const direction = e.evt.deltaY > 0 ? -1 : 1;
        let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        // Limit scale
        newScale = Math.max(0.05, Math.min(newScale, 10));

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        setStageState({
            scale: newScale,
            x: newPos.x,
            y: newPos.y,
        });
    }, []);

    const handleDragEnd = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
        // Only update if it's the stage dragging (not an object on the stage)
        // Note: We usually put draggable on the Stage, so e.target might be the stage
        // But users might verify this by checking if e.target === e.target.getStage()
        // However, Konva event bubbling can be tricky.

        const stage = e.target.getStage();
        if (stage && e.target === stage) {
            setStageState(prev => ({
                ...prev,
                x: stage.x(),
                y: stage.y()
            }));
        }
    }, []);

    return {
        stageState,
        setStageState,
        handleWheel,
        handleDragEnd
    };
};
