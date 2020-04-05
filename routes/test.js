const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;

ObjectId = require('mongodb').ObjectID;


const main = async () => {
    let allUsers = await usersData.getAllUsers()
    for (let j = 0; j < allUsers.length; j++) {
        let albums = allUsers[j].albums
        let detailedAlbums = Array()
        for (let i = 0; i < albums.length; i++) {
            let detailedAlbum = await albumsData.getAlbumById(ObjectId(albums[i]))
            detailedAlbums.push(detailedAlbum)
            // console.log(detailedAlbums)
        }
        allUsers[j].albums = detailedAlbums
    }
    console.log(JSON.stringify(allUsers, null, 1))
}
// main().catch(async (error) => {
//     console.log(error);
// });

router.get("/", async (req, res) => {
    try {
        console.log("Getting all users")
        const allUsers = await usersData.getAllUsers()
        res.status(200).json(allUsers);
    } catch (e) {
        res.status(404).json({ message: "Users not found" });
    }
});

router.get("/:id", async (req, res) => {
    let user
    try {
        console.log('Getting user with ID:', req.params.id)
        user = await usersData.getUserById(ObjectId(req.params.id))
    } catch (e) {
        console.log("Failed finding user with Id:", req.params.id)
        res.status(404).json({ message: "User not found" })
        return
    }
    try {
        res.status(200).json(user)
    } catch (e) {
        res.status(400).json({ error: "Failed getting info." });
    }
});

router.put("/:id", async (req, res) => {
    let user
    try {
        console.log('Getting user with ID:', req.params.id)
        user = await usersData.getUserById(ObjectId(req.params.id))

    } catch (e) {
        console.log("Failed finding user with Id:", req.params.id)
        res.status(404).json({ message: "User not found" })
        return
    }
    try {
        console.log('Updating user with ID:', req.params.id)
        const data = req.body;
        band = await usersData.updateUser(ObjectId(req.params.id), data.basicInfo, data.email, data.address)
        res.status(200).json(band)
    } catch (e) {
        console.log("Failed updating user with Id:", req.params.id)
        res.status(400).json({ message: "Update failed. JSON provided does not match schema?" });
    }
});

router.delete("/:id", async (req, res) => {
    let removedUser
    try {
        removedUser = await usersData.removeUser(req.params.id)
    } catch (e) {
        res.status(404).json({ error: "Can not find user with that id." })
        return
    }
    try {
        console.log('Removing user with ID:', req.params.id)
        res.status(200).json({
            deleted: true,
            data: removedUser
        })
    } catch (e) {
        res.status(400).json({ message: "Can not remove user with that Id" })
    }
});

router.post("/", async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
        res.status(200)
    } catch (e) {
        res.status(400).json({ message: "JSON provided does not match schema." })
    }
});

module.exports = router;
