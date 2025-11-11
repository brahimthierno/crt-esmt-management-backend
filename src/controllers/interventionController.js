// const Intervention = require('../models/Intervention');

// // @desc    Obtenir toutes les interventions
// // @route   GET /api/interventions
// // @access  Private
// exports.getInterventions = async (req, res) => {
//   try {
//     let query = {};

//     // Si l'utilisateur n'est pas admin, ne montrer que ses interventions
//     if (req.user.role !== 'admin') {
//       query.technicien = req.user.id;
//     }

//     // Filtres optionnels
//     if (req.query.statut) {
//       query.statut = req.query.statut;
//     }

//     if (req.query.dateDebut) {
//       query.dateDebut = { $gte: new Date(req.query.dateDebut) };
//     }

//     if (req.query.priorite) {
//       query.priorite = req.query.priorite;
//     }

//     const interventions = await Intervention.find(query)
//       .populate('technicien', 'nom prenom role username')
//       .sort({ dateDebut: -1 });

//     res.status(200).json({
//       success: true,
//       count: interventions.length,
//       data: interventions
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Obtenir une intervention par ID
// // @route   GET /api/interventions/:id
// // @access  Private
// exports.getIntervention = async (req, res) => {
//   try {
//     const intervention = await Intervention.findById(req.params.id)
//       .populate('technicien', 'nom prenom role username')
//       .populate('commentaires.auteur', 'nom prenom');

//     if (!intervention) {
//       return res.status(404).json({
//         success: false,
//         message: 'Intervention non trouvée'
//       });
//     }

//     // Vérifier les permissions
//     if (req.user.role !== 'admin' && intervention.technicien._id.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: 'Non autorisé à accéder à cette intervention'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: intervention
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Créer une nouvelle intervention
// // @route   POST /api/interventions
// // @access  Private (Admin only)
// exports.createIntervention = async (req, res) => {
//   try {
//     const intervention = await Intervention.create(req.body);

//     const populatedIntervention = await Intervention.findById(intervention._id)
//       .populate('technicien', 'nom prenom role username');

//     res.status(201).json({
//       success: true,
//       data: populatedIntervention
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Mettre à jour une intervention
// // @route   PUT /api/interventions/:id
// // @access  Private
// exports.updateIntervention = async (req, res) => {
//   try {
//     let intervention = await Intervention.findById(req.params.id);

//     if (!intervention) {
//       return res.status(404).json({
//         success: false,
//         message: 'Intervention non trouvée'
//       });
//     }

//     // Vérifier les permissions
//     if (req.user.role !== 'admin' && intervention.technicien.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: 'Non autorisé à modifier cette intervention'
//       });
//     }

//     // Si un technicien termine son intervention
//     if (req.body.statut === 'terminee' && !intervention.dateFin) {
//       req.body.dateFin = new Date();
//     }

//     intervention = await Intervention.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true
//       }
//     ).populate('technicien', 'nom prenom role username');

//     res.status(200).json({
//       success: true,
//       data: intervention
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Supprimer une intervention
// // @route   DELETE /api/interventions/:id
// // @access  Private (Admin only)
// exports.deleteIntervention = async (req, res) => {
//   try {
//     const intervention = await Intervention.findById(req.params.id);

//     if (!intervention) {
//       return res.status(404).json({
//         success: false,
//         message: 'Intervention non trouvée'
//       });
//     }

//     await intervention.deleteOne();

//     res.status(200).json({
//       success: true,
//       data: {},
//       message: 'Intervention supprimée avec succès'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Ajouter un commentaire à une intervention
// // @route   POST /api/interventions/:id/commentaires
// // @access  Private
// exports.addCommentaire = async (req, res) => {
//   try {
//     const intervention = await Intervention.findById(req.params.id);

//     if (!intervention) {
//       return res.status(404).json({
//         success: false,
//         message: 'Intervention non trouvée'
//       });
//     }

