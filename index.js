const express = require('express') //include express module
const app = express() //create new app express
const port = 5000
const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require("./models/User");



//application/x--www-from-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());


const mongoose = require('mongoose')
mongoose.connect(config.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World! ~ 안녕하세요 오늘은 설날연휴 마지막 날이네요!! 드디어 코로나도 끝나가고 다들 희망적인 삶으로 돌아가고자하는 일들이 많이 일어나고 있어요!!!'))

app.post('/register', (req, res) => {

  //회원 가입 할때 필요한 정보들을 client에서 가져오면
  //그것들을 DB에 넣어준다.

  const user = new User(req.body)

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))