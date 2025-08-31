import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Settings, 
  Plus, 
  Clock, 
  Building, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  FileText,
  Users,
  BarChart3,
  Database,
  Shield,
  Workflow
} from 'lucide-react';

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const recentTasks = [
    {
      title: "Review Application Portfolio",
      description: "Rate Your Applications Technical Fit",
      type: "Survey",
      timeAgo: "2 days ago",
      priority: "high"
    },
    {
      title: "Business Process Mapping", 
      description: "Document core business workflows",
      type: "Process",
      timeAgo: "5 days ago",
      priority: "medium"
    },
    {
      title: "Technology Roadmap",
      description: "Define future state architecture", 
      type: "Strategy",
      timeAgo: "1 week ago",
      priority: "low"
    }
  ];

  const quickLinks = [
    {
      title: "Create New Model",
      description: "Start a new architecture diagram",
      icon: Plus,
      color: "text-green-600",
      href: "/workspace"
    },
    {
      title: "Application Overview", 
      description: "View all enterprise applications",
      icon: Building,
      color: "text-blue-600",
      href: "/applications"
    },
    {
      title: "Portfolio Analytics",
      description: "Cost analysis and optimization", 
      icon: TrendingUp,
      color: "text-purple-600",
      href: "/analytics"
    },
    {
      title: "Risk Assessment",
      description: "Identify and manage risks",
      icon: AlertTriangle,
      color: "text-red-600", 
      href: "/risk"
    },
    {
      title: "Process Library",
      description: "Reusable business processes",
      icon: Workflow,
      color: "text-orange-600",
      href: "/processes"
    },
    {
      title: "Data Governance",
      description: "Manage data assets and policies",
      icon: Shield,
      color: "text-indigo-600",
      href: "/governance"
    }
  ];

  const recentModels = [
    {
      title: "Customer Onboarding Process",
      description: "BPMN process model",
      type: "Business",
      modified: "2 hours ago",
      collaborators: 3
    },
    {
      title: "Cloud Migration Architecture", 
      description: "AWS infrastructure design",
      type: "Technology",
      modified: "1 day ago",
      collaborators: 5
    },
    {
      title: "Application Portfolio",
      description: "Enterprise application landscape",
      type: "Application", 
      modified: "3 days ago",
      collaborators: 2
    },
    {
      title: "Data Flow Diagram",
      description: "Information architecture mapping",
      type: "Data",
      modified: "1 week ago", 
      collaborators: 4
    }
  ];

  const stats = [
    { label: "Active Models", value: "24", icon: FileText, color: "text-blue-600" },
    { label: "Team Members", value: "12", icon: Users, color: "text-green-600" },
    { label: "Applications", value: "89", icon: Database, color: "text-purple-600" },
    { label: "Processes", value: "156", icon: Workflow, color: "text-orange-600" }
  ];

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-background rounded-sm" />
            </div>
            <h1 className="text-xl font-bold text-foreground">ArchModel Pro</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" data-testid="button-settings">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center">
              <div className="w-8 h-8 bg-background rounded-lg" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">ArchModel Pro Discover</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Enterprise architecture platform for end-to-end design and modeling
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for people, processes, technologies, insights and more"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length > 0) {
                    setIsSearching(true);
                    // Simulate search delay
                    setTimeout(() => {
                      setSearchResults([
                        { type: 'Process', name: 'Customer Onboarding', description: 'End-to-end customer acquisition process', category: 'Business' },
                        { type: 'Application', name: 'Salesforce CRM', description: 'Customer relationship management system', category: 'Technology' },
                        { type: 'Person', name: 'Sarah Chen', description: 'Senior Business Analyst', category: 'People' },
                        { type: 'Risk', name: 'Data Privacy Risk', description: 'GDPR compliance requirements', category: 'Governance' },
                        { type: 'Capability', name: 'Order Management', description: 'Core business capability for processing orders', category: 'Business' }
                      ].filter(item => 
                        item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                        item.description.toLowerCase().includes(e.target.value.toLowerCase())
                      ));
                      setIsSearching(false);
                    }, 300);
                  } else {
                    setSearchResults([]);
                    setIsSearching(false);
                  }
                }}
                className="pl-10 py-6 text-base"
                data-testid="input-global-search"
              />
            </div>
            
            {/* Search Results Dropdown */}
            {(searchQuery.length > 0) && (
              <div className="absolute top-full mt-2 w-full bg-card border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <Search className="h-4 w-4 animate-spin mx-auto mb-2" />
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="p-2">
                    <div className="text-xs text-muted-foreground mb-2 px-2">
                      Found {searchResults.length} results
                    </div>
                    {searchResults.map((result, index) => (
                      <div key={index} className="p-3 hover:bg-accent rounded-md cursor-pointer border-b last:border-b-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{result.type}</Badge>
                              <h4 className="font-medium text-sm">{result.name}</h4>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{result.description}</p>
                          </div>
                          <Badge variant="secondary" className="text-xs ml-2">{result.category}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center space-x-3">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* My Tasks */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                My Tasks ({recentTasks.length})
              </h3>
              <div className="space-y-3">
                {recentTasks.map((task, index) => (
                  <Card key={index} className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{task.type}</Badge>
                          {task.priority === 'high' && (
                            <Badge variant="destructive" className="text-xs">High Priority</Badge>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{task.timeAgo}</span>
                    </div>
                  </Card>
                ))}
                <Button variant="outline" className="w-full" size="sm">
                  Show more tasks
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                {quickLinks.map((link, index) => (
                  <Link key={index} href={link.href}>
                    <Card className="p-4 cursor-pointer hover:bg-accent transition-colors">
                      <div className="flex items-center">
                        <link.icon className={`h-5 w-5 mr-3 ${link.color}`} />
                        <div>
                          <h4 className="font-medium">{link.title}</h4>
                          <p className="text-sm text-muted-foreground">{link.description}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Models */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Recent Models
              </h3>
              <div className="space-y-3">
                {recentModels.map((model, index) => (
                  <Link key={index} href="/workspace">
                    <Card className="p-4 cursor-pointer hover:bg-accent transition-colors" data-testid={`card-recent-model-${index}`}>
                      <div>
                        <h4 className="font-medium">{model.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{model.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant="outline">{model.type}</Badge>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{model.collaborators}</span>
                            <span>•</span>
                            <span>{model.modified}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
                <Button variant="outline" className="w-full" size="sm">
                  View all models
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary" />
              Recent Activity
            </h3>
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm">
                    <span className="font-medium">Sarah Chen</span> updated the Customer Onboarding Process model
                    <span className="text-muted-foreground ml-2">2 hours ago</span>
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm">
                    <span className="font-medium">Mike Rodriguez</span> created a new Cloud Migration Architecture diagram
                    <span className="text-muted-foreground ml-2">1 day ago</span>
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <p className="text-sm">
                    <span className="font-medium">Alex Kim</span> completed the Application Portfolio review
                    <span className="text-muted-foreground ml-2">3 days ago</span>
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-4">
                  View all activity
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;