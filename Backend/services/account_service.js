const userRepository = require('../repositories/user_repository');
const authenticationService = new (require("./authentication_service.js"));
const userEntity = require('../entities/user');
const {
    ErrorHandler
} = require('../helpers/error')

class AccountService {

    constructor() {
        this.userRepository = new userRepository();
    }

    /**
     *  Used to register a new user.
     *  It encrypts the user password before saving the use entity in the DB
     *  On success of the saving th entity in the DB,it generates a jwt token.
     *  Incase an error occured in saving the entity in the DB,a reject promise is returned with error code 500
     *
     * @params user information including (email,password,fullname,username)
     * 
     * @return an entity of the registered user in the DB along with the user token
     */
    registerNewUser(userInformation) {
        return new Promise((resolve, reject) => {
            authenticationService.encryptPassword(userInformation.password).then((encryptedPassword) => {
                userInformation.password = encryptedPassword
                this.userRepository.getUserByEmail(userInformation.email).then((userEntity) => {
                    if (userEntity) {
                        reject(new ErrorHandler(400, "Email Already Exists"))
                    }
                })
                this.userRepository.saveNewUser(userInformation).then((userEntity) => {
                    resolve(authenticationService.generateAuthToken(userEntity));
                }).catch((error) => {
                    reject(new ErrorHandler(500, error.message));
                });
            }).catch(error => {
                reject(error)
            });
        });

    }
    /**
     *  Used to login a new user.
     *  It gets the user entity from the DB by email.
     *  If the user exists then the password is validated.If wrong credentials then reject promise is returned with error code 401.Else if correct credentials,then user entity is returned.
     *  Else a reject promise is returned with error code 400.
     *
     * @params user information including (email,password)
     * 
     * @return an entity of the user in the DB along with the user token
     */
    loginUser(userCredentials) {
        return new Promise((resolve, reject) => {
            this.userRepository.getUserByEmail(userCredentials.email).then((userEntity) => {
                if (userEntity) {
                    authenticationService.validateUser(userCredentials.password, userEntity.password).then((authorized) => {
                        if (authorized) {
                            resolve(authenticationService.generateAuthToken(userEntity));
                        }
                        else {
                            throw new ErrorHandler(401, "Wrong Credentials,Unauthorized user")
                        }
                    }).catch((error) => {
                        reject(error);
                    });
                }
                else {
                    throw new ErrorHandler(400, "This Email doesn't exist")
                }
            }).catch((error) => {
                reject(error);
            });
        })

    }
    /**
        *  Used to deactivate a user account.
        *  It verifies the token of the user and verifies if the ids are matching.
        *  If yes then the user is authorized to deactivate his account,else a reject promise is returned with error code 401
        *  The function then sends the user id to the repository inorder to be deleted
        *  Incase an error occured while deleting a reject promise is returned with error code 500
        *
        * @params user id
        * @params user token
        * 
        * @return confirmation of deletion
        */
    deactivateAccount(userToken, userId) {
        return new Promise((resolve, reject) => {
            authenticationService.verifyToken(userToken, userId).then((userInformation) => {
                this.userRepository.deleteUserById(userId).then((userEntity) => {
                    resolve(userEntity);
                }).catch((error) => {
                    reject(new ErrorHandler(500, error.message));
                });
            }).catch((error) => {
                reject(error);
            });
        });
    }
    /**
        *  Used to edit user account information .
        *  It verifies the token of the user and verifies if the ids are matching.
        *  If yes then the user is authorized to edit his account,else a reject promise is returned with error code 401
        *  The function then sends the user data to the repository inorder to be editted  
        *  Incase an error occured while deleting a reject promise is returned with error code 500    
        *
        * @params new user information including (email,password,fullname,username)
        * @params userId
        * 
        * @return an entity of the ediited user in the DB
        */
    editAccount(userToken, userNewInformation, userId) {
        return new Promise((resolve, reject) => {
            authenticationService.encryptPassword(userNewInformation.password).then((encryptedPassword) => {
                userNewInformation.password = encryptedPassword;
                this.userRepository.getUserByEmail(userNewInformation.email).then((userEntity) => {
                    if (userEntity) {
                        if ((userEntity.id).toString() !== userId) {                            
                            reject(new ErrorHandler(400, "Email Already Exists"))
                        }
                    }
                })
                authenticationService.verifyToken(userToken, userId).then((userInformation) => {
                    this.userRepository.editUserById(userNewInformation, userId).then((userEntity) => {
                        resolve(userEntity);
                    }).catch((error) => {
                        reject(new ErrorHandler(500, error.message));
                    });
                }).catch((error) => {
                    reject(error);
                });
            });
        });
    }
    /**
         *  Used to get user account information .
         *  It verifies the token of the user and verifies if the ids are matching.
         *  If yes then the user is authorized to edit his account,else a reject promise is returned with error code 401
         *  The function then sends the user id to the repository inorder to be retrieve the user information  
         *  Incase an error occured while deleting a reject promise is returned with error code 500    
         *
         * @params userId
         * 
         * @return an entity of the user info
         */
    getAccountInfo(userToken, userId) {
        return new Promise((resolve, reject) => {
            authenticationService.verifyToken(userToken, userId).then((userInformation) => {
                this.userRepository.getUserById(userId).then((userEntity) => {
                    resolve(userEntity);
                }).catch((error) => {
                    reject(new ErrorHandler(500, error.message));
                });
            }).catch((error) => {
                reject(error);
            });


        });
    }
}

module.exports = AccountService
