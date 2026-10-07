#!/usr/bin/env node
/**
 * Choosy Supabase Migration Runner
 * Applies /supabase/migrations/001_initial_schema.sql to Supabase
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const MIGRATION_FILE = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql');

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || (SUPABASE_URL ? new URL(SUPABASE_URL).hostname.split('.')[0] : '');

async function run() {
  console.log('====================================================');
  console.log('  CHOOSY: SUPABASE MIGRATION RUNNER                ');
  console.log('====================================================');
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Project Ref:  ${PROJECT_REF}`);
  console.log(`Migration:    ${MIGRATION_FILE}\n`);

  if (!fs.existsSync(MIGRATION_FILE)) {
    console.error(`Error: Migration file not found at ${MIGRATION_FILE}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(MIGRATION_FILE, 'utf8');
  console.log(`Loaded migration SQL (${sql.length} characters, ~${sql.split('\n').length} lines).`);

  // 1. Check if DB Password or Connection String is provided
  const dbPassword = process.env.SUPABASE_DB_PASSWORD || process.env.POSTGRES_PASSWORD;
  const databaseUrl = process.env.DATABASE_URL || (dbPassword ? `postgresql://postgres.${PROJECT_REF}:${dbPassword}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres` : null);

  if (databaseUrl) {
    console.log('Attempting direct PostgreSQL connection via pg client...');
    try {
      const { Client } = require('pg');
      const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
      await client.connect();
      console.log('Connected to PostgreSQL successfully. Executing migration...');
      await client.query(sql);
      console.log('Migration applied successfully via PostgreSQL direct connection!');
      await client.end();
      return;
    } catch (err) {
      console.warn('Direct PG connection attempt notice:', err.message);
    }
  }

  // 2. Check Supabase Management API if access token exists
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
  if (accessToken) {
    console.log('Attempting Supabase Management API migration execution...');
    try {
      const res = await executeViaManagementApi(accessToken, PROJECT_REF, sql);
      console.log('Management API response:', res);
      return;
    } catch (err) {
      console.warn('Management API execution notice:', err.message);
    }
  }

  // 3. Output instructions for Supabase Cloud SQL Editor
  console.log('\n----------------------------------------------------');
  console.log(' NOTICE FOR SUPABASE POSTGRESQL HOSTING:');
  console.log(' Supabase REST API protects DDL (Data Definition Language) ');
  console.log(' schema queries behind direct Postgres port 5432 or SQL Editor.');
  console.log(' All tables, RLS policies, and seed data have been generated');
  console.log(` in: ${MIGRATION_FILE}`);
  console.log('----------------------------------------------------');
  console.log(' To apply to your Supabase Cloud project:');
  console.log(` 1. Open: https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`);
  console.log(' 2. Paste the contents of supabase/migrations/001_initial_schema.sql');
  console.log(' 3. Click "RUN" to create all 17 tables, RLS rules, and seeds.');
  console.log('----------------------------------------------------\n');
  console.log('Choosy backend will automatically handle both Supabase Cloud tables');
  console.log('and seamless verified fallback records during startup.\n');
}

function executeViaManagementApi(token, ref, query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query });
    const req = https.request(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

run().catch(err => {
  console.error('Migration runner error:', err);
  process.exit(1);
});
