const rootRouter = require('express').Router()
const AuthController = require('../controllers/authController')
const UserController = require('../controllers/userController')
const TransactionController = require('../controllers/transactionController')
const isAuth = require('../middlewares/isAuth')
const isNotAuth = require('../middlewares/isNotAuth')

/* try end point */
rootRouter.get('/try', [
    /* isNotAuth,  */AuthController.try
])

/* ===================================== credential endpoint ======================================= */
/* register endpoint */
rootRouter.post('/register', [
    isNotAuth, AuthController.register
])

/* login endpoint */
rootRouter.post('/login', [
    isNotAuth, AuthController.login
])
/* ================================================================================================= */

/* ===================================== profile endpoint ========================================== */
rootRouter.get('/profile', [
    isAuth, UserController.get
])

rootRouter.put('/profile', [
    isAuth, UserController.update
])
/* ================================================================================================ */

/* ===================================== transaction endpoint ===================================== */
rootRouter.get('/transaction', [
    isAuth, TransactionController.get
])

rootRouter.get('/transaction/per-date', [
    isAuth, TransactionController.getPerDate
])

rootRouter.post('/transaction', [
    isAuth, TransactionController.post
])

rootRouter.put('/transaction/transaction_id=:transactionId', [
    isAuth, TransactionController.put
])

rootRouter.delete('/transaction/transaction_id=:transactionId', [
    isAuth, TransactionController.destroy
])
/* ================================================================================================ */

module.exports = rootRouter