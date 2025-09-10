import { Hono } from "hono";
import { cors } from "hono/cors";
import { authMiddleware, getOAuthRedirectUrl, exchangeCodeForSessionToken, deleteSession, MOCHA_SESSION_TOKEN_COOKIE_NAME } from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { 
  CreateUserProfileSchema, 
  UpdateAnamnesisSchema,
  CreateBodyMeasurementSchema,
  CreateDietPlanSchema,
  CreateMaterialSchema
} from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Authentication endpoints
app.get('/api/oauth/google/redirect_url', async (c) => {
  try {
    const redirectUrl = await getOAuthRedirectUrl('google', {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
    return c.json({ redirectUrl }, 200);
  } catch (error) {
    console.error('Error getting OAuth redirect URL:', error);
    return c.json({ error: 'Failed to get redirect URL' }, 500);
  }
});

app.post("/api/sessions", async (c) => {
  try {
    const body = await c.req.json();
    
    if (!body.code) {
      return c.json({ error: "No authorization code provided" }, 400);
    }

    const sessionToken = await exchangeCodeForSessionToken(body.code, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });

    setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: true,
      maxAge: 60 * 24 * 60 * 60, // 60 days
    });

    return c.json({ success: true }, 200);
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return c.json({ error: 'Failed to authenticate' }, 500);
  }
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    try {
      await deleteSession(sessionToken, {
        apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
        apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
      });
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// User Profile endpoints
app.get("/api/profile", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM user_profiles WHERE user_id = ?"
    ).bind(user.id).all();

    if (results.length === 0) {
      return c.json({ profile: null });
    }

    return c.json({ profile: results[0] });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

app.post("/api/profile", authMiddleware, zValidator("json", CreateUserProfileSchema), async (c) => {
  try {
    const user = c.get("user")!;
    const { name, user_type, phone, trainer_id } = c.req.valid("json");

    const { success } = await c.env.DB.prepare(`
      INSERT INTO user_profiles (user_id, name, user_type, phone)
      VALUES (?, ?, ?, ?)
    `).bind(user.id, name, user_type, phone).run();

    if (!success) {
      return c.json({ error: 'Failed to create profile' }, 500);
    }

    // If user is a student, create student record with trainer link
    if (user_type === 'student') {
      await c.env.DB.prepare(`
        INSERT INTO students (user_id, trainer_id)
        VALUES (?, ?)
      `).bind(user.id, trainer_id || null).run();
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error creating profile:', error);
    return c.json({ error: 'Failed to create profile' }, 500);
  }
});

// Student endpoints
app.get("/api/student", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM students WHERE user_id = ?"
    ).bind(user.id).all();

    if (results.length === 0) {
      return c.json({ student: null });
    }

    return c.json({ student: results[0] });
  } catch (error) {
    console.error('Error fetching student:', error);
    return c.json({ error: 'Failed to fetch student data' }, 500);
  }
});

// Anamnesis endpoints
app.get("/api/anamnesis", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    const studentId = c.req.query('student'); // For trainers viewing student data
    
    let targetUserId = user.id;
    
    // If querying for a specific student, verify trainer has access
    if (studentId) {
      const { results: profileResults } = await c.env.DB.prepare(
        "SELECT user_type FROM user_profiles WHERE user_id = ?"
      ).bind(user.id).all();

      if (profileResults.length === 0 || (profileResults[0] as any).user_type !== 'trainer') {
        return c.json({ error: 'Only trainers can view student anamnesis' }, 403);
      }

      // Verify student belongs to this trainer
      const { results: studentResults } = await c.env.DB.prepare(
        "SELECT user_id FROM students WHERE user_id = ? AND trainer_id = ?"
      ).bind(studentId, user.id).all();

      if (studentResults.length === 0) {
        return c.json({ error: 'Student not found or not assigned to this trainer' }, 404);
      }

      targetUserId = studentId;
    }

    const { results } = await c.env.DB.prepare(
      "SELECT * FROM anamnesis WHERE student_user_id = ?"
    ).bind(targetUserId).all();

    if (results.length === 0) {
      return c.json({ anamnesis: null });
    }

    return c.json({ anamnesis: results[0] });
  } catch (error) {
    console.error('Error fetching anamnesis:', error);
    return c.json({ error: 'Failed to fetch anamnesis' }, 500);
  }
});

