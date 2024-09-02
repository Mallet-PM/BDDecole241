import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = 3000;
const prisma = new PrismaClient();

// Configuration de CORS 
const corsOptions = {
  origin: 'https://formulair-ten.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600, 
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

// Middleware pour gérer les requêtes de pré-vérification (OPTIONS)
app.options('*', cors(corsOptions));

// Route pour récupérer tous les alumnis
app.get('/alumnis', async (req, res, next) => {
  try {
    const alumnis = await prisma.alumni.findMany();
    res.json(alumnis);
  } catch (error) {
    next(error);
  }
});

// Route pour récupérer un alumni par ID
app.get('/alumni/:id', async (req, res, next) => {
  try {
    const alumniId = parseInt(req.params.id);
    const alumni = await prisma.alumni.findUnique({ where: { id: alumniId } });
    if (alumni) {
      res.json(alumni);
    } else {
      res.status(404).json({ error: 'Alumni non trouvée' });
    }
  } catch (error) {
    next(error);
  }
});

// Route pour créer un nouvel alumni
app.post('/alumnis', async (req, res, next) => {
  try {
    if (!req.body || !req.body.description) {
      return res.status(400).json({ error: 'Requête invalide' });
    }
    const newAlumni = await prisma.alumni.create({ data: { description: req.body.description } });
    res.status(201).json({ message: 'Alumni ajouté avec succès', alumni: newAlumni });
  } catch (error) {
    next(error);
  }
});

// Route pour mettre à jour un alumni par ID
app.put('/alumni/:id', async (req, res, next) => {
  try {
    const alumniId = parseInt(req.params.id);
    const alumni = await prisma.alumni.findUnique({ where: { id: alumniId } });
    if (alumni) {
      const updatedAlumni = await prisma.alumni.update({
        where: { id: alumniId },
        data: { description: req.body.description },
      });
      res.json({ message: 'Alumni mis à jour avec succès', alumni: updatedAlumni });
    } else {
      res.status(404).json({ error: 'Alumni non trouvée' });
    }
  } catch (error) {
    next(error);
  }
});

// Route pour supprimer un alumni par ID
app.delete('/alumni/:id', async (req, res, next) => {
  try {
    const alumniId = parseInt(req.params.id);
    await prisma.alumni.delete({ where: { id: alumniId } });
    res.json({ message: 'Alumni supprimé avec succès' });
  } catch (error) {
    next(error);
  }
});

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Connexion à la base de données
async function main() {
  try {
    await prisma.$connect();
    console.log('Connexion à la base de données établie');
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    process.exit(1); // Quitte le processus si la connexion échoue
  }
}

main();

// Ferme la connexion Prisma proprement lors de la fermeture du serveur
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});

app.listen(port, () => {
  console.log(`Serveur écoutant sur le port ${port}`);
});
