$(document).ready(function(){

	// Set game global variables 
	var	game = {
		started: true,
		restarted: false,
		loaded: false
	},
	cell = {
			board: $('ul.board'),
			item: $('ul.board > a'),
			noneMineCount : 0,
			mineCount : 3,
			minesFound: 0
	},
	backdrop = $(".backdrop"),
	overlay = $(".game_over_overlay"),
	hitval = $("#hits").val(),
	max_time = 5,
	intVal;

	// main game loop
	var miner = {
		init:function(){
			/** Start Game
			 *  call game methods
			*/
			miner.loadGame();
			// draw board and place mines
			miner.drawBoard();
			miner.findMine();
		},
		drawBoard:function(){
				game.restarted = false;
				game.started = true;
				// draw new board
				for (var i = 1; i <= 25; i++) {
					cell.board.append("<a href = '#' id = '"+i+"'><li></li></a>");
					// randomly place mines
					if( (Math.floor(Math.random()*(i/2))) ){
						$('ul.board > a#'+i+'').addClass("tile-mine");
					}
					else{
						$('ul.board > a#'+i+'').addClass("tile-no-mine");
					}
				}
		},
		findMine:function(){
			//when a cell is clicked
			$('ul.board > a').click(function(e){
				e.preventDefault();

				var boxId = $(this).attr("id"), 
				boxClass = $('ul.board > a#'+boxId+'').attr("class"),
				box = $('ul.board > a#'+boxId+' > li'),
				nextBoxId = Math.abs(boxId+1),
				prevBoxId = Math.abs(boxId-1),
				afterNextBoxId = Math.abs(nextBoxId+1),
				befPrevBoxId = Math.abs(prevBoxId-1);
				box.css("box-shadow","inset 0px 2px 20px #999");

				// display mines and non-mines
				if (boxClass == "tile-no-mine") {
					box.css("background","#2ecc71");
					cell.noneMineCount++;
					console.log("no mine on cell "+boxId+"");
				}else if((boxClass == "tile-mine") && (box.attr("class") !== "hasMine")){
					box.addClass("hasMine");
					console.log("got a mine on cell "+boxId+"");
					// check no. of mines found
					if((($('ul.board > a#'+nextBoxId+' > li').attr("class") == "hasMine") || ($('ul.board > a#'+afterNextBoxId+' > li').attr("class") == "hasMine")) || (($('ul.board > a#'+prevBoxId+' > li').attr("class") == "hasMine") || ($('ul.board > a#'+befPrevBoxId+' > li').attr("class") == "hasMine"))){ 
						cell.minesFound++;
					}
					// for debugging purposes
					console.log(cell.minesFound);
				}
				// its game over if
				if (cell.minesFound >= cell.mineCount ) {miner.gameOver();}

			});			
		},
		gameOver:function(){
			// show hidden mines
			for( var i = 1;i <= 25;i++){
				if ( $('ul.board > a#'+i+'').attr("class") == "tile-mine"){
					$('ul.board > a#'+i+'').css("background","#f22613");
				}
			}
			// display Game Over message
			overlay.show().fadeIn(1000);
			overlay.html("");
			overlay.html("<h1>GAME OVER!</h1><br><h3>Score: "+cell.noneMineCount+"</h3><br><button type = 'button' id = 'restart' class = 'btn btn-success'><i class = 'icon-refresh icon-white'></i>&nbsp;Restart</button");

			miner.restart();
		},
		restart:function(){
			// restart game
			$("#restart").click(function(e){
				e.preventDefault();
				game.restarted = true;
				// reset mines count
				cell.minesFound = 0;
				cell.noneMineCount = 0;
				miner.clearBoard();
				// redraw board
				miner.init();
			});
		},
		clearBoard:function(){
			// remove all board items
			for(var i = 1;i <= 25; i++){
				$("ul.board > a#"+i+"").remove();
				$('ul.board > a#'+i+' > li').remove();
			}
		
		},
		loadGame:function(){
			// remove game over overlay
			overlay.hide().fadeOut();
			// display countdown
			function displaySeconds(){
				if( (max_time > 0) && (max_time <= 5) ) {max_time--;}
				backdrop.show().fadeIn();
				backdrop.html("<h1>"+max_time+"</h1><br><center><img src = 'assets/loader.gif'></center>");
				if (max_time == 1) {backdrop.html("");backdrop.html("<h1>START</h1>");};
				if (max_time == 0) {
					game.loaded = true;
					clearInterval(intVal);
					backdrop.hide().fadeOut();
				}
			}
			intVal = setInterval(displaySeconds,1000);
		}
	}
	
	// start game
	miner.init();
		
});