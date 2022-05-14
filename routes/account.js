const express = require('express');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const conn = require('../config/db_config');
const req = require('express/lib/request');
const axios= require('axios');
const mysql = require('mysql2');

const router = express.Router();

router.post('/idCheck', function (req, res) {
  const param = [req.body.id];
  console.log(req.body.id);

  var sql = 'SELECT count(*) FROM host_info WHERE id = ?';
  conn.query(sql, param, function(err, result) {
    if(err)
    {
      res.send({message: "에러 발생"})
    }
    console.log(result[0]['count(*)']);
    if(result[0]['count(*)'] === 0)//id 사용 가능
      res.send({status:200, result:0, message: "사용가능"});
    else//id 사용 불가
      res.send({status:200, result:1, message: "사용 불가"});
  })
})

router.post('/signup/host', function (req, res) {
  const param_host = [req.body.host_name, req.body.id, req.body.pw, req.body.phone, req.body.email];
    
  var sql1 = 'INSERT INTO host_info VALUES(NULL, ?, ?, ?, ?, ?);'

  var sql1s = mysql.format(sql1, param_host);
  
  conn.query(sql1s, function (err, result) {
    if(err){
      console.log(err); 
      return res.send({message: "에러 발생"});
    }
  })
  res.send({message: "회원가입 성공"})
})

router.post('/login', 
  passport.authenticate('local', {
    successRedirect: '/account/successLogin',
    failureRedirect: '/account/failureLogin',
    session: true
  })
);

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/account/login');
})

router.get('/successLogin', function (req, res) {
  res.send({user: req.user, message:"로그인 성공"});
})

router.get('/failureLogin', function (req, res) {
  res.send({message:"로그인 실패"});
})

router.get('/test', function (req, res) {
    console.log(req.session);
    console.log(req.user);
    res.redirect('/account/login');
})

module.exports = router;