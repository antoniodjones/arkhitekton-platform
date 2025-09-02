import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  CheckCircle2, 
  Circle, 
  Brain, 
  Palette, 
  Link2, 
  Sparkles,
  Trophy,
  Rocket,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'wouter';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'foundation' | 'ai' | 'modeling' | 'integration' | 'ux';
}

export default function PlanPage() {
  const [tasks, setTasks] = useState<Task[]>([
    // Foundation Phase (Current)
    { 
      id: 'f1', 
      title: 'Core Application Structure', 
      description: 'React/TypeScript foundation with modern tooling',
      completed: true, 
      priority: 'high', 
      category: 'foundation' 
    },
    { 
      id: 'f2', 
      title: 'Orange Theme Implementation', 
      description: 'Warm orange architectural palette throughout UI',
      completed: true, 
      priority: 'high', 
      category: 'foundation' 
    },
    { 
      id: 'f3', 
      title: 'Navigation & Dashboard Framework', 
      description: 'Responsive sidebar navigation and dashboard layout',
      completed: true, 
      priority: 'high', 
      category: 'foundation' 
    },
    { 
      id: 'f4', 
      title: 'Apple-Style Theme Switcher', 
      description: 'Light/Dark/Auto mode switcher with system detection',
      completed: true, 
      priority: 'medium', 
      category: 'foundation' 
    },
    { 
      id: 'f5', 
      title: 'Basic Governance System', 
      description: 'Ticket system with JIRA-like functionality',
      completed: true, 
      priority: 'medium', 
      category: 'foundation' 
    },
    { 
      id: 'f6', 
      title: 'Logo Design Selection', 
      description: 'Choose final ARKHITEKTON visual identity',
      completed: false, 
      priority: 'medium', 
      category: 'foundation' 
    },
    { 
      id: 'f7', 
      title: 'Advanced Typography', 
      description: 'Implement geometric font system matching design vision',
      completed: false, 
      priority: 'low', 
      category: 'foundation' 
    },
    
    // Core Modeling Engine
    { 
      id: 'm1', 
      title: 'Visual Canvas Implementation', 
      description: 'Infinite canvas with smooth zooming/panning',
      completed: false, 
      priority: 'high', 
      category: 'modeling' 
    },
    { 
      id: 'm2', 
      title: 'Component Palette', 
      description: 'AWS, Azure, GCP, Oracle Cloud architecture elements',
      completed: false, 
      priority: 'high', 
      category: 'modeling' 
    },
    { 
      id: 'm3', 
      title: 'Drag-Drop Functionality', 
      description: 'Intuitive drag-drop with magnetic snap-to-grid',
      completed: false, 
      priority: 'high', 
      category: 'modeling' 
    },
    { 
      id: 'm4', 
      title: 'Object Relationship System', 
      description: 'Intelligent connections between architectural components',
      completed: false, 
      priority: 'high', 
      category: 'modeling' 
    },
    
    // AI Intelligence Layer
    { 
      id: 'ai1', 
      title: 'Smart Recommendation Engine', 
      description: 'AI-powered architecture suggestions and best practices',
      completed: false, 
      priority: 'high', 
      category: 'ai' 
    },
    { 
      id: 'ai2', 
      title: 'Intelligent Change Detection', 
      description: 'Automatic monitoring of architecture changes and impacts',
      completed: false, 
      priority: 'high', 
      category: 'ai' 
    },
    { 
      id: 'ai3', 
      title: 'Pattern Recognition System', 
      description: 'AI detection of architectural patterns and anti-patterns',
      completed: false, 
      priority: 'medium', 
      category: 'ai' 
    },
    { 
      id: 'ai4', 
      title: 'Natural Language Queries', 
      description: 'Ask architecture questions in plain English',
      completed: false, 
      priority: 'medium', 
      category: 'ai' 
    },
    
    // Integration Ecosystem
    { 
      id: 'i1', 
      title: 'Enterprise Tool Connectors', 
      description: 'Jira, Confluence, Azure DevOps integration',
      completed: false, 
      priority: 'medium', 
      category: 'integration' 
    },
    { 
      id: 'i2', 
      title: 'Code Editor Plugins', 
      description: 'VS Code, IntelliJ extensions for bi-directional sync',
      completed: false, 
      priority: 'medium', 
      category: 'integration' 
    },
    { 
      id: 'i3', 
      title: 'API Gateway', 
      description: 'RESTful APIs for third-party integrations',
      completed: false, 
      priority: 'low', 
      category: 'integration' 
    },
    
    // UX Excellence
    { 
      id: 'ux1', 
      title: 'Performance Optimization', 
      description: 'Sub-100ms response times and 60fps animations',
      completed: false, 
      priority: 'high', 
      category: 'ux' 
    },
    { 
      id: 'ux2', 
      title: 'Real-Time Collaboration', 
      description: 'Multi-user editing with live cursors and presence',
      completed: false, 
      priority: 'high', 
      category: 'ux' 
    },
    { 
      id: 'ux3', 
      title: 'Advanced Search & Discovery', 
      description: 'Global semantic search across all models',
      completed: false, 
      priority: 'medium', 
      category: 'ux' 
    }
  ]);

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const getCompletionStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = Math.round((completed / total) * 100);
    return { total, completed, percentage };
  };

  const getTasksByCategory = (category: Task['category']) => {
    return tasks.filter(task => task.category === category);
  };

  const getCategoryIcon = (category: Task['category']) => {
    switch (category) {
      case 'foundation': return Rocket;
      case 'ai': return Brain;
      case 'modeling': return Palette;
      case 'integration': return Link2;
      case 'ux': return Sparkles;
      default: return Circle;
    }
  };

  const getCategoryColor = (category: Task['category']) => {
    switch (category) {
      case 'foundation': return 'bg-orange-500';
      case 'ai': return 'bg-purple-500';
      case 'modeling': return 'bg-blue-500';
      case 'integration': return 'bg-green-500';
      case 'ux': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const stats = getCompletionStats();

  return (
    <div className="flex-1 space-y-8 p-8" data-testid="plan-page">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="back-to-dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">ARKHITEKTON Development Plan</h1>
            <p className="text-muted-foreground mt-1">
              Building the ultimate enterprise architecture platform - advanced, elegant, and simple
            </p>
          </div>
        </div>
        
        {/* Vision Statement */}
        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-orange-800 dark:text-orange-200">
              <Trophy className="w-6 h-6" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700 dark:text-orange-300 leading-relaxed">
              Build ARKHITEKTON to be so <strong>advanced, elegant, and simple</strong> that every other enterprise 
              architecture tool becomes obsolete. We're not just building software - we're creating the future of 
              how architects design, collaborate, and transform complex systems into understandable excellence.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-orange-600 dark:text-orange-400">
              <Zap className="w-4 h-4" />
              <span>Making enterprise architecture tools that architects actually love to use</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Progress Overview */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Overall Progress</CardTitle>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {stats.completed} / {stats.total} Complete
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress value={stats.percentage} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{stats.percentage}% Complete</span>
                <span>Making every other EA tool obsolete</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Categories */}
      <Tabs defaultValue="foundation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="foundation" className="flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            Foundation
          </TabsTrigger>
          <TabsTrigger value="modeling" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Modeling
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Intelligence
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            Integration
          </TabsTrigger>
          <TabsTrigger value="ux" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            UX Excellence
          </TabsTrigger>
        </TabsList>

        {(['foundation', 'modeling', 'ai', 'integration', 'ux'] as const).map(category => {
          const categoryTasks = getTasksByCategory(category);
          const categoryCompleted = categoryTasks.filter(t => t.completed).length;
          const categoryProgress = Math.round((categoryCompleted / categoryTasks.length) * 100);
          
          return (
            <TabsContent key={category} value={category} className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 capitalize">
                      {(() => {
                        const IconComponent = getCategoryIcon(category);
                        return <IconComponent className="w-5 h-5" />;
                      })()}
                      {category === 'ai' ? 'AI Intelligence Layer' : 
                       category === 'ux' ? 'UX Excellence' : 
                       category.charAt(0).toUpperCase() + category.slice(1)} Phase
                    </CardTitle>
                    <Badge variant="outline">
                      {categoryCompleted} / {categoryTasks.length} Complete
                    </Badge>
                  </div>
                  <Progress value={categoryProgress} className="h-2 mt-2" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {categoryTasks.map(task => (
                    <div 
                      key={task.id} 
                      className="flex items-start gap-3 p-3 rounded-lg border transition-colors hover:bg-accent/50"
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="mt-1"
                        data-testid={`task-checkbox-${task.id}`}
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {task.title}
                          </h4>
                          <Badge 
                            variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                          {task.description}
                        </p>
                      </div>
                      {task.completed && (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

    </div>
  );
}