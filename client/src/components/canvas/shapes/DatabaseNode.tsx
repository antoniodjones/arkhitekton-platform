import React from 'react';
import { Group, Rect, Ellipse, Text } from 'react-konva';

interface DatabaseNodeProps {
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

export function DatabaseNode({
    id,
    x,
    y,
    width = 120,
    height = 90,
    color = '#10b981', // emerald-500
    label,
    isSelected,
    onSelect,
    onChange,
}: DatabaseNodeProps) {
    const RY = 15; // Vertical radius for cylinder effect

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
            {/* Cylinder Body */}
            <Rect
                x={0}
                y={RY}
                width={width}
                height={height - RY * 2}
                fill="white"
                stroke={isSelected ? '#059669' : '#e2e8f0'}
                strokeWidth={isSelected ? 2 : 1}
                shadowColor="black"
                shadowBlur={10}
                shadowOpacity={0.1}
                shadowOffsetX={0}
                shadowOffsetY={4}
            />

            {/* Bottom Cap (Ellipse) */}
            <Ellipse
                x={width / 2}
                y={height - RY}
                radiusX={width / 2}
                radiusY={RY}
                fill="white"
                stroke={isSelected ? '#059669' : '#e2e8f0'}
                strokeWidth={isSelected ? 2 : 1}
            />
            {/* Mask to hide top half of bottom ellipse stroke inside body? 
          Simpler: just draw Rect over top half? 
          Konva doesn't have easy masking like SVG. 
          We'll just layer them. Rect over Bottom Ellipse? No, standard cylinder is:
          1. Bottom Ellipse (full)
          2. Rect (body)
          3. Top Ellipse (full)
      */}

            <Ellipse
                x={width / 2}
                y={height - RY}
                radiusX={width / 2}
                radiusY={RY}
                fill="white"
                stroke={isSelected ? '#059669' : '#e2e8f0'}
                strokeWidth={isSelected ? 2 : 1}
            />

            <Rect
                x={0}
                y={RY}
                width={width}
                height={height - RY * 2}
                fill="white"
                stroke={isSelected ? '#059669' : '#e2e8f0'}
                strokeWidth={isSelected ? 2 : 1}
            // Hide bottom border of rect so it blends with bottom ellipse?
            // Hard to do with stroke.
            // Let's just place Bottom Ellipse BEHIND Rect.
            />

            {/* Top Cap (Ellipse) */}
            <Ellipse
                x={width / 2}
                y={RY}
                radiusX={width / 2}
                radiusY={RY}
                fill={color}
                stroke={isSelected ? '#059669' : '#e2e8f0'}
                strokeWidth={isSelected ? 2 : 1}
            />

            <Text
                x={10}
                y={RY * 2}
                width={width - 20}
                text={label}
                fontSize={14}
                fontFamily="Inter, sans-serif"
                fill="#1e293b"
                align="center"
                verticalAlign="middle"
                ellipsis={true}
                height={height - RY * 3}
            />
        </Group>
    );
}
