/**
 * Seed script for Portfolio Management module
 * Seeds initiatives, applications (if needed), and initiative-application links
 * 
 * Run with: npx tsx scripts/seed-portfolio-data.ts
 */

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from "../shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

const SAMPLE_APPLICATIONS = [
  {
    name: "Customer Portal",
    description: "Self-service customer portal for account management and support",
    type: "web_application",
    status: "active",
    criticality: "high",
    owner: "Digital Experience Team",
    team: "Platform Engineering",
    hostingEnvironment: "aws",
    architecture: "microservices",
  },
  {
    name: "Order Management System",
    description: "Core order processing and fulfillment system",
    type: "web_application",
    status: "active",
    criticality: "critical",
    owner: "Commerce Team",
    team: "Backend Engineering",
    hostingEnvironment: "aws",
    architecture: "monolithic",
  },
  {
    name: "Analytics Dashboard",
    description: "Business intelligence and reporting platform",
    type: "web_application",
    status: "active",
    criticality: "medium",
    owner: "Data Team",
    team: "Analytics Engineering",
    hostingEnvironment: "gcp",
    architecture: "serverless",
  },
  {
    name: "Legacy CRM",
    description: "Customer relationship management system (scheduled for replacement)",
    type: "saas_tool",
    status: "deprecated",
    criticality: "high",
    owner: "Sales Operations",
    team: "IT Operations",
    hostingEnvironment: "on_premise",
    architecture: "monolithic",
  },
  {
    name: "Payment Gateway",
    description: "Secure payment processing integration service",
    type: "api_service",
    status: "active",
    criticality: "critical",
    owner: "Payments Team",
    team: "Platform Engineering",
    hostingEnvironment: "aws",
    architecture: "microservices",
  },
  {
    name: "Mobile App (iOS/Android)",
    description: "Native mobile application for customers",
    type: "mobile_app",
    status: "active",
    criticality: "high",
    owner: "Mobile Team",
    team: "Mobile Engineering",
    hostingEnvironment: "aws",
    architecture: "microservices",
  },
  {
    name: "Data Warehouse",
    description: "Enterprise data warehouse for analytics and reporting",
    type: "database",
    status: "active",
    criticality: "high",
    owner: "Data Platform",
    team: "Data Engineering",
    hostingEnvironment: "gcp",
    architecture: "event_driven",
  },
  {
    name: "Identity Service",
    description: "Authentication and authorization service",
    type: "api_service",
    status: "active",
    criticality: "critical",
    owner: "Security Team",
    team: "Platform Engineering",
    hostingEnvironment: "aws",
    architecture: "microservices",
  },
];