//     intervention.commentaires.push({
//       auteur: req.user.id,
//       texte: req.body.texte
//     });

//     await intervention.save();

//     const updatedIntervention = await Intervention.findById(req.params.id)
//       .populate('commentaires.auteur', 'nom prenom');

//     res.status(200).json({
//       success: true,
//       data: updatedIntervention
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };



// INTEGRATION DE UPLOADS DE FICHIERS


// const Intervention = require('../models/Intervention');
// const fs = require('fs');
// const path = require('path');

// // @desc    Obtenir toutes les interventions
// // @route   GET /api/interventions
// // @access  Private
// exports.getInterventions = async (req, res) => {
//   try {
//     let query = {};

//     // Si l'utilisateur n'est pas admin, ne montrer que ses interventions
//     if (req.user.role !== 'admin') {
//       query.technicien = req.user.id;
//     }

//     // Filtres optionnels
//     if (req.query.statut) {
//       query.statut = req.query.statut;
//     }

//     if (req.query.dateDebut) {
//       query.dateDebut = { $gte: new Date(req.query.dateDebut) };
//     }

//     if (req.query.priorite) {
//       query.priorite = req.query.priorite;
//     }

//     const interventions = await Intervention.find(query)
//       .populate('technicien', 'nom prenom role username')
//       .populate('fichiers.uploadedBy', 'nom prenom')
//       .populate('commentaires.auteur', 'nom prenom')
//       .sort({ dateDebut: -1 });

//     res.status(200).json({
//       success: true,
//       count: interventions.length,
//       data: interventions
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Obtenir une intervention par ID
// // @route   GET /api/interventions/:id
// // @access  Private
// exports.getIntervention = async (req, res) => {
//   try {
//     const intervention = await Intervention.findById(req.params.id)
//       .populate('technicien', 'nom prenom role username')
//       .populate('fichiers.uploadedBy', 'nom prenom')
//       .populate('commentaires.auteur', 'nom prenom');

//     if (!intervention) {
//       return res.status(404).json({
//         success: false,
//         message: 'Intervention non trouvée'
//       });
//     }

//     // Vérifier les permissions
//     if (req.user.role !== 'admin' && intervention.technicien._id.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: 'Non autorisé à accéder à cette intervention'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: intervention
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Créer une nouvelle intervention
// // @route   POST /api/interventions
// // @access  Private (Admin only)
// exports.createIntervention = async (req, res) => {
//   try {
//     const intervention = await Intervention.create(req.body);

//     const populatedIntervention = await Intervention.findById(intervention._id)
//       .populate('technicien', 'nom prenom role username')
//       .populate('fichiers.uploadedBy', 'nom prenom');

//     res.status(201).json({
//       success: true,
//       data: populatedIntervention
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Mettre à jour une intervention
// // @route   PUT /api/interventions/:id
// // @access  Private
// exports.updateIntervention = async (req, res) => {
//   try {
//     let intervention = await Intervention.findById(req.params.id);

//     if (!intervention) {
//       return res.status(404).json({
//         success: false,
//         message: 'Intervention non trouvée'
//       });
//     }

//     // Vérifier les permissions
//     if (req.user.role !== 'admin' && intervention.technicien.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: 'Non autorisé à modifier cette intervention'
//       });
//     }

//     // Si un technicien termine son intervention
//     if (req.body.statut === 'terminee' && !intervention.dateFin) {
//       req.body.dateFin = new Date();
//     }

//     intervention = await Intervention.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true
//       }
//     )
//     .populate('technicien', 'nom prenom role username')
//     .populate('fichiers.uploadedBy', 'nom prenom')
//     .populate('commentaires.auteur', 'nom prenom');

//     res.status(200).json({
//       success: true,
//       data: intervention
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Supprimer une intervention
// // @route   DELETE /api/interventions/:id
// // @access  Private (Admin only)
// exports.deleteIntervention = async (req, res) => {
//   try {
//     const intervention = await Intervention.findById(req.params.id);

