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

// // // @desc    Créer une nouvelle intervention
// // // @route   POST /api/interventions
// // // @access  Private (Admin only)
// // exports.createIntervention = async (req, res) => {
// //   try {
// //     const intervention = await Intervention.create(req.body);

// //     const populatedIntervention = await Intervention.findById(intervention._id)
// //       .populate('technicien', 'nom prenom role username')
// //       .populate('fichiers.uploadedBy', 'nom prenom');

// //     res.status(201).json({
// //       success: true,
// //       data: populatedIntervention
// //     });
// //   } catch (error) {
// //     res.status(400).json({
// //       success: false,
// //       message: error.message
// //     });
// //   }
// // };


// // @desc    Créer une nouvelle intervention
// // @route   POST /api/interventions
// // @access  Private (Admin only)
// exports.createIntervention = async (req, res) => {
//   try {
//     const interventionData = { ...req.body };
    
//     // Si l'admin upload des fichiers lors de la création
//     if (req.files && req.files.length > 0 && req.user.role === 'admin') {
//       const nouveauxFichiers = req.files.map(file => {
//         let type = 'autre';
//         if (file.mimetype.startsWith('image/')) {
//           type = 'image';
//         } else if (
//           file.mimetype === 'application/pdf' ||
//           file.mimetype === 'application/msword' ||
//           file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//         ) {
//           type = 'document';
//         }

//         return {
//           nom: file.originalname,
//           url: `/uploads/${file.filename}`,
//           type: type,
//           taille: file.size,
//           uploadedBy: req.user.id
//         };
//       });
//       interventionData.fichiers = nouveauxFichiers;
//     }

//     const intervention = await Intervention.create(interventionData);

//     const populatedIntervention = await Intervention.findById(intervention._id)
//       .populate('technicien', 'nom prenom role username')
//       .populate('fichiers.uploadedBy', 'nom prenom');

//     res.status(201).json({
//       success: true,
//       data: populatedIntervention
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

//     // Mettre à jour les champs
//     Object.keys(req.body).forEach(key => {
//       intervention[key] = req.body[key];
//     });

//     // Sauvegarder pour déclencher le middleware pre('save')
//     await intervention.save();

//     // Repopuler les relations
//     intervention = await Intervention.findById(req.params.id)
//       .populate('technicien', 'nom prenom role username')
//       .populate('fichiers.uploadedBy', 'nom prenom')
//       .populate('commentaires.auteur', 'nom prenom');

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

// // @desc    Obtenir les statistiques de durée des interventions
// // @route   GET /api/interventions/stats/duree
// // @access  Private
// exports.getStatsDuree = async (req, res) => {
//   try {
//     let query = { 
//       statut: 'terminee', 
//       dateDebutEffectif: { $exists: true }, 
//       dateFinEffective: { $exists: true } 
//     };

//     if (req.user.role !== 'admin') {
//       query.technicien = req.user.id;
//     }

//     const interventions = await Intervention.find(query);

//     const durees = interventions.map(i => {
//       const dureeMs = i.dateFinEffective - i.dateDebutEffectif;
//       return {
//         titre: i.titre,
//         dureeMs,
//         heures: Math.floor(dureeMs / (1000 * 60 * 60)),
//         minutes: Math.floor((dureeMs % (1000 * 60 * 60)) / (1000 * 60))
//       };
//     });

//     const moyenneDureeMs = durees.length > 0 
//       ? durees.reduce((acc, d) => acc + d.dureeMs, 0) / durees.length 
//       : 0;
    
//     const moyenneHeures = Math.floor(moyenneDureeMs / (1000 * 60 * 60));
//     const moyenneMinutes = Math.floor((moyenneDureeMs % (1000 * 60 * 60)) / (1000 * 60));

//     res.status(200).json({
//       success: true,
//       data: {
//         interventions: durees,
//         moyenne: {
//           heures: moyenneHeures,
//           minutes: moyenneMinutes,
//           total: moyenneDureeMs
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// // @desc    Obtenir les statistiques détaillées de durée
// // @route   GET /api/interventions/stats/duree-detaillees
// // @access  Private
// exports.getStatsDureeDetaillees = async (req, res) => {
//   try {
//     let query = { 
//       statut: 'terminee', 
//       dateDebutEffectif: { $exists: true }, 
//       dateFinEffective: { $exists: true } 
//     };

//     if (req.user.role !== 'admin') {
//       query.technicien = req.user.id;
//     }

//     const interventions = await Intervention.find(query)
//       .populate('technicien', 'nom prenom')
//       .sort({ dateFinEffective: -1 });

//     // Calculer les durées par intervention
//     const interventionsAvecDuree = interventions.map(i => {
//       const dureeMs = new Date(i.dateFinEffective) - new Date(i.dateDebutEffectif);
//       const heures = Math.floor(dureeMs / (1000 * 60 * 60));
//       const minutes = Math.floor((dureeMs % (1000 * 60 * 60)) / (1000 * 60));
      
//       return {
//         id: i._id,
//         titre: i.titre,
//         type: i.type,
//         priorite: i.priorite,
//         technicien: i.technicien ? `${i.technicien.prenom} ${i.technicien.nom}` : 'Non assigné',
//         dateDebut: i.dateDebutEffectif,
//         dateFin: i.dateFinEffective,
//         dureeMs,
//         dureeHeures: heures,
//         dureeMinutes: minutes,
//         dureeFormattee: heures > 0 ? `${heures}h ${minutes}min` : `${minutes}min`
//       };
//     });

//     // Statistiques par type
//     const statsParType = {};
//     interventionsAvecDuree.forEach(inter => {
//       if (!statsParType[inter.type]) {
//         statsParType[inter.type] = {
//           count: 0,
//           totalDureeMs: 0,
//           durees: []
//         };
//       }
//       statsParType[inter.type].count++;
//       statsParType[inter.type].totalDureeMs += inter.dureeMs;
//       statsParType[inter.type].durees.push(inter.dureeMs);
//     });

//     // Calculer moyennes et médianes par type
//     const statistiquesParType = Object.keys(statsParType).map(type => {
//       const stat = statsParType[type];
//       const moyenneMs = stat.totalDureeMs / stat.count;
//       const moyenneHeures = Math.floor(moyenneMs / (1000 * 60 * 60));
//       const moyenneMinutes = Math.floor((moyenneMs % (1000 * 60 * 60)) / (1000 * 60));
      
//       // Calculer la médiane
//       const dureesSorted = stat.durees.sort((a, b) => a - b);
//       const medianIndex = Math.floor(dureesSorted.length / 2);
//       const medianeMs = dureesSorted.length % 2 === 0
//         ? (dureesSorted[medianIndex - 1] + dureesSorted[medianIndex]) / 2
//         : dureesSorted[medianIndex];
//       const medianeHeures = Math.floor(medianeMs / (1000 * 60 * 60));
//       const medianeMinutes = Math.floor((medianeMs % (1000 * 60 * 60)) / (1000 * 60));
      
//       return {
//         type,
//         count: stat.count,
//         moyenne: {
//           ms: moyenneMs,
//           heures: moyenneHeures,
//           minutes: moyenneMinutes,
//           formattee: moyenneHeures > 0 ? `${moyenneHeures}h ${moyenneMinutes}min` : `${moyenneMinutes}min`
//         },
//         mediane: {
//           ms: medianeMs,
//           heures: medianeHeures,
//           minutes: medianeMinutes,
//           formattee: medianeHeures > 0 ? `${medianeHeures}h ${medianeMinutes}min` : `${medianeMinutes}min`
//         }
//       };
//     });

//     // Statistiques globales
//     const totalDureeMs = interventionsAvecDuree.reduce((acc, i) => acc + i.dureeMs, 0);
//     const moyenneGlobaleMs = interventionsAvecDuree.length > 0 ? totalDureeMs / interventionsAvecDuree.length : 0;
//     const moyenneGlobaleHeures = Math.floor(moyenneGlobaleMs / (1000 * 60 * 60));
//     const moyenneGlobaleMinutes = Math.floor((moyenneGlobaleMs % (1000 * 60 * 60)) / (1000 * 60));

