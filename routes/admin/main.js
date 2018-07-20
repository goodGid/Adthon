/*
 Declare module
 */
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('../../module/jwt.js');
const db = require('../../module/pool.js');
const secretKey = require('../../config/secretKey').key;


function encrypt(u_password) {
    const encrypted = crypto.createHmac('sha512', secretKey).update(u_password).digest('base64');
    return encrypted;
}


/*
 Method : Get
 */



/*
 Method : Post
 */

router.get('/ad_info', async (req, res, next) => {

    let selectQuery =
    `
    SELECT id,name,type,owner,COUNT(*) as click_count
    FROM advertisements
    JOIN ad_clicked_log on advertisements.id = ad_clicked_log.ad_id
    GROUP BY id
    `;
    console.log(selectQuery);
    let result = [];
    try {
        let _result = await db.query(selectQuery);
        _result.forEach( (elm) => {
          console.log(elm);
          result.push({
            "id" : elm.id,
            "name" : elm.name,
            "type" : elm.type,
            "owner" : elm.owner,
            "click_count" : elm.click_count
          });
        });

    } catch (error) {
        return next(error);
    }
    return res.r(result);

});

router.get('/ad_info_by_day' , async(req,res,next) => {

    let ad_id = req.query.ad_id;
    let date = req.query.date;
    let selectQuery =
    `
    SELECT DATE_FORMAT(time,"%Y-%m-%d %H:%i:%s") as time,COUNT(*) as count
    FROM ad_clicked_log
    WHERE ad_id =` + ad_id + ` AND time LIKE '` + date + `%'
    GROUP BY UNIX_TIMESTAMP(time) DIV 3600
    ORDER BY time
    `
    let result = [];
    try {
      let _result = await db.query(selectQuery);
      let count = 0;
      let tmp = _result[count].time.substr(11,2);
      for(let i = 0 ; i <=23; i++) {
        if(i <= tmp && tmp<i+1) {
            result.push(_result[count].count);
            count++;
            if(count < _result.length) {
              tmp = _result[count].time.substr(11,2);
            }
        } else {
            result.push(0);
        }
      }
    }  catch(error) {
      return next(error);
    }
    return res.r(result);
});

module.exports = router;
