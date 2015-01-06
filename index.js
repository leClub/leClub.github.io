var Metalsmith = require('metalsmith'),
    markdown   = require('metalsmith-markdown'),
    collections = require('metalsmith-collections'),
    permalinks  = require('metalsmith-permalinks'),
    templates  = require('metalsmith-templates'),
    sass = require('metalsmith-sass'),
    handlebars = require('handlebars'),
    highlight  = require('highlight.js'),
    fs = require('fs');

handlebars.registerPartial('header', fs.readFileSync(__dirname + '/templates/partials/header.html').toString());
handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/templates/partials/footer.html').toString());

Metalsmith(__dirname)
    .source('src')
    .use(collections({
        pages: {
            pattern: 'pages/*.md'
        },
        posts: {
            pattern: 'posts/*.md',
            sortBy: 'date',
            reverse: true
        },
        p5lyon: {
            pattern: 'p5lyon/*.md'
        }
    }))
    .use(markdown({
        gfm: false,
        tables: true,
        sanitize : false,
        highlight: function (code, lang) {
            if (!lang) {
                return code;
            }
            try {
                return highlight.highlight(lang, code).value;
            } catch (e) {
                return code;
            }
        }
    }))
    .use(permalinks())
    .use(templates('handlebars'))
    .use(sass({
        outputStyle: 'compressed'
    }))
    .destination('./build')
    .build(function (err) {
        console.log(this._metadata.collections);
        if (err) {
            throw err;
        } else {
            console.log(this);
        }
    })
