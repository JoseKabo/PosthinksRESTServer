const { response, request } = require('express');
const getConnection = require('../database/config');
const { v4: uuidv4 } = require('uuid');
const date = require('date-and-time');

const newPostingPOST = async(req = request, res = response) => {
    connection = getConnection();
    connection.connect(error => {
        if (error) {
            console.log(error);
            res.status(200).json({ error: true, status: 500, message: "ERROR_SERVER" });
        }
    });
    const {
        description,
        idUser
    } = req.body;
    let id = uuidv4();
    const now = new Date();
    date.format(now, 'YYYY/MM/DD HH:mm:ss');
    const sql = ` CALL SP_newPosting(?, ?, ?, ?, @result) `;
    const values = [
        id, description, idUser, date.format(now, 'YYYY/MM/DD HH:mm:ss')
    ];
    connection.query(sql, values, (error, result) => {
        if (error) res.status(200).json({ error: true, status: 500, message: error.message });
        if (result.length > 0) {
            res.status(200).json({
                error: false,
                status: 200,
                message: {
                    response: result[0],
                    message: "Success"
                }
            });
        } else {
            res.status(200).json({ error: true, status: 500, message: 'No result' });
        }
    });
    connection.end();
}

module.exports = {
    newPostingPOST
}