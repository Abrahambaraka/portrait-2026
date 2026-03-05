import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("portraits.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS portraits (
    id TEXT PRIMARY KEY,
    studentName TEXT,
    university TEXT,
    faculty TEXT,
    graduationYear INTEGER,
    biography TEXT,
    achievements TEXT,
    vision TEXT,
    status TEXT,
    createdAt TEXT
  )
`);

// Seed initial data if empty
const count = db.prepare("SELECT count(*) as count FROM portraits").get() as { count: number };
if (count.count === 0) {
  const seedPortraits = [
    {
      id: 'ecopo-1',
      studentName: 'Eldad Mukubu (Eldy)',
      university: 'ECOPO',
      faculty: 'Gestion d’entreprises',
      graduationYear: 2023,
      biography: "Je suis une femme sympathique, surtout pour ceux qui me connaissent. Mon meilleur souvenir reste notre première fête, la « Marche de l’Amitié ».",
      achievements: JSON.stringify(["Licence en Gestion d’entreprises (65 %)", "Marche de l’Amitié"]),
      vision: "Devenir une femme d'affaires dans le secteur minier et ouvrir un orphelinat.",
      status: 'published',
      createdAt: new Date().toISOString()
    },
    {
      id: 'ecopo-2',
      studentName: 'Mulezi Mwayuma Olivia (Olivia Mlz.)',
      university: 'ECOPO',
      faculty: 'Management Commercial & Marketing',
      graduationYear: 2023,
      biography: "Je suis une femme souriante et dotée d’une grande habileté manuelle. J’adore apporter de la bonne humeur autour de moi.",
      achievements: JSON.stringify(["Licence en Management Commercial & Marketing (64 %)", "Habileté manuelle"]),
      vision: "Révolutionner le secteur agricole en RDC en créant un vaste champ de fruits et légumes.",
      status: 'published',
      createdAt: new Date().toISOString()
    },
    {
      id: 'ecopo-3',
      studentName: 'Cledia Yumba Oneya',
      university: 'ECOPO',
      faculty: 'Management Commercial & Marketing',
      graduationYear: 2023,
      biography: "Je suis passionnée de lecture et de l’écoute des prédications. J’aime rire, taquiner, travailler et parler de Dieu autour de moi.",
      achievements: JSON.stringify(["Licence en Management Commercial & Marketing (60 %)", "Amitiés solides"]),
      vision: "Développer mon propre business et devenir ma propre patronne.",
      status: 'published',
      createdAt: new Date().toISOString()
    },
    {
      id: 'ecopo-4',
      studentName: 'Gloria Kapemb Mwenz',
      university: 'ECOPO',
      faculty: 'Gestion des Entreprises et des Organisations',
      graduationYear: 2023,
      biography: "Je travaille chez Congo Corporation International. Je crois fermement que « le besoin est la mère de la créativité ».",
      achievements: JSON.stringify(["Licence en Gestion des Entreprises (60 %)", "Supervision chez Congo Corp"]),
      vision: "Réussir dans le domaine des Ressources Humaines.",
      status: 'published',
      createdAt: new Date().toISOString()
    },
    {
      id: 'ecopo-5',
      studentName: 'Kamulete Tshite Chris (CK8)',
      university: 'ECOPO',
      faculty: 'Gestion des Entreprises et des Organisations',
      graduationYear: 2023,
      biography: "Je suis passionné par l’entrepreneuriat et la boxe. Mon inspiration vient du proverbe « À cœur vaillant, rien d’impossible ».",
      achievements: JSON.stringify(["Licence avec mention distinction (71 %)", "Passion pour l'entrepreneuriat"]),
      vision: "Créer de la richesse afin d’aider mon prochain et lutter contre la pauvreté.",
      status: 'published',
      createdAt: new Date().toISOString()
    }
  ];

  const insert = db.prepare(`
    INSERT INTO portraits (id, studentName, university, faculty, graduationYear, biography, achievements, vision, status, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  seedPortraits.forEach(p => {
    insert.run(p.id, p.studentName, p.university, p.faculty, p.graduationYear, p.biography, p.achievements, p.vision, p.status, p.createdAt);
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/portraits", (req, res) => {
    const portraits = db.prepare("SELECT * FROM portraits ORDER BY createdAt DESC").all();
    res.json(portraits.map(p => ({
      ...p,
      achievements: JSON.parse(p.achievements as string)
    })));
  });

  app.post("/api/portraits", (req, res) => {
    const { id, studentName, university, faculty, graduationYear, biography, achievements, vision, status } = req.body;
    const stmt = db.prepare(`
      INSERT INTO portraits (id, studentName, university, faculty, graduationYear, biography, achievements, vision, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, studentName, university, faculty, graduationYear, biography, JSON.stringify(achievements), vision, status, new Date().toISOString());
    res.status(201).json({ message: "Portrait saved" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
