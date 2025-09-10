import z from "zod";

// User Profile Types
export const UserProfileSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  name: z.string(),
  user_type: z.enum(['student', 'trainer']),
  phone: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// Student Types
export const StudentSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  trainer_id: z.string().optional(),
  height: z.number().optional(),
  initial_weight: z.number().optional(),
  current_weight: z.number().optional(),
  last_measurement_date: z.string().optional(),
  next_measurement_date: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Student = z.infer<typeof StudentSchema>;

// Anamnesis Types
export const AnamnesisSchema = z.object({
  id: z.number(),
  student_user_id: z.string(),
  is_completed: z.boolean(),
  
  // General Information
  age: z.number().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  whatsapp: z.string().optional(),
  lean_weight: z.number().optional(),
  body_fat_percentage: z.number().optional(),
  waist_circumference: z.number().optional(),
  right_arm_contracted: z.number().optional(),
  right_arm_relaxed: z.number().optional(),
  left_arm_contracted: z.number().optional(),
  left_arm_relaxed: z.number().optional(),
  thigh_midpoint: z.number().optional(),
  hip_circumference: z.number().optional(),
  
  // Routine and Goals
  profession: z.string().optional(),
  work_schedule: z.string().optional(),
  studies_schedule: z.string().optional(),
  physical_activities: z.string().optional(),
  activity_schedule: z.string().optional(),
  sleep_schedule: z.string().optional(),
  wake_schedule: z.string().optional(),
  body_goals: z.string().optional(),
  consultation_goals: z.string().optional(),
  desired_body_photo_url: z.string().optional(),
  
  // Training
  no_rest_duration: z.string().optional(),
  has_periodization: z.boolean().optional(),
  feels_stagnation: z.boolean().optional(),
  muscle_pump_level: z.string().optional(),
  
  // Substances
  prescribed_medications: z.string().optional(),
  legal_illegal_drugs: z.string().optional(),
  anabolics_contraceptives: z.string().optional(),
  nootropics: z.string().optional(),
  stimulants: z.string().optional(),
  
  // Current Diet
  food_diary: z.string().optional(),
  bowel_frequency: z.string().optional(),
  digestive_issues: z.string().optional(),
  food_availability: z.string().optional(),
  allergies_intolerances: z.string().optional(),
  
  // Neurological Aspects
  motivation_level: z.number().optional(),
  concentration_level: z.number().optional(),
  memory_level: z.number().optional(),
  sexual_initiative_level: z.number().optional(),
  pleasure_level: z.number().optional(),
  empathy_level: z.number().optional(),
  sociability_level: z.number().optional(),
  verbal_fluency_level: z.number().optional(),
  
  // Rest and Sleep
  sleep_onset_time: z.string().optional(),
  wakes_rested: z.boolean().optional(),
  night_awakenings: z.number().optional(),
  breathing_method: z.string().optional(),
  fatigue_peaks: z.string().optional(),
  smartwatch_data_url: z.string().optional(),
  
  // Clinical History
  preexisting_diseases: z.string().optional(),
  surgeries: z.string().optional(),
  dental_treatments: z.string().optional(),
  metals_implants: z.string().optional(),
  covid_vaccination_doses: z.number().optional(),
  recent_health_changes: z.string().optional(),
  clinical_exams_url: z.string().optional(),
  
  created_at: z.string(),
  updated_at: z.string(),
});

export type Anamnesis = z.infer<typeof AnamnesisSchema>;

// Body Measurements Types
export const BodyMeasurementSchema = z.object({
  id: z.number(),
  student_user_id: z.string(),
  weight: z.number().optional(),
  waist_circumference: z.number().optional(),
  right_arm_contracted: z.number().optional(),
  right_arm_relaxed: z.number().optional(),
  left_arm_contracted: z.number().optional(),
  left_arm_relaxed: z.number().optional(),
  thigh_midpoint: z.number().optional(),
  hip_circumference: z.number().optional(),
  measurement_date: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type BodyMeasurement = z.infer<typeof BodyMeasurementSchema>;

// Diet Plan Types
export const DietPlanSchema = z.object({
  id: z.number(),
  student_user_id: z.string(),
  trainer_user_id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  plan_content: z.string(), // JSON string
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type DietPlan = z.infer<typeof DietPlanSchema>;

// API Input Schemas
export const CreateUserProfileSchema = z.object({
  name: z.string().min(1),
  user_type: z.enum(['student', 'trainer']),
  phone: z.string().optional(),
  trainer_id: z.string().optional(),
});

export const UpdateAnamnesisSchema = AnamnesisSchema.omit({
  id: true,
  student_user_id: true,
  created_at: true,
  updated_at: true,
}).partial();

export const CreateBodyMeasurementSchema = z.object({
  weight: z.number().optional(),
  waist_circumference: z.number().optional(),
  right_arm_contracted: z.number().optional(),
  right_arm_relaxed: z.number().optional(),
  left_arm_contracted: z.number().optional(),
  left_arm_relaxed: z.number().optional(),
  thigh_midpoint: z.number().optional(),
  hip_circumference: z.number().optional(),
  measurement_date: z.string(),
});

export const CreateDietPlanSchema = z.object({
  student_user_id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  plan_content: z.string().min(1),
});

// Material Types
export const MaterialSchema = z.object({
  id: z.number(),
  trainer_user_id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  file_url: z.string(),
  file_name: z.string(),
  file_size: z.number().optional(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Material = z.infer<typeof MaterialSchema>;

export const CreateMaterialSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  file_url: z.string(),
  file_name: z.string(),
  file_size: z.number().optional(),
  student_user_ids: z.array(z.string()).optional(),
});

// Material Student Access Types
export const MaterialStudentAccessSchema = z.object({
  id: z.number(),
  material_id: z.number(),
  student_user_id: z.string(),
  granted_by_trainer: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type MaterialStudentAccess = z.infer<typeof MaterialStudentAccessSchema>;

export type CreateUserProfileInput = z.infer<typeof CreateUserProfileSchema>;
export type UpdateAnamnesisInput = z.infer<typeof UpdateAnamnesisSchema>;
export type CreateBodyMeasurementInput = z.infer<typeof CreateBodyMeasurementSchema>;
export type CreateDietPlanInput = z.infer<typeof CreateDietPlanSchema>;
export type CreateMaterialInput = z.infer<typeof CreateMaterialSchema>;
