(function(window, document, undefined) {
    var cnvs = document.querySelector('#cnvs'),
        ctx = cnvs.getContext('2d'),
        home_header = document.querySelector('#home_header'),
        width, height;

    function setDimensions() {
        width = window.innerWidth;
        height = window.innerHeight;

        home_header.style.height = height + 'px';
        home_header.style.maxWidth = width + 'px';

        cnvs.width = width;
        cnvs.height = height;
    }
    setDimensions();

    function randInt(max) {
        return~~ (Math.random() * max);
    }

    function clamp(val, min, max) {
        return val < min ? min : val > max ? max : val;
    }

    var Grid = function(args) {
        this.width = args.width || null;
        this.height = args.height || null;
        this.nbX = args.nbX || ~~(args.width / args.moduleWidth) + 1;
        this.nbY = args.nbY || ~~(args.height / args.moduleHeight) + 1;
        this.moduleWidth = args.moduleWidth || ~~(args.width / args.nbX);
        this.moduleHeight = args.moduleHeight || ~~(args.height / args.nbY);

        this.width = this.moduleWidth * this.nbX;
        this.height = this.moduleHeight * this.nbY;

        this.patterns = [];
    };

    Grid.prototype.populate = function(Types) {
        this.patterns = [];
        for (var j = 0; j < this.nbY; j++) {
            var line = [];
            for (var i = 0; i < this.nbX; i++) {
                line.push(new Types[randInt(Types.length)]());
            }
            this.patterns.push(line);
        }
    };

    Grid.prototype.display = function(x, y) {
        ctx.save();
        ctx.translate(x, y);

        for (var j = 0; j < this.nbY; j++) {
            for (var i = 0; i < this.nbX; i++) {
                this.drawPattern(i, j);
            }
        }

        ctx.restore();
    };

    Grid.prototype.drawPattern = function(i, j) {
        ctx.save();
        ctx.translate(i * this.moduleWidth, j * this.moduleHeight);
        var pattern = this.patterns[j][i];
        pattern.draw(this.moduleWidth, this.moduleHeight);
        ctx.restore();
    };

    var grid = new Grid({
        width: width,
        height: height,
        moduleWidth: 50,
        moduleHeight: 50
    });

    var Pattern = function() {
        this.r = Math.random() < .5;

        this.update = function() {
            this.r = Math.random() < .5;
        };

        this.draw = function(w, h) {
            var s = 10;

            // ctx.fillStyle = '#252d36';
            ctx.fillStyle = '#FB3550';

            ctx.beginPath();
            ctx.moveTo(this.r ? -s : w + s, 0);
            ctx.lineTo(this.r ? 0 : w, -s);
            ctx.lineTo(this.r ? w + s : -s, h);
            ctx.lineTo(this.r ? w : 0, h + s);
            ctx.closePath();
            ctx.fill();
        };
    };

    grid.populate([Pattern]);

    function draw() {
        window.requestAnimationFrame(draw);
        grid.patterns[randInt(grid.nbY)][randInt(grid.nbX)].update();
        ctx.fillStyle = '#1E2630';
        ctx.fillRect(0, 0, width, height);
        grid.display((width - grid.width) / 2, (height - grid.height) / 2);
        ctx.fillStyle = 'rgba(30,38,48,0.2)';
        ctx.fillRect(0, 0, width, height);
    }
    draw();

    window.addEventListener('resize', function() {
        setDimensions();

        grid.nbX = ~~ (width / grid.moduleWidth) + 1;
        grid.width = grid.nbX * grid.moduleWidth;
        grid.nbY = ~~ (height / grid.moduleHeight) + 1;
        grid.height = grid.nbY * grid.moduleHeight;
        grid.populate([Pattern]);
    });
})(window, document, undefined);