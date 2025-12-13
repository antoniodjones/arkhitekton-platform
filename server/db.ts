import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  const isDev = process.env.NODE_ENV === 'development';
  const helpMessage = isDev
    ? `
╔══════════════════════════════════════════════════════════════╗
║  DATABASE_URL is required to start the server                ║
╠══════════════════════════════════════════════════════════════╣
║  Quick Setup Options:                                        ║
║                                                              ║
║  1. GCP Cloud SQL (Free Tier - Recommended):                 ║
║     → Visit https://console.cloud.google.com/sql             ║
║     → Create a PostgreSQL instance (free tier eligible)      ║
║     → Get connection string from instance details            ║
║     → Format: postgresql://user:pass@/dbname?host=/cloudsql/instance ║
║                                                              ║
║  2. Local PostgreSQL:                                        ║
║     → Install PostgreSQL locally                             ║
║     → Create database: createdb arkhitekton                 ║
║     → Use: postgresql://user:pass@localhost:5432/arkhitekton ║
║                                                              ║
║  3. Docker (Quick Start):                                    ║
║     → docker run -d -p 5432:5432 \\                          ║
║       -e POSTGRES_PASSWORD=postgres \\                        ║
║       -e POSTGRES_DB=arkhitekton postgres                    ║
║     → Use: postgresql://postgres:postgres@localhost:5432/arkhitekton ║
║                                                              ║
║  Then create a .env file in the project root:                ║
║  DATABASE_URL=your_connection_string_here                    ║
╚══════════════════════════════════════════════════════════════╝
`
    : "DATABASE_URL must be set. Please configure your database connection string.";
  
  throw new Error(helpMessage);
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
