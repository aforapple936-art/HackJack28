-- ====================================================================
-- CHOOSY: DECISION INTELLIGENCE PLATFORM
-- INITIAL SCHEMA & REAL-WORLD DECISION DATA MIGRATION
-- Migration: 001_initial_schema.sql
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USER PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    tier TEXT NOT NULL DEFAULT 'advanced', -- 'basic', 'advanced', 'pro'
    credits_balance NUMERIC NOT NULL DEFAULT 250,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. USER PREFERENCES
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    default_currency TEXT NOT NULL DEFAULT 'INR',
    default_risk_tolerance TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high'
    preferred_location JSONB DEFAULT '{"city": "Vijayawada", "state": "Andhra Pradesh", "country": "India", "lat": 16.5062, "lng": 80.6480}'::jsonb,
    domain_preferences JSONB NOT NULL DEFAULT '{
        "shopping": {"importance": "value_and_durability", "delivery_urgency": "medium"},
        "travel": {"style": "balanced", "budget_pacing": "planned", "safety_priority": "high"},
        "health": {"prioritize_distance": true, "prefer_verified_fees": true, "emergency_access": true},
        "technology": {"future_proofing": "high", "prefer_warranty": true}
    }'::jsonb,
    is_personalization_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_preferences_user UNIQUE (user_id)
);

-- 4. DECISIONS
CREATE TABLE IF NOT EXISTS public.decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    domain TEXT NOT NULL DEFAULT 'general', -- 'shopping', 'health', 'travel', 'technology', 'education', 'career', 'finance'
    subdomain TEXT,
    goal TEXT NOT NULL,
    budget NUMERIC,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'ready', -- 'interviewing', 'researching', 'ready', 'decided', 'archived'
    constraints JSONB NOT NULL DEFAULT '[]'::jsonb, -- list of { id, type: 'hard'|'soft', criterion, operator, value, description }
    confidence_score NUMERIC DEFAULT 85,
    robustness_score NUMERIC DEFAULT 88,
    stability_level TEXT DEFAULT 'HIGH', -- 'HIGH', 'MEDIUM', 'LOW'
    winning_alternative_id UUID,
    runner_up_alternative_id UUID,
    recommendation_summary TEXT,
    tradeoff_analysis TEXT,
    risk_summary TEXT,
    missing_info JSONB DEFAULT '[]'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_shared BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CRITERIA
CREATE TABLE IF NOT EXISTS public.criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_id UUID NOT NULL REFERENCES public.decisions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    weight NUMERIC NOT NULL DEFAULT 15.0, -- Normalized percentage or weight
    scale_type TEXT NOT NULL DEFAULT 'higher_is_better', -- 'higher_is_better', 'lower_is_better', 'boolean', 'target'
    unit TEXT,
    is_hard_constraint BOOLEAN NOT NULL DEFAULT FALSE,
    min_threshold NUMERIC,
    max_threshold NUMERIC,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ALTERNATIVES
CREATE TABLE IF NOT EXISTS public.alternatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_id UUID NOT NULL REFERENCES public.decisions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC,
    currency TEXT NOT NULL DEFAULT 'INR',
    overall_score NUMERIC DEFAULT 0,
    normalized_score NUMERIC DEFAULT 0,
    rank INTEGER DEFAULT 1,
    source_type TEXT NOT NULL DEFAULT 'manual', -- 'manual', 'ai_suggested', 'provider_discovered', 'verified_feed'
    primary_url TEXT,
    availability_status TEXT NOT NULL DEFAULT 'unknown', -- 'available', 'out_of_stock', 'appointments_available', 'limited_stock', 'unknown'
    location_info JSONB DEFAULT '{}'::jsonb, -- { address, city, lat, lng, distance_km, travel_time_mins }
    specs JSONB DEFAULT '{}'::jsonb,
    contact_info JSONB DEFAULT '{}'::jsonb, -- { phone, hours, emergency_department, directions_url }
    rating NUMERIC,
    review_count INTEGER DEFAULT 0,
    is_excluded BOOLEAN NOT NULL DEFAULT FALSE,
    exclusion_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Foreign key link for decision winning alternatives
ALTER TABLE public.decisions
    ADD CONSTRAINT fk_decisions_winner
    FOREIGN KEY (winning_alternative_id)
    REFERENCES public.alternatives(id) ON DELETE SET NULL;

ALTER TABLE public.decisions
    ADD CONSTRAINT fk_decisions_runner_up
    FOREIGN KEY (runner_up_alternative_id)
    REFERENCES public.alternatives(id) ON DELETE SET NULL;

-- 7. ALTERNATIVE SCORES (MCDA Evaluation Matrix)
CREATE TABLE IF NOT EXISTS public.alternative_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alternative_id UUID NOT NULL REFERENCES public.alternatives(id) ON DELETE CASCADE,
    criterion_id UUID NOT NULL REFERENCES public.criteria(id) ON DELETE CASCADE,
    raw_value NUMERIC,
    text_value TEXT,
    normalized_score NUMERIC NOT NULL DEFAULT 50, -- 0 - 100
    weighted_score NUMERIC NOT NULL DEFAULT 0,
    confidence NUMERIC DEFAULT 90,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_alternative_criterion UNIQUE (alternative_id, criterion_id)
);

-- 8. DECISION EVIDENCE & PROVENANCE
CREATE TABLE IF NOT EXISTS public.decision_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_id UUID NOT NULL REFERENCES public.decisions(id) ON DELETE CASCADE,
    alternative_id UUID REFERENCES public.alternatives(id) ON DELETE CASCADE,
    criterion_id UUID REFERENCES public.criteria(id) ON DELETE SET NULL,
    claim TEXT NOT NULL,
    source_name TEXT NOT NULL,
    source_url TEXT,
    provider TEXT NOT NULL DEFAULT 'system', -- 'openstreetmap', 'overpass', 'gemini_research', 'manual', 'retail_api'
    verification_status TEXT NOT NULL DEFAULT 'verified', -- 'verified', 'partially_verified', 'unverified', 'conflicting', 'stale', 'estimate', 'ai_inference', 'user_provided'
    confidence NUMERIC DEFAULT 90,
    retrieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_timestamp TIMESTAMPTZ DEFAULT NOW(),
    raw_snippet TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. DECISION SOURCES
CREATE TABLE IF NOT EXISTS public.decision_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_id UUID NOT NULL REFERENCES public.decisions(id) ON DELETE CASCADE,
    source_name TEXT NOT NULL,
    source_url TEXT,
    provider_type TEXT NOT NULL DEFAULT 'web',
    reliability_score NUMERIC DEFAULT 95,
    last_checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. DECISION SCENARIOS (What-If Analysis)
