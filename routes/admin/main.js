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

module.exports = router;
