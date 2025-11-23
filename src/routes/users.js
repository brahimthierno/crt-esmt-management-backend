const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  getTechniciensStats,
  updateOwnProfile
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');


// ✅ ROUTE POUR METTRE À JOUR SON PROPRE PROFIL (accessible à tous les utilisateurs connectés)
// DOIT ÊTRE AVANT les routes admin pour éviter que "profile" soit interprété comme un ID
router.put('/profile/me', protect, updateOwnProfile);

// Toutes les routes nécessitent l'authentification et le rôle admin
router.use(protect);
router.use(authorize('admin'));

router.get('/stats/techniciens', getTechniciensStats);

router
  .route('/')
  .get(getUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.put('/:id/password', changePassword);

module.exports = router;