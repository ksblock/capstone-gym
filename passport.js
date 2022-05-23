const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql2');
const conn = require('./config/db_config');

module.exports = () => {
    passport.serializeUser(function(user, done) {
        //console.log("serializeUser ", user)
        done(null, user);
        /*done(null, user.host_id);*/
      });

    passport.deserializeUser(function(user, done) {
  	console.log(user);
  	done(null, user);
      });

    /*  
    passport.deserializeUser(function(id, done) {
        console.log("deserializeUser id ", id)
        var userinfo;
        //console.log(id);
        var sql = 'SELECT * FROM host_info where host_id=?';
        conn.query(sql, [id], function(err, result) {
          if(err)
            console.log(err);
          //console.log("deserializeUser mysql result : ", result);
          var json = JSON.stringify(result[0]);
          userinfo = JSON.parse(json);
          console.log(userinfo);
          done(null, userinfo);
        })
    });
    */  
    passport.use(new LocalStrategy({
          usernameField: 'id',
          passwordField: 'pw',
	  session: true
        },
        function(username, password, done) {
          var sql = 'SELECT * FROM host_info WHERE id=? and pw=?';
          conn.query(sql, [username, password], function(err, result) {
            if(err)
              console.log(err);
      
            if(result.length === 0){
              console.log("없는 id");
              return done(null, false, {message: 'Incorrect'});
            }
            else{
              console.log(result);
              var json = JSON.stringify(result[0]);
              var gyminfo = JSON.parse(json);
              //console.log("gyminfo" + gyminfo);
              return done(null, gyminfo);
            }
          })
        }
    ));
};
