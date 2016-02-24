/*eslint-env browser */
/*globals angular ionic*/

var app = angular.module('starter.controllers', ['ngFileUpload', 'ionic', 'ionic-modal-select']);

app.run(function($rootScope, $http, $ionicLoading, User, qSet) {
  qSet.query(function(response){ 
    $rootScope.allQ = response;
  });
  $rootScope.getList = function(){
    $ionicLoading.show({
        template: 'loading'
    });  
    $http({
      method: 'GET',
      url: './panel/get'
    }).then(function successCallback(response) {
      console.log(response);
      $rootScope.list = response.data;
      var companyList = [];


      for (var i = 0; i < $rootScope.list.length; i++) {
        if($rootScope.list[i].company === $rootScope.user.Com){
          //console.log($rootScope.list[i])
          if($rootScope.user.First + ' ' + $rootScope.user.Last === $rootScope.list[i].name){
            console.log('FOUND ' + $rootScope.list[i]);
            $rootScope.user.seat = $rootScope.list[i].seat;
            localStorage.setItem("user", JSON.stringify($rootScope.user));
            $http.put('/listput', $rootScope.user).then(
              function successCallback(response) {}, 
              function errorCallback(response) {}
            );
            break;
          }
        }
      }


      $ionicLoading.hide();
    }, function errorCallback(response) {});
  };
  $rootScope.getUser = function(newUser){
    if(localStorage.getItem("user") === null || newUser){
      $rootScope.user = User;
      if(typeof(Storage) !== "undefined") {
        localStorage.setItem("user", JSON.stringify($rootScope.user));
      } else {
        console.log("Sorry! No Web Storage support..");
      }
    }else{
      User = JSON.parse(localStorage.getItem("user"));
      $rootScope.user = User;
    }
    
    if($rootScope.user.seat === null){
      console.log($rootScope.user);
      $rootScope.getList();
    }
    //console.log($rootScope.list)
  };
});

app.controller('uploadCtrl', ['$rootScope', '$scope', 'Upload', '$timeout', '$ionicLoading', '$ionicPopup', '$state', '$window', function ($rootScope, $scope, Upload, $timeout, $ionicLoading, $ionicPopup, $state, $window) {
  $rootScope.getUser();
  $scope.file = '';
  $scope.progress = 0;

  $scope.openFileDialog=function() {
      console.log('fire! $scope.openFileDialog()');
      ionic.trigger('click', { target: document.getElementById('file') });
  };

  $scope.fileAdded = function(element) {
     //console.log(element.files[0].name);
     $scope.file = element.files[0].name;
     $scope.$apply(function(scope) {
         var photofile = element.files[0];
         var reader = new FileReader();
         reader.onload = function(e) {
            // handle onload
            console.log("onload");
            console.log($scope.file );
            $scope.showConfirm(e.target.result);
         };
         reader.readAsDataURL(photofile);

     });
  };

  $scope.showConfirm = function(tgt) {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Confirm upload',
     template:  'Are you sure you want to upload?<hr><img id="blah" src="' +
                tgt + 
                '" alt="your image" height="100" />'
   });

   confirmPopup.then(function(res) {
     if(res) {
       console.log('You are sure');
       console.log($scope.picFile);
       $scope.uploadPic($scope.picFile);
     } else {
       console.log('You are not sure');
     }
     confirmPopup.close();
   });
  };

  $scope.uploadPic = function(file) {
    console.log(file);
    file.upload = Upload.upload({
      url: '//lvm.swel.tk/api/imgMgt/fileMgt.php',
      data: {image: file, user: $rootScope.user.First + ' ' + $rootScope.user.Last},
    });

    file.upload.then(function (response) {
      $timeout(function () {
        file.result = response.data;
        console.log(response);
        $ionicLoading.hide();
        if(response.data.substring(0, 7) !== 'Success'){
          $scope.showAlert = function() {
            $ionicPopup.alert({
              title: 'Error',
              template: response.data
            });
          };
          $scope.showAlert();
        }
        $rootScope.setData();

      });
    }, function (response) {
      if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
    }, function (evt) {
      $scope.loading = $ionicLoading.show({
      templateUrl:"templates/loading.html"
    });
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      $scope.progress = file.progress;
      console.log(file.progress);
      if(file.progress === 100) {
        file.progress = 0;
      }
    });
  };
}]);

