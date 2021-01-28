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
    
    //Home Page
    app.use('/', siteRouter);
}

module.exports = route;
