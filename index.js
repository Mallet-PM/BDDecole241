import express from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = 3000;



app.use(bodyParser.json());

/*let alumnis = [
  { id: 1, description: 'alumni philippe' },
  { id: 2, description: 'alumni Mallet' },
];*/

app.get('/alumnis', (req, res) => {
  const alumnisReferences = alumnis.map(alumni => `/alumnis/${alumni.id}`);
  res.json(alumnisReferences);
});

app.get('/alumni/:id', (req, res) => {
  const alumniId = parseInt(req.params.id);
  const alumni = alumnis.find(alumni => alumni.id === alumniId); 

  if (alumni) {
    res.json(alumni);
  } else {
    res.status(404).json({ error: 'Alumni non trouvée' });
  }
});

app.post('/alumnis', (req, res) => {
  if (!req.body || !req.body.description) {
    res.status(400).json({ error: 'Requête invalide' });
    return;
  }

  const newAlumni = {
    id: alumnis.length + 1,
    description: req.body.description,
  };
  alumnis.push(newAlumni);
  res.status(201).json({ message: 'Alumni ajouté avec succès', alumni: newAlumni });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});


app.put('/alumni/:id', (req,res) => {
    const alumniId = parseInt(req.params.id);
    const alumni = alumnis.find(alumni => alumni.id === alumniId);
    if (alumni) {
        alumni.description = req.body.description;
        res.json({message: 'Alumni mis à jour avec succes', alumni });
    } else {
        res.status(404).json({ error: 'Alumni non trouvée'});
    }
});


app.delete('/alumni/:id', (req, res) => {
    const alumniId = parseInt(req.params.id);
    alumnis = alumnis.filter(alumni => alumni.id !== alumniId);
    res.json({ message: 'Alumni supprimé avec succes'});
});


const prisma = new PrismaClient();

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
    console.log(`Serveur ecoutant sur le port ${port}`);
})