//     // Durée min et max
//     const dureeMin = interventionsAvecDuree.length > 0 
//       ? Math.min(...interventionsAvecDuree.map(i => i.dureeMs))
//       : 0;
//     const dureeMax = interventionsAvecDuree.length > 0 
//       ? Math.max(...interventionsAvecDuree.map(i => i.dureeMs))
//       : 0;

//     res.status(200).json({
//       success: true,
//       data: {
//         interventions: interventionsAvecDuree,
//         statistiquesParType,
//         statistiquesGlobales: {
//           total: interventionsAvecDuree.length,
//           moyenneGlobale: {
//             ms: moyenneGlobaleMs,
//             heures: moyenneGlobaleHeures,
//             minutes: moyenneGlobaleMinutes,
//             formattee: moyenneGlobaleHeures > 0 
//               ? `${moyenneGlobaleHeures}h ${moyenneGlobaleMinutes}min` 
//               : `${moyenneGlobaleMinutes}min`
//           },
//           dureeMin: {
//             ms: dureeMin,
//             heures: Math.floor(dureeMin / (1000 * 60 * 60)),
//             minutes: Math.floor((dureeMin % (1000 * 60 * 60)) / (1000 * 60))
//           },
//           dureeMax: {
//             ms: dureeMax,
//             heures: Math.floor(dureeMax / (1000 * 60 * 60)),
//             minutes: Math.floor((dureeMax % (1000 * 60 * 60)) / (1000 * 60))
//           }
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Obtenir l'évolution des durées dans le temps
// // @route   GET /api/interventions/stats/evolution-durees
// // @access  Private
// exports.getEvolutionDurees = async (req, res) => {
//   try {
//     const { periode = '30' } = req.query; // Par défaut 30 jours
//     const joursEnArriere = parseInt(periode);
    
//     const dateDebut = new Date();
//     dateDebut.setDate(dateDebut.getDate() - joursEnArriere);

//     let query = { 
//       statut: 'terminee', 
//       dateDebutEffectif: { $exists: true }, 
//       dateFinEffective: { $exists: true, $gte: dateDebut }
//     };

//     if (req.user.role !== 'admin') {
//       query.technicien = req.user.id;
//     }

//     const interventions = await Intervention.find(query)
//       .sort({ dateFinEffective: 1 });

//     // Grouper par jour
//     const evolutionParJour = {};
//     interventions.forEach(i => {
//       const date = new Date(i.dateFinEffective).toISOString().split('T')[0];
//       const dureeMs = new Date(i.dateFinEffective) - new Date(i.dateDebutEffectif);
//       const dureeHeures = dureeMs / (1000 * 60 * 60);
      
//       if (!evolutionParJour[date]) {
//         evolutionParJour[date] = {
//           date,
//           interventions: [],
//           totalDureeMs: 0,
//           count: 0
//         };
//       }
      
//       evolutionParJour[date].interventions.push({
//         titre: i.titre,
//         type: i.type,
//         dureeMs,
//         dureeHeures
//       });
//       evolutionParJour[date].totalDureeMs += dureeMs;
//       evolutionParJour[date].count++;
//     });

//     // Convertir en tableau et calculer moyennes
//     const evolution = Object.values(evolutionParJour).map(jour => ({
//       date: jour.date,
//       count: jour.count,
//       moyenneDureeMs: jour.totalDureeMs / jour.count,
//       moyenneDureeHeures: (jour.totalDureeMs / jour.count) / (1000 * 60 * 60),
//       totalDureeHeures: jour.totalDureeMs / (1000 * 60 * 60),
//       interventions: jour.interventions
//     }));

//     res.status(200).json({
//       success: true,
//       data: {
//         periode: joursEnArriere,
//         evolution
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// //@desc    Exporter les données en CSV
// //@route   GET /api/interventions/stats/export
// //@access  Private
// exports.exportDonnees = async (req, res) => {
//   try {
//     let query = { 
//       statut: 'terminee', 
//       dateDebutEffectif: { $exists: true }, 
//       dateFinEffective: { $exists: true } 
//     };

//     if (req.user.role !== 'admin') {
//       query.technicien = req.user.id;
//     }

//     const interventions = await Intervention.find(query)
//       .populate('technicien', 'nom prenom')
//       .sort({ dateFinEffective: -1 });

//     // Créer le CSV
//     const csvHeader = 'ID,Titre,Type,Priorité,Technicien,Date Début,Heure Début,Date Fin,Heure Fin,Durée (minutes),Durée (heures),Lieu,Matériel\n';
    
//     const csvRows = interventions.map(i => {
//       const dureeMs = new Date(i.dateFinEffective) - new Date(i.dateDebutEffectif);
//       const dureeMinutes = Math.floor(dureeMs / (1000 * 60));
//       const dureeHeures = (dureeMs / (1000 * 60 * 60)).toFixed(2);
      
//       return [
//         i._id,
//         `"${i.titre.replace(/"/g, '""')}"`,
//         i.type,
//         i.priorite,
//         i.technicien ? `"${i.technicien.prenom} ${i.technicien.nom}"` : 'Non assigné',
//         new Date(i.dateDebutEffectif).toLocaleDateString('fr-FR'),
//         i.heureDebutEffectif || '',
//         new Date(i.dateFinEffective).toLocaleDateString('fr-FR'),
//         i.heureFinEffective || '',
//         dureeMinutes,
//         dureeHeures,
//         `"${i.lieu}"`,
//         `"${i.materiel.replace(/"/g, '""')}"`
//       ].join(',');
//     }).join('\n');

//     const csv = csvHeader + csvRows;

//     res.setHeader('Content-Type', 'text/csv; charset=utf-8');
//     res.setHeader('Content-Disposition', `attachment; filename=interventions_${new Date().toISOString().split('T')[0]}.csv`);
//     res.send('\uFEFF' + csv); // BOM pour Excel UTF-8
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// NOUVELLE VERSION CLAUDE AVEC VALIDATION DES INTERVENTIONS PAR LADMIN


// const mongoose = require('mongoose');
// const Intervention = require('../models/Intervention');
// const fs = require('fs');
// const path = require('path');

// // @desc    Obtenir toutes les interventions
// // @route   GET /api/interventions
// // @access  Private
// exports.getInterventions = async (req, res) => {
//   try {
//     let query = {};

//     if (req.user.role !== 'admin') {
//       query.technicien = req.user.id;
//     }

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
//       .populate('validePar', 'nom prenom role')
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
//       .populate('validePar', 'nom prenom role')
//       .populate('fichiers.uploadedBy', 'nom prenom')
//       .populate('commentaires.auteur', 'nom prenom');

//     if (!intervention) {
//       return res.status(404).json({
//         success: false,
//         message: 'Intervention non trouvée'
//       });
//     }

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
//     const interventionData = { ...req.body };
    
//     if (req.files && req.files.length > 0 && req.user.role === 'admin') {
//       const nouveauxFichiers = req.files.map(file => {
//         let type = 'autre';
//         if (file.mimetype.startsWith('image/')) {
//           type = 'image';
//         } else if (
//           file.mimetype === 'application/pdf' ||
//           file.mimetype === 'application/msword' ||
//           file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//         ) {
//           type = 'document';
//         }

//         return {
//           nom: file.originalname,
//           url: `/uploads/${file.filename}`,
//           type: type,
//           taille: file.size,
//           uploadedBy: req.user.id
//         };
//       });
//       interventionData.fichiers = nouveauxFichiers;
//     }

//     const intervention = await Intervention.create(interventionData);

//     const populatedIntervention = await Intervention.findById(intervention._id)
//       .populate('technicien', 'nom prenom role username')
//       .populate('fichiers.uploadedBy', 'nom prenom');

//     res.status(201).json({
//       success: true,
//       data: populatedIntervention
//     });
//   } catch (error) {
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

//     // ✅ CORRECTION : Empêcher la modification d'une intervention terminée (validée) ou en attente de validation
//     if (intervention.statut === 'terminee' || intervention.statut === 'en_attente_validation') {
//       return res.status(403).json({
//         success: false,
//         message: 'Cette intervention ne peut plus être modifiée'
//       });
//     }

//     // ✅ CORRECTION : Empêcher un technicien de passer directement à "terminee"
//     if (req.user.role !== 'admin' && req.body.statut === 'terminee') {
//       return res.status(403).json({
//         success: false,
//         message: 'Seul un administrateur peut terminer une intervention'
//       });
//     }

