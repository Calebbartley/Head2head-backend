const  Joi  =  require('joi');
const  bcrypt  =  require('bcrypt');
const  express  =  require('express');
const  {User}    =  require('../models/user');
const  router  =  express.Router();
// const { isError } = require('joi');

router.post('/', async (req, res) => {
    try{
        console.log(req.body);
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        console.log('Pass 1');
        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Invalid email or password.');
        console.log('Pass 2');
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        console.log('Pass 3');
        if (!validPassword) return res.status(400).send('Invalid email or password.')
        console.log('Pass 4');
        const token = user.generateAuthToken();
        console.log('Pass 5');
        return res.send(token);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//login
function  validateLogin(req)  {
    const  schema  =  Joi.object({
        email:  Joi.string().min(5).max(255).required().email(),
        password:  Joi.string().min(5).max(1024).required(),
    });
    return  schema.validate(req);
}

// function logout(){
//     localStorage.clear();
//     window.location.href= '/'

// }
module.exports  =  router;