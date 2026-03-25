// 컨트롤러 정의
app.controller('MainController', ['$scope', '$http', function ($scope, $http) {
    $scope.loading = true;
    $scope.apiData = null;
    $scope.error = null;

    var apiUrl = 'https://api.songdk.kro.kr/systemstatus';

    if (window.location.hostname === 'portfolio.localhost' || window.location.hostname === 'localhost') {
        apiUrl = 'http://api.localhost/public/index.php/systemstatus';
    }

    $http.get(apiUrl, {
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(function (response) {
            $scope.apiData = response.data;
            $scope.loading = false;
        })
        .catch(function (error) {
            if (error.status === -1) {
                $scope.error = '네트워크 오류 발생. CORS 정책에 의해 차단되었거나 API 서버(' + apiUrl + ')가 실행 중이지 않습니다.';
            } else {
                $scope.error = 'API 호출 실패: ' + (error.data ? (error.data.message || angular.toJson(error.data)) : error.statusText);
            }
            $scope.loading = false;
        });
}]);
