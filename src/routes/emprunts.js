
// NOUVELLE VERSION AVEC GESTION DES EMPRUNTS DU TECHNICIEN

const express = require('express');
const router = express.Router();
const {
  getEmprunts,
  getEmprunt,
  createEmprunt,
  retournerEmprunt,
  updateEmprunt,
  deleteEmprunt,
  getEmpruntsEnRetard
} = require('../controllers/empruntController');
const { protect, authorize } = require('../middleware/auth');

// Toutes les routes nécessitent l'authentification
router.use(protect);

router.get('/retards/liste', getEmpruntsEnRetard);

router
  .route('/')
  .get(getEmprunts)
  .post(authorize('admin', 'informaticien', 'electricien'), createEmprunt);

router
  .route('/:id')
  .get(getEmprunt)
  .put(authorize('admin', 'informaticien', 'electricien'), updateEmprunt)
  .delete(authorize('admin'), deleteEmprunt);

router.put('/:id/retour', authorize('admin', 'informaticien', 'electricien'), retournerEmprunt);

module.exports = router;