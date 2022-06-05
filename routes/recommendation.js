const express = require('express');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../config/db_config');
const req = require('express/lib/request');
const axios= require('axios');
const mysql = require('mysql2/promise');
const spawn = require('child_process').spawn;
const execSync = require('child_process').execSync;

const router = express.Router();

router.get('/:id', async function(req, res) {
    id = req.params.id;
    var sql = "select gym_id, count(*) as time from reservation where user_id=? group by gym_id order by time desc;";

    var connection = await pool.getConnection(async conn => conn);
    try{
        let [result] = await connection.query(sql, id);

        if(result.length == 0)
            res.redirect('recommendation/first/:id');

        const recommend_result = await spawn('python', ['recommendation/recommend.py', result[0]['gym_id']],);

        recommend_result.stdout.on('data', async (result)=>{
            py_result = result.toString();
            re_params = py_result.split(' ');

            parameter = [];
            for(var i = 0; i<10;i++ )
                parameter[i] = Number(re_params[i]);
            console.log(parameter);
            var sql2 = "select * from gym_info where gym_id=? or gym_id=? or gym_id=? or gym_id=? or gym_id=? "
            + "or gym_id=? or gym_id=? or gym_id=? or gym_id=? or gym_id=?;"
           
            try{
                let [recommended_gym] = await connection.query(sql2, parameter);
                connection.release();
                res.send(recommended_gym);
            }catch(err){
                console.log(err);
                connection.release();
                res.send({message: "미안"});
            }
        });

    }catch(err){
        console.log(err);
        connection.release();
        res.send(id);
    }
})

router.get('/first/:id', async function(req, res) {
    res.send(req.params.id);
})

module.exports = router;