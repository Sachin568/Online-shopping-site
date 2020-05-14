const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require("bcrypt");
const saltRounds = 4;

// untilities TODO:need to check uncommon inputs like white spaces
function checkStringInput(value, inputName, functionName) {
    if (typeof value == 'undefined') {
        throw `Warning[${functionName}]: '${inputName}' is missing.`
    }
    else if (typeof value != 'string') {
        throw `Warning[${functionName}]: String is expected for '${inputName}'. Get ${typeof value} instead.`
    }
    return value
}
function checkNumberInput(value, inputName, functionName) {
    if (typeof value == 'undefined') {
        throw `Warning[${functionName}]: '${inputName}' is missing.`
    }
    else if (typeof value != 'number') {
        throw `Warning[${functionName}]: Number is expected for '${inputName}'. Get ${typeof value} instead.`
    }
    else if (isNaN(value)) {
        throw `Warning[${functionName}]: Number is expected for '${inputName}'. Get NaN instead.`
    } else if (value <= 0) {
        throw `Warning[${functionName}]: '${inputName}' can not be 0 or negative number.`
    }
    return value
}
function checkObjectAtrributes(obj, required) {
    for (let key of required) {
        // console.log(obj[key])
        if (!obj.hasOwnProperty(key) || !obj[key]) return false
    } return true
}

module.exports = {
    // must force frontend to send a complete json
    async addUser(basicInfo, email, password) {
        if (!checkObjectAtrributes(basicInfo, ["username", "birthdate"]) || !basicInfo) throw "Basic info not valid."
        // if (!checkObjectAtrributes(address, ["state", "city", "street", "zipCode"]) || !address) throw "Address not valid."
        const inputs = [email, password]
        const inputsname = ["email", "password"]
        for (i = 0; i < inputs.length; i++) {
            checkStringInput(inputs[i], inputsname[i], 'addUser')
        }
        const usersCollection = await users();
        email = email.toLowerCase()
        const checkEmailExist = await usersCollection.findOne({ "email": email })
        if (checkEmailExist) {
            throw `User already exists with that email ${email}`
        }
        basicInfo.username = basicInfo.username.toLowerCase()
        const checkUsernameExist = await usersCollection.findOne({ "basicInfo.username": basicInfo.username })
        if (checkUsernameExist) {
            throw `User already exists with that username ${basicInfo.username}`
        }

        let hashedPassword = await bcrypt.hash(password, saltRounds);
        let newUser = {
            basicInfo: {
                username: basicInfo.username,
                birthdate: basicInfo.birthdate,
            },
            email: email,
            address: {
                state: "",
                city: "",
                street: "",
                zipCode: ""
            },
            password: hashedPassword,
            shoppingCart: [],
            wishList: [],
            reviews: [],
            orderHistory: []
        }

        const insertInfo = await usersCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw 'Could not add user.';
        const newId = insertInfo.insertedId;
        const user = await this.getUserById(newId);
        console.log("User has been added:", user)
        return user;
    },
    // not used
    async removeUser(id) {
        if (!id) throw 'You must provide an id to delete user';

        const usersCollection = await users();
        const removedUser = await this.getUserById(ObjectId(id))
        const deletionInfo = await usersCollection.removeOne({ _id: ObjectId(id) });

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete user with id of ${id}`;
        }
        return removedUser
    },
    //TODO: need polish
    async updateUser(id, newEmail, newAddress) {
        if (!id) throw 'You must provide an id to update user';
        // checkObjectAtrributes(newAddress, ["state", "city", "street", "zipCode"])
        if (!newAddress) throw "Address is missing."
        // const inputs = [newEmail]
        // const inputsname = ["newEmail"]
        // for (i = 0; i < inputs.length; i++) {
        //     checkStringInput(inputs[i], inputsname[i], 'updateUser')
        // }
        //check if there is already user with that email
        const usersCollection = await users();
        const checkEmailExist = await usersCollection.findOne({ "email": newEmail })
        if (checkEmailExist) {
            if (String(checkEmailExist._id) != id) {
                throw `User already exists with that email ${newEmail}`
            }
        }
        //username and birthday are not supposed to be modified
        let updatedUser = {
            "email": newEmail,
            "address": {
                state: newAddress.state,
                city: newAddress.city,
                street: newAddress.street,
                zipCode: newAddress.zipCode
            }
        }
        console.log("updating", updatedUser)
        const updatedInfo = await usersCollection.updateOne({ _id: ObjectId(id) }, { $set: updatedUser });
        if (updatedInfo.modifiedCount === 0) {
            throw 'Could not update user successfully.(nothing changed?)';
        }
        return await this.getUserById(id);
    },
    async patchUser(id, patchObject) {
        if (!patchObject) throw 'You must provide an object to patch band';
        const usersCollection = await users();

        const updatedInfo = await usersCollection.updateOne({ _id: ObjectId(id) }, { $set: patchObject });
        if (updatedInfo.modifiedCount === 0) {
            // nothing changed would cause failure
            // throw 'could not update band successfully. Nothing changed?';
            return null
        }

        return await this.getUserById(id);
    },

    async getUserById(id) {
        if (!id | typeof (id) === 'undefined') throw 'You must provide an id to search for';
        const usersCollection = await users();
        const user = await usersCollection.findOne({ _id: ObjectId(id) });
        if (user === null) throw 'No user with that id';
        return user;
    },
    async getUserByName(username) {
        if (!username) throw 'You must provide a name to search for';
        const usersCollection = await users();
        const user = await usersCollection.findOne({ "basicInfo.username": username });
        if (user === null) throw 'No user with that name';
        return user;
    },
    async getUserCart(id) {
        if (!id | typeof (id) == 'undefined') throw 'You must provide an id to search for';
        const usersCollection = await users();
        const user = await usersCollection.findOne({ _id: ObjectId(id) });
        if (user === null) throw 'No user with that id';
        return user.shoppingCart;
    },

    async getUserWishlist(id) {
        if (!id | typeof (id) == 'undefined') throw 'You must provide an id to search for';
        const usersCollection = await users();
        const user = await usersCollection.findOne({ _id: ObjectId(id) });
        if (user === null) throw 'No user with that id';
        return user.wishList;
    },

    async clearUserCart(id) {
        if (!id | typeof (id) == 'undefined') throw 'You must provide an id to search for';
        const user = await this.patchUser(id, { "shoppingCart": [] });
        if (user === null) throw 'No user with that id';
        return true;
    },
    async clearUserWishList(id) {
        if (!id | typeof (id) == 'undefined') throw 'You must provide an id to search for';
        const user = await this.patchUser(id, { "wishList": [] });
        if (user === null) throw 'No user with that id';
        return true;
    },

    async updateUserPsw(userId, oldPsw, newPsw) {
        if (!userId | !newPsw) throw "no psw or id provided."
        const user = await this.getUserById(userId)
        const hashedPassword = user.password
        const pswmatch = await bcrypt.compare(oldPsw, hashedPassword)
        if (!pswmatch) {//user.password != oldPsw
            console.log("pdw change failed.")
            throw "old password doesn't match"
        }
        let newHashedPassword = await bcrypt.hash(newPsw, saltRounds);
        if (await this.patchUser(userId, { "password": newHashedPassword })) {
            console.log(`user ${user.name} changed psw`)
            return true
        } else {
            return false
        }
    },

    async getAllUsers() {
        const usersCollection = await users();

        const userList = await usersCollection.find({}).toArray();

        return userList;
    },
};