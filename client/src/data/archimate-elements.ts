export interface ArchimateElement {
  id: string;
  name: string;
  type: 'structural' | 'behavioral' | 'motivational' | 'passive';
  category: 'business' | 'application' | 'data' | 'technology';
  framework: 'archimate' | 'togaf' | 'bpmn';
  description: string;
  usageGuidelines: string;
  iconName: string;
  color: string;
  shape: 'rectangular' | 'rounded' | 'diamond';
  relationships: string[];
}

export const archimateElements: ArchimateElement[] = [
  // Business Architecture - Active Structure Elements
  {
    id: 'business-actor',
    name: 'Business Actor',
    type: 'structural',
    category: 'business',
    framework: 'archimate',
    description: 'An organizational entity that is capable of performing behavior.',
    usageGuidelines: 'Use to represent individuals, organizational units, or external organizations that perform business behavior. Can be assigned to business roles, perform business processes, and access business objects.',
    iconName: 'User',
    color: 'hsl(12 76% 61%)',
    shape: 'rectangular',
    relationships: ['Business Role', 'Business Process', 'Business Object']
  },
  {
    id: 'business-role',
    name: 'Business Role',
    type: 'structural',
    category: 'business',
    framework: 'archimate',
    description: 'The responsibility for performing specific behavior.',
    usageGuidelines: 'Use to model responsibilities assigned to business actors. Defines what behavior an actor should perform.',
    iconName: 'Users',
    color: 'hsl(12 76% 61%)',
    shape: 'rectangular',
    relationships: ['Business Actor', 'Business Process', 'Business Function']
  },
  {
    id: 'business-collaboration',
    name: 'Business Collaboration',
    type: 'structural',
    category: 'business',
    framework: 'archimate',
    description: 'An aggregate of two or more business internal active structure elements.',
    usageGuidelines: 'Use to model collective behavior of multiple business actors working together to achieve common goals.',
    iconName: 'Handshake',
    color: 'hsl(12 76% 61%)',
    shape: 'rectangular',
    relationships: ['Business Actor', 'Business Role', 'Business Interface']
  },
  {
    id: 'business-interface',
    name: 'Business Interface',
    type: 'structural',
    category: 'business',
    framework: 'archimate',
    description: 'A point of access where business services are made available.',
    usageGuidelines: 'Use to model access points for business services. Represents how external parties interact with business capabilities.',
    iconName: 'Network',
    color: 'hsl(12 76% 61%)',
    shape: 'rectangular',
    relationships: ['Business Service', 'Business Actor', 'Business Process']
  },
  {
    id: 'location',
    name: 'Location',
    type: 'structural',
    category: 'business',
    framework: 'archimate',
    description: 'A conceptual or physical place or position.',
    usageGuidelines: 'Use to model physical or conceptual locations where business activities take place.',
    iconName: 'MapPin',
    color: 'hsl(12 76% 61%)',
    shape: 'rectangular',
    relationships: ['Business Actor', 'Business Process', 'Facility']
  },
  {
    id: 'capability',
    name: 'Capability',
    type: 'structural',
    category: 'business',
    framework: 'archimate',
    description: 'An ability that an active structure element possesses.',
    usageGuidelines: 'Use to model high-level business abilities independent of how they are implemented.',
    iconName: 'Puzzle',
    color: 'hsl(12 76% 61%)',
    shape: 'rectangular',
    relationships: ['Business Process', 'Business Function', 'Resource']
  },

  // Business Architecture - Behavior Elements
  {
    id: 'business-process',
    name: 'Business Process',
    type: 'behavioral',
    category: 'business',
    framework: 'archimate',
    description: 'A sequence of business behaviors that achieves a specific result.',
    usageGuidelines: 'Use to model end-to-end business processes. Should represent meaningful business outcomes.',
    iconName: 'Cog',
    color: 'hsl(173 58% 39%)',
    shape: 'rounded',
    relationships: ['Business Actor', 'Business Role', 'Business Object', 'Business Service']
  },
  {
    id: 'business-function',
    name: 'Business Function',
    type: 'behavioral',
    category: 'business',
    framework: 'archimate',
    description: 'A collection of business behavior based on chosen criteria.',
    usageGuidelines: 'Use to group related business behaviors by functional area or organizational responsibility.',
    iconName: 'FolderTree',
    color: 'hsl(173 58% 39%)',
    shape: 'rounded',
    relationships: ['Business Role', 'Business Process', 'Business Service']
  },
  {
    id: 'business-interaction',
    name: 'Business Interaction',
    type: 'behavioral',
    category: 'business',
    framework: 'archimate',
    description: 'A unit of collective business behavior performed by business actors.',
    usageGuidelines: 'Use to model collaborative behavior between multiple business actors.',
    iconName: 'ArrowLeftRight',
    color: 'hsl(173 58% 39%)',
    shape: 'rounded',
    relationships: ['Business Collaboration', 'Business Actor', 'Business Interface']
  },
  {
    id: 'business-event',
    name: 'Business Event',
    type: 'behavioral',
    category: 'business',
    framework: 'archimate',
    description: 'A business behavior element that denotes an organizational state change.',
    usageGuidelines: 'Use to model triggers for business processes or significant business state changes.',
    iconName: 'CalendarCheck',
    color: 'hsl(173 58% 39%)',
    shape: 'rounded',
    relationships: ['Business Process', 'Business Rule', 'Business Object']
  },
  {
    id: 'business-service',
    name: 'Business Service',
    type: 'behavioral',
    category: 'business',
    framework: 'archimate',
    description: 'Explicitly defined exposed business behavior.',
    usageGuidelines: 'Use to model externally visible business capabilities provided to stakeholders.',
    iconName: 'Bell',
    color: 'hsl(173 58% 39%)',
    shape: 'rounded',
    relationships: ['Business Interface', 'Business Process', 'Value Stream']
  },
  {
    id: 'value-stream',
    name: 'Value Stream',
    type: 'behavioral',
    category: 'business',
    framework: 'archimate',
    description: 'A representation of an end-to-end collection of value-adding activities.',
    usageGuidelines: 'Use to model how value flows through the organization from customer request to delivery.',
    iconName: 'TrendingUp',
    color: 'hsl(173 58% 39%)',
    shape: 'rounded',
    relationships: ['Business Process', 'Business Service', 'Product']
  },

  // Business Architecture - Passive Structure Elements
  {
    id: 'business-object',
    name: 'Business Object',
    type: 'passive',
    category: 'business',
    framework: 'archimate',
    description: 'A passive element that has relevance from a business perspective.',
    usageGuidelines: 'Use to model information, documents, or other passive elements used by business processes.',
    iconName: 'FileText',
    color: 'hsl(197 37% 24%)',
    shape: 'rectangular',
    relationships: ['Business Process', 'Business Service', 'Data Object']
  },
  {
    id: 'contract',
    name: 'Contract',
    type: 'passive',
    category: 'business',
    framework: 'archimate',
    description: 'A formal or informal specification of agreement.',
    usageGuidelines: 'Use to model formal agreements between parties, including SLAs and business contracts.',
    iconName: 'FileContract',
    color: 'hsl(197 37% 24%)',
    shape: 'rectangular',
    relationships: ['Business Actor', 'Business Service', 'Product']
  },
  {
    id: 'representation',
    name: 'Representation',
    type: 'passive',
    category: 'business',
    framework: 'archimate',
    description: 'A perceptible form of the information carried by a business object.',
    usageGuidelines: 'Use to model how business objects are presented or visualized.',
    iconName: 'BarChart3',
    color: 'hsl(197 37% 24%)',
    shape: 'rectangular',
    relationships: ['Business Object', 'Business Service', 'Business Interface']
  },
  {
    id: 'product',
    name: 'Product',
    type: 'passive',
    category: 'business',
    framework: 'archimate',
    description: 'A coherent collection of services and/or passive structure elements.',
    usageGuidelines: 'Use to model business products or offerings provided to customers.',
    iconName: 'Package',
    color: 'hsl(197 37% 24%)',
    shape: 'rectangular',
    relationships: ['Business Service', 'Contract', 'Value Stream']
  },

  // Business Architecture - Motivational Elements
  {
    id: 'goal',
    name: 'Goal',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'An end state that a stakeholder intends to achieve.',
    usageGuidelines: 'Use to model high-level business objectives and desired outcomes.',
    iconName: 'Target',
    color: 'hsl(43 74% 66%)',
    shape: 'diamond',
    relationships: ['Outcome', 'Requirement', 'Principle']
  },
  {
    id: 'outcome',
    name: 'Outcome',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'An end result that has been or will be achieved.',
    usageGuidelines: 'Use to model measurable results that demonstrate goal achievement.',
    iconName: 'Flag',
    color: 'hsl(43 74% 66%)',
    shape: 'diamond',
    relationships: ['Goal', 'Business Process', 'Value Stream']
  },
  {
    id: 'principle',
    name: 'Principle',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'A normative property of all systems in a given context.',
    usageGuidelines: 'Use to model fundamental rules and guidelines that govern the organization.',
    iconName: 'Scale',
    color: 'hsl(43 74% 66%)',
    shape: 'diamond',
    relationships: ['Goal', 'Requirement', 'Constraint']
  },
  {
    id: 'requirement',
    name: 'Requirement',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'A statement of need that must be met by the architecture.',
    usageGuidelines: 'Use to model specific requirements that must be satisfied by the solution.',
    iconName: 'ClipboardList',
    color: 'hsl(43 74% 66%)',
    shape: 'diamond',
    relationships: ['Goal', 'Principle', 'Constraint']
  },
  {
    id: 'constraint',
    name: 'Constraint',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'A restriction on the way in which the architecture is realized.',
    usageGuidelines: 'Use to model limitations and restrictions that must be respected.',
    iconName: 'AlertTriangle',
    color: 'hsl(43 74% 66%)',
    shape: 'diamond',
    relationships: ['Requirement', 'Principle', 'Goal']
  },
  {
    id: 'meaning',
    name: 'Meaning',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'The knowledge or expertise present in a business object.',
    usageGuidelines: 'Use to model the semantic content or meaning of business information.',
    iconName: 'Lightbulb',
    color: 'hsl(43 74% 66%)',
    shape: 'diamond',
    relationships: ['Business Object', 'Representation', 'Value']
  },

  // Application Architecture Elements
  {
    id: 'application-component',
    name: 'Application Component',
    type: 'structural',
    category: 'application',
    framework: 'archimate',
    description: 'An encapsulation of application functionality.',
    usageGuidelines: 'Use to model modular units of application functionality that can be deployed independently.',
    iconName: 'Box',
    color: 'hsl(217 91% 60%)',
    shape: 'rectangular',
    relationships: ['Application Interface', 'Application Service', 'Data Object']
  },
  {
    id: 'application-collaboration',
    name: 'Application Collaboration',
    type: 'structural',
    category: 'application',
    framework: 'archimate',
    description: 'An aggregate of application components that work together.',
    usageGuidelines: 'Use to model how multiple application components collaborate to provide functionality.',
    iconName: 'Network',
    color: 'hsl(217 91% 60%)',
    shape: 'rectangular',
    relationships: ['Application Component', 'Application Interface', 'Application Service']
  },
  {
    id: 'application-interface',
    name: 'Application Interface',
    type: 'structural',
    category: 'application',
    framework: 'archimate',
    description: 'A point of access where application services are made available.',
    usageGuidelines: 'Use to model APIs, user interfaces, and other access points to application functionality.',
    iconName: 'Monitor',
    color: 'hsl(217 91% 60%)',
    shape: 'rectangular',
    relationships: ['Application Service', 'Application Component', 'Technology Interface']
  },

  // Data Architecture Elements
  {
    id: 'data-object',
    name: 'Data Object',
    type: 'passive',
    category: 'data',
    framework: 'archimate',
    description: 'Data structured for automated processing.',
    usageGuidelines: 'Use to model structured data elements, entities, and information assets.',
    iconName: 'Database',
    color: 'hsl(158 58% 45%)',
    shape: 'rectangular',
    relationships: ['Application Component', 'Business Object', 'Technology Service']
  },
  {
    id: 'artifact',
    name: 'Artifact',
    type: 'passive',
    category: 'technology',
    framework: 'archimate',
    description: 'A piece of data that is used or produced in a software development process.',
    usageGuidelines: 'Use to model files, documents, databases, and other physical manifestations of data.',
    iconName: 'File',
    color: 'hsl(158 58% 45%)',
    shape: 'rectangular',
    relationships: ['Data Object', 'Technology Service', 'Node']
  },

  // Technology Architecture Elements
  {
    id: 'node',
    name: 'Node',
    type: 'structural',
    category: 'technology',
    framework: 'archimate',
    description: 'A computational or physical resource that hosts, manipulates, or interacts with other computational or physical resources.',
    usageGuidelines: 'Use to model servers, devices, virtual machines, and other computational resources.',
    iconName: 'Server',
    color: 'hsl(270 50% 50%)',
    shape: 'rectangular',
    relationships: ['Technology Service', 'Artifact', 'Technology Interface']
  },
  {
    id: 'device',
    name: 'Device',
    type: 'structural',
    category: 'technology',
    framework: 'archimate',
    description: 'A physical IT resource upon which system software and artifacts may be stored or deployed.',
    usageGuidelines: 'Use to model physical hardware devices, sensors, and equipment.',
    iconName: 'HardDrive',
    color: 'hsl(270 50% 50%)',
    shape: 'rectangular',
    relationships: ['Node', 'Technology Service', 'Technology Interface']
  },
  {
    id: 'technology-service',
    name: 'Technology Service',
    type: 'behavioral',
    category: 'technology',
    framework: 'archimate',
    description: 'An explicitly defined exposed technology behavior.',
    usageGuidelines: 'Use to model technology capabilities exposed to applications and business services.',
    iconName: 'Settings',
    color: 'hsl(270 50% 50%)',
    shape: 'rounded',
    relationships: ['Technology Interface', 'Node', 'Application Component']
  },

  // TOGAF Framework Elements
  {
    id: 'architecture-domain',
    name: 'Architecture Domain',
    type: 'structural',
    category: 'business',
    framework: 'togaf',
    description: 'A TOGAF architecture layer representing a specific domain of the enterprise.',
    usageGuidelines: 'Use to organize architecture views by TOGAF domains: Business, Data, Application, Technology.',
    iconName: 'Layers',
    color: 'hsl(217 91% 35%)',
    shape: 'rectangular',
    relationships: ['Architecture View', 'Viewpoint', 'Building Block']
  },
  {
    id: 'roadmap',
    name: 'Roadmap',
    type: 'behavioral',
    category: 'business',
    framework: 'togaf',
    description: 'A transformation path from current to target architecture.',
    usageGuidelines: 'Use to model transformation initiatives and migration paths in enterprise architecture.',
    iconName: 'Route',
    color: 'hsl(217 91% 35%)',
    shape: 'rounded',
    relationships: ['Architecture Domain', 'Gap Analysis', 'Work Package']
  },
  {
    id: 'architecture-view',
    name: 'Architecture View',
    type: 'passive',
    category: 'business',
    framework: 'togaf',
    description: 'A representation of the architecture from the perspective of specific stakeholders.',
    usageGuidelines: 'Use to create stakeholder-specific views of the enterprise architecture.',
    iconName: 'Eye',
    color: 'hsl(217 91% 35%)',
    shape: 'rectangular',
    relationships: ['Viewpoint', 'Stakeholder', 'Architecture Domain']
  },
  {
    id: 'gap-analysis',
    name: 'Gap Analysis',
    type: 'behavioral',
    category: 'business',
    framework: 'togaf',
    description: 'A comparison between current and target architecture states.',
    usageGuidelines: 'Use to identify differences between current and desired future architecture states.',
    iconName: 'GitCompare',
    color: 'hsl(217 91% 35%)',
    shape: 'rounded',
    relationships: ['Roadmap', 'Architecture Domain', 'Work Package']
  }
];

export const relationshipTypes = [
  {
    id: 'association',
    name: 'Association',
    description: 'Unspecified relationship',
    color: 'hsl(215.4 16.3% 46.9%)',
    style: 'solid'
  },
  {
    id: 'assignment',
    name: 'Assignment',
    description: 'Allocation of responsibility or resource',
    color: 'hsl(12 76% 61%)',
    style: 'solid'
  },
  {
    id: 'realization',
    name: 'Realization',
    description: 'Fulfillment or implementation relationship',
    color: 'hsl(173 58% 39%)',
    style: 'solid'
  },
  {
    id: 'serving',
    name: 'Serving',
    description: 'Service dependency relationship',
    color: 'hsl(197 37% 24%)',
    style: 'solid'
  },
  {
    id: 'flow',
    name: 'Flow',
    description: 'Transfer or exchange relationship',
    color: 'hsl(27 87% 67%)',
    style: 'solid'
  },
  {
    id: 'influence',
    name: 'Influence',
    description: 'Impact or influence relationship',
    color: 'hsl(215.4 16.3% 46.9%)',
    style: 'dashed'
  }
];
