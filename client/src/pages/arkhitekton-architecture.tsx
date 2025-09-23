import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Cloud, 
  Server, 
  Database, 
  Shield, 
  Zap, 
  Globe,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  Lock
} from "lucide-react";

interface CloudProvider {
  id: string;
  name: string;
  tagline: string;
  description: string;
  strengths: string[];
  services: {
    compute: string;
    storage: string;
    database: string;
    ai: string;
    networking: string;
    security: string;
  };
  pricing: {
    model: string;
    benefits: string[];
  };
  enterprise: {
    compliance: string[];
    support: string;
  };
  color: {
    primary: string;
    secondary: string;
    accent: string;
  };
  icon: {
    bg: string;
    text: string;
  };
}

const cloudProviders: CloudProvider[] = [
  {
    id: "aws",
    name: "Amazon Web Services",
    tagline: "Most Comprehensive & Mature Platform",
    description: "AWS provides the most extensive set of cloud services with enterprise-grade reliability, making it ideal for complex enterprise architecture implementations with maximum flexibility and control.",
    strengths: [
      "Largest service ecosystem (200+ services)",
      "Most mature enterprise features",
      "Global infrastructure (99 regions)",
      "Advanced security & compliance tools",
      "Extensive third-party integrations"
    ],
    services: {
      compute: "ECS Fargate, Lambda, EC2",
      storage: "S3, EFS, FSx",
      database: "RDS PostgreSQL, DynamoDB, Aurora",
      ai: "Bedrock (Anthropic Claude), SageMaker",
      networking: "CloudFront, ALB, VPC",
      security: "IAM, WAF, Shield, Secrets Manager"
    },
    pricing: {
      model: "Pay-as-you-scale",
      benefits: [
        "Reserved instances up to 75% savings",
        "Spot instances for batch workloads",
        "Free tier for development"
      ]
    },
    enterprise: {
      compliance: ["SOC 2", "ISO 27001", "FedRAMP", "HIPAA", "PCI DSS"],
      support: "24/7 Enterprise Support with TAM"
    },
    color: {
      primary: "from-orange-500 to-amber-600",
      secondary: "bg-orange-50 dark:bg-orange-950/20",
      accent: "text-orange-600 dark:text-orange-400"
    },
    icon: {
      bg: "bg-orange-100 dark:bg-orange-900/30",
      text: "text-orange-600 dark:text-orange-400"
    }
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    tagline: "Best Enterprise Integration & Hybrid Cloud",
    description: "Azure excels in enterprise environments with seamless Microsoft ecosystem integration, advanced hybrid cloud capabilities, and enterprise-first design patterns for large organizations.",
    strengths: [
      "Deep Microsoft ecosystem integration",
      "Superior hybrid & multi-cloud support",
      "Enterprise-first security model",
      "Advanced Active Directory integration",
      "Strong compliance & governance tools"
    ],
    services: {
      compute: "Container Apps, Functions, AKS",
      storage: "Blob Storage, Files, Data Lake",
      database: "PostgreSQL, Cosmos DB, SQL Database",
      ai: "Azure OpenAI Service, Cognitive Services",
      networking: "Front Door, Load Balancer, Virtual Network",
      security: "Azure AD, Key Vault, Security Center"
    },
    pricing: {
      model: "Hybrid savings focus",
      benefits: [
        "Azure Hybrid Benefit for existing licenses",
        "Reserved instances with flexibility",
        "Dev/Test pricing for non-production"
      ]
    },
    enterprise: {
      compliance: ["SOC 1/2/3", "ISO 27001", "GDPR", "HIPAA", "FedRAMP High"],
      support: "Premier Support with dedicated CSM"
    },
    color: {
      primary: "from-blue-500 to-indigo-600",
      secondary: "bg-blue-50 dark:bg-blue-950/20",
      accent: "text-blue-600 dark:text-blue-400"
    },
    icon: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-600 dark:text-blue-400"
    }
  },
  {
    id: "gcp",
    name: "Google Cloud Platform",
    tagline: "Leading AI/ML & Data Analytics Platform",
    description: "GCP offers cutting-edge AI/ML capabilities, superior data analytics, and Google-grade infrastructure with a focus on innovation, developer experience, and intelligent automation.",
    strengths: [
      "Industry-leading AI/ML services",
      "Advanced data analytics & BigQuery",
      "Superior Kubernetes (GKE) support", 
      "Google-grade global infrastructure",
      "Innovative developer tools & APIs"
    ],
    services: {
      compute: "Cloud Run, Functions, GKE",
      storage: "Cloud Storage, Filestore, Persistent Disk",
      database: "Cloud SQL, Firestore, Spanner",
      ai: "Vertex AI, Anthropic on Model Garden",
      networking: "Cloud CDN, Load Balancing, VPC",
      security: "Cloud IAM, Secret Manager, Security Command Center"
    },
    pricing: {
      model: "Innovation-focused",
      benefits: [
        "Sustained use discounts (automatic)",
        "Preemptible instances up to 80% savings",
        "Per-second billing granularity"
      ]
    },
    enterprise: {
      compliance: ["SOC 1/2/3", "ISO 27001", "PCI DSS", "HIPAA", "FedRAMP Moderate"],
      support: "Premium Support with Customer Engineer"
    },
    color: {
      primary: "from-green-500 to-emerald-600",
      secondary: "bg-green-50 dark:bg-green-950/20",
      accent: "text-green-600 dark:text-green-400"
    },
    icon: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-600 dark:text-green-400"
    }
  }
];