//     // Mettre à jour les champs
//     Object.keys(req.body).forEach(key => {
//       intervention[key] = req.body[key];
//     });

//     // ✅ CORRECTION : Si le technicien met en "en_attente_validation", enregistrer la date de fin
//     if (req.body.statut === 'en_attente_validation' && !intervention.dateFinEffective) {
//       const now = new Date();
//       const heureActuelle = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
//       intervention.dateFinEffective = now;
//       intervention.heureFinEffective = heureActuelle;
//     }

//     // Sauvegarder pour déclencher le middleware pre('save')
//     await intervention.save();

//     // Repopuler les relations
//     intervention = await Intervention.findById(req.params.id)
//       .populate('technicien', 'nom prenom role username')
//       .populate('validePar', 'nom prenom role')
//       .populate('fichiers.uploadedBy', 'nom prenom')
//       .populate('commentaires.auteur', 'nom prenom');

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

// // ✅ CORRIGÉ : Route pour valider une intervention (admin uniquement)
// // @desc    Valider une intervention terminée
// // @route   PUT /api/interventions/:id/valider
// // @access  Private (Admin only)
// exports.validerIntervention = async (req, res) => {
//   try {
//     let intervention = await Intervention.findById(req.params.id);

//     if (!intervention) {
//       return res.status(404).json({
//         success: false,
//         message: 'Intervention non trouvée'
//       });
//     }

//     // ✅ CORRECTION : Vérifier que l'intervention est bien en attente de validation
//     if (intervention.statut !== 'en_attente_validation') {
//       return res.status(400).json({
//         success: false,
//         message: 'Cette intervention n\'est pas en attente de validation'
//       });
//     }

//     // ✅ CORRECTION : Passer au statut terminee et enregistrer qui a validé
//     intervention.statut = 'terminee';
//     intervention.validePar = req.user.id;

//     // ✅ CORRECTION : S'assurer que la date de validation est enregistrée
//     const now = new Date();
//     const heureActuelle = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
//     intervention.dateValidation = now;
//     intervention.heureValidation = heureActuelle;

//     await intervention.save();

//     // Repopuler les relations
//     intervention = await Intervention.findById(req.params.id)
//       .populate('technicien', 'nom prenom role username')
//       .populate('validePar', 'nom prenom role')
//       .populate('fichiers.uploadedBy', 'nom prenom')
//       .populate('commentaires.auteur', 'nom prenom');

//     res.status(200).json({
//       success: true,
//       data: intervention,
//       message: 'Intervention validée avec succès'
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

//     // ✅ CORRECTION : Autoriser les commentaires même pour les interventions terminées
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

//     // ✅ CORRECTION : Autoriser l'upload même pour les interventions en attente de validation
//     if (req.user.role !== 'admin' && intervention.technicien.toString() !== req.user.id) {
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

//     // ✅ CORRECTION : Autoriser l'upload pour les interventions en attente de validation
//     if (intervention.statut === 'terminee') {
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
//         message: 'Impossible d\'ajouter des fichiers à une intervention validée'
//       });
//     }

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Aucun fichier uploadé'
//       });
//     }

//     const nouveauxFichiers = req.files.map(file => {
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

//     if (req.user.role !== 'admin' && intervention.technicien.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: 'Non autorisé à modifier cette intervention'
//       });
//     }

//     // ✅ CORRECTION : Empêcher la suppression de fichiers pour les interventions terminées
//     if (intervention.statut === 'terminee') {
//       return res.status(403).json({
//         success: false,
//         message: 'Impossible de supprimer des fichiers d\'une intervention validée'
//       });
//     }

//     const fichier = intervention.fichiers.id(req.params.idFichier);
//     if (!fichier) {
//       return res.status(404).json({
//         success: false,
//         message: 'Fichier non trouvé'
//       });
//     }

//     const filePath = path.join(__dirname, '..', 'uploads', path.basename(fichier.url));
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }

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

// // @desc    Obtenir les statistiques de durée des interventions
// // @route   GET /api/interventions/stats/duree
// // @access  Private
// exports.getStatsDuree = async (req, res) => {
//   try {
//     let query = { 
//       statut: 'terminee', 
//       dateDebutEffectif: { $exists: true }, 
//       dateFinEffective: { $exists: true } 
//     };

//     if (req.user.role !== 'admin') {
//       query.technicien = req.user.id;
//     }

//     const interventions = await Intervention.find(query);

//     const durees = interventions.map(i => {
//       const dureeMs = i.dateFinEffective - i.dateDebutEffectif;
//       return {
//         titre: i.titre,
//         dureeMs,
//         heures: Math.floor(dureeMs / (1000 * 60 * 60)),
//         minutes: Math.floor((dureeMs % (1000 * 60 * 60)) / (1000 * 60))
//       };
//     });

//     const moyenneDureeMs = durees.length > 0 
//       ? durees.reduce((acc, d) => acc + d.dureeMs, 0) / durees.length 
//       : 0;
    
//     const moyenneHeures = Math.floor(moyenneDureeMs / (1000 * 60 * 60));
//     const moyenneMinutes = Math.floor((moyenneDureeMs % (1000 * 60 * 60)) / (1000 * 60));

//     res.status(200).json({
//       success: true,
//       data: {
//         interventions: durees,
//         moyenne: {
//           heures: moyenneHeures,
//           minutes: moyenneMinutes,
//           total: moyenneDureeMs
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Obtenir les statistiques détaillées de durée
// // @route   GET /api/interventions/stats/duree-detaillees
// // @access  Private
// exports.getStatsDureeDetaillees = async (req, res) => {
//   try {
//     let query = { 
//       statut: 'terminee', 
//       dateDebutEffectif: { $exists: true }, 
//       dateFinEffective: { $exists: true } 
//     };

//     if (req.user.role !== 'admin') {
//       query.technicien = req.user.id;
//     }

//     const interventions = await Intervention.find(query)
//       .populate('technicien', 'nom prenom')
//       .sort({ dateFinEffective: -1 });

//     // Calculer les durées par intervention
//     const interventionsAvecDuree = interventions.map(i => {
//       const dureeMs = new Date(i.dateFinEffective) - new Date(i.dateDebutEffectif);
//       const heures = Math.floor(dureeMs / (1000 * 60 * 60));
//       const minutes = Math.floor((dureeMs % (1000 * 60 * 60)) / (1000 * 60));
      
//       return {
//         id: i._id,
//         titre: i.titre,
//         type: i.type,
//         priorite: i.priorite,
//         technicien: i.technicien ? `${i.technicien.prenom} ${i.technicien.nom}` : 'Non assigné',
//         dateDebut: i.dateDebutEffectif,
//         dateFin: i.dateFinEffective,
//         dureeMs,
//         dureeHeures: heures,
//         dureeMinutes: minutes,
//         dureeFormattee: heures > 0 ? `${heures}h ${minutes}min` : `${minutes}min`
//       };
//     });

//     // Statistiques par type
//     const statsParType = {};
//     interventionsAvecDuree.forEach(inter => {
//       if (!statsParType[inter.type]) {
//         statsParType[inter.type] = {
//           count: 0,
//           totalDureeMs: 0,
//           durees: []
//         };
//       }
//       statsParType[inter.type].count++;
//       statsParType[inter.type].totalDureeMs += inter.dureeMs;
//       statsParType[inter.type].durees.push(inter.dureeMs);
//     });

//     // Calculer moyennes et médianes par type
//     const statistiquesParType = Object.keys(statsParType).map(type => {
//       const stat = statsParType[type];
//       const moyenneMs = stat.totalDureeMs / stat.count;
//       const moyenneHeures = Math.floor(moyenneMs / (1000 * 60 * 60));
//       const moyenneMinutes = Math.floor((moyenneMs % (1000 * 60 * 60)) / (1000 * 60));
      
//       // Calculer la médiane
//       const dureesSorted = stat.durees.sort((a, b) => a - b);
//       const medianIndex = Math.floor(dureesSorted.length / 2);
//       const medianeMs = dureesSorted.length % 2 === 0
//         ? (dureesSorted[medianIndex - 1] + dureesSorted[medianIndex]) / 2
//         : dureesSorted[medianIndex];
//       const medianeHeures = Math.floor(medianeMs / (1000 * 60 * 60));
//       const medianeMinutes = Math.floor((medianeMs % (1000 * 60 * 60)) / (1000 * 60));
      
