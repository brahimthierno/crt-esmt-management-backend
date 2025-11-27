const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer le dossier uploads/profiles s'il n'existe pas
const uploadDir = 'src/uploads/profiles/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration du stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Générer un nom unique : userId-timestamp.extension
    const userId = req.user?.id || 'unknown';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = `profile-${userId}-${uniqueSuffix}${extension}`;
    cb(null, filename);
  }
});

// Filtre pour n'accepter que les images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées pour la photo de profil'), false);
  }
};

const uploadProfile = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max pour les photos de profil
    files: 1 // Maximum 1 fichier pour la photo de profil
  }
});

module.exports = uploadProfile;