// 라우팅 및 환경 설정
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'MainController'
        })
        .when('/publishing', {
            templateUrl: 'pages/about.html'
        })
        .when('/php-dev', {
            templateUrl: 'pages/php-dev.html',
            resolve: {
                loadMyFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        '/assets/js/php-dev-controller.js'
                    ]);
                }]
            },
            controller: 'PHPDevController'
        })
        .when('/about', {
            templateUrl: 'pages/about.html'
        })
        .otherwise({
            redirectTo: '/'
        });

    // HTML5 Mode 활성화
    $locationProvider.html5Mode(true);
}]);
