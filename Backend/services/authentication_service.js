const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("../config/db.config")
const {
    ErrorHandler
} = require('../helpers/error')
const EXPIRE_DURATION_IN_SECONDS = 14 * 86400

class AuthenticationService {

    constructor() {
    }
    /**
         * Used to encrypt a password by generating salt then hashing the password.
         *
         * @params password
         * 
         * @return promise with the ecnrypted password
         */
    encryptPassword(password) {
        return new Promise((resolve, reject) => {
            if (password == null) {
                reject(new ErrorHandler(400, "No password entered"))
            }
            bcrypt.genSalt(10).then((salt) => {
                bcrypt.hash(password, salt).then((hash) => {
                    resolve(hash)
                });
            });
        });
    }

    /**
     *  Used to sign the user data with a jwt token that expires in 14 days.
     *
     * @params user Entity including (email,password,fullname,username,id)
     * 
     * @return promise containg the token,current creation date,expiration data,user id 
     *          
     */
    generateAuthToken(userEntity) {
        return new Promise((resolve, reject) => {
            const token = jwt.sign({ data: userEntity }, config.privateKey, {
                expiresIn: '14d'
            });
            const iat = Math.floor(Date.now() / 1000)
            const exp = iat + EXPIRE_DURATION_IN_SECONDS

            resolve({
                token: token,
                id: userEntity.id,
                iat: iat,
                exp: exp
            })
        })
    }

    /**
     *  Used to validate the inserted password with the actual hashed password.
     *  If the passwords match then the user is authorized.
     *  Else user is not authorized
     *
     * @params inserted password and hashed correct password
     * 
     * @return promise indicating the authority of user
     *          
     */
    async validateUser(insertedPassword, hashedCorrectPassword) {
        return new Promise((resolve, reject) => {
            resolve(bcrypt.compare(insertedPassword, hashedCorrectPassword))
        });
    }

    /**
       *  Used to verify the token.
       *  Checks if the user id matches the id in the token structure.
       *  If yes then a prmoise is returned with the token components
       *  Else a reject promise is returned with error code 401.
       *
       * @params The token which had been generated.
       * @params id
       * 
       * @returns The response body includes the data that the token store.
       */
    verifyToken(token, id) {
        return new Promise((resolve, reject) => {
            try {
                const validationResults = jwt.verify(token, config.privateKey, {
                    expiresIn: '14d'
                });
                if (validationResults.data) {
                    if (validationResults.data.id == id) {
                        resolve(
                            {
                                data: {
                                    id: validationResults.data.id
                                },
                                iat: validationResults.iat,
                                exp: validationResults.exp
                            }
                        );
                    }
                    else {
                        throw new ErrorHandler(401, "Invalid Id")
                    }
                }
            } catch (err) {
                throw new ErrorHandler(401, err.message);
            }
        });
    }
}

module.exports = AuthenticationService
