const {User, validateUser, Status} = require('../models/user');
const {Friend, validateFriend} = require('../models/user')
const {Comment, validateComment} = require('../models/user')
const {Picture, validatePicture} = require('../models/user')

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


//get all Comments
router.get('/:userId/Comments', async(req,res)=>{
  try{
    const comment = await Comment.findAllComments();

    return res
    .send(comment);
  } catch(ex){
    return res.status(500).send(`Internal Server Error:${ex}`);
  }
});


//get single comment
router.get('/:userId/Comments/:CommentId', async(req,res)=>{
  try{
      const comment = await Comment.findById(req.params.CommentId);
      if (!comment) return res.status(400).send(`The user with id "${req.params.CommentId}" does not exist.`);
  
      return res
      .send(user.Comment);
  } catch(ex){
      return res.status(500).send(`Internal Server Error:${ex}`);
  }
})


//add new Comment
router.post("/:userId/Comments", async (req, res) => {
  try {
      // const {error} = validateFriend (req.body);
      // if (error) return res.status(400).send(error.details[0].message);
      const user = await User.findById(req.params.userId);
      if (!user) return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);
      
      let comment; 

      
      comment = new Comment({
        userId: req.body.userId,
        comment: req.body.comment,
      })
      
      
      user.comment.push(comment);
      
      await user.save()

      return res.send(user.comments)
  } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});


// delete comment
router.delete('/:userId/Comments',auth, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndRemove(req.params.CommentId);
    if (!comment)
      return res.status(400).send(`The user with id "${req.params.CommentId}" does not exist.`);
    return res.send(Comment);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});


//get all Pictures
router.get('/:userId/Pictures', async(req,res)=>{
  try{
    const picture = await Picture.findAllPicture();

    return res
    .send(picture);
  } catch(ex){
    return res.status(500).send(`Internal Server Error:${ex}`);
  }
});


//get single comment
router.get('/:userId/Pictures/:PictureId', async(req,res)=>{
  try{
      const picture = await Picture.findById(req.params.PictureId);
      if (!picture) return res.status(400).send(`The user with id "${req.params.PicturesId}" does not exist.`);
  
      return res
      .send(user.Picture);
  } catch(ex){
      return res.status(500).send(`Internal Server Error:${ex}`);
  }
})


//add new Comment
router.post("/:userId/Pictures", async (req, res) => {
  try {
      // const {error} = validateFriend (req.body);
      // if (error) return res.status(400).send(error.details[0].message);
      const user = await User.findById(req.params.userId);
      if (!user) return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);
      
      let picture; 

      
      picture = new Picture({
        userId: req.body.userId,
        picture: req.body.picture,
      })
      
      
      user.picture.push(picture);
      
      await user.save()

      return res.send(user.picture)
  } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});


// delete comment
router.delete('/:userId/Pictures',auth, async (req, res) => {
  try {
    const picture = await Picture.findByIdAndRemove(req.params.PictureId);
    if (!picture)
      return res.status(400).send(`The user with id "${req.params.PictureId}" does not exist.`);
    return res.send(Picture);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});


//get all Status
router.get('/:userId/Status', async(req,res)=>{
  try{
    const status = await Status.findAllStatus();

    return res
    .send(status);
  } catch(ex){
    return res.status(500).send(`Internal Server Error:${ex}`);
  }
});


//get single status
router.get('/:userId/Status/:StatusId', async(req,res)=>{
  try{
      const status = await Status.findById(req.params.StatusId);
      if (!status) return res.status(400).send(`The user with id "${req.params.statusId}" does not exist.`);
  
      return res
      .send(user.Status);
  } catch(ex){
      return res.status(500).send(`Internal Server Error:${ex}`);
  }
})


//add new status
router.post("/:userId/Status", async (req, res) => {
  try {
      // const {error} = validateFriend (req.body);
      // if (error) return res.status(400).send(error.details[0].message);
      const user = await User.findById(req.params.userId);
      if (!user) return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);
      
      let status; 

      
      status = new Status({
        userId: req.body.userId,
        status: req.body.status,
      })
      
      
      user.status.push(status);
      
      await user.save()

      return res.send(user.status)
  } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});


// delete status
router.delete('/:userId/Status',auth, async (req, res) => {
  try {
    const status = await Status.findByIdAndRemove(req.params.StatusId);
    if (!status)
      return res.status(400).send(`The user with id "${req.params.StatusId}" does not exist.`);
    return res.send(Status);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});




module.exports = router;