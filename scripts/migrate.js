const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createTablesSQL = `
  -- Users table
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    profile_picture_url TEXT,
    difficulty_level VARCHAR(50) DEFAULT 'beginner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Game Progress table
  CREATE TABLE IF NOT EXISTS game_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    current_module VARCHAR(100),
    current_stage INTEGER DEFAULT 0,
    completion_percentage INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
  );

  -- Module Progress table
  CREATE TABLE IF NOT EXISTS module_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    module_name VARCHAR(100) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    score INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    last_attempt TIMESTAMP,
    completed_at TIMESTAMP,
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, module_name)
  );

  -- Business Ideas table
  CREATE TABLE IF NOT EXISTS business_ideas (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    problem_statement TEXT,
    target_market VARCHAR(255),
    validation_score INTEGER,
    ai_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Value Proposition Canvas table
  CREATE TABLE IF NOT EXISTS value_proposition_canvas (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    business_idea_id INTEGER REFERENCES business_ideas(id) ON DELETE CASCADE,
    customer_jobs JSONB,
    customer_pains JSONB,
    customer_gains JSONB,
    products_services JSONB,
    pain_relievers JSONB,
    gain_creators JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Business Model Canvas table
  CREATE TABLE IF NOT EXISTS business_model_canvas (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    business_idea_id INTEGER REFERENCES business_ideas(id) ON DELETE CASCADE,
    key_partners TEXT,
    key_activities TEXT,
    key_resources TEXT,
    value_propositions TEXT,
    customer_relationships TEXT,
    channels TEXT,
    customer_segments TEXT,
    cost_structure TEXT,
    revenue_streams TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Business Plans table
  CREATE TABLE IF NOT EXISTS business_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    business_idea_id INTEGER REFERENCES business_ideas(id) ON DELETE CASCADE,
    executive_summary TEXT,
    company_description TEXT,
    market_analysis TEXT,
    organization_structure TEXT,
    marketing_sales_strategy TEXT,
    financial_projections JSONB,
    funding_requirements TEXT,
    ai_generated_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- MVP table
  CREATE TABLE IF NOT EXISTS mvp_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    business_idea_id INTEGER REFERENCES business_ideas(id) ON DELETE CASCADE,
    core_features JSONB,
    tech_stack TEXT,
    timeline TEXT,
    budget DECIMAL(10, 2),
    success_metrics JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Ideathon Events table
  CREATE TABLE IF NOT EXISTS ideathon_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_name VARCHAR(255),
    theme TEXT,
    ideas_generated INTEGER,
    best_idea TEXT,
    score INTEGER,
    ai_evaluation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Patent Filings table
  CREATE TABLE IF NOT EXISTS patent_filings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    business_idea_id INTEGER REFERENCES business_ideas(id) ON DELETE CASCADE,
    patent_title VARCHAR(255),
    description TEXT,
    claims TEXT,
    filing_status VARCHAR(50),
    ai_novelty_assessment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Incubation Progress table
  CREATE TABLE IF NOT EXISTS incubation_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    business_idea_id INTEGER REFERENCES business_ideas(id) ON DELETE CASCADE,
    stage VARCHAR(50),
    mentors_assigned INTEGER,
    funding_received DECIMAL(15, 2),
    kpis JSONB,
    milestones_achieved JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- AI Interaction History table
  CREATE TABLE IF NOT EXISTS ai_interactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    prompt TEXT,
    response TEXT,
    module VARCHAR(100),
    tokens_used INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Create indexes for better query performance
  CREATE INDEX IF NOT EXISTS idx_user_id ON game_progress(user_id);
  CREATE INDEX IF NOT EXISTS idx_business_idea_user ON business_ideas(user_id);
  CREATE INDEX IF NOT EXISTS idx_module_progress_user ON module_progress(user_id);
  CREATE INDEX IF NOT EXISTS idx_ai_interactions_user ON ai_interactions(user_id);
`;

async function runMigrations() {
  try {
    console.log('Starting database migrations...');
    await pool.query(createTablesSQL);
    console.log('✅ Database tables created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

runMigrations();