const router = require('express').Router();
const accountService = new (require("../services/account_service.js"));

/*---------Register new user---------*/
/**
 * /register
 *  post:
 *    description: Route used to register new user with user info
 *    responses:
 *      '200': 
 *        user token 
 *      '500':
 *        description: Internal Server Error
 *        description: Email already exists
 */
router.post("/register", function (req, res) {
  accountService.registerNewUser(req.body).then((registeredUser) => {
    res.send(registeredUser)
  }).catch(err => { res.status(err.statusCode).send({ error: err.message }) });
});

/*---------Login an existing user---------*/
/**
 * /login
 *  post:
 *    description: Route used to login a user to an existing account
 *    responses:
 *      '200': 
 *        user token 
 *      '500':
 *        description: Internal Server Error
 *      '401': 
 *       description:"Wrong Credentials,Unauthorized user"
 *      '400': 
 *       description:"This email doesnt exist"
 */

router.post("/login", function (req, res) {
  accountService.loginUser(req.body).then((user) => {
    res.send(user)
  }).catch(err => { res.status(err.statusCode).send({ error: err.message }) });
});

/*---------Delete a user---------*/
/**
 * /user/:userId
 *  delete:
 *    description: Route used to delete an existing user
 *    headers:
 *       authorization jwt token
 *    responses:
 *      '200': 
 *      '500':
 *        description: Internal Server Error
 *      '401': 
 *       description:"Wrong Credentials,Unauthorized user"
 */

router.delete("/user/:userId", function (req, res) {
  accountService.deactivateAccount(req.headers.authorization.split(' ')[1], req.params.userId).then((deletedUser) => {
    res.send()
  }).catch(err => { res.status(err.statusCode).send({ error: err.message }) });
});

/*---------Edit information for a user---------*/
/**
 * /user/{userId}
 *  put:
 *    description: Route used to edit user information
 *    parameters:
 *       -userId
 *    headers:
 *       authorization jwt token
 *    responses:
 *      '200': 
 *        editted user
 *      '500':
 *        description: Internal Server Error
 *      '401':
 *        description: Invalid id or Invalid token
 */
router.put('/user/:userId', function (req, res) {
  accountService.editAccount(req.headers.authorization.split(' ')[1], req.body, req.params.userId).then((edittedUser) => {
    res.send(edittedUser);
  }).catch(err => { res.status(err.statusCode).send({ error: err.message }) });
});

/*---------Get information for a user---------*/
/**
 * /user/{userId}
 *  get:
 *    description: Route used to get user information
 *    parameters:
 *       -userId
 *    headers:
 *       authorization jwt token
 *    responses:
 *      '200': 
 *        user info
 *      '500':
 *        description: Internal Server Error
 *      '401':
 *        description: Invalid id or Invalid token
 */
router.get('/user/:userId', function (req, res) {
  accountService.getAccountInfo(req.headers.authorization.split(' ')[1], req.params.userId).then((user) => {
    res.send(user);
  }).catch(err => { res.status(err.statusCode).send({ error: err.message }) });
});

module.exports = router