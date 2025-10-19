import { BaseBoxShapeUtil, TLBaseShape } from 'tldraw';

// ============================================
// ARCHIMATE BUSINESS LAYER SHAPES (Yellow)
// ============================================

// Business Actor
export type BusinessActorShape = TLBaseShape<
  'business-actor',
  {
    w: number;
    h: number;
    text: string;
    description?: string;
  }
>;

export class BusinessActorShapeUtil extends BaseBoxShapeUtil<BusinessActorShape> {
  static override type = 'business-actor' as const;

  getDefaultProps(): BusinessActorShape['props'] {
    return {
      w: 120,
      h: 80,
      text: 'Business Actor',
      description: '',
    };
  }

  component(shape: BusinessActorShape) {
    return (
      <div
        style={{
          width: shape.props.w,
          height: shape.props.h,
          backgroundColor: '#FFFFCC',
          border: '1px solid #000000',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          fontSize: '11px',
          fontWeight: 400,
          textAlign: 'center',
          pointerEvents: 'all',
          overflow: 'hidden',
        }}
      >
        <div style={{ wordWrap: 'break-word', width: '100%' }}>
          {shape.props.text}
        </div>
      </div>
    );
  }

  indicator(shape: BusinessActorShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}

// Business Role
export type BusinessRoleShape = TLBaseShape<
  'business-role',
  {
    w: number;
    h: number;
    text: string;
  }
>;

export class BusinessRoleShapeUtil extends BaseBoxShapeUtil<BusinessRoleShape> {
  static override type = 'business-role' as const;

  getDefaultProps(): BusinessRoleShape['props'] {
    return {
      w: 120,
      h: 80,
      text: 'Business Role',
    };
  }

  component(shape: BusinessRoleShape) {
    return (
      <div
        style={{
          width: shape.props.w,
          height: shape.props.h,
          backgroundColor: '#FFFFCC',
          border: '1px solid #000000',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          fontSize: '11px',
          fontWeight: 400,
          textAlign: 'center',
          pointerEvents: 'all',
          overflow: 'hidden',
        }}
      >
        <div style={{ wordWrap: 'break-word', width: '100%' }}>
          {shape.props.text}
        </div>
      </div>
    );
  }

  indicator(shape: BusinessRoleShape) {
    return <rect width={shape.props.w} height={shape.props.h} rx={40} />;
  }
}

// Business Process
export type BusinessProcessShape = TLBaseShape<
  'business-process',
  {
    w: number;
    h: number;
    text: string;
  }
>;

export class BusinessProcessShapeUtil extends BaseBoxShapeUtil<BusinessProcessShape> {
  static override type = 'business-process' as const;

  getDefaultProps(): BusinessProcessShape['props'] {
    return {
      w: 140,
      h: 80,
      text: 'Business Process',
    };
  }

  component(shape: BusinessProcessShape) {
    return (
      <div
        style={{
          width: shape.props.w,
          height: shape.props.h,
          backgroundColor: '#FFFFCC',
          border: '1px solid #000000',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          fontSize: '11px',
          fontWeight: 400,
          textAlign: 'center',
          pointerEvents: 'all',
          overflow: 'hidden',
        }}
      >
        <div style={{ wordWrap: 'break-word', width: '100%' }}>
          {shape.props.text}
        </div>
      </div>
    );
  }

  indicator(shape: BusinessProcessShape) {
    return <rect width={shape.props.w} height={shape.props.h} rx={8} />;
  }
}

// ============================================
// ARCHIMATE APPLICATION LAYER SHAPES (Blue)
// ============================================

// Application Component
export type ApplicationComponentShape = TLBaseShape<
  'app-component',
  {
    w: number;
    h: number;
    text: string;
  }
>;

export class ApplicationComponentShapeUtil extends BaseBoxShapeUtil<ApplicationComponentShape> {
  static override type = 'app-component' as const;

  getDefaultProps(): ApplicationComponentShape['props'] {
    return {
      w: 140,
      h: 80,
      text: 'Application Component',
    };
  }

  component(shape: ApplicationComponentShape) {
    return (
      <div
        style={{
          width: shape.props.w,
          height: shape.props.h,
          backgroundColor: '#B3E0FF',
          border: '1px solid #000000',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          fontSize: '11px',
          fontWeight: 400,
          textAlign: 'center',
          pointerEvents: 'all',
          overflow: 'hidden',
        }}
      >
        <div style={{ wordWrap: 'break-word', width: '100%' }}>
          {shape.props.text}
        </div>
      </div>
    );
  }

  indicator(shape: ApplicationComponentShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}

// Application Service
export type ApplicationServiceShape = TLBaseShape<
  'app-service',
  {
    w: number;
    h: number;
    text: string;
  }
>;

export class ApplicationServiceShapeUtil extends BaseBoxShapeUtil<ApplicationServiceShape> {
  static override type = 'app-service' as const;

