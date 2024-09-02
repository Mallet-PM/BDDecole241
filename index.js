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

// Appliquer le middleware CORS de manière globale
app.use(cors(corsOptions));

// Autres middlewares
app.use(bodyParser.json());

// Routes pour gérer les alumnis

app.get('/alumnis', async (req, res, next) => {
  try {
    const alumnis = await prisma.alumni.findMany();
    res.json(alumnis);
  } catch (error) {
    next(error);
  }
});

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

app.post('/alumnis', async (req, res, next) => {
  try {
    const { nom, prenom, email, promo, campus, genre, date_de_naissance, numero, referentiel, periode } = req.body;

    // Validation des données entrantes
    if (!nom || !prenom || !email || !promo || !campus || !genre || !date_de_naissance || !numero || !referentiel || !periode) {
      return res.status(400).json({ error: 'Requête invalide: Tous les champs sont obligatoires.' });
    }

    const newAlumni = await prisma.alumni.create({ 
      data: { nom, prenom, email, promo, campus, genre, date_de_naissance, numero, referentiel, periode } 
    });

    res.status(201).json({ message: 'Alumni ajouté avec succès', alumni: newAlumni });
  } catch (error) {
    next(error);
  }
});

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


