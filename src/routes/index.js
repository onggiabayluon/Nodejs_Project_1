// routes: index.js --> courses.js --> controller: coursesController.js

const newsRouter = require('./news');
const siteRouter = require('./site');
const coursesRouter = require('./courses');
const meRouter = require('./me');


function route(app) {

    //đang chọn route đầu tiên
    //Action ---> Dispatcher ---> Function handler
    app.use('/news', newsRouter);
    app.use('/courses', coursesRouter);
    app.use('/me', meRouter);
    
    // Home Page
    app.use('/', siteRouter);

    // Error
    app.use((req, res, next) => {
        const error = new Error("Not found");
        error.status = 404;
        next(error);
    });
    app.use((error, req, res, next) => {
        res.status(error.status || 500)
        res.json({
            error: {
                message: error.message,
                status: error.status,
            }
        });
    });
}

module.exports = route;