  getDefaultProps(): ApplicationServiceShape['props'] {
    return {
      w: 140,
      h: 60,
      text: 'Application Service',
    };
  }

  component(shape: ApplicationServiceShape) {
    return (
      <div
        style={{
          width: shape.props.w,
          height: shape.props.h,
          backgroundColor: '#B3E0FF',
          border: '1px solid #000000',
          borderRadius: shape.props.h / 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 16px',
          fontSize: '11px',
          fontWeight: 400,
          textAlign: 'center',
          pointerEvents: 'all',
          overflow: 'hidden',
        }}
      >
        <div style={{ wordWrap: 'break-word', width: '100%' }}>
          {shape.props.text}
        </div>
      </div>
    );
  }

  indicator(shape: ApplicationServiceShape) {
    return <rect width={shape.props.w} height={shape.props.h} rx={30} />;
  }
}

// Data Object
export type DataObjectShape = TLBaseShape<
  'data-object',
  {
    w: number;
    h: number;
    text: string;
  }
>;

export class DataObjectShapeUtil extends BaseBoxShapeUtil<DataObjectShape> {
  static override type = 'data-object' as const;

  getDefaultProps(): DataObjectShape['props'] {
    return {
      w: 100,
      h: 70,
      text: 'Data Object',
    };
  }

  component(shape: DataObjectShape) {
    return (
      <div
        style={{
          width: shape.props.w,
          height: shape.props.h,
          backgroundColor: '#B3E0FF',
          border: '1px solid #000000',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          fontSize: '11px',
          fontWeight: 400,
          textAlign: 'center',
          pointerEvents: 'all',
          overflow: 'hidden',
        }}
      >
        <div style={{ wordWrap: 'break-word', width: '100%' }}>
          {shape.props.text}
        </div>
      </div>
    );
  }

  indicator(shape: DataObjectShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}

// Business Service
export type BusinessServiceShape = TLBaseShape<
  'business-service',
  {
    w: number;
    h: number;
    text: string;
  }
>;

export class BusinessServiceShapeUtil extends BaseBoxShapeUtil<BusinessServiceShape> {
  static override type = 'business-service' as const;

  getDefaultProps(): BusinessServiceShape['props'] {
    return {
      w: 140,
      h: 60,
      text: 'Business Service',
    };
  }

  component(shape: BusinessServiceShape) {
    return (
      <div
        style={{
          width: shape.props.w,
          height: shape.props.h,
          backgroundColor: '#FFFFCC',
          border: '1px solid #000000',
          borderRadius: shape.props.h / 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 16px',
          fontSize: '11px',
          fontWeight: 400,
          textAlign: 'center',
          pointerEvents: 'all',
          overflow: 'hidden',
        }}
      >
        <div style={{ wordWrap: 'break-word', width: '100%' }}>
          {shape.props.text}
        </div>
      </div>
    );
  }

  indicator(shape: BusinessServiceShape) {
    return <rect width={shape.props.w} height={shape.props.h} rx={30} />;
  }
}

// Business Object
export type BusinessObjectShape = TLBaseShape<
  'business-object',
  {
    w: number;
    h: number;
    text: string;
  }
>;

export class BusinessObjectShapeUtil extends BaseBoxShapeUtil<BusinessObjectShape> {
  static override type = 'business-object' as const;

  getDefaultProps(): BusinessObjectShape['props'] {
    return {
      w: 100,
      h: 70,
      text: 'Business Object',
    };
  }

  component(shape: BusinessObjectShape) {
    return (
      <div
        style={{
          width: shape.props.w,
          height: shape.props.h,
          backgroundColor: '#FFFFCC',
          border: '1px solid #000000',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          fontSize: '11px',
          fontWeight: 400,
          textAlign: 'center',
          pointerEvents: 'all',
          overflow: 'hidden',
        }}
      >
        <div style={{ wordWrap: 'break-word', width: '100%' }}>
          {shape.props.text}
        </div>
      </div>
    );
  }

  indicator(shape: BusinessObjectShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}

// ============================================
// ARCHIMATE TECHNOLOGY LAYER SHAPES (Green)
// ============================================

// Technology Node
export type TechnologyNodeShape = TLBaseShape<
  'tech-node',
  {
    w: number;
    h: number;
    text: string;
  }
>;

export class TechnologyNodeShapeUtil extends BaseBoxShapeUtil<TechnologyNodeShape> {
  static override type = 'tech-node' as const;

  getDefaultProps(): TechnologyNodeShape['props'] {
    return {
      w: 120,
      h: 80,
      text: 'Technology Node',
    };
  }