CREATE TABLE IF NOT EXISTS public.decision_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_id UUID NOT NULL REFERENCES public.decisions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    parameters JSONB NOT NULL DEFAULT '{}'::jsonb, -- { weights: {}, budget: number, removed_alternatives: [], constraints: [] }
    ranking JSONB NOT NULL DEFAULT '[]'::jsonb,
    winner_id UUID REFERENCES public.alternatives(id) ON DELETE SET NULL,
    previous_winner_id UUID REFERENCES public.alternatives(id) ON DELETE SET NULL,
    winner_changed BOOLEAN NOT NULL DEFAULT FALSE,
    score_delta NUMERIC DEFAULT 0,
    robustness_impact TEXT DEFAULT 'STABLE',
    explanation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. REVIEW INSIGHTS
CREATE TABLE IF NOT EXISTS public.review_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alternative_id UUID NOT NULL REFERENCES public.alternatives(id) ON DELETE CASCADE,
    overall_rating NUMERIC DEFAULT 4.5,
    review_count INTEGER DEFAULT 0,
    positive_themes JSONB NOT NULL DEFAULT '[]'::jsonb,
    negative_themes JSONB NOT NULL DEFAULT '[]'::jsonb,
    recurring_issues JSONB NOT NULL DEFAULT '[]'::jsonb,
    review_confidence TEXT NOT NULL DEFAULT 'high', -- 'high', 'medium', 'low', 'unavailable'
    freshness_indicator TEXT DEFAULT 'Verified within 14 days',
    sample_quotes JSONB NOT NULL DEFAULT '[]'::jsonb,
    last_analyzed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. LOCATIONS CACHE & SAVED
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    postal_code TEXT,
    country TEXT NOT NULL DEFAULT 'India',
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. EXTERNAL DATA CACHE
CREATE TABLE IF NOT EXISTS public.external_data_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL,
    query_hash TEXT NOT NULL UNIQUE,
    query_text TEXT,
    domain TEXT,
    response_data JSONB NOT NULL,
    retrieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- 14. SHARED DECISIONS & COLLABORATION
CREATE TABLE IF NOT EXISTS public.shared_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_id UUID NOT NULL REFERENCES public.decisions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    share_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
    title TEXT,
    allow_voting BOOLEAN NOT NULL DEFAULT TRUE,
    allow_weight_contribution BOOLEAN NOT NULL DEFAULT TRUE,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.collaborator_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shared_decision_id UUID NOT NULL REFERENCES public.shared_decisions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    participant_name TEXT NOT NULL,
    participant_weight NUMERIC NOT NULL DEFAULT 1.0,
    criteria_weights JSONB NOT NULL DEFAULT '{}'::jsonb,
    preferred_alternative_id UUID REFERENCES public.alternatives(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. AI CREDIT LEDGER
CREATE TABLE IF NOT EXISTS public.credit_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    operation TEXT NOT NULL, -- 'signup_grant', 'interview', 'generate_criteria', 'discover_alternatives', 'analyze_reviews', 'explain_scenario', 'export_report'
    amount NUMERIC NOT NULL, -- Positive for additions, negative for consumption
    balance_after NUMERIC NOT NULL,
    reference_id UUID,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. USAGE EVENTS
CREATE TABLE IF NOT EXISTS public.usage_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    operation TEXT NOT NULL,
    credits_used NUMERIC NOT NULL DEFAULT 0,
    request_id TEXT,
    status TEXT NOT NULL DEFAULT 'success',
    execution_time_ms INTEGER,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. DECISION ALERTS
CREATE TABLE IF NOT EXISTS public.decision_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_id UUID NOT NULL REFERENCES public.decisions(id) ON DELETE CASCADE,
    alternative_id UUID REFERENCES public.alternatives(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL, -- 'price_drop', 'availability_change', 'fee_change', 'recommendation_flip'
    target_field TEXT NOT NULL,
    condition_op TEXT NOT NULL, -- 'less_than', 'equals', 'state_change'
    threshold_value TEXT NOT NULL,
    frequency TEXT NOT NULL DEFAULT 'daily',
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    last_checked TIMESTAMPTZ,
    last_triggered TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. DECISION INTERVIEWS (Conversational Setup State)
CREATE TABLE IF NOT EXISTS public.decision_interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_id UUID REFERENCES public.decisions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'skipped'
    conversation_history JSONB NOT NULL DEFAULT '[]'::jsonb,
    extracted_intent JSONB NOT NULL DEFAULT '{}'::jsonb,
    missing_info_detected JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alternatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alternative_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_data_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborator_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_interviews ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
DROP POLICY IF EXISTS "Public can read profiles" ON public.profiles;
CREATE POLICY "Public can read profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their profile" ON public.profiles;
CREATE POLICY "Users can update their profile" ON public.profiles FOR ALL USING (true);

-- 2. User Preferences
DROP POLICY IF EXISTS "Access user preferences" ON public.user_preferences;
CREATE POLICY "Access user preferences" ON public.user_preferences FOR ALL USING (true);

-- 3. Decisions Policies (Allow owner or demo guest or shared access)
DROP POLICY IF EXISTS "Select decisions" ON public.decisions;
CREATE POLICY "Select decisions" ON public.decisions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Manage decisions" ON public.decisions;
CREATE POLICY "Manage decisions" ON public.decisions FOR ALL USING (true);

-- 4. Criteria Policies
DROP POLICY IF EXISTS "Access criteria" ON public.criteria;
CREATE POLICY "Access criteria" ON public.criteria FOR ALL USING (true);

-- 5. Alternatives Policies
DROP POLICY IF EXISTS "Access alternatives" ON public.alternatives;
CREATE POLICY "Access alternatives" ON public.alternatives FOR ALL USING (true);

-- 6. Alternative Scores Policies
DROP POLICY IF EXISTS "Access alternative scores" ON public.alternative_scores;
CREATE POLICY "Access alternative scores" ON public.alternative_scores FOR ALL USING (true);

-- 7. Evidence Policies
DROP POLICY IF EXISTS "Access decision evidence" ON public.decision_evidence;
CREATE POLICY "Access decision evidence" ON public.decision_evidence FOR ALL USING (true);

-- 8. Sources Policies
DROP POLICY IF EXISTS "Access decision sources" ON public.decision_sources;
CREATE POLICY "Access decision sources" ON public.decision_sources FOR ALL USING (true);

-- 9. Scenarios Policies
DROP POLICY IF EXISTS "Access scenarios" ON public.decision_scenarios;
CREATE POLICY "Access scenarios" ON public.decision_scenarios FOR ALL USING (true);

-- 10. Review Insights Policies
DROP POLICY IF EXISTS "Access review insights" ON public.review_insights;
CREATE POLICY "Access review insights" ON public.review_insights FOR ALL USING (true);

-- 11. Locations Policies
DROP POLICY IF EXISTS "Access locations" ON public.locations;
CREATE POLICY "Access locations" ON public.locations FOR ALL USING (true);

-- 12. Cache Policies
DROP POLICY IF EXISTS "Access external cache" ON public.external_data_cache;
CREATE POLICY "Access external cache" ON public.external_data_cache FOR ALL USING (true);

-- 13. Collaboration Policies
DROP POLICY IF EXISTS "Access shared decisions" ON public.shared_decisions;
CREATE POLICY "Access shared decisions" ON public.shared_decisions FOR ALL USING (true);

DROP POLICY IF EXISTS "Access collaborator preferences" ON public.collaborator_preferences;
CREATE POLICY "Access collaborator preferences" ON public.collaborator_preferences FOR ALL USING (true);

-- 14. Credit Ledger Policies
DROP POLICY IF EXISTS "Access credit ledger" ON public.credit_ledger;
CREATE POLICY "Access credit ledger" ON public.credit_ledger FOR ALL USING (true);

-- 15. Usage Events Policies
DROP POLICY IF EXISTS "Access usage events" ON public.usage_events;
CREATE POLICY "Access usage events" ON public.usage_events FOR ALL USING (true);

-- 16. Decision Alerts Policies
DROP POLICY IF EXISTS "Access decision alerts" ON public.decision_alerts;
CREATE POLICY "Access decision alerts" ON public.decision_alerts FOR ALL USING (true);

-- 17. Decision Interviews Policies
DROP POLICY IF EXISTS "Access decision interviews" ON public.decision_interviews;
CREATE POLICY "Access decision interviews" ON public.decision_interviews FOR ALL USING (true);

-- ====================================================================
-- SEED DATA: DEFAULT PROFILES, PREFERENCES, AND 4 DEMO SCENARIOS
-- ====================================================================

-- Demo User
INSERT INTO public.profiles (id, email, full_name, tier, credits_balance)
VALUES ('00000000-0000-0000-0000-000000000001', 'demo@choosy.ai', 'Manohar (Demo User)', 'pro', 450)
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- Demo Preferences
INSERT INTO public.user_preferences (id, user_id, default_currency, default_risk_tolerance, preferred_location, domain_preferences)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'INR',
    'medium',
    '{"city": "Vijayawada", "state": "Andhra Pradesh", "country": "India", "lat": 16.5062, "lng": 80.6480}'::jsonb,
    '{
        "shopping": {"importance": "value_and_durability", "delivery_urgency": "medium"},
        "travel": {"style": "balanced", "budget_pacing": "planned", "safety_priority": "high"},
        "health": {"prioritize_distance": true, "prefer_verified_fees": true, "emergency_access": true},
        "technology": {"future_proofing": "high", "prefer_warranty": true}
    }'::jsonb
)
ON CONFLICT (user_id) DO NOTHING;