app.controller('dashCtrl', function($rootScope, $scope, $http, $ionicModal, socket) {


  $scope.noMoreItemsAvailable = false;
  $scope.loadMore = function() {
    $scope.items.push({ id: $scope.items.length});
   
    if ( $scope.items.length == 20 ) {
      $scope.noMoreItemsAvailable = true;
    }
    $scope.$broadcast('scroll.infiniteScrollComplete');
    console.log($scope.items.length)
  };
  $scope.items = [];





  console.log($rootScope.user);
  function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    };
  }
  //console.log(User)
  $rootScope.setData = function(){
    $http({
      method: 'GET',
      url: './api/set'
    }).then(
      function successCallback(response) {}, 
      function errorCallback(response) {}
    );
  };
  $rootScope.getData = function(){
    //$rootScope.setData();
    $http({
      method: 'GET',
      url: './api/get'
    }).then(function successCallback(response) {
      $rootScope.imgSet = response.data;
    }, function errorCallback(response) {});
  };
  $rootScope.setData()
  $rootScope.getData();
  setInterval($rootScope.getData, 3000);

  $scope.updated = 0;
  $scope.$watch('imgSet', function(newValue, oldValue) {
    if(typeof oldValue === 'undefined') { return; }
    if (newValue.length === oldValue.length) { return; }
    console.log('updated');
  });
  $scope.thumbUp = function(key, id, ele) {
    $rootScope.imgSet[key].like++;
    console.log('id: ' + id);
    socket.emit('tUP', { likeIdx: id });
  };
});

app.controller('rootCtrl', function($rootScope, $scope, $state, $ionicModal,$http , User) {
  $scope.selectables = [ 
  'Cloud',
  'Watson',
  'Social'
  ];
  
  $rootScope.user = User;
  $ionicModal.fromTemplateUrl('root.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.reg = function() {
    $scope.modal.show();
  }; 
  $scope.cancel = function() {
    $scope.modal.hide();
  };  
  $scope.submit = function(user){
    $rootScope.getUser(true);
    $scope.modal.hide();
    $state.go('tab.seat');
  };
});

app.controller('videoCtrl', function($rootScope, $scope,$state, $sce) {
  $scope.youtube = [
  { id: '2h90zluU-LE', ftwo: 'to the Cognitive Era', fone: 'IBM Welcomes You', link: '//www.youtube.com/embed/2h90zluU-LE'},
  { id: 'QL1dQuK5Wsg', ftwo: null,fone: 'IBM THINK', link: '//www.youtube.com/embed/QL1dQuK5Wsg'},
  { id: 'Sqf2rCR2R_U', ftwo: null,fone: 'IBM Hong Kong Verse Micro Movie', link: '//www.youtube.com/embed/Sqf2rCR2R_U'},
    ];

  $scope.ustream = [
  {id:"81484714", ftwo: 'to the Cognitive Era',fone: 'IBM Welcomes You', link: 'https://www.ustream.tv/embed/recorded/81484714'},
  {id:"81484715", ftwo: null,fone: 'IBM THINK', link: '//www.ustream.tv/embed/recorded/81484715'},
  {id:"81484716", ftwo: null,fone: 'IBM Hong Kong Verse Micro Movie', link: '//www.ustream.tv/embed/recorded/81484716'},
    ];

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  };

  $scope.popVideo = function(src) {
    console.log(src);
  };
});

app.controller('seatCtrl', function($rootScope, $scope,$state, User) {

  $rootScope.getUser();
});

