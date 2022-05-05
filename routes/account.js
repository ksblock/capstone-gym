const express = require('express');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const conn = require('../config/db_config');
const req = require('express/lib/request');
const axios= require('axios');

const router = express.Router();

router.get('/', function (req, res) {
    console.log(req.user);
    if(req.user)
        console.log("test");
    res.send('Hello, Express');
    //res.sendFile(path.join(__dirname, "../public", "gym.html"));
})

router.post('/idCheck', function (req, res) {
  const param = [req.body.id];
  console.log(req.body.id);

  var sql = 'SELECT count(*) FROM gym WHERE gym.id = ?';
  conn.query(sql, param, function(err, result) {
    if(err)
    {
      console.log(err);
      res.redirect('/gym/signup');
    }
    console.log(result[0]['count(*)']);
    if(result[0]['count(*)'] === 0)//id 사용 가능
      res.send({status:200, result:0});
    else//id 사용 불가
      res.send({status:200, result:1});
  })
})

router.post('/checkCompany', async (req, res) => {
  const url = 'http://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=' + process.env.serviceKey + '&returnType=JSON';
  console.log(url);
  console.log(req.body);

  var input = {
    "businesses": [
      {
        "b_no": req.body.num,
        "start_dt": req.body.date,
        "p_nm": req.body.host_name
      }
    ]
  }

  console.log(input);
  
  try {
    const result = await axios({
        url: url,
        method: 'post',
        data: input
        });
        //console.log(result);
        console.log(result.data['data'][0]['valid']);
        var valid_result = result.data['data'][0]['valid'];
        if(valid_result === '01')
            res.status(200).send('인증');
        else
            res.status(200).send('인증 실패');        
    } catch(error) {
        console.log(error);
        res.send("error");
    }
    
})

router.get('/signup', function (req, res) {
    res.sendFile(path.join(__dirname, "../public/gym", "signup.html"));
})

router.post('/signup', function (req, res) {
    const param = [req.body.name, req.body.host_name, req.body.id, req.body.pw, req.body.phone, 
        req.body.location, req.body.registration, req.body.large, req.body.small, req.body.event];
      
        var sql = 'INSERT INTO gym VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        conn.query(sql, param, function (err, result) {
          if(err)
          {
            console.log(err); 
            return res.redirect('/account/signup');
          }
        })
      
        res.redirect('/account/login');
})

router.get('/login', function (req, res) {
    if(req.user){
        console.log(req.user);
        console.log(typeof(req.user));
        console.log(req.user.gym_id);
        //console.log(req.session);
    }
    res.sendFile(path.join(__dirname, "../public/gym", "login.html"));
})

router.post('/login', passport.authenticate('local', {
            failureRedirect: '/account/login',
            session: true
        }),
        function (req, res) {
            res.redirect('/' + req.user.gym_id);
        }
);

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/account/login');
})

router.get('/test', function (req, res) {
    console.log(req.session);
    console.log(req.user);
    res.redirect('/account/login');
})

module.exports = router;