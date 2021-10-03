const { body } = require('express-validator');
const Role = require('../../utils/userRoles.utils');


exports.createUserSchema = [
    body('username')
        .exists()
        .withMessage("Nom d'utilisateur obligatoire")
        .isLength({ min: 3 })
        .withMessage("Le nom d'utilisateur doit faire au moins 3 caractères de long"),
    body('email')
        .exists()
        .withMessage('Email est obligatoire')
        .isEmail()
        .withMessage("Doit être un email valide")
        .normalizeEmail(),
    body('password')
        .exists()
        .withMessage('Mot de pass obligatoire')
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Mot de pass doit faire au moins 6 caractères')
        .isLength({ max: 30 })
        .withMessage('Le mot de pass ne peut pas faire plus de 30 caractères')
];

exports.updateUserSchema = [
    body('username')
        .isLength({ min: 3 })
        .withMessage("Le nom d'utilisateur doit faire au moins 3 caractères de long"),
    body('email')
        .isEmail()
        .withMessage("L'email doit être valide")
        .normalizeEmail(),
    body('avatar_url')
        .notEmpty()
        .withMessage('Il faut une image')
        .custom((value, { req }) => value.substring(0, 4) === "http")
        .withMessage("Il faut une url")
];

exports.validateLogin = [
    body('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    body('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .withMessage('Password must be filled')
];