const SAMPLE_INITIATIVES = [
  {
    name: "Customer Experience Platform Modernization",
    description: "Modernize customer-facing platforms to improve user experience and operational efficiency. Replace legacy systems with modern, cloud-native architecture.",
    status: "in_progress",
    priority: "critical",
    healthStatus: "green",
    riskLevel: "medium",
    type: "digital_transformation",
    sponsor: "Sarah Chen, Chief Digital Officer",
    programManager: "Michael Torres",
    stakeholders: ["Customer Success", "Engineering", "Product", "Marketing"],
    startDate: "2024-06-01",
    targetDate: "2024-12-31",
    budget: 2500000,
    spentBudget: 1200000,
    businessValue: 15000000,
    progressPercent: 65,
    capabilities: ["Customer Experience Management", "Digital Commerce"],
    milestones: [
      { name: "Requirements Analysis", targetDate: "2024-07-15", status: "completed" as const },
      { name: "Platform Selection", targetDate: "2024-08-30", status: "completed" as const },
      { name: "MVP Development", targetDate: "2024-10-15", status: "in_progress" as const },
      { name: "User Testing", targetDate: "2024-11-30", status: "not_started" as const },
      { name: "Production Rollout", targetDate: "2024-12-31", status: "not_started" as const },
    ],
    kpis: [
      { name: "Customer Satisfaction", target: 90, current: 82, unit: "%" },
      { name: "Page Load Time", target: 2, current: 3.2, unit: "sec" },
      { name: "Conversion Rate", target: 8.5, current: 6.2, unit: "%" },
    ],
    tags: ["customer", "modernization", "experience"],
  },
  {
    name: "Data Analytics Platform Consolidation",
    description: "Consolidate multiple analytics platforms into unified data lakehouse architecture for improved data governance and reduced operational costs.",
    status: "planning",
    priority: "high",
    healthStatus: "yellow",
    riskLevel: "high",
    type: "technology_modernization",
    sponsor: "Elena Rodriguez, VP Data",
    programManager: "David Kim",
    stakeholders: ["Data Engineering", "Analytics", "Business Intelligence", "Finance"],
    startDate: "2024-09-01",
    targetDate: "2025-03-31",
    budget: 1800000,
    spentBudget: 150000,
    businessValue: 8500000,
    progressPercent: 15,
    capabilities: ["Data Analytics & Intelligence"],
    milestones: [
      { name: "Current State Assessment", targetDate: "2024-09-30", status: "in_progress" as const },
      { name: "Target Architecture Design", targetDate: "2024-10-31", status: "not_started" as const },
      { name: "Migration Planning", targetDate: "2024-11-30", status: "not_started" as const },
      { name: "Platform Implementation", targetDate: "2025-02-28", status: "not_started" as const },
      { name: "Data Migration", targetDate: "2025-03-31", status: "not_started" as const },
    ],
    kpis: [
      { name: "Data Processing Speed", target: 10, current: 3, unit: "x faster" },
      { name: "Operational Cost Reduction", target: 40, current: 0, unit: "%" },
      { name: "Self-Service Analytics", target: 80, current: 35, unit: "%" },
    ],
    tags: ["data", "analytics", "consolidation"],
  },
  {
    name: "Zero Trust Security Implementation",
    description: "Implement comprehensive zero trust security architecture across all systems to enhance security posture and compliance.",
    status: "in_progress",
    priority: "critical",
    healthStatus: "yellow",
    riskLevel: "high",
    type: "infrastructure_upgrade",
    sponsor: "James Wilson, CISO",
    programManager: "Lisa Wang",
    stakeholders: ["Security", "IT Operations", "Compliance", "All Departments"],
    startDate: "2024-07-01",
    targetDate: "2025-01-31",
    budget: 3200000,
    spentBudget: 1600000,
    businessValue: 12000000,
    progressPercent: 45,
    capabilities: ["Cybersecurity & Risk Management", "Cloud Infrastructure Management"],
    milestones: [
      { name: "Security Assessment", targetDate: "2024-08-15", status: "completed" as const },
      { name: "Identity Management Rollout", targetDate: "2024-10-31", status: "in_progress" as const },
      { name: "Network Segmentation", targetDate: "2024-12-15", status: "at_risk" as const },
      { name: "Endpoint Protection", targetDate: "2025-01-15", status: "not_started" as const },
      { name: "Compliance Validation", targetDate: "2025-01-31", status: "not_started" as const },
    ],
    kpis: [
      { name: "Security Incidents", target: 5, current: 12, unit: "per month" },
      { name: "Compliance Score", target: 95, current: 78, unit: "%" },
      { name: "Mean Time to Detect", target: 15, current: 45, unit: "minutes" },
    ],
    tags: ["security", "zero-trust", "compliance"],
  },
  {
    name: "Agile Transformation Program",
    description: "Transform development practices to agile methodologies across all teams to improve velocity and product quality.",
    status: "completed",
    priority: "medium",
    healthStatus: "green",
    riskLevel: "low",
    type: "organizational_change",
    sponsor: "David Kim, VP Engineering",
    programManager: "Sarah Chen",
    stakeholders: ["Development", "Product", "QA", "Project Management"],
    startDate: "2024-01-01",
    targetDate: "2024-06-30",
    actualEndDate: "2024-06-15",
    budget: 500000,
    spentBudget: 480000,
    businessValue: 3200000,
    progressPercent: 100,
    capabilities: [],
    milestones: [
      { name: "Training Program", targetDate: "2024-02-29", status: "completed" as const },
      { name: "Pilot Team Implementation", targetDate: "2024-04-15", status: "completed" as const },
      { name: "Organization Rollout", targetDate: "2024-06-15", status: "completed" as const },
      { name: "Process Optimization", targetDate: "2024-06-30", status: "completed" as const },
    ],
    kpis: [
      { name: "Development Velocity", target: 30, current: 35, unit: "% increase" },
      { name: "Code Quality Score", target: 85, current: 88, unit: "%" },
      { name: "Time to Market", target: 25, current: 30, unit: "% reduction" },
    ],
    tags: ["agile", "transformation", "methodology"],
  },
  {
    name: "CRM System Replacement",
    description: "Replace legacy CRM with modern cloud-based solution to improve sales efficiency and customer data management.",
    status: "planning",
    priority: "high",
    healthStatus: "green",
    riskLevel: "medium",
    type: "technology_modernization",
    sponsor: "Amanda Foster, VP Sales",
    programManager: "Robert Chen",
    stakeholders: ["Sales", "Marketing", "Customer Success", "IT"],
    startDate: "2025-01-15",
    targetDate: "2025-09-30",
    budget: 1200000,
    spentBudget: 50000,
    businessValue: 5000000,
    progressPercent: 5,
    capabilities: ["Customer Relationship Management", "Sales Automation"],
    milestones: [
      { name: "Vendor Selection", targetDate: "2025-02-28", status: "not_started" as const },
      { name: "Data Migration Planning", targetDate: "2025-04-15", status: "not_started" as const },
      { name: "Integration Development", targetDate: "2025-06-30", status: "not_started" as const },
      { name: "User Training", targetDate: "2025-08-31", status: "not_started" as const },
      { name: "Go-Live", targetDate: "2025-09-30", status: "not_started" as const },
    ],
    kpis: [
      { name: "Sales Cycle Time", target: 20, current: 0, unit: "% reduction" },
      { name: "Lead Conversion Rate", target: 15, current: 10, unit: "%" },
      { name: "Data Accuracy", target: 98, current: 75, unit: "%" },
    ],
    tags: ["crm", "sales", "modernization"],
  },
];

