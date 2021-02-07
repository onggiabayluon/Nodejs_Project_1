
const Course = require('../models/Course');
const { multiMongooseToObject } =  require('../../util/mongoose');

class meController {
    
    // [GET] / me / stored / truyen-tranh / :slug
    storedAllChapter(req, res, next) {
        Promise.all([ Course.find({ chaptername: req.params.slug }), Course.countDocumentsDeleted()] )
            //.select('title slug createdAt updatedAt description thumbnail chaptername chapter')
            .then(([courses, chapterDeletedCount]) => {
                if (courses) {             
                    console.log(Object.keys(courses).length === 0);// true  
                    if((Object.keys(courses).length === 0) === true) { // object rỗng sẽ ra true
                        var addSlug = [{chaptername: req.params.slug, coursesTemp: true}]
                        courses = courses.concat(addSlug); 
                        //res.json(courses)
                        // [{"slug": "wizard-of-anesia-2"},2] 
                        res.status(200).render('me/stored-AllChapter', { 
                            chapterDeletedCount,
                            courses
                        })
                    } else {
                        res.status(200).render('me/stored-AllChapter', { 
                            chapterDeletedCount,
                            courses: multiMongooseToObject(courses) })
                            }                
                } else {
                    res
                        .status(404)
                        .json({ message: "No valid entry found for provided ID" });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }

    // [GET] / me / stored / truyen-tranh
    storedTruyenTranhs(req, res, next) {

        Promise.all([Course.find( { $and: [ { title: { $exists: true } }, { chaptername: { $not: { $exists: true } } } ] }), Course.countDocumentsDeleted()]
       )
                                
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

     // [GET] / me / trash / allChapter / :slug
     trashChapters(req, res, next) {
        Course.findDeleted({ chaptername: req.params.slug })  
            .then(courses => res.render('me/trash-AllChapter', {
                    courses: multiMongooseToObject(courses)
                }))
                .catch(next);
    }
}

//export (SiteController) thì lát require nhận được nó
module.exports = new meController();
