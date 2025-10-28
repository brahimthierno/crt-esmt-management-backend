const express = require('express');
const router = express.Router();
const {
  getStock,
  getMateriel,
  createMateriel,
  updateMateriel,
  deleteMateriel,
  getStockStats
} = require('../controllers/stockController');
const { protect, authorize } = require('../middleware/auth');

// Toutes les routes nécessitent l'authentification
router.use(protect);

router.get('/stats/global', getStockStats);

router
  .route('/')
  .get(getStock)
  .post(authorize('admin'), createMateriel);

router
  .route('/:id')
  .get(getMateriel)
  .put(authorize('admin'), updateMateriel)
  .delete(authorize('admin'), deleteMateriel);

module.exports = router;