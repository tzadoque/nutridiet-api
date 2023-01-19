const express = require('express');
const ConsultationController = require('../controllers/ConsultationController');

const consultationRoutes = express.Router();

consultationRoutes.get(
  '/consultations/paciente',
  ConsultationController.findConsultationByPacienteName
);
consultationRoutes.get(
  '/consultations',
  ConsultationController.findAllConsultations
);
consultationRoutes.get(
  '/consultations/:consultation_id',
  ConsultationController.findConsultationById
);

consultationRoutes.post('/consultations', ConsultationController.create);

consultationRoutes.put(
  '/consultations/:consultation_id',
  ConsultationController.update
);

consultationRoutes.delete(
  '/consultations/:consultation_id',
  ConsultationController.delete
);

module.exports = consultationRoutes;
