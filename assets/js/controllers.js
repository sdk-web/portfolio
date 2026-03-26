// 컨트롤러 정의
app.controller('MainController', ['$scope', '$http', '$location', '$rootScope', function ($scope, $http, $location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function () {
        $scope.currentPath = $location.path();
        $scope.isHome = ($scope.currentPath === '/');
        
        if ($scope.isHome) {
            $scope.bodyClass = 'home-active';
        } else if ($scope.currentPath === '/php-dev') {
            $scope.bodyClass = 'php-dev-active';
        } else {
            $scope.bodyClass = 'sub-page-active';
        }
    });

    // 기존 API 상태 체크 로직 (필요 시 유지)
    $scope.loading = true;
    var apiUrl = 'https://api.songdk.kro.kr/systemstatus';
    if (window.location.hostname === 'portfolio.localhost' || window.location.hostname === 'localhost') {
        apiUrl = 'http://api.localhost/public/index.php/systemstatus';
    }

    $http.get(apiUrl).then(function (response) {
        $scope.apiData = response.data;
    }).finally(function() {
        $scope.loading = false;
    });
}]);
