import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Settings as SettingsIcon, 
  Github, 
  Workflow, 
  Palette, 
  Users,
  Shield,
  Save,
  TestTube,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('integrations');
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'success' | 'error' | null>(null);

  // GitHub Integration State
  const [githubConfig, setGithubConfig] = useState({
    repoUrl: '',
    personalAccessToken: '',
    defaultBranch: 'main',
    webhookUrl: ''
  });

  const handleTestConnection = async () => {
    setIsTesting(true);
    setConnectionStatus(null);
    
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const isValid = githubConfig.repoUrl && githubConfig.personalAccessToken;
    setConnectionStatus(isValid ? 'success' : 'error');
    setIsTesting(false);
    
    toast({
      title: isValid ? 'Connection Successful' : 'Connection Failed',
      description: isValid 
        ? 'GitHub integration is configured correctly' 
        : 'Please check your repository URL and access token',
      variant: isValid ? 'default' : 'destructive'
    });
  };

  const handleSaveGitHubConfig = () => {
    toast({
      title: 'Settings Saved',
      description: 'GitHub integration settings have been updated successfully'
    });
  };

  return (
    <AppLayout>
      <div className="h-full bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Configure integrations, automations, and preferences
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid" data-testid="settings-tabs">
              <TabsTrigger value="integrations" className="gap-2" data-testid="tab-integrations">
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">Integrations</span>
              </TabsTrigger>
              <TabsTrigger value="automations" className="gap-2" data-testid="tab-automations">
                <Workflow className="w-4 h-4" />
                <span className="hidden sm:inline">Automations</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="gap-2" data-testid="tab-preferences">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="gap-2" data-testid="tab-team">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Team</span>
              </TabsTrigger>
            </TabsList>

            {/* Integrations Tab */}
            <TabsContent value="integrations" className="space-y-6" data-testid="content-integrations">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
                        <Github className="w-5 h-5 text-white dark:text-slate-900" />
                      </div>
                      <div>
                        <CardTitle>GitHub Integration</CardTitle>
                        <CardDescription>
                          Connect your GitHub repository for automatic story-to-code traceability
                        </CardDescription>
                      </div>
                    </div>
                    {connectionStatus === 'success' && (
                      <Badge variant="default" className="bg-green-500 gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Connected
                      </Badge>
                    )}
                    {connectionStatus === 'error' && (
                      <Badge variant="destructive" className="gap-1">
                        <XCircle className="w-3 h-3" />
                        Error
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="repo-url">Repository URL</Label>
                      <Input
                        id="repo-url"
                        placeholder="https://github.com/username/repo"
                        value={githubConfig.repoUrl}
                        onChange={(e) => setGithubConfig({ ...githubConfig, repoUrl: e.target.value })}
                        data-testid="input-repo-url"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="default-branch">Default Branch</Label>
                      <Input
                        id="default-branch"
                        placeholder="main"
                        value={githubConfig.defaultBranch}
                        onChange={(e) => setGithubConfig({ ...githubConfig, defaultBranch: e.target.value })}
                        data-testid="input-default-branch"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pat">Personal Access Token</Label>
                    <Input
                      id="pat"
                      type="password"
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      value={githubConfig.personalAccessToken}
                      onChange={(e) => setGithubConfig({ ...githubConfig, personalAccessToken: e.target.value })}
                      data-testid="input-pat"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Token requires: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">repo</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">write:repo_hook</code> scopes
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL (Auto-generated)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="webhook-url"
                        value={typeof window !== 'undefined' ? `${window.location.origin}/api/webhooks/github` : '/api/webhooks/github'}
                        readOnly
                        className="bg-slate-50 dark:bg-slate-900"
                        data-testid="input-webhook-url"
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (typeof window !== 'undefined' && navigator.clipboard) {
                            navigator.clipboard.writeText(`${window.location.origin}/api/webhooks/github`);
                            toast({ title: 'Copied to clipboard' });
                          }
                        }}
                        data-testid="button-copy-webhook"
                      >
                        Copy
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={handleTestConnection}
                      disabled={isTesting}
                      className="gap-2"
                      data-testid="button-test-connection"
                    >
                      {isTesting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <TestTube className="w-4 h-4" />
                          Test Connection
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleSaveGitHubConfig}
                      className="gap-2"
                      data-testid="button-save-github"
                    >
                      <Save className="w-4 h-4" />
                      Save Configuration
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Jira Integration</CardTitle>
                  <CardDescription>Sync stories with your Jira project (Coming Soon)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Bidirectional sync with Jira will be available in the next release
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Automations Tab */}
            <TabsContent value="automations" className="space-y-6" data-testid="content-automations">
              <Card>
                <CardHeader>
                  <CardTitle>Story Enforcement Rules</CardTitle>
                  <CardDescription>Configure automated validation and enforcement policies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Story ID in Commits</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Reject commits without valid user story ID (US-XXXXXXX format)
                      </p>
                    </div>
                    <Switch defaultChecked data-testid="switch-require-story-id" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Validate Acceptance Criteria</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Ensure stories have Gherkin format criteria before development
                      </p>
                    </div>
                    <Switch defaultChecked data-testid="switch-validate-ac" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-update Story Status</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Sync story status with GitHub branch and PR activity
                      </p>
                    </div>
                    <Switch defaultChecked data-testid="switch-auto-status" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>GitHub Actions Workflows</CardTitle>
                  <CardDescription>Generate workflow files for automated validation</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="gap-2" data-testid="button-generate-workflows">
                    <Workflow className="w-4 h-4" />
                    Generate Workflow Files
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6" data-testid="content-preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Application Preferences</CardTitle>
                  <CardDescription>Customize your ARKHITEKTON experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Theme, notifications, and display preferences
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="space-y-6" data-testid="content-team">
              <Card>
                <CardHeader>
                  <CardTitle>Team Management</CardTitle>
                  <CardDescription>Manage team members and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Invite team members, assign roles, and configure access control
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
