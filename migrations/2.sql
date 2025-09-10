
CREATE TABLE materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trainer_user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_materials_trainer ON materials(trainer_user_id);
CREATE INDEX idx_materials_active ON materials(is_active);
