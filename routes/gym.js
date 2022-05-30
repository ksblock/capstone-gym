const express = require('express');
const path = require('path');
const pool = require('../config/db_config');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const axios = require('axios');
const mysql = require('mysql2/promise');
const { append } = require('express/lib/response');
const Connection = require('mysql/lib/Connection');

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

router.get('/list', async function (req, res) {
  var id = req.user.host_id;
  //var id = 16;
  var sql = 'select gym_id, gym_name, sports from gym_info where host_id=?;';
  var sqls = mysql.format(sql, id);
  
  let connection = await pool.getConnection(async conn => conn);
  try{
    let [result] = await connection.query(sqls);
    console.log(result);
    connection.release();
    res.send(result);
  }catch(err){
    console.log(err);
    connection.release();
    res.send("실패");
  }
  
})

router.get('/detail/:id', async function (req, res) {
  
  const id = parseInt(req.params.id, 10);

  //console.log(req.cookies);
  //console.log(req.user);
  if (Number.isNaN(id)) {
    return res.status(400).send({message:"실패"});
  }

  var sql1 = 'select * from gym_info where gym_id=?;';
  var sql2 = 'select * from gym_registration where gym_id=?;';
  var sql3 = 'select * from gym_operation where gym_id=?;';

  var sql1s = mysql.format(sql1, id);
  var sql2s = mysql.format(sql2, id);
  var sql3s = mysql.format(sql3, id);

  let connection = await pool.getConnection(async conn => conn);
  try{
    let [result] = await connection.query(sql1s + sql2s + sql3s);
    console.log(result);
    connection.release();
    res.send(result);
  }catch(err){
    console.log(err);
    connection.release();
    res.send("실패");
  }
})

router.post('/signup/gyminfo', async function (req, res) {
  var host_id = 16;
  //console.log(req.user.host_id);
  //console.log(req.cookies);
  const param_info = [req.body.gym_name, req.user.host_id, req.body.email, req.body.phone, req.body.location, req.body.state, req.body.city, req.body.sports];
    
  const param_id = [req.body.gym_name, req.user.host_id, req.body.sports];

  var sql1 = 'INSERT INTO gym_info VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?);'
  var sql2 = 'SELECT gym_id from gym_info where gym_name=? and host_id=? and sports=?;';

  var sql1s = mysql.format(sql1, param_info);
  var sql2s = mysql.format(sql2, param_id);
  
  let connection = await pool.getConnection(async conn => conn);
  try{
    let [results] = await connection.query(sql1, param_info);

    let [rows] = await connection.query(sql2, param_id); 
    

    console.log(rows);
    var result_json = rows[0]['gym_id'];
    console.log(result_json);
    
    
    connection.release();

    return res.send({gym_id: result_json});
  }catch(err){
    console.log(err);

    connection.release();

    return res.send({message: "에러 발생"});
  }
})

router.post('/signup/registration', async function (req, res) {
  const param_reg = [req.body.gym_id, req.body.reg_num, req.body.reg_date, req.body.host_name];

  var sql1 = 'INSERT INTO gym_registration VALUES(?, ?, ?, ?);'
  //var sql1s = mysql.format(sql1, param_reg);
  
  let connection = await pool.getConnection(async conn => conn);
  try{
    let [results] = await connection.query(sql1, param_reg);

    connection.release();

    return res.send({message: "사업자 등록 정보 등록"});
  }catch(err){
    console.log(err);

    connection.release();

    return res.send({message: "에러 발생"});
  }
})

router.post('/signup/operation', async function (req, res) {
  const param_op = [req.body.gym_id, req.body.start_time, req.body.end_time, req.body.price, req.body.court,
    req.body.player_per_court, req.body.description];

  var sql1 = 'INSERT INTO gym_operation VALUES(?, ?, ?, ?, ?, ?, ?);'
  //var sql1s = mysql.format(sql1, param_op);
  
  let connection = await pool.getConnection(async conn => conn);
  try{
    let [results] = await connection.query(sql1, param_op);

    connection.release();

    return res.send({message: "운영 정보 등록"});
  }catch(err){
    console.log(err);

    connection.release();

    return res.send({message: "에러 발생"});
  }
})

router.post('/update/:id', async function (req, res) {//자기 체육관만 수정해야지 뭐하는 거야
  var update_gym_id = Number(req.params.id);
  
  var key = Object.keys(req.body);

  let connection = await pool.getConnection(async conn => conn);
  try{
    for(var i=0;i<key.length;i++)
    {
      var info = ["gym_name", "location", "sports", "phone", "email"];
      var table = "gym_operation";
      for(var j = 0; j < info.length; j++)
      {
        if(info[j] === key[i])
        {
          table = "gym_info";
          break;
        }
      }
      console.log(table);

      var sql = "UPDATE " + table + " SET " + key[i] + "=? WHERE gym_id = ?";

      var params = [req.body[key[i]], update_gym_id];

      let [results] = await connection.query(sql, params);
    }
  }catch(err){
    console.log(err);
  }finally{
    connection.release();
  }

  res.send("ㅎㅎ");
})

/*router.post('/update/:id', async function (req, res) {
  var update_gym_id = Number(req.params.id);
  var info = ["gym_name", "location", "sports", "phone", "email"];
  var table = "gym_operation";
  for(var i = 0; i < info.length; i++)
  {
    if(info[i] === req.body.type)
      table = "gym_info";
  }

  let connection = await pool.getConnection(async conn => conn);
  try{
    var sql = "UPDATE " + table + " SET " + req.body.type + "=? WHERE gym_id = ?";

    var params = [req.body.value, update_gym_id];

    let [results] = await connection.query(sql, params);
    
  }catch(err){
    console.log(err);
  }finally{
    connection.release();
  }

  res.send("ㅎㅎ");
})*/

router.post('/checkCompany', async (req, res) => {
  const url = 'http://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=' + process.env.serviceKey + '&returnType=JSON';
  console.log(url);
  console.log(req.body);

  var input = {
    "businesses": [
      {
        "b_no": req.body.reg_num,
        "start_dt": req.body.reg_date,
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

module.exports = router;