app.controller('qDetailCtrl', function($rootScope, $scope, $stateParams, $state, User, qSet, localData, Submit) {
  var finishQuery = false;
  $rootScope.ans = []
  $rootScope.getUser();
  $scope.isDisabled = $rootScope.user.submit;

  localData = JSON.parse(localStorage.getItem("ans"));

  for (var i = $rootScope.allQ.length - 1; i >= 0; i--) {
    $rootScope.ans.push({i, i})
    $rootScope.allQ[i].list = [];
    if($rootScope.allQ[i].choices.length == 1){
      for (var j = $rootScope.allQ[i].choices[0].length - 1; j >= 0; j--) {
        $rootScope.allQ[i].list.push({ text: $rootScope.allQ[i].choices[0][j], checked: false })
      }
    }
  };
  $scope.local = localData;
  console.log($scope.local)
  $scope.valid = true;
  $scope.selected  = function (list, choice) {
    if(list){
      var tmp ='';
      for (idx in choice){
        if(choice[idx].checked)
          tmp = tmp + choice[idx].text+ ', ';
      }
      return tmp.substring(0, tmp.length - 2);
    }
  };

  $scope.checkChange = function(qid, choice){
    choice = $rootScope.allQ[qid].list
    $rootScope.ans[qid] = {qid, list: true, choice}
  };
  $scope.changed = function(qid,choice){
    $rootScope.ans[qid] = {qid, list: false, choice}
    console.log($rootScope.ans)
  };

  if($rootScope.user.submit === true)
    $scope.next = {type: "SUBMITTED"};
  else if($rootScope.user.submit === false)
    $scope.next = {type: "Submit"};

  $scope.nextFuc = function(qid) {
    $scope.valid = true;
    for (var i = $rootScope.ans.length - 1; i >= 0; i--) {
      if( $rootScope.ans[i] === '')
        $scope.valid = false;
    };
    console.log( $scope.valid);
    if($scope.valid){
      $rootScope.user.submit = true;
      $scope.isDisabled = true;
      $scope.next.disable = true;
      $scope.next.type = "Wait For Upload";
      $scope.local = $rootScope.ans
      console.log($scope.selected($rootScope.Q3));
      localStorage.setItem("user", JSON.stringify($rootScope.user));
      localStorage.setItem("ans", JSON.stringify($scope.local));
      var dump = Submit.postData({user: $rootScope.user, ans: $scope.local});
      setTimeout(function(){ 
        $scope.next = dump;
      }, 3000);
    }else if(parseInt(qid) >=0 && parseInt(qid)<=4){
      dump = parseInt(qid) + 1;
      $state.go($state.current, {qId: dump}, { reload: true });
    }
  };
});

app.controller('MediaCtrl', function($rootScope, $scope, $ionicModal) {
  $scope.showImages = function(ele, type, idx) {
    if(type === 'img') model_url = 'templates/model-image_popover.html';
    if(type === 'vid') model_url = 'templates/model-video_popover.html';
    if(type === 'cmt') model_url = 'templates/model-comment.html';
    //console.log(ele.target.src)
    $scope.imgSrc = ele.target.src;
    $scope.imgIdx = idx;
    $scope.vidSrc = idx;
    $scope.showModal(model_url);
  };
 
  $scope.showModal = function(templateUrl) {
    $ionicModal.fromTemplateUrl(templateUrl, {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  };
 
  // Close the modal
  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.modal.remove();
  };
});

app.controller('comMgt', function($rootScope, $scope, $ionicModal, User, socket) {
  $scope.postCmt = function(id){
    $rootScope.imgSet[$scope.imgIdx].comment.push($scope.newCmt);
   //console.log($rootScope.imgSet)
    socket.emit('postCmt', { imgIdx: id, cmt: $scope.newCmt});
  };
  socket.on('new', function (data) {
    $rootScope.imgSet = data.newSet;
  });
});