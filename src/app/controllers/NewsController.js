class NewsController {
    // [GET] / news
    index(req, res) {
        res.render('news');
    }

    // [GET] / news/ :slug (VD: news/chitiet_tintuc)
    show(req, res) {
        res.send('NEWS details');
    }
}

//export (NewsController) thì lát require nhận được nó
module.exports = new NewsController();