//       return {
//         type,
//         count: stat.count,
//         moyenne: {
//           ms: moyenneMs,
//           heures: moyenneHeures,
//           minutes: moyenneMinutes,
//           formattee: moyenneHeures > 0 ? `${moyenneHeures}h ${moyenneMinutes}min` : `${moyenneMinutes}min`
//         },
//         mediane: {
//           ms: medianeMs,
//           heures: medianeHeures,
//           minutes: medianeMinutes,
//           formattee: medianeHeures > 0 ? `${medianeHeures}h ${medianeMinutes}min` : `${medianeMinutes}min`
//         }
//       };
//     });

//     // Statistiques globales
//     const totalDureeMs = interventionsAvecDuree.reduce((acc, i) => acc + i.dureeMs, 0);
//     const moyenneGlobaleMs = interventionsAvecDuree.length > 0 ? totalDureeMs / interventionsAvecDuree.length : 0;
//     const moyenneGlobaleHeures = Math.floor(moyenneGlobaleMs / (1000 * 60 * 60));
//     const moyenneGlobaleMinutes = Math.floor((moyenneGlobaleMs % (1000 * 60 * 60)) / (1000 * 60));

//     // Durée min et max
//     const dureeMin = interventionsAvecDuree.length > 0 
//       ? Math.min(...interventionsAvecDuree.map(i => i.dureeMs))
//       : 0;
//     const dureeMax = interventionsAvecDuree.length > 0 
//       ? Math.max(...interventionsAvecDuree.map(i => i.dureeMs))
//       : 0;

//     res.status(200).json({
//       success: true,
//       data: {
//         interventions: interventionsAvecDuree,
//         statistiquesParType,
//         statistiquesGlobales: {
//           total: interventionsAvecDuree.length,
//           moyenneGlobale: {
//             ms: moyenneGlobaleMs,
//             heures: moyenneGlobaleHeures,
//             minutes: moyenneGlobaleMinutes,
//             formattee: moyenneGlobaleHeures > 0 
//               ? `${moyenneGlobaleHeures}h ${moyenneGlobaleMinutes}min` 
//               : `${moyenneGlobaleMinutes}min`
//           },
//           dureeMin: {
//             ms: dureeMin,
//             heures: Math.floor(dureeMin / (1000 * 60 * 60)),
//             minutes: Math.floor((dureeMin % (1000 * 60 * 60)) / (1000 * 60))
//           },
//           dureeMax: {
//             ms: dureeMax,
//             heures: Math.floor(dureeMax / (1000 * 60 * 60)),
//             minutes: Math.floor((dureeMax % (1000 * 60 * 60)) / (1000 * 60))
//           }
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Obtenir l'évolution des durées dans le temps
// // @route   GET /api/interventions/stats/evolution-durees
// // @access  Private
// exports.getEvolutionDurees = async (req, res) => {
//   try {
//     const { periode = '30' } = req.query; // Par défaut 30 jours
//     const joursEnArriere = parseInt(periode);
    
//     const dateDebut = new Date();
//     dateDebut.setDate(dateDebut.getDate() - joursEnArriere);

//     let query = { 
//       statut: 'terminee', 
//       dateDebutEffectif: { $exists: true }, 
//       dateFinEffective: { $exists: true, $gte: dateDebut }
//     };

//     if (req.user.role !== 'admin') {
//       query.technicien = req.user.id;
//     }

//     const interventions = await Intervention.find(query)
//       .sort({ dateFinEffective: 1 });

//     // Grouper par jour
//     const evolutionParJour = {};
//     interventions.forEach(i => {
//       const date = new Date(i.dateFinEffective).toISOString().split('T')[0];
//       const dureeMs = new Date(i.dateFinEffective) - new Date(i.dateDebutEffectif);
//       const dureeHeures = dureeMs / (1000 * 60 * 60);
      
//       if (!evolutionParJour[date]) {
//         evolutionParJour[date] = {
//           date,
//           interventions: [],
//           totalDureeMs: 0,
//           count: 0
//         };
//       }
      
//       evolutionParJour[date].interventions.push({
//         titre: i.titre,
//         type: i.type,
//         dureeMs,
//         dureeHeures
//       });
//       evolutionParJour[date].totalDureeMs += dureeMs;
//       evolutionParJour[date].count++;
//     });

//     // Convertir en tableau et calculer moyennes
//     const evolution = Object.values(evolutionParJour).map(jour => ({
//       date: jour.date,
//       count: jour.count,
//       moyenneDureeMs: jour.totalDureeMs / jour.count,
//       moyenneDureeHeures: (jour.totalDureeMs / jour.count) / (1000 * 60 * 60),
//       totalDureeHeures: jour.totalDureeMs / (1000 * 60 * 60),
//       interventions: jour.interventions
//     }));

//     res.status(200).json({
//       success: true,
//       data: {
//         periode: joursEnArriere,
//         evolution
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Exporter les données en CSV
// // @route   GET /api/interventions/stats/export
// // @access  Private
// exports.exportDonnees = async (req, res) => {
//   try {
//     let query = { 
//       statut: 'terminee', 
//       dateDebutEffectif: { $exists: true }, 
//       dateFinEffective: { $exists: true } 
//     };

//     if (req.user.role !== 'admin') {
//       query.technicien = req.user.id;
//     }

//     const interventions = await Intervention.find(query)
//       .populate('technicien', 'nom prenom')
//       .sort({ dateFinEffective: -1 });

//     // Créer le CSV
//     const csvHeader = 'ID,Titre,Type,Priorité,Technicien,Date Début,Heure Début,Date Fin,Heure Fin,Durée (minutes),Durée (heures),Lieu,Matériel\n';
    
//     const csvRows = interventions.map(i => {
//       const dureeMs = new Date(i.dateFinEffective) - new Date(i.dateDebutEffectif);
//       const dureeMinutes = Math.floor(dureeMs / (1000 * 60));
//       const dureeHeures = (dureeMs / (1000 * 60 * 60)).toFixed(2);
      
//       return [
//         i._id,
//         `"${i.titre.replace(/"/g, '""')}"`,
//         i.type,
//         i.priorite,
//         i.technicien ? `"${i.technicien.prenom} ${i.technicien.nom}"` : 'Non assigné',
//         new Date(i.dateDebutEffectif).toLocaleDateString('fr-FR'),
//         i.heureDebutEffectif || '',
//         new Date(i.dateFinEffective).toLocaleDateString('fr-FR'),
//         i.heureFinEffective || '',
//         dureeMinutes,
//         dureeHeures,
//         `"${i.lieu}"`,
//         `"${i.materiel.replace(/"/g, '""')}"`
//       ].join(',');
//     }).join('\n');

//     const csv = csvHeader + csvRows;

//     res.setHeader('Content-Type', 'text/csv; charset=utf-8');
//     res.setHeader('Content-Disposition', `attachment; filename=interventions_${new Date().toISOString().split('T')[0]}.csv`);
//     res.send('\uFEFF' + csv); // BOM pour Excel UTF-8
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// NOUVELLE VERSION DEEPSEEK POUR REGLER LE PROBLEME DE VALIDATION COTE ADMIN


// const mongoose = require('mongoose');
// const Intervention = require('../models/Intervention');
// const fs = require('fs');
// const path = require('path');

// // @desc    Obtenir toutes les interventions
// // @route   GET /api/interventions
// // @access  Private
// exports.getInterventions = async (req, res) => {
//   try {
//     let query = {};

//     if (req.user.role !== 'admin') {
//       query.technicien = req.user.id;
//     }

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
//       .populate('validePar', 'nom prenom role')
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
//       .populate('validePar', 'nom prenom role')
//       .populate('fichiers.uploadedBy', 'nom prenom')
//       .populate('commentaires.auteur', 'nom prenom');

//     if (!intervention) {
//       return res.status(404).json({
//         success: false,
//         message: 'Intervention non trouvée'
//       });
//     }

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
//     const interventionData = { ...req.body };
    
//     if (req.files && req.files.length > 0 && req.user.role === 'admin') {
//       const nouveauxFichiers = req.files.map(file => {
//         let type = 'autre';
//         if (file.mimetype.startsWith('image/')) {
//           type = 'image';
//         } else if (
//           file.mimetype === 'application/pdf' ||
//           file.mimetype === 'application/msword' ||
//           file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//         ) {
//           type = 'document';
//         }

