import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Stage, Layer, Group, Rect, Text, Circle, Line } from "react-konva";
import { useState } from "react";
import { 
  ArrowLeft,
  ArrowRight,
  Network,
  Server,
  Database,
  Shield,
  Zap,
  Globe,
  Code,
  Monitor,
  Users,
  Lock,
  TrendingUp,
  Layers,
  GitBranch,
  Activity,
  Cpu,
  HardDrive,
  CloudDrizzle,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Clock,
  Settings,
  ExternalLink,
  FileText,
  Workflow,
  MessageSquare,
  PenTool,
  Terminal,
  Plug,
  RefreshCw,
  Eye,
  Key
} from "lucide-react";

// Interactive Swimlane Diagram Component with Flow Visualization
function DeveloperIntegrationDiagram({ selectedState, syncFlows: propSyncFlows }: { selectedState?: string, syncFlows?: any[] }) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  
  // Fetch integration channels and sync flows
  const { data: channels, isLoading: channelsLoading } = useQuery({
    queryKey: ['/api/integrations/developer/channels'],
  });
  
  const { data: fetchedSyncFlows, isLoading: flowsLoading } = useQuery({
    queryKey: ['/api/integrations/developer/sync-flows'],
  });

  const syncFlows = propSyncFlows || fetchedSyncFlows;

  if (channelsLoading || flowsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading integration diagram...</p>
        </div>
      </div>
    );
  }

  const stageWidth = 1200;
  const stageHeight = 600;
  const swimlaneHeight = 180;
  const nodeRadius = 18;

  // Define swimlane positions for MVP: VSCode + GitHub workflow
  const swimlanes = [
    { name: 'VSCode IDE (includes Cursor support)', y: 20, color: '#3B82F6' },
    { name: 'ARKHITEKTON Git-like Object Lifecycle', y: 220, color: '#8B5CF6' },
    { name: 'GitHub Version Control', y: 440, color: '#10B981' }
  ];

  // Generate source nodes (IDE/Developer Tools)
  const ideNodes = (channels || [])
    .filter((ch: any) => ch.type === 'ide')
    .map((ch: any, index: number) => ({
      id: ch.id,
      name: ch.name,
      x: 80 + (index * 160),
      y: 80,
      status: ch.status,
      type: 'ide'
    }));

  // Generate target nodes (Version Control)
  const vcsNodes = (channels || [])
    .filter((ch: any) => ch.type === 'vcs')
    .map((ch: any, index: number) => ({
      id: ch.id,
      name: ch.name,
      x: 80 + (index * 160),
      y: 500,
      status: ch.status,
      type: 'vcs'
    }));

  // ARKHITEKTON Git-like Lifecycle States (MVP: VSCode → GitHub workflow)
  const lifecycleStates = [
    { id: 'draft', name: 'Draft', x: 150, y: 300, color: '#6B7280', description: 'Local VSCode work' },
    { id: 'staged', name: 'Staged', x: 300, y: 300, color: '#F59E0B', description: 'Ready to commit' },
    { id: 'committed', name: 'Committed', x: 450, y: 300, color: '#10B981', description: 'In repository' },
    { id: 'branched', name: 'Branched', x: 600, y: 300, color: '#3B82F6', description: 'GitHub feature branch' },
    { id: 'merged', name: 'Merged', x: 750, y: 300, color: '#8B5CF6', description: 'GitHub main branch' }
  ];

  // Management nodes for ARKHITEKTON Core
  const managementNodes = [
    { id: 'state-engine', name: 'State Engine', x: 900, y: 260, type: 'core' },
    { id: 'object-store', name: 'Object Store', x: 900, y: 320, type: 'core' },
    { id: 'sync-engine', name: 'Sync Engine', x: 1000, y: 290, type: 'core' }
  ];

  // Group sync flows by state for visual representation
  const flowsByState = (syncFlows || []).reduce((acc: any, flow: any) => {
    const state = flow.currentState || 'draft';
    if (!acc[state]) acc[state] = [];
    acc[state].push(flow);
    return acc;
  }, {});

  // Calculate aggregated state data for visualization
  const stateAggregates = lifecycleStates.map(state => ({
    ...state,
    count: flowsByState[state.id]?.length || 0,
    flows: flowsByState[state.id] || []
  }));

  // Filter flows based on selected state
  const filteredSyncFlows = (syncFlows || []).filter((flow: any) => {
    if (selectedState) {
      return flow.currentState === selectedState;
    }
    return true;
  });

  // State color mapping
  const stateColors: Record<string, string> = {
    draft: '#6B7280',
    staged: '#F59E0B', 
    committed: '#10B981',
    branched: '#3B82F6',
    merged: '#8B5CF6'
  };

  // Generate Git-like lifecycle flow paths
  const generateLifecycleFlows = () => {
    return filteredSyncFlows.map((flow: any, index: number) => {
      const sourceChannel = [...(channels || [])].find((ch: any) => ch.id === flow.integrationChannelId);
      if (!sourceChannel) return null;

      const sourceNode = sourceChannel.type === 'ide' 
        ? ideNodes.find(n => n.id === sourceChannel.id)
        : vcsNodes.find(n => n.id === sourceChannel.id);
      
      if (!sourceNode) return null;

      // Find the current state node
      const currentStateNode = lifecycleStates.find(s => s.id === flow.currentState);
      if (!currentStateNode) return null;

      const stateColor = stateColors[flow.currentState] || stateColors.draft;
      
      return {
        id: flow.id,
        sourceNode,
        currentStateNode,
        flow,
        stateColor,
        offset: (index % 3) * 6 // Offset multiple flows from same source
      };
    }).filter(Boolean);
  };

  // Generate state transition paths (showing Git-like progression)
  const generateStateTransitions = () => {
    const transitions = [];
    for (let i = 0; i < lifecycleStates.length - 1; i++) {
      const fromState = lifecycleStates[i];
      const toState = lifecycleStates[i + 1];
      
      // Count flows that could transition between these states
      const transitionCount = (syncFlows || []).filter((flow: any) => 
        flow.stateHistory && 
        flow.stateHistory.includes(fromState.id) && 
        flow.stateHistory.includes(toState.id)
      ).length;

      transitions.push({
        from: fromState,
        to: toState,
        count: transitionCount,
        active: transitionCount > 0
      });
    }
    return transitions;
  };

  const lifecycleFlows = generateLifecycleFlows();
  const stateTransitions = generateStateTransitions();

  return (
    <div className="border border-violet-200 dark:border-violet-800 rounded-lg p-4 bg-white dark:bg-slate-900">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-violet-900 dark:text-violet-100 flex items-center">
          <Network className="h-4 w-4 mr-2" />
          Live Developer Integration Flow
        </h4>
        <div className="flex items-center space-x-2">
          {selectedState && (
            <Badge variant="outline" className="text-xs">
              Showing {selectedState} flows ({filteredSyncFlows.length})
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            {lifecycleFlows.length} VSCode↔GitHub Flows
          </Badge>
          <Badge variant="outline" className="text-xs">
            {stateAggregates.reduce((sum, state) => sum + state.count, 0)} Architecture Objects
          </Badge>
          <Badge variant="secondary" className="text-xs">
            MVP: VSCode + GitHub
          </Badge>
        </div>
      </div>
      
      <Stage width={stageWidth} height={stageHeight}>
        <Layer>
          {/* Swimlane backgrounds */}
          {swimlanes.map((lane) => (
            <Group key={lane.name}>
              <Rect
                x={0}
                y={lane.y}
                width={stageWidth}
                height={swimlaneHeight}
                fill={lane.color}
                opacity={0.1}
                stroke={lane.color}
                strokeWidth={2}
              />
              <Text
                x={15}
                y={lane.y + 15}
                text={lane.name}
                fontSize={16}
                fontFamily="Arial"
                fill={lane.color}
                fontStyle="bold"
              />
            </Group>
          ))}

          {/* Git-like State Transition Lines (Draft → Staged → Committed → Branched → Merged) */}
          {stateTransitions.map((transition: any, index: number) => (
            <Group key={`transition-${index}`}>
              <Line
                points={[
                  transition.from.x + nodeRadius, 
                  transition.from.y,
                  transition.to.x - nodeRadius, 
                  transition.to.y
                ]}
                stroke={transition.active ? '#8B5CF6' : '#D1D5DB'}
                strokeWidth={transition.active ? 3 : 1}
                opacity={transition.active ? 0.8 : 0.3}
                dash={transition.active ? [] : [5, 5]}
              />
              {/* Transition arrow */}
              <Line
                points={[
                  transition.to.x - nodeRadius - 10,
                  transition.to.y - 5,
                  transition.to.x - nodeRadius,
                  transition.to.y,
                  transition.to.x - nodeRadius - 10,
                  transition.to.y + 5
                ]}
                stroke={transition.active ? '#8B5CF6' : '#D1D5DB'}
                strokeWidth={transition.active ? 2 : 1}
                opacity={transition.active ? 0.8 : 0.3}
                closed={false}
              />
              {/* Transition count badge */}
              {transition.count > 0 && (
                <Group>
                  <Circle
                    x={(transition.from.x + transition.to.x) / 2}
                    y={transition.from.y - 15}
                    radius={8}
                    fill="#EF4444"
                    stroke="white"
                    strokeWidth={1}
                  />
                  <Text
                    x={(transition.from.x + transition.to.x) / 2 - 4}
                    y={transition.from.y - 15 - 3}
                    text={transition.count.toString()}
                    fontSize={8}
                    fontFamily="Arial"
                    fill="white"
                    align="center"
                  />
                </Group>
              )}
            </Group>
          ))}

          {/* Object Flow Lines from Sources to Current State */}
          {lifecycleFlows.map((lifecycleFlow: any) => {
            const offsetX = lifecycleFlow.offset;
            
            return (
              <Group key={`lifecycle-flow-${lifecycleFlow.id}`}>
                <Line
                  points={[
                    lifecycleFlow.sourceNode.x + offsetX, 
                    lifecycleFlow.sourceNode.y + (lifecycleFlow.sourceNode.type === 'ide' ? nodeRadius : -nodeRadius),
                    lifecycleFlow.currentStateNode.x + offsetX, 
                    lifecycleFlow.currentStateNode.y - nodeRadius
                  ]}
                  stroke={lifecycleFlow.stateColor}
                  strokeWidth={selectedFlow === lifecycleFlow.id ? 4 : 2}
                  opacity={selectedState && lifecycleFlow.flow.currentState !== selectedState ? 0.3 : 0.8}
                  dash={lifecycleFlow.flow.currentState === 'draft' ? [5, 5] : []}
                  onClick={() => setSelectedFlow(selectedFlow === lifecycleFlow.id ? null : lifecycleFlow.id)}
                  onTap={() => setSelectedFlow(selectedFlow === lifecycleFlow.id ? null : lifecycleFlow.id)}
                />
                
                {/* Flow State Indicator */}
                <Circle
                  x={lifecycleFlow.sourceNode.x + offsetX}
                  y={lifecycleFlow.sourceNode.y + (lifecycleFlow.sourceNode.type === 'ide' ? nodeRadius + 8 : -nodeRadius - 8)}
                  radius={3}
                  fill={lifecycleFlow.stateColor}
                  onClick={() => setSelectedFlow(selectedFlow === lifecycleFlow.id ? null : lifecycleFlow.id)}
                  onTap={() => setSelectedFlow(selectedFlow === lifecycleFlow.id ? null : lifecycleFlow.id)}
                />
              </Group>
            );
          })}

          {/* Git-like Lifecycle State Nodes (Core ARKHITEKTON Feature) */}
          {stateAggregates.map((state) => (
            <Group 
              key={state.id}
              onClick={() => setSelectedNode(selectedNode === state.id ? null : state.id)}
              onTap={() => setSelectedNode(selectedNode === state.id ? null : state.id)}
            >
              <Circle
                x={state.x}
                y={state.y}
                radius={nodeRadius + (state.count > 0 ? 5 : 0)}
                fill={selectedNode === state.id ? '#F59E0B' : state.color}
                stroke={selectedState === state.id ? '#000000' : state.color}
                strokeWidth={selectedState === state.id ? 4 : 2}
                shadowBlur={selectedNode === state.id ? 15 : 8}
                shadowColor="black"
                shadowOpacity={0.4}
              />
              <Text
                x={state.x - 20}
                y={state.y - 5}
                width={40}
                text={state.name}
                fontSize={11}
                fontFamily="Arial"
                fill="white"
                align="center"
                fontStyle="bold"
              />
              {/* Object count badge for each state */}
              {state.count > 0 && (
                <Group>
                  <Circle
                    x={state.x + 18}
                    y={state.y - 18}
                    radius={10}
                    fill="#DC2626"
                    stroke="white"
                    strokeWidth={2}
                  />
                  <Text
                    x={state.x + 18 - 6}
                    y={state.y - 18 - 4}
                    text={state.count.toString()}
                    fontSize={10}
                    fontFamily="Arial"
                    fill="white"
                    align="center"
                    fontStyle="bold"
                  />
                </Group>
              )}
              {/* State description */}
              <Text
                x={state.x - 30}
                y={state.y + 25}
                width={60}
                text={state.description}
                fontSize={8}
                fontFamily="Arial"
                fill={state.color}
                align="center"
              />
            </Group>
          ))}

          {/* IDE/Developer Tool Nodes */}
          {ideNodes.map((node: any) => {
            const nodeFlows = lifecycleFlows.filter((lf: any) => lf.sourceNode.id === node.id);
            
            return (
              <Group key={node.id}>
                <Circle
                  x={node.x}
                  y={node.y}
                  radius={nodeRadius + (nodeFlows.length > 0 ? 3 : 0)}
                  fill={selectedNode === node.id ? '#F59E0B' : '#3B82F6'}
                  stroke={node.status === 'active' ? '#10B981' : '#EF4444'}
                  strokeWidth={3}
                  shadowBlur={selectedNode === node.id ? 10 : 5}
                  shadowColor="black"
                  shadowOpacity={0.3}
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  onTap={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                />
                <Text
                  x={node.x - 25}
                  y={node.y - 5}
                  width={50}
                  text={node.name.split(' ')[0]}
                  fontSize={10}
                  fontFamily="Arial"
                  fill="white"
                  align="center"
                />
                {/* Flow count badge */}
                {nodeFlows.length > 0 && (
                  <Group>
                    <Circle
                      x={node.x + 15}
                      y={node.y - 15}
                      radius={8}
                      fill="#DC2626"
                      stroke="white"
                      strokeWidth={1}
                    />
                    <Text
                      x={node.x + 15 - 4}
                      y={node.y - 15 - 3}
                      text={nodeFlows.length.toString()}
                      fontSize={8}
                      fontFamily="Arial"
                      fill="white"
                      align="center"
                    />
                  </Group>
                )}
              </Group>
            );
          })}

          {/* ARKHITEKTON Management Nodes */}
          {managementNodes.map((node) => (
            <Group key={node.id}>
              <Circle
                x={node.x}
                y={node.y}
                radius={nodeRadius}
                fill={selectedNode === node.id ? '#F59E0B' : '#8B5CF6'}
                stroke="#7C3AED"
                strokeWidth={2}
                shadowBlur={selectedNode === node.id ? 10 : 5}
                shadowColor="black"
                shadowOpacity={0.3}
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                onTap={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
              />
              <Text
                x={node.x - 25}
                y={node.y - 5}
                width={50}
                text={node.name.replace(' ', '\n')}
                fontSize={8}
                fontFamily="Arial"
                fill="white"
                align="center"
              />
            </Group>
          ))}

          {/* VCS Nodes */}
          {vcsNodes.map((node: any) => {
            const nodeFlows = lifecycleFlows.filter((lf: any) => lf.sourceNode.id === node.id);
            
            return (
              <Group key={node.id}>
                <Circle
                  x={node.x}
                  y={node.y}
                  radius={nodeRadius + (nodeFlows.length > 0 ? 3 : 0)}
                  fill={selectedNode === node.id ? '#F59E0B' : '#10B981'}
                  stroke={node.status === 'active' ? '#059669' : '#EF4444'}
                  strokeWidth={3}
                  shadowBlur={selectedNode === node.id ? 10 : 5}
                  shadowColor="black"
                  shadowOpacity={0.3}
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  onTap={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                />
                <Text
                  x={node.x - 25}
                  y={node.y - 5}
                  width={50}
                  text={node.name.split(' ')[0]}
                  fontSize={10}
                  fontFamily="Arial"
                  fill="white"
                  align="center"
                />
                {/* Flow count badge */}
                {nodeFlows.length > 0 && (
                  <Group>
                    <Circle
                      x={node.x + 15}
                      y={node.y - 15}
                      radius={8}
                      fill="#DC2626"
                      stroke="white"
                      strokeWidth={1}
                    />
                    <Text
                      x={node.x + 15 - 4}
                      y={node.y - 15 - 3}
                      text={nodeFlows.length.toString()}
                      fontSize={8}
                      fontFamily="Arial"
                      fill="white"
                      align="center"
                    />
                  </Group>
                )}
              </Group>
            );
          })}
        </Layer>
      </Stage>

      {/* Enhanced Details Panel */}
      {(selectedNode || selectedFlow) && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h5 className="font-medium mb-3 flex items-center">
            {selectedFlow ? (
              <>
                <Activity className="h-4 w-4 mr-2" />
                Sync Flow Details
              </>
            ) : (
              <>
                <Network className="h-4 w-4 mr-2" />
                Integration Channel Details
              </>
            )}
          </h5>
          
          {selectedFlow && (() => {
            const flow = lifecycleFlows.find((lf: any) => lf.id === selectedFlow)?.flow;
            if (!flow) return null;
            
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div><span className="font-medium">Object ID:</span> {flow.objectId}</div>
                  <div><span className="font-medium">Current State:</span> 
                    <Badge 
                      variant="outline" 
                      className="ml-2"
                      style={{ borderColor: stateColors[flow.currentState], color: stateColors[flow.currentState] }}
                    >
                      {flow.currentState}
                    </Badge>
                  </div>
                  <div><span className="font-medium">Object Type:</span> {flow.objectType}</div>
                  <div><span className="font-medium">Version:</span> {flow.version || 'N/A'}</div>
                </div>
                <div className="space-y-2">
                  <div><span className="font-medium">Last Sync:</span> {flow.lastSyncAt ? new Date(flow.lastSyncAt).toLocaleString() : 'Never'}</div>
                  <div><span className="font-medium">Conflict Status:</span> 
                    <Badge variant={flow.conflictResolution === 'resolved' ? 'default' : 'destructive'} className="ml-2 text-xs">
                      {flow.conflictResolution || 'none'}
                    </Badge>
                  </div>
                  <div><span className="font-medium">Sync Direction:</span> {flow.syncDirection}</div>
                  <div><span className="font-medium">State History:</span> {flow.stateHistory?.length || 0} transitions</div>
                </div>
              </div>
            );
          })()}
          
          {selectedNode && !selectedFlow && (() => {
            const selectedChannel = [...(channels || [])].find((ch: any) => ch.id === selectedNode);
            const channelFlows = lifecycleFlows.filter((lf: any) => lf.sourceNode.id === selectedNode);
            
            if (selectedChannel) {
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div><span className="font-medium">Tool:</span> {selectedChannel.name}</div>
                    <div><span className="font-medium">Type:</span> {selectedChannel.type}</div>
                    <div><span className="font-medium">Direction:</span> {selectedChannel.directionality}</div>
                    <div><span className="font-medium">Status:</span> 
                      <Badge variant="outline" className="ml-2">
                        {selectedChannel.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div><span className="font-medium">Active Flows:</span> {channelFlows.length}</div>
                    <div><span className="font-medium">Capabilities:</span> {selectedChannel.capabilities?.join(', ')}</div>
                    <div><span className="font-medium">Auth Method:</span> {selectedChannel.authMethod || 'OAuth 2.0'}</div>
                    <div><span className="font-medium">Last Connected:</span> {selectedChannel.lastConnected ? new Date(selectedChannel.lastConnected).toLocaleString() : 'Never'}</div>
                  </div>
                </div>
              );
            }
            
            return <p className="text-sm text-gray-600 dark:text-gray-400">Select a node or flow to view details</p>;
          })()}
          
          {/* Flow Statistics for selected channel */}
          {selectedNode && !selectedFlow && (() => {
            const channelFlows = lifecycleFlows.filter((lf: any) => lf.sourceNode.id === selectedNode);
            if (channelFlows.length === 0) return null;
            
            const stateBreakdown = channelFlows.reduce((acc: any, fp: any) => {
              const state = fp.flow.currentState;
              acc[state] = (acc[state] || 0) + 1;
              return acc;
            }, {});
            
            return (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <h6 className="font-medium mb-2 text-sm">Flow State Breakdown</h6>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stateBreakdown).map(([state, count]: any) => (
                    <Badge 
                      key={state}
                      variant="outline" 
                      className="text-xs"
                      style={{ borderColor: stateColors[state], color: stateColors[state] }}
                    >
                      {state}: {count}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// Git-like State Lifecycle Component with Enhanced Flow Visualization
function ObjectStateLifecycle({ syncFlows, onStateSelect }: { syncFlows?: any[], onStateSelect?: (state: string) => void }) {
  if (!syncFlows) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-lg"></div>;
  }

  // Group sync flows by state with detailed analytics
  const stateStats = syncFlows.reduce((acc: any, flow: any) => {
    const state = flow.currentState || 'draft';
    if (!acc[state]) {
      acc[state] = { count: 0, flows: [], lastUpdated: null };
    }
    acc[state].count++;
    acc[state].flows.push(flow);
    if (!acc[state].lastUpdated || flow.lastSyncAt > acc[state].lastUpdated) {
      acc[state].lastUpdated = flow.lastSyncAt;
    }
    return acc;
  }, {});

  const states = [
    { name: 'Draft', key: 'draft', color: 'gray', icon: PenTool, description: 'Working tree changes' },
    { name: 'Staged', key: 'staged', color: 'yellow', icon: Clock, description: 'Ready for commit' },
    { name: 'Committed', key: 'committed', color: 'green', icon: CheckCircle2, description: 'Mainline architecture' },
    { name: 'Branched', key: 'branched', color: 'blue', icon: GitBranch, description: 'Feature development' },
    { name: 'Merged', key: 'merged', color: 'purple', icon: Layers, description: 'Integrated changes' }
  ];

  const totalFlows = syncFlows.length;

  return (
    <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 rounded-lg p-6 border border-violet-200 dark:border-violet-800">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-violet-900 dark:text-violet-100 flex items-center">
          <Activity className="h-4 w-4 mr-2" />
          Live Object State Management
        </h4>
        <Badge variant="outline" className="text-xs">
          {totalFlows} Total Objects
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {states.map((state) => {
          const stateData = stateStats[state.key] || { count: 0, flows: [] };
          const count = stateData.count;
          const Icon = state.icon;
          const percentage = totalFlows > 0 ? Math.round((count / totalFlows) * 100) : 0;
          
          return (
            <div 
              key={state.key} 
              className="text-center cursor-pointer transition-all hover:scale-105"
              onClick={() => onStateSelect?.(state.key)}
              data-testid={`state-${state.key}`}
            >
              <div className={`w-16 h-16 mx-auto bg-${state.color}-100 dark:bg-${state.color}-800/30 rounded-full flex items-center justify-center mb-2 relative border-2 ${count > 0 ? `border-${state.color}-500` : 'border-gray-300 dark:border-gray-600'}`}>
                <Icon className={`h-6 w-6 text-${state.color}-600 dark:text-${state.color}-400`} />
                {count > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 text-xs font-bold">
                    {count}
                  </Badge>
                )}
                {count > 0 && (
                  <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-${state.color}-500 rounded-full opacity-70`}
                       style={{ width: `${Math.max(percentage * 0.8, 20)}%` }}></div>
                )}
              </div>
              <h5 className="font-medium text-sm">{state.name}</h5>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {count} object{count !== 1 ? 's' : ''} ({percentage}%)
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {state.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* State Transition Flow */}
      {totalFlows > 0 && (
        <div className="mt-6 p-4 bg-white/50 dark:bg-black/20 rounded-lg">
          <h5 className="font-medium mb-2 text-sm">State Transition Activity</h5>
          <div className="space-y-2">
            {Object.entries(stateStats)
              .filter(([, data]: any) => data.count > 0)
              .sort(([, a]: any, [, b]: any) => b.count - a.count)
              .slice(0, 3)
              .map(([state, data]: any) => {
                const stateInfo = states.find(s => s.key === state);
                return (
                  <div key={state} className="flex items-center justify-between text-xs">
                    <span className="flex items-center">
                      <div className={`w-2 h-2 rounded-full bg-${stateInfo?.color}-500 mr-2`}></div>
                      {stateInfo?.name}: {data.count} objects
                    </span>
                    <span className="text-gray-500">
                      {data.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString() : 'N/A'}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ArkhitektonSystemsIntegration() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  
  // Fetch sync flows for the state management components
  const { data: syncFlows } = useQuery({
    queryKey: ['/api/integrations/developer/sync-flows'],
  });

  const handleStateSelect = (state: string) => {
    setSelectedState(selectedState === state ? null : state);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-violet-50/30 via-purple-50/20 to-indigo-50/30 dark:from-violet-950/10 dark:via-purple-950/5 dark:to-indigo-950/10">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center mb-6">
              <Link href="/arkhitekton-architecture">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 mr-4" data-testid="button-back-architecture">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Architecture
                </Button>
              </Link>
              <div className="p-2 rounded-lg bg-white/20">
                <Network className="h-6 w-6" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">ARKHITEKTON Systems Integration</h1>
            <p className="text-xl text-violet-100 max-w-4xl">
              Comprehensive enterprise integration architecture connecting ARKHITEKTON with your existing 
              enterprise tools, development workflows, and business systems through secure APIs and intelligent automation.
            </p>
            
            <div className="flex items-center mt-6 space-x-6">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                15+ Enterprise Integrations
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Real-time Bidirectional Sync
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Zero-Trust Security
              </Badge>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Integration Overview */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Integration Architecture Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200 dark:border-violet-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Plug className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">API-First Integration</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">RESTful APIs with OpenAPI specs for seamless enterprise connectivity</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <RefreshCw className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Real-time Sync</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Bidirectional data synchronization with conflict resolution</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Enterprise Security</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">SSO, OAuth 2.0, and zero-trust architecture compliance</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Intelligent Automation</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">AI-powered workflow automation and smart data mapping</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Detailed Integration Tabs */}
          <Tabs defaultValue="enterprise" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
              <TabsTrigger value="enterprise" className="flex flex-col items-center p-3" data-testid="tab-enterprise-tools">
                <Users className="h-4 w-4 mb-1" />
                <span className="text-xs">Enterprise Tools</span>
              </TabsTrigger>
              <TabsTrigger value="development" className="flex flex-col items-center p-3" data-testid="tab-development">
                <Code className="h-4 w-4 mb-1" />
                <span className="text-xs">Development</span>
              </TabsTrigger>
              <TabsTrigger value="developer" className="flex flex-col items-center p-3" data-testid="tab-developer-integration">
                <GitBranch className="h-4 w-4 mb-1" />
                <span className="text-xs">Developer Integration</span>
              </TabsTrigger>
              <TabsTrigger value="dataflow" className="flex flex-col items-center p-3" data-testid="tab-data-flows">
                <Database className="h-4 w-4 mb-1" />
                <span className="text-xs">Data Flows</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex flex-col items-center p-3" data-testid="tab-security">
                <Lock className="h-4 w-4 mb-1" />
                <span className="text-xs">Security</span>
              </TabsTrigger>
              <TabsTrigger value="automation" className="flex flex-col items-center p-3" data-testid="tab-automation">
                <Workflow className="h-4 w-4 mb-1" />
                <span className="text-xs">Automation</span>
              </TabsTrigger>
            </TabsList>

            {/* Enterprise Tools Integration */}
            <TabsContent value="enterprise" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-violet-600" />
                    Enterprise Collaboration & Project Management
                  </CardTitle>
                  <CardDescription>
                    Seamless integration with enterprise tools for project tracking, documentation, and team collaboration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Project Management Integration */}
                  <div className="border border-violet-200 dark:border-violet-800 rounded-lg p-6 bg-gradient-to-r from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-violet-900 dark:text-violet-100 flex items-center">
                      <GitBranch className="h-4 w-4 mr-2" />
                      Project Management Integration
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                              <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="font-medium">Atlassian Jira</span>
                          </div>
                          <Badge variant="outline">Bidirectional</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded flex items-center justify-center">
                              <GitBranch className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="font-medium">Azure DevOps</span>
                          </div>
                          <Badge variant="outline">Real-time</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/30 rounded flex items-center justify-center">
                              <TrendingUp className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                            </div>
                            <span className="font-medium">Aha! Roadmaps</span>
                          </div>
                          <Badge variant="outline">Strategic</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-slate-900 dark:text-white">Integration Capabilities:</h5>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          <li>• Automatic ticket creation from architecture reviews</li>
                          <li>• Architecture decision tracking in project workflows</li>
                          <li>• Requirement traceability from strategy to implementation</li>
                          <li>• Impact analysis reporting to stakeholders</li>
                          <li>• Automated sprint planning with architecture dependencies</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Documentation Integration */}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Documentation & Knowledge Management
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Confluence</span>
                          </div>
                          <Badge variant="secondary">Wiki</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Automatic architecture documentation publishing</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">SharePoint</span>
                          </div>
                          <Badge variant="secondary">Enterprise</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Enterprise document management integration</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Microsoft Teams</span>
                          </div>
                          <Badge variant="secondary">Collaboration</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Real-time architecture review collaboration</p>
                      </div>
                    </div>
                  </div>

                  {/* Design Integration */}
                  <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100 flex items-center">
                      <PenTool className="h-4 w-4 mr-2" />
                      Design & Creative Tools Integration
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded">
                          <div>
                            <div className="font-medium">Figma Integration</div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">UI/UX design synchronization</div>
                          </div>
                          <PenTool className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded">
                          <div>
                            <div className="font-medium">Miro Collaboration</div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">Workshop and brainstorming export</div>
                          </div>
                          <Layers className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded">
                          <div>
                            <div className="font-medium">Adobe Creative Cloud</div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">Brand asset integration</div>
                          </div>
                          <Eye className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded">
                          <div>
                            <div className="font-medium">Sketch & Invision</div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">Legacy design tool migration</div>
                          </div>
                          <RefreshCw className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </TabsContent>

            {/* Development Integration */}
            <TabsContent value="development" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="h-5 w-5 mr-2 text-violet-600" />
                    Development Lifecycle Integration
                  </CardTitle>
                  <CardDescription>
                    Bidirectional sync between architecture models and code, enabling forward and reverse engineering workflows
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* IDE Integration */}
                  <div className="border border-violet-200 dark:border-violet-800 rounded-lg p-6 bg-gradient-to-r from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-violet-900 dark:text-violet-100 flex items-center">
                      <Terminal className="h-4 w-4 mr-2" />
                      Code Editor & IDE Integration
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                              <Code className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="font-medium">VS Code Extension</span>
                          </div>
                          <Badge variant="outline">Plugin</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded flex items-center justify-center">
                              <Terminal className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            </div>
                            <span className="font-medium">IntelliJ IDEA</span>
                          </div>
                          <Badge variant="outline">JetBrains</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
                              <GitBranch className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="font-medium">GitHub Copilot</span>
                          </div>
                          <Badge variant="outline">AI-Powered</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-slate-900 dark:text-white">Development Features:</h5>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          <li>• Generate code snippets from architecture models</li>
                          <li>• Reverse engineer architecture from existing code</li>
                          <li>• Real-time sync between code changes and models</li>
                          <li>• Automated architecture compliance validation</li>
                          <li>• Refactoring impact analysis and suggestions</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Version Control Integration */}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center">
                      <GitBranch className="h-4 w-4 mr-2" />
                      Version Control & Source Management
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <GitBranch className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">GitHub</span>
                          </div>
                          <Badge variant="secondary">Git</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Architecture-as-code with pull request reviews</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Cpu className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">GitLab</span>
                          </div>
                          <Badge variant="secondary">CI/CD</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Integrated DevOps pipeline with architecture gates</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Server className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Bitbucket</span>
                          </div>
                          <Badge variant="secondary">Enterprise</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Enterprise source control with architecture tracking</p>
                      </div>
                    </div>
                  </div>

                  {/* API & Webhook Integration */}
                  <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100 flex items-center">
                      <Network className="h-4 w-4 mr-2" />
                      API Management & Integration Platform
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded">
                          <div>
                            <div className="font-medium">RESTful API Suite</div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">OpenAPI 3.0 specification with Swagger docs</div>
                          </div>
                          <Network className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded">
                          <div>
                            <div className="font-medium">GraphQL Endpoint</div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">Flexible data querying for custom integrations</div>
                          </div>
                          <Database className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded">
                          <div>
                            <div className="font-medium">Webhook Events</div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">Real-time event notifications and triggers</div>
                          </div>
                          <Zap className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded">
                          <div>
                            <div className="font-medium">SDK Libraries</div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">Python, JavaScript, .NET, Java SDKs</div>
                          </div>
                          <Code className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </TabsContent>

            {/* Developer Integration with Git-like State Management */}
            <TabsContent value="developer" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GitBranch className="h-5 w-5 mr-2 text-violet-600" />
                    Developer Integration Architecture
                  </CardTitle>
                  <CardDescription>
                    Git-like object state management for architectural models with real-time synchronization across development tools
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Live Object State Management */}
                  <ObjectStateLifecycle 
                    syncFlows={syncFlows} 
                    onStateSelect={handleStateSelect}
                  />

                  {/* Interactive Swimlane Diagram */}
                  <DeveloperIntegrationDiagram 
                    selectedState={selectedState}
                    syncFlows={syncFlows}
                  />

                  {/* Integration Specifications */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-violet-200 dark:border-violet-800 rounded-lg p-4">
                      <h5 className="font-semibold mb-3 text-violet-900 dark:text-violet-100 flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Sync Configuration
                      </h5>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Sync Frequency</span>
                          <Badge variant="outline">Real-time</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Conflict Resolution</span>
                          <Badge variant="outline">CRDT + Manual</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">State Versioning</span>
                          <Badge variant="outline">Optimistic</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Object Types</span>
                          <Badge variant="outline">All Architectural</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="border border-violet-200 dark:border-violet-800 rounded-lg p-4">
                      <h5 className="font-semibold mb-3 text-violet-900 dark:text-violet-100 flex items-center">
                        <Key className="h-4 w-4 mr-2" />
                        Authentication & Security
                      </h5>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">OAuth 2.0</span>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">API Tokens</span>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">SSH Keys</span>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Webhook Security</span>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Flows */}
            <TabsContent value="dataflow" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2 text-violet-600" />
                    Enterprise Data Integration Flows
                  </CardTitle>
                  <CardDescription>
                    Comprehensive data synchronization patterns ensuring consistency across enterprise systems
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Data Flow Architecture */}
                  <div className="border border-violet-200 dark:border-violet-800 rounded-lg p-6 bg-gradient-to-r from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10">
                    <h4 className="text-lg font-semibold mb-6 text-violet-900 dark:text-violet-100 flex items-center">
                      <Workflow className="h-4 w-4 mr-2" />
                      Integration Data Flow Patterns
                    </h4>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        
                        <div className="text-center">
                          <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Users className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                          </div>
                          <h4 className="font-medium mb-2">Source Systems</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300">Enterprise Tools & APIs</p>
                        </div>
                        
                        <div className="flex justify-center">
                          <ArrowRight className="h-6 w-6 text-slate-400" />
                        </div>
                        
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Network className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h4 className="font-medium mb-2">Integration Layer</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300">API Gateway & ESB</p>
                        </div>
                        
                        <div className="flex justify-center">
                          <ArrowRight className="h-6 w-6 text-slate-400" />
                        </div>
                        
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Server className="h-8 w-8 text-green-600 dark:text-green-400" />
                          </div>
                          <h4 className="font-medium mb-2">ARKHITEKTON</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300">Core Platform</p>
                        </div>
                        
                      </div>
                    </div>
                  </div>

                  {/* Real-time Synchronization */}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Real-time Data Synchronization
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h5 className="font-medium text-slate-900 dark:text-white">Bidirectional Sync Patterns</h5>
                        <div className="space-y-2">
                          <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Project Data Sync</span>
                              <Badge variant="secondary">Real-time</Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Jira tickets ↔ Architecture decisions</p>
                          </div>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Code Synchronization</span>
                              <Badge variant="secondary">Event-driven</Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Git commits ↔ Architecture models</p>
                          </div>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Design Asset Sync</span>
                              <Badge variant="secondary">Webhook</Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Figma designs ↔ UI architecture</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h5 className="font-medium text-slate-900 dark:text-white">Conflict Resolution</h5>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded">
                            <div>
                              <div className="font-medium">Timestamp Priority</div>
                              <div className="text-sm text-slate-600 dark:text-slate-300">Last-write-wins with audit trail</div>
                            </div>
                            <Clock className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded">
                            <div>
                              <div className="font-medium">Manual Review</div>
                              <div className="text-sm text-slate-600 dark:text-slate-300">Architect approval for conflicts</div>
                            </div>
                            <Eye className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded">
                            <div>
                              <div className="font-medium">Smart Merging</div>
                              <div className="text-sm text-slate-600 dark:text-slate-300">AI-powered change reconciliation</div>
                            </div>
                            <Zap className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Governance */}
                  <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100 flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Data Governance & Quality
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <Database className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                        <h4 className="font-medium mb-2">Data Lineage</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Complete traceability across systems</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                        <h4 className="font-medium mb-2">Quality Validation</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Automated data consistency checks</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <Eye className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                        <h4 className="font-medium mb-2">Audit Trail</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Complete change history and compliance</p>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="h-5 w-5 mr-2 text-violet-600 dark:text-violet-400" />
                      Authentication & Authorization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Key className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Enterprise SSO Integration</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">SAML 2.0, OpenID Connect, OAuth 2.0 support</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Key className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Active Directory Integration</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">LDAP/AD for user and group management</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Key className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Multi-Factor Authentication</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">TOTP, SMS, hardware tokens support</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Key className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Role-Based Access Control</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Granular permissions and enterprise roles</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-violet-600 dark:text-violet-400" />
                      Data Protection & Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">End-to-End Encryption</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">AES-256 encryption for data at rest and in transit</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Zero-Trust Architecture</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Verify every request and connection</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Compliance Frameworks</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">SOC 2, ISO 27001, GDPR, HIPAA ready</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">API Security</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Rate limiting, API keys, JWT tokens</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Security Architecture */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Network className="h-5 w-5 mr-2 text-violet-600 dark:text-violet-400" />
                    Enterprise Security Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-violet-50 dark:bg-violet-950/20 rounded-lg">
                      <Lock className="h-8 w-8 text-violet-600 dark:text-violet-400 mx-auto mb-3" />
                      <h4 className="font-medium mb-2">Identity Gateway</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Centralized authentication and authorization</p>
                    </div>
                    <div className="text-center p-4 bg-violet-50 dark:bg-violet-950/20 rounded-lg">
                      <Shield className="h-8 w-8 text-violet-600 dark:text-violet-400 mx-auto mb-3" />
                      <h4 className="font-medium mb-2">Security Monitoring</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Real-time threat detection and response</p>
                    </div>
                    <div className="text-center p-4 bg-violet-50 dark:bg-violet-950/20 rounded-lg">
                      <Key className="h-8 w-8 text-violet-600 dark:text-violet-400 mx-auto mb-3" />
                      <h4 className="font-medium mb-2">Key Management</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Enterprise encryption key lifecycle</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </TabsContent>

            {/* Automation */}
            <TabsContent value="automation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Workflow className="h-5 w-5 mr-2 text-violet-600" />
                    Intelligent Workflow Automation
                  </CardTitle>
                  <CardDescription>
                    AI-powered automation reducing manual work and ensuring consistency across enterprise systems
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* AI-Powered Automation */}
                  <div className="border border-violet-200 dark:border-violet-800 rounded-lg p-6 bg-gradient-to-r from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-violet-900 dark:text-violet-100 flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      AI-Powered Process Automation
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded flex items-center justify-center">
                              <Zap className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                            </div>
                            <span className="font-medium">Smart Data Mapping</span>
                          </div>
                          <Badge variant="outline">ML-Powered</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                              <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="font-medium">Pattern Recognition</span>
                          </div>
                          <Badge variant="outline">AI-Driven</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
                              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="font-medium">Predictive Analytics</span>
                          </div>
                          <Badge variant="outline">Forecasting</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-slate-900 dark:text-white">Automation Capabilities:</h5>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          <li>• Automatic architecture compliance validation</li>
                          <li>• Intelligent suggestion of design patterns</li>
                          <li>• Predictive impact analysis for changes</li>
                          <li>• Smart conflict resolution suggestions</li>
                          <li>• Automated documentation generation</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Workflow Automation */}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Enterprise Workflow Automation
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Workflow className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Review Workflows</span>
                          </div>
                          <Badge variant="secondary">Automated</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Architecture review and approval automation</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <GitBranch className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Release Planning</span>
                          </div>
                          <Badge variant="secondary">Smart</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Intelligent sprint and release planning</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Compliance Checks</span>
                          </div>
                          <Badge variant="secondary">Continuous</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Automated compliance and governance validation</p>
                      </div>
                    </div>
                  </div>

                  {/* Integration Metrics */}
                  <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100 flex items-center">
                      <Activity className="h-4 w-4 mr-2" />
                      Integration Performance & Monitoring
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">99.9%</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Integration Uptime</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">&lt;100ms</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Average API Response</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">15+</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Enterprise Integrations</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">24/7</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Monitoring & Support</div>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>

          {/* Next Steps */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowRight className="h-5 w-5 mr-2 text-violet-600 dark:text-violet-400" />
                Implementation Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border border-violet-200 dark:border-violet-800 rounded-lg">
                  <h4 className="font-semibold mb-2 text-violet-900 dark:text-violet-100">Phase 1: Core Integrations</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Establish fundamental enterprise tool connections (Jira, Confluence, Azure DevOps)
                  </p>
                  <Badge variant="secondary">4-6 weeks</Badge>
                </div>
                <div className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">Phase 2: Development Tools</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Implement IDE plugins, version control, and code synchronization
                  </p>
                  <Badge variant="secondary">6-8 weeks</Badge>
                </div>
                <div className="p-4 border border-green-200 dark:border-green-800 rounded-lg">
                  <h4 className="font-semibold mb-2 text-green-900 dark:text-green-100">Phase 3: AI Automation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Deploy intelligent automation and predictive analytics capabilities
                  </p>
                  <Badge variant="secondary">8-12 weeks</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </AppLayout>
  );
}