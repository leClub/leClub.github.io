(function(d,w,u){
	var canvas = d.getElementById('headerCanvas');
	var ctx = canvas.getContext('2d');
	var width = window.innerWidth;
	var height = 150;
	var nbParticles = 1500;
	var p = [];
	var X, Y, frameCount = 0;

	// Math Functions
	function random(min, max){
		return min + Math.random()*(max - min);
	}

	function int(n){
		return Math.floor(n);
	}

	function radians(n){
		return (n/180)*Math.PI;
	}

	// Particle class
	var Particle = function(_id, _x, _y) {
		this.id = _id;
		this.x = this.px = _x;
		this.y = this.py = _y;
		this.speed = random(2, 7);
		this.n = 0;
	}

	Particle.prototype.display = function() {
		this.id += 0.01;
		this.n = (p5.noise(this.id, this.x / Y, this.y / Y) - 0.5) * X;
		this.x += Math.cos(radians(this.n)) * this.speed;
		this.y += Math.sin(radians(this.n)) * this.speed;
		if (this.x < -1) this.x = this.px = width + 1;
		else if (this.x > width + 1) this.x = this.px = -1;
		if (this.y < -1) this.y = this.py = height + 1;
		else if (this.y > height + 1) this.y = this.py = -1;

		// ctx.fillRect(this.px,this.py,1,1);
		ctx.beginPath();
		ctx.moveTo(this.px, this.py);
		ctx.lineTo(this.x, this.y);
		ctx.stroke();

		this.px = this.x;
		this.py = this.y;
	}

	// Main
	var color;
	function init() {
		canvas.width = width;
		canvas.height = height;

		// ctx.fillStyle = '#111111';
		ctx.fillStyle = '#111111';
		ctx.fillRect(0, 0, width, height);

		X = int(random(50, width-50));
		Y = int(random(50, 950));

		for (var i=0; i<nbParticles; i++) p.push( new Particle(i/5000.0, Math.random()*width, Math.random()*height));
		// color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
		color = 'hsl(' + (~~( Math.random() * 360 )) + ', 80%, 50% )' ;
	}

	function animate() {
		frameCount++;
		if (frameCount % 400 == 0) {
			X = int(random(50, width-50));
			Y = int(random(50, 950));
		}

		ctx.fillStyle = 'rgba(0,0,0, 0.056)';
		ctx.strokeStyle = '#000';
		ctx.fillRect(0, 0, width, height);


		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		for (var i=0; i<nbParticles; i++) p[i].display();

		window.requestAnimationFrame(animate);
	}

	window.onresize = function(e){
		width = window.innerWidth;
		canvas.width = width;
	};

	init();
	animate();
})(document, window, undefined);
