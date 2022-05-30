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
  /*var sql_month = 'SELECT MONTH(date) AS month, end_time-start_time as time, count(*) as reserve FROM reservation WHERE gym_id=? GROUP BY month, time;';
  var sql_week="SELECT "
  + "DATE_FORMAT(DATE_SUB(date, INTERVAL (DAYOFWEEK(date)-1) DAY), '%Y/%m/%d') as start, "
  + "DATE_FORMAT(DATE_SUB(date, INTERVAL (DAYOFWEEK(date)-7) DAY), '%Y/%m/%d') as end, "
  + "DATE_FORMAT(date, '%Y%U') AS week, end_time - start_time as time, count(*) as reserve "
  + "FROM reservation "
  + "WHERE gym_id=? "
  + "GROUP BY week, time;";*/

  var sql = "SELECT end_time - start_time as time, count(*) as count FROM reservation "
  + "WHERE date BETWEEN DATE_ADD(NOW(), INTERVAL -1 " + req.params.type + " ) AND NOW() "
  + "AND gym_id=? group by time ORDER BY time"

  var id = Number(req.params.id);
  
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
  // var sql_month = "SELECT MONTH(date) AS month, player, count(*) as reserve FROM reservation WHERE gym_id=? GROUP BY month, player;";
  // var sql_week="SELECT "
  // + "DATE_FORMAT(DATE_SUB(date, INTERVAL (DAYOFWEEK(date)-1) DAY), '%Y/%m/%d') as start, "
  // + "DATE_FORMAT(DATE_SUB(date, INTERVAL (DAYOFWEEK(date)-7) DAY), '%Y/%m/%d') as end, "
  // + "DATE_FORMAT(date, '%Y%U') AS week, player, count(*) as reserve "
  // + "FROM reservation "
  // + "WHERE gym_id=? "
  // + "GROUP BY week, player;";

  var sql = "SELECT player, count(*) as count FROM reservation "
  + "WHERE date BETWEEN DATE_ADD(NOW(), INTERVAL -1 " + req.params.type + " ) AND NOW() "
  + "AND gym_id=? group by player ORDER BY player";

  var id = Number(req.params.id);

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

router.get('/getCourt/:type/:id', async function (req, res) {
  // var sql_month = "SELECT MONTH(date) AS month, court, count(*) as count FROM reservation WHERE gym_id=? GROUP BY month, court;";
  // var sql_week="SELECT "
  // + "DATE_FORMAT(DATE_SUB(date, INTERVAL (DAYOFWEEK(date)-1) DAY), '%Y/%m/%d') as start, "
  // + "DATE_FORMAT(DATE_SUB(date, INTERVAL (DAYOFWEEK(date)-7) DAY), '%Y/%m/%d') as end, "
  // + "DATE_FORMAT(date, '%Y%U') AS week, court, count(*) as reserve "
  // + "FROM reservation "
  // + "WHERE gym_id=? "
  // + "GROUP BY week, court;";

  var sql = "SELECT court, count(*) as count FROM reservation "
  + "WHERE date BETWEEN DATE_ADD(NOW(), INTERVAL -1 " + req.params.type + " ) AND NOW() "
  + "AND gym_id=? group by court ORDER BY court"

  var id = Number(req.params.id);
  
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

router.get('/getSalesRanking/:type/:id', async function (req, res) {
  var sql = "SELECT gym_info.gym_name, sum(amount) as sales, rank() over (order by sum(amount) desc) as ranking "
  + "FROM reservation, gym_info WHERE date BETWEEN DATE_ADD(NOW(),INTERVAL -1 " + req.params.type + " ) AND NOW()" 
  + "AND gym_info.gym_id=reservation.gym_id group by reservation.gym_id;"

  console.log(sql);
  let connection = await pool.getConnection(async conn => conn);

  try{
    let [result] = await connection.query(sql);
    connection.release();
    res.send(result);
  }catch(err){
    console.log(err);
    connection.release();
    res.send("??");
  }
})

router.get('/getReservationRanking/:type/:id', async function (req, res) {
  var sql = "SELECT gym_info.gym_name, count(*) as count, rank() over (order by count(*) desc) as ranking "
  + "FROM reservation, gym_info WHERE date BETWEEN DATE_ADD(NOW(),INTERVAL -1 " + req.params.type + " ) AND NOW() "
  + "AND gym_info.gym_id=reservation.gym_id group by reservation.gym_id;"

  console.log(sql);
  let connection = await pool.getConnection(async conn => conn);

  try{
    let [result] = await connection.query(sql);
    connection.release();
    res.send(result);
  }catch(err){
    console.log(err);
    connection.release();
    res.send("??");
  }
})

router.get('/getMySalesRanking/:type/:id', async function (req, res) {
  var sql = "SELECT gym_info.gym_name, sum(amount) as sales, rank() over (order by sum(amount) desc) as ranking "
  + "FROM reservation, gym_info WHERE date BETWEEN DATE_ADD(NOW(),INTERVAL -1 " + req.params.type + " ) AND NOW() "
  + "AND gym_info.gym_id=reservation.gym_id AND gym_info.gym_id in (select gym_id from gym_info where host_id=?) "
  + "group by reservation.gym_id;"

  var host = req.user.host_id;
  console.log(sql);
  let connection = await pool.getConnection(async conn => conn);

  try{
    let [result] = await connection.query(sql, host);
    connection.release();
    res.send(result);
  }catch(err){
    console.log(err);
    connection.release();
    res.send("??");
  }
})

router.get('/getMyReservationRanking/:type/:id', async function (req, res) {
  var sql = "SELECT gym_info.gym_name, count(*) as count, rank() over (order by count(*) desc) as ranking "
  + "FROM reservation, gym_info WHERE date BETWEEN DATE_ADD(NOW(),INTERVAL -1 " + req.params.type + " ) AND NOW() "
  + "AND gym_info.gym_id=reservation.gym_id AND gym_info.gym_id in (select gym_id from gym_info where host_id=?) "
  + "group by reservation.gym_id;"

  var host = req.user.host_id;
  console.log(sql);
  let connection = await pool.getConnection(async conn => conn);

  try{
    let [result] = await connection.query(sql, host);
    connection.release();
    res.send(result);
  }catch(err){
    console.log(err);
    connection.release();
    res.send("??");
  }
})

router.get('/getSportsSalesRanking/:type/:id', async function (req, res) {
  var sql = "SELECT gym_info.gym_name, sum(amount) as sales, rank() over (order by sum(amount) desc) as ranking "
  + "FROM reservation, gym_info WHERE date BETWEEN DATE_ADD(NOW(),INTERVAL -1 " + req.params.type + " ) AND NOW() "
  + "AND gym_info.gym_id=reservation.gym_id AND gym_info.sports = (select sports from gym_info where gym_id=?) "
  + "group by reservation.gym_id;"


  var id = req.params.id;
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

router.get('/getSportsReservationRanking/:type/:id', async function (req, res) {
  var sql = "SELECT gym_info.gym_name, count(*) as sales, rank() over (order by count(*) desc) as ranking "
  + "FROM reservation, gym_info WHERE date BETWEEN DATE_ADD(NOW(),INTERVAL -1 " + req.params.type + " ) AND NOW() "
  + "AND gym_info.gym_id=reservation.gym_id AND gym_info.sports = (select sports from gym_info where gym_id=?) "
  + "group by reservation.gym_id;"


  var id = req.params.id;
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