const express = require('express');
const router = express.Router();

const {getOdontogramas, newOdontograma, getSingleOdontograma, updateOdontograma} = require('../controllers/odontogramaController');
const {isAuthenticatedStaff, authorizeRoles} = require('../middlewares/auth');

router.route('/odontogramas').get(isAuthenticatedStaff, authorizeRoles('admin'), getOdontogramas);
router.route('/odontograma/nuevo').post(newOdontograma);
router.route('/odontograma/:id').get(getSingleOdontograma);
router.route('/odontograma/:id').put(updateOdontograma);

module.exports = router;