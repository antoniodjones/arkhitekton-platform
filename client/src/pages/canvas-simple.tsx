import React, { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Sparkles, HelpCircle, Lightbulb, Play, LayoutGrid, 
  ChevronDown, Send, Folder, Search, Bot, Eye, Settings,
  X, FileText, ChevronRight, CheckCircle2,
  ZoomIn, ZoomOut,
  PanelLeftClose, PanelRightClose, PanelBottomClose,
  MoreHorizontal, Star,
  FolderOpen, Home, ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ============================================================================
// DESIGN TOKENS - LIGHT MODE DEFAULT (matching ADE mockup)
// ============================================================================
const tokens = {
  colors: {
    // Brand Colors (Section 7.1)
    primary: '#F97316',      // Primary Orange
    secondary: '#F59E0B',    // Yellow/Gold
    success: '#4ADE80',      // Light Green
    info: '#60A5FA',         // Light Blue
    aiPurple: '#9F7AEA',     // Purple
    error: '#EF4444',
    warning: '#FBBF24',
  },
  
  // Section 7.3 - IDE Zone Dimensions
  dimensions: {
    activityBar: 48,
    primarySidebar: { default: 240, min: 180, max: 400 },
    secondarySidebar: { default: 280, min: 200, max: 400 },
    panelArea: { default: 150, min: 100, max: 400 },
    statusBar: 30,
    tabBar: 36,
    titleBar: 40,
  }
};

// ============================================================================
// AGENT MODE CONFIGURATIONS (Section 1.4 & 7.2)
// ============================================================================
interface AgentMode {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
  placeholder: string;
}

const AGENT_MODES: AgentMode[] = [
  { 
    id: 'auto', 
    name: 'Auto', 
    icon: Sparkles, 
    color: tokens.colors.aiPurple,
    description: 'AI selects best mode',
    placeholder: 'Ask anything...'
  },
  { 
    id: 'question', 
    name: 'Question', 
    icon: HelpCircle, 
    color: tokens.colors.info,
    description: 'Q&A and explanations',
    placeholder: 'Ask a question...'
  },
  { 
    id: 'strategize', 
    name: 'Strategize', 
    icon: Lightbulb, 
    color: tokens.colors.secondary,
    description: 'Architecture plans and decisions',
    placeholder: 'Describe what you want to plan...'
  },
  { 
    id: 'execute', 
    name: 'Execute', 
    icon: Play, 
    color: tokens.colors.success,
    description: 'Make canvas changes with approval',
    placeholder: 'Describe what to build...'
  },
  { 
    id: 'scenarios', 
    name: 'Scenarios', 
    icon: LayoutGrid, 
    color: tokens.colors.primary,
    description: 'Generate alternative options',
    placeholder: 'What options should I explore?'
  }
];

// Specialized Agents (FTR-AGT-004)
const SPECIALIZED_AGENTS = [
  { id: 'security', name: '@Security', color: '#EF4444' },
  { id: 'data', name: '@Data', color: '#8B5CF6' },
  { id: 'cloud', name: '@Cloud', color: '#3B82F6' },
  { id: 'infra', name: '@Infra', color: '#10B981' },
];

// ============================================================================
// MOCK DATA
// ============================================================================
interface CanvasElement {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
}

const CANVAS_ELEMENTS: CanvasElement[] = [
  { id: 'api-gw', name: 'API Gateway', x: 300, y: 80, color: tokens.colors.primary },
  { id: 'orders', name: 'Orders API', x: 140, y: 220, color: tokens.colors.primary },
  { id: 'users', name: 'Users API', x: 300, y: 220, color: tokens.colors.primary },
  { id: 'products', name: 'Products API', x: 460, y: 220, color: tokens.colors.primary },
  { id: 'dynamo', name: 'DynamoDB', x: 300, y: 360, color: '#3B82F6' }
];

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  details?: string[];
  timestamp: Date;
}

