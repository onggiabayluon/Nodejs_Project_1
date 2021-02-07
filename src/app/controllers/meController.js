
const Course = require('../models/Course');
const { multiMongooseToObject } =  require('../../util/mongoose');

class meController {
    
    // [GET] / me / stored / manga / :slug
    storedAllChapter(req, res, next) {
       Course.find({ chaptername: req.params.slug })
            //.select('title slug createdAt updatedAt description thumbnail chaptername chapter')
            .then((chapters) => {
                if (chapters) {             
                    console.log(Object.keys(chapters).length === 0);// true  
                    if((Object.keys(chapters).length === 0) === true) { // object rỗng sẽ ra true
                        var noChapters = true;
                        res.status(200).render('me/stored-AllChapter', { 
                            chapters,
                            noChapters
                        })
                    } else {
                        res.status(200).render('me/stored-AllChapter', { 
                            chapters: multiMongooseToObject(chapters) 
                        })}                
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

    // [GET] / me / stored / manga
    storedTruyenTranhs(req, res, next) {

        Promise.all([Course.find( { $and: [ { title: { $exists: true } }, { chaptername: { $not: { $exists: true } } } ] }), Course.countDocumentsDeleted()]
       )
                                
        .then( ([mangas, deletedCount]) => 
            res.render('me/stored-AllManga', {
                deletedCount,
                mangas: multiMongooseToObject(mangas),
            })
        )
        .catch(next);
    }
    
    // // [GET] / me / trash / manga
    // trashTruyenTranhs(req, res, next) {
    //     Course.findDeleted({})  
    //         .then(courses => res.render('me/trash-manga', {
    //                 courses: multiMongooseToObject(courses)
    //             }))
    //             .catch(next);
    // }

    //  // [GET] / me / trash / allChapter / :slug
    //  trashChapters(req, res, next) {
    //     Course.findDeleted({ chaptername: req.params.slug })  
    //         .then(courses => res.render('me/trash-AllChapter', {
    //                 courses: multiMongooseToObject(courses)
    //             }))
    //             .catch(next);
    // }
}

//export (SiteController) thì lát require nhận được nó
module.exports = new meController();
