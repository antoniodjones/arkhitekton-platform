export interface ArchimateElement {
  id: string;
  name: string;
  type: 'structural' | 'behavioral' | 'motivational' | 'passive';
  category: 'business' | 'application' | 'data' | 'technology';
  framework: 'archimate' | 'togaf' | 'bpmn' | 'aws' | 'azure' | 'gcp' | 'oci' | 'patterns';
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

  // Business Motivation Model (BMM) Elements
  // Ends - What the organization wants to achieve
  {
    id: 'bmm-vision',
    name: 'Vision',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'The ultimate aspiration or desired future state of the organization.',
    usageGuidelines: 'Use to describe what the business would like to become. Should be inspiring and concise for employees.',
    iconName: 'Eye',
    color: 'hsl(280 100% 70%)', // Purple for BMM elements
    shape: 'diamond',
    relationships: ['Goal', 'Mission', 'Strategy']
  },
  {
    id: 'bmm-mission',
    name: 'Mission',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'The organization\'s primary activity to realize its Vision.',
    usageGuidelines: 'Use to describe the activity that needs to be done and why it\'s important. Summary of all strategies.',
    iconName: 'Compass',
    color: 'hsl(280 100% 70%)',
    shape: 'diamond',
    relationships: ['Vision', 'Strategy', 'Business Function']
  },
  {
    id: 'bmm-objective',
    name: 'Objective',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'Specific, measurable, achievable, relevant, and time-bound (SMART) targets.',
    usageGuidelines: 'Use for concrete metrics and KPIs that help achieve goals through measurable outcomes.',
    iconName: 'Target',
    color: 'hsl(280 100% 70%)',
    shape: 'diamond',
    relationships: ['Goal', 'Strategy', 'Performance Indicator']
  },
  
  // Means - How the organization will achieve its ends
  {
    id: 'bmm-strategy',
    name: 'Strategy',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'Major parts of the plan to accomplish the mission.',
    usageGuidelines: 'Use for long-term approaches with significant impact on business operations to achieve goals.',
    iconName: 'Map',
    color: 'hsl(200 100% 50%)', // Blue for strategy elements
    shape: 'diamond',
    relationships: ['Mission', 'Tactic', 'Goal', 'Objective']
  },
  {
    id: 'bmm-tactic',
    name: 'Tactic',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'Courses of action that support one or more strategies.',
    usageGuidelines: 'Use for narrower scope, short-term actions to navigate specific operational areas.',
    iconName: 'Zap',
    color: 'hsl(200 100% 50%)',
    shape: 'diamond',
    relationships: ['Strategy', 'Business Process', 'Business Function']
  },
  {
    id: 'bmm-business-policy',
    name: 'Business Policy',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'Broad directives that need interpretation through business rules.',
    usageGuidelines: 'Use for high-level governance statements that guide organizational behavior.',
    iconName: 'Shield',
    color: 'hsl(200 100% 50%)',
    shape: 'diamond',
    relationships: ['Business Rule', 'Strategy', 'Governance']
  },
  {
    id: 'bmm-business-rule',
    name: 'Business Rule',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'Specific operational requirements that govern business behavior.',
    usageGuidelines: 'Use for detailed rules that implement business policies and ensure compliance.',
    iconName: 'BookOpen',
    color: 'hsl(200 100% 50%)',
    shape: 'diamond',
    relationships: ['Business Policy', 'Business Process', 'Decision']
  },
  
  // Influencers - External and internal factors
  {
    id: 'bmm-assessment',
    name: 'Assessment',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'Evaluations or judgments about influencers that affect the organization.',
    usageGuidelines: 'Use for informed judgments based on business intelligence and risk analysis.',
    iconName: 'TrendingUp',
    color: 'hsl(45 100% 50%)', // Yellow for influencer elements
    shape: 'diamond',
    relationships: ['External Factor', 'Internal Factor', 'Risk', 'Decision']
  },
  {
    id: 'bmm-external-factor',
    name: 'External Factor',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'External conditions that may influence the organization\'s success.',
    usageGuidelines: 'Use for market conditions, regulations, competition, economic environment, technological changes.',
    iconName: 'Globe',
    color: 'hsl(45 100% 50%)',
    shape: 'diamond',
    relationships: ['Assessment', 'Risk', 'Opportunity', 'Strategy']
  },
  {
    id: 'bmm-internal-factor',
    name: 'Internal Factor',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'Internal conditions and capabilities within the organization.',
    usageGuidelines: 'Use for organizational capabilities, resources, culture, current processes and systems.',
    iconName: 'Building',
    color: 'hsl(45 100% 50%)',
    shape: 'diamond',
    relationships: ['Assessment', 'Capability', 'Resource', 'Strategy']
  },
  {
    id: 'bmm-swot-strength',
    name: 'Strength',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'Internal positive factors that give the organization an advantage.',
    usageGuidelines: 'Use to identify internal capabilities and resources that provide competitive advantage.',
    iconName: 'TrendingUp',
    color: 'hsl(120 100% 40%)', // Green for strengths
    shape: 'diamond',
    relationships: ['Internal Factor', 'Capability', 'Strategy', 'Opportunity']
  },
  {
    id: 'bmm-swot-weakness',
    name: 'Weakness',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'Internal negative factors that put the organization at a disadvantage.',
    usageGuidelines: 'Use to identify internal limitations that need to be addressed or mitigated.',
    iconName: 'TrendingDown',
    color: 'hsl(0 100% 50%)', // Red for weaknesses
    shape: 'diamond',
    relationships: ['Internal Factor', 'Risk', 'Strategy', 'Improvement']
  },
  {
    id: 'bmm-swot-opportunity',
    name: 'Opportunity',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'External positive factors that the organization could exploit.',
    usageGuidelines: 'Use to identify external chances for growth, improvement, or competitive advantage.',
    iconName: 'Sunrise',
    color: 'hsl(120 100% 40%)', // Green for opportunities
    shape: 'diamond',
    relationships: ['External Factor', 'Strategy', 'Growth', 'Innovation']
  },
  {
    id: 'bmm-swot-threat',
    name: 'Threat',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'External negative factors that could harm the organization.',
    usageGuidelines: 'Use to identify external risks that require defensive strategies or mitigation plans.',
    iconName: 'AlertTriangle',
    color: 'hsl(0 100% 50%)', // Red for threats
    shape: 'diamond',
    relationships: ['External Factor', 'Risk', 'Strategy', 'Mitigation']
  },
  
  // Performance and Measurement
  {
    id: 'bmm-kpi',
    name: 'Key Performance Indicator',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'Quantifiable measure used to evaluate success in achieving objectives.',
    usageGuidelines: 'Use to define specific metrics that track progress toward objectives and goals.',
    iconName: 'BarChart3',
    color: 'hsl(160 100% 40%)', // Teal for performance elements
    shape: 'diamond',
    relationships: ['Objective', 'Goal', 'Assessment', 'Dashboard']
  },
  {
    id: 'bmm-balanced-scorecard',
    name: 'Balanced Scorecard',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'Strategic performance management tool that tracks multiple performance perspectives.',
    usageGuidelines: 'Use to monitor performance across financial, customer, internal process, and learning perspectives.',
    iconName: 'Grid3x3',
    color: 'hsl(160 100% 40%)',
    shape: 'diamond',
    relationships: ['KPI', 'Strategy', 'Objective', 'Performance Dashboard']
  },
  {
    id: 'bmm-critical-success-factor',
    name: 'Critical Success Factor',
    type: 'motivational',
    category: 'business',
    framework: 'archimate',
    description: 'Essential areas where performance must be satisfactory for the organization to succeed.',
    usageGuidelines: 'Use to identify key areas that are vital for achieving strategic objectives.',
    iconName: 'Star',
    color: 'hsl(160 100% 40%)',
    shape: 'diamond',
    relationships: ['Strategy', 'Objective', 'KPI', 'Success Criteria']
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

  // AWS Cloud Architecture Elements
  {
    id: 'aws-ec2',
    name: 'EC2 Instance',
    type: 'structural',
    category: 'technology',
    framework: 'aws',
    description: 'Virtual compute servers in the AWS cloud.',
    usageGuidelines: 'Use to model virtual machine instances, compute capacity for applications and workloads.',
    iconName: 'Server',
    color: 'hsl(25 95% 53%)', // AWS orange
    shape: 'rectangular',
    relationships: ['VPC', 'Security Group', 'EBS Volume']
  },
  {
    id: 'aws-lambda',
    name: 'Lambda Function',
    type: 'behavioral',
    category: 'application',
    framework: 'aws',
    description: 'Serverless compute service that runs code without provisioning servers.',
    usageGuidelines: 'Use for event-driven computing, microservices, and serverless applications.',
    iconName: 'Zap',
    color: 'hsl(25 95% 53%)',
    shape: 'rounded',
    relationships: ['API Gateway', 'DynamoDB', 'S3']
  },
  {
    id: 'aws-s3',
    name: 'S3 Bucket',
    type: 'passive',
    category: 'data',
    framework: 'aws',
    description: 'Object storage service with industry-leading scalability and durability.',
    usageGuidelines: 'Use for data lakes, backup and restore, content distribution, and static websites.',
    iconName: 'Database',
    color: 'hsl(25 95% 53%)',
    shape: 'rectangular',
    relationships: ['CloudFront', 'Lambda', 'EC2']
  },
  {
    id: 'aws-rds',
    name: 'RDS Database',
    type: 'passive',
    category: 'data',
    framework: 'aws',
    description: 'Managed relational database service supporting multiple database engines.',
    usageGuidelines: 'Use for traditional relational database workloads with automated backups and scaling.',
    iconName: 'Database',
    color: 'hsl(25 95% 53%)',
    shape: 'rectangular',
    relationships: ['EC2', 'Lambda', 'VPC']
  },
  {
    id: 'aws-vpc',
    name: 'Virtual Private Cloud',
    type: 'structural',
    category: 'technology',
    framework: 'aws',
    description: 'Isolated network environment within AWS cloud.',
    usageGuidelines: 'Use to create secure, isolated sections of the AWS cloud for your resources.',
    iconName: 'Shield',
    color: 'hsl(25 95% 53%)',
    shape: 'rectangular',
    relationships: ['EC2', 'RDS', 'Load Balancer']
  },
  {
    id: 'aws-elb',
    name: 'Elastic Load Balancer',
    type: 'structural',
    category: 'technology',
    framework: 'aws',
    description: 'Distributes incoming traffic across multiple targets.',
    usageGuidelines: 'Use to improve availability and fault tolerance of applications.',
    iconName: 'RotateCcw',
    color: 'hsl(25 95% 53%)',
    shape: 'rectangular',
    relationships: ['EC2', 'Auto Scaling', 'VPC']
  },
  {
    id: 'aws-api-gateway',
    name: 'API Gateway',
    type: 'structural',
    category: 'application',
    framework: 'aws',
    description: 'Fully managed service for creating, publishing, and managing APIs.',
    usageGuidelines: 'Use as front door for applications to access backend services and Lambda functions.',
    iconName: 'Webhook',
    color: 'hsl(25 95% 53%)',
    shape: 'rectangular',
    relationships: ['Lambda', 'EC2', 'DynamoDB']
  },
  {
    id: 'aws-cloudfront',
    name: 'CloudFront CDN',
    type: 'structural',
    category: 'technology',
    framework: 'aws',
    description: 'Fast content delivery network service.',
    usageGuidelines: 'Use to deliver content with low latency and high transfer speeds globally.',
    iconName: 'Globe',
    color: 'hsl(25 95% 53%)',
    shape: 'rectangular',
    relationships: ['S3', 'EC2', 'Route 53']
  },

  // Azure Cloud Architecture Elements
  {
    id: 'azure-vm',
    name: 'Virtual Machine',
    type: 'structural',
    category: 'technology',
    framework: 'azure',
    description: 'On-demand, scalable computing resource in Azure.',
    usageGuidelines: 'Use for Windows and Linux virtual machines with full control over the OS.',
    iconName: 'Monitor',
    color: 'hsl(214 100% 60%)', // Azure blue
    shape: 'rectangular',
    relationships: ['Virtual Network', 'Storage Account', 'Load Balancer']
  },
  {
    id: 'azure-functions',
    name: 'Azure Functions',
    type: 'behavioral',
    category: 'application',
    framework: 'azure',
    description: 'Serverless compute service enabling event-driven programming.',
    usageGuidelines: 'Use for event processing, data integration, and microservices architectures.',
    iconName: 'Zap',
    color: 'hsl(214 100% 60%)',
    shape: 'rounded',
    relationships: ['Service Bus', 'Cosmos DB', 'Storage Account']
  },
  {
    id: 'azure-storage',
    name: 'Storage Account',
    type: 'passive',
    category: 'data',
    framework: 'azure',
    description: 'Scalable cloud storage for data objects, files, messages, and tables.',
    usageGuidelines: 'Use for blob storage, file shares, queues, and tables in Azure.',
    iconName: 'HardDrive',
    color: 'hsl(214 100% 60%)',
    shape: 'rectangular',
    relationships: ['Virtual Machine', 'Functions', 'CDN']
  },
  {
    id: 'azure-sql',
    name: 'Azure SQL Database',
    type: 'passive',
    category: 'data',
    framework: 'azure',
    description: 'Fully managed relational database service.',
    usageGuidelines: 'Use for modern cloud applications requiring relational database capabilities.',
    iconName: 'Database',
    color: 'hsl(214 100% 60%)',
    shape: 'rectangular',
    relationships: ['Virtual Machine', 'App Service', 'Functions']
  },
  {
    id: 'azure-vnet',
    name: 'Virtual Network',
    type: 'structural',
    category: 'technology',
    framework: 'azure',
    description: 'Isolated network environment within Azure.',
    usageGuidelines: 'Use to securely connect Azure resources and extend on-premises networks.',
    iconName: 'Network',
    color: 'hsl(214 100% 60%)',
    shape: 'rectangular',
    relationships: ['Virtual Machine', 'App Service', 'Load Balancer']
  },
  {
    id: 'azure-app-service',
    name: 'App Service',
    type: 'structural',
    category: 'application',
    framework: 'azure',
    description: 'Platform for building and hosting web applications and APIs.',
    usageGuidelines: 'Use for hosting web apps, REST APIs, and mobile backends.',
    iconName: 'Globe',
    color: 'hsl(214 100% 60%)',
    shape: 'rectangular',
    relationships: ['SQL Database', 'Application Insights', 'CDN']
  },
  {
    id: 'azure-aks',
    name: 'Kubernetes Service',
    type: 'structural',
    category: 'application',
    framework: 'azure',
    description: 'Managed Kubernetes container orchestration service.',
    usageGuidelines: 'Use for deploying and managing containerized applications at scale.',
    iconName: 'Boxes',
    color: 'hsl(214 100% 60%)',
    shape: 'rectangular',
    relationships: ['Container Registry', 'Virtual Network', 'Load Balancer']
  },
  {
    id: 'azure-application-gateway',
    name: 'Application Gateway',
    type: 'structural',
    category: 'technology',
    framework: 'azure',
    description: 'Web traffic load balancer with application-level routing.',
    usageGuidelines: 'Use for SSL termination, URL-based routing, and web application firewall.',
    iconName: 'Shield',
    color: 'hsl(214 100% 60%)',
    shape: 'rectangular',
    relationships: ['App Service', 'Virtual Machine', 'Virtual Network']
  },

  // Google Cloud Platform Elements
  {
    id: 'gcp-compute-engine',
    name: 'Compute Engine',
    type: 'structural',
    category: 'technology',
    framework: 'gcp',
    description: 'Virtual machines running in Google\'s data centers.',
    usageGuidelines: 'Use for scalable, high-performance virtual machines with per-second billing.',
    iconName: 'Cpu',
    color: 'hsl(217 89% 61%)', // Google blue
    shape: 'rectangular',
    relationships: ['VPC Network', 'Cloud Storage', 'Load Balancer']
  },
  {
    id: 'gcp-cloud-functions',
    name: 'Cloud Functions',
    type: 'behavioral',
    category: 'application',
    framework: 'gcp',
    description: 'Serverless execution environment for building and connecting cloud services.',
    usageGuidelines: 'Use for event-driven applications and microservices integration.',
    iconName: 'Zap',
    color: 'hsl(217 89% 61%)',
    shape: 'rounded',
    relationships: ['Cloud Storage', 'Pub/Sub', 'Cloud SQL']
  },
  {
    id: 'gcp-cloud-storage',
    name: 'Cloud Storage',
    type: 'passive',
    category: 'data',
    framework: 'gcp',
    description: 'Unified object storage for developers and enterprises.',
    usageGuidelines: 'Use for data lakes, content distribution, backup and archival.',
    iconName: 'Cloud',
    color: 'hsl(217 89% 61%)',
    shape: 'rectangular',
    relationships: ['Compute Engine', 'Cloud Functions', 'BigQuery']
  },
  {
    id: 'gcp-cloud-sql',
    name: 'Cloud SQL',
    type: 'passive',
    category: 'data',
    framework: 'gcp',
    description: 'Fully managed relational database service.',
    usageGuidelines: 'Use for MySQL, PostgreSQL, and SQL Server databases in the cloud.',
    iconName: 'Database',
    color: 'hsl(217 89% 61%)',
    shape: 'rectangular',
    relationships: ['Compute Engine', 'App Engine', 'Cloud Functions']
  },
  {
    id: 'gcp-bigquery',
    name: 'BigQuery',
    type: 'passive',
    category: 'data',
    framework: 'gcp',
    description: 'Serverless, highly scalable data warehouse.',
    usageGuidelines: 'Use for analytics, machine learning, and business intelligence on large datasets.',
    iconName: 'BarChart3',
    color: 'hsl(217 89% 61%)',
    shape: 'rectangular',
    relationships: ['Cloud Storage', 'Dataflow', 'Cloud ML']
  },
  {
    id: 'gcp-gke',
    name: 'Kubernetes Engine',
    type: 'structural',
    category: 'application',
    framework: 'gcp',
    description: 'Managed Kubernetes service for containerized applications.',
    usageGuidelines: 'Use for deploying, managing, and scaling containerized applications.',
    iconName: 'Boxes',
    color: 'hsl(217 89% 61%)',
    shape: 'rectangular',
    relationships: ['Container Registry', 'VPC Network', 'Load Balancer']
  },
  {
    id: 'gcp-app-engine',
    name: 'App Engine',
    type: 'structural',
    category: 'application',
    framework: 'gcp',
    description: 'Platform for building scalable web applications and APIs.',
    usageGuidelines: 'Use for automatic scaling web applications with minimal operational overhead.',
    iconName: 'Globe',
    color: 'hsl(217 89% 61%)',
    shape: 'rectangular',
    relationships: ['Cloud SQL', 'Cloud Storage', 'Cloud Tasks']
  },
  {
    id: 'gcp-cloud-cdn',
    name: 'Cloud CDN',
    type: 'structural',
    category: 'technology',
    framework: 'gcp',
    description: 'Content delivery network for delivering web and video content.',
    usageGuidelines: 'Use to accelerate content delivery with Google\'s global edge network.',
    iconName: 'Globe',
    color: 'hsl(217 89% 61%)',
    shape: 'rectangular',
    relationships: ['Cloud Storage', 'Compute Engine', 'Load Balancer']
  },

  // Oracle Cloud Infrastructure Elements
  {
    id: 'oci-compute-instance',
    name: 'Compute Instance',
    type: 'structural',
    category: 'technology',
    framework: 'oci',
    description: 'Virtual machine instances with custom OCPU and memory configurations.',
    usageGuidelines: 'Use for scalable compute workloads with flexible instance shapes and per-second billing.',
    iconName: 'Server',
    color: 'hsl(4 90% 58%)', // Oracle red
    shape: 'rectangular',
    relationships: ['VCN', 'Block Volume', 'Load Balancer']
  },
  {
    id: 'oci-bare-metal',
    name: 'Bare Metal Instance',
    type: 'structural',
    category: 'technology',
    framework: 'oci',
    description: 'Dedicated physical servers providing maximum performance and isolation.',
    usageGuidelines: 'Use for high-performance computing, databases, and workloads requiring dedicated hardware.',
    iconName: 'HardDrive',
    color: 'hsl(4 90% 58%)',
    shape: 'rectangular',
    relationships: ['VCN', 'Block Volume', 'Autonomous Database']
  },
  {
    id: 'oci-functions',
    name: 'Oracle Functions',
    type: 'behavioral',
    category: 'application',
    framework: 'oci',
    description: 'Serverless functions platform based on open-source Fn Project.',
    usageGuidelines: 'Use for event-driven serverless applications and microservices integration.',
    iconName: 'Zap',
    color: 'hsl(4 90% 58%)',
    shape: 'rounded',
    relationships: ['API Gateway', 'Object Storage', 'Stream']
  },
  {
    id: 'oci-container-engine',
    name: 'Container Engine (OKE)',
    type: 'structural',
    category: 'application',
    framework: 'oci',
    description: 'Managed Kubernetes service for deploying containerized applications.',
    usageGuidelines: 'Use for orchestrating containers with automatic scaling and cluster management.',
    iconName: 'Boxes',
    color: 'hsl(4 90% 58%)',
    shape: 'rectangular',
    relationships: ['Container Registry', 'VCN', 'Load Balancer']
  },
  {
    id: 'oci-object-storage',
    name: 'Object Storage',
    type: 'passive',
    category: 'data',
    framework: 'oci',
    description: 'Highly durable and scalable object storage service with multiple storage tiers.',
    usageGuidelines: 'Use for data lakes, backup, content distribution, and archival with lifecycle policies.',
    iconName: 'Database',
    color: 'hsl(4 90% 58%)',
    shape: 'rectangular',
    relationships: ['Compute Instance', 'Functions', 'Data Integration']
  },
  {
    id: 'oci-block-volumes',
    name: 'Block Volumes',
    type: 'passive',
    category: 'data',
    framework: 'oci',
    description: 'High-performance block storage that can be attached to compute instances.',
    usageGuidelines: 'Use for persistent storage with configurable performance levels and automated backups.',
    iconName: 'HardDrive',
    color: 'hsl(4 90% 58%)',
    shape: 'rectangular',
    relationships: ['Compute Instance', 'File Storage', 'Backup Service']
  },
  {
    id: 'oci-autonomous-database',
    name: 'Autonomous Database',
    type: 'passive',
    category: 'data',
    framework: 'oci',
    description: 'Self-driving database with automated tuning, security, and backups.',
    usageGuidelines: 'Use for mission-critical applications requiring high performance and autonomous management.',
    iconName: 'Database',
    color: 'hsl(4 90% 58%)',
    shape: 'rectangular',
    relationships: ['VCN', 'Data Safe', 'Analytics Cloud']
  },
  {
    id: 'oci-mysql-heatwave',
    name: 'MySQL HeatWave',
    type: 'passive',
    category: 'data',
    framework: 'oci',
    description: 'Fully managed MySQL service with integrated analytics and machine learning.',
    usageGuidelines: 'Use for OLTP and OLAP workloads with real-time analytics on operational data.',
    iconName: 'Database',
    color: 'hsl(4 90% 58%)',
    shape: 'rectangular',
    relationships: ['Compute Instance', 'Analytics Cloud', 'Data Science']
  },
  {
    id: 'oci-vcn',
    name: 'Virtual Cloud Network',
    type: 'structural',
    category: 'technology',
    framework: 'oci',
    description: 'Customizable private network providing secure connectivity for cloud resources.',
    usageGuidelines: 'Use to create isolated network environments with subnets, routing, and security.',
    iconName: 'Network',
    color: 'hsl(4 90% 58%)',
    shape: 'rectangular',
    relationships: ['Compute Instance', 'Load Balancer', 'Gateway']
  },
  {
    id: 'oci-load-balancer',
    name: 'Load Balancer',
    type: 'structural',
    category: 'technology',
    framework: 'oci',
    description: 'Distributes incoming traffic across multiple backend servers.',
    usageGuidelines: 'Use for high availability and automatic failover of applications and services.',
    iconName: 'RotateCcw',
    color: 'hsl(4 90% 58%)',
    shape: 'rectangular',
    relationships: ['Compute Instance', 'VCN', 'Health Checks']
  },
  {
    id: 'oci-api-gateway',
    name: 'API Gateway',
    type: 'structural',
    category: 'application',
    framework: 'oci',
    description: 'Fully managed service for deploying and managing APIs at scale.',
    usageGuidelines: 'Use as entry point for microservices with authentication, throttling, and monitoring.',
    iconName: 'Webhook',
    color: 'hsl(4 90% 58%)',
    shape: 'rectangular',
    relationships: ['Functions', 'Compute Instance', 'Identity and Access']
  },
  {
    id: 'oci-generative-ai',
    name: 'Generative AI',
    type: 'behavioral',
    category: 'application',
    framework: 'oci',
    description: 'Access to foundation models like Llama, Cohere, and custom model training.',
    usageGuidelines: 'Use for building AI-powered applications with large language models and generative capabilities.',
    iconName: 'Brain',
    color: 'hsl(4 90% 58%)',
    shape: 'rounded',
    relationships: ['Data Science', 'AI Vision', 'Object Storage']
  },
  {
    id: 'oci-data-science',
    name: 'Data Science',
    type: 'behavioral',
    category: 'application',
    framework: 'oci',
    description: 'Collaborative platform for building, training, and deploying machine learning models.',
    usageGuidelines: 'Use for the complete ML lifecycle from experimentation to production deployment.',
    iconName: 'BarChart3',
    color: 'hsl(4 90% 58%)',
    shape: 'rounded',
    relationships: ['Object Storage', 'Autonomous Database', 'AI Infrastructure']
  },
  {
    id: 'oci-analytics-cloud',
    name: 'Analytics Cloud',
    type: 'behavioral',
    category: 'data',
    framework: 'oci',
    description: 'Self-service business intelligence and data visualization platform.',
    usageGuidelines: 'Use for creating dashboards, reports, and advanced analytics with augmented capabilities.',
    iconName: 'TrendingUp',
    color: 'hsl(4 90% 58%)',
    shape: 'rounded',
    relationships: ['Autonomous Database', 'Data Integration', 'Object Storage']
  },
  {
    id: 'oci-big-data',
    name: 'Big Data Service',
    type: 'structural',
    category: 'data',
    framework: 'oci',
    description: 'Managed Apache Hadoop and Spark clusters for big data processing.',
    usageGuidelines: 'Use for large-scale data processing, ETL operations, and distributed computing workloads.',
    iconName: 'Layers',
    color: 'hsl(4 90% 58%)',
    shape: 'rectangular',
    relationships: ['Object Storage', 'Data Flow', 'Analytics Cloud']
  },
  {
    id: 'oci-streaming',
    name: 'Streaming',
    type: 'behavioral',
    category: 'data',
    framework: 'oci',
    description: 'Real-time data streaming service compatible with Apache Kafka.',
    usageGuidelines: 'Use for real-time data ingestion, event processing, and stream analytics.',
    iconName: 'Radio',
    color: 'hsl(4 90% 58%)',
    shape: 'rounded',
    relationships: ['Functions', 'Data Flow', 'Service Connector']
  },
  {
    id: 'oci-integration',
    name: 'Integration',
    type: 'behavioral',
    category: 'application',
    framework: 'oci',
    description: 'Low-code integration platform for connecting applications and data sources.',
    usageGuidelines: 'Use for building integration flows, B2B connections, and process automation.',
    iconName: 'Workflow',
    color: 'hsl(4 90% 58%)',
    shape: 'rounded',
    relationships: ['API Gateway', 'Object Storage', 'Autonomous Database']
  },
  {
    id: 'oci-cloud-guard',
    name: 'Cloud Guard',
    type: 'structural',
    category: 'technology',
    framework: 'oci',
    description: 'Cloud security posture management with threat detection and automated remediation.',
    usageGuidelines: 'Use for continuous security monitoring and compliance across cloud resources.',
    iconName: 'Shield',
    color: 'hsl(4 90% 58%)',
    shape: 'rectangular',
    relationships: ['Security Zones', 'Audit', 'Identity and Access']
  },
  {
    id: 'oci-iam',
    name: 'Identity and Access Management',
    type: 'structural',
    category: 'technology',
    framework: 'oci',
    description: 'Centralized identity management with fine-grained access controls.',
    usageGuidelines: 'Use for user authentication, authorization, and identity federation across services.',
    iconName: 'Users',
    color: 'hsl(4 90% 58%)',
    shape: 'rectangular',
    relationships: ['API Gateway', 'Compute Instance', 'Cloud Guard']
  },
  {
    id: 'oci-fastconnect',
    name: 'FastConnect',
    type: 'structural',
    category: 'technology',
    framework: 'oci',
    description: 'Dedicated network connectivity between on-premises and OCI.',
    usageGuidelines: 'Use for high-bandwidth, low-latency connectivity to cloud resources.',
    iconName: 'Cable',
    color: 'hsl(4 90% 58%)',
    shape: 'rectangular',
    relationships: ['VCN', 'Gateway', 'DNS']
  },

  // BPMN 2.0 Business Process Elements
  // Activities
  {
    id: 'bpmn-task',
    name: 'Task',
    type: 'behavioral',
    category: 'business',
    framework: 'bpmn',
    description: 'An atomic activity within a process flow that cannot be broken down further.',
    usageGuidelines: 'Use for representing work that needs to be done. Tasks are atomic and cannot be decomposed.',
    iconName: 'Square',
    color: 'hsl(210 100% 45%)', // BPMN blue
    shape: 'rounded',
    relationships: ['Sequence Flow', 'Gateway', 'Event']
  },
  {
    id: 'bpmn-user-task',
    name: 'User Task',
    type: 'behavioral',
    category: 'business',
    framework: 'bpmn',
    description: 'A task performed by a human user with the assistance of a software application.',
    usageGuidelines: 'Use when a human user needs to perform work using a software interface.',
    iconName: 'User',
    color: 'hsl(210 100% 45%)',
    shape: 'rounded',
    relationships: ['User', 'Application', 'Data Object']
  },
  {
    id: 'bpmn-service-task',
    name: 'Service Task',
    type: 'behavioral',
    category: 'application',
    framework: 'bpmn',
    description: 'A task executed by a web service, application, or automated system.',
    usageGuidelines: 'Use for automated tasks executed by software services or applications.',
    iconName: 'Settings',
    color: 'hsl(210 100% 45%)',
    shape: 'rounded',
    relationships: ['Service', 'Application Component', 'Data Object']
  },
  {
    id: 'bpmn-script-task',
    name: 'Script Task',
    type: 'behavioral',
    category: 'application',
    framework: 'bpmn',
    description: 'A task executed by a business process engine using a scripting language.',
    usageGuidelines: 'Use for tasks that execute scripts or code within the process engine.',
    iconName: 'Code',
    color: 'hsl(210 100% 45%)',
    shape: 'rounded',
    relationships: ['Process Engine', 'Data Object', 'Business Rule']
  },
  {
    id: 'bpmn-business-rule-task',
    name: 'Business Rule Task',
    type: 'behavioral',
    category: 'business',
    framework: 'bpmn',
    description: 'A task that provides input to a business rule engine and receives output.',
    usageGuidelines: 'Use when business rules or decision logic needs to be evaluated.',
    iconName: 'BookOpen',
    color: 'hsl(210 100% 45%)',
    shape: 'rounded',
    relationships: ['Business Rule', 'Decision Table', 'Data Object']
  },
  {
    id: 'bpmn-manual-task',
    name: 'Manual Task',
    type: 'behavioral',
    category: 'business',
    framework: 'bpmn',
    description: 'A task performed without the aid of any business process engine or application.',
    usageGuidelines: 'Use for physical tasks or work done without system support.',
    iconName: 'Hand',
    color: 'hsl(210 100% 45%)',
    shape: 'rounded',
    relationships: ['Human Actor', 'Physical Object', 'Location']
  },
  {
    id: 'bpmn-subprocess',
    name: 'Sub-Process',
    type: 'behavioral',
    category: 'business',
    framework: 'bpmn',
    description: 'A complex activity that contains other BPMN elements within it.',
    usageGuidelines: 'Use to group related activities and create hierarchical process models.',
    iconName: 'FolderTree',
    color: 'hsl(210 100% 45%)',
    shape: 'rounded',
    relationships: ['Task', 'Gateway', 'Event']
  },
  {
    id: 'bpmn-call-activity',
    name: 'Call Activity',
    type: 'behavioral',
    category: 'business',
    framework: 'bpmn',
    description: 'A wrapper for a globally defined task or process that can be reused.',
    usageGuidelines: 'Use to reference reusable processes or tasks defined elsewhere.',
    iconName: 'ExternalLink',
    color: 'hsl(210 100% 45%)',
    shape: 'rounded',
    relationships: ['Global Process', 'Global Task', 'Interface']
  },

  // Events
  {
    id: 'bpmn-start-event',
    name: 'Start Event',
    type: 'behavioral',
    category: 'business',
    framework: 'bpmn',
    description: 'Indicates where a process begins.',
    usageGuidelines: 'Use to mark the beginning of a process. Every process must have at least one start event.',
    iconName: 'Play',
    color: 'hsl(120 100% 35%)', // Green for start
    shape: 'rounded',
    relationships: ['Sequence Flow', 'Process', 'Trigger']
  },
  {
    id: 'bpmn-intermediate-event',
    name: 'Intermediate Event',
    type: 'behavioral',
    category: 'business',
    framework: 'bpmn',
    description: 'Represents something that happens during the execution of a process.',
    usageGuidelines: 'Use for events that occur between start and end of a process.',
    iconName: 'Circle',
    color: 'hsl(45 100% 50%)', // Yellow for intermediate
    shape: 'rounded',
    relationships: ['Sequence Flow', 'Message Flow', 'Timer']
  },
  {
    id: 'bpmn-end-event',
    name: 'End Event',
    type: 'behavioral',
    category: 'business',
    framework: 'bpmn',
    description: 'Indicates where a process ends.',
    usageGuidelines: 'Use to mark the completion of a process path. Represents the outcome achieved.',
    iconName: 'Square',
    color: 'hsl(0 100% 45%)', // Red for end
    shape: 'rounded',
    relationships: ['Sequence Flow', 'Process', 'Result']
  },
  {
    id: 'bpmn-message-start-event',
    name: 'Message Start Event',
    type: 'behavioral',
    category: 'business',
    framework: 'bpmn',
    description: 'A start event triggered by the receipt of a message.',
    usageGuidelines: 'Use when a process is initiated by receiving a message from another process or participant.',
    iconName: 'Mail',
    color: 'hsl(120 100% 35%)',
    shape: 'rounded',
    relationships: ['Message Flow', 'Participant', 'Pool']
  },
  {
    id: 'bpmn-timer-start-event',
    name: 'Timer Start Event',
    type: 'behavioral',
    category: 'business',
    framework: 'bpmn',
    description: 'A start event triggered by a specific time or cycle.',
    usageGuidelines: 'Use for processes that start at scheduled times or recurring intervals.',
    iconName: 'Clock',
    color: 'hsl(120 100% 35%)',
    shape: 'rounded',
    relationships: ['Timer', 'Schedule', 'Calendar']
  },
  {
    id: 'bpmn-error-end-event',
    name: 'Error End Event',
    type: 'behavioral',
    category: 'business',
    framework: 'bpmn',
    description: 'An end event that triggers an error condition.',
    usageGuidelines: 'Use when a process ends due to an error that should be handled by a parent process.',
    iconName: 'AlertTriangle',
    color: 'hsl(0 100% 45%)',
    shape: 'rounded',
    relationships: ['Error Handling', 'Exception Flow', 'Boundary Event']
  },

  // Gateways
  {
    id: 'bpmn-exclusive-gateway',
    name: 'Exclusive Gateway (XOR)',
    type: 'behavioral',
    category: 'business',
    framework: 'bpmn',
    description: 'A decision point where exactly one of multiple paths is taken.',
    usageGuidelines: 'Use for either/or decisions. Only one outgoing path will be followed based on conditions.',
    iconName: 'GitBranch',
    color: 'hsl(45 100% 40%)', // Orange for gateways
    shape: 'diamond',
    relationships: ['Sequence Flow', 'Condition', 'Decision']
  },
  {
    id: 'bpmn-parallel-gateway',
    name: 'Parallel Gateway (AND)',
    type: 'behavioral',
    category: 'business',
    framework: 'bpmn',
    description: 'Creates or synchronizes parallel paths in a process.',
    usageGuidelines: 'Use to split flow into multiple parallel paths or join parallel paths back together.',
    iconName: 'Plus',
    color: 'hsl(45 100% 40%)',
    shape: 'diamond',
    relationships: ['Sequence Flow', 'Parallel Activity', 'Synchronization']
  },
  {
    id: 'bpmn-inclusive-gateway',
    name: 'Inclusive Gateway (OR)',
    type: 'behavioral',
    category: 'business',
    framework: 'bpmn',
    description: 'A decision point where one or more paths can be taken.',
    usageGuidelines: 'Use when multiple conditions can be true simultaneously, allowing multiple outgoing paths.',
    iconName: 'CircleDot',
    color: 'hsl(45 100% 40%)',
    shape: 'diamond',
    relationships: ['Sequence Flow', 'Multiple Conditions', 'Partial Join']
  },
  {
    id: 'bpmn-event-based-gateway',
    name: 'Event-Based Gateway',
    type: 'behavioral',
    category: 'business',
    framework: 'bpmn',
    description: 'A decision point where the path taken depends on events.',
    usageGuidelines: 'Use when the process flow depends on which event occurs first.',
    iconName: 'Zap',
    color: 'hsl(45 100% 40%)',
    shape: 'diamond',
    relationships: ['Intermediate Event', 'Message Event', 'Timer Event']
  },
  {
    id: 'bpmn-complex-gateway',
    name: 'Complex Gateway',
    type: 'behavioral',
    category: 'business',
    framework: 'bpmn',
    description: 'A gateway with complex branching or merging behavior.',
    usageGuidelines: 'Use for complex routing scenarios that cannot be expressed with other gateway types.',
    iconName: 'Asterisk',
    color: 'hsl(45 100% 40%)',
    shape: 'diamond',
    relationships: ['Complex Condition', 'Custom Logic', 'Advanced Routing']
  },

  // Flows and Connections
  {
    id: 'bpmn-sequence-flow',
    name: 'Sequence Flow',
    type: 'behavioral',
    category: 'business',
    framework: 'bpmn',
    description: 'Shows the order of activities in a process.',
    usageGuidelines: 'Use to connect flow elements within the same pool to show process flow.',
    iconName: 'ArrowRight',
    color: 'hsl(210 100% 45%)',
    shape: 'rounded',
    relationships: ['Flow Element', 'Control Flow', 'Process Path']
  },
  {
    id: 'bpmn-message-flow',
    name: 'Message Flow',
    type: 'behavioral',
    category: 'business',
    framework: 'bpmn',
    description: 'Shows messages exchanged between separate participants.',
    usageGuidelines: 'Use to show communication between different pools or participants.',
    iconName: 'MessageSquare',
    color: 'hsl(210 100% 45%)',
    shape: 'rounded',
    relationships: ['Pool', 'Participant', 'Message Event']
  },
  {
    id: 'bpmn-conditional-flow',
    name: 'Conditional Flow',
    type: 'behavioral',
    category: 'business',
    framework: 'bpmn',
    description: 'A sequence flow with conditions that determine if the path is taken.',
    usageGuidelines: 'Use to model conditional branches from activities or gateways.',
    iconName: 'Split',
    color: 'hsl(210 100% 45%)',
    shape: 'rounded',
    relationships: ['Condition', 'Gateway', 'Business Rule']
  },
  {
    id: 'bpmn-default-flow',
    name: 'Default Flow',
    type: 'behavioral',
    category: 'business',
    framework: 'bpmn',
    description: 'A sequence flow that is taken when no other conditional flows are valid.',
    usageGuidelines: 'Use as a fallback path when all other conditions evaluate to false.',
    iconName: 'CornerDownRight',
    color: 'hsl(210 100% 45%)',
    shape: 'rounded',
    relationships: ['Gateway', 'Fallback Logic', 'Exception Path']
  },

  // Artifacts and Data
  {
    id: 'bpmn-data-object',
    name: 'Data Object',
    type: 'passive',
    category: 'data',
    framework: 'bpmn',
    description: 'Represents data required or produced by activities.',
    usageGuidelines: 'Use to show data inputs and outputs for activities in the process.',
    iconName: 'FileText',
    color: 'hsl(270 50% 50%)', // Purple for data
    shape: 'rectangular',
    relationships: ['Task', 'Activity', 'Data Store']
  },
  {
    id: 'bpmn-data-store',
    name: 'Data Store',
    type: 'passive',
    category: 'data',
    framework: 'bpmn',
    description: 'Represents a persistent data storage location.',
    usageGuidelines: 'Use to model databases, file systems, or other persistent storage.',
    iconName: 'Database',
    color: 'hsl(270 50% 50%)',
    shape: 'rectangular',
    relationships: ['Data Object', 'Activity', 'Storage System']
  },
  {
    id: 'bpmn-text-annotation',
    name: 'Text Annotation',
    type: 'passive',
    category: 'business',
    framework: 'bpmn',
    description: 'Provides additional information about process elements.',
    usageGuidelines: 'Use to add explanatory text or comments to process diagrams.',
    iconName: 'MessageSquare',
    color: 'hsl(215.4 16.3% 46.9%)', // Gray for annotations
    shape: 'rectangular',
    relationships: ['Association', 'Documentation', 'Comment']
  },
  {
    id: 'bpmn-group',
    name: 'Group',
    type: 'structural',
    category: 'business',
    framework: 'bpmn',
    description: 'A visual grouping of elements that does not affect process flow.',
    usageGuidelines: 'Use to visually group related elements for better diagram organization.',
    iconName: 'Package',
    color: 'hsl(215.4 16.3% 46.9%)',
    shape: 'rectangular',
    relationships: ['Visual Organization', 'Documentation', 'Grouping']
  },

  // Swimlanes
  {
    id: 'bpmn-pool',
    name: 'Pool',
    type: 'structural',
    category: 'business',
    framework: 'bpmn',
    description: 'Represents a participant in the process and contains the entire process.',
    usageGuidelines: 'Use to represent major participants like organizations, roles, or systems.',
    iconName: 'Users',
    color: 'hsl(210 100% 45%)',
    shape: 'rectangular',
    relationships: ['Participant', 'Lane', 'Message Flow']
  },
  {
    id: 'bpmn-lane',
    name: 'Lane',
    type: 'structural',
    category: 'business',
    framework: 'bpmn',
    description: 'A subdivision of a pool representing a specific role or responsibility.',
    usageGuidelines: 'Use to organize activities by roles, departments, or responsibilities within a participant.',
    iconName: 'User',
    color: 'hsl(210 100% 45%)',
    shape: 'rectangular',
    relationships: ['Pool', 'Role', 'Responsibility']
  },

  // Multi-Cloud and Modern Architecture Patterns
  {
    id: 'microservice',
    name: 'Microservice',
    type: 'structural',
    category: 'application',
    framework: 'patterns',
    description: 'Small, autonomous service that does one thing well.',
    usageGuidelines: 'Use for building distributed systems with independent deployability and scalability.',
    iconName: 'Boxes',
    color: 'hsl(280 100% 70%)', // Purple for patterns
    shape: 'rounded',
    relationships: ['API Gateway', 'Service Mesh', 'Container']
  },
  {
    id: 'container',
    name: 'Container',
    type: 'structural',
    category: 'technology',
    framework: 'patterns',
    description: 'Lightweight, portable execution environment for applications.',
    usageGuidelines: 'Use for consistent deployment across environments and efficient resource utilization.',
    iconName: 'Package',
    color: 'hsl(280 100% 70%)',
    shape: 'rectangular',
    relationships: ['Kubernetes', 'Container Registry', 'Microservice']
  },
  {
    id: 'service-mesh',
    name: 'Service Mesh',
    type: 'structural',
    category: 'technology',
    framework: 'patterns',
    description: 'Infrastructure layer for service-to-service communication.',
    usageGuidelines: 'Use for managing microservice communication, security, and observability.',
    iconName: 'Network',
    color: 'hsl(280 100% 70%)',
    shape: 'rectangular',
    relationships: ['Microservice', 'Load Balancer', 'Security Policy']
  },
  {
    id: 'edge-device',
    name: 'Edge Device',
    type: 'structural',
    category: 'technology',
    framework: 'patterns',
    description: 'Computing device at the network edge, close to data sources.',
    usageGuidelines: 'Use for IoT applications, real-time processing, and reduced latency requirements.',
    iconName: 'Smartphone',
    color: 'hsl(280 100% 70%)',
    shape: 'rectangular',
    relationships: ['Cloud Gateway', 'Data Stream', 'ML Model']
  },
  {
    id: 'data-pipeline',
    name: 'Data Pipeline',
    type: 'behavioral',
    category: 'data',
    framework: 'patterns',
    description: 'Series of data processing steps for ETL operations.',
    usageGuidelines: 'Use for automating data movement and transformation between systems.',
    iconName: 'ArrowRight',
    color: 'hsl(280 100% 70%)',
    shape: 'rounded',
    relationships: ['Data Source', 'Data Lake', 'Analytics Engine']
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
