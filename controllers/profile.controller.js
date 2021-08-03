const { response, request } = require('express');
const getConnection = require('../database/config');
const bcryptjs = require('bcryptjs');

const changeInfoPOST = async(req = request, res = response) => {
    connection = getConnection();
    connection.connect(error => {
        if (error) {
            console.log(error);
            res.status(200).json({ error: true, status: 500, message: "ERROR_SERVER" });
        }
    });
    const {
        id,
        email,
        birthday,
        biography
    } = req.body;
    const sql = ` CALL SP_alterUser(?, ?, ?, ?) `;
    const values = [
        id, email, birthday, biography
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

const changePassPOST = async(req = request, res = response) => {
    connection = getConnection();
    connection.connect(error => {
        if (error) {
            console.log(error);
            res.status(200).json({ error: true, status: 500, message: "ERROR_SERVER" });
        }

    });
    const {
        id,
        lastPassword,
        newPassword
    } = req.body;
    const sql = ` CALL SP_checkPass(?, @result)`;
    const values = [id];
    connection.query(sql, values, async(error, result) => {
        if (error) res.status(200).json({ error: true, status: 500, message: error.message });
        if (result[0].length > 0) {
            const hashkey = result[0]['0'].result;
            const comparePass = bcryptjs.compareSync(lastPassword, hashkey);
            if (comparePass) {
                const newPasswordBc = await bcryptjs.hash(newPassword, 8);
                const newSql = ` CALL SP_updatePass(?, ?, @result)`;
                const newValues = [id, newPasswordBc];
                await updatePasse(newSql, newValues);

            } else {
                res.status(200).json({ error: true, status: 200, message: 'Contrasñas incorrectas' });
            }
        } else {
            res.status(200).json({ error: true, status: 500, message: '' });
        }
    });
    connection.end();

    const updatePasse = async(newSql, newValues) => {
        connection = getConnection();
        connection.connect(error => {
            if (error) {
                console.log(error);
                res.status(200).json({ error: true, status: 500, message: "ERROR_SERVER" });
            }
        });
        connection.query(newSql, newValues, async(error, result) => {
            if (error) {
                res.status(200).json({ error: true, status: 500, message: error.message });
            }
            if (result[1].affectedRows == 1 && result[0]['0'].result == '1') {
                res.status(200).json({ error: false, status: 200, message: 'Contraseña actualizada' });
            } else {
                res.status(200).json({ error: true, status: 500, message: '' });
            }
        });
        connection.end();
    }
}

const myPostsPOST = async(req = request, res = response) => {
    connection = getConnection();
    connection.connect(error => {
        if (error) {
            console.log(error);
            res.status(200).json({ error: true, status: 500, message: "ERROR_SERVER" });
        }
    });
    const {
        id
    } = req.body;
    const sql = ` CALL SP_getOnlyMyPostings(?) `;
    const values = [
        id
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

const myBasicInfoPOST = async(req = request, res = response) => {
    connection = getConnection();
    connection.connect(error => {
        if (error) {
            console.log(error);
            response.status(200).json({ error: true, status: 500, message: "ERROR_SERVER" });
        }
    });
    const {
        id
    } = request.body;
    const sql = ` CALL SP_getBasicInfo(?) `;
    const values = [
        id
    ];
    connection.query(sql, values, (error, result) => {
        if (error) response.status(200).json({ error: true, status: 500, message: error.message });
        if (result.length > 0) {
            response.status(200).json({
                error: false,
                status: 200,
                message: {
                    response: result[0],
                    message: "Success"
                }
            });
        } else {
            response.status(200).json({ error: true, status: 500, message: 'No result' });
        }
    });
    connection.end();
}

const mystadisticsPOST = async(req = request, res = response) => {
    connection = getConnection();
    connection.connect(error => {
        if (error) {
            console.log(error);
            response.status(200).json({ error: true, status: 500, message: "ERROR_SERVER" });
        }
    });
    const {
        id
    } = request.body;
    const sql = ` CALL 	SP_getStadistics(?) `;
    const values = [
        id
    ];
    connection.query(sql, values, (error, result) => {
        if (error) response.status(200).json({ error: true, status: 500, message: error.message });
        if (result.length > 0) {
            response.status(200).json({
                error: false,
                status: 200,
                message: {
                    response: result[0],
                    message: "Success"
                }
            });
        } else {
            response.status(200).json({ error: true, status: 500, message: 'No result' });
        }
    });
    connection.end();
}

module.exports = {
    changeInfoPOST,
    changePassPOST,
    myPostsPOST,
    myBasicInfoPOST,
    mystadisticsPOST

}