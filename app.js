/**
 * Created by stasfainberg on 09/03/19.
 */
var connect4App = angular.module('connect4App', [
    'ngRoute',
    // Connect 4 modules
    'c4Controllers',
    'c4Utils',
    'c4GameManager'
]);

connect4App.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/start', {
                templateUrl: 'partials/start/start-view.html',
                controller: 'StartCtrl'
            }).
            when('/game/:player1/:player2/:nbRounds/:gridX/:gridY', {
                templateUrl: 'partials/game/game-view.html',
                controller: 'GameCtrl'
            }).
            when('/final', {
                templateUrl: 'partials/final/final-view.html',
                controller: 'FinalCtrl'
            }).
            otherwise({
                redirectTo: '/start'
            });
    }]
);