  component(shape: TechnologyNodeShape) {
    return (
      <div
        style={{
          width: shape.props.w,
          height: shape.props.h,
          backgroundColor: '#C1E1C1',
          border: '1px solid #000000',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          fontSize: '11px',
          fontWeight: 400,
          textAlign: 'center',
          pointerEvents: 'all',
          overflow: 'hidden',
        }}
      >
        <div style={{ wordWrap: 'break-word', width: '100%' }}>
          {shape.props.text}
        </div>
      </div>
    );
  }

  indicator(shape: TechnologyNodeShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}

// Device
export type DeviceShape = TLBaseShape<
  'device',
  {
    w: number;
    h: number;
    text: string;
  }
>;

export class DeviceShapeUtil extends BaseBoxShapeUtil<DeviceShape> {
  static override type = 'device' as const;

  getDefaultProps(): DeviceShape['props'] {
    return {
      w: 100,
      h: 80,
      text: 'Device',
    };
  }

  component(shape: DeviceShape) {
    return (
      <div
        style={{
          width: shape.props.w,
          height: shape.props.h,
          backgroundColor: '#C1E1C1',
          border: '1px solid #000000',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          fontSize: '11px',
          fontWeight: 400,
          textAlign: 'center',
          pointerEvents: 'all',
          overflow: 'hidden',
        }}
      >
        <div style={{ wordWrap: 'break-word', width: '100%' }}>
          {shape.props.text}
        </div>
      </div>
    );
  }

  indicator(shape: DeviceShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}

// Technology Service
export type TechnologyServiceShape = TLBaseShape<
  'tech-service',
  {
    w: number;
    h: number;
    text: string;
  }
>;

export class TechnologyServiceShapeUtil extends BaseBoxShapeUtil<TechnologyServiceShape> {
  static override type = 'tech-service' as const;

  getDefaultProps(): TechnologyServiceShape['props'] {
    return {
      w: 140,
      h: 60,
      text: 'Technology Service',
    };
  }

  component(shape: TechnologyServiceShape) {
    return (
      <div
        style={{
          width: shape.props.w,
          height: shape.props.h,
          backgroundColor: '#C1E1C1',
          border: '1px solid #000000',
          borderRadius: shape.props.h / 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 16px',
          fontSize: '11px',
          fontWeight: 400,
          textAlign: 'center',
          pointerEvents: 'all',
          overflow: 'hidden',
        }}
      >
        <div style={{ wordWrap: 'break-word', width: '100%' }}>
          {shape.props.text}
        </div>
      </div>
    );
  }

  indicator(shape: TechnologyServiceShape) {
    return <rect width={shape.props.w} height={shape.props.h} rx={30} />;
  }
}

// Artifact
export type ArtifactShape = TLBaseShape<
  'artifact',
  {
    w: number;
    h: number;
    text: string;
  }
>;

export class ArtifactShapeUtil extends BaseBoxShapeUtil<ArtifactShape> {
  static override type = 'artifact' as const;

  getDefaultProps(): ArtifactShape['props'] {
    return {
      w: 90,
      h: 70,
      text: 'Artifact',
    };
  }

  component(shape: ArtifactShape) {
    return (
      <div
        style={{
          width: shape.props.w,
          height: shape.props.h,
          backgroundColor: '#C1E1C1',
          border: '1px solid #000000',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          fontSize: '11px',
          fontWeight: 400,
          textAlign: 'center',
          pointerEvents: 'all',
          overflow: 'hidden',
        }}
      >
        <div style={{ wordWrap: 'break-word', width: '100%' }}>
          {shape.props.text}
        </div>
      </div>
    );
  }

  indicator(shape: ArtifactShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}

// Export all shape utilities
export const archiMateShapeUtils = [
  // Business Layer (6 shapes)
  BusinessActorShapeUtil,
  BusinessRoleShapeUtil,
  BusinessProcessShapeUtil,
  BusinessServiceShapeUtil,
  BusinessObjectShapeUtil,
  // Application Layer (3 shapes)
  ApplicationComponentShapeUtil,
  ApplicationServiceShapeUtil,
  DataObjectShapeUtil,
  // Technology Layer (4 shapes)
  TechnologyNodeShapeUtil,
  DeviceShapeUtil,
  TechnologyServiceShapeUtil,
  ArtifactShapeUtil,
];

// Export shape type definitions for TypeScript
export type ArchiMateShape =
  | BusinessActorShape
  | BusinessRoleShape
  | BusinessProcessShape
  | BusinessServiceShape
  | BusinessObjectShape
  | ApplicationComponentShape
  | ApplicationServiceShape
  | DataObjectShape
  | TechnologyNodeShape
  | DeviceShape
  | TechnologyServiceShape
  | ArtifactShape;
