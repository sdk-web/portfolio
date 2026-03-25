// AngularJS 모듈 정의
var app = angular.module('portfolioApp', ['ngRoute', 'oc.lazyLoad']);

// 동적으로 컨트롤러가 등록될 수 있도록 $controllerProvider를 노출
app.config(['$controllerProvider', function($controllerProvider) {
    app.controller = $controllerProvider.register;
}]);