CREATE TABLE links (
                       id          BIGSERIAL PRIMARY KEY,
                       slug        VARCHAR(10) NOT NULL UNIQUE,
                       target_url  TEXT NOT NULL,
                       created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE click_events (
                              id          BIGSERIAL PRIMARY KEY,
                              link_id     BIGINT NOT NULL REFERENCES links(id),
                              clicked_at  TIMESTAMP NOT NULL DEFAULT NOW(),
                              user_agent  TEXT
);

-- Indexes for performance
CREATE UNIQUE INDEX idx_links_slug ON links(slug);
CREATE INDEX idx_click_events_link_id ON click_events(link_id);