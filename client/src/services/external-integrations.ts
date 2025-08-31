// External Project Management Tool Integration Service
export interface ExternalProject {
  id: string;
  name: string;
  type: 'program' | 'project' | 'product';
  description?: string;
  businessJustification?: string;
  businessDomain?: string;
  sponsor?: string;
  manager?: string;
  status?: string;
  priority?: string;
  budget?: string;
  timeline?: {
    startDate?: string;
    endDate?: string;
  };
  stakeholders?: string[];
  externalSystemId?: string;
  externalSystemType?: 'jira' | 'azure_devops' | 'aha' | 'monday' | 'asana' | 'confluence';
  lastSynced?: string;
}

export interface ExternalSystemConfig {
  type: 'jira' | 'azure_devops' | 'aha' | 'monday' | 'asana' | 'confluence';
  baseUrl: string;
  apiKey?: string;
  username?: string;
  enabled: boolean;
}

class ExternalIntegrationService {
  private configs: Map<string, ExternalSystemConfig> = new Map();

  // Configure external system connections
  configureSystem(config: ExternalSystemConfig) {
    this.configs.set(config.type, config);
  }

  // Fetch projects from external systems
  async fetchProjectsFromExternal(systemType?: string): Promise<ExternalProject[]> {
    const projects: ExternalProject[] = [];

    // If specific system requested, fetch from that system only
    if (systemType && this.configs.has(systemType)) {
      const config = this.configs.get(systemType)!;
      if (config.enabled) {
        const systemProjects = await this.fetchFromSystem(config);
        projects.push(...systemProjects);
      }
      return projects;
    }

    // Otherwise, fetch from all configured systems
    for (const [type, config] of Array.from(this.configs.entries())) {
      if (config.enabled) {
        try {
          const systemProjects = await this.fetchFromSystem(config);
          projects.push(...systemProjects);
        } catch (error) {
          console.warn(`Failed to fetch from ${type}:`, error);
        }
      }
    }

    return projects;
  }

  private async fetchFromSystem(config: ExternalSystemConfig): Promise<ExternalProject[]> {
    switch (config.type) {
      case 'jira':
        return this.fetchFromJira(config);
      case 'azure_devops':
        return this.fetchFromAzureDevOps(config);
      case 'aha':
        return this.fetchFromAha(config);
      case 'confluence':
        return this.fetchFromConfluence(config);
      default:
        return [];
    }
  }

  private async fetchFromJira(config: ExternalSystemConfig): Promise<ExternalProject[]> {
    // JIRA integration - fetch projects and epics
    try {
      // In a real implementation, this would make API calls to JIRA
      // For now, return sample data structure
      return [
        {
          id: 'JIRA-10001',
          name: 'ARKITEKTON Platform Enhancement',
          type: 'project',
          description: 'Major platform enhancement initiative',
          businessJustification: 'Improve customer satisfaction and reduce support overhead by 40%',
          businessDomain: 'Platform Engineering',
          sponsor: 'VP Engineering',
          manager: 'Sarah Chen',
          status: 'In Progress',
          priority: 'High',
          externalSystemId: 'ARKP-100',
          externalSystemType: 'jira',
          lastSynced: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('JIRA fetch error:', error);
      return [];
    }
  }

  private async fetchFromAzureDevOps(config: ExternalSystemConfig): Promise<ExternalProject[]> {
    // Azure DevOps integration - fetch projects and work items
    try {
      return [
        {
          id: 'ADO-20001',
          name: 'Cloud Migration Program',
          type: 'program',
          description: 'Migrate legacy systems to Azure cloud infrastructure',
          businessJustification: 'Reduce infrastructure costs by 30% and improve scalability',
          businessDomain: 'Infrastructure',
          sponsor: 'CTO',
          status: 'Planning',
          priority: 'Critical',
          externalSystemId: 'CMP-2025',
          externalSystemType: 'azure_devops',
          lastSynced: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Azure DevOps fetch error:', error);
      return [];
    }
  }

  private async fetchFromAha(config: ExternalSystemConfig): Promise<ExternalProject[]> {
    // Aha! product roadmap integration
    try {
      return [
        {
          id: 'AHA-30001',
          name: 'AI-Powered Analytics Suite',
          type: 'product',
          description: 'New AI-driven analytics and insights platform',
          businessJustification: 'Create new revenue stream worth $5M annually and differentiate from competitors',
          businessDomain: 'Product Innovation',
          sponsor: 'Chief Product Officer',
          status: 'Roadmap',
          priority: 'High',
          timeline: {
            startDate: '2025-09-01',
            endDate: '2026-03-31'
          },
          externalSystemId: 'AI-SUITE-2025',
          externalSystemType: 'aha',
          lastSynced: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Aha! fetch error:', error);
      return [];
    }
  }

  private async fetchFromConfluence(config: ExternalSystemConfig): Promise<ExternalProject[]> {
    // Confluence documentation integration
    try {
      return [
        {
          id: 'CONF-40001',
          name: 'Digital Transformation Initiative',
          type: 'program',
          description: 'Organization-wide digital transformation program',
          businessJustification: 'Enable remote work capabilities and improve operational efficiency by 25%',
          businessDomain: 'Digital Strategy',
          sponsor: 'CEO',
          status: 'Active',
          priority: 'Strategic',
          externalSystemId: 'DTI-2025',
          externalSystemType: 'confluence',
          lastSynced: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Confluence fetch error:', error);
      return [];
    }
  }

  // Get project details by ID from any system
  async getProjectDetails(projectId: string): Promise<ExternalProject | null> {
    const allProjects = await this.fetchProjectsFromExternal();
    return allProjects.find(p => p.id === projectId) || null;
  }

  // Search projects across all systems
  async searchProjects(query: string): Promise<ExternalProject[]> {
    const allProjects = await this.fetchProjectsFromExternal();
    const searchTerm = query.toLowerCase();
    
    return allProjects.filter(project =>
      project.name.toLowerCase().includes(searchTerm) ||
      project.type.toLowerCase().includes(searchTerm) ||
      (project.description && project.description.toLowerCase().includes(searchTerm)) ||
      (project.businessDomain && project.businessDomain.toLowerCase().includes(searchTerm))
    );
  }

  // Sync project data and auto-populate business justification
  async syncAndPopulateProject(projectId: string): Promise<{
    businessJustification: string;
    businessDomain: string;
    additionalContext: any;
  } | null> {
    const project = await this.getProjectDetails(projectId);
    if (!project) return null;

    return {
      businessJustification: project.businessJustification || 'Business justification to be determined',
      businessDomain: project.businessDomain || 'Domain not specified',
      additionalContext: {
        sponsor: project.sponsor,
        manager: project.manager,
        status: project.status,
        priority: project.priority,
        timeline: project.timeline,
        externalSystem: project.externalSystemType,
        externalId: project.externalSystemId
      }
    };
  }
}

// Singleton instance
export const externalIntegrationService = new ExternalIntegrationService();

// Initialize with sample configurations
externalIntegrationService.configureSystem({
  type: 'jira',
  baseUrl: 'https://company.atlassian.net',
  enabled: true
});

externalIntegrationService.configureSystem({
  type: 'azure_devops',
  baseUrl: 'https://dev.azure.com/company',
  enabled: true
});

externalIntegrationService.configureSystem({
  type: 'aha',
  baseUrl: 'https://company.aha.io',
  enabled: true
});

externalIntegrationService.configureSystem({
  type: 'confluence',
  baseUrl: 'https://company.atlassian.net/wiki',
  enabled: true
});