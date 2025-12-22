import { Rect, Circle, RegularPolygon, Ellipse, Path, Text } from 'react-konva';
import Konva from 'konva';
import { ShapeType } from './shape-palette';

/**
 * Canvas Shape Renderer
 * 
 * Renders Konva shapes based on shape type
 * Supports US-CVS-010 (Basic Shape Library) and US-CVS-004 (Drag & Drop)
 */

export interface CanvasShapeData {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  text?: string;
  fontSize?: number;
}

interface CanvasShapeProps {
  shape: CanvasShapeData;
  isSelected?: boolean;
  onSelect?: (e?: Konva.KonvaEventObject<MouseEvent>) => void;
  onDragEnd?: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onChange?: (newAttrs: Partial<CanvasShapeData>) => void;
}

export function CanvasShape({ shape, isSelected, onSelect, onDragEnd, onChange }: CanvasShapeProps) {
  const defaultFill = shape.fill || '#f0f0f0';
  const defaultStroke = shape.stroke || '#333333';
  const defaultStrokeWidth = shape.strokeWidth || 2;
  
  const commonProps = {
    id: shape.id,
    x: shape.x,
    y: shape.y,
    rotation: shape.rotation || 0,
    fill: defaultFill,
    stroke: isSelected ? '#0ea5e9' : defaultStroke,
    strokeWidth: isSelected ? 3 : defaultStrokeWidth,
    draggable: true,
    onClick: (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (onSelect) onSelect(e);
    },
    onTap: (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (onSelect) onSelect(e);
    },
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
      if (onDragEnd) onDragEnd(e);
      if (onChange) {
        onChange({
          x: e.target.x(),
          y: e.target.y(),
        });
      }
    },
    shadowColor: isSelected ? '#0ea5e9' : undefined,
    shadowBlur: isSelected ? 10 : undefined,
    shadowOpacity: isSelected ? 0.5 : undefined,
  };

  // Render different shape types
  switch (shape.type) {
    case 'rectangle':
    case 'process':
      return (
        <Rect
          {...commonProps}
          width={shape.width}
          height={shape.height}
          cornerRadius={0}
        />
      );

    case 'rounded-rectangle':
      return (
        <Rect
          {...commonProps}
          width={shape.width}
          height={shape.height}
          cornerRadius={10}
        />
      );

    case 'circle':
      return (
        <Circle
          {...commonProps}
          radius={shape.width / 2}
        />
      );

    case 'ellipse':
      return (
        <Ellipse
          {...commonProps}
          radiusX={shape.width / 2}
          radiusY={shape.height / 2}
        />
      );

    case 'diamond':
    case 'decision':
      return (
        <RegularPolygon
          {...commonProps}
          sides={4}
          radius={shape.width / 2}
          rotation={45}
        />
      );

    case 'hexagon':
      return (
        <RegularPolygon
          {...commonProps}
          sides={6}
          radius={shape.width / 2}
        />
      );

    case 'triangle':
      return (
        <RegularPolygon
          {...commonProps}
          sides={3}
          radius={shape.width / 2}
        />
      );

    case 'cylinder':
    case 'database':
      // Approximate cylinder with path
      const cylinderPath = `
        M ${shape.x} ${shape.y + 15}
        Q ${shape.x + shape.width / 2} ${shape.y + 5}, ${shape.x + shape.width} ${shape.y + 15}
        L ${shape.x + shape.width} ${shape.y + shape.height - 15}
        Q ${shape.x + shape.width / 2} ${shape.y + shape.height - 5}, ${shape.x} ${shape.y + shape.height - 15}
        Z
        M ${shape.x} ${shape.y + 15}
        Q ${shape.x + shape.width / 2} ${shape.y + 25}, ${shape.x + shape.width} ${shape.y + 15}
      `;
      return (
        <Path
          {...commonProps}
          data={cylinderPath}
        />
      );

    case 'cloud':
      // Approximate cloud shape with circles (simplified)
      return (
        <>
          <Circle {...commonProps} x={shape.x + 30} y={shape.y + 30} radius={25} />
          <Circle {...commonProps} x={shape.x + 60} y={shape.y + 20} radius={30} />
          <Circle {...commonProps} x={shape.x + 90} y={shape.y + 30} radius={25} />
          <Circle {...commonProps} x={shape.x + 60} y={shape.y + 50} radius={35} />
        </>
      );

    case 'frame':
      return (
        <Rect
          {...commonProps}
          width={shape.width}
          height={shape.height}
          cornerRadius={0}
          dash={[10, 5]}
          fill="transparent"
        />
      );

    case 'document':
      // Wavy bottom document shape
      const docPath = `
        M ${shape.x} ${shape.y}
        L ${shape.x + shape.width} ${shape.y}
        L ${shape.x + shape.width} ${shape.y + shape.height - 20}
        Q ${shape.x + shape.width * 0.75} ${shape.y + shape.height}, 
          ${shape.x + shape.width / 2} ${shape.y + shape.height - 10}
        Q ${shape.x + shape.width * 0.25} ${shape.y + shape.height - 20}, 
          ${shape.x} ${shape.y + shape.height - 10}
        Z
      `;
      return (
        <Path
          {...commonProps}
          data={docPath}
        />
      );

    case 'text':
      return (
        <Text
          {...commonProps}
          text={shape.text || 'Text'}
          fontSize={shape.fontSize || 14}
          fill={shape.stroke || '#000'}
          width={shape.width}
          height={shape.height}
          align="center"
          verticalAlign="middle"
        />
      );

    default:
      // Fallback to rectangle
      return (
        <Rect
          {...commonProps}
          width={shape.width}
          height={shape.height}
        />
      );
  }
}