// Mapping of initiative index to application names for creating links
const INITIATIVE_APP_LINKS = [
  { initiativeIdx: 0, appNames: ["Customer Portal", "Mobile App (iOS/Android)", "Order Management System"], impactType: "modernized" as const },
  { initiativeIdx: 1, appNames: ["Analytics Dashboard", "Data Warehouse"], impactType: "modernized" as const },
  { initiativeIdx: 2, appNames: ["Identity Service", "Customer Portal", "Payment Gateway", "Order Management System"], impactType: "impacted" as const },
  { initiativeIdx: 4, appNames: ["Legacy CRM"], impactType: "replaced" as const },
];

async function seedPortfolioData() {
  console.log("🌱 Seeding Portfolio Management data...\n");

  try {
    // Check and seed applications
    const existingApps = await db.select().from(schema.applications);
    let applicationMap = new Map<string, string>();
    
    if (existingApps.length === 0) {
      console.log("📦 Seeding applications...");
      for (const app of SAMPLE_APPLICATIONS) {
        const [created] = await db.insert(schema.applications).values(app).returning();
        applicationMap.set(app.name, created.id);
        console.log(`  ✓ Created application: ${app.name}`);
      }
    } else {
      console.log(`📦 Found ${existingApps.length} existing applications, skipping app seed.`);
      existingApps.forEach(app => applicationMap.set(app.name, app.id));
    }

    // Seed initiatives
    const existingInitiatives = await db.select().from(schema.initiatives);
    let initiativeIds: string[] = [];
    
    if (existingInitiatives.length === 0) {
      console.log("\n📋 Seeding initiatives...");
      for (const initiative of SAMPLE_INITIATIVES) {
        const [created] = await db.insert(schema.initiatives).values(initiative).returning();
        initiativeIds.push(created.id);
        console.log(`  ✓ Created initiative: ${initiative.name}`);
      }
    } else {
      console.log(`\n📋 Found ${existingInitiatives.length} existing initiatives, skipping initiative seed.`);
      initiativeIds = existingInitiatives.map(i => i.id);
    }

    // Seed initiative-application links
    const existingLinks = await db.select().from(schema.initiativeApplicationLinks);
    
    if (existingLinks.length === 0 && initiativeIds.length > 0) {
      console.log("\n🔗 Seeding initiative-application links...");
      for (const linkDef of INITIATIVE_APP_LINKS) {
        const initiativeId = initiativeIds[linkDef.initiativeIdx];
        if (!initiativeId) continue;

        for (const appName of linkDef.appNames) {
          const appId = applicationMap.get(appName);
          if (!appId) {
            console.log(`  ⚠ Application not found: ${appName}`);
            continue;
          }

          await db.insert(schema.initiativeApplicationLinks).values({
            initiativeId,
            applicationId: appId,
            impactType: linkDef.impactType,
            notes: `${appName} is ${linkDef.impactType} by this initiative`,
          });
          console.log(`  ✓ Linked: Initiative ${linkDef.initiativeIdx + 1} → ${appName} (${linkDef.impactType})`);
        }
      }
    } else if (existingLinks.length > 0) {
      console.log(`\n🔗 Found ${existingLinks.length} existing links, skipping link seed.`);
    }

    console.log("\n✅ Portfolio data seeding complete!");
    console.log(`   Applications: ${applicationMap.size}`);
    console.log(`   Initiatives: ${initiativeIds.length}`);
    
  } catch (error) {
    console.error("❌ Error seeding portfolio data:", error);
    throw error;
  }
}

// Run the seed
seedPortfolioData()
  .then(() => pool.end())
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    pool.end();
    process.exit(1);
  });

