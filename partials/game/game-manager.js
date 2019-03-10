/**
 * Created by stasfainberg on 09/03/19.
 */
angular.module('c4GameManager', [])
.service('GameManager', function() {

        //
        // CONST
        //
        this.NONE = 0;
        this.PLAYER_1 = 1;
        this.PLAYER_2 = 2;

        this.CLICK_EVENT_TYPE = 'mousedown';
        this.MOUSE_MOVE_EVENT = 'mousemove';

        //
        // ATTRIBUTES
        //
        this.grid;
        this.gridX = 7;
        this.gridY = 6;
		
        this.player = [ {},
            {
                name : '',
                score : 0,
                reflexion : [],
                hits : 0
            },
            {
                name : '',
                score : 0,
                reflexion : [],
                hits : 0
            }
        ];

        this.currentPlayer;
        this.totalRounds = 1;
        this.rounds = 0;
        this.startTime = -1;

        //
        // METHODS
        //
        /**
         * Init the GameManager
         *
         * @param gridX Columns
         * @param gridY Lines
         */
        this.init = function(gridX, gridY, totalRounds, player1, player2) {

            this.gridX = gridX;
            this.gridY = gridY;
            this.totalRounds = totalRounds;
            this.rounds = 0;
            this.currentPlayer = Math.floor((Math.random() * 2) + 1);
            this.player[1].name = player1;
            this.player[2].name = player2;

            this.startTime = new Date().getTime();

            this.grid = new Array(gridX);
            for (var x = 0; x < gridX; x++) {
                this.grid[x] = new Array(gridY);
                for (var y = 0; y < gridY; y++) {
                    this.grid[x][y] = this.NONE;
                }
            }
        }

        this.reset = function() {

            for(var x = 0; x < this.gridX; x++) {
                for (var y = 0; y < this.gridY; y++) {
                    this.grid[x][y] = this.NONE;
                }
            }

            this.startTime = new Date().getTime();
        }

        /**
         * Switch the current player
         */
        this.switchCurrentPlayer = function() {

            // compute the reflexion time
            var hits = this.player[this.currentPlayer].hits;
            var currentTime = new Date().getTime();
            var deltaTime = currentTime - this.startTime;
            this.player[this.currentPlayer].reflexion[hits] = deltaTime;
            this.player[this.currentPlayer].hits++;

            // reset start time
            this.startTime = currentTime;

            this.currentPlayer = this.currentPlayer == this.PLAYER_1 ?
                    this.PLAYER_2 :
                    this.PLAYER_1;
        }

        /**
         * Check if someone won the round
         *
         * @return 1 if Player 1 win, 2 if Player 2 win, 0 otherwise
         */
        this.checkWinner = function() {

            var winner = this.NONE;

            if(checkAlignment(this.PLAYER_1, this.grid, this.gridX, this.gridY)) {
                this.player[1].score++;
                winner = this.PLAYER_1;
            }

            if(winner == this.NONE && checkAlignment(this.PLAYER_2, this.grid, this.gridX, this.gridY)) {
                this.player[2].score++;
                winner = this.PLAYER_2;
            }

            if(winner != this.NONE) {
                this.rounds++;
            }

            return winner;
        }

        function checkAlignment(player, grid, gridX, gridY) {

            // check horizontal alignment
            for(var y = 0; y < gridY; y++) {
                for(var x = 0; x < gridX; x++) {

                    if(grid[x + 3] != undefined) {
                        if( grid[x + 0][y] == player &&
                            grid[x + 1][y] == player &&
                            grid[x + 2][y] == player &&
                            grid[x + 3][y] == player) {
                            return player;
                        }
                    }
                }
            }

            // check vertical alignment
            for(var x = 0; x < gridX; x++) {
                for(var y = 0; y < gridY; y++) {

                    if(grid[x][y + 3] != undefined) {
                        if( grid[x][y + 0] == player &&
                            grid[x][y + 1] == player &&
                            grid[x][y + 2] == player &&
                            grid[x][y + 3] == player) {
                            return player;
                        }
                    }
                }
            }

            // check top left to bottom right diagonal (should be optimized !!)
            for(var x = 0; x < gridX; x++) {
                for (var y = 0; y < gridY; y++) {

                    if(grid[x + 3] != undefined && grid[x][y + 3] != undefined) {
                        if( grid[x + 0][y + 0] == player &&
                            grid[x + 1][y + 1] == player &&
                            grid[x + 2][y + 2] == player &&
                            grid[x + 3][y + 3] == player) {
                            return player;
                        }
                    }
                }
            }

            // check top right to bottom left diagonal (should be optimized !!)
            for(var x = gridX - 1; x >= 0; x--) {
                for (var y = 0; y < gridY; y++) {

                    if(grid[x - 3] != undefined && grid[x][y + 3] != undefined) {
                        if( grid[x - 0][y + 0] == player &&
                            grid[x - 1][y + 1] == player &&
                            grid[x - 2][y + 2] == player &&
                            grid[x - 3][y + 3] == player) {
                            return player;
                        }
                    }
                }
            }
        }

        /**
         * Check if the model if full
         * @return {boolean}
         */
        this.isFull = function() {
            for(var x = 0; x < this.gridX; x++) {
                for (var y = 0; y < this.gridY; y++) {
                    if(this.grid[x][y] == this.NONE) {
                        return false;
                    }
                }
            }

            this.rounds++;
            return true;
        }

        /**
         * TODO documentation
         *
         * @param type
         * @return {string}
         */
        this.getColor = function(type) {

            var color = "#FFFFFF";

            if(type == this.PLAYER_1) {
                color = "#FF0000";
            } else if(type == this.PLAYER_2) {
                color = "#FFFF00";
            }

            return color;
        }

        /**
         * TODO documentation
         *
         * @return {number}
         */
        this.getProgression = function() {
            return Math.floor((this.rounds / this.totalRounds) * 100);
        }

        /**
         *
         * @param deviceWidth
         * @return {double}
         */
        this.computeRatio = function(deviceWidth) {

            var ratio;

            if(deviceWidth < 992) { // Small devices (tablets, 768px and up)
                ratio = 0.5;
            } else if(deviceWidth >= 992 && deviceWidth < 1200) { // Medium devices (desktops, 992px and up)
                ratio = 0.75;
            } else if(deviceWidth > 1200) { // Large devices (large desktops, 1200px and up)
                ratio = 1;
            }

            return ratio;
        }
});