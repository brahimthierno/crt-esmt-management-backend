const Intervention = require('../models/Intervention');

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
      .populate('technicien', 'nom prenom role username');

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

    // Si un technicien termine son intervention
    if (req.body.statut === 'terminee' && !intervention.dateFin) {
      req.body.dateFin = new Date();
    }

    intervention = await Intervention.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('technicien', 'nom prenom role username');

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

    await intervention.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Intervention supprimée avec succès'
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