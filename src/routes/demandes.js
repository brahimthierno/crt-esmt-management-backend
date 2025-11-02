
// ESSAIE AVEC TECHNICIEN PAR DEFAUT LORS DE LA CREATION DE LINTERVENTION

const express = require('express');
const router = express.Router();
const Demande = require('../models/Demande'); // ✅ MAJUSCULE
const Intervention = require('../models/Intervention');
const nodemailer = require('nodemailer');

// Configuration email (à adapter)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Générer numéro de référence unique
const genererNumeroReference = async () => {
  const date = new Date();
  const jour = String(date.getDate()).padStart(2, '0');
  const mois = String(date.getMonth() + 1).padStart(2, '0');
  const annee = date.getFullYear();
  const count = await Demande.countDocuments({});
  return `DEM-${annee}${mois}${jour}-${String(count + 1).padStart(3, '0')}`;
};

// 1. CRÉER UNE DEMANDE (Utilisateur anonyme)
router.post('/create', async (req, res) => {
  try {
    const { lieu, equipement, description, priorite, email, telephone } = req.body;

    // Validation
    if (!lieu || !equipement || !description || !email || !telephone) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }

    const numeroReference = await genererNumeroReference();

    const demande = new Demande({
      numeroReference,
      lieu,
      equipement,
      description,
      priorite: priorite || 'moyenne',
      email,
      telephone,
      statut: 'nouvelle'
    });

    await demande.save();

    // Envoyer email de confirmation au demandeur
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Demande d'intervention reçue - Référence: ${numeroReference}`,
      html: `
        <h2>Demande d'intervention reçue ✅</h2>
        <p>Merci d'avoir soumis votre demande.</p>
        <p><strong>Numéro de référence:</strong> <span style="color: #2563eb; font-size: 18px;">${numeroReference}</span></p>
        <p><strong>Lieu:</strong> ${lieu}</p>
        <p><strong>Équipement:</strong> ${equipement}</p>
        <p><strong>Priorité:</strong> ${priorite}</p>
        <p>Vous pouvez suivre votre demande en utilisant ce numéro de référence.</p>
        <p>Nous vous contacterons au ${telephone} dès que possible.</p>
      `
    });

    // Envoyer notification à l'admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `🚨 Nouvelle demande d'intervention - ${numeroReference}`,
      html: `
        <h2>Nouvelle demande d'intervention reçue</h2>
        <p><strong>Numéro:</strong> ${numeroReference}</p>
        <p><strong>Lieu:</strong> ${lieu}</p>
        <p><strong>Équipement:</strong> ${equipement}</p>
        <p><strong>Priorité:</strong> <span style="color: ${priorite === 'haute' ? 'red' : priorite === 'moyenne' ? 'orange' : 'green'}">${priorite}</span></p>
        <p><strong>Contact:</strong> ${email} | ${telephone}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p>Consultez l'application pour examiner cette demande.</p>
      `
    });

    res.status(201).json({
      success: true,
      message: 'Demande créée avec succès',
      numeroReference,
      demande
    });
  } catch (error) {
    console.error('❌ ERREUR /create:', error);
    res.status(500).json({ message: 'Erreur lors de la création', error: error.message });
  }
});

