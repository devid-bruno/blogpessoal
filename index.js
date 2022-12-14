const express = require('express');
const app = express();
const session = require('express-session')
const connection = require('./database/database');

const CategoryController = require('./categories/CategoriesController');
const ArticleController = require('./articles/ArticlesController');
const UsersController = require('./users/UsersController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require("./users/User")

app.set('view engine', 'ejs');


app.use(session({
    secret: "qualquercoisa",
    cookie: {maxAge: 30000000000}   
}))


app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

connection.authenticate().then(() => {
    console.log("Connection has been established successfully.");
}).catch((msgErr) => {
    console.log("Unable to connect to the database:", msgErr);
});

app.use("/", CategoryController);
app.use("/", ArticleController);
app.use("/", UsersController);


app.get('/', (req, res) => {
    Article.findAll({
        order:[
            ['id', 'desc']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', {articles: articles, categories: categories});
        })
    })
});

app.get("/:slug", (req, res) =>{
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render('article', {article: article, categories: categories});
            })
        }else{
            res.redirect('/');
        }
    }).catch(err => {
        res.redirect('/');
    })
})


app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render('index', {articles: category.articles, categories: categories})
            })
        }else{
            res.redirect('/');
        }
    }).catch(err => {
        res.redirect('/');
    })
})

app.listen(8080, () =>{
    console.log('Servidor rodando na porta 8080');
    
})