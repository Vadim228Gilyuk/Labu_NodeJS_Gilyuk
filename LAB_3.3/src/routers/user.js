const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const {resetWatchers} = require("nodemon/lib/monitor/watch");
const router = new express.Router();


router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findOneByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.json({user, token});
    } catch (e) {
        res.status(400).send();
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


router.use(auth);

router.get('/users/me', async (req, res) => {
    const user = await  User.findById(req.user.id);
    await user.populate("tasks");
    res.send(user);
});

router.post('/users/logout',async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();
        res.json();
    }catch (e){
        res.status(500).send(e.message);
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.send('User not found');
        }
        await user.populate("tasks");
        res.json(user);
    } catch (error) {
        res.json(error);
    }
});





router.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.json(error.message);
    }
})
//




router.patch('/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id});
        if (!user) {
            return res.send('User not found');
        }
        const fields = ["name", "age", "email", "password"];
        fields.forEach((field) => {
            if (req.body[field]) {
                user[field] = req.body[field];
            }
        });
        await user.save();
        res.json(user);
    } catch (error) {
        res.json(error.message);
    }
});

router.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.send('User not found');
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.json('Server error');
    }
});

router.delete('/users', async (req, res) => {
    try {
        const users = await User.deleteMany(req.body);
        res.json(users);
    } catch (error) {
        res.json(error);
    }
});

module.exports = router