app.post("/api/anamnesis", authMiddleware, zValidator("json", UpdateAnamnesisSchema), async (c) => {
  try {
    const user = c.get("user")!;
    const data = c.req.valid("json");

    // Check if anamnesis exists
    const { results: existing } = await c.env.DB.prepare(
      "SELECT id FROM anamnesis WHERE student_user_id = ?"
    ).bind(user.id).all();

    const fields = Object.keys(data).filter(key => data[key as keyof typeof data] !== undefined);
    const values = fields.map(key => data[key as keyof typeof data]);

    if (existing.length > 0) {
      // Update existing
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      await c.env.DB.prepare(`
        UPDATE anamnesis SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE student_user_id = ?
      `).bind(...values, user.id).run();
    } else {
      // Create new
      const placeholders = fields.map(() => '?').join(', ');
      const fieldsList = fields.join(', ');
      await c.env.DB.prepare(`
        INSERT INTO anamnesis (student_user_id, ${fieldsList})
        VALUES (?, ${placeholders})
      `).bind(user.id, ...values).run();
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error saving anamnesis:', error);
    return c.json({ error: 'Failed to save anamnesis' }, 500);
  }
});

// Body measurements endpoints
app.get("/api/measurements", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    const studentId = c.req.query('student'); // For trainers viewing student data
    
    let targetUserId = user.id;
    
    // If querying for a specific student, verify trainer has access
    if (studentId) {
      const { results: profileResults } = await c.env.DB.prepare(
        "SELECT user_type FROM user_profiles WHERE user_id = ?"
      ).bind(user.id).all();

      if (profileResults.length === 0 || (profileResults[0] as any).user_type !== 'trainer') {
        return c.json({ error: 'Only trainers can view student measurements' }, 403);
      }

      // Verify student belongs to this trainer
      const { results: studentResults } = await c.env.DB.prepare(
        "SELECT user_id FROM students WHERE user_id = ? AND trainer_id = ?"
      ).bind(studentId, user.id).all();

      if (studentResults.length === 0) {
        return c.json({ error: 'Student not found or not assigned to this trainer' }, 404);
      }

      targetUserId = studentId;
    }

    const { results } = await c.env.DB.prepare(
      "SELECT * FROM body_measurements WHERE student_user_id = ? ORDER BY measurement_date DESC"
    ).bind(targetUserId).all();

    return c.json({ measurements: results });
  } catch (error) {
    console.error('Error fetching measurements:', error);
    return c.json({ error: 'Failed to fetch measurements' }, 500);
  }
});

app.post("/api/measurements", authMiddleware, zValidator("json", CreateBodyMeasurementSchema), async (c) => {
  try {
    const user = c.get("user")!;
    const data = c.req.valid("json");

    const fields = Object.keys(data).filter(key => data[key as keyof typeof data] !== undefined);
    const values = fields.map(key => data[key as keyof typeof data]);
    const placeholders = fields.map(() => '?').join(', ');
    const fieldsList = fields.join(', ');

    await c.env.DB.prepare(`
      INSERT INTO body_measurements (student_user_id, ${fieldsList})
      VALUES (?, ${placeholders})
    `).bind(user.id, ...values).run();

    // Update student's current weight and last measurement date
    if (data.weight) {
      await c.env.DB.prepare(`
        UPDATE students 
        SET current_weight = ?, last_measurement_date = ?, next_measurement_date = date(?, '+15 days')
        WHERE user_id = ?
      `).bind(data.weight, data.measurement_date, data.measurement_date, user.id).run();
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error saving measurement:', error);
    return c.json({ error: 'Failed to save measurement' }, 500);
  }
});

// Diet plan endpoints (for trainers and students)
app.get("/api/diet-plans", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    
    // Check user type
    const { results: profileResults } = await c.env.DB.prepare(
      "SELECT user_type FROM user_profiles WHERE user_id = ?"
    ).bind(user.id).all();

    if (profileResults.length === 0) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const userType = (profileResults[0] as any).user_type;
    let query: string;
    
    if (userType === 'trainer') {
      query = "SELECT * FROM diet_plans WHERE trainer_user_id = ? ORDER BY created_at DESC";
    } else {
      query = "SELECT * FROM diet_plans WHERE student_user_id = ? ORDER BY created_at DESC";
    }

    const { results } = await c.env.DB.prepare(query).bind(user.id).all();
    return c.json({ dietPlans: results });
  } catch (error) {
    console.error('Error fetching diet plans:', error);
    return c.json({ error: 'Failed to fetch diet plans' }, 500);
  }
});

