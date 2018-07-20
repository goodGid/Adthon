/*
 Declare module
 */
const express = require('express');
const router = express.Router();
const _crypto = require('crypto');
const async = require('async');
const bodyParser = require('body-parser');
const jwt = require('../../module/jwt.js');
const db = require('../../module/pool.js');
const secretKey = require('../../config/secretKey').key;



function encrypt(u_password) {
    const encrypted = _crypto.createHmac('sha512', secretKey).update(u_password).digest('base64');
    return encrypted;
}


/*
 Method : Get
 */



/*
 Method : Post
 */

// Written By 신기용
// 로그인
router.post('/signin', async (req, res, next) => {
    let { email, pwd } = req.body;
    pwd = encrypt(pwd);

    let selectQuery =
    `
    SELECT idx, email, name, phone_number, image_profile
    FROM users
    WHERE email = ? and pwd = ?
    `;

    let selectCatQuery=
    `
    SELECT idx
    FROM cats
    WHERE user_idx = ?
    `

    let userTicketQuery=
    `
    SELECT o.product
    FROM orders as o, reservations as r
    WHERE o.idx = r.order_idx and o.user_idx = ? and ( o.product = 3 or o.product = 6 )
    `

    let result = {};
    try {
        let _result = await db.query(selectQuery, [email, pwd.toString('base64')]);
        if(!_result[0]){
                return next("401");
        }
        let catQueryResult = await db.Query(selectCatQuery, [_result[0].idx]);
        if(_result.length > 0){
            let userTicket = await db.Query(userTicketQuery, [_result[0].idx]);

            result.flag = userTicket.length > 0 ? "1" : "-1" ;
            result.token = jwt.sign(email, _result[0].idx);
            result.email = _result[0].email;
            result.name = _result[0].name;
            result.phone_number = _result[0].phone_number;
            result.image_profile = _result[0].image_profile;
            result.cat_idx = catQueryResult.length > 0 ? String(catQueryResult[0].idx) : "-1";
        }
        else{
            return next("401");
        }
    } catch (error) {
        return next(error);
    }

    return res.r(result);

});


// Written By 신기용
// 회원가입
router.post('/signup', async (req, res, next) => {
    let { id, password } = req.body;
    password = encrypt(password);

    let selectId =
        `
    SELECT id
    FROM users
    WHERE id = ?
    `;

    let result = {};

    try {
        let selectResult = await db.query(selectId, [id]);
        if (selectResult.length > 0) {
            return next("1401"); // "description": "아이디가 중복됩니다.",
        }

        let insertQuery =
                `
            INSERT INTO users (id, password )
            VALUES(?,?);
            `;

        let userResult = await db.query(insertQuery, [id, password]);
        result.token = jwt.sign(id, userResult.insertId);
        result.id = id;

    } catch (error) {
        return next(error);
    }
    return res.r(result);
});



module.exports = router;
