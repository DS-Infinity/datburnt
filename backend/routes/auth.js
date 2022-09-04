const User = require('../models/User');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const config = require('../config');
const cookieConfig = config.cookieConfig;
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function randomString(length) {
  var chars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'.split('');

  if (!length) {
    length = Math.floor(Math.random() * chars.length);
  }

  var str = '';
  for (var i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}

router.post('/register', async (req, res) => {
  try {
    // console.log(req)
    const newUser = {
      name: req.body.username,
      avatar: `https://avatars.dicebear.com/api/adventurer-neutral/${randomString(
        8
      )}.svg`,
      email: req.body.email,
      password: req.body.password,
    };

    console.log(
      newUser.username,
      newUser.avatar,
      newUser.email,
      newUser.password
    );

    if (
      !newUser.email ||
      newUser.email == '' ||
      newUser.email.trim() == '' ||
      !newUser.name ||
      newUser.name == '' ||
      newUser.name.trim() == '' ||
      !newUser.password ||
      newUser.password == '' ||
      newUser.password.trim() == '' ||
      !newUser.avatar ||
      newUser.avatar == '' ||
      newUser.avatar.trim() == ''
    ) {
      return res.send({
        success: false,
        message: 'All fields are required.',
      });
    }

    const validEmail = validateEmail(newUser.email);
    if (!validEmail)
      return res.send({ success: false, message: 'Invalid Email ID' });

    const doesUserExist = await User.findOne({ email: newUser.email });
    if (doesUserExist)
      return res.send({
        success: false,
        message: 'User with email already exists',
      });

    const doesUserExistPartTwo = await User.findOne({ name: newUser.name });
    if (doesUserExistPartTwo)
      return res.send({
        success: false,
        message: 'User with this username already exists',
      });

    const hashed = await bcrypt.hash(newUser.password, 15);
    const user = await User.create({ ...newUser, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);

    res
      .cookie('token', token, cookieConfig)
      .send({ success: true, userId: user._id });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: 'An error occured in /register' });
  }
});

router.get('/me', auth, async (req, res) => {
  const userId = req.user.id;

  const user = await User.findOne({ _id: userId }).select('-password');
  if (!user) return res.send({ succes: false, message: 'Invalid Token' });

  res.send({ success: true, user });
});

router.post('/login', async (req, res) => {
  try {
    const email = req.body.email;
    const pswd = req.body.password;

    const user = await User.findOne({ email });
    if (!user)
      return res.send({
        success: false,
        message: 'User with this email does not exist',
      });

    const match = await bcrypt.compare(pswd, user.password);
    if (!match)
      return res.send({ succes: false, message: 'Invalid Credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);
    const finalUserToSend = await User.findOne({ email })
      .lean()
      .select('-password');

    res
      .cookie('token', token, cookieConfig)
      .send({ success: true, user: finalUserToSend });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: e });
  }
});

router.post('/logout', auth, (req, res) => {
  res.clearCookie('token', config.removeCookieConfig).send({ success: true });
});

router.post('/add-frand', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = req.body.friendId;
    const user = await User.findOne({ _id: userId });
    const friend = await User.findOne({ _id: friendId });

    if (user.friends.includes(friend._id)) {
      return res.send({ success: false, message: 'Already friends' });
    }

    user.friends.push(friendId);

    await user.save();

    res.send({ success: true });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: 'An error occured in /add-frand' });
  }
});

router.post('/getUser', auth, async (req, res) => {
  const username = req.body.username;

  const user = await User.findOne({ name: username }).select('-password');
  if (!user) return res.send({ succes: false, message: 'Invalid Token' });

  res.send({ success: true, user });
});

router.post('/getUserFromID', auth, async (req, res) => {
  const userId = req.body.userId;

  const user = await User.findOne({ _id: userId }).select('-password');
  if (!user) return res.send({ succes: false, message: 'Invalid Token' });

  res.send({ success: true, user });
});

module.exports = router;