app.post("/api/diet-plans", authMiddleware, zValidator("json", CreateDietPlanSchema), async (c) => {
  try {
    const user = c.get("user")!;
    const { student_user_id, title, description, plan_content } = c.req.valid("json");

    await c.env.DB.prepare(`
      INSERT INTO diet_plans (student_user_id, trainer_user_id, title, description, plan_content)
      VALUES (?, ?, ?, ?, ?)
    `).bind(student_user_id, user.id, title, description, plan_content).run();

    return c.json({ success: true });
  } catch (error) {
    console.error('Error creating diet plan:', error);
    return c.json({ error: 'Failed to create diet plan' }, 500);
  }
});

// Trainers list endpoint
app.get("/api/trainers", authMiddleware, async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT user_id, name FROM user_profiles WHERE user_type = 'trainer' ORDER BY name"
    ).all();

    return c.json({ trainers: results });
  } catch (error) {
    console.error('Error fetching trainers:', error);
    return c.json({ error: 'Failed to fetch trainers' }, 500);
  }
});

// Students list endpoint (for trainers)
app.get("/api/students", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    
    // Check if user is a trainer
    const { results: profileResults } = await c.env.DB.prepare(
      "SELECT user_type FROM user_profiles WHERE user_id = ?"
    ).bind(user.id).all();

    if (profileResults.length === 0 || (profileResults[0] as any).user_type !== 'trainer') {
      return c.json({ error: 'Only trainers can access student list' }, 403);
    }

    // Get students linked to this trainer with their profile info
    const { results } = await c.env.DB.prepare(`
      SELECT 
        s.*, 
        up.name, 
        up.phone,
        up.user_id as email,
        (SELECT COUNT(*) FROM body_measurements bm WHERE bm.student_user_id = s.user_id) as measurement_count,
        (SELECT COUNT(*) FROM anamnesis a WHERE a.student_user_id = s.user_id AND a.is_completed = 1) as has_anamnesis,
        (SELECT COUNT(*) FROM diet_plans dp WHERE dp.student_user_id = s.user_id AND dp.is_active = 1) as active_diets
      FROM students s
      JOIN user_profiles up ON s.user_id = up.user_id
      WHERE s.trainer_id = ?
      ORDER BY up.name
    `).bind(user.id).all();

    return c.json({ students: results });
  } catch (error) {
    console.error('Error fetching students:', error);
    return c.json({ error: 'Failed to fetch students' }, 500);
  }
});

