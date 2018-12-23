app.emeraldHill = (function () {
	'use strict';

	var getOffsetResult,
		getOffsetResultY,
		direction,
		speedClass = '',
		jumping,
		boredClock,
		$container = $('#container');

	var getOffset = function(e) {


		var $outputEl = $('#position'),
			$offsetElem = $('#center');

		// for debug box
		$('#input-type').text(e.type);

		// determine whether mouse or touch
		if (e.type === 'touchmove') {
			var e = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
		}

		getOffsetResultY = Math.floor( ( e.pageY - ( $offsetElem.offset().top ) ) / window.innerHeight * 100 );


		$outputEl.text(
			' x ' + Math.floor( (e.pageX - ( $offsetElem.offset().left ) ) / window.innerWidth * 100 )
			+ ' y ' + getOffsetResultY
		)
       
		return Math.floor( (e.pageX - $offsetElem.offset().left ) / window.innerWidth * 100 );
	};

	var sonic = function () {

		var stopSpeed = 5,
			slowSpeed = 15,
			mediumSpeed = 28,
			fastSpeed = 35;

		$(document).on('mousemove touchmove', function(e) {

			e.preventDefault();

			// trigger jump if touch top area
			if (e.type === 'touchmove' && getOffsetResultY < -35) {
				app.emeraldHill.jump();
			}

			// reset the boredClock
			clearTimeout(boredClock);
			$container.attr('data-bored', false);

			getOffsetResult = getOffset(e);

			// determine direction
			if ( getOffsetResult < 0) {
				direction = 'left';
				$container.attr('data-direction', 'left');

			} else {
				direction = null;
				$container.attr('data-direction', '');
			}

			// do not change sonic animation mode if mid-air
			if (jumping && speedClass !== '') return;

			var getOffsetResultAbs = Math.abs( getOffsetResult );
			
			// determine speed
			if ( getOffsetResultAbs < stopSpeed) {
				// stopped
				$('#speed').text('stop');
				
				// else the standing still jump will have its class removed
				if (!jumping) {
					$container.removeClass()
				}

				// we're stationary, initiate the bored function
				bored();
				
				speedClass = '';
				
			} else if ( getOffsetResultAbs < slowSpeed ) {
				// walk slower
				$('#speed').text('slow');
				$container.attr('class', 'slow');
				speedClass = 'slow';

			} else if ( getOffsetResultAbs < mediumSpeed ) {
				// walk
				$('#speed').text('medium');
				$container.attr('class', 'medium');
				speedClass = 'medium';
				
			} else if ( getOffsetResultAbs < fastSpeed ) {
				// walk faster
				$('#speed').text('fast');
				$container.attr('class', 'fast');
				speedClass = 'fast';

			} else {
				// run
				$('#speed').text('run');
				$container.attr('class', 'run');	
				speedClass = 'run';

			}
				

	    });

		// trigger jump function

		$(document).on('mousedown', function(e) {
			// don't jump if we hit the buttons or the panels
			if (e.target.tagName !== 'DIV' ) return;

			app.emeraldHill.jump();
		});

		// shake triggers jump
		window.addEventListener('shake', function() {
			app.emeraldHill.jump();
		});

	};

	var background = function() {

		var $backgroundLayers = $('.background-wrapper');

		// initiate all background elements at 0
		var skySpd = 0,
			mntHighSpd = 0,
			mntLowSpd = 0,
			tile1spd = 0,
			tile2spd = 0,	
			tile3spd = 0,	
			tile4spd = 0,	
			tile5spd = 0,
			platformSpd = 0,	
		    scroller;

	    var setBackgroundSpeeds = function() {

	    	// do not move bg if we're below sonic animation threshold
	    	if ( Math.abs( getOffsetResult ) < 5 ) return;


	  		platformSpd -= (getOffsetResult / 10) * 1.65;
    		$('.platform-wrapper').css({
				'transform': 'translate3d(' + platformSpd + 'px,0,0)'
	  		});

	    	skySpd -= (getOffsetResult / 10) * 0.1;
    		$backgroundLayers.find('.sky-wrapper').css({
				'-webkit-transform': 'translate3d(' + skySpd + 'px,0,0)'
	  		});

	    	mntHighSpd -= (getOffsetResult / 10) * 0.3;
    		$backgroundLayers.find('.mountains').css({
				'transform': 'translate3d(' + mntHighSpd + 'px,0,0)'
	  		});

	  		mntLowSpd -= (getOffsetResult / 10) * 0.35;
    		$backgroundLayers.find('.mountains-lower').css({
				'transform': 'translate3d(' + mntLowSpd + 'px,0,0)'
	  		});

	  		tile1spd -= (getOffsetResult / 10) * 0.7;
    		$backgroundLayers.find('.tile-1').css({
				'transform': 'translate3d(' + tile1spd + 'px,0,0)'
	  		});

	  		tile2spd -= (getOffsetResult / 10) * 0.9;
    		$backgroundLayers.find('.tile-2').css({
				'transform': 'translate3d(' + tile2spd + 'px,0,0)'
	  		});

	  		tile3spd -= (getOffsetResult / 10) * 1.1;
    		$backgroundLayers.find('.tile-3').css({
				'transform': 'translate3d(' + tile3spd + 'px,0,0)'
	  		});

	  		tile4spd -= (getOffsetResult / 10) * 1.3;
    		$backgroundLayers.find('.tile-4').css({
				'transform': 'translate3d(' + tile4spd + 'px,0,0)'
	  		});
/*
	  		tile5spd -= (getOffsetResult / 10) * 1.2;

    		$backgroundLayers.find('.tile-5').css({
				'transform': 'translate3d(' + tile5spd + 'px,0,0)'
	  		});*/

	    }

	    // request animation frame loop
	    // https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/

	    var touched = false;
	    var running;

	    function animLoop( render, element ) {
	        var lastFrame = +new Date;
	        function loop( now ) {
	            // stop the loop if render returned false
	            if ( running !== false ) {
	                requestAnimationFrame( loop, element );
	                running = render( now - lastFrame );
	                lastFrame = now;
	            }
	        }
	        loop( lastFrame );
	    }


	    $(document).on('mousemove touchmove', function() {

	    	// prevent this function running on every single movement of the cursor/touch
	    	if ( touched ) return;

    	    touched = true;
	    	running = true;

	    	animLoop(function() {
	    		setBackgroundSpeeds();
	    	});

	    }).on('touchend mouseleave', function(e){

   			// reset all values
   			// if jumping, wait a sec, otherwise sonic will return to normal running state mid-air

	    	if (jumping) {
	    		setTimeout(function() {
	    			
    				speedClass = '';
    				$container.removeClass();
	    		}, 600);
	    	} else {
	    		speedClass = '';
    			$container.removeClass();
	    	}

    		touched = false;
    		running = false;
    		bored();
    		getOffsetResultY = 0;

	    });

	};

	var jump = function() {

		var jumpTime = 425,
			$sonicWrapper = $('.sonic-wrapper');

		var jumpUpAnimation = function() {


			if (jumping) return;

			// remove bored animation first
			$container.attr('data-bored', false);
			clearTimeout(boredClock);

			// trigger audio
			var sound = new Howl({
			  urls: ['audio/jump.mp3', 'audio/jump.ogg']
			}).play();

			jumping = true;

			$container.attr('class', 'jumping');

			$sonicWrapper.addClass('going-up').removeClass('going-down');

			// hold in the air before descent
			setTimeout(function() {
				jumpDownAnimation();
			}, jumpTime);

		};

		var jumpDownAnimation = function() {
			$sonicWrapper.addClass('going-down').removeClass('going-up');

			// descent time before returning to normal state
			setTimeout(function() {
				$container.attr('class', speedClass);
				$sonicWrapper.removeClass('going-down');
				jumping = false;
			}, jumpTime);
			
		};

		return {
			jump: jumpUpAnimation()
		}

	};

	var bored = function() {

		// wait 8000 ms before initiating the bored animation

		boredClock = setTimeout(function() {
			
			$container.attr('data-bored', true);
			
		}, 8000)

	};

	var music = function() {

		Howler.mute();

		var sound = new Howl({
		  urls: ['audio/music.mp3', 'audio/music.ogg'],
		  autoplay: true,
		  loop: true
		});


		var muted = true,
			$muteToggle = $('#mute-toggle');

		$muteToggle.on('click', function(e) {
			
			e.preventDefault();
			
			if (muted) {
				Howler.unmute();
				muted = false;
				$muteToggle.addClass('active');
			} else {
				Howler.mute();
				muted = true;
				$muteToggle.removeClass('active');
			}

		});

	};

	var panels = function() {

		var panelVisible = false

		// hide panels on click

		$('.panel').on('click', function() {
			$(this).hide();
			panelVisible = false;
		});

		// cheats

		console.log('Remember the level select code?');
		
		var keys 	= [],
			cheatCode  = '49,57,54,53,57,49,55',
			cheatCodeNumpad  = '97,105,102,101,105,97,103',
			comboMap = [],
			comboDown = [],
			perspective = false,
			soundRing = new Howl({
			  urls: ['audio/ring.mp3', 'audio/ring.ogg']
			});

		
		$(document).keydown(function(e) {

			keys.push( e.keyCode );

			if ( keys.toString().indexOf( cheatCode ) >= 0  || keys.toString().indexOf( cheatCodeNumpad ) >= 0 ){
				
				// trigger audio
				soundRing.play();

				//$('body').addClass('perspective');
				$('#debug').show();	
				
				// reset the code
				keys = [];

				console.log('Debug box active!')

			}


			if(!comboMap[e.keyCode]){
			    comboDown.push(e.keyCode);
			    if(comboDown[0] === 65 && comboDown[1] === 13) {

					if (perspective) {
						$('body').addClass('perspective');
						perspective = false;
						console.log('Perspective mode active!')		

						soundRing.play();


					} else {
						$('body').removeClass('perspective');
						perspective = true;
					}

					// reset the combo
			        comboMap = [];
			        comboDown = [];
			        
			    } 
			}
			comboMap[e.keyCode] = true;

		}).keyup(function(e) {
		    comboMap[e.keyCode] = false;
		    comboDown.length = 0;
		});

	};


	return {
		sonic: sonic,
		background: background,
		jump: jump,
		bored: bored,
		music: music,
		panels: panels
	};

}());