const CHAT_MESSAGES: ChatMessage[] = [
  { 
    id: 1, 
    role: 'user', 
    content: 'Add security to this architecture',
    timestamp: new Date(Date.now() - 120000)
  },
  { 
    id: 2, 
    role: 'assistant', 
    content: "I'll add security controls:",
    details: ['WAF for API Gateway', 'IAM roles + Encryption at rest'],
    timestamp: new Date(Date.now() - 90000)
  }
];

interface Problem {
  id: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  location?: string;
  detail?: string;
}

const PROBLEMS_DATA: Problem[] = [
  { id: 1, severity: 'error', message: 'Missing connection: DynamoDB → S3 backup', location: 'microservices.ark:L42' },
  { id: 2, severity: 'warning', message: 'Consider: Add CloudWatch monitoring', detail: 'Best Practice' }
];

// ============================================================================
// UTILITY
// ============================================================================
const formatRelativeTime = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
};

// ============================================================================
// COMPONENTS
// ============================================================================
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'purple';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-orange-500 text-white',
    secondary: 'bg-slate-100 text-slate-600',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
};

interface CollapsibleProps {
  title: string;
  color?: string;
  defaultOpen?: boolean;
  badge?: string;
  children: React.ReactNode;
}

const Collapsible: React.FC<CollapsibleProps> = ({ title, color = '#F97316', defaultOpen = true, badge, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2 text-xs font-semibold" style={{ color }}>
          <ChevronRight size={12} className={cn("transition-transform duration-200", isOpen && 'rotate-90')} />
          {title}
        </div>
        {badge && <span className="text-[10px] text-slate-400">{badge}</span>}
      </button>
      <div className={cn("overflow-hidden transition-all duration-200", isOpen ? 'max-h-96' : 'max-h-0')}>
        <div className="px-3 pb-3">{children}</div>
      </div>
    </div>
  );
};

interface PropertyFieldProps {
  label: string;
  value: string;
  suffix?: string;
  placeholder?: boolean;
}

const PropertyField: React.FC<PropertyFieldProps> = ({ label, value, suffix, placeholder }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs text-slate-500 w-16 shrink-0">{label}</span>
    <input 
      className={cn(
        "flex-1 bg-white border border-slate-200 rounded px-2 py-1.5 text-xs focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors",
        placeholder ? 'text-slate-400 italic' : 'text-slate-900'
      )}
      defaultValue={value}
    />
    {suffix && <span className="text-xs text-slate-400">{suffix}</span>}
  </div>
);

