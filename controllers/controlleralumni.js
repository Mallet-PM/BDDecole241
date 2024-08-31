import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const AlumniController = {
  getAllAlumnis: async (req, res) => {
    try {
      const alumnis = await prisma.alumnis.findMany();
      res.json(alumnis);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la récupération des alumnis' });
    }
  },

  getAlumni: async (req, res) => {
    try {
      const id = req.params.id;
      const alumni = await prisma.alumnis.findUnique({ where: { id } });
      if (!alumni) {
        res.status(404).json({ message: 'Alumni not found' });
      } else {
        res.json(alumni);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'alumni' });
    }
  },

  createAlumni: async (req, res) => {
    try {
      const { name, email } = req.body;
      const alumni = await prisma.alumnis.create({ data: { name, email } });
      res.json(alumni);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la création de l\'alumni' });
    }
  },

  updateAlumni: async (req, res) => {
    try {
      const id = req.params.id;
      const { name, email } = req.body;
      const alumni = await prisma.alumnis.update({ where: { id }, data: { name, email } });
      res.json(alumni);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'alumni' });
    }
  },

  deleteAlumni: async (req, res) => {
    try {
      const id = req.params.id;
      await prisma.alumnis.delete({ where: { id } });
      res.json({ message: 'Alumni deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la suppression de l\'alumni' });
    }
  },
};

export default AlumniController;