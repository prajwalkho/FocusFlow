import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("productivity.db");
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key_change_me";

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK(priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
    deadline DATETIME,
    status TEXT CHECK(status IN ('Pending', 'Completed')) DEFAULT 'Pending',
    category TEXT DEFAULT 'Personal',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS productivity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    tasksCompleted INTEGER DEFAULT 0,
    focusTime INTEGER DEFAULT 0,
    date DATE DEFAULT (DATE('now')),
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);

const app = express();
app.use(express.json());

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
};

// --- Auth Routes ---
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const info = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run(name, email, hashedPassword);
    const token = jwt.sign({ id: info.lastInsertRowid, email }, JWT_SECRET);
    res.status(201).json({ token, user: { id: info.lastInsertRowid, name, email } });
  } catch (err: any) {
    res.status(400).json({ error: "Email already exists or invalid data" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.get("/api/auth/me", authenticateToken, (req: any, res) => {
  const user: any = db.prepare("SELECT id, name, email FROM users WHERE id = ?").get(req.user.id);
  res.json(user);
});

// --- Task Routes ---
app.get("/api/tasks", authenticateToken, (req: any, res) => {
  const tasks = db.prepare("SELECT * FROM tasks WHERE userId = ? ORDER BY createdAt DESC").all(req.user.id);
  res.json(tasks);
});

app.post("/api/tasks", authenticateToken, (req: any, res) => {
  const { title, description, priority, deadline, category } = req.body;
  const info = db.prepare(`
    INSERT INTO tasks (userId, title, description, priority, deadline, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(req.user.id, title, description, priority, deadline, category);
  const newTask = db.prepare("SELECT * FROM tasks WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(newTask);
});

app.put("/api/tasks/:id", authenticateToken, (req: any, res) => {
  const { title, description, priority, deadline, status, category } = req.body;
  db.prepare(`
    UPDATE tasks 
    SET title = ?, description = ?, priority = ?, deadline = ?, status = ?, category = ?
    WHERE id = ? AND userId = ?
  `).run(title, description, priority, deadline, status, category, req.params.id, req.user.id);
  
  // If task completed, update productivity log
  if (status === 'Completed') {
    db.prepare(`
      INSERT INTO productivity_logs (userId, tasksCompleted, date)
      VALUES (?, 1, DATE('now'))
      ON CONFLICT(id) DO UPDATE SET tasksCompleted = tasksCompleted + 1
    `); 
    // Simplified: just insert or update for today
    const today = new Date().toISOString().split('T')[0];
    const log: any = db.prepare("SELECT * FROM productivity_logs WHERE userId = ? AND date = ?").get(req.user.id, today);
    if (log) {
      db.prepare("UPDATE productivity_logs SET tasksCompleted = tasksCompleted + 1 WHERE id = ?").run(log.id);
    } else {
      db.prepare("INSERT INTO productivity_logs (userId, tasksCompleted, date) VALUES (?, 1, ?)").run(req.user.id, today);
    }
  }

  const updatedTask = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);
  res.json(updatedTask);
});

app.delete("/api/tasks/:id", authenticateToken, (req: any, res) => {
  db.prepare("DELETE FROM tasks WHERE id = ? AND userId = ?").run(req.params.id, req.user.id);
  res.status(204).send();
});

// --- Productivity Routes ---
app.get("/api/productivity/stats", authenticateToken, (req: any, res) => {
  const stats = db.prepare(`
    SELECT date, tasksCompleted, focusTime 
    FROM productivity_logs 
    WHERE userId = ? 
    ORDER BY date DESC LIMIT 7
  `).all(req.user.id);
  res.json(stats);
});

app.post("/api/productivity/log-focus", authenticateToken, (req: any, res) => {
  const { minutes } = req.body;
  const today = new Date().toISOString().split('T')[0];
  const log: any = db.prepare("SELECT * FROM productivity_logs WHERE userId = ? AND date = ?").get(req.user.id, today);
  if (log) {
    db.prepare("UPDATE productivity_logs SET focusTime = focusTime + ? WHERE id = ?").run(minutes, log.id);
  } else {
    db.prepare("INSERT INTO productivity_logs (userId, focusTime, date) VALUES (?, ?, ?)").run(req.user.id, minutes, today);
  }
  res.json({ success: true });
});

// Vite Middleware for Dev
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
