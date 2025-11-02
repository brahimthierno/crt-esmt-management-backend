
// NOUVELLE VERSION CLAUDE AVEC INTEGRATION DE GESTION DES EMPRUNTS PAR LE TECHNICIEN (INFORMATICIEN/ELECTRICIEN)


const Emprunt = require('../models/Emprunt');
const Stock = require('../models/Stock');

// @desc    Obtenir tous les emprunts
// @route   GET /api/emprunts
// @access  Private
exports.getEmprunts = async (req, res) => {
  try {
    let query = {};

    // Filtres
    if (req.query.statut) {
      query.statut = req.query.statut;
    }

    if (req.query.materiel) {
      query.materiel = req.query.materiel;
    }

    const emprunts = await Emprunt.find(query)
      .populate('materiel', 'nom categorie')
      .populate('responsable', 'nom prenom')
      .sort({ dateEmprunt: -1 });

    res.status(200).json({
      success: true,
      count: emprunts.length,
      data: emprunts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir un emprunt par ID
// @route   GET /api/emprunts/:id
// @access  Private
exports.getEmprunt = async (req, res) => {
  try {
    const emprunt = await Emprunt.findById(req.params.id)
      .populate('materiel', 'nom categorie quantite disponible')
      .populate('responsable', 'nom prenom username');

    if (!emprunt) {
      return res.status(404).json({
        success: false,
        message: 'Emprunt non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: emprunt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Créer un nouvel emprunt
// @route   POST /api/emprunts
// @access  Private (Admin et Technicien)
exports.createEmprunt = async (req, res) => {
  try {
    const { materiel, quantite } = req.body;

    // Vérifier si le matériel existe et est disponible en quantité suffisante
    const materielDoc = await Stock.findById(materiel);

    if (!materielDoc) {
      return res.status(404).json({
        success: false,
        message: 'Matériel non trouvé'
      });
    }

    if (materielDoc.disponible < quantite) {
      return res.status(400).json({
        success: false,
        message: `Quantité insuffisante. Disponible: ${materielDoc.disponible}`
      });
    }

    // Ajouter le responsable (utilisateur connecté)
    req.body.responsable = req.user.id;

    // Créer l'emprunt
    const emprunt = await Emprunt.create(req.body);

    // Déduire du stock
    materielDoc.disponible -= quantite;
    await materielDoc.save();

    const populatedEmprunt = await Emprunt.findById(emprunt._id)
      .populate('materiel', 'nom categorie')
      .populate('responsable', 'nom prenom');

    res.status(201).json({
      success: true,
      data: populatedEmprunt
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Retourner un emprunt
// @route   PUT /api/emprunts/:id/retour
// @access  Private (Admin ou Technicien propriétaire)
exports.retournerEmprunt = async (req, res) => {
  try {
    const emprunt = await Emprunt.findById(req.params.id);

    if (!emprunt) {
      return res.status(404).json({
        success: false,
        message: 'Emprunt non trouvé'
      });
    }

    // Vérifier que l'utilisateur est admin ou le responsable de l'emprunt
    if (req.user.role !== 'admin' && emprunt.responsable.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à retourner cet emprunt'
      });
    }

    if (emprunt.statut === 'retourne') {
      return res.status(400).json({
        success: false,
        message: 'Cet emprunt a déjà été retourné'
      });
    }

    // Mettre à jour l'emprunt
    emprunt.statut = 'retourne';
    emprunt.dateRetourEffective = new Date();
    if (req.body.remarques) {
      emprunt.remarques = req.body.remarques;
    }
    await emprunt.save();

    // Remettre le stock
    const materiel = await Stock.findById(emprunt.materiel);
    materiel.disponible += emprunt.quantite;
    await materiel.save();

    const populatedEmprunt = await Emprunt.findById(emprunt._id)
      .populate('materiel', 'nom categorie')
      .populate('responsable', 'nom prenom');

    res.status(200).json({
      success: true,
      data: populatedEmprunt,
      message: 'Emprunt retourné avec succès'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mettre à jour un emprunt
// @route   PUT /api/emprunts/:id
// @access  Private (Admin ou Technicien propriétaire)
exports.updateEmprunt = async (req, res) => {
  try {
    let emprunt = await Emprunt.findById(req.params.id);

    if (!emprunt) {
      return res.status(404).json({
        success: false,
        message: 'Emprunt non trouvé'
      });
    }

    // Vérifier que l'utilisateur est admin ou le responsable de l'emprunt
    if (req.user.role !== 'admin' && emprunt.responsable.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cet emprunt'
      });
    }

    const ancienneQuantite = emprunt.quantite;
    const nouvelleQuantite = req.body.quantite;
    const materielId = emprunt.materiel;

    // Gérer le changement de quantité
    if (nouvelleQuantite && nouvelleQuantite !== ancienneQuantite) {
      const materiel = await Stock.findById(materielId);

      if (!materiel) {
        return res.status(404).json({
          success: false,
          message: 'Matériel non trouvé'
        });
      }

      // Calculer la différence
      const difference = nouvelleQuantite - ancienneQuantite;

      // Vérifier si suffisamment de stock est disponible pour l'augmentation
      if (difference > 0 && materiel.disponible < difference) {
        return res.status(400).json({
          success: false,
          message: `Quantité insuffisante pour l'augmentation. Disponible: ${materiel.disponible}, Nécessaire: ${difference}`
        });
      }

      // Mettre à jour le stock
      materiel.disponible -= difference;
      await materiel.save();

      console.log(`Stock mis à jour: ${materiel.nom} - Différence: ${difference}, Nouveau disponible: ${materiel.disponible}`);
    }

    // Ne pas permettre de changer le matériel (trop complexe)
    if (req.body.materiel && req.body.materiel !== emprunt.materiel.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Le changement de matériel n\'est pas autorisé'
      });
    }
    delete req.body.materiel; // Supprimer le champ matériel pour éviter tout changement

    // Mettre à jour l'emprunt
    emprunt = await Emprunt.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('materiel', 'nom categorie')
     .populate('responsable', 'nom prenom');

    res.status(200).json({
      success: true,
      data: emprunt,
      message: nouvelleQuantite && nouvelleQuantite !== ancienneQuantite ? 
        `Emprunt mis à jour. Quantité modifiée: ${ancienneQuantite} → ${nouvelleQuantite}` : 
        'Emprunt mis à jour'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Supprimer un emprunt
// @route   DELETE /api/emprunts/:id
// @access  Private (Admin only)
exports.deleteEmprunt = async (req, res) => {
  try {
    const emprunt = await Emprunt.findById(req.params.id);

    if (!emprunt) {
      return res.status(404).json({
        success: false,
        message: 'Emprunt non trouvé'
      });
    }

    // Si l'emprunt est en cours, remettre le stock
    if (emprunt.statut === 'en_cours') {
      const materiel = await Stock.findById(emprunt.materiel);
      materiel.disponible += emprunt.quantite;
      await materiel.save();
    }

    await emprunt.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Emprunt supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir les emprunts en retard
// @route   GET /api/emprunts/retards/liste
// @access  Private
exports.getEmpruntsEnRetard = async (req, res) => {
  try {
    const emprunts = await Emprunt.find({
      statut: 'en_cours',
      dateRetourPrevue: { $lt: new Date() }
    })
    .populate('materiel', 'nom categorie')
    .populate('responsable', 'nom prenom')
    .sort({ dateRetourPrevue: 1 });

    res.status(200).json({
      success: true,
      count: emprunts.length,
      data: emprunts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};