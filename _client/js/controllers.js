/*eslint-env browser */
/*globals angular ionic*/

var app = angular.module('starter.controllers', []);

app.run(function($rootScope, $http) {

});

app.controller('userCtrl', ['$scope', function($scope){
  $scope.Par = [];
  $scope.SI = [];

  for (var i=0; i<18; i++){
    $scope.Par[i] = 1;
  }
}]);

// app.controller('uploadCtrl', ['$rootScope', '$scope', 'Upload', '$timeout', '$ionicLoading', '$ionicPopup', '$state', '$window', 'socket', function ($rootScope, $scope, Upload, $timeout, $ionicLoading, $ionicPopup, $state, $window, socket) {
//   $rootScope.getUser();
//   $scope.file = '';
//   $scope.progress = 0;

//   $scope.openFileDialog=function() {
//       console.log('fire! $scope.openFileDialog');
//       ionic.trigger('click', { target: document.getElementById('file') });
//   };

//   $scope.fileAdded = function(element) {
//      //console.log(element.files[0].name);
//      $scope.file = element.files[0].name;
//      $scope.$apply(function(scope) {
//          var photofile = element.files[0];
//          var reader = new FileReader();
//          reader.onload = function(e) {
//             // handle onload
//             console.log("onload");
//             console.log($scope.file, $rootScope.user );
//             $scope.showConfirm(e.target.result);
//          };
//          reader.readAsDataURL(photofile);

//      });
//   };

//   $scope.showConfirm = function(tgt) {
//    var confirmPopup = $ionicPopup.confirm({
//      title: 'Confirm upload',
//      template:  'Are you sure you want to upload?<hr><img id="blah" src="' +
//                 tgt + 
//                 '" alt="your image" height="100" />'
//    });

//    confirmPopup.then(function(res) {
//      if(res) {
//        console.log('You are sure');
//        console.log($scope.picFile);
//        $scope.uploadPic($scope.picFile);
//      } else {
//        console.log('You are not sure');
//      }
//      confirmPopup.close();
//    });
//   };

//   $scope.uploadPic = function(file) {
//     console.log(file);
//     file.upload = Upload.upload({
//       url: './api/img/post',
//       data: {image: file, user: $rootScope.user.name},
//     });

//     file.upload.then(function (response) {
//       $timeout(function () {
//         file.result = response.data;
//         console.log(response);
//         socket.emit('uploadImg');
//         $ionicLoading.hide();
//         if(response.data.substring(0, 7) !== 'Success'){
//           $scope.showAlert = function() {
//             $ionicPopup.alert({
//               title: 'Error',
//               template: response.data
//             });
//           };
//           $scope.showAlert();
//         }
//         //$rootScope.setData();

//       });
//     }, function (response) {
//       if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
//     }, function (evt) {
//       $scope.loading = $ionicLoading.show({
//         templateUrl:"templates/loading.html"
//       });
//       // Math.min is to fix IE which reports 200% sometimes
//       file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
//       $scope.progress = file.progress;
//       console.log(file.progress);
//       if(file.progress === 100) {
//         file.progress = 0;
//       }
//     });
//   };
// }]);

