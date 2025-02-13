

module.exports = class Context {
    constructor(dir) {
        this.dir = dir;
    }

    initialize() {
        this.bindEnv();
        this.bindJobs();
        this.startExpress();
        this.bindBodyParser();
        this.defineFavIcon();
        this.bindCompression();
        this.bindLocalsUtils();
        this.bindMinify();
        this.exposeStaticFiles();

        this.bindSession()
        this.defineRoutes();
        this.definePrototypes();

        this.startListening();
    }

    bindEnv() {
        require('dotenv').config();
    }


    bindJobs() {
        require('../schedule/jobs');
    }

    startExpress() {
        this.express = require('express');
        this.app = this.express();
    }

    bindBodyParser() {
        const bodyParser = require('body-parser');

        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());

        const boolQueryParser = require('express-query-boolean');
        this.app.use(boolQueryParser());

        var intQueryParser = require('express-query-int');
        this.app.use(intQueryParser());
    }

    defineFavIcon() {
        const favicon = require('serve-favicon');
        this.app.use(favicon(this.dir + '/front/img/favicon.ico'));
    }

    bindCompression() {
        const compression = require('compression');
        this.app.use(compression({
            level: 6,
            threshold: 0
        }));
    }

    bindMinify() {
        if (process.env.NODE_ENV) {
            const minify = require('express-minify');
            this.app.use(minify({
                cache: this.dir + '/cache',
            }));
        }
    }

    bindLocalsUtils() {
        this.app.locals.moment = require('moment');
        this.app.locals.word = require('../const/word');
        this.app.locals.phrase = require('../const/phrase');
        this.app.locals.text = require('../const/text');

    }

    getCacheTime() {
        //Ten Days
        return process.env.NODE_ENV ? 1000 * 60 * 60 * 24 * 10 : 0;
    }


    exposeStaticFiles() {
        const applyUse = (path, folder) => {
            this.app.use(path, this.express.static(folder, { maxAge: this.getCacheTime() }));
        }

        applyUse('/img', 'front/img');
        applyUse('/css', 'front/css');
        applyUse('/js', 'front/js');
        applyUse('/lib', 'src/lib');




        this.app.set('views', this.dir + '/front/views')
        this.app.set('view engine', 'ejs');
    }


    bindSession() {
        const cookieSession = require('cookie-session');

        this.app.use(cookieSession({
            name: 'crime-pay',
            secret: process.env.SESS,
            maxAge: this.getCacheTime()
        }));

        return this;
    }


    definePrototypes() {
        require('../lib/util').Protos();
    }

    defineRoutes() {
        (require('../routes/routes')).bind(this.app);
    }

    getPort() {
        return process.env.PORT || 3000;
    }

    startListening() {
        this.app.set('port', this.getPort());
        this.app.listen().setTimeout(120000); // 2 min

        this.app.listen(this.getPort(), () => {
            // console.log('Node is running on port ', this.getPort())
        });
    }




}