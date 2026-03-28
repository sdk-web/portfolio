app.controller('PHPDevController', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
    $scope.posts = [];
    $scope.showWriteForm = false;
    $scope.selectedPost = null;
    $scope.showSubmitResultModal = false;
    $scope.submitResultMessage = '';
    $scope.newPost = { title: '', author: '', content: '' };
    $scope.submitting = false;
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.totalPages = 1;
    $scope.totalItems = 0;
    $scope.pageNumbers = [];

    const apiUrl = (window.location.hostname === 'portfolio.localhost' || window.location.hostname === 'localhost')
        ? 'http://api.localhost/public/index.php/board'
        : 'https://api.songdk.kro.kr/board';

    $scope.updatePageNumbers = function() {
        var startPage = Math.floor(($scope.currentPage - 1) / 10) * 10 + 1;
        var endPage = Math.min(startPage + 9, $scope.totalPages);
        var pages = [];

        for (var page = startPage; page <= endPage; page += 1) {
            pages.push(page);
        }

        $scope.pageNumbers = pages;
    };

    $scope.goToPage = function(page) {
        if (page < 1 || page > $scope.totalPages || page === $scope.currentPage) {
            return;
        }

        $scope.currentPage = page;
        $scope.fetchPosts();
    };

    $scope.prevPage = function() {
        $scope.goToPage($scope.currentPage - 1);
    };

    $scope.nextPage = function() {
        $scope.goToPage($scope.currentPage + 1);
    };

    $scope.fetchPosts = function() {
        $http.get(apiUrl, {
            params: {
                page: $scope.currentPage,
                perPage: $scope.pageSize
            }
        }).then(function(response) {
            var payload = response.data || {};
            var pagination = payload.pagination || {};

            $scope.posts = (payload.data || []).map(function(post) {
                post.id = Number(post.id);
                return post;
            });
            $scope.totalItems = Number(pagination.total || 0);
            $scope.totalPages = Math.max(1, Number(pagination.totalPages || 1));
            $scope.currentPage = Number(pagination.page || $scope.currentPage);
            $scope.pageSize = Number(pagination.perPage || 10);
            $scope.updatePageNumbers();
        });
    };

    $scope.viewPost = function(post) {
        $scope.selectedPost = post;
    };

    $scope.closeSubmitResultModal = function() {
        $scope.showSubmitResultModal = false;
        $scope.submitResultMessage = '';
    };

    $scope.submitPost = function() {
        if ($scope.submitting) return;
        $scope.submitting = true;

        $http.post(apiUrl, $scope.newPost).then(function() {
            $scope.showWriteForm = false;
            $scope.newPost = { title: '', author: '', content: '' };
            $scope.currentPage = 1;
            $scope.fetchPosts();
            $scope.submitResultMessage = '글이 등록되었습니다. AI 답변 생성도 시작됐습니다.';
            $scope.showSubmitResultModal = true;
        }).catch(function(error) {
            $scope.submitResultMessage = '글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.';
            $scope.showSubmitResultModal = true;
            console.error(error);
        }).finally(function() {
            $scope.submitting = false;
        });
    };

    var pollingTimer = $interval(function() {
        var pendingExists = $scope.posts.some(function(post) { return !post.reply; });
        if (pendingExists) {
            $scope.fetchPosts();
        }
    }, 3000);

    $scope.$on('$destroy', function() {
        if (angular.isDefined(pollingTimer)) {
            $interval.cancel(pollingTimer);
        }
    });

    $scope.fetchPosts();
}]);