const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 border border-slate-300 rounded text-slate-600">
    {children}
  </kbd>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function DesignIDE() {
  const [, setLocation] = useLocation();
  
  // UI State
  const [primarySidebarOpen, setPrimarySidebarOpen] = useState(true);
  const [secondarySidebarOpen, setSecondarySidebarOpen] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);
  
  // Agent State
  const [selectedMode, setSelectedMode] = useState<AgentMode>(AGENT_MODES[0]);
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  
  // Canvas State
  const [selectedElement, setSelectedElement] = useState<string>('orders');
  const [zoom, setZoom] = useState(100);
  
  // Panel State
  const [activePanel, setActivePanel] = useState<string>('problems');
  
  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(CHAT_MESSAGES);

  // Get model info from URL
  const urlParams = new URLSearchParams(window.location.search);
  const modelId = urlParams.get('id');
  const isNewModel = urlParams.get('new') === 'true';
  const modelType = urlParams.get('type') || 'diagram';

  // Keyboard shortcuts (HLR-IDE-020, Section 7.4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;
      
      if (cmdKey && e.key === 'b') {
        e.preventDefault();
        setPrimarySidebarOpen(prev => !prev);
      }
      if (cmdKey && e.altKey && e.key === 'b') {
        e.preventDefault();
        setSecondarySidebarOpen(prev => !prev);
      }
      if (cmdKey && e.key === 'j') {
        e.preventDefault();
        setPanelOpen(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (chatInput.trim()) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'user',
        content: chatInput,
        timestamp: new Date()
      }]);
      setChatInput('');
    }
  }, [chatInput]);

  // ============================================================================
  // RENDER: Title Bar - TIDE Branding (CR-TIDE-003)
  // ============================================================================
  const renderTitleBar = () => (
    <div 
      className="bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0"
      style={{ height: tokens.dimensions.titleBar }}
    >
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 hover:brightness-90 cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 hover:brightness-90 cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-green-500 hover:brightness-90 cursor-pointer" />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-slate-600 hover:text-slate-900"
          onClick={() => setLocation('/studio')}
        >
          <ArrowLeft size={14} />
          <Home size={14} />
        </Button>
      </div>
      <div className="text-sm text-slate-900">
        <span className="font-semibold">TIDE:</span>{' '}
        <span className="font-medium">
          {isNewModel ? `New ${modelType}` : 'AWS Microservices Architecture'}
        </span>
      </div>
      <Badge>TIDE</Badge>
    </div>
  );

  // ============================================================================
  // RENDER: Activity Bar (Z1) - Dark in light mode like VS Code
  // ============================================================================
  const renderActivityBar = () => (
    <div 
      className="bg-slate-800 flex flex-col items-center py-2 shrink-0 relative"
      style={{ width: tokens.dimensions.activityBar }}
    >
      {/* Menu */}
      <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white mb-2 transition-colors">
        <div className="space-y-1">
          <div className="w-4 h-0.5 bg-current" />
          <div className="w-4 h-0.5 bg-current" />
          <div className="w-4 h-0.5 bg-current" />
        </div>
      </button>
      
      {/* Main Icons */}
      <div className="flex flex-col items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={() => setPrimarySidebarOpen(prev => !prev)}
              className={cn(
                "w-10 h-10 flex items-center justify-center transition-colors",
                primarySidebarOpen ? 'text-white border-l-2 border-orange-500 bg-slate-700' : 'text-slate-400 hover:text-white'
              )}
            >
              <Folder size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            Explorer <Kbd>⌘⇧E</Kbd>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Search size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            Search <Kbd>⌘⇧F</Kbd>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={() => setSecondarySidebarOpen(prev => !prev)}
              className={cn(
                "w-10 h-10 flex items-center justify-center transition-colors",
                secondarySidebarOpen ? 'text-purple-400 border-l-2 border-purple-500 bg-slate-700' : 'text-slate-400 hover:text-white'
              )}
            >
              <Bot size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            AI Agents <Kbd>⌘⇧A</Kbd>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Eye size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            Diagram Views
          </TooltipContent>
        </Tooltip>
      </div>
      
      <div className="flex-1" />
      
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white mb-2 transition-colors">
            <Settings size={20} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          Settings
        </TooltipContent>
      </Tooltip>
    </div>
  );

  // ============================================================================
  // RENDER: Primary Sidebar (Z2) - US-PAL-001, US-PAL-002, US-PAL-003
  // ============================================================================
  const renderPrimarySidebar = () => (
    <div 
      className="bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 relative overflow-hidden"
      style={{ width: tokens.dimensions.primarySidebar.default }}
    >
      {/* Header */}
      <div className="h-9 px-3 flex items-center justify-between border-b border-slate-200 bg-white">
        <span className="text-xs font-semibold text-slate-500 tracking-wider">EXPLORER</span>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <MoreHorizontal size={14} />
        </button>
      </div>
      
      {/* Model Explorer */}
      <Collapsible title="MODEL EXPLORER" color="#64748B" defaultOpen={true}>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-sm text-slate-900 cursor-pointer hover:bg-slate-100 rounded px-1 py-0.5">
            <ChevronDown size={14} className="text-slate-400" />
            <FolderOpen size={14} className="text-yellow-500" />
            <span>AWS Architecture</span>
          </div>
          {['API Gateway', 'Lambda Functions', 'DynamoDB', 'S3 Buckets'].map((item, i) => (
            <div 
              key={i} 
              className={cn(
                "pl-6 flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer py-0.5 px-1 rounded",
                item === 'DynamoDB' && 'text-slate-900 bg-slate-100'
              )}
            >
              <span className="text-slate-300 text-xs">{i === 3 ? '└' : '├'}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Collapsible>
      
      {/* Element Palette - US-PAL-001 */}
      <div className="flex-1 overflow-auto">
        <div className="p-3 border-b border-slate-200 bg-white">
          <div className="text-[10px] text-slate-400 mb-2 tracking-wider font-semibold">ELEMENT PALETTE</div>
          {/* Search - US-PAL-002 */}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              placeholder="Search elements..." 
              className="w-full pl-8 h-8 text-xs border border-slate-200 rounded-md bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
            />
          </div>
        </div>
        
        {/* Favorites - US-PAL-003 (max 12) */}
        <Collapsible title="FAVORITES" color="#F59E0B" defaultOpen={true} badge="3/12">
          <div className="grid grid-cols-4 gap-1.5">
            {['λ', '🗄️', '☁️'].map((icon, i) => (
              <div 
                key={i} 
                className="aspect-square bg-white border border-slate-200 rounded flex items-center justify-center text-base hover:border-yellow-500 hover:bg-yellow-50 cursor-pointer transition-colors shadow-sm relative group"
              >
                {icon}
                <Star size={8} className="absolute top-0.5 right-0.5 text-yellow-500 fill-yellow-500" />
              </div>
            ))}
          </div>
        </Collapsible>
        
        {/* Recents - US-PAL-003 (last 8) */}
        <Collapsible title="RECENT" color="#64748B" defaultOpen={true} badge="5/8">
          <div className="grid grid-cols-4 gap-1.5">
            {['📦', '🌐', '🔐', '⚡', '💾'].map((icon, i) => (
              <div 
                key={i} 
                className="aspect-square bg-white border border-slate-200 rounded flex items-center justify-center text-base hover:border-slate-400 hover:bg-slate-100 cursor-pointer transition-colors shadow-sm"
              >
                {icon}
              </div>
            ))}
          </div>
        </Collapsible>
        
        {/* AWS Icons - US-PAL-001 (50+) */}
        <Collapsible title="AWS ICONS" color="#F97316" defaultOpen={true} badge="50+">
          <div className="grid grid-cols-4 gap-1.5">
            {['☁️', 'λ', '🗄️', '📦', '🌐', '⚡', '🔐', '📊'].map((icon, i) => (
              <div 
                key={i} 
                className="aspect-square bg-white border border-slate-200 rounded flex items-center justify-center text-base hover:border-orange-500 hover:bg-orange-50 cursor-pointer transition-colors shadow-sm"
              >
                {icon}
              </div>
            ))}
          </div>
        </Collapsible>
        
        {/* Azure */}
        <Collapsible title="AZURE" color="#0078D4" defaultOpen={false} badge="50+">
          <div className="grid grid-cols-4 gap-1.5">
            {['☁️', '💾', '🔷', '📊'].map((icon, i) => (
              <div 
                key={i} 
                className="aspect-square bg-white border border-slate-200 rounded flex items-center justify-center text-base hover:border-blue-600 hover:bg-blue-50 cursor-pointer transition-colors shadow-sm"
              >
                {icon}
              </div>
            ))}
          </div>
        </Collapsible>
        
        {/* GCP */}
        <Collapsible title="GCP" color="#4285F4" defaultOpen={false} badge="50+">
          <div className="grid grid-cols-4 gap-1.5">
            {['☁️', '🔶', '📊', '🗄️'].map((icon, i) => (
              <div 
                key={i} 
                className="aspect-square bg-white border border-slate-200 rounded flex items-center justify-center text-base hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors shadow-sm"
              >
                {icon}
              </div>
            ))}
          </div>
        </Collapsible>
        
        {/* ArchiMate */}
        <Collapsible title="ARCHIMATE" color="#4ADE80" defaultOpen={false} badge="60+">
          <div className="grid grid-cols-4 gap-1.5">
            {['□', '○', '△', '◇'].map((icon, i) => (
              <div 
                key={i} 
                className="aspect-square bg-white border border-slate-200 rounded flex items-center justify-center text-lg text-green-500 hover:border-green-500 hover:bg-green-50 cursor-pointer transition-colors shadow-sm"
              >
                {icon}
              </div>
            ))}
          </div>
        </Collapsible>
        
        {/* Generic */}
        <Collapsible title="GENERIC" color="#64748B" defaultOpen={false} badge="20+">
          <div className="grid grid-cols-4 gap-1.5">
            {['⬜', '⬛', '◯', '▢'].map((icon, i) => (
              <div 
                key={i} 
                className="aspect-square bg-white border border-slate-200 rounded flex items-center justify-center text-lg text-slate-500 hover:border-slate-400 hover:bg-slate-100 cursor-pointer transition-colors shadow-sm"
              >
                {icon}
              </div>
            ))}
          </div>
        </Collapsible>
      </div>
    </div>
  );

  // ============================================================================
  // RENDER: Canvas (Z3)
  // ============================================================================
  const renderCanvas = () => (
    <div className="flex-1 bg-slate-100 relative overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: 'radial-gradient(circle, #CBD5E1 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} 
      />
      
      {/* Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" />
          </marker>
        </defs>
        <line x1="350" y1="115" x2="190" y2="210" stroke="#94A3B8" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="350" y1="115" x2="350" y2="210" stroke="#94A3B8" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="350" y1="115" x2="510" y2="210" stroke="#94A3B8" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="350" y1="255" x2="350" y2="350" stroke="#94A3B8" strokeWidth="2" markerEnd="url(#arrowhead)" />
      </svg>
      
      {/* Elements */}
      {CANVAS_ELEMENTS.map(el => (
        <div 
          key={el.id}
          onClick={() => setSelectedElement(el.id)}
          className={cn(
            "absolute cursor-pointer transition-all duration-150",
            selectedElement === el.id 
              ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-slate-100 scale-105' 
              : 'hover:scale-[1.02]'
          )}
          style={{ left: el.x, top: el.y }}
        >
          <div 
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-white shadow-lg"
            style={{ backgroundColor: el.color }}
          >
            {el.name}
          </div>
        </div>
      ))}
      
      {/* Minimap */}
      <div className="absolute bottom-4 right-4 w-36 h-24 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-lg">
        <div className="px-2 py-1 text-[9px] text-slate-500 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <span>Minimap</span>
        </div>
        <div className="relative p-2">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-orange-400 rounded-sm opacity-60" />
          <div className="absolute top-8 left-4 w-4 h-1.5 bg-orange-400 rounded-sm opacity-60" />
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-orange-400 rounded-sm opacity-60" />
          <div className="absolute top-8 right-4 w-4 h-1.5 bg-orange-400 rounded-sm opacity-60" />
          <div className="absolute top-14 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-blue-400 rounded-sm opacity-60" />
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // RENDER: Panel Area (Z5)
  // ============================================================================
  const renderPanelArea = () => (
    <div 
      className="bg-white border-t border-slate-200 flex flex-col shrink-0 relative"
      style={{ height: tokens.dimensions.panelArea.default }}
    >
      {/* Tabs */}
      <div className="h-9 flex items-center border-b border-slate-200 px-1 bg-slate-50">
        {[
          { id: 'problems', label: 'PROBLEMS', count: 3 },
          { id: 'output', label: 'OUTPUT' },
          { id: 'terminal', label: 'MODEL TERMINAL' },
          { id: 'arkdl', label: 'ARKDL' },
          { id: 'activity', label: 'AI ACTIVITY' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActivePanel(tab.id)}
            className={cn(
              "px-3 h-full text-xs font-medium flex items-center gap-1.5 border-b-2 transition-colors",
              activePanel === tab.id 
                ? 'text-slate-900 border-orange-500' 
                : 'text-slate-500 border-transparent hover:text-slate-700'
            )}
          >
            {tab.label}
            {tab.count && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-orange-500 text-white">
                {tab.count}
              </span>
            )}
          </button>
        ))}
        <div className="flex-1" />
        <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors" onClick={() => setPanelOpen(false)}>
          <X size={14} />
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-2 text-xs">
        {activePanel === 'problems' && (
          <div className="space-y-1">
            {PROBLEMS_DATA.map(problem => (
              <div key={problem.id} className="flex items-center gap-3 py-1.5 px-2 hover:bg-slate-50 rounded cursor-pointer group transition-colors">
                <span className={cn(
                  "w-2 h-2 rounded-full shrink-0",
                  problem.severity === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                )} />
                <span className="text-slate-900 flex-1">{problem.message}</span>
                <span className="text-slate-400">{problem.detail || ''}</span>
                <span className="text-slate-500">{problem.location}</span>
                <button className="text-blue-500 hover:underline opacity-0 group-hover:opacity-100 transition-opacity">→ Go to</button>
              </div>
            ))}
          </div>
        )}
        
        {activePanel === 'terminal' && (
          <div className="font-mono text-slate-600">
            <div className="text-green-600 mb-1">Arkhitekton Model Terminal v0.1.0</div>
            <div className="text-slate-400 mb-2">Type 'help' for available commands. Model: microservices.ark</div>
            <div className="text-slate-900 mb-1">
              <span className="text-orange-500">ark&gt;</span> query "Lambda functions with memory &gt; 256MB"
            </div>
            <div className="text-slate-500 ml-4 mb-2">
              Found 2 elements:<br />
              • Orders API (512MB, nodejs18.x)<br />
              • Products API (512MB, nodejs18.x)
            </div>
            <div className="text-slate-900 flex items-center">
              <span className="text-orange-500">ark&gt;</span>
              <span className="ml-1 w-2 h-4 bg-orange-500 animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ============================================================================
  // RENDER: Secondary Sidebar (Z4) - AI + Properties
  // ============================================================================
  const renderSecondarySidebar = () => {
    const ModeIcon = selectedMode.icon;
    
    return (
      <div 
        className="bg-white border-l border-slate-200 flex flex-col shrink-0 relative overflow-hidden"
        style={{ width: tokens.dimensions.secondarySidebar.default }}
      >
        {/* AI Assistant Header */}
        <div className="h-12 px-3 flex items-center justify-between border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <span className="font-medium text-sm text-slate-900">AI Assistant</span>
          </div>
          <Badge variant="purple">Claude</Badge>
        </div>
        
        {/* Agent Mode Dropdown - US-AGT-014 */}
        <div className="p-3 border-b border-slate-200 bg-white">
          <div className="relative">
            <button 
              onClick={() => setModeDropdownOpen(!modeDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ModeIcon size={16} style={{ color: selectedMode.color }} />
                <span className="text-sm font-medium text-slate-900">{selectedMode.name}</span>
                <span className="text-xs text-slate-400">mode</span>
              </div>
              <ChevronDown size={16} className={cn("text-slate-400 transition-transform duration-200", modeDropdownOpen && 'rotate-180')} />
            </button>
            
            {/* Dropdown Menu */}
            {modeDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setModeDropdownOpen(false)} />
                <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
                  {AGENT_MODES.map(mode => {
                    const Icon = mode.icon;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => { setSelectedMode(mode); setModeDropdownOpen(false); }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 text-left transition-colors",
                          selectedMode.id === mode.id && 'bg-slate-50'
                        )}
                      >
                        <Icon size={16} style={{ color: mode.color }} />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-900">{mode.name}</div>
                          <div className="text-xs text-slate-500">{mode.description}</div>
                        </div>
                        {selectedMode.id === mode.id && <CheckCircle2 size={14} className="text-green-500" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-auto p-3 min-h-0 bg-slate-50">
          <div className="space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={cn("flex group", msg.role === 'user' ? 'justify-end' : 'gap-2')}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs shrink-0">
                    🤖
                  </div>
                )}
                <div className={cn(
                  "relative max-w-[85%]",
                  msg.role === 'user' 
                    ? 'bg-slate-200 rounded-2xl rounded-tr-sm px-4 py-2' 
                    : 'bg-white border border-slate-200 rounded-lg p-3 shadow-sm'
                )}>
                  {/* Timestamp on hover */}
                  <div className="absolute -top-5 right-0 text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatRelativeTime(msg.timestamp)}
                  </div>
                  
                  <p className="text-sm text-slate-900">{msg.content}</p>
                  {msg.details && (
                    <ul className="text-sm text-slate-600 mt-1 space-y-0.5">
                      {msg.details.map((d, i) => <li key={i}>• {d}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat Input */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <div className="relative flex items-center w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500">
            <input 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={selectedMode.placeholder}
              className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && chatInput.trim()) {
                  handleSendMessage();
                }
              }}
            />
            <button 
              className="ml-2 h-7 w-7 flex items-center justify-center rounded-md bg-gradient-to-r from-[#F97316] to-[#F59E0B] text-white hover:brightness-110 transition-all"
              onClick={handleSendMessage}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
        
        {/* Specialized Agents */}
        <div className="px-3 py-2 border-t border-slate-200 bg-white">
          <div className="text-[10px] text-slate-400 mb-2 tracking-wider font-semibold">SPECIALIZED AGENTS</div>
          <div className="flex flex-wrap gap-1.5">
            {SPECIALIZED_AGENTS.map(agent => (
              <button 
                key={agent.id}
                onClick={() => {
                  setChatInput(prev => prev ? `${prev} ${agent.name} ` : `${agent.name} `);
                }}
                className="px-2.5 py-1 rounded-full text-xs font-medium border-2 transition-colors hover:brightness-95"
                style={{ borderColor: agent.color, color: agent.color, backgroundColor: agent.color + '10' }}
                title={`Click to add ${agent.name} to your message`}
              >
                {agent.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Properties Panel */}
        <div className="border-t border-slate-200 flex-1 overflow-auto min-h-0 bg-slate-50">
          <div className="px-3 py-2 flex items-center justify-between border-b border-slate-200 sticky top-0 bg-white z-10">
            <span className="text-[10px] font-semibold text-slate-500 tracking-wider">PROPERTIES</span>
            <span className="text-xs text-slate-400">
              {CANVAS_ELEMENTS.find(e => e.id === selectedElement)?.name || 'None'}
            </span>
          </div>
          
          <Collapsible title="IDENTITY" color="#F97316">
            <div className="space-y-2">
              <PropertyField label="Name" value="Orders API" />
              <PropertyField label="Alias" value="Order Processing Service" placeholder />
              <PropertyField label="Type" value="AWS Lambda Function" />
              <PropertyField label="Stereotype" value="«serverless»" />
            </div>
          </Collapsible>
          
          <Collapsible title="TECHNOLOGY" color="#F97316">
            <div className="space-y-2">
              <PropertyField label="Runtime" value="Node.js 18.x" />
              <PropertyField label="Memory" value="512" suffix="MB" />
              <PropertyField label="Timeout" value="30" suffix="seconds" />
              <PropertyField label="Handler" value="index.handler" />
            </div>
          </Collapsible>
          
          <Collapsible title="LIFECYCLE" color="#F97316">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-16">Status</span>
                <div className="flex items-center gap-1.5 px-2 py-1.5 bg-white border border-slate-200 rounded flex-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-green-600 font-medium">Implemented</span>
                </div>
              </div>
              <PropertyField label="Phase" value="Current State" />
              <PropertyField label="Version" value="1.2.0" />
            </div>
          </Collapsible>
          
          <Collapsible title="GOVERNANCE" color="#60A5FA" defaultOpen={false} badge="4 fields">
            <div className="space-y-2">
              <PropertyField label="Owner" value="Platform Team" />
            </div>
          </Collapsible>
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER: Status Bar (Z6)
  // ============================================================================
  const renderStatusBar = () => (
    <div 
      className="bg-slate-800 flex items-center justify-between px-3 text-xs shrink-0 relative text-slate-300"
      style={{ height: tokens.dimensions.statusBar }}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FileText size={12} className="text-orange-400" />
          <span>microservices.ark</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-green-400">Saved</span>
        </div>
        <span className="text-slate-500">↔ Auto-sync: On</span>
        <span className="text-slate-500">Grid: 10px</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom(Math.max(10, zoom - 10))} className="text-slate-500 hover:text-white">
            <ZoomOut size={12} />
          </button>
          <span className="w-12 text-center">{zoom}%</span>
          <button onClick={() => setZoom(Math.min(400, zoom + 10))} className="text-slate-500 hover:text-white">
            <ZoomIn size={12} />
          </button>
        </div>
      </div>
      
      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <span>Claude Sonnet 4</span>
        </div>
        <span className="text-slate-500">⌘K Command Palette</span>
        <span className="px-2 py-0.5 bg-orange-500 text-white rounded text-[10px] font-medium">
          Selected: {CANVAS_ELEMENTS.find(e => e.id === selectedElement)?.name || 'None'}
        </span>
      </div>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  return (
    <div 
      className="h-screen w-full flex flex-col overflow-hidden bg-white text-slate-900"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      {renderTitleBar()}
      
      <div className="flex-1 flex overflow-hidden">
        {renderActivityBar()}
        {primarySidebarOpen && renderPrimarySidebar()}
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Tab Bar */}
          <div 
            className="bg-slate-50 border-b border-slate-200 flex items-center shrink-0"
            style={{ height: tokens.dimensions.tabBar }}
          >
            <div className="flex items-center h-full">
              <div className="px-3 h-full flex items-center gap-2 bg-white border-r border-slate-200 text-sm cursor-pointer group">
                <FileText size={14} className="text-orange-500" />
                <span className="text-slate-900">microservices.ark</span>
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <button className="text-slate-400 hover:text-slate-600 ml-1 opacity-0 group-hover:opacity-100"><X size={12} /></button>
              </div>
              <div className="px-3 h-full flex items-center gap-2 text-sm text-slate-500 hover:bg-slate-100 cursor-pointer border-r border-slate-200 group">
                <FileText size={14} className="text-blue-500" />
                <span>data-flow.ark</span>
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <button className="text-slate-400 hover:text-slate-600 ml-1 opacity-0 group-hover:opacity-100"><X size={12} /></button>
              </div>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-1 px-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className={cn("p-1.5 transition-colors", primarySidebarOpen ? 'text-slate-700' : 'text-slate-400 hover:text-slate-600')}
                    onClick={() => setPrimarySidebarOpen(!primarySidebarOpen)}
                  >
                    <PanelLeftClose size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Toggle Primary Sidebar</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className={cn("p-1.5 transition-colors", panelOpen ? 'text-slate-700' : 'text-slate-400 hover:text-slate-600')}
                    onClick={() => setPanelOpen(!panelOpen)}
                  >
                    <PanelBottomClose size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Toggle Panel</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className={cn("p-1.5 transition-colors", secondarySidebarOpen ? 'text-slate-700' : 'text-slate-400 hover:text-slate-600')}
                    onClick={() => setSecondarySidebarOpen(!secondarySidebarOpen)}
                  >
                    <PanelRightClose size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Toggle Secondary Sidebar</TooltipContent>
              </Tooltip>
            </div>
          </div>
          
          {renderCanvas()}
          {panelOpen && renderPanelArea()}
        </div>
        
        {secondarySidebarOpen && renderSecondarySidebar()}
      </div>
      
      {renderStatusBar()}
    </div>
  );
}
