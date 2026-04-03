console.log("✅ Starting server...");

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const OpenAI = require("openai");

const { isValidObjectId } = require("mongoose");

const app = express();

// ✅ Middleware
app.use(cors({ origin: "http://localhost:3000", methods: "GET,HEAD,PUT,PATCH,POST,DELETE" }));
app.use(express.json());
app.use("/uploads/videos", express.static(path.join(__dirname, "uploads/videos")));

// ✅ MongoDB Connection
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing in .env file");
  process.exit(1);
}
mongoose
  .connect(process.env.MONGODB_URI, { dbName: "yashpathakauth1409atlas" }) // 🔁 Updated database name here
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Schemas and Models
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["user", "admin", "teacher"],
    required: true,
  },
});

const User = mongoose.model("User", userSchema, "lmsusers"); // 🔁 Changed from "users" to "lmsusers"

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    teacher: { type: String, required: true },
    image: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price: { type: Number, required: true },
    enrollements: { type: Number, required: true },
    progress: { type: Number, required: true, min: 0, max: 100 },
    videos: [
      {
        link: { type: String, required: true },
        title: { type: String },
        description: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema, "studentscourses"); // 🔁 Changed from "courseyash" to "studentscourses"



// Route to add a new course
app.post('/courses', async (req, res) => {
  try {
    const newCourse = new Course({
      title: req.body.title,
      teacher: req.body.teacher,
      image: req.body.image,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      price: req.body.price,
      enrollements: req.body.enrollements,
      progress: req.body.progress,
      videos: req.body.videos,
    });

    await newCourse.save();

    res.status(201).json({ message: 'Course added successfully!' });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Failed to add course. Please try again later.' });
  }
});


const classroomSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String,
  createdAt: { type: Date, default: Date.now },
});
const ClassRoom = mongoose.model("ClassRoom", classroomSchema, "ClassRoomDb");

// ✅ Secret Key
const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  console.error("❌ SECRET_KEY is missing in .env file");
  process.exit(1);
}

// ✅ Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "⚠️ Access denied, no token provided" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "⚠️ Invalid or expired token" });
    req.userId = decoded.userId;
    req.userRole = decoded.role; // 👉 Save role into req
    next();
  });
};

// ✅ Role Middleware
const checkRole = (role) => (req, res, next) => {
  if (req.userRole !== role) {
    return res.status(403).json({ message: "⚠️ Forbidden. You don't have access to this resource." });
  }
  next();
};

// ✅ Auth Routes and register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "⚠️ All fields are required" });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "⚠️ Email is already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role: role || "user" }); // 👉 set role
    await newUser.save();
    res.status(201).json({ message: "✅ User registered successfully!" });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ message: "❌ Internal Server Error" });
  }
});


// login routes 
app.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate the request body
    if (!email || !password || !role) {
      return res.status(400).json({ message: "⚠️ Email, password, and role are required" });
    }

    // Normalize the role to lowercase to prevent case issues
    const normalizedRole = role.toLowerCase();

    // Check if the provided role is valid
    if (!["user", "admin" ,"teacher"].includes(normalizedRole)) {
      return res.status(400).json({ message: "⚠️ Invalid role selected" });
    }

    // Find the user by email and role
    const user = await User.findOne({ email, role: normalizedRole });
    
    // Check if user exists and password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "⚠️ Invalid email or password" });
    }

    // Generate JWT token with user ID and role
    const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

    // Respond with success and token
    res.status(200).json({
      message: "✅ Login successful",
      token,
      role: user.role, // Return role in the response for frontend use
    });

  } catch (error) {
    console.error("❌ Error logging in:", error);
    res.status(500).json({ message: "❌ Internal Server Error" });
  }
});


// ✅ Get all users (Admin only)
app.get("/users", authenticate, checkRole("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "❌ Internal Server Error" });
  }
});

// ✅ Get current user's profile
app.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "⚠️ User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ message: "❌ Internal Server Error" });
  }
});

// ✅ Hard delete user by ID (Admin only)
app.delete("/users/:id", authenticate, checkRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "⚠️ Invalid user ID" });
    }
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "⚠️ User not found" });
    res.status(200).json({ message: "✅ User deleted successfully", deletedUser });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "❌ Internal Server Error" });
  }
});

// ✅ Soft delete user (Admin only)
app.put("/users/soft-delete/:id", authenticate, checkRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "⚠️ Invalid user ID" });
    }
    const updatedUser = await User.findByIdAndUpdate(id, { deleted: true }, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "⚠️ User not found" });
    res.status(200).json({ message: "✅ User soft deleted successfully", updatedUser });
  } catch (error) {
    console.error("❌ Error soft deleting user:", error);
    res.status(500).json({ message: "❌ Internal Server Error" });
  }
});