//     if (!intervention) {
//       return res.status(404).json({
//         success: false,
//         message: 'Intervention non trouvée'
//       });
//     }

//     // Supprimer tous les fichiers physiques associés
//     if (intervention.fichiers && intervention.fichiers.length > 0) {
//       intervention.fichiers.forEach(fichier => {
//         const filePath = path.join(__dirname, '..', 'uploads', path.basename(fichier.url));
//         if (fs.existsSync(filePath)) {
//           fs.unlinkSync(filePath);
//         }
//       });
//     }

//     await intervention.deleteOne();

//     res.status(200).json({
//       success: true,
//       data: {},
//       message: 'Intervention et ses fichiers supprimés avec succès'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Ajouter un commentaire à une intervention
// // @route   POST /api/interventions/:id/commentaires
// // @access  Private
// exports.addCommentaire = async (req, res) => {
//   try {
//     const intervention = await Intervention.findById(req.params.id);

//     if (!intervention) {
//       return res.status(404).json({
//         success: false,
//         message: 'Intervention non trouvée'
//       });
//     }

//     intervention.commentaires.push({
//       auteur: req.user.id,
//       texte: req.body.texte
//     });

//     await intervention.save();

//     const updatedIntervention = await Intervention.findById(req.params.id)
//       .populate('technicien', 'nom prenom role username')
//       .populate('fichiers.uploadedBy', 'nom prenom')
//       .populate('commentaires.auteur', 'nom prenom');

//     res.status(200).json({
//       success: true,
//       data: updatedIntervention
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Ajouter des fichiers à une intervention
// // @route   POST /api/interventions/:id/fichiers
// // @access  Private
// exports.ajouterFichiers = async (req, res) => {
//   try {
//     const intervention = await Intervention.findById(req.params.id);

//     if (!intervention) {
//       // Supprimer les fichiers uploadés si l'intervention n'existe pas
//       if (req.files && req.files.length > 0) {
//         req.files.forEach(file => {
//           const filePath = path.join(__dirname, '..', 'uploads', file.filename);
//           if (fs.existsSync(filePath)) {
//             fs.unlinkSync(filePath);
//           }
//         });
//       }

//       return res.status(404).json({
//         success: false,
//         message: 'Intervention non trouvée'
//       });
//     }

//     // Vérifier les permissions
//     if (req.user.role !== 'admin' && intervention.technicien.toString() !== req.user.id) {
//       // Supprimer les fichiers uploadés si non autorisé
//       if (req.files && req.files.length > 0) {
//         req.files.forEach(file => {
//           const filePath = path.join(__dirname, '..', 'uploads', file.filename);
//           if (fs.existsSync(filePath)) {
//             fs.unlinkSync(filePath);
//           }
//         });
//       }

//       return res.status(403).json({
//         success: false,
//         message: 'Non autorisé à modifier cette intervention'
//       });
//     }

//     // Traiter les fichiers uploadés
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Aucun fichier uploadé'
//       });
//     }

//     const nouveauxFichiers = req.files.map(file => {
//       // Déterminer le type de fichier
//       let type = 'autre';
//       if (file.mimetype.startsWith('image/')) {
//         type = 'image';
//       } else if (
//         file.mimetype === 'application/pdf' ||
//         file.mimetype === 'application/msword' ||
//         file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
//         file.mimetype === 'application/vnd.ms-excel' ||
//         file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//       ) {
//         type = 'document';
//       }

//       return {
//         nom: file.originalname,
//         url: `/uploads/${file.filename}`,
//         type: type,
//         taille: file.size,
//         uploadedBy: req.user.id
//       };
//     });

//     // Ajouter les fichiers à l'intervention
//     intervention.fichiers.push(...nouveauxFichiers);
//     await intervention.save();

