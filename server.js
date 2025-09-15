// server.js

require('dotenv').config()

const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const multer = require("multer");

const app = express();
app.use(express.json());

// File upload setup
const upload = multer({ dest: "uploads/" });

// MongoDB connection
const url = process.env.MONGODB_URL;
const client = new MongoClient(url);
let eventsCollection;

client.connect().then(() => {
    const db = client.db("eventdb");
    eventsCollection = db.collection("events");
    console.log("Connected to MongoDB");
});

// 1. GET single event by id
app.get("/api/v3/app/events", async (req, res) => {
    const { id, type, limit, page } = req.query;

    try {
        if (id) {
            const event = await eventsCollection.findOne({ _id: new ObjectId(id) });
            return res.json(event);
        }

        if (type === "latest") {
            const events = await eventsCollection
                .find({})
                .sort({ schedule: -1 })
                .skip((parseInt(page) - 1) * parseInt(limit))
                .limit(parseInt(limit))
                .toArray();
            return res.json(events);
        }

        res.status(400).json({ message: "Invalid query" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. POST create new event
app.post("/api/v3/app/events", upload.single("image"), async (req, res) => {
    try {
        const newEvent = {
            type: "event",
            name: req.body.name,
            tagline: req.body.tagline,
            schedule: new Date(req.body.schedule),
            description: req.body.description,
            moderator: req.body.moderator,
            category: req.body.category,
            sub_category: req.body.sub_category,
            rigor_rank: parseInt(req.body.rigor_rank),
            files: { image: req.file?.path },
            attendees: [],
        };

        const result = await eventsCollection.insertOne(newEvent);
        res.status(201).json({ _id: result.insertedId, ...newEvent });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. PUT update event
app.put("/api/v3/app/events/:id", upload.single("image"), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) updateData["files.image"] = req.file.path;

        const result = await eventsCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updateData }
        );

        res.json({ modifiedCount: result.modifiedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. DELETE event
app.delete("/api/v3/app/events/:id", async (req, res) => {
    try {
        const result = await eventsCollection.deleteOne({
            _id: new ObjectId(req.params.id),
        });
        res.json({ deletedCount: result.deletedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(3000, () => console.log("Server running on port 3000"));
