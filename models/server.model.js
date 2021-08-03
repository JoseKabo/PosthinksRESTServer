const express = require('express');
const cors = require('cors');
const getConnection = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.authPath = '/auth';
        this.profilePath = '/profile';
        this.homePath = '/home';
        this.postingsPath = '/postings';

        this.dbConnection();

        // middlewares
        this.middlewares();

        this.routes();
    }

    get customCors() {
        var whitelist = ['http://localhost:4000', 'http://example2.com']
        return {
            origin: function(origin, callback) {
                if (whitelist.indexOf(origin) !== -1) {
                    console.log(origin);
                    callback(null, true)
                } else {
                    callback(new Error('Not allowed by CORS'))
                }
            }
        }
    }

    dbConnection() {
        getConnection();
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth.routes'));
        this.app.use(this.profilePath, require('../routes/profile.routes'));
        this.app.use(this.homePath, require('../routes/home.routes'));
        this.app.use(this.postingsPath, require('../routes/postings.routes'));
    }

    listenerServer() {
        this.app.listen(this.port, () => {
            console.log('PosthinksRESTServer by josekabo listening in ', this.port);
        });
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

}

module.exports = Server;