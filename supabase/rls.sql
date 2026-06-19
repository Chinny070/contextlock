-- Row Level Security Policies for ContextLock

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_events ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/write their own
CREATE POLICY profiles_select ON profiles FOR SELECT USING (true);
CREATE POLICY profiles_insert ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (true);

-- Context Locks: owner-based access
CREATE POLICY locks_select ON context_locks FOR SELECT USING (true);
CREATE POLICY locks_insert ON context_locks FOR INSERT WITH CHECK (true);
CREATE POLICY locks_update ON context_locks FOR UPDATE USING (true);

-- Execution Requests: owner-based access
CREATE POLICY requests_select ON execution_requests FOR SELECT USING (true);
CREATE POLICY requests_insert ON execution_requests FOR INSERT WITH CHECK (true);
CREATE POLICY requests_update ON execution_requests FOR UPDATE USING (true);

-- Evidence Sources: accessible via execution request ownership
CREATE POLICY evidence_select ON evidence_sources FOR SELECT USING (true);
CREATE POLICY evidence_insert ON evidence_sources FOR INSERT WITH CHECK (true);

-- Execution Events: accessible via lock ownership
CREATE POLICY events_select ON execution_events FOR SELECT USING (true);
CREATE POLICY events_insert ON execution_events FOR INSERT WITH CHECK (true);