//     const updatedIntervention = await Intervention.findById(req.params.id)
//       .populate('technicien', 'nom prenom role username')
//       .populate('fichiers.uploadedBy', 'nom prenom')
//       .populate('commentaires.auteur', 'nom prenom');

//     res.status(200).json({
//       success: true,
//       data: updatedIntervention,
//       message: `${req.files.length} fichier(s) ajouté(s) avec succès`
//     });
//   } catch (error) {
//     // Nettoyer les fichiers uploadés en cas d'erreur
//     if (req.files && req.files.length > 0) {
//       req.files.forEach(file => {
//         const filePath = path.join(__dirname, '..', 'uploads', file.filename);
//         if (fs.existsSync(filePath)) {
//           fs.unlinkSync(filePath);
//         }
//       });
//     }

//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Supprimer un fichier d'une intervention
// // @route   DELETE /api/interventions/:idIntervention/fichiers/:idFichier
// // @access  Private
// exports.supprimerFichier = async (req, res) => {
//   try {
//     const intervention = await Intervention.findById(req.params.idIntervention);

//     if (!intervention) {
//       return res.status(404).json({
//         success: false,
//         message: 'Intervention non trouvée'
//       });
//     }

//     // Vérifier les permissions
//     if (req.user.role !== 'admin' && intervention.technicien.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: 'Non autorisé à modifier cette intervention'
//       });
//     }

//     // Trouver le fichier
//     const fichier = intervention.fichiers.id(req.params.idFichier);
//     if (!fichier) {
//       return res.status(404).json({
//         success: false,
//         message: 'Fichier non trouvé'
//       });
//     }

//     // Supprimer le fichier physique du serveur
//     const filePath = path.join(__dirname, '..', 'uploads', path.basename(fichier.url));
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }

//     // Supprimer le fichier de la base de données
//     intervention.fichiers.pull({ _id: req.params.idFichier });
//     await intervention.save();

//     const updatedIntervention = await Intervention.findById(req.params.idIntervention)
//       .populate('technicien', 'nom prenom role username')
//       .populate('fichiers.uploadedBy', 'nom prenom')
//       .populate('commentaires.auteur', 'nom prenom');

//     res.status(200).json({
//       success: true,
//       data: updatedIntervention,
//       message: 'Fichier supprimé avec succès'
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Télécharger un fichier
// // @route   GET /api/uploads/:filename
// // @access  Private
// exports.downloadFichier = async (req, res) => {
//   try {
//     const filename = req.params.filename;
//     const filePath = path.join(__dirname, '..', 'uploads', filename);

//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({
//         success: false,
//         message: 'Fichier non trouvé'
//       });
//     }

//     // Déterminer le type MIME pour le header Content-Type
//     const ext = path.extname(filename).toLowerCase();
//     const mimeTypes = {
//       '.pdf': 'application/pdf',
//       '.jpg': 'image/jpeg',
//       '.jpeg': 'image/jpeg',
//       '.png': 'image/png',
//       '.gif': 'image/gif',
//       '.doc': 'application/msword',
//       '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//       '.xls': 'application/vnd.ms-excel',
//       '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//     };

//     const mimeType = mimeTypes[ext] || 'application/octet-stream';

//     res.setHeader('Content-Type', mimeType);
//     res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
//     const fileStream = fs.createReadStream(filePath);
//     fileStream.pipe(res);

//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Obtenir les statistiques des interventions
// // @route   GET /api/interventions/stats/global
// // @access  Private
// exports.getStats = async (req, res) => {
//   try {
//     let matchQuery = {};

//     // Si l'utilisateur n'est pas admin, ne compter que ses interventions
//     if (req.user.role !== 'admin') {
//       matchQuery.technicien = req.user.id;
//     }

//     const stats = await Intervention.aggregate([
//       { $match: matchQuery },
//       {
//         $group: {
//           _id: '$statut',
//           count: { $sum: 1 },
//           totalFichiers: { $sum: { $size: '$fichiers' } }
//         }
//       }
//     ]);

