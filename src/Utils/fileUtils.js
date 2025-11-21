/**
 * Utilitaires pour la gestion des fichiers
 */

// Configuration de l'URL de l'API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Obtenir l'URL complète d'un fichier
 * @param {string} fileUrl - URL relative du fichier (ex: /uploads/file.pdf)
 * @returns {string} URL complète
 */
export const getFileUrl = (fileUrl) => {
  if (!fileUrl) return '#';
  
  // Extraire le nom du fichier de l'URL
  const filename = fileUrl.split('/').pop();
  
  // Construire l'URL complète
  return `${API_URL}/uploads/${filename}`;
};

/**
 * Ouvrir un fichier dans un nouvel onglet
 * @param {string} fileUrl - URL relative du fichier
 */
export const openFile = (fileUrl) => {
  const url = getFileUrl(fileUrl);
  window.open(url, '_blank');
};

/**
 * Télécharger un fichier
 * @param {string} fileUrl - URL relative du fichier
 * @param {string} filename - Nom du fichier pour le téléchargement
 */
export const downloadFile = (fileUrl, filename) => {
  const url = getFileUrl(fileUrl);
  
  // Créer un lien temporaire pour forcer le téléchargement
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'fichier';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Formater la taille d'un fichier
 * @param {number} bytes - Taille en bytes
 * @returns {string} Taille formatée
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Obtenir le type d'un fichier à partir de son nom
 * @param {string} filename - Nom du fichier
 * @returns {string} Type du fichier (image, document, autre)
 */
export const getFileType = (filename) => {
  if (!filename) return 'autre';
  
  const ext = filename.split('.').pop().toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) {
    return 'image';
  }
  
  if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'csv'].includes(ext)) {
    return 'document';
  }
  
  return 'autre';
};

/**
 * Valider un fichier avant l'upload
 * @param {File} file - Fichier à valider
 * @param {Object} options - Options de validation
 * @returns {Object} Résultat de la validation { valid: boolean, error: string }
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB par défaut
    allowedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx']
  } = options;
  
  // Vérifier la taille
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Le fichier dépasse la taille maximale de ${formatFileSize(maxSize)}`
    };
  }
  
  // Vérifier le type
  const fileType = file.type;
  const fileExt = `.${file.name.split('.').pop().toLowerCase()}`;
  
  const isAllowed = allowedTypes.some(type => {
    if (type.includes('*')) {
      // Type générique (ex: image/*)
      const baseType = type.split('/')[0];
      return fileType.startsWith(baseType);
    } else if (type.startsWith('.')) {
      // Extension (ex: .pdf)
      return fileExt === type;
    } else {
      // Type MIME exact (ex: application/pdf)
      return fileType === type;
    }
  });
  
  if (!isAllowed) {
    return {
      valid: false,
      error: 'Type de fichier non autorisé'
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Obtenir l'icône appropriée pour un type de fichier
 * @param {string} fileType - Type du fichier
 * @returns {string} Nom de l'icône
 */
export const getFileIcon = (fileType) => {
  switch (fileType) {
    case 'image':
      return 'Image';
    case 'document':
      return 'FileText';
    default:
      return 'File';
  }
};

export default {
  getFileUrl,
  openFile,
  downloadFile,
  formatFileSize,
  getFileType,
  validateFile,
  getFileIcon
};