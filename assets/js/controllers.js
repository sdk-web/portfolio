// 컨트롤러 정의
app.controller('MainController', ['$scope', '$http', '$location', '$rootScope', '$interval', function ($scope, $http, $location, $rootScope, $interval) {
    $scope.currentPath = $location.path();
    $scope.isHome = ($scope.currentPath === '/');
    $scope.showArchiveModal = false;
    $scope.archiveIndex = 0;
    $scope.imgSrc = '/assets/img/';
    $scope.archivedProjects = [
        { title: '스쿨룩스', image: 'schoolooks.jpg' },
        { title: '아로마티카', image: 'aromatica.jpg' },
        { title: '디케이락', image: 'dklok.png' },
        { title: 'LNG Korea', image: 'lng.jpg' },
        { title: '극지연구소', image: 'kopri.jpg' },
        { title: '민주연구원', image: 'minju.jpg' },
        { title: '엠닥터', image: 'mdoctor.jpg' },
        { title: '청구경희한의원', image: 'chungu.jpg' },
        { title: '인천수협산업협동조합', image: 'suhyup.jpg' },
        { title: '오성체육산업', image: 'osung.jpg' },
        { title: '답게살겠습니다', image: 'dapgyep.jpg' },
        { title: '대명리조트 이야기', image: 'daemyung.jpg' },
        { title: '2017바둑대축제', image: 'bardook.jpg' },
        { title: '스마트핸드레일', image: 'smarthand.jpg' },
        { title: '푸드이미지', image: 'foodimage.jpg' },
        { title: '헤가', image: 'heaga.jpg' },
        { title: '해주로지스', image: 'haejoo.jpg' },
        { title: '대한환경', image: 'daehan.jpg' },
        { title: '스마트워킹', image: '' },
        { title: '마린플라자', image: 'mp.jpg' }
    ];
    $scope.archivePreviewProjects = $scope.archivedProjects.slice(0, 3);

    var archiveTimer;

    function stopArchiveAutoSlide() {
        if (angular.isDefined(archiveTimer)) {
            $interval.cancel(archiveTimer);
            archiveTimer = undefined;
        }
    }

    function startArchiveAutoSlide() {
        stopArchiveAutoSlide();
        archiveTimer = $interval(function () {
            if ($scope.showArchiveModal && $scope.archivedProjects.length > 1) {
                $scope.archiveIndex = ($scope.archiveIndex + 1) % $scope.archivedProjects.length;
            }
        }, 4500);
    }

    $scope.openArchiveModal = function (startIndex) {
        $scope.archiveIndex = angular.isNumber(startIndex) ? startIndex : 0;
        $scope.showArchiveModal = true;
        // startArchiveAutoSlide();
    };

    $scope.closeArchiveModal = function () {
        $scope.showArchiveModal = false;
        stopArchiveAutoSlide();
    };

    $scope.prevArchiveSlide = function () {
        $scope.archiveIndex = ($scope.archiveIndex - 1 + $scope.archivedProjects.length) % $scope.archivedProjects.length;
    };

    $scope.nextArchiveSlide = function () {
        $scope.archiveIndex = ($scope.archiveIndex + 1) % $scope.archivedProjects.length;
    };

    $scope.goToArchiveSlide = function (index) {
        $scope.archiveIndex = index;
    };

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

    $scope.$on('$destroy', function () {
        stopArchiveAutoSlide();
    });
}]);
