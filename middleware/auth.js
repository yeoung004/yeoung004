const { User } = require('../models/User');

let auth = (req, res, next) => {



    let token = req.cookies.x_auth;
    User.findByToken()


}