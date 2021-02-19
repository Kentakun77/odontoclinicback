const express = require('express');
const router = express.Router();

const {newTicket, getSingleTicket, myTickets,allTickets,updateTicket, deleteSingleTicket} = require('../controllers/ticketController');
const {isAuthenticatedUser, isAuthenticatedStaff} = require('../middlewares/auth');

router.route('/ticket/new').post(isAuthenticatedUser, newTicket);
router.route('/ticket/:id').get(isAuthenticatedUser, getSingleTicket);
router.route('/tickets/me').get(isAuthenticatedUser, myTickets);

//router.route('/admin/tickets').get(isAuthenticatedStaff, allTickets)
router.route('/admin/tickets').get(allTickets)
router.route('/admin/ticket/:id')
    .put(isAuthenticatedStaff, updateTicket)
    .delete(isAuthenticatedStaff, deleteSingleTicket)

module.exports = router;