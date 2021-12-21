const userEntity = require("../entities/user.js");
const typeOrm = require("typeorm");
const getRepository = typeOrm.getRepository;
class UserRepository {

    /**
     *  Creates an entity of the new user in the DB
     *
     * @params attributes to save user
     *
     * @return entity of created user
     */
    async saveNewUser(newUser) {
        const userRepository = getRepository(userEntity);

        return await userRepository.save(newUser);
    }
    /**
      *  Deletes the user from the DB 
      *
      * @params userId in DB
      *
      * @return confirmation if deleted 
      */
    async deleteUserById(userId) {
        const userRepository = getRepository(userEntity);
        return await userRepository.delete(userId);
    }
    /**
         * Edits a user in the DB 
         *
         * @params userId in DB and new user information
         *
         * @return editted user entity
         */
    async editUserById(userInfo, userId) {
        const userRepository = getRepository(userEntity);
        await userRepository.update(userId, userInfo);
        return await userRepository.findOne(userId);
    }
    async getUserById(userId) {
        const userRepository = getRepository(userEntity);
        return await userRepository.findOne(userId);
    }
    async getUserByEmail(userEmail) {
        const userRepository = getRepository(userEntity);
        return await userRepository.findOne({ email: userEmail });
    }
}

module.exports = UserRepository