//         return {
//           nom: file.originalname,
//           url: `/uploads/${file.filename}`,
//           type: type,
//           taille: file.size,
//           uploadedBy: req.user.id
//         };
//       });
//       interventionData.fichiers = nouveauxFichiers;
//     }

//     const intervention = await Intervention.create(interventionData);

//     const populatedIntervention = await Intervention.findById(intervention._id)
//       .populate('technicien', 'nom prenom role username')
//       .populate('fichiers.uploadedBy', 'nom prenom');

//     res.status(201).json({
//       success: true,
//       data: populatedIntervention
//     });
//   } catch (error) {
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

// // @desc    Mettre à jour une intervention - CORRIGÉ
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

//     // ✅ CORRECTION : Empêcher la modification d'une intervention terminée (validée)
//     if (intervention.statut === 'terminee') {
//       return res.status(403).json({
//         success: false,
//         message: 'Cette intervention ne peut plus être modifiée'
//       });
//     }

//     // ✅ CORRECTION : Empêcher un technicien de passer directement à "terminee"
//     if (req.user.role !== 'admin' && req.body.statut === 'terminee') {
//       return res.status(403).json({
//         success: false,
//         message: 'Seul un administrateur peut terminer une intervention'
//       });
//     }

//     console.log('🔄 Mise à jour intervention - Statut actuel:', intervention.statut);
//     console.log('🔄 Mise à jour intervention - Nouveau statut:', req.body.statut);
//     console.log('🔄 Mise à jour intervention - DateFinEffective actuelle:', intervention.dateFinEffective);

//     // Mettre à jour les champs
//     Object.keys(req.body).forEach(key => {
//       intervention[key] = req.body[key];
//     });

//     // ✅ CORRECTION : Juste sauvegarder, le middleware fera le reste
//     await intervention.save();

//     console.log('✅ Après sauvegarde - Statut:', intervention.statut);
//     console.log('✅ Après sauvegarde - DateFinEffective:', intervention.dateFinEffective);

//     // Repopuler les relations
//     intervention = await Intervention.findById(req.params.id)
//       .populate('technicien', 'nom prenom role username')
//       .populate('validePar', 'nom prenom role')
//       .populate('fichiers.uploadedBy', 'nom prenom')
//       .populate('commentaires.auteur', 'nom prenom');

//     res.status(200).json({
//       success: true,
//       data: intervention
//     });
//   } catch (error) {
//     console.error('❌ Erreur updateIntervention:', error);
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // ✅ CORRIGÉ : Route pour valider une intervention (admin uniquement)
// // @desc    Valider une intervention terminée
// // @route   PUT /api/interventions/:id/valider
// // @access  Private (Admin only)
// exports.validerIntervention = async (req, res) => {
//   try {
//     let intervention = await Intervention.findById(req.params.id);

//     if (!intervention) {
//       return res.status(404).json({
//         success: false,
//         message: 'Intervention non trouvée'
//       });
//     }

//     console.log('🔍 Validation - Statut actuel:', intervention.statut);

//     // ✅ CORRECTION : Vérifier que l'intervention est bien en attente de validation
//     if (intervention.statut !== 'en_attente_validation') {
//       return res.status(400).json({
//         success: false,
//         message: `Cette intervention n'est pas en attente de validation. Statut actuel: ${intervention.statut}`
//       });
//     }

//     // ✅ CORRECTION : JUSTE changer le statut, le middleware gérera dateValidation
//     intervention.statut = 'terminee';
//     intervention.validePar = req.user.id;

//     console.log('✅ Avant sauvegarde - Nouveau statut:', intervention.statut);

//     await intervention.save();

//     // Repopuler les relations
//     intervention = await Intervention.findById(req.params.id)
//       .populate('technicien', 'nom prenom role username')
//       .populate('validePar', 'nom prenom role')
//       .populate('fichiers.uploadedBy', 'nom prenom')
//       .populate('commentaires.auteur', 'nom prenom');

//     res.status(200).json({
//       success: true,
//       data: intervention,
//       message: 'Intervention validée avec succès'
//     });
//   } catch (error) {
//     console.error('❌ Erreur validation:', error);
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

//     // ✅ CORRECTION : Autoriser les commentaires même pour les interventions terminées
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

//     // ✅ CORRECTION : Autoriser l'upload même pour les interventions en attente de validation
//     if (req.user.role !== 'admin' && intervention.technicien.toString() !== req.user.id) {
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

//     // ✅ CORRECTION : Autoriser l'upload pour les interventions en attente de validation
//     if (intervention.statut === 'terminee') {
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
//         message: 'Impossible d\'ajouter des fichiers à une intervention validée'
//       });
//     }

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Aucun fichier uploadé'
//       });
//     }

//     const nouveauxFichiers = req.files.map(file => {
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

//     if (req.user.role !== 'admin' && intervention.technicien.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: 'Non autorisé à modifier cette intervention'
//       });
//     }

//     // ✅ CORRECTION : Empêcher la suppression de fichiers pour les interventions terminées
//     if (intervention.statut === 'terminee') {
//       return res.status(403).json({
//         success: false,
//         message: 'Impossible de supprimer des fichiers d\'une intervention validée'
//       });
//     }

//     const fichier = intervention.fichiers.id(req.params.idFichier);
//     if (!fichier) {
//       return res.status(404).json({
//         success: false,
//         message: 'Fichier non trouvé'
//       });
//     }

//     const filePath = path.join(__dirname, '..', 'uploads', path.basename(fichier.url));
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }

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

// // @desc    Obtenir les statistiques de durée des interventions
// // @route   GET /api/interventions/stats/duree
// // @access  Private
// exports.getStatsDuree = async (req, res) => {
//   try {
//     let query = { 
//       statut: 'terminee', 
//       dateDebutEffectif: { $exists: true }, 
//       dateFinEffective: { $exists: true } 
//     };

//     if (req.user.role !== 'admin') {
//       query.technicien = req.user.id;
//     }

//     const interventions = await Intervention.find(query);

//     const durees = interventions.map(i => {
//       const dureeMs = i.dateFinEffective - i.dateDebutEffectif;
//       return {
//         titre: i.titre,
//         dureeMs,
//         heures: Math.floor(dureeMs / (1000 * 60 * 60)),
//         minutes: Math.floor((dureeMs % (1000 * 60 * 60)) / (1000 * 60))
//       };
//     });

//     const moyenneDureeMs = durees.length > 0 
//       ? durees.reduce((acc, d) => acc + d.dureeMs, 0) / durees.length 
//       : 0;
    
//     const moyenneHeures = Math.floor(moyenneDureeMs / (1000 * 60 * 60));
//     const moyenneMinutes = Math.floor((moyenneDureeMs % (1000 * 60 * 60)) / (1000 * 60));

//     res.status(200).json({
//       success: true,
//       data: {
//         interventions: durees,
//         moyenne: {
//           heures: moyenneHeures,
//           minutes: moyenneMinutes,
//           total: moyenneDureeMs
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Obtenir les statistiques détaillées de durée
// // @route   GET /api/interventions/stats/duree-detaillees
// // @access  Private
// exports.getStatsDureeDetaillees = async (req, res) => {
//   try {
//     let query = { 
//       statut: 'terminee', 
//       dateDebutEffectif: { $exists: true }, 
//       dateFinEffective: { $exists: true } 
//     };

//     if (req.user.role !== 'admin') {
//       query.technicien = req.user.id;
//     }

//     const interventions = await Intervention.find(query)
//       .populate('technicien', 'nom prenom')
//       .sort({ dateFinEffective: -1 });

//     // Calculer les durées par intervention
//     const interventionsAvecDuree = interventions.map(i => {
//       const dureeMs = new Date(i.dateFinEffective) - new Date(i.dateDebutEffectif);
//       const heures = Math.floor(dureeMs / (1000 * 60 * 60));
//       const minutes = Math.floor((dureeMs % (1000 * 60 * 60)) / (1000 * 60));
      
