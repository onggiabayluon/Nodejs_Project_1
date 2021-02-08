//Mô hình mvc: từ clients --> 1. request lên controller --> 2. chọc vào model
// --> 3. lấy được dữ liệu mang về controller --> 4. chọc sang views, lấy data
// từ model truyền sang views --> 5. views render trả về client



const Course = require('../models/Course');

//cái dấu { } này để import từng phần tử bên trong
const { multiMongooseToObject } =  require('../../util/mongoose');

class SiteController {
    // [GET] / Site
    index(req, res, next) {
       
        //render courses vao homepage
        //2.
        //test
        // Course.findOne({ slug: 'toi-leo-thap-1-minh-test' }, function (err, page) {
        //     const allTaskPromise = new Promise((resolve, reject) => {
        //         resolve(page) //return kết quả promise là page
        //     })
        //     .then(function(result) { // (**)

        //         console.log(result); // 1
        //         return result;
              
        //       })
        //     }) //find manga
            //     //do task 1 va 2
            //         Course.findOne({ slug: 'toi-leo-thap-1-minh-test-aWAROrQ1F' })
            //         .select('title')
            //         .then(result => {
            //             console.log(`result 1 ${result}`)
            //         })
            //         .catch((error) => {
            //             console.error('> Error>', error);
            //         })
            //          //do task 3 va 4
            //     // .then(() => {
            //         Course.findOne({ slug: 'toi-leo-thap-1-minh-test-aWAROrQ1F' })
            //         .select('title')
            //             .then(result => {
            //                 console.log(`result 2 ${result}`)
            //             })
            //             .catch((error) => {
            //                 console.error('> Error>', error);
            //             })
            //             console.log('4')
                    
            
            // // })
            
      
       
           
        
        // const getDocument = async () => {
        //     try {
        //         //const coursetest = new Course({ title: 'test' });
        //         //coursetest.save()
               
        //         const result = await Course              
        //         .findOne({slug: 'test'})
        //         .then(course => {
        //             course.thumbnail.map(thumbnail => {
        //                 console.log(thumbnail.publicId)
        //             })
                   
        //         })
                
        //     } catch (error) {
        //         console.log(error)
        //     }
        // }
        // getDocument();

        Course.find({ chaptername: { $not: { $exists: true } } })
        .select('title description thumbnail slug')
        
        //3. 
        .then(courses => { //4.           
            res.render('home', { 
                courses: multiMongooseToObject(courses)
             });
        })
        .catch(error => next(error));

    }
    
    // [GET] / search
    search(req, res) {
        res.render('search');
    }
}

//export (SiteController) thì lát require nhận được nó
module.exports = new SiteController();
