const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const post = new Post({ content: req.body.content, author: req.userId });
  await post.save();
  res.json(post);
});

router.get('/', auth, async (req, res) => {
  const posts = await Post.find()
    .populate('author', 'username')
    .populate('comments.author', 'username')
    .sort({ timestamp: -1 });
  res.json(posts);
});

router.post('/:id/comment', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push({ text: req.body.text, author: req.userId });
  await post.save();
  res.json(post);
});

router.post('/:id/like', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post.likes.includes(req.userId)) {
    post.likes.push(req.userId);
    await post.save();
  }
  res.json(post);
});