export default function ArkhitektonArchitecture() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/20">
        {/* Hero Section */}
        <div className="relative overflow-hidden py-16">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 dark:from-blue-400/5 dark:via-indigo-400/5 dark:to-purple-400/5"></div>
          
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                  <Cloud className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                ARKHITEKTON
              </h1>
              <h2 className="text-3xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
                Enterprise Architecture Platform
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
                Comprehensive technical architecture designs for deploying ARKHITEKTON across leading cloud platforms. 
                Choose your preferred infrastructure approach for maximum enterprise scalability and performance.
              </p>
            </div>

            {/* Platform Comparison Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Server className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Enterprise Scale</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Production-ready architectures supporting 10,000+ concurrent users</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Security First</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Zero-trust architecture with enterprise compliance standards</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">AI-Powered</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Integrated AI services for intelligent architecture assistance</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Cloud Provider Options */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
              Choose Your Cloud Architecture
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Each platform offers unique advantages for enterprise architecture deployment. 
              Select your preferred cloud provider to explore the detailed technical design.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {cloudProviders.map((provider) => (
              <Card 
                key={provider.id}
                className={`group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2 ${
                  selectedProvider === provider.id 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/25' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
                data-testid={`cloud-provider-${provider.id}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${provider.color.primary} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${provider.icon.bg}`}>
                      <Cloud className={`h-8 w-8 ${provider.icon.text}`} />
                    </div>
                    <Badge variant="outline" className={provider.color.accent}>
                      Enterprise Ready
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-xl mb-2 text-slate-900 dark:text-white">
                    {provider.name}
                  </CardTitle>
                  <CardDescription className={`text-base font-medium ${provider.color.accent}`}>
                    {provider.tagline}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative space-y-6">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {provider.description}
                  </p>

                  {/* Key Strengths */}
                  <div>
                    <h4 className="font-semibold mb-3 text-slate-900 dark:text-white flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      Key Strengths
                    </h4>
                    <ul className="space-y-2">
                      {provider.strengths.slice(0, 3).map((strength, index) => (
                        <li key={index} className="text-sm text-slate-600 dark:text-slate-300 flex items-start">
                          <div className="w-1 h-1 rounded-full bg-slate-400 mt-2 mr-3 flex-shrink-0"></div>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Core Services Preview */}
                  <div>
                    <h4 className="font-semibold mb-3 text-slate-900 dark:text-white flex items-center">
                      <Server className="h-4 w-4 mr-2 text-blue-500" />
                      Core Services
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className={`p-2 rounded ${provider.color.secondary}`}>
                        <div className="font-medium text-slate-700 dark:text-slate-300">Compute</div>
                        <div className="text-slate-500 dark:text-slate-400">{provider.services.compute.split(',')[0]}</div>
                      </div>
                      <div className={`p-2 rounded ${provider.color.secondary}`}>
                        <div className="font-medium text-slate-700 dark:text-slate-300">AI/ML</div>
                        <div className="text-slate-500 dark:text-slate-400">{provider.services.ai.split(',')[0]}</div>
                      </div>
                    </div>
                  </div>

                  {/* Enterprise Features */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Lock className="h-3 w-3 mr-1 text-green-500" />
                        <span className="text-slate-600 dark:text-slate-400">SOC 2</span>
                      </div>
                      <div className="flex items-center">
                        <Globe className="h-3 w-3 mr-1 text-blue-500" />
                        <span className="text-slate-600 dark:text-slate-400">Global</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <Button
                      variant={selectedProvider === provider.id ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedProvider(provider.id)}
                      data-testid={`select-${provider.id}`}
                    >
                      {selectedProvider === provider.id ? 'Selected' : 'Select Option'}
                    </Button>
                    
                    <Link href={`/arkhitekton-architecture/${provider.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 font-medium"
                        data-testid={`view-details-${provider.id}`}
                      >
                        View Option Details
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selection Summary */}
          {selectedProvider && (
            <div className="mt-12 text-center">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white">
                    {cloudProviders.find(p => p.id === selectedProvider)?.name}
                  </strong> selected as your preferred architecture platform
                </span>
              </div>
            </div>
          )}

          {/* Architecture Showcase CTA */}
          <div className="mt-16 text-center">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                Ready to Explore Detailed Architectures?
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Each cloud provider option includes comprehensive technical diagrams, component specifications, 
                data flow architectures, security models, and deployment strategies specifically designed for 
                enterprise-scale architecture platforms.
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Scalable to 10,000+ Users
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Multi-tenant Architecture
                </div>
                <div className="flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  High-availability Data Layer
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}