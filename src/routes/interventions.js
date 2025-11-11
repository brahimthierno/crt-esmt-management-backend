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


// INTEGRATION DE UPLOADS DE FICHIERS ET AJOUT DE LA ROUTE SITES ET DATE EFFECTIVES ET DUREE

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
  downloadFichier,
  getStats,
  getStatsDuree
} = require('../controllers/interventionController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const { SITES_ESMT, SITES_PAR_BATIMENT } = require('../../constants/sites');

// Toutes les routes nécessitent l'authentification
router.use(protect);

// AJOUT DE LA ROUTE POUR LES STATS GLOBALES
router.get('/stats/global', getStats);

// ROUTE POUR LES STATS DE DUREE
router.get('/stats/duree', protect, getStatsDuree);

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

// ✅ NOUVELLE ROUTE : Obtenir la liste des sites
router.get('/sites', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      sites: SITES_ESMT,
      parBatiment: SITES_PAR_BATIMENT
    }
  });
});

module.exports = router;