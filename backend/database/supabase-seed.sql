

INSERT INTO tests (id, name, description, price, original_price, category, parameters, report_time, fasting) VALUES
('1', 'Complete Blood Count (CBC)', 'Comprehensive blood analysis including RBC, WBC, platelets', 399, 599, 'routine', 28, '6 hours', false),
('2', 'Thyroid Profile', 'Measures TSH, T3, T4 levels', 699, 999, 'thyroid', 3, '24 hours', false),
('3', 'HbA1c (Diabetes)', 'Average blood sugar over 3 months', 499, NULL, 'diabetes', 1, '12 hours', true),
('4', 'Lipid Profile', 'Cholesterol and triglyceride levels', 599, NULL, 'heart', 8, '12 hours', true),
('5', 'Liver Function Test', 'Assess liver health', 549, 799, 'liver', 12, '18 hours', false),
('6', 'Vitamin D', 'Vitamin D levels in blood', 899, NULL, 'vitamin', 1, '24 hours', false),
('7', 'Kidney Function Test', 'Creatinine, urea, uric acid', 599, 849, 'kidney', 10, '18 hours', false),
('8', 'Iron Studies', 'Serum iron, TIBC, ferritin', 799, 1099, 'iron', 4, '24 hours', true)
ON CONFLICT (id) DO NOTHING;

-- Insert Packages
INSERT INTO packages (id, name, description, price, original_price, tests_count, parameters, report_time, popular, featured) VALUES
('pkg1', 'Essential Health Checkup', 'Basic screening package', 999, 1999, 5, 59, '24 hours', true, true),
('pkg2', 'Diabetes Care Package', 'Comprehensive diabetes monitoring', 1499, 2499, 7, 32, '24 hours', true, true),
('pkg3', 'Heart Health Package', 'Complete cardiovascular assessment', 1799, 2999, 8, 45, '24 hours', false, true),
('pkg4', 'Women''s Health Package', 'Designed for women''s health', 2499, 3999, 8, 48, '48 hours', true, true)
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Orders
INSERT INTO orders (id, total_amount, date, status, appointment_date, appointment_time) VALUES
('ORD-SAMPLE1', 399, '2025-11-02', 'SAMPLE_COLLECTED', NULL, NULL),
('ORD-SAMPLE2', 399, '2025-11-02', 'SAMPLE_COLLECTED', NULL, NULL),
('ORD-SAMPLE3', 399, '2025-11-02', 'SAMPLE_COLLECTED', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert Order Items for Sample Orders
INSERT INTO order_items (order_id, test_id, test_name, test_price) VALUES
('ORD-SAMPLE1', '1', 'Complete Blood Count (CBC)', 399),
('ORD-SAMPLE2', '1', 'Complete Blood Count (CBC)', 399),
('ORD-SAMPLE3', '1', 'Complete Blood Count (CBC)', 399)
ON CONFLICT DO NOTHING;
