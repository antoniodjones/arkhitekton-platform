import { Arrow, Line } from 'react-konva';
import Konva from 'konva';

/**
 * Canvas Connection Component
 * 
 * User Stories:
 * - US-CVS-006: Connection Creation (10 pts)
 * - US-CVS-011: Connection Routing (5 pts)
 * 
 * Renders connections between shapes with smart routing
 */

export interface CanvasConnectionData {
  id: string;
  sourceShapeId: string;
  targetShapeId: string;
  routingType: 'straight' | 'orthogonal';
  lineStyle: 'solid' | 'dashed';
  arrowType: 'single' | 'bidirectional' | 'none';
  color?: string;
  thickness?: number;
  points: number[]; // [x1, y1, x2, y2, ...] calculated path
}

interface CanvasConnectionProps {
  connection: CanvasConnectionData;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function CanvasConnection({ connection, isSelected, onSelect }: CanvasConnectionProps) {
  const color = connection.color || '#333333';
  const thickness = connection.thickness || 2;
  
  const commonProps = {
    points: connection.points,
    stroke: isSelected ? '#0ea5e9' : color,
    strokeWidth: isSelected ? 3 : thickness,
    lineCap: 'round' as const,
    lineJoin: 'round' as const,
    onClick: onSelect,
    onTap: onSelect,
    shadowColor: isSelected ? '#0ea5e9' : undefined,
    shadowBlur: isSelected ? 8 : undefined,
    shadowOpacity: isSelected ? 0.5 : undefined,
  };

  // Dashed line style
  const dash = connection.lineStyle === 'dashed' ? [10, 5] : undefined;

  // Render based on arrow type
  if (connection.arrowType === 'bidirectional') {
    return (
      <Arrow
        {...commonProps}
        dash={dash}
        pointerAtBeginning={true}
        pointerAtEnding={true}
        pointerLength={10}
        pointerWidth={10}
      />
    );
  } else if (connection.arrowType === 'single') {
    return (
      <Arrow
        {...commonProps}
        dash={dash}
        pointerLength={10}
        pointerWidth={10}
      />
    );
  } else {
    // No arrow
    return (
      <Line
        {...commonProps}
        dash={dash}
      />
    );
  }
}

/**
 * Calculate connection points between two shapes
 * 
 * Implements orthogonal (elbow) routing algorithm
 */
export function calculateConnectionPoints(
  sourceShape: { x: number; y: number; width: number; height: number },
  targetShape: { x: number; y: number; width: number; height: number },
  routingType: 'straight' | 'orthogonal'
): number[] {
  // Calculate center points
  const sourceCenter = {
    x: sourceShape.x + sourceShape.width / 2,
    y: sourceShape.y + sourceShape.height / 2,
  };
  
  const targetCenter = {
    x: targetShape.x + targetShape.width / 2,
    y: targetShape.y + targetShape.height / 2,
  };

  if (routingType === 'straight') {
    // Calculate edge-based connection points (not center-to-center)
    const startPoint = getEdgeIntersectionPoint(sourceShape, sourceCenter, targetCenter);
    const endPoint = getEdgeIntersectionPoint(targetShape, targetCenter, sourceCenter);
    
    return [startPoint.x, startPoint.y, endPoint.x, endPoint.y];
  }

  // Orthogonal (elbow) routing
  return calculateOrthogonalPath(sourceShape, targetShape, sourceCenter, targetCenter);
}

/**
 * Calculate the point where a line from shapeCenter to targetCenter intersects the shape's edge
 */
function getEdgeIntersectionPoint(
  shape: { x: number; y: number; width: number; height: number },
  shapeCenter: { x: number; y: number },
  targetCenter: { x: number; y: number }
): { x: number; y: number } {
  // Calculate the angle from shape center to target center
  const dx = targetCenter.x - shapeCenter.x;
  const dy = targetCenter.y - shapeCenter.y;
  
  // If shapes are at the same position, return center
  if (dx === 0 && dy === 0) {
    return shapeCenter;
  }
  
  // Calculate the intersection with the shape's bounding box
  const angle = Math.atan2(dy, dx);
  
  // Shape boundaries
  const left = shape.x;
  const right = shape.x + shape.width;
  const top = shape.y;
  const bottom = shape.y + shape.height;
  
  // Test intersection with each edge
  let intersectX = shapeCenter.x;
  let intersectY = shapeCenter.y;
  
  // Determine which edge the line exits from based on angle
  const absAngle = Math.abs(angle);
  const halfWidth = shape.width / 2;
  const halfHeight = shape.height / 2;
  const edgeAngle = Math.atan2(halfHeight, halfWidth);
  
  if (absAngle <= edgeAngle) {
    // Exits right edge
    intersectX = right;
    intersectY = shapeCenter.y + (right - shapeCenter.x) * Math.tan(angle);
  } else if (absAngle <= Math.PI - edgeAngle) {
    // Exits top or bottom edge
    if (angle > 0) {
      // Bottom edge
      intersectY = bottom;
      intersectX = shapeCenter.x + (bottom - shapeCenter.y) / Math.tan(angle);
    } else {
      // Top edge
      intersectY = top;
      intersectX = shapeCenter.x + (top - shapeCenter.y) / Math.tan(angle);
    }
  } else {
    // Exits left edge
    intersectX = left;
    intersectY = shapeCenter.y + (left - shapeCenter.x) * Math.tan(angle);
  }
  
  return { x: intersectX, y: intersectY };
}

function calculateOrthogonalPath(
  sourceShape: { x: number; y: number; width: number; height: number },
  targetShape: { x: number; y: number; width: number; height: number },
  sourceCenter: { x: number; y: number },
  targetCenter: { x: number; y: number }
): number[] {
  // Determine which edges to connect (based on relative positions)
  const dx = targetCenter.x - sourceCenter.x;
  const dy = targetCenter.y - sourceCenter.y;
  
  // Start and end points on shape edges
  let startX: number, startY: number, endX: number, endY: number;
  
  // Determine exit side of source shape
  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal connection dominates
    if (dx > 0) {
      // Exit right side of source
      startX = sourceShape.x + sourceShape.width;
      startY = sourceCenter.y;
      // Enter left side of target
      endX = targetShape.x;
      endY = targetCenter.y;
    } else {
      // Exit left side of source
      startX = sourceShape.x;
      startY = sourceCenter.y;
      // Enter right side of target
      endX = targetShape.x + targetShape.width;
      endY = targetCenter.y;
    }
  } else {
    // Vertical connection dominates
    if (dy > 0) {
      // Exit bottom of source
      startX = sourceCenter.x;
      startY = sourceShape.y + sourceShape.height;
      // Enter top of target
      endX = targetCenter.x;
      endY = targetShape.y;
    } else {
      // Exit top of source
      startX = sourceCenter.x;
      startY = sourceShape.y;
      // Enter bottom of target
      endX = targetCenter.x;
      endY = targetShape.y + targetShape.height;
    }
  }

  // Calculate intermediate points for elbow routing
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  // Simple 2-bend path
  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal primary direction
    return [
      startX, startY,      // Start point (on source edge)
      midX, startY,        // First bend (horizontal)
      midX, endY,          // Second bend (vertical)
      endX, endY,          // End point (on target edge)
    ];
  } else {
    // Vertical primary direction
    return [
      startX, startY,      // Start point (on source edge)
      startX, midY,        // First bend (vertical)
      endX, midY,          // Second bend (horizontal)
      endX, endY,          // End point (on target edge)
    ];
  }
}

