const Stock = require('../models/Stock');
const Emprunt = require('../models/Emprunt');

// @desc    Obtenir tous les matériels
// @route   GET /api/stock
// @access  Private
exports.getStock = async (req, res) => {
  try {
    let query = {};

    // Filtres optionnels
    if (req.query.categorie) {
      query.categorie = req.query.categorie;
    }

    if (req.query.stockFaible === 'true') {
      query.$expr = { $lte: ['$disponible', '$seuil'] };
    }

    const stock = await Stock.find(query).sort({ nom: 1 });

    res.status(200).json({
      success: true,
      count: stock.length,
      data: stock
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir un matériel par ID
// @route   GET /api/stock/:id
// @access  Private
exports.getMateriel = async (req, res) => {
  try {
    const materiel = await Stock.findById(req.params.id);

    if (!materiel) {
      return res.status(404).json({
        success: false,
        message: 'Matériel non trouvé'
      });
    }

    // Obtenir l'historique des emprunts pour ce matériel
    const emprunts = await Emprunt.find({ materiel: req.params.id })
      .populate('responsable', 'nom prenom')
      .sort({ dateEmprunt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        materiel,
        emprunts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Créer un nouveau matériel
// @route   POST /api/stock
// @access  Private (Admin only)
exports.createMateriel = async (req, res) => {
  try {
    // S'assurer que disponible = quantite à la création
    req.body.disponible = req.body.quantite;

    const materiel = await Stock.create(req.body);

    res.status(201).json({
      success: true,
      data: materiel
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mettre à jour un matériel
// @route   PUT /api/stock/:id
// @access  Private (Admin only)
exports.updateMateriel = async (req, res) => {
  try {
    let materiel = await Stock.findById(req.params.id);

    if (!materiel) {
      return res.status(404).json({
        success: false,
        message: 'Matériel non trouvé'
      });
    }

    // Si on modifie la quantité totale, ajuster le disponible proportionnellement
    if (req.body.quantite && req.body.quantite !== materiel.quantite) {
      const difference = req.body.quantite - materiel.quantite;
      req.body.disponible = materiel.disponible + difference;
    }

    materiel = await Stock.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: materiel
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Supprimer un matériel
// @route   DELETE /api/stock/:id
// @access  Private (Admin only)
exports.deleteMateriel = async (req, res) => {
  try {
    const materiel = await Stock.findById(req.params.id);

    if (!materiel) {
      return res.status(404).json({
        success: false,
        message: 'Matériel non trouvé'
      });
    }

    // Vérifier s'il y a des emprunts en cours
    const empruntsEnCours = await Emprunt.countDocuments({
      materiel: req.params.id,
      statut: 'en_cours'
    });

    if (empruntsEnCours > 0) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer un matériel avec des emprunts en cours'
      });
    }

    await materiel.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Matériel supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir les statistiques du stock
// @route   GET /api/stock/stats/global
// @access  Private
exports.getStockStats = async (req, res) => {
  try {
    const totalMateriels = await Stock.countDocuments();
    const stockFaible = await Stock.countDocuments({
      $expr: { $lte: ['$disponible', '$seuil'] }
    });

    const stats = await Stock.aggregate([
      {
        $group: {
          _id: '$categorie',
          total: { $sum: 1 },
          quantiteTotale: { $sum: '$quantite' },
          disponibleTotal: { $sum: '$disponible' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalMateriels,
        stockFaible,
        parCategorie: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};