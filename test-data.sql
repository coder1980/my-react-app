-- Test data for Halloween Costume Contest Voting
-- Run this in your Supabase SQL Editor

-- First, let's clear any existing test data (optional)
-- DELETE FROM device_clicks WHERE device_id LIKE 'test_%';

-- Insert test voting data
INSERT INTO device_clicks (device_id, device_type, user_agent, best_dressed, most_creative, funniest, voted_at) VALUES

-- Test votes for Best Dressed category
('test_device_001', 'Mobile', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', 'Chetan', 'Aditi', 'Mohit', '2024-10-18 10:00:00'),
('test_device_002', 'Mobile', 'Mozilla/5.0 (Android 12; Mobile; rv:91.0)', 'Aditi', 'Anirudh', 'Medhavi', '2024-10-18 10:05:00'),
('test_device_003', 'Desktop', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'Chetan', 'Anusha', 'Shruti', '2024-10-18 10:10:00'),
('test_device_004', 'Mobile', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', 'Anirudh', 'Mohit', 'Sanjay', '2024-10-18 10:15:00'),
('test_device_005', 'Tablet', 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)', 'Aditi', 'Medhavi', 'Amit', '2024-10-18 10:20:00'),

-- More votes to create interesting results
('test_device_006', 'Mobile', 'Mozilla/5.0 (Android 11; Mobile; rv:90.0)', 'Chetan', 'Shruti', 'Sushmita', '2024-10-18 10:25:00'),
('test_device_007', 'Desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Anusha', 'Kripa', 'Tanu', '2024-10-18 10:30:00'),
('test_device_008', 'Mobile', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7 like Mac OS X)', 'Mohit', 'Ritesh', 'Keyur', '2024-10-18 10:35:00'),
('test_device_009', 'Mobile', 'Mozilla/5.0 (Android 10; Mobile; rv:89.0)', 'Medhavi', 'Neha', 'Subhash', '2024-10-18 10:40:00'),
('test_device_010', 'Desktop', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6)', 'Shruti', 'Rupa', 'Chetan', '2024-10-18 10:45:00'),

-- Additional votes to create ties and interesting patterns
('test_device_011', 'Mobile', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X)', 'Sanjay', 'Amit', 'Aditi', '2024-10-18 10:50:00'),
('test_device_012', 'Tablet', 'Mozilla/5.0 (iPad; CPU OS 14_8 like Mac OS X)', 'Amit', 'Sushmita', 'Anirudh', '2024-10-18 10:55:00'),
('test_device_013', 'Mobile', 'Mozilla/5.0 (Android 12; Mobile; rv:92.0)', 'Sushmita', 'Kripa', 'Anusha', '2024-10-18 11:00:00'),
('test_device_014', 'Desktop', 'Mozilla/5.0 (Windows NT 11.0; Win64; x64)', 'Kripa', 'Tanu', 'Mohit', '2024-10-18 11:05:00'),
('test_device_015', 'Mobile', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X)', 'Tanu', 'Ritesh', 'Medhavi', '2024-10-18 11:10:00'),

-- More votes to create competitive results
('test_device_016', 'Mobile', 'Mozilla/5.0 (Android 11; Mobile; rv:91.0)', 'Ritesh', 'Keyur', 'Shruti', '2024-10-18 11:15:00'),
('test_device_017', 'Desktop', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'Keyur', 'Neha', 'Sanjay', '2024-10-18 11:20:00'),
('test_device_018', 'Mobile', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', 'Neha', 'Subhash', 'Amit', '2024-10-18 11:25:00'),
('test_device_019', 'Tablet', 'Mozilla/5.0 (iPad; CPU OS 15_1 like Mac OS X)', 'Subhash', 'Rupa', 'Sushmita', '2024-10-18 11:30:00'),
('test_device_020', 'Mobile', 'Mozilla/5.0 (Android 12; Mobile; rv:93.0)', 'Rupa', 'Chetan', 'Kripa', '2024-10-18 11:35:00'),

-- Final votes to create some ties
('test_device_021', 'Desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Chetan', 'Aditi', 'Tanu', '2024-10-18 11:40:00'),
('test_device_022', 'Mobile', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_3 like Mac OS X)', 'Aditi', 'Anirudh', 'Ritesh', '2024-10-18 11:45:00'),
('test_device_023', 'Mobile', 'Mozilla/5.0 (Android 11; Mobile; rv:90.0)', 'Anirudh', 'Anusha', 'Keyur', '2024-10-18 11:50:00'),
('test_device_024', 'Desktop', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_16_0)', 'Anusha', 'Mohit', 'Neha', '2024-10-18 11:55:00'),
('test_device_025', 'Mobile', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4 like Mac OS X)', 'Mohit', 'Medhavi', 'Subhash', '2024-10-18 12:00:00');

-- Check the results
SELECT 
  best_dressed,
  COUNT(*) as best_dressed_votes
FROM device_clicks 
WHERE device_id LIKE 'test_%'
GROUP BY best_dressed 
ORDER BY best_dressed_votes DESC;

SELECT 
  most_creative,
  COUNT(*) as most_creative_votes
FROM device_clicks 
WHERE device_id LIKE 'test_%'
GROUP BY most_creative 
ORDER BY most_creative_votes DESC;

SELECT 
  funniest,
  COUNT(*) as funniest_votes
FROM device_clicks 
WHERE device_id LIKE 'test_%'
GROUP BY funniest 
ORDER BY funniest_votes DESC;
