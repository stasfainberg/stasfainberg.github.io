/**
 * Created by stasfainberg on 09/03/19.
 */

c4Controllers.controller('StartCtrl', ['$scope', '$location', '$http', 'UiService',
    function ($scope, $location, $http, UiService) {
        $scope.player1 = UiService.newField('', UiService.NOT_EMPTY);
        $scope.player2 = UiService.newField('', UiService.NOT_EMPTY);

        $scope.nbRounds = UiService.newField(1, function() {
            return this.value > 0;
        });

        $scope.gridX = UiService.newField(7, function() {
            return this.value > 1;
        });

        $scope.gridY = UiService.newField(6, function() {
            return this.value > 1;
        });

        $http.get('defaults.json')
            .then(function(res){

                var def = res.data;

                $scope.nbRounds.value = def.ROUND;
                $scope.gridX.value = def.GRID_X;
                $scope.gridY.value = def.GRID_Y;
            });

        $scope.start = function() {

            if(UiService.checkErrors([$scope.player1, $scope.player2, $scope.nbRounds, $scope.gridX, $scope.gridY])) {
                $location.path(UiService.buildRouteWithParams('game', [
                    $scope.player1.value,
                    $scope.player2.value,
                    $scope.nbRounds.value,
                    $scope.gridX.value,
                    $scope.gridY.value
                ]));
            }
        }
    }]
);