// ✅ Course Routes
app.post("/courses", authenticate, checkRole("admin"), async (req, res) => { // 👉 Only admin can create courses
  try {
    const { title, teacher, image, startDate, endDate, price, enrollements, progress, videos } = req.body;
    if (!title || !teacher || !image || !startDate || !endDate || !price || !enrollements || progress === undefined || !videos || videos.length === 0) {
      return res.status(400).json({ message: "⚠️ All course fields including videos are required" });
    }
    const newCourse = new Course({ title, teacher, image, startDate, endDate, price, enrollements, progress, videos });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("❌ Error adding course:", error);
    res.status(500).json({ message: "❌ Internal Server Error" });
  }
});

app.get("/courses", authenticate, async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error("❌ Error fetching courses:", error);
    res.status(500).json({ message: "❌ Internal Server Error" });
  }
});

app.get("/coursesyash", async (req, res) => {
  try {
    const courses = await Course.find({}, "title");
    res.status(200).json(courses);
  } catch (error) {
    console.error("❌ Error fetching course titles:", error);
    res.status(500).json({ message: "❌ Internal Server Error" });
  }
});
// delete a particular course 
app.delete('/courses/:id', async (req, res) => {
  const courseId = req.params.id;

  try {
    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Server error while deleting course" });
  }
});


// ✅ Classroom Routes
app.get("/classrooms", authenticate, async (req, res) => {
  try {
    const classrooms = await ClassRoom.find();
    res.status(200).json(classrooms);
  } catch (error) {
    console.error("❌ Error fetching classrooms:", error);
    res.status(500).json({ message: "❌ Internal Server Error" });
  }
});

app.post("/classrooms", authenticate, checkRole("admin"), async (req, res) => { // 👉 Only admin
  try {
    const { title, description, link } = req.body;
    const newClassroom = new ClassRoom({ title, description, link });
    await newClassroom.save();
    res.status(201).json(newClassroom);
  } catch (error) {
    console.error("❌ Error creating classroom:", error);
    res.status(500).json({ message: "❌ Internal Server Error" });
  }
});

// ✅ Upload Video Route
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads", "videos");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.post("/upload/video", authenticate, checkRole("admin"), upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "⚠️ No video uploaded" });
  }
  const videoUrl = `/uploads/videos/${req.file.filename}`;
  res.status(200).json({ message: "✅ Video uploaded successfully", videoUrl });
});



// update courses 

app.get("/courses/:courseId", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ PUT (update) course - add video
app.put("/courses/:courseId", async (req, res) => {
  try {
    const { title, description, link } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.courseId,
      {
        $push: {
          videos: { title, description, link },
        },
      },
      { new: true }
    );

    if (!updatedCourse) return res.status(404).json({ error: "Course not found" });
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});



// purchased option 

app.post("/courses/:id/purchase", authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "⚠️ Course not found" });

    if (course.purchasedBy.includes(req.userId)) {
      return res.status(400).json({ message: "⚠️ Already purchased" });
    }

    course.purchasedBy.push(req.userId);
    await course.save();

    res.status(200).json({ message: "✅ Course purchased successfully" });
  } catch (err) {
    console.error("❌ Purchase error:", err);
    res.status(500).json({ message: "❌ Internal Server Error" });
  }
});



// reset password
app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// ============================
// Interview Schema & Model
// ============================
const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, required: true },
  skills: { type: String, required: true },
  questions: [
    {
      question: String,
      answer: String,
      feedback: String,
    },
  ],
  currentIndex: { type: Number, default: 0 },
  status: { type: String, enum: ["ongoing", "completed"], default: "ongoing" },
  createdAt: { type: Date, default: Date.now },
});

const Interview = mongoose.model("Interview", interviewSchema, "interviews");