//       return {
//         id: i._id,
//         titre: i.titre,
//         type: i.type,
//         priorite: i.priorite,
//         technicien: i.technicien ? `${i.technicien.prenom} ${i.technicien.nom}` : 'Non assigné',
//         dateDebut: i.dateDebutEffectif,
//         dateFin: i.dateFinEffective,
//         dureeMs,
//         dureeHeures: heures,
//         dureeMinutes: minutes,
//         dureeFormattee: heures > 0 ? `${heures}h ${minutes}min` : `${minutes}min`
//       };
//     });

//     // Statistiques par type
//     const statsParType = {};
//     interventionsAvecDuree.forEach(inter => {
//       if (!statsParType[inter.type]) {
//         statsParType[inter.type] = {
//           count: 0,
//           totalDureeMs: 0,
//           durees: []
//         };
//       }
//       statsParType[inter.type].count++;
//       statsParType[inter.type].totalDureeMs += inter.dureeMs;
//       statsParType[inter.type].durees.push(inter.dureeMs);
//     });

//     // Calculer moyennes et médianes par type
//     const statistiquesParType = Object.keys(statsParType).map(type => {
//       const stat = statsParType[type];
//       const moyenneMs = stat.totalDureeMs / stat.count;
//       const moyenneHeures = Math.floor(moyenneMs / (1000 * 60 * 60));
//       const moyenneMinutes = Math.floor((moyenneMs % (1000 * 60 * 60)) / (1000 * 60));
      
//       // Calculer la médiane
//       const dureesSorted = stat.durees.sort((a, b) => a - b);
//       const medianIndex = Math.floor(dureesSorted.length / 2);
//       const medianeMs = dureesSorted.length % 2 === 0
//         ? (dureesSorted[medianIndex - 1] + dureesSorted[medianIndex]) / 2
//         : dureesSorted[medianIndex];
//       const medianeHeures = Math.floor(medianeMs / (1000 * 60 * 60));
//       const medianeMinutes = Math.floor((medianeMs % (1000 * 60 * 60)) / (1000 * 60));
      
//       return {
//         type,
//         count: stat.count,
//         moyenne: {
//           ms: moyenneMs,
//           heures: moyenneHeures,
//           minutes: moyenneMinutes,
//           formattee: moyenneHeures > 0 ? `${moyenneHeures}h ${moyenneMinutes}min` : `${moyenneMinutes}min`
//         },
//         mediane: {
//           ms: medianeMs,
//           heures: medianeHeures,
//           minutes: medianeMinutes,
//           formattee: medianeHeures > 0 ? `${medianeHeures}h ${medianeMinutes}min` : `${medianeMinutes}min`
//         }
//       };
//     });

//     // Statistiques globales
//     const totalDureeMs = interventionsAvecDuree.reduce((acc, i) => acc + i.dureeMs, 0);
//     const moyenneGlobaleMs = interventionsAvecDuree.length > 0 ? totalDureeMs / interventionsAvecDuree.length : 0;
//     const moyenneGlobaleHeures = Math.floor(moyenneGlobaleMs / (1000 * 60 * 60));
//     const moyenneGlobaleMinutes = Math.floor((moyenneGlobaleMs % (1000 * 60 * 60)) / (1000 * 60));

//     // Durée min et max
//     const dureeMin = interventionsAvecDuree.length > 0 
//       ? Math.min(...interventionsAvecDuree.map(i => i.dureeMs))
//       : 0;
//     const dureeMax = interventionsAvecDuree.length > 0 
//       ? Math.max(...interventionsAvecDuree.map(i => i.dureeMs))
//       : 0;

//     res.status(200).json({
//       success: true,
//       data: {
//         interventions: interventionsAvecDuree,
//         statistiquesParType,
//         statistiquesGlobales: {
//           total: interventionsAvecDuree.length,
//           moyenneGlobale: {
//             ms: moyenneGlobaleMs,
//             heures: moyenneGlobaleHeures,
//             minutes: moyenneGlobaleMinutes,
//             formattee: moyenneGlobaleHeures > 0 
//               ? `${moyenneGlobaleHeures}h ${moyenneGlobaleMinutes}min` 
//               : `${moyenneGlobaleMinutes}min`
//           },
//           dureeMin: {
//             ms: dureeMin,
//             heures: Math.floor(dureeMin / (1000 * 60 * 60)),
//             minutes: Math.floor((dureeMin % (1000 * 60 * 60)) / (1000 * 60))
//           },
//           dureeMax: {
//             ms: dureeMax,
//             heures: Math.floor(dureeMax / (1000 * 60 * 60)),
//             minutes: Math.floor((dureeMax % (1000 * 60 * 60)) / (1000 * 60))
//           }
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Obtenir l'évolution des durées dans le temps
// // @route   GET /api/interventions/stats/evolution-durees
// // @access  Private
// exports.getEvolutionDurees = async (req, res) => {
//   try {
//     const { periode = '30' } = req.query;
//     const joursEnArriere = parseInt(periode);
    
//     const dateDebut = new Date();
//     dateDebut.setDate(dateDebut.getDate() - joursEnArriere);

//     let query = { 
//       statut: 'terminee', 
//       dateDebutEffectif: { $exists: true }, 
//       dateFinEffective: { $exists: true, $gte: dateDebut }
//     };

//     if (req.user.role !== 'admin') {
//       query.technicien = req.user.id;
//     }

//     const interventions = await Intervention.find(query)
//       .sort({ dateFinEffective: 1 });

//     // Grouper par jour
//     const evolutionParJour = {};
//     interventions.forEach(i => {
//       const date = new Date(i.dateFinEffective).toISOString().split('T')[0];
//       const dureeMs = new Date(i.dateFinEffective) - new Date(i.dateDebutEffectif);
//       const dureeHeures = dureeMs / (1000 * 60 * 60);
      
//       if (!evolutionParJour[date]) {
//         evolutionParJour[date] = {
//           date,
//           interventions: [],
//           totalDureeMs: 0,
//           count: 0
//         };
//       }
      
//       evolutionParJour[date].interventions.push({
//         titre: i.titre,
//         type: i.type,
//         dureeMs,
//         dureeHeures
//       });
//       evolutionParJour[date].totalDureeMs += dureeMs;
//       evolutionParJour[date].count++;
//     });

//     // Convertir en tableau et calculer moyennes
//     const evolution = Object.values(evolutionParJour).map(jour => ({
//       date: jour.date,
//       count: jour.count,
//       moyenneDureeMs: jour.totalDureeMs / jour.count,
//       moyenneDureeHeures: (jour.totalDureeMs / jour.count) / (1000 * 60 * 60),
//       totalDureeHeures: jour.totalDureeMs / (1000 * 60 * 60),
//       interventions: jour.interventions
//     }));

//     res.status(200).json({
//       success: true,
//       data: {
//         periode: joursEnArriere,
//         evolution
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Exporter les données en CSV
// // @route   GET /api/interventions/stats/export
// // @access  Private
// exports.exportDonnees = async (req, res) => {
//   try {
//     let query = { 
//       statut: 'terminee', 
//       dateDebutEffectif: { $exists: true }, 
//       dateFinEffective: { $exists: true } 
//     };

//     if (req.user.role !== 'admin') {
//       query.technicien = req.user.id;
//     }

//     const interventions = await Intervention.find(query)
//       .populate('technicien', 'nom prenom')
//       .sort({ dateFinEffective: -1 });

//     // Créer le CSV
//     const csvHeader = 'ID,Titre,Type,Priorité,Technicien,Date Début,Heure Début,Date Fin,Heure Fin,Durée (minutes),Durée (heures),Lieu,Matériel\n';
    
//     const csvRows = interventions.map(i => {
//       const dureeMs = new Date(i.dateFinEffective) - new Date(i.dateDebutEffectif);
//       const dureeMinutes = Math.floor(dureeMs / (1000 * 60));
//       const dureeHeures = (dureeMs / (1000 * 60 * 60)).toFixed(2);
      
//       return [
//         i._id,
//         `"${i.titre.replace(/"/g, '""')}"`,
//         i.type,
//         i.priorite,
//         i.technicien ? `"${i.technicien.prenom} ${i.technicien.nom}"` : 'Non assigné',
//         new Date(i.dateDebutEffectif).toLocaleDateString('fr-FR'),
//         i.heureDebutEffectif || '',
//         new Date(i.dateFinEffective).toLocaleDateString('fr-FR'),
//         i.heureFinEffective || '',
//         dureeMinutes,
//         dureeHeures,
//         `"${i.lieu}"`,
//         `"${i.materiel.replace(/"/g, '""')}"`
//       ].join(',');
//     }).join('\n');

