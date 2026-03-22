INSERT INTO links (slug, target_url, created_at) VALUES
 ('goog01', 'https://www.google.com', NOW()),
 ('ghub02', 'https://www.github.com', NOW()),
 ('amzn03', 'https://www.amazon.com', NOW());

INSERT INTO click_events (link_id, clicked_at, user_agent) VALUES
(1, NOW() - INTERVAL '6 days', 'Mozilla/5.0 (Windows NT 10.0)'),
(1, NOW() - INTERVAL '5 days', 'Mozilla/5.0 (Macintosh)'),
(1, NOW() - INTERVAL '5 days', 'Mozilla/5.0 (iPhone)'),
(1, NOW() - INTERVAL '4 days', 'Mozilla/5.0 (Windows NT 10.0)'),
(1, NOW() - INTERVAL '3 days', 'Mozilla/5.0 (Android)'),
(1, NOW() - INTERVAL '2 days', 'Mozilla/5.0 (Macintosh)'),
(1, NOW() - INTERVAL '1 days', 'Mozilla/5.0 (Windows NT 10.0)'),
(2, NOW() - INTERVAL '3 days', 'Mozilla/5.0 (Macintosh)'),
(2, NOW() - INTERVAL '2 days', 'Mozilla/5.0 (iPhone)'),
(3, NOW() - INTERVAL '1 days', 'Mozilla/5.0 (Windows NT 10.0)');