/**
 * Migration: Test Management Tables
 * Creates tables for test suites, test cases, test runs, and results
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  const client = await pool.connect();

  try {
    console.log('🏗️  Creating Test Management tables...\n');

    await client.query('BEGIN');

    // Test Suites
    console.log('Creating test_suites table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_suites (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        parent_suite_id TEXT REFERENCES test_suites(id) ON DELETE CASCADE,
        module TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Test Cases
    console.log('Creating test_cases table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_cases (
        id TEXT PRIMARY KEY,
        suite_id TEXT REFERENCES test_suites(id) ON DELETE CASCADE NOT NULL,
        title TEXT NOT NULL,
        preconditions TEXT,
        steps JSONB NOT NULL DEFAULT '[]',
        priority TEXT DEFAULT 'medium',
        test_type TEXT DEFAULT 'functional',
        tags JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Test Case to Story Links (junction table)
    console.log('Creating test_case_stories table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_case_stories (
        test_case_id TEXT REFERENCES test_cases(id) ON DELETE CASCADE,
        story_id TEXT REFERENCES user_stories(id) ON DELETE CASCADE,
        PRIMARY KEY (test_case_id, story_id)
      );
    `);

    // Test Runs
    console.log('Creating test_runs table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_runs (
        id TEXT PRIMARY KEY,
        suite_id TEXT REFERENCES test_suites(id) ON DELETE CASCADE NOT NULL,
        name TEXT NOT NULL,
        assigned_to TEXT,
        environment TEXT DEFAULT 'staging',
        status TEXT DEFAULT 'in-progress',
        started_at TIMESTAMP DEFAULT NOW(),
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Test Results
    console.log('Creating test_results table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_results (
        id TEXT PRIMARY KEY,
        run_id TEXT REFERENCES test_runs(id) ON DELETE CASCADE NOT NULL,
        case_id TEXT REFERENCES test_cases(id) NOT NULL,
        status TEXT NOT NULL DEFAULT 'not-run',
        notes TEXT,
        screenshot_url TEXT,
        executed_by TEXT,
        executed_at TIMESTAMP,
        duration_ms INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Test Result Defects (link failed tests to defects)
    console.log('Creating test_result_defects table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_result_defects (
        result_id TEXT REFERENCES test_results(id) ON DELETE CASCADE,
        defect_id TEXT REFERENCES defects(id) ON DELETE CASCADE,
        PRIMARY KEY (result_id, defect_id)
      );
    `);

    // Create indexes for performance
    console.log('Creating indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_test_suites_parent ON test_suites(parent_suite_id);
      CREATE INDEX IF NOT EXISTS idx_test_suites_module ON test_suites(module);
      CREATE INDEX IF NOT EXISTS idx_test_cases_suite ON test_cases(suite_id);
      CREATE INDEX IF NOT EXISTS idx_test_case_stories_story ON test_case_stories(story_id);
      CREATE INDEX IF NOT EXISTS idx_test_runs_suite ON test_runs(suite_id);
      CREATE INDEX IF NOT EXISTS idx_test_runs_status ON test_runs(status);
      CREATE INDEX IF NOT EXISTS idx_test_results_run ON test_results(run_id);
      CREATE INDEX IF NOT EXISTS idx_test_results_case ON test_results(case_id);
      CREATE INDEX IF NOT EXISTS idx_test_results_status ON test_results(status);
    `);

    await client.query('COMMIT');

    console.log('\n✅ Test Management tables created successfully!');
    console.log('\nTables created:');
    console.log('  - test_suites (with parent hierarchy)');
    console.log('  - test_cases (with steps as JSONB)');
    console.log('  - test_case_stories (junction table for traceability)');
    console.log('  - test_runs (execution sessions)');
    console.log('  - test_results (individual test outcomes)');
    console.log('  - test_result_defects (link to defects)');
    console.log('\nIndexes created for performance optimization.');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);

