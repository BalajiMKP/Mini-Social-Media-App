const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
});

router.post('/follow/:id', auth, async (req, res) => {
  const me = await User.findById(req.userId);
  const target = await User.findById(req.params.id);

  if (!target.followers.includes(me._id)) {
    target.followers.push(me._id);
    me.following.push(target._id);
    await target.save();
    await me.save();
    res.json({ message: 'Followed' });
  } else {
    res.json({ message: 'Already following' });
  }
});
