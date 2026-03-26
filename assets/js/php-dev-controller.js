app.controller('PHPDevController', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
    $scope.posts = [];
    $scope.showWriteForm = false;
    $scope.selectedPost = null;
    $scope.newPost = { title: '', author: '', content: '' };
    $scope.submitting = false;

    const apiUrl = (window.location.hostname === 'portfolio.localhost' || window.location.hostname === 'localhost') 
        ? 'http://api.localhost/public/index.php/board' 
        : 'https://api.songdk.kro.kr/board';

    // 게시글 목록 조회
    $scope.fetchPosts = function() {
        $http.get(apiUrl).then(function(response) {
            $scope.posts = response.data;
        });
    };

    // 상세 보기
    $scope.viewPost = function(post) {
        $scope.selectedPost = post;
    };

    // 게시글 작성
    $scope.submitPost = function() {
        if ($scope.submitting) return;
        $scope.submitting = true;

        $http.post(apiUrl, $scope.newPost).then(function(response) {
            $scope.showWriteForm = false;
            $scope.newPost = { title: '', author: '', content: '' };
            $scope.fetchPosts(); 
            alert('글이 등록되었습니다. 서버에서 AI 답글을 생성하고 있습니다!');
        }).catch(function(error) {
            alert('등록에 실패했습니다.');
            console.error(error);
        }).finally(function() {
            $scope.submitting = false;
        });
    };

    // 주기적으로 답변 상태 체크 (폴링)
    var pollingTimer = $interval(function() {
        // 답변 대기 중인 글이 하나라도 있다면 리프레시
        var pendingExists = $scope.posts.some(function(p) { return !p.reply; });
        if (pendingExists) {
            $scope.fetchPosts();
        }
    }, 3000); // 3초 간격

    $scope.$on('$destroy', function() {
        if (angular.isDefined(pollingTimer)) {
            $interval.cancel(pollingTimer);
        }
    });

    // 초기 로드
    $scope.fetchPosts();
}]);
