import express from 'express';
import AlumniController from '../controllers/controlleralumni';

routeAlumnis.get('/alumnis', AlumniController.getAllAlumnis);
routeAlumnis.get('/alumni/:id', AlumniController.getAlumniById);
routeAlumnis.post('/alumni', AlumniController.createAlumni);
routeAlumnis.put('/alumni/:id', AlumniController.updateAlumni);
routeAlumnis.delete('/alumni/:id', AlumniController.deleteAlumni);


export default routeAlumnis;