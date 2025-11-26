// backend/routes/blog.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const InfoPage = require('../models/InfoPage');

// --- POSTS ---
// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    // Map _id to id for frontend compatibility
    const mapped = posts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      date: post.date,
      // Add any other fields you want to expose
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new post
router.post('/posts', async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new Post({ title, content });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a post
router.put('/posts/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a post
router.delete('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- INFO PAGES ---
// Get all info pages
router.get('/info', async (req, res) => {
  try {
    const infoPages = await InfoPage.find().sort({ date: -1 });
    // Map _id to id for frontend compatibility
    const mapped = infoPages.map(info => ({
      id: info._id.toString(),
      name: info.name,
      body: info.body,
      date: info.date,
      // Add any other fields you want to expose
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new info page
router.post('/info', async (req, res) => {
  try {
    const { name, body } = req.body;
    const infoPage = new InfoPage({ name, body });
    await infoPage.save();
    res.status(201).json(infoPage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an info page
router.put('/info/:id', async (req, res) => {
  try {
    const { name, body } = req.body;
    const infoPage = await InfoPage.findByIdAndUpdate(
      req.params.id,
      { name, body },
      { new: true }
    );
    if (!infoPage) return res.status(404).json({ error: 'Info page not found' });
    res.json(infoPage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an info page
router.delete('/info/:id', async (req, res) => {
  try {
    const infoPage = await InfoPage.findByIdAndDelete(req.params.id);
    if (!infoPage) return res.status(404).json({ error: 'Info page not found' });
    res.json({ message: 'Info page deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
