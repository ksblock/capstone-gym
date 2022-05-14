const express = require('express');
const path = require('path');
const conn = require('../config/db_config');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const axios = require('axios');
const mysql = require('mysql2');

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

router.get('/list', function (req, res) {
  var id = req.user.host_id;
  var sql = 'select gym_id, gym_name, sports from gym_info where host_id=?;';

  var sqls = mysql.format(sql, id);
  conn.query(sqls, function (err, result) {
    if(err)
      res.send({message: "실패"});
    res.send(result);
  })
})

router.get('/detail/:id', function (req, res) {
  
  const id = parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    return res.status(400).send({message:"실패"});
  }

  var sql1 = 'select * from gym_info where gym_id=?;';
  var sql2 = 'select * from gym_registration where gym_id=?;';
  var sql3 = 'select * from gym_operation where gym_id=?;';

  var sql1s = mysql.format(sql1, id);
  var sql2s = mysql.format(sql2, id);
  var sql3s = mysql.format(sql3, id);

  conn.query(sql1s + sql2s + sql3s, function (err, result) {
    if(err){
      console.log(err);
      res.send({message: "실패"});
    }

    res.send(result);
  })
})

router.post('/signup/gyminfo', function (req, res) {
  const param_info = [req.body.gym_name, req.user.host_id, req.body.email, req.body.phone, req.body.location, 
    req.body.state, req.body.city, req.body.sports];
    
  const param_id = [req.body.gym_name, req.user.host_id];

  var sql1 = 'INSERT INTO gym_info VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?);'
  var sql2 = 'SELECT gym_id from gym_info where gym_name=? and host_id=?;';

  var sql1s = mysql.format(sql1, param_info);
  var sql2s = mysql.format(sql2, param_id);
  
  conn.query(sql1s + sql2s, function (err, result) {
    if(err){
      console.log(err); 
      return res.send({message: "에러 발생"});
    }
    
    var result_json = result[1][0]['gym_id'];
    console.log(result_json);
    res.send({gym_id: result_json});
  })
})

router.post('/signup/registration', function (req, res) {
  const param_reg = [req.body.gym_id, req.body.reg_num, req.body.reg_date, req.body.host_name];

  var sql1 = 'INSERT INTO gym_registration VALUES(?, ?, ?, ?);'

  var sql1s = mysql.format(sql1, param_reg);
      
  conn.query(sql1s, function (err, result) {
    if(err){
      console.log(err); 
      return res.send({message: "에러 발생"});
    }
    return res.send({message: "사업자 등록 정보 등록"});
  })

})

router.post('/signup/operation', function (req, res) {
  const param_op = [req.body.gym_id, req.body.start_time, req.body.end_time, req.body.price, req.body.court,
    req.body.player_per_court, req.body.description];

  var sql1 = 'INSERT INTO gym_operation VALUES(?, ?, ?, ?, ?, ?, ?);'

  var sql1s = mysql.format(sql1, param_op);
      
  conn.query(sql1s, function (err, result) {
    if(err){
      console.log(err); 
      return res.send({message: "에러 발생"});
    }
    return res.send({message: "운영 정보 등록"});
  })
})

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