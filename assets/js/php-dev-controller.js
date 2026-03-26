app.controller('PHPDevController', ['$scope', '$http', function ($scope, $http) {
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
            $scope.fetchPosts(); // 목록 갱신
            alert('글이 등록되었습니다. AI 답변이 생성되었습니다.');
        }).catch(function(error) {
            alert('등록에 실패했습니다.');
            console.error(error);
        }).finally(function() {
            $scope.submitting = false;
        });
    };

    // 초기 로드
    $scope.fetchPosts();
}]);
