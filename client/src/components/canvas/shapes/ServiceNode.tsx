import React from 'react';
import { Group, Rect, Text } from 'react-konva';

interface ServiceNodeProps {
    id: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    color?: string;
    label: string;
    isSelected?: boolean;
    onSelect: (id: string) => void;
    onChange: (id: string, newAttrs: { x: number; y: number }) => void;
}

export function ServiceNode({
    id,
    x,
    y,
    width = 150,
    height = 80,
    color = '#3b82f6', // blue-500
    label,
    isSelected,
    onSelect,
    onChange,
}: ServiceNodeProps) {
    return (
        <Group
            x={x}
            y={y}
            draggable
            onClick={(e) => {
                e.cancelBubble = true;
                onSelect(id);
            }}
            onTap={(e) => {
                e.cancelBubble = true;
                onSelect(id);
            }}
            onDragEnd={(e) => {
                onChange(id, {
                    x: e.target.x(),
                    y: e.target.y(),
                });
            }}
        >
            <Rect
                width={width}
                height={height}
                fill="white"
                stroke={isSelected ? '#2563eb' : '#e2e8f0'} // blue-600 or slate-200
                strokeWidth={isSelected ? 2 : 1}
                cornerRadius={8}
                shadowColor="black"
                shadowBlur={10}
                shadowOpacity={0.1}
                shadowOffsetX={0}
                shadowOffsetY={4}
            />
            {/* Header Bar */}
            <Rect
                width={width}
                height={6}
                fill={color}
                cornerRadius={[8, 8, 0, 0]}
            />
            <Text
                x={10}
                y={20}
                width={width - 20}
                text={label}
                fontSize={14}
                fontFamily="Inter, sans-serif"
                fill="#1e293b" // slate-800
                align="center"
                verticalAlign="middle"
                ellipsis={true}
                height={height - 20}
            />
        </Group>
    );
}
