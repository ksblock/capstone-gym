const express = require('express');
const path = require('path');
const conn = require('../config/db_config');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const axios = require('axios');

const router = express.Router();

//passport 전략 정의


//router
//로그인 중이면 해당 페이지로 이동 추가
router.get('/', function (req, res) {
    console.log(req.user);
    if(req.user)
        console.log("test");
    res.send('Hello, Express');
    //res.sendFile(path.join(__dirname, "../public", "gym.html"));
})

router.post('/checkDuplicate', function (req, res) {
  const param = req.body.id;

  var sql = 'SELECT count(*) FROM gym WHERE gym.id = ?';
  conn.query(sql, param, function(err, result) {
    if(err)
    {
      console.log(err);
      res.redirect('/gym/signup');
    }

    if(result.length === 0)
      res.send({status:200, result:0});
    else
      res.send({status:200, result:1});
  })
})

router.post('/checkCompany', async (req, res) => {
  const url = 'http://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=' + process.env.serviceKey + '&returnType=JSON';
  console.log(url);


  try{
    const result = await axios.post()
  }catch{

  }
})

router.get('/signup', function (req, res) {
    res.sendFile(path.join(__dirname, "../public/gym", "signup.html"));
})

router.post('/signup', function (req, res) {
    const param = [req.body.name, req.body.host_name, req.body.id, req.body.pw, req.body.phone, 
        req.body.location, req.body.registraion, req.body.large, req.body.small, req.body.event];
      
        var sql = 'INSERT INTO gym VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        conn.query(sql, param, function (err, result) {
          if(err)
          {
            console.log(err);
            return res.redirect('/gym/signup');
          }
        })
      
        res.redirect('/gym/login');
})

router.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, "../public/gym", "login.html"));
})

router.post('/login', passport.authenticate('local', { successRedirect: '/gym',
    failureRedirect: '/gym/login',
    session: true
    })
);

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
})

module.exports = router;