// 2. SUIVRE UNE DEMANDE (Par numéro de référence)
router.get('/suivi/:numeroReference', async (req, res) => {
  try {
    const demande = await Demande.findOne({ numeroReference: req.params.numeroReference });

    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    res.json(demande);
  } catch (error) {
    console.error('❌ ERREUR /suivi:', error);
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

// 3. LISTER TOUTES LES DEMANDES (Admin)
router.get('/list', async (req, res) => {
  try {
    const { statut, priorite } = req.query;
    let query = {};

    if (statut) query.statut = statut;
    if (priorite) query.priorite = priorite;

    const demandes = await Demande.find(query).sort({ dateCreation: -1 });
    res.json(demandes);
  } catch (error) {
    console.error('❌ ERREUR /list:', error);
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

// 4. EXAMINER UNE DEMANDE (Changer statut à 'examinee')
router.put('/examiner/:id', async (req, res) => {
  try {
    const demande = await Demande.findByIdAndUpdate(
      req.params.id,
      { statut: 'examinee' },
      { new: true }
    );

    res.json({ success: true, demande });
  } catch (error) {
    console.error('❌ ERREUR /examiner:', error);
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

// 5. CONVERTIR DEMANDE EN INTERVENTION (Admin)
router.post('/convertir/:id', async (req, res) => {
  try {
    console.log('📝 Convertir demande:', req.params.id);
    
    const demande = await Demande.findById(req.params.id);

    if (!demande) {
      console.error('❌ Demande non trouvée:', req.params.id);
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    console.log('✅ Demande trouvée:', demande.numeroReference);

    // Trouver un technicien par défaut (le premier utilisateur avec rôle 'informaticien' ou 'electricien')
    const User = require('../models/User'); // À adapter selon ton modèle
    let technicien = await User.findOne({ 
      role: { $in: ['informaticien', 'electricien'] } 
    });

    if (!technicien) {
      console.error('❌ Aucun technicien disponible');
      return res.status(400).json({ message: 'Aucun technicien disponible pour créer l\'intervention' });
    }

    console.log('✅ Technicien assigné:', technicien.nom);

    // Créer l'intervention
    const intervention = new Intervention({
      titre: `Intervention - ${demande.equipement}`,
      type: 'reparation',
      materiel: demande.equipement,
      lieu: demande.lieu,
      description: demande.description,
      priorite: demande.priorite,
      statut: 'planifiee',
      dateDebut: new Date(),
      heureDebut: '09:00',
      technicien: technicien._id // ✅ ASSIGNÉ
    });

    console.log('🔧 Création intervention:', intervention);
    await intervention.save();
    console.log('✅ Intervention créée:', intervention._id);

    // Mettre à jour la demande
    demande.statut = 'convertie';
    demande.interventionId = intervention._id;
    demande.dateConversion = new Date();
    await demande.save();
    console.log('✅ Demande mise à jour');

    // Envoyer email au demandeur
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: demande.email,
        subject: `Demande acceptée - Intervention programmée ${demande.numeroReference}`,
        html: `
          <h2>Votre demande a été acceptée ✅</h2>
          <p>Nous avons créé une intervention suite à votre demande.</p>
          <p><strong>Numéro de référence:</strong> ${demande.numeroReference}</p>
          <p><strong>Statut:</strong> Intervention programmée</p>
          <p>Un technicien vous contactera au ${demande.telephone} pour fixer un rendez-vous.</p>
          <p>Merci de votre confiance!</p>
        `
      });
      console.log('✅ Email envoyé au demandeur');
    } catch (emailError) {
      console.error('⚠️ Erreur email:', emailError.message);
    }

    res.json({ success: true, intervention, demande });
  } catch (error) {
    console.error('❌ ERREUR /convertir:', error);
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

// 6. REJETER UNE DEMANDE (Admin)
router.post('/rejeter/:id', async (req, res) => {
  try {
    console.log('🚫 Rejeter demande:', req.params.id);
    
    const { motifRejet } = req.body;
    const demande = await Demande.findByIdAndUpdate(
      req.params.id,
      { 
        statut: 'rejetee',
        motifRejet: motifRejet || 'Non spécifié'
      },
      { new: true }
    );

    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    // Envoyer email au demandeur
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: demande.email,
        subject: `Demande examinée - ${demande.numeroReference}`,
        html: `
          <h2>Votre demande a été examinée</h2>
          <p><strong>Numéro de référence:</strong> ${demande.numeroReference}</p>
          <p><strong>Statut:</strong> Non acceptée</p>
          <p><strong>Motif:</strong> ${demande.motifRejet}</p>
          <p>Si vous avez des questions, n'hésitez pas à nous contacter au ${process.env.PHONE_SUPPORT}</p>
        `
      });
      console.log('✅ Email rejet envoyé');
    } catch (emailError) {
      console.error('⚠️ Erreur email:', emailError.message);
    }

    res.json({ success: true, demande });
  } catch (error) {
    console.error('❌ ERREUR /rejeter:', error);
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

// 7. COMPTER LES DEMANDES PAR STATUT (Dashboard Admin)
router.get('/stats/count', async (req, res) => {
  try {
    const stats = await Demande.aggregate([
      {
        $group: {
          _id: '$statut',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    console.error('❌ ERREUR /stats/count:', error);
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

module.exports = router;