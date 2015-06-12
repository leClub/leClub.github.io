var Metalsmith = require('metalsmith'),
    markdown   = require('metalsmith-markdown'),
    collections = require('metalsmith-collections'),
    permalinks  = require('metalsmith-permalinks'),
    templates  = require('metalsmith-templates'),
    sass = require('metalsmith-sass'),
    handlebars = require('handlebars'),
    imagemin = require('metalsmith-imagemin'),
    reverseEach = require( 'bullhorn-handlebars-helpers/src/collection/reverseEach' )( handlebars ),
    highlight  = require('highlight.js'),
    watch = require('metalsmith-watch'),
    fs = require('fs');

// templating 
handlebars.registerPartial('header', fs.readFileSync(__dirname + '/templates/partials/header.html').toString());
handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/templates/partials/footer.html').toString());

handlebars.registerHelper("checkIndex", function(index){
	var html = '';
	if( (index + 1) % 3 === 0 ) {
		html += '</div><div class="row">';
	}
	return html;
});

handlebars.registerHelper('p5events', function(collection){
	var html = '';
	var count = 1;
	for (var i = collection.length -1; i >= 0 ; i--) {
			html += '<div class="four columns">';
			html += '<a href="' + collection[i].path + '"><h4 class="p5Title">' + collection[i].title + '</a></h4>';
			html += '<img class="u-max-full-width" src="/' + collection[i].image + '">';
			html += '</div>';

			if(count % 3 === 0) html += '</div><div class="row">';
			count++;
	};
	return html
});

Metalsmith(__dirname)
    .source('src')
    .metadata({
        site: {
          title: 'le club',
          url: 'http://leclub.github.io'
        }
      })
    .use(collections({
        pages: {
            pattern: 'pages/*.md'
        },
        posts: {
            pattern: 'posts/*/*.md',
            sortBy: 'date',
            reverse: true,
            metadata: {
                name: 'Posts',
                description: 'List of posts'
            }
        },
        learn: {
            pattern: 'learn/*/*.md'
        },
        p5lyonEvents: {
            pattern: 'p5lyon/events/*.md'
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
    // .use(imagemin({
    //     optimizationLevel: 3,
    //     svgoPlugins: [{ removeViewBox: false }]
    //   }))
    .use(permalinks())
    .use(templates('handlebars'))
    .use(sass({
        outputStyle: 'compressed'
    }))
    .destination('./build')
    .build(function (err) {
        // console.log(this._metadata.collections);
        if (err) {
            throw err;
        } else {
            console.log(this);
        }
    })
