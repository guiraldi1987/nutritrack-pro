
-- Users table to store profile information
CREATE TABLE user_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL UNIQUE, -- Links to Mocha Users Service
  name TEXT NOT NULL,
  user_type TEXT NOT NULL, -- 'student' or 'trainer'
  phone TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table for additional student-specific data
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL UNIQUE,
  trainer_id TEXT, -- References trainer's user_id
  height REAL,
  initial_weight REAL,
  current_weight REAL,
  last_measurement_date DATE,
  next_measurement_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Anamnesis table for storing the comprehensive health assessment
CREATE TABLE anamnesis (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_user_id TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT 0,
  
  -- General Information
  age INTEGER,
  state TEXT,
  city TEXT,
  whatsapp TEXT,
  lean_weight REAL,
  body_fat_percentage REAL,
  waist_circumference REAL,
  right_arm_contracted REAL,
  right_arm_relaxed REAL,
  left_arm_contracted REAL,
  left_arm_relaxed REAL,
  thigh_midpoint REAL,
  hip_circumference REAL,
  
  -- Routine and Goals
  profession TEXT,
  work_schedule TEXT,
  studies_schedule TEXT,
  physical_activities TEXT,
  activity_schedule TEXT,
  sleep_schedule TEXT,
  wake_schedule TEXT,
  body_goals TEXT,
  consultation_goals TEXT,
  desired_body_photo_url TEXT,
  
  -- Training
  no_rest_duration TEXT,
  has_periodization BOOLEAN,
  feels_stagnation BOOLEAN,
  muscle_pump_level TEXT,
  
  -- Substances
  prescribed_medications TEXT,
  legal_illegal_drugs TEXT,
  anabolics_contraceptives TEXT,
  nootropics TEXT,
  stimulants TEXT,
  
  -- Current Diet
  food_diary TEXT,
  bowel_frequency TEXT,
  digestive_issues TEXT,
  food_availability TEXT,
  allergies_intolerances TEXT,
  
  -- Neurological Aspects
  motivation_level INTEGER,
  concentration_level INTEGER,
  memory_level INTEGER,
  sexual_initiative_level INTEGER,
  pleasure_level INTEGER,
  empathy_level INTEGER,
  sociability_level INTEGER,
  verbal_fluency_level INTEGER,
  
  -- Rest and Sleep
  sleep_onset_time TEXT,
  wakes_rested BOOLEAN,
  night_awakenings INTEGER,
  breathing_method TEXT,
  fatigue_peaks TEXT,
  smartwatch_data_url TEXT,
  
  -- Clinical History
  preexisting_diseases TEXT,
  surgeries TEXT,
  dental_treatments TEXT,
  metals_implants TEXT,
  covid_vaccination_doses INTEGER,
  recent_health_changes TEXT,
  clinical_exams_url TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Body measurements tracking
CREATE TABLE body_measurements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_user_id TEXT NOT NULL,
  weight REAL,
  waist_circumference REAL,
  right_arm_contracted REAL,
  right_arm_relaxed REAL,
  left_arm_contracted REAL,
  left_arm_relaxed REAL,
  thigh_midpoint REAL,
  hip_circumference REAL,
  measurement_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Diet plans
CREATE TABLE diet_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_user_id TEXT NOT NULL,
  trainer_user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  plan_content TEXT NOT NULL, -- JSON with meal plans
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- File uploads (photos, exams, etc.)
CREATE TABLE uploaded_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'body_photo', 'exam', 'desired_body'
  file_url TEXT NOT NULL,
  file_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_trainer_id ON students(trainer_id);
CREATE INDEX idx_anamnesis_student_user_id ON anamnesis(student_user_id);
CREATE INDEX idx_body_measurements_student_user_id ON body_measurements(student_user_id);
CREATE INDEX idx_diet_plans_student_user_id ON diet_plans(student_user_id);
CREATE INDEX idx_diet_plans_trainer_user_id ON diet_plans(trainer_user_id);
CREATE INDEX idx_uploaded_files_user_id ON uploaded_files(user_id);
