const express = require('../node_modules/express') //include express module
const app = express() //create new app express
const port = 5000
const bodyParser = require('../node_modules/body-parser');
const cookieParser = require('../node_modules/cookie-parser');
const config = {
  MONGO_URI: process.env.MONGO_URI
}
//const config = require('./server/config/key');
const { User } = require("./models/User");
const { auth } = require('./middleware/auth');


//application/x--www-from-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());

app.use(cookieParser());

const mongoose = require('mongoose')
console.log(config.MONGO_URI);
mongoose.connect(config.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World!'))

app.get('/api/hello', (req, res)=>{
  res.send('안녕하세요!')
})

app.post('/api/user/register', (req, res) => {

  const user = new User(req.body)

  user.save((err, userInfo) => {

    if (err) {
      console.log(err);
      return res.json({ success: false, err })
    }

    return res.status(200).json({
      success: true
    })
  })
})

app.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다."
        })
      }

      user.generateToken((err, user) => {
        if (err) return res, status(400).send(err);


        res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })

      })
    })
  })
})


app.get('/api/user/auth', auth, (res, req) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})


app.get('/api/users/logout', auth, (res, req) => {
  User.findOneAndUpdate({_id: req.user._id },
    {token: ""}
    , (err, user) => {
      if (err) return res.json({ successs: false, err});
      return res.status(200).send({
        success: true
      })
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))