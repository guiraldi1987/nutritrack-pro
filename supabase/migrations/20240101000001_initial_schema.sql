-- Initial schema migration for NutriTrack Pro
-- Based on existing migrations from the project

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table to store profile information
CREATE TABLE user_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE, -- Links to Auth User
  name TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('student', 'trainer')),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table for additional student-specific data
CREATE TABLE students (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  trainer_id TEXT, -- References trainer's user_id
  height REAL,
  initial_weight REAL,
  current_weight REAL,
  last_measurement_date DATE,
  next_measurement_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Anamnesis table for storing the comprehensive health assessment
CREATE TABLE anamnesis (
  id BIGSERIAL PRIMARY KEY,
  student_user_id TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  
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
  motivation_level INTEGER CHECK (motivation_level >= 1 AND motivation_level <= 10),
  concentration_level INTEGER CHECK (concentration_level >= 1 AND concentration_level <= 10),
  memory_level INTEGER CHECK (memory_level >= 1 AND memory_level <= 10),
  sexual_initiative_level INTEGER CHECK (sexual_initiative_level >= 1 AND sexual_initiative_level <= 10),
  pleasure_level INTEGER CHECK (pleasure_level >= 1 AND pleasure_level <= 10),
  empathy_level INTEGER CHECK (empathy_level >= 1 AND empathy_level <= 10),
  sociability_level INTEGER CHECK (sociability_level >= 1 AND sociability_level <= 10),
  verbal_fluency_level INTEGER CHECK (verbal_fluency_level >= 1 AND verbal_fluency_level <= 10),
  
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
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Body measurements tracking
CREATE TABLE body_measurements (
  id BIGSERIAL PRIMARY KEY,
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Diet plans
CREATE TABLE diet_plans (
  id BIGSERIAL PRIMARY KEY,
  student_user_id TEXT NOT NULL,
  trainer_user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  plan_content TEXT NOT NULL, -- JSON with meal plans
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Materials table
CREATE TABLE materials (
  id BIGSERIAL PRIMARY KEY,
  trainer_user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Material student access
CREATE TABLE material_student_access (
  id BIGSERIAL PRIMARY KEY,
  material_id BIGINT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  student_user_id TEXT NOT NULL,
  granted_by_trainer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_trainer_id ON students(trainer_id);
CREATE INDEX idx_anamnesis_student_user_id ON anamnesis(student_user_id);
CREATE INDEX idx_body_measurements_student_user_id ON body_measurements(student_user_id);
CREATE INDEX idx_body_measurements_date ON body_measurements(measurement_date);
CREATE INDEX idx_diet_plans_student_user_id ON diet_plans(student_user_id);
CREATE INDEX idx_diet_plans_trainer_user_id ON diet_plans(trainer_user_id);
CREATE INDEX idx_diet_plans_active ON diet_plans(is_active);
CREATE INDEX idx_materials_trainer ON materials(trainer_user_id);
CREATE INDEX idx_materials_active ON materials(is_active);
CREATE INDEX idx_material_student_access_material_id ON material_student_access(material_id);
CREATE INDEX idx_material_student_access_student ON material_student_access(student_user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_anamnesis_updated_at BEFORE UPDATE ON anamnesis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_body_measurements_updated_at BEFORE UPDATE ON body_measurements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_diet_plans_updated_at BEFORE UPDATE ON diet_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_material_student_access_updated_at BEFORE UPDATE ON material_student_access FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE anamnesis ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_student_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User profiles: users can only see and modify their own profile
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid()::text = user_id);

-- Students: students can see their own data, trainers can see their students' data
CREATE POLICY "Students can view own data" ON students FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Trainers can view their students" ON students FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid()::text 
    AND user_type = 'trainer'
  ) AND trainer_id = auth.uid()::text
);
CREATE POLICY "Students can insert own data" ON students FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Students can update own data" ON students FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Trainers can update their students" ON students FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid()::text 
    AND user_type = 'trainer'
  ) AND trainer_id = auth.uid()::text
);

-- Anamnesis: students can manage their own, trainers can view their students'
CREATE POLICY "Students can manage own anamnesis" ON anamnesis FOR ALL USING (auth.uid()::text = student_user_id);
CREATE POLICY "Trainers can view students anamnesis" ON anamnesis FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM students s
    JOIN user_profiles up ON up.user_id = auth.uid()::text
    WHERE s.user_id = anamnesis.student_user_id
    AND s.trainer_id = auth.uid()::text
    AND up.user_type = 'trainer'
  )
);

-- Body measurements: students can manage their own, trainers can view their students'
CREATE POLICY "Students can manage own measurements" ON body_measurements FOR ALL USING (auth.uid()::text = student_user_id);
CREATE POLICY "Trainers can view students measurements" ON body_measurements FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM students s
    JOIN user_profiles up ON up.user_id = auth.uid()::text
    WHERE s.user_id = body_measurements.student_user_id
    AND s.trainer_id = auth.uid()::text
    AND up.user_type = 'trainer'
  )
);

-- Diet plans: trainers can manage, students can view their own
CREATE POLICY "Trainers can manage diet plans" ON diet_plans FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid()::text 
    AND user_type = 'trainer'
  ) AND trainer_user_id = auth.uid()::text
);
CREATE POLICY "Students can view own diet plans" ON diet_plans FOR SELECT USING (auth.uid()::text = student_user_id);

-- Materials: trainers can manage their own, students can view granted materials
CREATE POLICY "Trainers can manage own materials" ON materials FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid()::text 
    AND user_type = 'trainer'
  ) AND trainer_user_id = auth.uid()::text
);
CREATE POLICY "Students can view granted materials" ON materials FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM material_student_access msa
    WHERE msa.material_id = materials.id
    AND msa.student_user_id = auth.uid()::text
  )
);

-- Material access: trainers can grant access, students can view their access
CREATE POLICY "Trainers can manage material access" ON material_student_access FOR ALL USING (
  EXISTS (
    SELECT 1 FROM materials m
    JOIN user_profiles up ON up.user_id = auth.uid()::text
    WHERE m.id = material_student_access.material_id
    AND m.trainer_user_id = auth.uid()::text
    AND up.user_type = 'trainer'
  )
);
CREATE POLICY "Students can view own material access" ON material_student_access FOR SELECT USING (auth.uid()::text = student_user_id);