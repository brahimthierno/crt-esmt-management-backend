// const User = require('../models/User');

// // @desc    Obtenir tous les utilisateurs
// // @route   GET /api/users
// // @access  Private (Admin only)
// exports.getUsers = async (req, res) => {
//   try {
//     const users = await User.find().select('-password');

//     res.status(200).json({
//       success: true,
//       count: users.length,
//       data: users
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Obtenir un utilisateur par ID
// // @route   GET /api/users/:id
// // @access  Private (Admin only)
// exports.getUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password');

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'Utilisateur non trouvé'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: user
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Créer un utilisateur
// // @route   POST /api/users
// // @access  Private (Admin only)
// exports.createUser = async (req, res) => {
//   try {
//     const { username, password, nom, prenom, role } = req.body;

//     // Vérifier si l'utilisateur existe déjà
//     const userExists = await User.findOne({ username });

//     if (userExists) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cet utilisateur existe déjà'
//       });
//     }

//     const user = await User.create({
//       username,
//       password,
//       nom,
//       prenom,
//       role
//     });

//     res.status(201).json({
//       success: true,
//       data: {
//         _id: user._id,
//         username: user.username,
//         nom: user.nom,
//         prenom: user.prenom,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Mettre à jour un utilisateur
// // @route   PUT /api/users/:id
// // @access  Private (Admin only)
// exports.updateUser = async (req, res) => {
//   try {
//     let user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'Utilisateur non trouvé'
//       });
//     }

//     // Ne pas permettre de modifier le mot de passe via cette route
//     if (req.body.password) {
//       delete req.body.password;
//     }

//     user = await User.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true
//       }
//     ).select('-password');

//     res.status(200).json({
//       success: true,
//       data: user
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Supprimer un utilisateur
// // @route   DELETE /api/users/:id
// // @access  Private (Admin only)
// exports.deleteUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'Utilisateur non trouvé'
//       });
//     }

//     // Empêcher la suppression des admins
//     if (user.role === 'admin') {
//       return res.status(403).json({
//         success: false,
//         message: 'Impossible de supprimer un administrateur'
//       });
//     }

//     await user.deleteOne();

//     res.status(200).json({
//       success: true,
//       data: {},
//       message: 'Utilisateur supprimé avec succès'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Changer le mot de passe
// // @route   PUT /api/users/:id/password
// // @access  Private (Admin or Self)
// exports.changePassword = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('+password');

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'Utilisateur non trouvé'
//       });
//     }

//     // Vérifier si l'utilisateur peut modifier ce mot de passe
//     if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
//       return res.status(403).json({
//         success: false,
//         message: 'Non autorisé'
//       });
//     }

//     const { currentPassword, newPassword } = req.body;

//     // Vérifier l'ancien mot de passe
//     const isMatch = await user.matchPassword(currentPassword);

//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: 'Mot de passe actuel incorrect'
//       });
//     }

//     // Mettre à jour le mot de passe
//     user.password = newPassword;
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: 'Mot de passe modifié avec succès'
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Obtenir les statistiques des techniciens
// // @route   GET /api/users/stats/techniciens
// // @access  Private (Admin only)
// exports.getTechniciensStats = async (req, res) => {
//   try {
//     const Intervention = require('../models/Intervention');

//     const techniciens = await User.find({ 
//       role: { $in: ['informaticien', 'electricien'] } 
//     }).select('-password');

//     const stats = await Promise.all(
//       techniciens.map(async (tech) => {
//         const interventions = await Intervention.find({ technicien: tech._id });
        
//         return {
//           _id: tech._id,
//           nom: tech.nom,
//           prenom: tech.prenom,
//           role: tech.role,
//           totalInterventions: interventions.length,
//           terminees: interventions.filter(i => i.statut === 'terminee').length,
//           enCours: interventions.filter(i => i.statut === 'en_cours').length,
//           planifiees: interventions.filter(i => i.statut === 'planifiee').length
//         };
//       })
//     );

//     res.status(200).json({
//       success: true,
//       data: stats
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };



// NOUIVELLE VERSION POUR QUE CHAQUE UTILISATEUR PUISSE MODIFIER SON PROFIL


const User = require('../models/User');

// @desc    Obtenir tous les utilisateurs
// @route   GET /api/users
// @access  Private (Admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir un utilisateur par ID
// @route   GET /api/users/:id
// @access  Private (Admin only)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Créer un utilisateur
// @route   POST /api/users
// @access  Private (Admin only)
exports.createUser = async (req, res) => {
  try {
    const { username, password, nom, prenom, role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Cet utilisateur existe déjà'
      });
    }

    const user = await User.create({
      username,
      password,
      nom,
      prenom,
      role
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mettre à jour un utilisateur (Admin uniquement)
// @route   PUT /api/users/:id
// @access  Private (Admin only)
exports.updateUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Ne pas permettre de modifier le mot de passe via cette route
    if (req.body.password) {
      delete req.body.password;
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ NOUVELLE FONCTION : Mettre à jour son propre profil
// @desc    Mettre à jour son propre profil
// @route   PUT /api/users/profile/me
// @access  Private (tous les utilisateurs connectés)
exports.updateOwnProfile = async (req, res) => {
  try {
    const { nom, prenom, username, password } = req.body;
    
    console.log('📝 Mise à jour du profil pour l\'utilisateur:', req.user.id);
    
    // Trouver l'utilisateur connecté
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    // Vérifier si le username existe déjà (sauf pour l'utilisateur actuel)
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Ce nom d\'utilisateur est déjà utilisé'
        });
      }
    }
    
    // Mettre à jour les champs
    if (nom) user.nom = nom;
    if (prenom) user.prenom = prenom;
    if (username) user.username = username;
    
    // Mettre à jour le mot de passe seulement s'il est fourni
    if (password && password.trim() !== '') {
      user.password = password; // Sera hashé par le pre-save hook
    }
    
    await user.save();
    
    console.log('✅ Profil mis à jour avec succès');
    
    // Retourner l'utilisateur sans le mot de passe
    const updatedUser = await User.findById(user._id).select('-password');
    
    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: updatedUser
    });
  } catch (error) {
    console.error('❌ Erreur mise à jour profil:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Supprimer un utilisateur
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Empêcher la suppression des admins
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Impossible de supprimer un administrateur'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Changer le mot de passe
// @route   PUT /api/users/:id/password
// @access  Private (Admin or Self)
exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier si l'utilisateur peut modifier ce mot de passe
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Vérifier l'ancien mot de passe
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir les statistiques des techniciens
// @route   GET /api/users/stats/techniciens
// @access  Private (Admin only)
exports.getTechniciensStats = async (req, res) => {
  try {
    const Intervention = require('../models/Intervention');

    const techniciens = await User.find({ 
      role: { $in: ['informaticien', 'electricien'] } 
    }).select('-password');

    const stats = await Promise.all(
      techniciens.map(async (tech) => {
        const interventions = await Intervention.find({ technicien: tech._id });
        
        return {
          _id: tech._id,
          nom: tech.nom,
          prenom: tech.prenom,
          role: tech.role,
          totalInterventions: interventions.length,
          terminees: interventions.filter(i => i.statut === 'terminee').length,
          enCours: interventions.filter(i => i.statut === 'en_cours').length,
          planifiees: interventions.filter(i => i.statut === 'planifiee').length
        };
      })
    );

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};