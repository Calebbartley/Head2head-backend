const {User, validateUser} = require('../models/user');
const {Friend, validateFriend} = require('../models/user')

const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();


// get all users
router.get('/', async(req,res)=>{
    try{
      const users = await User.find();
  
      return res
      .send(users);
    } catch(ex){
      return res.status(500).send(`Internal Server Error:${ex}`);
    }
});



//get single user
router.get('/:userId', async(req,res)=>{
try{
    const users = await User.findById(req.params.userId);
    if (!users) return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);

    return res
    .send(users);
} catch(ex){
    return res.status(500).send(`Internal Server Error:${ex}`);
}
})



// create user
router.post("/", async (req, res) => {
    try {
        let user = await User.findOne({email: req.body.email});
        if (user) return res.status(400).send(error,"User with this Email already exist");

        const salt = await bcrypt.genSalt(10);
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt),
        });
        await user.save();
        const token = user.generateAuthToken();

        return res
            .header('x-auth-token', token)
            .header('access-control-expose-headers', 'x-auth-token')
            .send(user);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});




// edit user
router.put("/:userId", auth, async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error);
    
    const salt = await bcrypt.genSalt(10);
    let user = await User.findByIdAndUpdate(req.params.userId,{
      name : req.body.name,
      email : req.body.email,
      password : await bcrypt.hash(req.body.password, salt),},
      {new: true}
      );
    if (!user)
      return res
        .status(400)
        .send(`The user with id "${req.params.userId}" does not exist.`);

    await user.save();
    const token = user.generateAuthToken();

    return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send({ _id: user._id, name: user.name, email: user.email, isAdmin: this.isAdmin });

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});


// delete user
router.delete('/:userId', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.userId);
    if (!user)
      return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});


//get all friends
router.get('/:userId/Friends', async(req,res)=>{
  try{
    const friend = await Friend.findAllFriend();

    return res
    .send(friend);
  } catch(ex){
    return res.status(500).send(`Internal Server Error:${ex}`);
  }
});


//get single friend
router.get('/:userId/Friends/:FriendId', async(req,res)=>{
  try{
      const friend = await Friend.findById(req.params.FriendId);
      if (!friend) return res.status(400).send(`The user with id "${req.params.FriendId}" does not exist.`);
  
      return res
      .send(user.Friend);
  } catch(ex){
      return res.status(500).send(`Internal Server Error:${ex}`);
  }
})


//add new friend
router.post("/:userId/Friends", async (req, res) => {
  try {
      // const {error} = validateFriend (req.body);
      // if (error) return res.status(400).send(error.details[0].message);
      const user = await User.findById(req.params.userId);
      if (!user) return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);
      
      let friend; 

      
      friend = new Friend({
        friendId: req.body.friendId,
        name: req.body.name,
      })
      
      
      user.friends.push(friend);
      
      await user.save()

      return res.send(user.friends)
  } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});


// delete Friend
router.delete('/:userId/Friends',auth, async (req, res) => {
  try {
    const friend = await Friend.findByIdAndRemove(req.params.FriendId);
    if (!friend)
      return res.status(400).send(`The user with id "${req.params.FriendId}" does not exist.`);
    return res.send(Friend);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});



module.exports = router;