
const Course = require('../models/Course');
const { multiMongooseToObject } =  require('../../util/mongoose');

class meController {
    // [GET] / me / stored / courses
    storedcourses(req, res, next) {

        Promise.all([Course.find({}), Course.countDocumentsDeleted()])
        .then(([courses, deletedCount]) => 
            res.render('me/stored-courses', {
                deletedCount,
                courses: multiMongooseToObject(courses),
            })
        )
        .catch(next);
    }
    
    // [GET] / me / trash / courses
    trashcourses(req, res, next) {
        Course.findDeleted({})  
            .then(courses => res.render('me/trash-courses', {
                    courses: multiMongooseToObject(courses)
                }))
                .catch(next);
    }
}

//export (SiteController) thì lát require nhận được nó
module.exports = new meController();