// Update trainer endpoint (for students)
app.post("/api/update-trainer", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    const { trainer_id } = await c.req.json();

    // Check if user is a student
    const { results: profileResults } = await c.env.DB.prepare(
      "SELECT user_type FROM user_profiles WHERE user_id = ?"
    ).bind(user.id).all();

    if (profileResults.length === 0 || (profileResults[0] as any).user_type !== 'student') {
      return c.json({ error: 'Only students can update trainer' }, 403);
    }

    // Update student's trainer
    const { success } = await c.env.DB.prepare(`
      UPDATE students 
      SET trainer_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).bind(trainer_id || null, user.id).run();

    if (!success) {
      return c.json({ error: 'Failed to update trainer' }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating trainer:', error);
    return c.json({ error: 'Failed to update trainer' }, 500);
  }
});

// Materials endpoints
app.get("/api/materials", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    
    // Check user type
    const { results: profileResults } = await c.env.DB.prepare(
      "SELECT user_type FROM user_profiles WHERE user_id = ?"
    ).bind(user.id).all();

    if (profileResults.length === 0) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const userType = (profileResults[0] as any).user_type;
    
    if (userType === 'trainer') {
      // Trainers see their own materials with access info
      const { results } = await c.env.DB.prepare(`
        SELECT 
          m.*,
          GROUP_CONCAT(msa.student_user_id) as granted_students
        FROM materials m
        LEFT JOIN material_student_access msa ON m.id = msa.material_id
        WHERE m.trainer_user_id = ? AND m.is_active = 1
        GROUP BY m.id
        ORDER BY m.created_at DESC
      `).bind(user.id).all();
      
      return c.json({ materials: results });
    } else {
      // Students see only materials they have access to
      const { results } = await c.env.DB.prepare(`
        SELECT m.*
        FROM materials m
        INNER JOIN material_student_access msa ON m.id = msa.material_id
        WHERE msa.student_user_id = ? AND m.is_active = 1
        ORDER BY m.created_at DESC
      `).bind(user.id).all();
      
      return c.json({ materials: results });
    }
  } catch (error) {
    console.error('Error fetching materials:', error);
    return c.json({ error: 'Failed to fetch materials' }, 500);
  }
});

app.post("/api/materials", authMiddleware, zValidator("json", CreateMaterialSchema), async (c) => {
  try {
    const user = c.get("user")!;
    const { title, description, file_url, file_name, file_size, student_user_ids } = c.req.valid("json");

    // Check if user is a trainer
    const { results: profileResults } = await c.env.DB.prepare(
      "SELECT user_type FROM user_profiles WHERE user_id = ?"
    ).bind(user.id).all();

    if (profileResults.length === 0 || (profileResults[0] as any).user_type !== 'trainer') {
      return c.json({ error: 'Only trainers can create materials' }, 403);
    }

    // Insert material
    const { success, meta } = await c.env.DB.prepare(`
      INSERT INTO materials (trainer_user_id, title, description, file_url, file_name, file_size)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(user.id, title, description, file_url, file_name, file_size).run();

    if (!success || !meta?.last_row_id) {
      return c.json({ error: 'Failed to create material' }, 500);
    }

    const materialId = meta.last_row_id;

    // Grant access to selected students
    if (student_user_ids && student_user_ids.length > 0) {
      for (const studentId of student_user_ids) {
        await c.env.DB.prepare(`
          INSERT INTO material_student_access (material_id, student_user_id, granted_by_trainer)
          VALUES (?, ?, ?)
        `).bind(materialId, studentId, user.id).run();
      }
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error creating material:', error);
    return c.json({ error: 'Failed to create material' }, 500);
  }
});

// Grant/revoke material access endpoint
app.post("/api/materials/:id/access", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    const materialId = c.req.param('id');
    const { student_user_ids } = await c.req.json();

    // Check if user is a trainer and owns the material
    const { results: materialResults } = await c.env.DB.prepare(
      "SELECT trainer_user_id FROM materials WHERE id = ?"
    ).bind(materialId).all();

    if (materialResults.length === 0) {
      return c.json({ error: 'Material not found' }, 404);
    }

    if ((materialResults[0] as any).trainer_user_id !== user.id) {
      return c.json({ error: 'You can only manage access to your own materials' }, 403);
    }

    // Remove all existing access
    await c.env.DB.prepare(
      "DELETE FROM material_student_access WHERE material_id = ?"
    ).bind(materialId).run();

    // Grant access to selected students
    if (student_user_ids && student_user_ids.length > 0) {
      for (const studentId of student_user_ids) {
        await c.env.DB.prepare(`
          INSERT INTO material_student_access (material_id, student_user_id, granted_by_trainer)
          VALUES (?, ?, ?)
        `).bind(materialId, studentId, user.id).run();
      }
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating material access:', error);
    return c.json({ error: 'Failed to update material access' }, 500);
  }
});

export default app;
