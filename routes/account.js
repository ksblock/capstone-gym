const express = require('express');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../config/db_config');
const req = require('express/lib/request');
const axios= require('axios');
const mysql = require('mysql2/promise');

const router = express.Router();

router.post('/idCheck', async function (req, res) {
  const param = [req.body.id];
  console.log(req.body.id);

  var sql = 'SELECT count(*) FROM host_info WHERE id = ?';

  let connection = await pool.getConnection(async conn => conn);
  try{
    let [result] = await connection.query(sql, param);
    console.log(result);
    
    connection.release();
    
    console.log(result[0]['count(*)']);
    
    if(result[0]['count(*)'] === 0)//id 사용 가능
      res.send({status:200, result:0, message: "사용가능"});
    else//id 사용 불가
      res.send({status:200, result:1, message: "사용 불가"});

  }catch(err){
    console.log(err);
    connection.release();
    res.send({message: "에러 발생"})
  }
})

router.post('/signup/host', async function (req, res) {
  const param_host = [req.body.host_name, req.body.id, req.body.pw, req.body.phone, req.body.email];
  var sql1 = 'INSERT INTO host_info VALUES(NULL, ?, ?, ?, ?, ?);'
  var sql1s = mysql.format(sql1, param_host);
  
  let connection = await pool.getConnection(async conn => conn);
  try{
    let [result] = await connection.query(sql1s);
    console.log(result);
    
    connection.release();
    
    res.send({message: "회원가입 성공"});

  }catch(err){
    console.log(err);
    connection.release();
    res.send({message: "에러 발생"})
  }
  
})
/*
router.post('/login', 
  passport.authenticate('local', {
    successRedirect: '/account/successLogin',
    failureRedirect: '/account/failureLogin',
    session: true
  })
);
*/
router.post('/login',
  passport.authenticate('local'), 
  function(req, res){
	console.log(req.user);
	res.send({message: "로그인 성공", user: req.user});
  }
);


router.get('/logout', function (req, res) {
    req.logout();
    res.send("로그아웃");
})

router.get('/successLogin', function (req, res) {
  console.log(req.headers.cookie);
  console.log(req.user);
  res.send({user: req.user, message:"로그인 성공"});
})

router.get('/failureLogin', function (req, res) {
  res.send({message:"로그인 실패"});
})

router.get('/getHost', function (req, res) {
  var name = "정석영";
  //res.send(name);
  if(req.user){
    res.send(req.user.host_name);
  }
  else{
    res.send({message: "로그인 상태가 아님"});
  }
})

router.get('/test', function (req, res) {
    console.log(req.session);
    console.log(req.user);
    res.redirect('/account/login');
})

module.exports = router;