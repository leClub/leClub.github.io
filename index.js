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
    // .source('src')
    .use(collections({
        pages: {
            pattern: 'src/pages/*.md'
        },
        posts: {
            pattern: 'src/posts/*.md',
            sortBy: 'date',
            reverse: true
        }
    }))
    .use(permalinks({
        pattern: ':collection/:title'
    }))
    .use(sass({
        outputStyle: 'compact'
    }))
    .use(markdown({
        gfm: true,
        tables: true,
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
    .use(templates('handlebars'))
    .destination('./build')
    .build(function (err) {
        if (err) {
          throw err;
      }
  })
