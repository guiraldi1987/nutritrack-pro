
CREATE TABLE material_student_access (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  material_id INTEGER NOT NULL,
  student_user_id TEXT NOT NULL,
  granted_by_trainer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_material_student_access_material_id ON material_student_access(material_id);
CREATE INDEX idx_material_student_access_student ON material_student_access(student_user_id);
