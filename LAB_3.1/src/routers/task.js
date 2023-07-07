const express = require("express");
const Task = require("../models/task");
const router = new express.Router();

router.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.send(error.message);
    }
})

router.get('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.send('User not found');
        }
        res.send(task);
    } catch (error) {
        res.send(error);
    }
});

router.post("/tasks", async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.json(task);
    } catch (error) {
        res.json(error);
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
        const task = await Task.findByIdAndDelete(id);
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
