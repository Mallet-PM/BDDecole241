import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = 3000;

// Configuration de CORS pour autoriser les requêtes en provenance de tous les domaines
const corsOptions = {
  origin: '*', // ou spécifiez un domaine spécifique, par exemple 'https://formulair-ten.vercel.app'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600, // en secondes
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const prisma = new PrismaClient();

app.get('/alumnis', async (req, res) => {
  const alumnis = await prisma.alumni.findMany();
  res.json(alumnis);
});

app.get('/alumni/:id', async (req, res) => {
  const alumniId = parseInt(req.params.id);
  const alumni = await prisma.alumni.findUnique({ where: { id: alumniId } });
  if (alumni) {
    res.json(alumni);
  } else {
    res.status(404).json({ error: 'Alumni non trouvée' });
  }
});

app.post('/alumnis', async (req, res) => {
  if (!req.body || !req.body.description) {
    res.status(400).json({ error: 'Requête invalide' });
    return;
  }
  const newAlumni = await prisma.alumni.create({ data: { description: req.body.description } });
  res.status(201).json({ message: 'Alumni ajouté avec succès', alumni: newAlumni });
});

app.put('/alumni/:id', async (req, res) => {
  const alumniId = parseInt(req.params.id);
  const alumni = await prisma.alumni.findUnique({ where: { id: alumniId } });
  if (alumni) {
    const updatedAlumni = await prisma.alumni.update({ where: { id: alumniId }, data: { description: req.body.description } });
    res.json({ message: 'Alumni mis à jour avec succès', alumni: updatedAlumni });
  } else {
    res.status(404).json({ error: 'Alumni non trouvée' });
  }
});

app.delete('/alumni/:id', async (req, res) => {
  const alumniId = parseInt(req.params.id);
  await prisma.alumni.delete({ where: { id: alumniId } });
  res.json({ message: 'Alumni supprimé avec succès' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

async function main() {
  try {
    await prisma.$connect();
    console.log('Connexion à la base de données établie');
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
  }
}

main();

app.listen(port, () => {
  console.log(`Serveur écoutant sur le port ${port}`);
});