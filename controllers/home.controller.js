const { response, request } = require('express');
const getConnection = require('../database/config');

const getAllPostGET = async(req = request, res = response) => {
    connection = getConnection();
    connection.connect(error => {
        if (error) {
            console.log(error);
            res.status(200).json({ error: true, status: 500, message: "ERROR_SERVER" });
        }
    });
    const sql = ` CALL 	SP_getAllPosting() `;
    connection.query(sql, (error, result) => {
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
    getAllPostGET
}