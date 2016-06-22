var app = angular.module('starter.controllers', ['ngFileUpload', 'ionic'])

app.controller('uploadCtrl', ['$rootScope', '$scope', 'Upload', 'User', '$timeout', '$ionicLoading', '$ionicPopup', '$state', '$window', function ($rootScope, $scope, Upload, User, $timeout, $ionicLoading, $ionicPopup, $state, $window) {

  $scope.file = '';
  $scope.user = User;

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
            console.log("onload")
            console.log($scope.file );
            $scope.showConfirm(e.target.result)
         };
         reader.readAsDataURL(photofile);

     });
  }

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
       $scope.uploadPic($scope.picFile)
     } else {
       console.log('You are not sure');
     }
   });
  };

  $scope.uploadPic = function(file) {
    console.log(file)
    file.upload = Upload.upload({
      url: 'https://ivm.swel.tk/fileMgt.php',
      //url: 'http://129.41.142.82/fileMgt.php',
      data: {image: file, user: $scope.user.First + $scope.user.Last},
    });

    file.upload.then(function (response) {
      $timeout(function () {
        file.result = response.data;
        console.log(response)
        $rootScope.setData()
      });
    }, function (response) {
      if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
    }, function (evt) {
      $scope.loading = $ionicLoading.show({
        showBackdrop: false
      });
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      console.log(file.progress)
      if(file.progress == 100) {
        $ionicLoading.hide();
        file.progress = 0;
        
        //$state.go($state.current, {}, {reload: true});
        //$window.location.reload(true);
      }
    });
  }
}]);

app.controller('dashCtrl', function($rootScope, $scope, $http, $ionicModal, User, socket) {
  function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
  }
  console.log(User)
  $rootScope.setData = function(){
    $http({
      method: 'GET',
      url: './api/set'
      //url: 'https://ivm.swel.tk/fileMgt.php'
    }).then(
      function successCallback(response) {}, 
      function errorCallback(response) {}
    );
  }
  $rootScope.getData = function(){
    $http({
      method: 'GET',
      url: './api/get'
      //url: 'https://ivm.swel.tk/fileMgt.php'
    }).then(function successCallback(response) {
      $rootScope.imgSet = response.data
    }, function errorCallback(response) {});
  }
  $rootScope.setData()
  $rootScope.getData()
  setInterval($rootScope.getData, 1000)
  $scope.updated = 0;
  $scope.$watch('imgSet', function(newValue, oldValue) {
    if (newValue.length === oldValue.length) { return; }
    console.log('updated')
  });
  $scope.thumbUp = function(key, id, ele) {
    $rootScope.imgSet[key].like++
    console.log('id: ' + id)
    socket.emit('tUP', { likeIdx: id });
  }
});

app.controller('rootCtrl', function($scope, $state, $ionicModal, User) {
  $scope.user = User;
   $ionicModal.fromTemplateUrl('root.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.reg = function(item) {
    $scope.modal.show();
    $scope.item = item;
  } 
  $scope.cancel = function() {
    $scope.modal.hide();
  }  
  $scope.submit = function(user){
    $scope.modal.hide();
    $state.go('tab.seat');
  };
})

app.controller('videoCtrl', function($scope,$state) {
})

app.controller('seatCtrl', function($scope,$state, User) {

  $scope.user = User;
})

app.controller('qDetailCtrl', function($rootScope, $scope, $stateParams, $state, qSet, User, localData, Submit) {
  $scope.user = User
  $scope.isDisabled = User.submit;
  $scope.sinQ = qSet.get({qId: $stateParams.qId, data: 'choices'});
  $scope.local = localData;
  $scope.List = [
    { text: "OpenPower ", checked: false },
    { text: "FlashSystem ", checked: false },
    { text: "Spectrum Storage ", checked: false },
    { text: "Bluemix ", checked: false },
    { text: "Security ", checked: false },
    { text: "Verse ", checked: false },
    { text: "Watson Analytics ", checked: false },
    { text: "API Economy ", checked: false },
    { text: "Hybrid Cloud Transformation ", checked: false },
    { text: "None", checked: false }
  ];
  $scope.selected  = function (list) {
    var tmp =''
    for (idx in list){
      if(list[idx].checked){
        //console.log($scope.List[idx])
        tmp = tmp + list[idx].text+ ', '
      }
    }
    return tmp.substring(0, tmp.length - 2);
  }
  /*
   *    Get Ans
   */
  $scope.checkChange = function(qid, choice){
    $rootScope.Q3 = $scope.List
  }
  $scope.radioChange = function(qid,choice){
    if(qid == 0)
      $rootScope.Q1 = choice.name
    else if(qid == 1)
      $rootScope.Q2 = choice.name
    else if(qid == 3)
      $rootScope.Q4 = choice.name
    else if(qid == 4)
      $rootScope.Q5 = choice.name
  }
  $scope.changed = function(qid, choice){
    if(qid == 5)
      $rootScope.Q6 = choice
  }

  /*
   *    Manage the flow
   */
  if($stateParams.qId == 5 && User.submit == true)
    $scope.next = {type: "SUBMITTED"}
  else if($stateParams.qId == 5 && User.submit == false)
    $scope.next = {type: "Submit"}
  else if($stateParams.qId >=0 && $stateParams.qId<=2)
    $scope.next = {type: "Next"};
  $scope.nextFuc = function(qid) {
    if(qid == 5){
      User.submit = true;
      $scope.isDisabled = true;
      $scope.next.disable = true
      $scope.next.type = "Wait For Upload"

      $scope.local.Q1  = $rootScope.Q1
      $scope.local.Q2  = $rootScope.Q2
      $scope.local.Q3  = $rootScope.Q3
      $scope.local.Q4  = $rootScope.Q4
      $scope.local.Q5  = $rootScope.Q5
      $scope.local.Q6  = $rootScope.Q6
      console.log(localData)
      console.log($scope.selected($rootScope.Q3))

      var dump = Submit.postData({user: User, ans: localData})
      setTimeout(function(){ 
        $scope.next = dump
      }, 3000);
    }else if(parseInt(qid) >=0 && parseInt(qid)<=4){
      dump = parseInt(qid) + 1;
      $state.go($state.current, {qId: dump}, { reload: true });
    }
  }
    
  $scope.preFuc = function(qid) {
      if(qid != 0){
        var dumpidx = parseInt(qid) - 1;
        $state.go($state.current, {qId: dumpidx}, { reload: true });
      }
  }
})

app.controller('MediaCtrl', function($scope, $ionicModal) {
  $scope.showImages = function(ele, type, idx) {
    if(type == 'img') model_url = 'templates/model-image_popover.html';
    if(type == 'cmt') model_url = 'templates/model-comment.html';
    //console.log(ele.target.src)
    $scope.imgSrc = ele.target.src
    $scope.imgIdx = idx
    $scope.showModal(model_url);
  }
 
  $scope.showModal = function(templateUrl) {
    $ionicModal.fromTemplateUrl(templateUrl, {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  }
 
  // Close the modal
  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.modal.remove()
  };
});

app.controller('comMgt', function($rootScope, $scope, $ionicModal, User, socket) {
  $scope.postCmt = function(id){
    $rootScope.imgSet[$scope.imgIdx].comment.push($scope.newCmt)
   //console.log($rootScope.imgSet)
    socket.emit('postCmt', { imgIdx: id, cmt: $scope.newCmt});
  };
  socket.on('new', function (data) {
    $rootScope.imgSet = data.newSet
  });
});