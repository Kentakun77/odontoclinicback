const express = require('express');
const router = express.Router();

const {registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserProfile, updatePassword, updateUserProfile,
    registerStaff, loginStaff, logoutStaff,forgotPasswordStaff, resetPasswordStaff, getStaffProfile, updatePasswordStaff, updateStaffProfile,
    allUsers, allStaffs, getUserDetails, getStaffDetails, updateStaff, deleteStaff, deleteUser}
    = require('../controllers/authController');
const {isAuthenticatedUser} = require('../middlewares/auth')
const {isAuthenticatedStaff} = require('../middlewares/auth')

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/me').get(isAuthenticatedUser,getUserProfile);
router.route('/password/update').put(isAuthenticatedUser,updatePassword);
router.route('/me/update').put(isAuthenticatedUser,updateUserProfile);


router.route('/staff/register').post(registerStaff);
router.route('/staff/login').post(loginStaff);
router.route('/staff/logout').get(logoutStaff);
router.route('/staff/password/forgot').post(forgotPasswordStaff);
router.route('/staff/password/reset/:token').put(resetPasswordStaff);
router.route('/staff/me').get(isAuthenticatedStaff,getStaffProfile);
router.route('/staff/password/update').put(isAuthenticatedStaff,updatePasswordStaff);
router.route('/staff/me/update').put(isAuthenticatedStaff,updateStaffProfile);

router.route('/admin/users').get(isAuthenticatedStaff,allUsers);
router.route('/admin/user/:id')
    .get(getUserDetails)
    .delete(isAuthenticatedStaff, deleteUser);
router.route('/admin/staffs').get(isAuthenticatedStaff,allStaffs);
router.route('/admin/staff/:id')
    .get(isAuthenticatedStaff,getStaffDetails)
    .put(isAuthenticatedStaff, updateStaff)
    .delete(isAuthenticatedStaff, deleteStaff);
module.exports = router;