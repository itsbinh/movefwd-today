-- Seed sample resources for Movefwd.today
-- Run this after the schema migration

INSERT INTO resources (name, description, categories, eligibility, address, city, state, zip, latitude, longitude, phone, website, application_guide, verified) VALUES
-- Food resources
('Downtown Food Pantry', 'Emergency food assistance for individuals and families', ARRAY['food'], 'Anyone in need of food assistance', '123 Main St', 'Los Angeles', 'CA', '90012', 34.0522, -118.2437, '(213) 555-0100', 'https://example.org/food-pantry', 'Walk-in during operating hours. Bring ID if available.', true),
('Community Kitchen', 'Free meals served daily', ARRAY['food'], 'Open to all', '456 Oak Ave', 'Los Angeles', 'CA', '90014', 34.0530, -118.2440, '(213) 555-0101', 'https://example.org/community-kitchen', 'No ID required. Open 11am-1pm daily.', true),
('LA Food Bank', 'Large-scale food distribution', ARRAY['food'], 'Income verification may be required', '789 Wilshire Blvd', 'Los Angeles', 'CA', '90017', 34.0535, -118.2600, '(213) 555-0102', 'https://example.org/la-food-bank', 'Bring proof of residence and household size.', true),

-- Housing resources
('Housing Authority Office', 'Public housing and Section 8 assistance', ARRAY['housing'], 'Income-based eligibility', '111 Hill St', 'Los Angeles', 'CA', '90012', 34.0520, -118.2430, '(213) 555-0200', 'https://example.org/housing-auth', 'Apply online or in person. Bring ID, income proof, and SSN.', true),
('Homeless Shelter Coalition', 'Emergency shelter and transitional housing', ARRAY['housing'], 'Homeless individuals and families', '222 Broadway', 'Los Angeles', 'CA', '90012', 34.0515, -118.2425, '(213) 555-0201', 'https://example.org/shelter-coalition', 'Call for intake. Bring minimal belongings.', true),
('Eviction Defense Center', 'Legal assistance for tenants facing eviction', ARRAY['housing', 'legal'], 'Tenants facing eviction', '333 Spring St', 'Los Angeles', 'CA', '90013', 34.0500, -118.2450, '(213) 555-0202', 'https://example.org/eviction-defense', 'Call for appointment. Bring lease and any notices received.', true),

-- Health resources
('Community Health Clinic', 'Primary care, preventive services', ARRAY['health'], 'All residents, sliding scale fees', '444 Flower St', 'Los Angeles', 'CA', '90015', 34.0400, -118.2600, '(213) 555-0300', 'https://example.org/health-clinic', 'Call for appointment. Bring ID and proof of income if available.', true),
('Mental Health Services', 'Counseling and mental health support', ARRAY['health'], 'All residents', '555 Grand Ave', 'Los Angeles', 'CA', '90017', 34.0530, -118.2550, '(213) 555-0301', 'https://example.org/mental-health', 'Call for appointment. Accepts Medi-Cal and most insurance.', true),
('Free Dental Clinic', 'Dental care for those without insurance', ARRAY['health'], 'Uninsured or underinsured', '666 Hope St', 'Los Angeles', 'CA', '90015', 34.0390, -118.2610, '(213) 555-0302', 'https://example.org/free-dental', 'Walk-in clinic on first-come basis.', true),

-- Legal resources
('Legal Aid Foundation', 'Free civil legal services', ARRAY['legal'], 'Low-income residents', '777 Justice Way', 'Los Angeles', 'CA', '90012', 34.0510, -118.2445, '(213) 555-0400', 'https://example.org/legal-aid', 'Call for eligibility screening. Bring income documentation.', true),
('Immigrant Resource Center', 'Legal help for immigrants', ARRAY['legal'], 'Immigrants of all statuses', '888 Freedom Blvd', 'Los Angeles', 'CA', '90014', 34.0535, -118.2435, '(213) 555-0401', 'https://example.org/immigrant-resource', 'Walk-in or call. Services in multiple languages.', true),

-- Employment resources
('Workforce Development Center', 'Job training and employment services', ARRAY['employment'], 'All job seekers', '999 Career Dr', 'Los Angeles', 'CA', '90015', 34.0405, -118.2590, '(213) 555-0500', 'https://example.org/workforce-dev', 'Register online or walk-in. Free career counseling.', true),
('Resume & Interview Workshop', 'Help with job search skills', ARRAY['employment'], 'All job seekers', '111 Opportunity Ln', 'Los Angeles', 'CA', '90016', 34.0350, -118.2650, '(213) 555-0501', 'https://example.org/resume-workshop', 'Drop-in sessions on Wednesdays 2-4pm.', true),

-- Education resources
('Adult Education Center', 'GED prep and ESL classes', ARRAY['education'], 'Adult learners', '222 Learning Way', 'Los Angeles', 'CA', '90015', 34.0410, -118.2580, '(213) 555-0600', 'https://example.org/adult-ed', 'Registration ongoing. Free ESL and GED classes.', true),
('Career Technical Training', 'Vocational training programs', ARRAY['education', 'employment'], 'Adult learners seeking job skills', '333 Skill St', 'Los Angeles', 'CA', '90014', 34.0530, -118.2420, '(213) 555-0601', 'https://example.org/vocational', 'Apply online. Some programs have waiting lists.', true);

-- Insert a sample profile (for testing)
INSERT INTO profiles (id, email, role, name, organization_name) 
VALUES ('00000000-0000-0000-0000-000000000001', 'demo@movefwd.today', 'organization', 'Demo User', 'Movefwd Demo');

-- Sample opportunities
INSERT INTO opportunities (organization_id, title, description, type, location) VALUES
('00000000-0000-0000-0000-000000000001', 'Food Pantry Volunteer', 'Help distribute food to families in need', 'volunteer', '123 Main St, Los Angeles'),
('00000000-0000-0000-0000-000000000001', 'Donation Drive', 'Collect canned goods and non-perishables', 'donation', '456 Oak Ave, Los Angeles'),
('00000000-0000-0000-0000-000000000001', 'Mentorship Program', 'Career mentoring for job seekers', 'both', '999 Career Dr, Los Angeles');