//     const csv = csvHeader + csvRows;

//     res.setHeader('Content-Type', 'text/csv; charset=utf-8');
//     res.setHeader('Content-Disposition', `attachment; filename=interventions_${new Date().toISOString().split('T')[0]}.csv`);
//     res.send('\uFEFF' + csv);
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// NOUVELLE VERSION DEEPSEEK


const mongoose = require('mongoose');
const Intervention = require('../models/Intervention');
const fs = require('fs');
const path = require('path');

// @desc    Obtenir toutes les interventions
// @route   GET /api/interventions
// @access  Private
exports.getInterventions = async (req, res) => {
  try {
    let query = {};

    if (req.user.role !== 'admin') {
      query.technicien = req.user.id;
    }

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
      .populate('validePar', 'nom prenom role')
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
      .populate('validePar', 'nom prenom role')
      .populate('fichiers.uploadedBy', 'nom prenom')
      .populate('commentaires.auteur', 'nom prenom');

    if (!intervention) {
      return res.status(404).json({
        success: false,
        message: 'Intervention non trouvée'
      });
    }

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
    const interventionData = { ...req.body };
    
    if (req.files && req.files.length > 0 && req.user.role === 'admin') {
      const nouveauxFichiers = req.files.map(file => {
        let type = 'autre';
        if (file.mimetype.startsWith('image/')) {
          type = 'image';
        } else if (
          file.mimetype === 'application/pdf' ||
          file.mimetype === 'application/msword' ||
          file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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
      interventionData.fichiers = nouveauxFichiers;
    }

    const intervention = await Intervention.create(interventionData);

    const populatedIntervention = await Intervention.findById(intervention._id)
      .populate('technicien', 'nom prenom role username')
      .populate('fichiers.uploadedBy', 'nom prenom');

    res.status(201).json({
      success: true,
      data: populatedIntervention
    });
  } catch (error) {
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

// @desc    Mettre à jour une intervention - CORRIGÉ
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

    // ✅ CORRECTION : Empêcher la modification d'une intervention terminée (validée)
    if (intervention.statut === 'terminee') {
      return res.status(403).json({
        success: false,
        message: 'Cette intervention ne peut plus être modifiée'
      });
    }

    // ✅ CORRECTION : Empêcher un technicien de passer directement à "terminee"
    if (req.user.role !== 'admin' && req.body.statut === 'terminee') {
      return res.status(403).json({
        success: false,
        message: 'Seul un administrateur peut terminer une intervention'
      });
    }

    console.log('🔄 Mise à jour intervention - Statut actuel:', intervention.statut);
    console.log('🔄 Mise à jour intervention - Nouveau statut:', req.body.statut);
    console.log('🔄 Mise à jour intervention - DateFinEffective actuelle:', intervention.dateFinEffective);

    // Mettre à jour les champs
    Object.keys(req.body).forEach(key => {
      intervention[key] = req.body[key];
    });

    // ✅ CORRECTION : Juste sauvegarder, le middleware fera le reste
    await intervention.save();

    console.log('✅ Après sauvegarde - Statut:', intervention.statut);
    console.log('✅ Après sauvegarde - DateFinEffective:', intervention.dateFinEffective);

    // Repopuler les relations
    intervention = await Intervention.findById(req.params.id)
      .populate('technicien', 'nom prenom role username')
      .populate('validePar', 'nom prenom role')
      .populate('fichiers.uploadedBy', 'nom prenom')
      .populate('commentaires.auteur', 'nom prenom');

    res.status(200).json({
      success: true,
      data: intervention
    });
  } catch (error) {
    console.error('❌ Erreur updateIntervention:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ CORRIGÉ : Route pour valider une intervention (admin uniquement) - AVEC LOGS DÉTAILLÉS
// @desc    Valider une intervention terminée
// @route   PUT /api/interventions/:id/valider
// @access  Private (Admin only)
exports.validerIntervention = async (req, res) => {
  try {
    console.log('🔍 Début validation - Intervention ID:', req.params.id);
    console.log('🔍 Utilisateur:', req.user.id, 'Role:', req.user.role);

    let intervention = await Intervention.findById(req.params.id);

    if (!intervention) {
      console.log('❌ Intervention non trouvée');
      return res.status(404).json({
        success: false,
        message: 'Intervention non trouvée'
      });
    }

    console.log('🔍 Validation - Statut actuel:', intervention.statut);
    console.log('🔍 Validation - DateFinEffective:', intervention.dateFinEffective);
    console.log('🔍 Validation - DateValidation:', intervention.dateValidation);
    console.log('🔍 Validation - ValidePar:', intervention.validePar);

    // ✅ CORRECTION : Vérifier que l'intervention est bien en attente de validation
    if (intervention.statut !== 'en_attente_validation') {
      console.log('❌ Statut incorrect pour validation:', intervention.statut);
      return res.status(400).json({
        success: false,
        message: `Cette intervention n'est pas en attente de validation. Statut actuel: ${intervention.statut}`
      });
    }

    // ✅ CORRECTION : JUSTE changer le statut, le middleware gérera dateValidation
    intervention.statut = 'terminee';
    intervention.validePar = req.user.id;

    console.log('✅ Avant sauvegarde - Nouveau statut:', intervention.statut);
    console.log('✅ Avant sauvegarde - ValidePar:', intervention.validePar);

    await intervention.save();

    console.log('✅ Après sauvegarde - Statut final:', intervention.statut);
    console.log('✅ Après sauvegarde - DateValidation:', intervention.dateValidation);

    // Repopuler les relations
    intervention = await Intervention.findById(req.params.id)
      .populate('technicien', 'nom prenom role username')
      .populate('validePar', 'nom prenom role')
      .populate('fichiers.uploadedBy', 'nom prenom')
      .populate('commentaires.auteur', 'nom prenom');

    res.status(200).json({
      success: true,
      data: intervention,
      message: 'Intervention validée avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur validation:', error);
    console.error('❌ Stack trace:', error.stack);
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

    // ✅ CORRECTION : Autoriser les commentaires même pour les interventions terminées
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

    // ✅ CORRECTION : Autoriser l'upload même pour les interventions en attente de validation
    if (req.user.role !== 'admin' && intervention.technicien.toString() !== req.user.id) {
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

    // ✅ CORRECTION : Autoriser l'upload pour les interventions en attente de validation
    if (intervention.statut === 'terminee') {
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
        message: 'Impossible d\'ajouter des fichiers à une intervention validée'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier uploadé'
      });
    }

    const nouveauxFichiers = req.files.map(file => {
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

    if (req.user.role !== 'admin' && intervention.technicien.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cette intervention'
      });
    }

    // ✅ CORRECTION : Empêcher la suppression de fichiers pour les interventions terminées
    if (intervention.statut === 'terminee') {
      return res.status(403).json({
        success: false,
        message: 'Impossible de supprimer des fichiers d\'une intervention validée'
      });
    }

    const fichier = intervention.fichiers.id(req.params.idFichier);
    if (!fichier) {
      return res.status(404).json({
        success: false,
        message: 'Fichier non trouvé'
      });
    }

    const filePath = path.join(__dirname, '..', 'uploads', path.basename(fichier.url));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

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

// @desc    Obtenir les statistiques détaillées de durée
// @route   GET /api/interventions/stats/duree-detaillees
// @access  Private
exports.getStatsDureeDetaillees = async (req, res) => {
  try {
    let query = { 
      statut: 'terminee', 
      dateDebutEffectif: { $exists: true }, 
      dateFinEffective: { $exists: true } 
    };

    if (req.user.role !== 'admin') {
      query.technicien = req.user.id;
    }

    const interventions = await Intervention.find(query)
      .populate('technicien', 'nom prenom')
      .sort({ dateFinEffective: -1 });

    // Calculer les durées par intervention
    const interventionsAvecDuree = interventions.map(i => {
      const dureeMs = new Date(i.dateFinEffective) - new Date(i.dateDebutEffectif);
      const heures = Math.floor(dureeMs / (1000 * 60 * 60));
      const minutes = Math.floor((dureeMs % (1000 * 60 * 60)) / (1000 * 60));
      
      return {
        id: i._id,
        titre: i.titre,
        type: i.type,
        priorite: i.priorite,
        technicien: i.technicien ? `${i.technicien.prenom} ${i.technicien.nom}` : 'Non assigné',
        dateDebut: i.dateDebutEffectif,
        dateFin: i.dateFinEffective,
        dureeMs,
        dureeHeures: heures,
        dureeMinutes: minutes,
        dureeFormattee: heures > 0 ? `${heures}h ${minutes}min` : `${minutes}min`
      };
    });

    // Statistiques par type
    const statsParType = {};
    interventionsAvecDuree.forEach(inter => {
      if (!statsParType[inter.type]) {
        statsParType[inter.type] = {
          count: 0,
          totalDureeMs: 0,
          durees: []
        };
      }
      statsParType[inter.type].count++;
      statsParType[inter.type].totalDureeMs += inter.dureeMs;
      statsParType[inter.type].durees.push(inter.dureeMs);
    });

    // Calculer moyennes et médianes par type
    const statistiquesParType = Object.keys(statsParType).map(type => {
      const stat = statsParType[type];
      const moyenneMs = stat.totalDureeMs / stat.count;
      const moyenneHeures = Math.floor(moyenneMs / (1000 * 60 * 60));
      const moyenneMinutes = Math.floor((moyenneMs % (1000 * 60 * 60)) / (1000 * 60));
      
      // Calculer la médiane
      const dureesSorted = stat.durees.sort((a, b) => a - b);
      const medianIndex = Math.floor(dureesSorted.length / 2);
      const medianeMs = dureesSorted.length % 2 === 0
        ? (dureesSorted[medianIndex - 1] + dureesSorted[medianIndex]) / 2
        : dureesSorted[medianIndex];
      const medianeHeures = Math.floor(medianeMs / (1000 * 60 * 60));
      const medianeMinutes = Math.floor((medianeMs % (1000 * 60 * 60)) / (1000 * 60));
      
      return {
        type,
        count: stat.count,
        moyenne: {
          ms: moyenneMs,
          heures: moyenneHeures,
          minutes: moyenneMinutes,
          formattee: moyenneHeures > 0 ? `${moyenneHeures}h ${moyenneMinutes}min` : `${moyenneMinutes}min`
        },
        mediane: {
          ms: medianeMs,
          heures: medianeHeures,
          minutes: medianeMinutes,
          formattee: medianeHeures > 0 ? `${medianeHeures}h ${medianeMinutes}min` : `${medianeMinutes}min`
        }
      };
    });

    // Statistiques globales
    const totalDureeMs = interventionsAvecDuree.reduce((acc, i) => acc + i.dureeMs, 0);
    const moyenneGlobaleMs = interventionsAvecDuree.length > 0 ? totalDureeMs / interventionsAvecDuree.length : 0;
    const moyenneGlobaleHeures = Math.floor(moyenneGlobaleMs / (1000 * 60 * 60));
    const moyenneGlobaleMinutes = Math.floor((moyenneGlobaleMs % (1000 * 60 * 60)) / (1000 * 60));

    // Durée min et max
    const dureeMin = interventionsAvecDuree.length > 0 
      ? Math.min(...interventionsAvecDuree.map(i => i.dureeMs))
      : 0;
    const dureeMax = interventionsAvecDuree.length > 0 
      ? Math.max(...interventionsAvecDuree.map(i => i.dureeMs))
      : 0;

    res.status(200).json({
      success: true,
      data: {
        interventions: interventionsAvecDuree,
        statistiquesParType,
        statistiquesGlobales: {
          total: interventionsAvecDuree.length,
          moyenneGlobale: {
            ms: moyenneGlobaleMs,
            heures: moyenneGlobaleHeures,
            minutes: moyenneGlobaleMinutes,
            formattee: moyenneGlobaleHeures > 0 
              ? `${moyenneGlobaleHeures}h ${moyenneGlobaleMinutes}min` 
              : `${moyenneGlobaleMinutes}min`
          },
          dureeMin: {
            ms: dureeMin,
            heures: Math.floor(dureeMin / (1000 * 60 * 60)),
            minutes: Math.floor((dureeMin % (1000 * 60 * 60)) / (1000 * 60))
          },
          dureeMax: {
            ms: dureeMax,
            heures: Math.floor(dureeMax / (1000 * 60 * 60)),
            minutes: Math.floor((dureeMax % (1000 * 60 * 60)) / (1000 * 60))
          }
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

// @desc    Obtenir l'évolution des durées dans le temps
// @route   GET /api/interventions/stats/evolution-durees
// @access  Private
exports.getEvolutionDurees = async (req, res) => {
  try {
    const { periode = '30' } = req.query;
    const joursEnArriere = parseInt(periode);
    
    const dateDebut = new Date();
    dateDebut.setDate(dateDebut.getDate() - joursEnArriere);

    let query = { 
      statut: 'terminee', 
      dateDebutEffectif: { $exists: true }, 
      dateFinEffective: { $exists: true, $gte: dateDebut }
    };

    if (req.user.role !== 'admin') {
      query.technicien = req.user.id;
    }

    const interventions = await Intervention.find(query)
      .sort({ dateFinEffective: 1 });

    // Grouper par jour
    const evolutionParJour = {};
    interventions.forEach(i => {
      const date = new Date(i.dateFinEffective).toISOString().split('T')[0];
      const dureeMs = new Date(i.dateFinEffective) - new Date(i.dateDebutEffectif);
      const dureeHeures = dureeMs / (1000 * 60 * 60);
      
      if (!evolutionParJour[date]) {
        evolutionParJour[date] = {
          date,
          interventions: [],
          totalDureeMs: 0,
          count: 0
        };
      }
      
      evolutionParJour[date].interventions.push({
        titre: i.titre,
        type: i.type,
        dureeMs,
        dureeHeures
      });
      evolutionParJour[date].totalDureeMs += dureeMs;
      evolutionParJour[date].count++;
    });

    // Convertir en tableau et calculer moyennes
    const evolution = Object.values(evolutionParJour).map(jour => ({
      date: jour.date,
      count: jour.count,
      moyenneDureeMs: jour.totalDureeMs / jour.count,
      moyenneDureeHeures: (jour.totalDureeMs / jour.count) / (1000 * 60 * 60),
      totalDureeHeures: jour.totalDureeMs / (1000 * 60 * 60),
      interventions: jour.interventions
    }));

    res.status(200).json({
      success: true,
      data: {
        periode: joursEnArriere,
        evolution
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Exporter les données en CSV
// @route   GET /api/interventions/stats/export
// @access  Private
exports.exportDonnees = async (req, res) => {
  try {
    let query = { 
      statut: 'terminee', 
      dateDebutEffectif: { $exists: true }, 
      dateFinEffective: { $exists: true } 
    };

    if (req.user.role !== 'admin') {
      query.technicien = req.user.id;
    }

    const interventions = await Intervention.find(query)
      .populate('technicien', 'nom prenom')
      .sort({ dateFinEffective: -1 });

    // Créer le CSV
    const csvHeader = 'ID,Titre,Type,Priorité,Technicien,Date Début,Heure Début,Date Fin,Heure Fin,Durée (minutes),Durée (heures),Lieu,Matériel\n';
    
    const csvRows = interventions.map(i => {
      const dureeMs = new Date(i.dateFinEffective) - new Date(i.dateDebutEffectif);
      const dureeMinutes = Math.floor(dureeMs / (1000 * 60));
      const dureeHeures = (dureeMs / (1000 * 60 * 60)).toFixed(2);
      
      return [
        i._id,
        `"${i.titre.replace(/"/g, '""')}"`,
        i.type,
        i.priorite,
        i.technicien ? `"${i.technicien.prenom} ${i.technicien.nom}"` : 'Non assigné',
        new Date(i.dateDebutEffectif).toLocaleDateString('fr-FR'),
        i.heureDebutEffectif || '',
        new Date(i.dateFinEffective).toLocaleDateString('fr-FR'),
        i.heureFinEffective || '',
        dureeMinutes,
        dureeHeures,
        `"${i.lieu}"`,
        `"${i.materiel.replace(/"/g, '""')}"`
      ].join(',');
    }).join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=interventions_${new Date().toISOString().split('T')[0]}.csv`);
    res.send('\uFEFF' + csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};