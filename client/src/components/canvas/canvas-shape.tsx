import { Rect, Circle, RegularPolygon, Ellipse, Path, Text, Group } from 'react-konva';
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
  textColor?: string;
}

interface CanvasShapeProps {
  shape: CanvasShapeData;
  isSelected?: boolean;
  onSelect?: (e?: Konva.KonvaEventObject<MouseEvent>) => void;
  onDragEnd?: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onChange?: (newAttrs: Partial<CanvasShapeData>) => void;
  shapeRef?: (node: Konva.Group | null) => void;
  onTransformEnd?: () => void;
  onDoubleClick?: () => void;
}

export function CanvasShape({ shape, isSelected, onSelect, onDragEnd, onChange, shapeRef, onTransformEnd, onDoubleClick }: CanvasShapeProps) {
  const defaultFill = shape.fill || '#f0f0f0';
  const defaultStroke = shape.stroke || '#333333';
  const defaultStrokeWidth = shape.strokeWidth || 2;
  const labelText = shape.text || shape.type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const fontSize = shape.fontSize || 14;
  const textColor = shape.textColor || '#333333';
  
  const groupProps = {
    id: shape.id,
    x: shape.x,
    y: shape.y,
    width: shape.width,
    height: shape.height,
    rotation: shape.rotation || 0,
    draggable: true,
    ref: shapeRef,
    onClick: (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (onSelect) onSelect(e);
    },
    onTap: (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (onSelect) onSelect(e);
    },
    onDblClick: () => {
      if (onDoubleClick) onDoubleClick();
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
    onTransformEnd: () => {
      if (onTransformEnd) onTransformEnd();
    },
  };
  
  const shapeProps = {
    fill: defaultFill,
    stroke: isSelected ? '#0ea5e9' : defaultStroke,
    strokeWidth: isSelected ? 3 : defaultStrokeWidth,
    shadowColor: isSelected ? '#0ea5e9' : undefined,
    shadowBlur: isSelected ? 10 : undefined,
    shadowOpacity: isSelected ? 0.5 : undefined,
  };

  // Render shape with text label
  const renderShapeElement = () => {
    switch (shape.type) {
      case 'rectangle':
      case 'rectangular':
      case 'process':
      case 'square':
        return (
          <Rect
            {...shapeProps}
            width={shape.width}
            height={shape.height}
            cornerRadius={0}
          />
        );

      case 'rounded-rectangle':
      case 'rounded':
        return (
          <Rect
            {...shapeProps}
            width={shape.width}
            height={shape.height}
            cornerRadius={10}
          />
        );

      case 'circle':
      case 'circular':
      case 'bubble':
        return (
          <Circle
            {...shapeProps}
            radius={shape.width / 2}
          />
        );

      case 'ellipse':
      case 'oval':
        return (
          <Ellipse
            {...shapeProps}
            radiusX={shape.width / 2}
            radiusY={shape.height / 2}
          />
        );

      case 'diamond':
      case 'decision':
        return (
          <RegularPolygon
            {...shapeProps}
            sides={4}
            radius={shape.width / 2}
            rotation={45}
          />
        );

      case 'hexagon':
      case 'hexagonal':
        return (
          <RegularPolygon
            {...shapeProps}
            sides={6}
            radius={shape.width / 2}
          />
        );

      case 'triangle':
      case 'triangular':
      case 'arrow':
        return (
          <RegularPolygon
            {...shapeProps}
            sides={3}
            radius={shape.width / 2}
          />
        );
      
      case 'pentagonal':
        return (
          <RegularPolygon
            {...shapeProps}
            sides={5}
            radius={shape.width / 2}
          />
        );
      
      case 'star':
        return (
          <RegularPolygon
            {...shapeProps}
            sides={5}
            radius={shape.width / 2}
            rotation={-18}
          />
        );
      
      case 'parallelogram':
        return (
          <Rect
            {...shapeProps}
            width={shape.width}
            height={shape.height}
            cornerRadius={0}
            skewX={15}
          />
        );

      case 'cylinder':
      case 'database':
        // Approximate cylinder with path (simplified for Group positioning)
        return (
          <Rect
            {...shapeProps}
            width={shape.width}
            height={shape.height}
            cornerRadius={5}
          />
        );

      case 'cloud':
        // Simplified cloud as ellipse
        return (
          <Ellipse
            {...shapeProps}
            radiusX={shape.width / 2}
            radiusY={shape.height / 2.5}
          />
        );

      case 'frame':
        return (
          <Rect
            {...shapeProps}
            width={shape.width}
            height={shape.height}
            cornerRadius={0}
            dash={[10, 5]}
            fill="transparent"
          />
        );

      case 'document':
        // Simplified document as rounded rect
        return (
          <Rect
            {...shapeProps}
            width={shape.width}
            height={shape.height}
            cornerRadius={[5, 5, 15, 5]}
          />
        );

      case 'text':
        return (
          <Rect
            {...shapeProps}
            width={shape.width}
            height={shape.height}
            fill="transparent"
            dash={[5, 5]}
          />
        );

      default:
        return (
          <Rect
            {...shapeProps}
            width={shape.width}
            height={shape.height}
          />
        );
    }
  };

  return (
    <Group {...groupProps}>
      {renderShapeElement()}
      <Text
        text={labelText}
        fontSize={fontSize}
        fill={textColor}
        width={shape.width}
        height={shape.height}
        align="center"
        verticalAlign="middle"
        listening={false}
      />
    </Group>
  );
}

