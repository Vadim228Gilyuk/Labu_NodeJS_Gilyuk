const express = require("express");
const User = require("../models/user");
const router = new express.Router();

router.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.send(error.message);
    }
})

router.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.send('User not found');
        }
        res.send(user);
    } catch (error) {
        res.send(error);
    }
});

router.post("/users", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.json(user);
    } catch (error) {
        res.json(error);
    }
})

router.patch('/users/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByIdAndUpdate(id, req.body);
        if (!user) {
            return res.send('User not found');
        }
        res.send(user);
    } catch (error) {
        res.send(error);
    }
});

router.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.send('User not found');
        }
        res.send(user);
    } catch (error) {
        console.error(error);
        res.send('Server error');
    }
});

router.delete('/users', async (req, res) => {
    try {
        const users = await User.deleteMany(req.body);
        res.send(users);
    } catch (error) {
        res.send(error);
    }
});

module.exports = router
