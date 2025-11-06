// const express = require('express');
// const router = express.Router();
// const {
//   getInterventions,
//   getIntervention,
//   createIntervention,
//   updateIntervention,
//   deleteIntervention,
//   addCommentaire
// } = require('../controllers/interventionController');
// const { protect, authorize } = require('../middleware/auth');

// // Toutes les routes nécessitent l'authentification
// router.use(protect);

// router
//   .route('/')
//   .get(getInterventions)
//   .post(authorize('admin'), createIntervention);

// router
//   .route('/:id')
//   .get(getIntervention)
//   .put(updateIntervention)
//   .delete(authorize('admin'), deleteIntervention);

// router.post('/:id/commentaires', addCommentaire);

// module.exports = router;


// INTEGRATION DE UPLOADS DE FICHIERS

const express = require('express');
const router = express.Router();
const {
  getInterventions,
  getIntervention,
  createIntervention,
  updateIntervention,
  deleteIntervention,
  addCommentaire,
  ajouterFichiers,
  supprimerFichier,
  downloadFichier
} = require('../controllers/interventionController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

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

// NOUVELLES ROUTES POUR LES FICHIERS
router.post('/:id/fichiers', upload.array('fichiers', 5), ajouterFichiers);
router.delete('/:idIntervention/fichiers/:idFichier', supprimerFichier);

// Route pour le téléchargement de fichiers
router.get('/uploads/:filename', downloadFichier);

module.exports = router;