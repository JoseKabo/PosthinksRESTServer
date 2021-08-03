const { response, request } = require('express');
const getConnection = require('../database/config');
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const signupPOST = async(req = request, res = response) => {
    connection = getConnection();
    connection.connect(error => {
        if (error) {
            console.log(error);
            res.status(200).json({ error: true, status: 500, message: "ERROR_SERVER" });
        }
    });
    console.log(req);
    const {
        name,
        username,
        email,
        birthday
    } = req.body;
    const password = req.body.password;
    let cust_akey = await bcryptjs.hash(password, 8);
    let id = uuidv4();
    const sql = ` CALL SP_SignUp(?, ?, ? ,?, ?, ?, @result) `;

    const values = [
        id, name, username, email, cust_akey, birthday
    ];
    connection.query(sql, values, (error, result) => {
        if (error) res.status(200).json({ error: true, status: 500, message: error.message });
        if (result[1].affectedRows > 0) {
            res.status(200).json({
                error: false,
                status: 200,
                message: result[0][0].result
            });
        } else {
            res.status(200).json({ error: true, status: 400, message: result[0][0].result });
        }
    });
    connection.end();
}


const signinPOST = async(req = request, res = response) => {
    connection = getConnection();
    connection.connect(error => {
        if (error) {
            console.log(error);
            res.status(200).json({ error: true, status: 500, message: "ERROR_SERVER" });
        }
    });
    const {
        email,
        password
    } = req.body;
    const sql = ` CALL SP_check(?)`;
    const values = [email];
    connection.query(sql, values, (error, result) => {
        if (error) res.status(200).json({ error: true, status: 500, message: error.message });
        if (result[0].length > 0) {
            let hashkey = result[0]['0'].cust_akey;
            let comparePass = bcryptjs.compareSync(password, hashkey);
            if (comparePass) {
                res.status(200).json({
                    error: false,
                    status: 200,
                    result: {
                        id: result[0]['0'].id,
                        name: result[0]['0'].name,
                        username: result[0]['0'].username,
                        email: result[0]['0'].email,
                        birthday: result[0]['0'].birthday,
                        biography: result[0]['0'].biography
                    }
                });
            } else {
                res.status(200).json({ error: true, status: 200, result: 'Not matching' });
            }
        } else {
            res.status(200).json({ error: true, status: 400, result: 'Not found' });
        }
    });
    connection.end();

}

module.exports = {
    signupPOST,
    signinPOST
}