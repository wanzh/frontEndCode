/**
 * LBS mSlideIMG 顺序版-自动
 * Date: 2014-5-11
 * ===================================================
 * opts.mslide 	外围容器/滑动事件对象(一个CSS选择器)
 * opts.mcontent  内容容器/滑动切换对象(一个CSS选择器) 
 * opts.index 	索引(默认0) 指定显示哪个索引的导航指示、图片项
 * opts.navclass  导航容器的类名(默认mnav)
 * opts.current  当前项的类名(默认current)
 * opts.auto	是否自动播放 默认false
 * opts.delay	自动播放间隔时间 默认5秒 自动播放时有效
 * opts.duration	动画持续时间 默认400ms
 * ===================================================
**/
;(function(){
window.mSlideIMG = function(opts){
	if(typeof opts === undefined) return;

	this.mslide = document.querySelector(opts.mslide);
	this.mcontent = document.querySelector(opts.mcontent);
	this.mcontents = this.mcontent.children;
	this.mnav = null;
	this.mnavs = [];

	this.length = this.mcontents.length;
	if(this.length < 1) return;
	if(opts.index > this.length-1) opts.index = this.length-1;
	this.index = this.oIndex = opts.index || 0;
	
	this.current = opts.current || 'current';
	this.navclass = opts.navclass || 'mnav';

	this.duration = opts.duration || 400;
	this.auto = !!opts.auto || false;
	this.auto && (this.delay = opts.delay || 5);
	this.timer = null;
	this.touch = {};

	this.init();
}
mSlideIMG.prototype = {
	init: function(opts){
		this.set();
		this.initset();
		this.bind();
	},
	initset: function(){
		this.create();
		for(var i = 0; i < this.length; i++){ 
			if(getComputedStyle(this.mcontents[i],null).position === 'absolute') this.mcontents[i].style.position = 'relative';
			if(getComputedStyle(this.mcontents[i],null).cssFloat !== 'left') this.mcontents[i].style.cssFloat = 'left';
		} 
		this.mnavs[this.index].className = this.current;
		this.mcontents[this.index].className += ' '+this.current;
		//this.mcontent.style.webkitTransform = this.mcontent.style.transform = "translateX(" + (-this.index * this.width) + "px)";
		this.mcontent.style.webkitTransform = this.mcontent.style.transform = "translate3d(" + (-this.index * this.width) + "px,0,0)";
	},
	set: function(){
		this.width =  document.documentElement.clientWidth || document.body.clientWidth;
		this.mcontent.style.width = this.length * this.width + 'px';		
		for(var i = 0; i < this.length; i++) this.mcontents[i].style.width = this.width + 'px';
		//this.mcontent.style.webkitTransform = this.mcontent.style.transform = "translateX(" + (-this.index * this.width) + "px)";
		this.mcontent.style.webkitTransform = this.mcontent.style.transform = "translate3d(" + (-this.index * this.width) + "px,0,0)";
	},
	create: function(){
		this.mnav = document.createElement('ul'), li = null, i = 0;
		for(; i < this.length; i++){
			li = document.createElement('li');
			li.innerHTML = i+1;
			this.mnavs.push(li);
			this.mnav.appendChild(li);
		}
		this.mnav.className = this.navclass;
		this.mslide.appendChild(this.mnav);
	},
	bind: function(){
		var _this = this;
		this.mslide.addEventListener("touchstart",function(e){
			_this.touchStart(e);
			_this.auto && _this.stop();
		}, false);
		this.mslide.addEventListener("touchmove",function(e){
			_this.touchMove(e);
			_this.auto && _this.stop();
		}, false);
		this.mslide.addEventListener("touchend",function(e){
			_this.touchEnd(e);
			_this.auto && _this.start();
		}, false);
		this.mslide.addEventListener("touchcancel",function(e){
			_this.touchEnd(e);
			_this.auto && _this.start();
		}, false);
		this.mcontent.addEventListener('webkitTransitionEnd',function(){
			_this.transitionEnd();
		}, false);
		window.addEventListener("resize", function(){
			setTimeout(function(){
				_this.set();
			},100);
		}, false);
		window.addEventListener("orientationchange",function(){
			setTimeout(function(){
				_this.set();
			},100);
		}, false);
		this.auto && this.start();
	},
	touchStart: function(e){
		this.touch.x = e.touches[0].pageX;
		this.touch.y = e.touches[0].pageY;
		this.touch.time = Date.now();
		this.touch.disX = 0;
		this.touch.disY = 0;
		this.touch.fixed = '';
	},
	touchMove: function(e){
		if(this.touch.fixed === 'up') return;
		e.stopPropagation();
		if(e.touches.length > 1 || e.scale && e.scale !== 1) return;
		this.touch.disX = e.touches[0].pageX - this.touch.x;
		this.touch.disY = e.touches[0].pageY - this.touch.y;
		if(this.touch.fixed === ''){
			if( Math.abs(this.touch.disY) > Math.abs(this.touch.disX) ){
				this.touch.fixed = 'up';
			}else{
				this.touch.fixed = 'left';
			}
		}
		if(this.touch.fixed === 'left'){
			e.preventDefault();
			if( (this.index === 0 && this.touch.disX > 0) || (this.index === this.length-1 && this.touch.disX < 0) ) this.touch.disX /= 4;
			//this.mcontent.style.webkitTransform = this.mcontent.style.transform = "translateX(" + ( this.touch.disX - this.index * this.width ) + "px)";
			this.mcontent.style.webkitTransform = this.mcontent.style.transform = "translate3d(" + ( this.touch.disX - this.index * this.width ) + "px,0,0)";
		} 
	},
	touchEnd: function(e){
		if(this.touch.fixed === 'left'){
			var _this = this, X = Math.abs(this.touch.disX);
			if( (Date.now() - this.touch.time > 100 && X > 10) || X > this.width/2 ){
				this.touch.time = Date.now();
				this.touch.disX > 0 ? this.index-- : this.index++;
				this.index < 0 && (this.index = 0);
				this.index > this.length - 1 && (this.index = this.length - 1);
				if(this.index !== this.oIndex) this.replace();
			}
			this.mcontent.style.webkitTransition = this.mcontent.style.transition = 'all '+ this.duration +'ms';
			//this.mcontent.style.webkitTransform = this.mcontent.style.transform = "translateX(" + (-this.index * this.width) + "px)";
			this.mcontent.style.webkitTransform = this.mcontent.style.transform = "translate3d(" + (-this.index * this.width) + "px,0,0)";
		}
	},
	transitionEnd: function(){
		this.mcontent.style.webkitTransition = this.mcontent.style.transition = 'all 0ms';
	},
	replace: function(){
		this.mnavs[this.index].className = this.current;
		this.mnavs[this.oIndex].className = '';
		this.mcontents[this.index].className += ' '+this.current;
		this.mcontents[this.oIndex].className = this.mcontents[this.oIndex].className.replace(this.current,'').trim();
		this.oIndex = this.index;
	},
	start : function(){
		if(this.length < 2) return;
		var _this = this;
		this.timer = setInterval(function(){
			_this.index++;
 			_this.index > _this.length - 1 && (_this.index = 0);
			if(_this.index !== _this.oIndex) _this.replace();
			_this.mcontent.style.webkitTransition = _this.mcontent.style.transition = 'all '+ _this.duration +'ms';
 			//_this.mcontent.style.webkitTransform = _this.mcontent.style.transform = "translateX(" + (-_this.index * _this.width) + "px)";
			_this.mcontent.style.webkitTransform = _this.mcontent.style.transform = "translate3d(" + (-_this.index * _this.width) + "px,0,0)";
		},this.delay*1000);
	},
	stop : function(){
		clearInterval(this.timer);
		this.timer = null;
 	} 
}
}());