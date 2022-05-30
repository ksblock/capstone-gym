const express = require('express');
const path = require('path');
const pool = require('../config/db_config');
const req = require('express/lib/request');
const mysql = require('mysql2/promise');
const conn = require('../config/db_config');
const router = express.Router();

/*
ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION

SELECT MONTH(date) AS month, sum(player) FROM reservation GROUP BY month;

SELECT
DATE_FORMAT(DATE_SUB(date, INTERVAL (DAYOFWEEK(date)-1) DAY), '%Y/%m/%d') as start,
DATE_FORMAT(DATE_SUB(date, INTERVAL (DAYOFWEEK(date)-7) DAY), '%Y/%m/%d') as end,
DATE_FORMAT(date, '%Y%U') AS week, court, count(*)
  FROM reservation
GROUP BY week, court;

SELECT
DATE_FORMAT(DATE_SUB(date, INTERVAL (DAYOFWEEK(date)-1) DAY), '%Y/%m/%d') as start,
DATE_FORMAT(DATE_SUB(date, INTERVAL (DAYOFWEEK(date)-7) DAY), '%Y/%m/%d') as end,
DATE_FORMAT(date, '%Y%U') AS week, player, count(*)
  FROM reservation
GROUP BY week, player;*/

router.get('/getSales/:type/:id', async function (req, res) {
  var sql_month="SELECT MONTH(date) AS month, sum(amount) as sales FROM reservation WHERE gym_id=? GROUP BY month;";
  var sql_week="SELECT "
  + "DATE_FORMAT(DATE_SUB(date, INTERVAL (DAYOFWEEK(date)-1) DAY), '%Y/%m/%d') as start, "
  + "DATE_FORMAT(DATE_SUB(date, INTERVAL (DAYOFWEEK(date)-7) DAY), '%Y/%m/%d') as end, "
  + "DATE_FORMAT(date, '%Y%U') AS week, sum(amount) as sales "
  + "FROM reservation "
  + "WHERE gym_id=? "
  + "GROUP BY week;";

  var id = Number(req.params.id);
  var sql = sql_week;
  if(req.params.type === 'month')
    sql = sql_month;
  console.log(sql);
  let connection = await pool.getConnection(async conn => conn);

  try{
    let [result] = await connection.query(sql, id);
    connection.release();
    res.send(result);
  }catch(err){
    console.log(err);
    connection.release();
    res.send("??");
  }

  
})

router.get('/getReservation/:type/:id', async function (req, res) {
  var sql_month = "SELECT MONTH(date) AS month, count(*) as count FROM reservation WHERE gym_id=? GROUP BY month;";
  var sql_week="SELECT "
  + "DATE_FORMAT(DATE_SUB(date, INTERVAL (DAYOFWEEK(date)-1) DAY), '%Y/%m/%d') as start, "
  + "DATE_FORMAT(DATE_SUB(date, INTERVAL (DAYOFWEEK(date)-7) DAY), '%Y/%m/%d') as end, "
  + "DATE_FORMAT(date, '%Y%U') AS week, count(*) as count "
  + "FROM reservation "
  + "WHERE gym_id=? "
  + "GROUP BY week;";

  var id = Number(req.params.id);
  var sql = sql_week;
  if(req.params.type === 'month')
    sql = sql_month;

  let connection = await pool.getConnection(async conn => conn);

  try{
    let [result] = await connection.query(sql, id);
    connection.release();
    res.send(result);
  }catch(err){
    connection.release();
    res.send("??");
  }

    
})

router.get('/getTime/:type/:id', async function (req, res) {
  var sql_month = 'SELECT MONTH(date) AS month, end_time-start_time as time, count(*) as reserve FROM reservation WHERE gym_id=? GROUP BY month, time;';
  var sql_week="SELECT "
  + "DATE_FORMAT(DATE_SUB(date, INTERVAL (DAYOFWEEK(date)-1) DAY), '%Y/%m/%d') as start, "
  + "DATE_FORMAT(DATE_SUB(date, INTERVAL (DAYOFWEEK(date)-7) DAY), '%Y/%m/%d') as end, "
  + "DATE_FORMAT(date, '%Y%U') AS week, end_time - start_time as time, count(*) as reserve "
  + "FROM reservation "
  + "WHERE gym_id=? "
  + "GROUP BY week, time;";

  var id = Number(req.params.id);
  var sql = sql_week;
  if(req.params.type === 'month')
    sql = sql_month;

  let connection = await pool.getConnection(async conn => conn);

  try{
    let [result] = await connection.query(sql, id);
    connection.release();
    res.send(result);
  }catch(err){
    connection.release();
    res.send("??");
  }
})

router.get('/getPlayer/:type/:id', async function (req, res) {
  var sql_month = "SELECT MONTH(date) AS month, player, count(*) as reserve FROM reservation WHERE gym_id=? GROUP BY month, player;";
  var sql_week="SELECT "
  + "DATE_FORMAT(DATE_SUB(date, INTERVAL (DAYOFWEEK(date)-1) DAY), '%Y/%m/%d') as start, "
  + "DATE_FORMAT(DATE_SUB(date, INTERVAL (DAYOFWEEK(date)-7) DAY), '%Y/%m/%d') as end, "
  + "DATE_FORMAT(date, '%Y%U') AS week, player, count(*) as reserve "
  + "FROM reservation "
  + "WHERE gym_id=? "
  + "GROUP BY week, player;";

  var id = Number(req.params.id);
  var sql = sql_week;
  if(req.params.type === 'month')
    sql = sql_month;

  let connection = await pool.getConnection(async conn => conn);

  try{
    let [result] = await connection.query(sql, id);
    connection.release();
    res.send(result);
  }catch(err){
    connection.release();
    res.send("??");
  }
})

router.get('/getCourt/:type/:id', async function (req, res) {
  var sql_month = "SELECT MONTH(date) AS month, court, count(*) as count FROM reservation WHERE gym_id=? GROUP BY month, court;";
  var sql_week="SELECT "
  + "DATE_FORMAT(DATE_SUB(date, INTERVAL (DAYOFWEEK(date)-1) DAY), '%Y/%m/%d') as start, "
  + "DATE_FORMAT(DATE_SUB(date, INTERVAL (DAYOFWEEK(date)-7) DAY), '%Y/%m/%d') as end, "
  + "DATE_FORMAT(date, '%Y%U') AS week, court, count(*) as reserve "
  + "FROM reservation "
  + "WHERE gym_id=? "
  + "GROUP BY week, court;";

  var id = Number(req.params.id);
  var sql = sql_week;
  if(req.params.type === 'month')
    sql = sql_month;
  console.log(sql);
  let connection = await pool.getConnection(async conn => conn);

  try{
    let [result] = await connection.query(sql, id);
    connection.release();
    res.send(result);
  }catch(err){
    console.log(err);
    connection.release();
    res.send("??");
  }
  
})

module.exports = router;