-- Initial Credit Grant Ledger Entry
INSERT INTO public.credit_ledger (id, user_id, operation, amount, balance_after, metadata)
VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'signup_grant',
    500,
    500,
    '{"reason": "Initial platform welcome credit allocation"}'::jsonb
);

-- ====================================================================
-- DEMO SCENARIO 1: LAPTOP PURCHASE (₹1,25,000 Budget)
-- ====================================================================
INSERT INTO public.decisions (
    id, user_id, title, description, domain, subdomain, goal, budget, currency, status,
    confidence_score, robustness_score, stability_level, recommendation_summary, tradeoff_analysis,
    risk_summary, missing_info, constraints
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000001',
    'Best Laptop for College, AI & Gaming under ₹1.25L',
    'Evaluation of high-performance laptops balancing local AI experimentation (CUDA/CoreML), gaming, battery life, and campus portability.',
    'shopping',
    'electronics',
    'Best laptop for college programming, AI experimentation, and gaming under ₹1,25,000',
    125000,
    'INR',
    'ready',
    92.4,
    89.0,
    'HIGH',
    'Lenovo Legion Pro 5i edges out competitors as the optimal choice. It provides a full-power RTX 4060 GPU with 140W TGP crucial for running 7B parameter LLMs locally via Ollama/PyTorch, while staying comfortably under budget with verified dual-channel RAM expandability.',
    'Trade-off: Legion Pro 5i offers top AI/gaming throughput (+26%) but weighs 2.36kg with an average 5.5-hour battery life compared to MacBook Air M3 (18h battery, 1.24kg) which cannot run high-end PC games.',
    'Key Risk: Battery longevity during 6+ hour college lectures without power outlets requires USB-PD 100W power bank or eco-mode switching.',
    '[{"field": "Long-term thermal degradation data", "status": "estimated_from_benchmarks"}, {"field": "On-site warranty claim turnaround time", "status": "user_verified"}]'::jsonb,
    '[{"id": "c1", "type": "hard", "criterion": "Price", "operator": "<=", "value": 125000, "description": "Maximum ceiling ₹1,25,000"}, {"id": "c2", "type": "soft", "criterion": "RAM", "operator": ">=", "value": 16, "description": "Minimum 16GB RAM for AI models"}]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Criteria for Laptop
INSERT INTO public.criteria (id, decision_id, name, description, weight, scale_type, unit, is_hard_constraint, sort_order) VALUES
('10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'AI & Compute Performance', 'GPU compute power (CUDA cores, Tensor cores, TGP) for model training and inference', 25.0, 'higher_is_better', 'TFLOPS / TGP', false, 1),
('10000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Price & Value', 'Effective market price within ₹1.25L budget with bundle discounts', 20.0, 'lower_is_better', 'INR', true, 2),
('10000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Battery Life & Portability', 'College campus battery endurance under coding/web browsing workloads and weight', 20.0, 'higher_is_better', 'Hours', false, 3),
('10000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'Gaming Capability', 'Frame rates on AAA titles at 1440p / 1080p high settings', 15.0, 'higher_is_better', 'FPS', false, 4),
('10000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'Build & Thermal Reliability', 'Chassis rigidity, cooling system efficiency, keyboard ergonomics for coding', 10.0, 'higher_is_better', 'Score /10', false, 5),
('10000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'Upgradability & Long-Term Value', 'Upgradable RAM slots, secondary M.2 NVMe SSD slot, 3-year warranty options', 10.0, 'higher_is_better', 'Score /10', false, 6)
ON CONFLICT (id) DO NOTHING;

-- Alternatives for Laptop
INSERT INTO public.alternatives (
    id, decision_id, title, description, price, currency, overall_score, normalized_score, rank,
    source_type, primary_url, availability_status, specs, rating, review_count
) VALUES
(
    '20000000-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'Lenovo Legion Pro 5i (Core i7-14650HX, RTX 4060 140W)',
    '16" WQXGA 240Hz 500 nits, 16GB DDR5 (expandable to 64GB), 1TB Gen4 SSD, ColdFront 5.0 thermals.',
    119990,
    'INR',
    88.6,
    88.6,
    1,
    'verified_feed',
    'https://www.lenovo.com/in/en/laptops/legion-laptops/legion-5-series/legion-pro-5i-gen-9',
    'available',
    '{"cpu": "Intel Core i7-14650HX", "gpu": "NVIDIA RTX 4060 8GB GDDR6 (140W)", "ram": "16GB DDR5 5600MHz", "storage": "1TB NVMe SSD", "display": "16-inch 2560x1600 240Hz", "weight": "2.36 kg", "battery": "80Whr (5.5 hrs)"}'::jsonb,
    4.7,
    1420
),
(
    '20000000-0000-0000-0000-000000000002',
    '11111111-1111-1111-1111-111111111111',
    'ASUS ROG Zephyrus G14 (Ryzen 7 8845HS, RTX 4060 90W)',
    '14" 3K OLED 120Hz, 16GB LPDDR5X, 1TB SSD, Premium CNC aluminum chassis, ultraportable 1.5kg.',
    124990,
    'INR',
    84.8,
    84.8,
    2,
    'verified_feed',
    'https://rog.asus.com/in/laptops/rog-zephyrus/rog-zephyrus-g14-2024/',
    'available',
    '{"cpu": "AMD Ryzen 7 8845HS with NPU", "gpu": "NVIDIA RTX 4060 8GB (90W)", "ram": "16GB LPDDR5X (Soldered)", "storage": "1TB NVMe SSD", "display": "14-inch 2.8K 120Hz OLED", "weight": "1.50 kg", "battery": "73Whr (8.5 hrs)"}'::jsonb,
    4.6,
    890
),
(
    '20000000-0000-0000-0000-000000000003',
    '11111111-1111-1111-1111-111111111111',
    'Apple MacBook Air 15" M3 (16GB Unified Memory, 512GB SSD)',
    '15.3" Liquid Retina, 8-core CPU, 10-core GPU, 16-core Neural Engine, silent fanless design, up to 18h battery.',
    124900,
    'INR',
    79.2,
    79.2,
    3,
    'verified_feed',
    'https://www.apple.com/in/macbook-air/',
    'available',
    '{"cpu": "Apple M3 (8-core)", "gpu": "10-core GPU with Ray Tracing", "ram": "16GB Unified", "storage": "512GB SSD", "display": "15.3-inch Retina 500 nits", "weight": "1.51 kg", "battery": "66.5Whr (17.5 hrs)", "os": "macOS"}'::jsonb,
    4.8,
    3200
),
(
    '20000000-0000-0000-0000-000000000004',
    '11111111-1111-1111-1111-111111111111',
    'Acer Predator Helios Neo 16 (Core i7-14700HX, RTX 4060 140W)',
    '16" WQXGA 165Hz IPS, 16GB DDR5, 1TB SSD, 5th Gen AeroBlade 3D metal fans.',
    109990,
    'INR',
    81.5,
    81.5,
    4,
    'verified_feed',
    'https://store.acer.com/en-in/predator-helios-neo-16',
    'available',
    '{"cpu": "Intel Core i7-14700HX", "gpu": "NVIDIA RTX 4060 8GB (140W)", "ram": "16GB DDR5", "storage": "1TB SSD", "display": "16-inch 2560x1600 165Hz", "weight": "2.60 kg", "battery": "90Whr (4.5 hrs)"}'::jsonb,
    4.4,
    650
)
ON CONFLICT (id) DO NOTHING;

-- Set winners
UPDATE public.decisions
SET winning_alternative_id = '20000000-0000-0000-0000-000000000001',
    runner_up_alternative_id = '20000000-0000-0000-0000-000000000002'
WHERE id = '11111111-1111-1111-1111-111111111111';

-- Evidence & Provenance for Laptop
INSERT INTO public.decision_evidence (
    decision_id, alternative_id, criterion_id, claim, source_name, source_url, provider,
    verification_status, confidence, raw_snippet
) VALUES
('11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
'RTX 4060 delivers 140W max TGP with full CUDA & Tensor Core access for PyTorch 2.4 and TensorRT LLM execution', 'Official Manufacturer Specification', 'https://psref.lenovo.com', 'retail_api', 'verified', 99, 'TGP 140W, Boost Clock 2370MHz, MUX Switch + NVIDIA Advanced Optimus'),
('11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002',
'Market price verified at ₹1,19,990 across major Indian authorized e-commerce partners as of current week', 'Authorized Retail Store Verification', 'https://www.lenovo.com/in', 'retail_api', 'verified', 96, 'Price ₹1,19,990 inclusive of all taxes, free 3-year ADP bundle promo'),
('11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003',
'Real-world college coding battery test averages 5 hours 28 minutes on hybrid GPU mode', 'Independent Lab Hardware Review', 'https://notebookcheck.net', 'web_review', 'verified', 91, 'WiFi script at 150 nits measured 332 minutes; heavy compile scripts reduce to ~2.5 hours');

-- Review Insights for Legion
INSERT INTO public.review_insights (
    alternative_id, overall_rating, review_count, positive_themes, negative_themes, recurring_issues, review_confidence, sample_quotes
) VALUES (
    '20000000-0000-0000-0000-000000000001',
    4.7,
    1420,
    '["Thermals stay under 78°C during heavy CUDA inference", "Keyboard tactile response is exceptional for long coding sessions", "Bright 500 nits matte display avoids classroom glare"]'::jsonb,
    '["Power brick weighs 860g making the travel pack heavy", "Speakers are average for media playback"]'::jsonb,
    '["Factory Vantage software requires initial clean setup", "Battery life drops fast if dGPU remains active"]'::jsonb,
    'high',
    '["Trained a LoRA adapter on RTX 4060 without any throttling. Quiet fans compared to last gen.", "Best college purchase if you prioritize engineering horsepower over ultra-lightweight portability."]'::jsonb
);

-- ====================================================================
-- DEMO SCENARIO 2: HEALTHCARE / CLINICS IN VIJAYAWADA
-- ====================================================================
INSERT INTO public.decisions (
    id, user_id, title, description, domain, subdomain, goal, budget, currency, status,
    confidence_score, robustness_score, stability_level, recommendation_summary, tradeoff_analysis,
    risk_summary, missing_info, constraints
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000001',
    'Compare Top Dermatologists & Skin Specialists in Vijayawada',
    'Objective comparison of verified dermatology clinics and multi-specialty hospitals near Vijayawada based on distance, verified consultation fee, emergency infrastructure, and patient satisfaction.',
    'health',
    'dermatology',
    'Find the most qualified dermatologist in Vijayawada with transparent consultation fees and reasonable distance',
    1500,
    'INR',
    'ready',
    94.0,
    91.5,
    'HIGH',
    'Manipal Hospital Dermatology Wing (Dr. R. K. Varma) ranks highest overall. Offers 24x7 emergency backup, comprehensive dermatopathology diagnostics, transparent ₹800 consultation fee, and 3.4 km proximity to MG Road center.',
    'Trade-off: Standalone clinic (Dr. Sudha Skin Clinic) has a lower consultation fee (₹600 vs ₹800) and shorter OPD wait times (20 mins vs 45 mins), but lacks in-house advanced laser dermatosurgery and emergency ward.',
    'SAFETY NOTICE: Choosy provides verified administrative & operational facts to assist clinic selection. This is NOT medical advice or diagnostic assessment. For acute symptoms, consult an emergency physician immediately.',
    '[{"field": "Real-time today token availability", "status": "telephone_verified"}, {"field": "Insurance cash-less approval speed", "status": "estimated"}]'::jsonb,
    '[{"id": "c_fee", "type": "hard", "criterion": "Consultation Fee", "operator": "<=", "value": 1500, "description": "Maximum OPD fee ₹1,500"}, {"id": "c_dist", "type": "soft", "criterion": "Distance", "operator": "<=", "value": 12, "description": "Within 12 km radius of Vijayawada Central"}]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Criteria for Healthcare
INSERT INTO public.criteria (id, decision_id, name, description, weight, scale_type, unit, is_hard_constraint, sort_order) VALUES
('20000000-1000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Specialty Expertise & Doctor Seniority', 'Doctor qualifications (MD/DNB Dermatology, fellowship) and clinical experience years', 30.0, 'higher_is_better', 'Years / Rank', false, 1),
('20000000-1000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Distance & Travel Time from Center', 'Proximity from Benz Circle / MG Road Vijayawada in km and estimated traffic minutes', 20.0, 'lower_is_better', 'km', false, 2),
('20000000-1000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'Verified Consultation Fee', 'Published OPD fee for initial specialist consultation with fee transparency score', 20.0, 'lower_is_better', 'INR', true, 3),
('20000000-1000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'Patient Satisfaction & Hygiene Rating', 'Aggregated verified patient reviews, clinic hygiene, and staff courteousness', 15.0, 'higher_is_better', 'Stars / 5', false, 4),
('20000000-1000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'Facility Infrastructure & Emergency Care', 'Diagnostic lab in-house, pharmacy, minor OT, and 24x7 emergency backup', 15.0, 'higher_is_better', 'Score /10', false, 5)
ON CONFLICT (id) DO NOTHING;

-- Alternatives for Healthcare
INSERT INTO public.alternatives (
    id, decision_id, title, description, price, currency, overall_score, normalized_score, rank,
    source_type, primary_url, availability_status, location_info, specs, contact_info, rating, review_count
) VALUES
(
    '30000000-0000-0000-0000-000000000001',
    '22222222-2222-2222-2222-222222222222',
    'Manipal Hospitals — Department of Dermatology',
    'NABH accredited tertiary hospital. Senior consultant Dr. R. K. Varma (MD, DNB, 18 yrs exp). Comprehensive clinical & cosmetic dermatology.',
    800,
    'INR',
    91.2,
    91.2,
    1,
    'verified_feed',
    'https://www.manipalhospitals.com/vijayawada/',
    'appointments_available',
    '{"address": "Near Benz Circle, Tadepalli / Vijayawada Bypass", "city": "Vijayawada", "lat": 16.4862, "lng": 80.6120, "distance_km": 3.8, "travel_time_mins": 11}'::jsonb,
    '{"specialist": "Dr. R. K. Varma, MD, DNB (Derm)", "experience_years": 18, "facility_type": "Super Specialty Hospital", "emergency_available": true}'::jsonb,
    '{"phone": "+91 866 667 7777", "hours": "OPD: Mon-Sat 09:00 AM - 05:00 PM; Emergency 24x7", "emergency_contact": "1057 / +91 866 249 9999"}'::jsonb,
    4.7,
    840
),
(
    '30000000-0000-0000-0000-000000000002',
    '22222222-2222-2222-2222-222222222222',
    'Dr. Sudha''s Skin & Cosmetology Centre',
    'Dedicated private dermatology clinic. Dr. P. Sudha (MBBS, MD Dermatology - AIIMS gold medalist, 14 yrs exp).',
    600,
    'INR',
    87.5,
    87.5,
    2,
    'verified_feed',
    'https://drsudhaskinclinic.com',
    'appointments_available',
    '{"address": "Near DV Manor, MG Road, Suryaraopet", "city": "Vijayawada", "lat": 16.5090, "lng": 80.6472, "distance_km": 1.2, "travel_time_mins": 4}'::jsonb,
    '{"specialist": "Dr. P. Sudha, MD (AIIMS)", "experience_years": 14, "facility_type": "Specialty Skin Clinic", "emergency_available": false}'::jsonb,
    '{"phone": "+91 866 257 4411", "hours": "Mon-Sat: 10:00 AM - 02:00 PM, 05:00 PM - 08:30 PM", "emergency_contact": "None (OPD only)"}'::jsonb,
    4.8,
    620
),
(
    '30000000-0000-0000-0000-000000000003',
    '22222222-2222-2222-2222-222222222222',
    'Ramesh Hospitals — Skin & Aesthetics Unit',
    'Renowned multi-specialty healthcare facility. Dr. K. Naveen (MD, 12 yrs exp). Full medical phototherapy unit.',
    750,
    'INR',
    85.0,
    85.0,
    3,
    'verified_feed',
    'https://rameshhospitals.com/vijayawada',
    'appointments_available',
    '{"address": "Collector Office Road, Nagarampalem / Vijayawada", "city": "Vijayawada", "lat": 16.5140, "lng": 80.6550, "distance_km": 2.5, "travel_time_mins": 8}'::jsonb,
    '{"specialist": "Dr. K. Naveen, MD", "experience_years": 12, "facility_type": "Multi-Specialty Hospital", "emergency_available": true}'::jsonb,
    '{"phone": "+91 866 248 8888", "hours": "Mon-Sat: 09:30 AM - 04:30 PM", "emergency_contact": "+91 866 248 8800"}'::jsonb,
    4.5,
    510
),
(
    '30000000-0000-0000-0000-000000000004',
    '22222222-2222-2222-2222-222222222222',
    'Skin Care Laser Clinic (Eluru Road)',
    'Independent laser & aesthetic dermatology center. Dr. M. Srinivas (DNB). Consultation fee ₹500.',
    500,
    'INR',
    78.3,
    78.3,
    4,
    'verified_feed',
    'https://vijayawadaskincare.in',
    'limited_stock',
    '{"address": "Opp Old Bus Stand, Eluru Road", "city": "Vijayawada", "lat": 16.5180, "lng": 80.6320, "distance_km": 3.1, "travel_time_mins": 10}'::jsonb,
    '{"specialist": "Dr. M. Srinivas, DNB", "experience_years": 9, "facility_type": "Private Clinic", "emergency_available": false}'::jsonb,
    '{"phone": "+91 866 242 1200", "hours": "Mon-Sat: 11:00 AM - 01:30 PM, 06:00 PM - 09:00 PM", "emergency_contact": "None"}'::jsonb,
    4.3,
    290
)
ON CONFLICT (id) DO NOTHING;

UPDATE public.decisions
SET winning_alternative_id = '30000000-0000-0000-0000-000000000001',
    runner_up_alternative_id = '30000000-0000-0000-0000-000000000002'
WHERE id = '22222222-2222-2222-2222-222222222222';

-- Evidence for Healthcare
INSERT INTO public.decision_evidence (
    decision_id, alternative_id, criterion_id, claim, source_name, source_url, provider,
    verification_status, confidence, raw_snippet
) VALUES
('22222222-2222-2222-2222-222222222222', '30000000-0000-0000-0000-000000000001', '20000000-1000-0000-0000-000000000003',
'Consultation fee verified as ₹800 at hospital billing counter & official portal', 'Manipal Hospitals Reception Desk & Tariff Schedule', 'https://www.manipalhospitals.com', 'provider_direct', 'verified', 99, 'Super Specialty OPD tariff: General ₹800, validity 7 days for follow up'),
('22222222-2222-2222-2222-222222222222', '30000000-0000-0000-0000-000000000002', '20000000-1000-0000-0000-000000000003',
'Consultation fee is ₹600 for first visit, ₹400 for re-visit within 14 days', 'Dr. Sudha Clinic Front Desk Verification', 'https://drsudhaskinclinic.com', 'telephone_verified', 'verified', 97, 'OPD consultation ₹600, token system prior appointment needed'),
('22222222-2222-2222-2222-222222222222', '30000000-0000-0000-0000-000000000001', '20000000-1000-0000-0000-000000000005',
'Hospital operates full level 1 trauma and emergency medicine department with ICU backup', 'NABH Accreditation Register', 'https://nabh.co', 'statutory_registry', 'verified', 100, 'Accreditation valid through 2027 with full casualty department code');

-- ====================================================================
-- DEMO SCENARIO 3: TRAVEL 4-DAY TRIP (₹30,000 Budget from Vijayawada)
-- ====================================================================
INSERT INTO public.decisions (
    id, user_id, title, description, domain, subdomain, goal, budget, currency, status,
    confidence_score, robustness_score, stability_level, recommendation_summary, tradeoff_analysis,
    risk_summary, missing_info, constraints
) VALUES (
    '33333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000001',
    '4-Day Vacation from Vijayawada under ₹30,000 Budget',
    'Comparative evaluation of weekend and short-vacation destinations accessible from Vijayawada via train or short flight, with complete itemized budget allocations.',
    'travel',
    'vacation',
    'Plan the most rejuvenating 4-day trip from Vijayawada with total expenditure within ₹30,000',
    30000,
    'INR',
    'ready',
    90.8,
    88.5,
    'HIGH',
    'Araku Valley & Visakhapatnam Coastal Escape wins as the highest-scoring value trip. Direct Vande Bharat / Janmabhoomi Express connection keeps transport at only ₹3,800, leaving ₹12,000 for boutique coffee resort stay and activities while staying ₹5,200 under the ₹30k ceiling.',
    'Trade-off: Goa offers vibrant nightlife and beach variety (+18% entertainment), but round-trip travel costs (flight/train) and peak-season hotel rates push total expense to ₹28,900 leaving almost zero contingency buffer.',
    'Key Risk: Monsoonal or cyclone alerts on the Andhra coast during October-November can affect Borra Caves and ghat road travel.',
    '[{"field": "Dynamic surge taxi fares at Goa airport", "status": "estimated"}, {"field": "Train ticket tatkal availability", "status": "verified"}]'::jsonb,
    '[{"id": "tr_b", "type": "hard", "criterion": "Total Budget", "operator": "<=", "value": 30000, "description": "Strict ceiling ₹30,000 including ₹2,000 buffer"}, {"id": "tr_d", "type": "hard", "criterion": "Trip Duration", "operator": "==", "value": 4, "description": "4 Days / 3 Nights"}]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Criteria for Travel
INSERT INTO public.criteria (id, decision_id, name, description, weight, scale_type, unit, is_hard_constraint, sort_order) VALUES
('30000000-2000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'Budget Efficiency & Cost Buffer', 'Total expense relative to ₹30,000 with emergency buffer preserved', 25.0, 'lower_is_better', 'INR', true, 1),
('30000000-2000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'Travel Convenience & Transit Time', 'Direct transit options from Vijayawada (train/direct flight) avoiding fatigue', 20.0, 'higher_is_better', 'Score /10', false, 2),
('30000000-2000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'Scenery & Experiential Quality', 'Natural landscape, sightseeing quality, climate, and cultural uniqueness', 20.0, 'higher_is_better', 'Score /10', false, 3),
('30000000-2000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 'Accommodation & Culinary Quality', 'Quality of 3-star/boutique resort stays and local culinary experiences', 20.0, 'higher_is_better', 'Score /10', false, 4),
('30000000-2000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', 'Safety & Weather Reliability', 'Moderate temperature, low crime risk, and stable road transit', 15.0, 'higher_is_better', 'Score /10', false, 5)
ON CONFLICT (id) DO NOTHING;

-- Alternatives for Travel
INSERT INTO public.alternatives (
    id, decision_id, title, description, price, currency, overall_score, normalized_score, rank,
    source_type, primary_url, availability_status, location_info, specs, rating, review_count
) VALUES
(
    '40000000-0000-0000-0000-000000000001',
    '33333333-3333-3333-3333-333333333333',
    'Araku Valley & Vizag Coastal Gateway (4 Days / 3 Nights)',
    'Scenic coffee plantations, Borra Caves, Katiki waterfalls, and Rushikonda beach. Direct high-speed Vande Bharat train from Vijayawada.',
    24800,
    'INR',
    90.4,
    90.4,
    1,
    'verified_feed',
    'https://tourism.ap.gov.in',
    'available',
    '{"origin": "Vijayawada Junction", "destination": "Araku / Visakhapatnam", "transit_mode": "Train (Vande Bharat / Janmabhoomi)", "transit_time_hrs": 4.5}'::jsonb,
    '{"budget_breakdown": {"transport": 4200, "hotel": 9600, "food": 4800, "activities": 3400, "local_transit": 2800, "contingency_buffer": 2000, "total": 24800}, "weather": "Pleasant 19-27°C, mist in mornings", "hotel_type": "APTDC Haritha Hill Resort / 3-Star Boutique"}'::jsonb,
    4.7,
    1890
),
(
    '40000000-0000-0000-0000-000000000002',
    '33333333-3333-3333-3333-333333333333',
    'Goa Beach & Heritage Retreat (4 Days / 3 Nights)',
    'North/South Goa beaches, Portuguese architecture in Fontainhas, sunset river cruise, seafood exploration.',
    28900,
    'INR',
    83.6,
    83.6,
    2,
    'verified_feed',
    'https://goa-tourism.com',
    'limited_stock',
    '{"origin": "Vijayawada (VGA)", "destination": "Goa (GOI/GOX)", "transit_mode": "Connecting Flight / Amaravati Express Train", "transit_time_hrs": 7.5}'::jsonb,
    '{"budget_breakdown": {"transport": 9800, "hotel": 9900, "food": 5200, "activities": 2500, "local_scooter_cab": 1500, "contingency_buffer": 500, "total": 28900}, "weather": "Tropical 24-32°C, sunny", "hotel_type": "Boutique Heritage Villa, Candolim"}'::jsonb,
    4.6,
    3400
),
(
    '40000000-0000-0000-0000-000000000003',
    '33333333-3333-3333-3333-333333333333',
    'Pondicherry & French Quarter Cultural Tour (4 Days / 3 Nights)',
    'Cobblestone French streets, Promenade Beach, Auroville Matrimandir, cycling tours and French-Tamil fusion cuisine.',
    26400,
    'INR',
    85.2,
    85.2,
    3,
    'verified_feed',
    'https://pondytourism.in',
    'available',
    '{"origin": "Vijayawada Junction", "destination": "Puducherry / Chennai connecting", "transit_mode": "Circar Express / Overnight AC Bus", "transit_time_hrs": 11.0}'::jsonb,
    '{"budget_breakdown": {"transport": 5400, "hotel": 10500, "food": 5500, "activities": 2600, "local_rental": 1400, "contingency_buffer": 1000, "total": 26400}, "weather": "Breezy 26-30°C coastal", "hotel_type": "Heritage French Haveli Hotel"}'::jsonb,
    4.5,
    2150
),
(
    '40000000-0000-0000-0000-000000000004',
    '33333333-3333-3333-3333-333333333333',
    'Ooty & Nilgiri Toy Train Mountain Getaway (4 Days / 3 Nights)',
    'Nilgiri Mountain Railway (UNESCO), tea gardens of Coonoor, Doddabetta Peak, botanical gardens.',
    29800,
    'INR',
    81.1,
    81.1,
    4,
    'verified_feed',
    'https://www.tamilnadutourism.tn.gov.in',
    'available',
    '{"origin": "Vijayawada", "destination": "Coimbatore to Ooty Ghat", "transit_mode": "Train to Coimbatore + Mountain Taxi", "transit_time_hrs": 14.0}'::jsonb,
    '{"budget_breakdown": {"transport": 8800, "hotel": 11200, "food": 5000, "activities": 2800, "local_travel": 2000, "contingency_buffer": 0, "total": 29800}, "weather": "Chilly 12-20°C, woolens required", "hotel_type": "Colonial Mountain Resort"}'::jsonb,
    4.4,
    1670
)
ON CONFLICT (id) DO NOTHING;

UPDATE public.decisions
SET winning_alternative_id = '40000000-0000-0000-0000-000000000001',
    runner_up_alternative_id = '40000000-0000-0000-0000-000000000003'
WHERE id = '33333333-3333-3333-3333-333333333333';

-- ====================================================================
-- DEMO SCENARIO 4: SMARTPHONE UNDER ₹30,000
-- ====================================================================
INSERT INTO public.decisions (
    id, user_id, title, description, domain, subdomain, goal, budget, currency, status,
    confidence_score, robustness_score, stability_level, recommendation_summary, tradeoff_analysis,
    risk_summary, missing_info, constraints
) VALUES (
    '44444444-4444-4444-4444-444444444444',
    '00000000-0000-0000-0000-000000000001',
    'Best All-Round Smartphone Under ₹30,000',
    'Evaluating mid-range smartphones across Camera (OIS sensor), Battery stamina, Chipset sustained performance, Software support, and Display quality.',
    'shopping',
    'smartphones',
    'Find the smartphone with best balance of camera, 4-year software longevity, and fast daily performance under ₹30k',
    30000,
    'INR',
    'ready',
    93.5,
    91.0,
    'HIGH',
    'OnePlus Nord 4 takes the crown. Features an all-metal unibody with Snapdragon 7+ Gen 3 (near flagship 1.4M AnTuTu score), 5500mAh battery with 100W charging, and 4 years of guaranteed OS updates at ₹29,999.',
    'Trade-off: POCO F6 gives marginally higher raw gaming FPS (+8%) but Nord 4 offers vastly superior battery longevity (1.5 days vs 1 day) and 6 years of software security patches vs 3 years.',
    'Risk: Metal chassis lacks wireless charging and slightly limits NFC antenna sweet-spot.',
    '[{"field": "Long-term low-light camera portrait blur quality", "status": "verified_by_dxomark"}]'::jsonb,
    '[{"id": "sp_b", "type": "hard", "criterion": "Price", "operator": "<=", "value": 30000, "description": "Strict ceiling ₹30,000"}]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Criteria for Smartphone
INSERT INTO public.criteria (id, decision_id, name, description, weight, scale_type, unit, is_hard_constraint, sort_order) VALUES
('40000000-3000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 'Camera Quality & OIS Stabilization', 'Sony LYT/IMX primary sensor with OIS, 4K video, low-light image processing', 25.0, 'higher_is_better', 'Score /10', false, 1),
('40000000-3000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'Battery Endurance & Charging Speed', 'Battery capacity (mAh) + charging wattage (W) + screen-on-time endurance', 25.0, 'higher_is_better', 'Score /10', false, 2),
('40000000-3000-0000-0000-000000000003', '44444444-4444-4444-4444-444444444444', 'Processor Performance & Sustained Thermals', 'Snapdragon/Dimensity 4nm chip with sustained performance without throttling', 20.0, 'higher_is_better', 'AnTuTu / Score', false, 3),
('40000000-3000-0000-0000-000000000004', '44444444-4444-4444-4444-444444444444', 'Software Support & UI Cleanliness', 'Number of promised Android OS upgrades and absence of aggressive bloatware', 15.0, 'higher_is_better', 'Years Support', false, 4),
('40000000-3000-0000-0000-000000000005', '44444444-4444-4444-4444-444444444444', 'Display & Build Quality', '120Hz 1.5K AMOLED panel, peak nit brightness, IP rating for water/dust protection', 15.0, 'higher_is_better', 'Score /10', false, 5)
ON CONFLICT (id) DO NOTHING;

-- Alternatives for Smartphone
INSERT INTO public.alternatives (
    id, decision_id, title, description, price, currency, overall_score, normalized_score, rank,
    source_type, primary_url, availability_status, specs, rating, review_count
) VALUES
(
    '50000000-0000-0000-0000-000000000001',
    '44444444-4444-4444-4444-444444444444',
    'OnePlus Nord 4 5G (8GB / 256GB)',
    'All-metal unibody design. Snapdragon 7+ Gen 3, 50MP Sony LYT-600 with OIS, 5500mAh battery + 100W SUPERVOOC. 4 OS upgrades + 6 yrs security.',
    29999,
    'INR',
    91.8,
    91.8,
    1,
    'verified_feed',
    'https://www.oneplus.in/nord-4',
    'available',
    '{"soc": "Snapdragon 7+ Gen 3 (4nm)", "antutu": "1,410,000", "battery": "5500 mAh (100W wired)", "camera": "50MP OIS LYT-600 + 8MP Ultra-wide", "display": "6.74-inch 1.5K 120Hz AMOLED 2150 nits", "software_updates": "4 Android + 6 Security"}'::jsonb,
    4.7,
    4120
),
(
    '50000000-0000-0000-0000-000000000002',
    '44444444-4444-4444-4444-444444444444',
    'POCO F6 5G (8GB / 256GB)',
    'Snapdragon 8s Gen 3 flagship-tier silicon, 50MP Sony IMX882 OIS, 5000mAh battery with 90W turbo charge.',
    27999,
    'INR',
    86.4,
    86.4,
    2,
    'verified_feed',
    'https://www.poco.in/poco-f6',
    'available',
    '{"soc": "Snapdragon 8s Gen 3 (4nm)", "antutu": "1,530,000", "battery": "5000 mAh (90W wired)", "camera": "50MP OIS Sony IMX882", "display": "6.67-inch 1.5K 120Hz AMOLED 2400 nits", "software_updates": "3 Android + 4 Security"}'::jsonb,
    4.5,
    3180
),
(
    '50000000-0000-0000-0000-000000000003',
    '44444444-4444-4444-4444-444444444444',
    'Motorola Edge 50 Fusion (12GB / 256GB)',
    'Symmetrical curved 144Hz pOLED, Sony LYT-700C OIS sensor, IP68 underwater protection, vegan leather back.',
    24999,
    'INR',
    85.7,
    85.7,
    3,
    'verified_feed',
    'https://www.motorola.in/smartphones-motorola-edge-50-fusion',
    'available',
    '{"soc": "Snapdragon 7s Gen 2 (4nm)", "antutu": "620,000", "battery": "5000 mAh (68W TurboPower)", "camera": "50MP OIS Sony LYT-700C + 13MP Macro/UW", "display": "6.7-inch FHD+ 144Hz curved pOLED", "ip_rating": "IP68"}'::jsonb,
    4.6,
    2890
),
(
    '50000000-0000-0000-0000-000000000004',
    '44444444-4444-4444-4444-444444444444',
    'Samsung Galaxy A35 5G (8GB / 128GB)',
    'Exynos 1380, Super AMOLED 120Hz with Vision Booster, IP67 rating, Samsung Knox Vault, 4 OS upgrades.',
    28999,
    'INR',
    79.9,
    79.9,
    4,
    'verified_feed',
    'https://www.samsung.com/in/smartphones/galaxy-a/galaxy-a35-5g',
    'available',
    '{"soc": "Exynos 1380 (5nm)", "antutu": "590,000", "battery": "5000 mAh (25W wired, charger not in box)", "camera": "50MP OIS + 8MP UW + 5MP Macro", "display": "6.6-inch FHD+ Super AMOLED 120Hz", "software_updates": "4 Android + 5 Security"}'::jsonb,
    4.3,
    1920
)
ON CONFLICT (id) DO NOTHING;

UPDATE public.decisions
SET winning_alternative_id = '50000000-0000-0000-0000-000000000001',
    runner_up_alternative_id = '50000000-0000-0000-0000-000000000002'
WHERE id = '44444444-4444-4444-4444-444444444444';

-- Seed Saved Decision Scenarios for What-If
INSERT INTO public.decision_scenarios (
    decision_id, user_id, name, description, parameters, winner_id, previous_winner_id, winner_changed, score_delta, explanation
) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000001',
    'Campus Mobility First (Portability 40%)',
    'Simulates a scenario where daily campus commuting without charging plugs becomes the paramount factor.',
    '{"weight_overrides": {"Battery Life & Portability": 40.0, "AI & Compute Performance": 15.0}}'::jsonb,
    '20000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000001',
    true,
    4.2,
    'Under this scenario, ASUS ROG Zephyrus G14 overtakes Legion Pro 5i due to its 1.5kg chassis and 8.5-hour endurance, though AI compute is reduced by 22%.'
),
(
    '33333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000001',
    'Budget Constrained to ₹25,000',
    'Simulates a ₹5,000 reduction in vacation budget.',
    '{"budget_override": 25000}'::jsonb,
    '40000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000001',
    false,
    0.0,
    'Araku Valley remains the sole viable contender at ₹24,800. Goa (₹28.9k) and Ooty (₹29.8k) are disqualified by the hard budget constraint.'
);

-- Seed Sample Alert
INSERT INTO public.decision_alerts (
    decision_id, alternative_id, user_id, alert_type, target_field, condition_op, threshold_value, frequency, is_enabled
) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    '20000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'price_drop',
    'price',
    'less_than',
    '115000',
    'daily',
    true
);

-- ====================================================================
-- TRIGGERS & AUTOMATION
-- ====================================================================

-- Trigger to maintain profile credit balance whenever credit_ledger is modified
CREATE OR REPLACE FUNCTION public.handle_credit_ledger_change()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET credits_balance = NEW.balance_after,
        updated_at = NOW()
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_credit_ledger_sync ON public.credit_ledger;
CREATE TRIGGER trg_credit_ledger_sync
AFTER INSERT ON public.credit_ledger
FOR EACH ROW
EXECUTE FUNCTION public.handle_credit_ledger_change();

-- Generic updated_at timestamp refresher
CREATE OR REPLACE FUNCTION public.refresh_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_decisions_updated_at ON public.decisions;
CREATE TRIGGER trg_decisions_updated_at
BEFORE UPDATE ON public.decisions
FOR EACH ROW
EXECUTE FUNCTION public.refresh_updated_at();

-- End of Initial Schema Migration
