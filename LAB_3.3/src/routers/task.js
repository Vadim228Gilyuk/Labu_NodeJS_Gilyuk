const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

router.use(auth); //req.user - поточний користувач

router.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({owner:req.user.id});
        if (!tasks) {
            res.status(404)
            res.send('Task not found');
        }
        res.send(tasks);
    } catch (error) {
        res.send(error.message);
    }
})

router.get('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const task = await Task.findOne({_id : req.params.id, owner: req.user._id});
        if (!task) {
            res.status(404)
            res.send('Task not found');
        }
        await task.populate("owner");
        res.json(task);
    } catch (error) {
        res.send(error);
    }
});

router.post("/tasks", async (req, res) => {
    const task = new Task({...req.body, owner:req.user.id});
    try {
        await task.save();
        res.status(201).send(task);
    }catch (e){
        res.status(500).send(e);
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const task = await Task.findByIdAndUpdate(id, req.body);
        if (!task) {
            return res.send('User not found');
        }
        res.send(task);
    } catch (error) {
        res.send(error);
    }
});

router.delete('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const task = await Task.findByIdAndDelete({_id:req.params.id,owner:req.user.id});
        if (!task) {
            return res.send('User not found');
        }
        res.send(task);
    } catch (error) {
        res.send(error);
    }
});


router.delete('/tasks', async (req, res) => {
    try {
        const tasks = await Task.deleteMany(req.body);
        res.send(tasks);
    } catch (error) {
        res.send(error);
    }
});

module.exports = router
