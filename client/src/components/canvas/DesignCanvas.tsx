import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useCanvasState } from './hooks/useCanvasState';
import { ServiceNode } from './shapes/ServiceNode';
import { DatabaseNode } from './shapes/DatabaseNode';
import { ArchitecturalObject } from '@shared/schema';

interface DesignCanvasProps {
    objects: ArchitecturalObject[];
    selectedIds: string[];
    onObjectSelect: (ids: string[]) => void;
    onObjectChange: (id: string, newAttrs: { x: number; y: number }) => void;
    isLoading?: boolean;
    width?: number;
    height?: number;
}

export const DesignCanvas: React.FC<DesignCanvasProps> = ({
    objects,
    selectedIds,
    onObjectSelect,
    onObjectChange,
    isLoading = false,
    width,
    height
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: width || window.innerWidth, height: height || window.innerHeight });

    const { stageState, handleWheel, handleDragEnd: handleStageDragEnd } = useCanvasState();

    // Handle Object Drag End (Visual Update)
    const handleNodeChange = (id: string, newAttrs: { x: number; y: number }) => {
        onObjectChange(id, newAttrs);
    };

    const handleNodeSelect = (id: string) => {
        onObjectSelect([id]);
    };

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setSize({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };

        if (!width || !height) {
            window.addEventListener('resize', handleResize);
            handleResize();
        }

        return () => window.removeEventListener('resize', handleResize);
    }, [width, height]);


    // Simple Grid
    const Grid = () => {
        const GRID_SIZE = 50;
        const EXTENT = 5000;
        const lines = [];

        for (let i = -EXTENT; i <= EXTENT; i += GRID_SIZE) {
            lines.push(
                <Line
                    key={`v-${i}`}
                    points={[i, -EXTENT, i, EXTENT]}
                    stroke="#e2e8f0"
                    strokeWidth={1}
                />
            );
            lines.push(
                <Line
                    key={`h-${i}`}
                    points={[-EXTENT, i, EXTENT, i]}
                    stroke="#e2e8f0"
                    strokeWidth={1}
                />
            );
        }
        return <Layer listening={false}>{lines}</Layer>;
    };

    return (
        <div ref={containerRef} className="w-full h-full bg-slate-50 overflow-hidden relative">
            <Stage
                width={size.width}
                height={size.height}
                draggable
                onWheel={handleWheel}
                onDragEnd={handleStageDragEnd}
                scaleX={stageState.scale}
                scaleY={stageState.scale}
                x={stageState.x}
                y={stageState.y}
                onMouseDown={(e) => {
                    // Deselect if clicked on stage
                    if (e.target === e.target.getStage()) {
                        onObjectSelect([]);
                    }
                }}
            >
                <Grid />

                <Layer>
                    {objects?.map((obj) => {
                        const isSelected = selectedIds.includes(obj.id);
                        // Determine type to render
                        const isDatabase = obj.objectType === 'database' || obj.name.toLowerCase().includes('database') || obj.name.toLowerCase().includes('storage');

                        if (isDatabase) {
                            return (
                                <DatabaseNode
                                    key={obj.id}
                                    id={obj.id}
                                    x={(obj.visual as any)?.position?.x || 0}
                                    y={(obj.visual as any)?.position?.y || 0}
                                    label={obj.name}
                                    isSelected={isSelected}
                                    onSelect={handleNodeSelect}
                                    onChange={handleNodeChange}
                                />
                            );
                        }

                        return (
                            <ServiceNode
                                key={obj.id}
                                id={obj.id}
                                x={(obj.visual as any)?.position?.x || 0}
                                y={(obj.visual as any)?.position?.y || 0}
                                label={obj.name}
                                isSelected={isSelected}
                                onSelect={handleNodeSelect}
                                onChange={handleNodeChange}
                            />
                        );
                    })}
                </Layer>
            </Stage>

            {/* Loading Indicator */}
            {isLoading && (
                <div className="absolute top-4 left-4 bg-white/80 p-2 rounded shadow text-xs">
                    Loading canvas objects...
                </div>
            )}

            {/* Zoom Controls Overlay */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur border p-2 rounded-lg shadow-lg flex flex-col gap-2">
                <div className="text-xs font-mono text-center mb-1">
                    {(stageState.scale * 100).toFixed(0)}%
                </div>
            </div>
        </div>
    );
};