//     const totalInterventions = await Intervention.countDocuments(matchQuery);
//     const interventionsAvecFichiers = await Intervention.countDocuments({
//       ...matchQuery,
//       'fichiers.0': { $exists: true }
//     });

//     const statsFormatted = {
//       total: totalInterventions,
//       parStatut: stats.reduce((acc, stat) => {
//         acc[stat._id] = stat.count;
//         return acc;
//       }, {}),
//       fichiers: {
//         total: stats.reduce((acc, stat) => acc + stat.totalFichiers, 0),
//         interventionsAvecFichiers: interventionsAvecFichiers
//       }
//     };

//     res.status(200).json({
//       success: true,
//       data: statsFormatted
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };



// NOUVELLE VERSION CLAUDE AVEC INTEGRATION DE DE DATE LES FONCTIONNALITES DE DATES EFFECTIVES ET DUREE



const Intervention = require('../models/Intervention');
const fs = require('fs');
const path = require('path');

// @desc    Obtenir toutes les interventions
// @route   GET /api/interventions
// @access  Private
exports.getInterventions = async (req, res) => {
  try {
    let query = {};

    // Si l'utilisateur n'est pas admin, ne montrer que ses interventions
    if (req.user.role !== 'admin') {
      query.technicien = req.user.id;
    }

    // Filtres optionnels
    if (req.query.statut) {
      query.statut = req.query.statut;
    }

    if (req.query.dateDebut) {
      query.dateDebut = { $gte: new Date(req.query.dateDebut) };
    }

    if (req.query.priorite) {
      query.priorite = req.query.priorite;
    }

    const interventions = await Intervention.find(query)
      .populate('technicien', 'nom prenom role username')
      .populate('fichiers.uploadedBy', 'nom prenom')
      .populate('commentaires.auteur', 'nom prenom')
      .sort({ dateDebut: -1 });

    res.status(200).json({
      success: true,
      count: interventions.length,
      data: interventions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir une intervention par ID
// @route   GET /api/interventions/:id
// @access  Private
exports.getIntervention = async (req, res) => {
  try {
    const intervention = await Intervention.findById(req.params.id)
      .populate('technicien', 'nom prenom role username')
      .populate('fichiers.uploadedBy', 'nom prenom')
      .populate('commentaires.auteur', 'nom prenom');

    if (!intervention) {
      return res.status(404).json({
        success: false,
        message: 'Intervention non trouvée'
      });
    }

    // Vérifier les permissions
    if (req.user.role !== 'admin' && intervention.technicien._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à accéder à cette intervention'
      });
    }

    res.status(200).json({
      success: true,
      data: intervention
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Créer une nouvelle intervention
// @route   POST /api/interventions
// @access  Private (Admin only)
exports.createIntervention = async (req, res) => {
  try {
    const intervention = await Intervention.create(req.body);

    const populatedIntervention = await Intervention.findById(intervention._id)
      .populate('technicien', 'nom prenom role username')
      .populate('fichiers.uploadedBy', 'nom prenom');

    res.status(201).json({
      success: true,
      data: populatedIntervention
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mettre à jour une intervention
// @route   PUT /api/interventions/:id
// @access  Private
exports.updateIntervention = async (req, res) => {
  try {
    let intervention = await Intervention.findById(req.params.id);

    if (!intervention) {
      return res.status(404).json({
        success: false,
        message: 'Intervention non trouvée'
      });
    }

    // Vérifier les permissions
    if (req.user.role !== 'admin' && intervention.technicien.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cette intervention'
      });
    }

    // Mettre à jour les champs
    Object.keys(req.body).forEach(key => {
      intervention[key] = req.body[key];
    });

    // Sauvegarder pour déclencher le middleware pre('save')
    await intervention.save();

    // Repopuler les relations
    intervention = await Intervention.findById(req.params.id)
      .populate('technicien', 'nom prenom role username')
      .populate('fichiers.uploadedBy', 'nom prenom')
      .populate('commentaires.auteur', 'nom prenom');

    res.status(200).json({
      success: true,
      data: intervention
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Supprimer une intervention
// @route   DELETE /api/interventions/:id
// @access  Private (Admin only)
exports.deleteIntervention = async (req, res) => {
  try {
    const intervention = await Intervention.findById(req.params.id);

    if (!intervention) {
      return res.status(404).json({
        success: false,
        message: 'Intervention non trouvée'
      });
    }

    // Supprimer tous les fichiers physiques associés
    if (intervention.fichiers && intervention.fichiers.length > 0) {
      intervention.fichiers.forEach(fichier => {
        const filePath = path.join(__dirname, '..', 'uploads', path.basename(fichier.url));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await intervention.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Intervention et ses fichiers supprimés avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Ajouter un commentaire à une intervention
// @route   POST /api/interventions/:id/commentaires
// @access  Private
exports.addCommentaire = async (req, res) => {
  try {
    const intervention = await Intervention.findById(req.params.id);

    if (!intervention) {
      return res.status(404).json({
        success: false,
        message: 'Intervention non trouvée'
      });
    }

    intervention.commentaires.push({
      auteur: req.user.id,
      texte: req.body.texte
    });

    await intervention.save();

    const updatedIntervention = await Intervention.findById(req.params.id)
      .populate('technicien', 'nom prenom role username')
      .populate('fichiers.uploadedBy', 'nom prenom')
      .populate('commentaires.auteur', 'nom prenom');

    res.status(200).json({
      success: true,
      data: updatedIntervention
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Ajouter des fichiers à une intervention
// @route   POST /api/interventions/:id/fichiers
// @access  Private
exports.ajouterFichiers = async (req, res) => {
  try {
    const intervention = await Intervention.findById(req.params.id);

    if (!intervention) {
      // Supprimer les fichiers uploadés si l'intervention n'existe pas
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          const filePath = path.join(__dirname, '..', 'uploads', file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }

      return res.status(404).json({
        success: false,
        message: 'Intervention non trouvée'
      });
    }

    // Vérifier les permissions
    if (req.user.role !== 'admin' && intervention.technicien.toString() !== req.user.id) {
      // Supprimer les fichiers uploadés si non autorisé
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          const filePath = path.join(__dirname, '..', 'uploads', file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }

      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cette intervention'
      });
    }

    // Traiter les fichiers uploadés
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier uploadé'
      });
    }

    const nouveauxFichiers = req.files.map(file => {
      // Déterminer le type de fichier
      let type = 'autre';
      if (file.mimetype.startsWith('image/')) {
        type = 'image';
      } else if (
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'application/vnd.ms-excel' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        type = 'document';
      }

      return {
        nom: file.originalname,
        url: `/uploads/${file.filename}`,
        type: type,
        taille: file.size,
        uploadedBy: req.user.id
      };
    });

    // Ajouter les fichiers à l'intervention
    intervention.fichiers.push(...nouveauxFichiers);
    await intervention.save();

    const updatedIntervention = await Intervention.findById(req.params.id)
      .populate('technicien', 'nom prenom role username')
      .populate('fichiers.uploadedBy', 'nom prenom')
      .populate('commentaires.auteur', 'nom prenom');

    res.status(200).json({
      success: true,
      data: updatedIntervention,
      message: `${req.files.length} fichier(s) ajouté(s) avec succès`
    });
  } catch (error) {
    // Nettoyer les fichiers uploadés en cas d'erreur
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '..', 'uploads', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Supprimer un fichier d'une intervention
// @route   DELETE /api/interventions/:idIntervention/fichiers/:idFichier
// @access  Private
exports.supprimerFichier = async (req, res) => {
  try {
    const intervention = await Intervention.findById(req.params.idIntervention);

    if (!intervention) {
      return res.status(404).json({
        success: false,
        message: 'Intervention non trouvée'
      });
    }

    // Vérifier les permissions
    if (req.user.role !== 'admin' && intervention.technicien.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cette intervention'
      });
    }

    // Trouver le fichier
    const fichier = intervention.fichiers.id(req.params.idFichier);
    if (!fichier) {
      return res.status(404).json({
        success: false,
        message: 'Fichier non trouvé'
      });
    }

    // Supprimer le fichier physique du serveur
    const filePath = path.join(__dirname, '..', 'uploads', path.basename(fichier.url));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Supprimer le fichier de la base de données
    intervention.fichiers.pull({ _id: req.params.idFichier });
    await intervention.save();

    const updatedIntervention = await Intervention.findById(req.params.idIntervention)
      .populate('technicien', 'nom prenom role username')
      .populate('fichiers.uploadedBy', 'nom prenom')
      .populate('commentaires.auteur', 'nom prenom');

    res.status(200).json({
      success: true,
      data: updatedIntervention,
      message: 'Fichier supprimé avec succès'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Télécharger un fichier
// @route   GET /api/uploads/:filename
// @access  Private
exports.downloadFichier = async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Fichier non trouvé'
      });
    }

    // Déterminer le type MIME pour le header Content-Type
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };

    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir les statistiques des interventions
// @route   GET /api/interventions/stats/global
// @access  Private
exports.getStats = async (req, res) => {
  try {
    let matchQuery = {};

    // Si l'utilisateur n'est pas admin, ne compter que ses interventions
    if (req.user.role !== 'admin') {
      matchQuery.technicien = req.user.id;
    }

    const stats = await Intervention.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$statut',
          count: { $sum: 1 },
          totalFichiers: { $sum: { $size: '$fichiers' } }
        }
      }
    ]);

    const totalInterventions = await Intervention.countDocuments(matchQuery);
    const interventionsAvecFichiers = await Intervention.countDocuments({
      ...matchQuery,
      'fichiers.0': { $exists: true }
    });

    const statsFormatted = {
      total: totalInterventions,
      parStatut: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      fichiers: {
        total: stats.reduce((acc, stat) => acc + stat.totalFichiers, 0),
        interventionsAvecFichiers: interventionsAvecFichiers
      }
    };

    res.status(200).json({
      success: true,
      data: statsFormatted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir les statistiques de durée des interventions
// @route   GET /api/interventions/stats/duree
// @access  Private
exports.getStatsDuree = async (req, res) => {
  try {
    let query = { 
      statut: 'terminee', 
      dateDebutEffectif: { $exists: true }, 
      dateFinEffective: { $exists: true } 
    };

    if (req.user.role !== 'admin') {
      query.technicien = req.user.id;
    }

    const interventions = await Intervention.find(query);

    const durees = interventions.map(i => {
      const dureeMs = i.dateFinEffective - i.dateDebutEffectif;
      return {
        titre: i.titre,
        dureeMs,
        heures: Math.floor(dureeMs / (1000 * 60 * 60)),
        minutes: Math.floor((dureeMs % (1000 * 60 * 60)) / (1000 * 60))
      };
    });

    const moyenneDureeMs = durees.length > 0 
      ? durees.reduce((acc, d) => acc + d.dureeMs, 0) / durees.length 
      : 0;
    
    const moyenneHeures = Math.floor(moyenneDureeMs / (1000 * 60 * 60));
    const moyenneMinutes = Math.floor((moyenneDureeMs % (1000 * 60 * 60)) / (1000 * 60));

    res.status(200).json({
      success: true,
      data: {
        interventions: durees,
        moyenne: {
          heures: moyenneHeures,
          minutes: moyenneMinutes,
          total: moyenneDureeMs
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};