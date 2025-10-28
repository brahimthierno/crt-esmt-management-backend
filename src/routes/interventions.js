const express = require('express');
const router = express.Router();
const {
  getInterventions,
  getIntervention,
  createIntervention,
  updateIntervention,
  deleteIntervention,
  addCommentaire
} = require('../controllers/interventionController');
const { protect, authorize } = require('../middleware/auth');

// Toutes les routes nécessitent l'authentification
router.use(protect);

router
  .route('/')
  .get(getInterventions)
  .post(authorize('admin'), createIntervention);

router
  .route('/:id')
  .get(getIntervention)
  .put(updateIntervention)
  .delete(authorize('admin'), deleteIntervention);

router.post('/:id/commentaires', addCommentaire);

module.exports = router;