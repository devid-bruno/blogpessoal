const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category');

const Article = connection.define('article', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Category.hasMany(Article); // RELACIONAMENTO 1 P/ MUITOS
Article.belongsTo(Category); // RELACIONAMENTO ENTRE ARTIGOS E CATEGORIAS (1 PARA 1)


module.exports = Article;