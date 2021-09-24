const mongoose = require('mongoose');
const Joi = require ('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const friendSchema = new mongoose.Schema({
    friendId: { type: String, required: true, minlength: 2, maxlength: 50 },
    name:  { type: String, required: true, minlength: 2, maxlength: 50 }
    
});

const Friend = mongoose.model('Friend', friendSchema);

function validateFriend(friend) {
    const schema = Joi.object({
        friendId: Joi.string().min(2).max(50).required(),
        name: Joi.string().min(2).max(50).required()
    });
    return schema.validate(friend);
}

//comment
const commentSchema = new mongoose.Schema({
    userId: { type: String, required: true, minlength: 2, maxlength: 50 },
    comment:  { type: String, required: true}
    
});

const Comment = mongoose.model('Comment', commentSchema);

function validateComment(comment) {
    const schema = Joi.object({
        userId: Joi.string().min(2).max(50).required(),
        comment:  Joi.Text().required()
    });
    return schema.validate(comment);
}
//picture
const pictureSchema = new mongoose.Schema({
    userId: { type: String, required: true, minlength: 2, maxlength: 50 },
    picture:  { type: File,required: true}
    
});

const Picture= mongoose.model('Picture', pictureSchema);

function validatePicture(picture) {
    const schema = Joi.object({
        userId: Joi.string().min(2).max(50).required(),
        picture:  Joi.file().required()
    });
    return schema.validate(picture);
}

//status
const statusSchema = new mongoose.Schema({
    userId: { type: String, required: true, minlength: 2, maxlength: 50 },
    status:  { type: String, required: true}
    
});

const Status = mongoose.model('Status', statusSchema);

function validateStatus(status) {
    const schema = Joi.object({
        userId: Joi.string().min(2).max(50).required(),
        status:  Joi.string().required()
    });
    return schema.validate(status);
}


const userSchema = new mongoose.Schema({
    name:  { type: String, required: true, minlength: 2, maxlength: 50 },
    email: { type: String, unique: true, required: true, minlength: 5, maxlength: 255 },
    password: { type: String, required: true, minlength: 5, maxlength: 1024 },
    isAdmin:{type:Boolean, default:false},
    friends:{ type:[friendSchema], default:[]},
    comment: {type: [commentSchema], default:[]},
    status: {type: [statusSchema], default:[]},
    picture: {type: [pictureSchema], default:[]}
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, name: this.name , isAdmin: this.isAdmin}, config.get('jwtSecret'));
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required(),
    });
    return schema.validate(user);
}

exports.User = User
exports.validateUser = validateUser
exports.userSchema = userSchema
exports.Friend = Friend
exports.validateFriend = validateFriend
exports.friendSchema = friendSchema
exports.Comment = Comment
exports.validateComment = validateComment
exports.commentSchema = commentSchema
exports.Picture = Picture
exports.validatePicture = validatePicture
exports.pictureSchema = pictureSchema
exports.Status = Status
exports.validateStatus = validateStatus
exports.statusSchema = statusSchema

