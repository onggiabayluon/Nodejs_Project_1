
const Course = require('../models/Course');
const { multiMongooseToObject } =  require('../../util/mongoose');

class meController {
    // [GET] / me / stored / truyen-tranh
    storedTruyenTranhs(req, res, next) {

        Promise.all([Course.find( { $and: [ { title: { $exists: true } }, { chaptername: { $not: { $exists: true } } } ] }), Course.countDocumentsDeleted()])
                                
                                //{ chaptername: { $not: { $exists: true } } }
        .then( ([courses, deletedCount]) => 
            res.render('me/stored-truyen-tranh', {
                deletedCount,
                courses: multiMongooseToObject(courses),
            })
        )
        .catch(next);
    }
    
    // [GET] / me / trash / truyen-tranh
    trashTruyenTranhs(req, res, next) {
        Course.findDeleted({})  
            .then(courses => res.render('me/trash-truyen-tranh', {
                    courses: multiMongooseToObject(courses)
                }))
                .catch(next);
    }
}

//export (SiteController) thì lát require nhận được nó
module.exports = new meController();