// ============================
// Connect MongoDB
// ============================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ============================
// 🔹 Start Interview
// ============================
app.post("/api/interviews/start", authenticate, async (req, res) => {
  try {
    const { role, skills } = req.body;
    if (!role || !skills) return res.status(400).json({ message: "Role and skills are required" });

    if (!process.env.GEMINI_API_KEY)
      return res.status(500).json({ message: "Server configuration error: GEMINI API key missing" });

    // Call Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate 5 interview questions for role: ${role}, skills: ${skills}. Return only plain text questions, each on a new line.`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!data?.candidates?.[0]?.content?.parts?.[0]?.text)
      return res.status(500).json({ message: "Failed to generate questions", error: data });

    const text = data.candidates[0].content.parts[0].text;

    // Parse questions
    const questions = text
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q !== "")
      .map((q) => ({ question: q }));

    const interview = new Interview({ userId: req.userId, role, skills, questions });
    await interview.save();

    res.status(201).json({ interviewId: interview._id, questions: interview.questions });
  } catch (error) {
    console.error("❌ Start interview error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ============================
// 🔹 Submit Answer
// ============================
app.post("/api/interviews/:id/answer", authenticate, async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    if (!answer) return res.status(400).json({ message: "Answer is required" });

    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: "Interview not found" });

    if (!interview.questions[questionId])
      return res.status(400).json({ message: "Invalid questionId" });

    if (!process.env.GEMINI_API_KEY)
      return res.status(500).json({ message: "Server configuration error: GEMINI API key missing" });

    // Gemini API for feedback
    const feedbackRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Question: ${interview.questions[questionId].question}\nAnswer: ${answer}\nGive constructive feedback in 2-3 sentences.`,
                },
              ],
            },
          ],
        }),
      }
    );

    const feedbackData = await feedbackRes.json();
    const feedback = feedbackData?.candidates?.[0]?.content?.parts?.[0]?.text || "No feedback generated";

    interview.questions[questionId].answer = answer;
    interview.questions[questionId].feedback = feedback;
    interview.currentIndex++;
    await interview.save();

    res.json({ feedback, nextIndex: interview.currentIndex });
  } catch (error) {
    console.error("❌ Submit answer error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ============================
// 🔹 Get Interview Summary
// ============================
app.get("/api/interviews/:id/summary", authenticate, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: "Interview not found" });
    res.json(interview);
  } catch (error) {
    console.error("❌ Get summary error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


// ✅ Schema with skill
const questionSchema = new mongoose.Schema({
  skill: String,
  question: String,
  options: [String],
  answer: String,
});

// ✅ Model (collection will be "questions")
const Question = mongoose.model("Question", questionSchema);

// ➕ Add Question
app.post("/api/add-question", async (req, res) => {
  try {
    const { skill, question, options, answer } = req.body;
    const newQuestion = new Question({ skill, question, options, answer });
    await newQuestion.save();
    res.status(201).json({ msg: "Question added", id: newQuestion._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📥 Get Questions by Skill
app.get("/api/get-questions/:skill", async (req, res) => {
  try {
    const { skill } = req.params;
    const questions = await Question.find({ skill });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/// ----------------------------------------
// Chatbot Conversation Schema
// ----------------------------------------
const conversationSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  messages: [
    {
      sender: { type: String, enum: ["user", "ai"], required: true },
      text: { type: String, required: true },
      time: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

// ----------------------------------------
// Chatbot Route
// ----------------------------------------
app.post("/api/chatbot", async (req, res) => {
  const { prompt, sessionId } = req.body;

  // Validation
  if (!prompt || !sessionId) {
    return res
      .status(400)
      .json({ error: "❗ Prompt and sessionId are required." });
  }

  try {
    // --- Calling Gemini API ---
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini API error:", await response.text());
      return res.status(500).json({
        error: "❌ Gemini API failed. Check your API key or request format.",
      });
    }

    const data = await response.json();

    const aiReply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ AI did not return a response.";

    // --- Save to MongoDB ---
    let conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
      // First time creating session
      conversation = new Conversation({
        sessionId,
        messages: [
          { sender: "user", text: prompt },
          { sender: "ai", text: aiReply },
        ],
      });
    } else {
      // Add messages to existing session
      conversation.messages.push({ sender: "user", text: prompt });
      conversation.messages.push({ sender: "ai", text: aiReply });
    }

    await conversation.save();

    // Send AI message to frontend
    res.json({ reply: aiReply });
  } catch (error) {
    console.error("❌ Chatbot route error:", error);
    res.status(500).json({ error: "❗ Internal server error" });
  }
});

console.log("yaha tk compile hua");

// --- Fetch past conversation by session ---
app.get("/api/chatbot/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const conversation = await Conversation.findOne({ sessionId });
  res.json(conversation ? conversation.messages : []);
});


/// -------------------- Question Model --------------------
// -------------------- AI Quiz Schemas --------------------
const aiQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  tags: { type: [String], default: [] },
});

const aiQuizSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true, unique: true },
    difficulty: { type: String, default: "easy" },
    questions: [aiQuestionSchema],
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const AiQuizQuestion = mongoose.model("AiQuizQuestion", aiQuizSchema);

// -------------------- Routes --------------------

// Save questions to MongoDB
app.post("/api/quiz/save", async (req, res) => {
  try {
    const { skill, difficulty, questions } = req.body;

    if (!skill || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: "Invalid data" });
    }

    // Normalize questions for DB
    const questionDocs = questions.map((q) => ({
      question: q.question,
      tags: Array.isArray(q.tags)
        ? q.tags
        : typeof q.tags === "string"
        ? q.tags.split(",").map((t) => t.trim())
        : [],
    }));

    // Check if skill already exists
    let existingSkill = await AiQuizQuestion.findOne({ skill });
    if (existingSkill) {
      // Update existing skill
      existingSkill.questions = questionDocs;
      existingSkill.difficulty = difficulty || existingSkill.difficulty;
      await existingSkill.save();
    } else {
      // Create new document
      const newQuiz = new AiQuizQuestion({
        skill,
        difficulty,
        questions: questionDocs,
      });
      await newQuiz.save();
    }

    res.json({ message: "Questions saved successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch questions by skill
app.get("/api/quiz/:skill", async (req, res) => {
  try {
    const skill = req.params.skill;
    const quiz = await AiQuizQuestion.findOne({ skill }).lean();

    if (!quiz) return res.json({ questions: [] });

    res.json({ questions: quiz.questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ============================
// Start Server
// ============================
const PORT = process.env.PORT || 6500;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



console.log("✅ Reached end of file......");
