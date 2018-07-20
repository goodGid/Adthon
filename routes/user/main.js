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

// Written By 신기용
// 로그인
router.post('/signin', async (req, res, next) => {
    let { id, password } = req.body;
    password = encrypt(password);

    let selectQuery =
    `
    SELECT idx
    FROM users
    WHERE id = ? and password = ?
    `;


    let result = {};
    try {
        let _result = await db.query(selectQuery, [id, password.toString('base64')]);
        if(_result.length == 0 ){
                return next("401"); // "description": "로그인에 실패하였습니다.",
        }

        result.token = jwt.sign(id, _result[0].idx);
        result.id = _result[0].idx;
    } catch (error) {
        return next(error);
    }

    return res.r(result);

});


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
