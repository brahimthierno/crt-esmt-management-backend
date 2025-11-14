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

// const express = require('express');
// const router = express.Router();
// const {
//   getInterventions,
//   getIntervention,
//   createIntervention,
//   updateIntervention,
//   deleteIntervention,
//   addCommentaire,
//   ajouterFichiers,
//   supprimerFichier,
//   downloadFichier,
//   getStats,
//   getStatsDuree,

//   // POUR LES STATISTIQUES DES INTERVENTIONS
//   getStatsDureeDetaillees, 
//   getEvolutionDurees, 
//   exportDonnees
// } = require('../controllers/interventionController');
// const { protect, authorize } = require('../middleware/auth');
// const upload = require('../middleware/upload');

// const { SITES_ESMT, SITES_PAR_BATIMENT } = require('../../constants/sites');

// // Toutes les routes nécessitent l'authentification
// router.use(protect);

// // AJOUT DE LA ROUTE POUR LES STATS GLOBALES
// router.get('/stats/global', getStats);

// // ROUTE POUR LES STATS DE DUREE
// router.get('/stats/duree', protect, getStatsDuree);


// router.get('/stats/duree-detaillees', protect, getStatsDureeDetaillees);
// router.get('/stats/evolution-durees', protect, getEvolutionDurees);
// router.get('/stats/export', protect, exportDonnees);

// // Route pour le téléchargement de fichiers
// router.get('/uploads/:filename', downloadFichier);

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

// // NOUVELLES ROUTES POUR LES FICHIERS
// router.post('/:id/fichiers', upload.array('fichiers', 5), ajouterFichiers);
// router.delete('/:idIntervention/fichiers/:idFichier', supprimerFichier);

// // ✅ NOUVELLE ROUTE : Obtenir la liste des sites
// router.get('/sites', (req, res) => {
//   res.status(200).json({
//     success: true,
//     data: {
//       sites: SITES_ESMT,
//       parBatiment: SITES_PAR_BATIMENT
//     }
//   });
// });

// module.exports = router;


// NOUVELLE VERSION POUR AJOUTER UNE LISTE DEROULANTE POUR LE CHAMP MATERIEL


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
  getStatsDuree,

  // POUR LES STATISTIQUES DES INTERVENTIONS
  getStatsDureeDetaillees, 
  getEvolutionDurees, 
  exportDonnees,
  // ✅ NOUVELLE FONCTION : Valider une intervention (admin)
  validerIntervention
} = require('../controllers/interventionController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const { SITES_ESMT, SITES_PAR_BATIMENT } = require('../../constants/sites');

// ✅ Définition des équipements par catégorie
const EQUIPEMENTS = {
  INFORMATIQUE: [
    'ordinateur_bureau',
    'ordinateur_portable', 
    'serveur',
    'imprimante',
    'photocopieuse',
    'videoprojecteur',
    'point_acces',
    'commutateur',
    'routeur',
    'cable_projection',
    'tablette_tactile',
    'ecran',
    'clavier_souris',
    'onduleur'
  ],
  ELECTRIQUE: [
    'climatiseur',
    'ventilateur',
    'prise_electrique',
    'disjoncteur',
    'tableau_electrique',
    'eclairage',
    'onduleur',
    'groupe_electrogene',
    'parafoudre'
  ]
};

// ✅ Liste combinée pour le enum
const ALL_EQUIPEMENTS = [...EQUIPEMENTS.INFORMATIQUE, ...EQUIPEMENTS.ELECTRIQUE];

// Toutes les routes nécessitent l'authentification
router.use(protect);

router.put('/:id/valider', protect, authorize('admin'), validerIntervention);

// ✅ NOUVELLE ROUTE : Obtenir la liste des équipements
router.get('/equipements', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        categories: EQUIPEMENTS,
        allEquipements: ALL_EQUIPEMENTS
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des équipements'
    });
  }
});

// AJOUT DE LA ROUTE POUR LES STATS GLOBALES
router.get('/stats/global', getStats);

// ROUTE POUR LES STATS DE DUREE
router.get('/stats/duree', protect, getStatsDuree);

router.get('/stats/duree-detaillees', protect, getStatsDureeDetaillees);
router.get('/stats/evolution-durees', protect, getEvolutionDurees);
router.get('/stats/export', protect, exportDonnees);

// Route pour le téléchargement de fichiers
router.get('/uploads/:filename', downloadFichier);

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