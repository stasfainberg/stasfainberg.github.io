/**
 * Created by stasfainberg on 09/03/19.
 */
c4Controllers.controller('GameCtrl', ['$scope', '$routeParams', '$interval', '$window', '$location', 'GameManager', 'UiService',
function ($scope, $routeParams, $interval, $window, $location, GameManager, UiService) {

    //
    // INIT SECTION
    //

    // init GameManager from the route params
    GameManager.init($routeParams.gridX, $routeParams.gridY, $routeParams.nbRounds, $routeParams.player1, $routeParams.player2);

    var isAnimating = false;
    var currentToken;
    var ratio = GameManager.computeRatio($window.innerWidth);
    var w = GameManager.gridX * ratio * 100;
    var h = GameManager.gridY * ratio * 100;

    // initialize canvas
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    canvas.width = w;
    canvas.height = h;
    context.globalAlpha = 1.0;

    // initialize rendering loop (100 fps)
    $interval(animate, 50);

    var gapInPercent = 15;
    var diam = canvas.width / GameManager.gridX;
    var gap = diam/2 * (gapInPercent / 100);
    var radius = diam / 2 - gap;
    var cursorPosition, showMouse;

    var drawContext = {
        context : context,
        canvas : canvas,
        grid : GameManager.grid,
        gridX : GameManager.gridX,
        gridY : GameManager.gridY,
        width: w,
        height: h
    };

    //
    // INIT CALLBACK
    //
    canvas.addEventListener(GameManager.CLICK_EVENT_TYPE, onClick, false);
    canvas.addEventListener(GameManager.MOUSE_MOVE_EVENT, onMouseMove, false);
    canvas.addEventListener('mouseenter', function() { showMouse = true; }, false);
    canvas.addEventListener('mouseleave', function() { showMouse = false; }, false);

    //
    // INIT SCOPE
    //
    $scope.player1 = { score: 0, pseudo: $routeParams.player1 };
    $scope.player2 = { score: 0, pseudo: $routeParams.player2 };
    $scope.progessBarWidth = 'width: ' + w + 'px';
    $scope.progess = GameManager.getProgression();
    $scope.progessStyle = 'width: ' + $scope.progess + '%;';

    //
    // ON CLICK CALLBACK
    //
    function onClick(evt) {

        if(!isAnimating) {
            startAnimation(evt.clientX);
        }
    }

    function onMouseMove(evt) {

        if(cursorPosition == undefined) {
            cursorPosition = [];
        }

        var rect = canvas.getBoundingClientRect();

        cursorPosition[0] = evt.clientX - rect.left;
        cursorPosition[1] = evt.clientY - rect.top;
    }

    function startAnimation(clickX) {

        var rect = canvas.getBoundingClientRect();
        var x = Math.floor((clickX - rect.left) / (ratio * 100));
        var y = 0; // in all cases, animation starts by the top of the grid

        if(GameManager.grid[x][y] == GameManager.NONE) {
            currentToken = { x : x, y : y };
            isAnimating = true;
        }
    }

    //
    // RENDERING LOOP
    //
    function animate() {

        context.clearRect(0, 0, canvas.width, canvas.height);

        // first, draw the grid
        context.beginPath();
        context.fillStyle = "#0000ff";
        context.fillRect(0, 0, drawContext.width, drawContext.height);

        // draw tokens
        drawTokens(drawContext, gap, radius, diam);

        if(isAnimating) {
            renderAnimation();
        } else if(!isAnimating && showMouse) {
            drawCursor(drawContext, cursorPosition);
        }
    }

    function renderAnimation() {

        if((currentToken.y - 1) >= 0) {
            GameManager.grid[currentToken.x][currentToken.y - 1] = GameManager.NONE;
        }

        GameManager.grid[currentToken.x][currentToken.y] = GameManager.currentPlayer;

        if((currentToken.y + 1) < GameManager.gridY && GameManager.grid[currentToken.x][currentToken.y + 1] == GameManager.NONE) {
            currentToken.y++;
        } else {
            isAnimating = false;
            progessGame();
        }
    }

    function drawTokens(drawContext, gap, radius, diam) {

        for(var x = 0; x < drawContext.gridX; x++) {
            for(var y = 0; y < drawContext.gridY; y++) {

                var type = drawContext.grid[x][y];
                var xPos = gap + radius + (x * diam);
                var yPos = gap + radius + (y * diam);

                drawToken(drawContext, GameManager.getColor(type), xPos, yPos);
            }
        }
    }

    function drawToken(drawContext, color, x, y) {

        drawContext.context.beginPath();
        drawContext.context.fillStyle = color;
        drawContext.context.arc(x, y, radius, 0, (2 * Math.PI), false);
        drawContext.context.fill();
    }

    function drawCursor(drawContext, cursorPosition) {

        if(cursorPosition != undefined) {
            drawContext.context.beginPath();
            drawContext.context.fillStyle = GameManager.getColor(GameManager.currentPlayer);
            drawContext.context.arc(cursorPosition[0], cursorPosition[1], radius, 0, (2 * Math.PI), false);
            drawContext.context.fill();
        }
    }

    //
    // PROGRESS GAME
    //
	
    function progessGame() {

        if(GameManager.isFull() || GameManager.checkWinner()) {

            GameManager.reset();
            $scope.progess = GameManager.getProgression();
            $scope.progessStyle = 'width: ' + $scope.progess + '%;';
            $scope.player1.score = GameManager.player[1].score;
            $scope.player2.score = GameManager.player[2].score;

            if(GameManager.getProgression() >= 100) {

                $location.path(
                    UiService.buildRouteWithParams('final')
                );
            }
        }

        GameManager.switchCurrentPlayer();
    }
	
}]);