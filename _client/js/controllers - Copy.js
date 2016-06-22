/*eslint-env browser */
/*globals angular ionic*/

var app = angular.module('starter.controllers', ['ngFileUpload', 'ionic', 'ionic-modal-select', 'ngMaterial', 'ngMessages']);

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
      url: './api/users/'+$rootScope.user.uid
    }).then(function successCallback(response) {
      $rootScope.cloudUser = response.data;
      $rootScope.user.seat = $rootScope.cloudUser.seat
      $rootScope.user.tool = $rootScope.cloudUser.tool
      localStorage.setItem("user", JSON.stringify($rootScope.user));
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
    $rootScope.getList();
  };

  $rootScope.getUserList = function(){
    $ionicLoading.show({
        template: 'loading'
    });
    $http({
      method: 'GET',
      url: './api/users'
    }).then(function successCallback(response) {
      // $rootScope.cloudUser = response.data;
      // $rootScope.user.seat = $rootScope.cloudUser.seat
      // $rootScope.user.tool = $rootScope.cloudUser.tool
      // localStorage.setItem("user", JSON.stringify($rootScope.user));
      $ionicLoading.hide();
      //console.log(response.data);
      localStorage.setItem("userList", JSON.stringify(response.data));
    }, function errorCallback(response) {});
  };

  $rootScope.setData = function(){
    $http({
      method: 'GET',
      url: './api/set'
    }).then(
      function successCallback(response) {},
      function errorCallback(response) {}
    );
  };
  $rootScope.getData = function(callback){
    $http({
      method: 'GET',
      url: './api/img'
    }).then(function successCallback(response) {
      console.log(response.data)
      $rootScope.imgSet = response.data;
      (callback && typeof(callback) === "function") && callback();
    }, function errorCallback(response) {});

  };
  //$rootScope.setData()
  $rootScope.getData();
});

app.controller('uploadCtrl', ['$rootScope', '$scope', 'Upload', '$timeout', '$ionicLoading', '$ionicPopup', '$state', '$window', function ($rootScope, $scope, Upload, $timeout, $ionicLoading, $ionicPopup, $state, $window) {
  $rootScope.getUser();
  $scope.file = '';
  $scope.progress = 0;

  $scope.openFileDialog=function() {
      console.log('fire! $scope.openFileDialog');
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
            console.log($scope.file, $rootScope.user );
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
      url: './api/img/post',
      data: {image: file, user: $rootScope.user.name},
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
        //$rootScope.setData();

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
  $rootScope.items = [];
  setInterval($rootScope.getData, 3000);
  $rootScope.getData(function () {
    loadImg()
    $scope.loadMore()
  });

  function loadImg(){
    $rootScope.noMoreItemsAvailable = false;
    $rootScope.items = [];
  }

  $scope.loadMore = function() {
    $rootScope.items.push($rootScope.imgSet[$rootScope.items.length]);
    if ( $rootScope.items.length == $rootScope.imgSet.length ) {
      $rootScope.noMoreItemsAvailable = true;
    }
    $rootScope.$broadcast('scroll.infiniteScrollComplete');
    console.log($rootScope.items)
  };


  /*
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
  */

  $scope.$watch('imgSet', function(newValue, oldValue) {
    if(typeof oldValue === 'undefined') { return; }
    if (newValue.length === oldValue.length) { return; }
    console.log('updated');
    $rootScope.items = [];
    $rootScope.noMoreItemsAvailable = false;
    $scope.loadMore();
  });
  $scope.thumbUp = function(key, id, ele) {
    $rootScope.imgSet[key].like++;
    console.log('id: ' + id);
    socket.emit('tUP', { iid: id });
  };
  socket.on('new', function (data) {
    //$rootScope.imgSet = data.newSet;
    console.log(data)
  });
  /*
  //console.log(User)

  //$rootScope.setData()
  //$rootScope.getData();
  //console.log($rootScope.imgSet)



  */
});

app.controller('rootCtrl', function($rootScope, $scope, $state, $ionicModal,$http , User) {
  $rootScope.user = User;
  $scope.submit = function(user){
    //console.log(user)
    $rootScope.getUser(true);
    $state.go('seat');
  };
  $rootScope.$ionicGoBack = function() {
    localStorage.removeItem("user");
    $state.go('root');
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
  $scope.next  = function () {
    $state.go('tab.agenda');
    //console.log($rootScope.user )
  };
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
      console.log($scope.local);
      localStorage.setItem("user", JSON.stringify($rootScope.user));
      localStorage.setItem("ans", JSON.stringify($scope.local));
      var dump = Submit.postData({user: $rootScope.user, ans: $scope.local});
      setTimeout(function(){
        $scope.next = dump;
        console.log('submited', dump)
      }, 3000);

    }else if(parseInt(qid) >=0 && parseInt(qid)<=4){
      console.log(dump)
      dump = parseInt(qid) + 1;
      $state.go($state.current, {qId: dump}, { reload: true });
    }
  };
});

app.controller('MediaCtrl', function($rootScope, $scope, $ionicModal) {
  $scope.showImages = function(ele, type, idx) {
    if(type === 'img') model_url = 'templates/model-image_popover.html';
    if(type === 'vid') model_url = 'templates/model-video_popover.html';
    if(type === 'usr') model_url = 'templates/model-user.html';
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
    //$rootScope.imgSet = data.newSet;
    console.log(data)
  });
});

app.controller('fbCtrl', function($rootScope, $http, $scope, $ionicModal, User, socket) {
  $scope.send = function(user, text){
    console.log(user)
    console.log(text)
    $http({
      method: 'POST',
      url: './api/pi',
      data: JSON.stringify({user: user.name, text:text, uid: user.uid}),
      headers: {'Content-Type': 'application/json'}
    }).then(
      function successCallback(response) {
        console.log(response.data)
      },
      function errorCallback(response) {
        console.log('er')
      }
    );


  };
});

app.controller('drawCtrl', function($rootScope, $http, $scope, $ionicModal, User, socket, $filter) {

  var userItem = JSON.parse(localStorage.getItem('user'));
  console.log(userItem);
  $scope.tool = userItem.tool;

  console.log('retrieve drawlist');
  $rootScope.getUserList();
  var userList = JSON.parse(localStorage.getItem('userList'));
  //  console.log(userList);
  // console.log(userList.length);
  var reverse = false;
  var drawList = $filter('orderBy')(userList, 'table', reverse);
  // console.log(drawList);
  var drawLists = []; // a list of drawList separated according to table
  var j=0;
  drawLists[j] = [];
  drawLists[j].push(drawList[0]);
  for (var i=1; i<drawList.length; i++){
    //  console.log(drawList[i]);
    if (drawList[i].table != drawList[i-1].table){
      j++;
      drawLists[j] = [];
      drawLists[j].push(drawList[i]);
    }else{
      drawLists[j].push(drawList[i]);
    }
  }
  console.log(drawLists.length);
  for (var i=0; i<drawLists.length; i++){
    console.log("Table "+(i+1));
    for (var k=0; k<drawLists[i].length; k++){
      console.log(drawLists[i][k]);
    }
  }

  $scope.luckyList = [];
  // $scope.luckyList.push(drawLists[0][0]);
  // $scope.lucky="Anson Leung";
  maxDraw = 4;
  $scope.drawCount = maxDraw;

  var luckyTable;
  var lucky;
  $scope.startDraw = function(){
    // console.log($scope.drawCount);
    if ($scope.drawCount > 0){
      $scope.disabled = false;
      console.log("Start lucky draw");
      var luckyTableNumber = Math.floor(Math.random()*drawLists.length);
      console.log("Lucky Table: "+luckyTableNumber);
      luckyTable = drawLists[luckyTableNumber];
      msa = luckyTable.slice();
      console.log(drawLists);
      drawLists.splice(luckyTableNumber, 1); // the table where lucky guy will be chosen
      console.log(drawLists);
      console.log(luckyTable);
      // var lucky = Math.floor(Math.random()*luckyTable.length);
      // luckyTable[lucky].count = maxDraw - $scope.drawCount + 1;
      // $scope.luckyList.reverse();
      // $scope.luckyList.push(luckyTable[lucky]);
      // $scope.luckyList.reverse();
      // console.log($scope.luckyList);
      // loopCount = luckyTable.length;
      loopTime = luckyTable.length*1000;
      console.log("loop time "+loopTime);
      $scope.drawCount--;
      if ($scope.drawCount == 0)
      $scope.disabled = true;
    }else{
      $scope.disabled = true;
    }
  };


  var msa/*[
      { name: "Abilene, TX" },
      { name: "Akron, OH" },
      { name: "Albany, GA" },
      { name: "Albany, OR" },
      { name: "Albany-Schenectady-Troy, NY" },
      { name: "Albuquerque, NM" },
      { name: "Alexandria, LA" },
      { name: "Allentown-Bethlehem-Easton, PA-NJ" },
      { name: "Altoona, PA" },
      { name: "Amarillo, TX" },
      { name: "Ames, IA" },
      { name: "Anchorage, AK" },
      { name: "Ann Arbor, MI" },
      { name: "Anniston-Oxford-Jacksonville, AL" },
      { name: "Appleton, WI" },
      { name: "Asheville, NC" },
      { name: "Athens-Clarke County, GA" },
      { name: "Atlanta-Sandy Springs-Roswell, GA" },
      { name: "Atlantic City-Hammonton, NJ" },
      { name: "Auburn-Opelika, AL" },
      { name: "Augusta-Richmond County, GA-SC" },
      { name: "Austin-Round Rock, TX" },
      { name: "Bakersfield, CA" },
      { name: "Baltimore-Columbia-Towson, MD" },
      { name: "Bangor, ME" },
      { name: "Barnstable Town, MA" },
      { name: "Baton Rouge, LA" },
      { name: "Battle Creek, MI" },
      { name: "Bay City, MI" },
      { name: "Beaumont-Port Arthur, TX" },
      { name: "Beckley, WV" },
      { name: "Bellingham, WA" },
      { name: "Bend-Redmond, OR" },
      { name: "Billings, MT" },
      { name: "Binghamton, NY" },
      { name: "Birmingham-Hoover, AL" },
      { name: "Bismarck, ND" },
      { name: "Blacksburg-Christiansburg-Radford, VA" },
      { name: "Bloomington, IL" },
      { name: "Bloomington, IN" },
      { name: "Bloomsburg-Berwick, PA" },
      { name: "Boise City, ID" },
      { name: "Boston-Cambridge-Newton, MA-NH" },
      { name: "Boulder, CO" },
      { name: "Bowling Green, KY" },
      { name: "Bremerton-Silverdale, WA" },
      { name: "Bridgeport-Stamford-Norwalk, CT" }
    ]*/,
    $input = $('input'),
    random_index, loopTime;


  // for jSlot

  //make list for slots recursively and call spin when complete
  function makeSlotList(list){

  	// $(".scroll").css("height", 1);
  	// $(".jSlots-wrapper").css("display", "block");
  	// $(".jSlots-wrapper").css("height", 500);
  	//could choose one random index and then populate with next 18 values instead, but need to account for looping at end
  	console.log("Size: "+luckyTable.length)
      if(list.length<=luckyTable.length){//length chosen based on appearance of spin, can be changed
          var index = _.random(msa.length-1);
          if(list.length===1){
          	/*
          		This index will be second item in the list, which is our winning number
          		Save this for future reference
				Instead of saving it, we could get the index attribute from the list item we end on
			*/
              random_index = index;
              lucky = index;
              luckyTable[lucky].count = maxDraw - $scope.drawCount;
			  $scope.luckyList.reverse();
			  $scope.luckyList.push(luckyTable[lucky]);
			  $scope.luckyList.reverse();
			  console.log($scope.luckyList);
          }
          list.push( '<li index='+index+'>'+msa[index].name+'</li>' );
          msa.splice(index, 1);
          return makeSlotList(list);
      } else {
          //slot list is complete
          //clear search field
          $input.val('');
          //attach list, show jslots, run animation
          $('#slot').html(list.join('')).parent().show().trigger('spin');
          return list;
      }
  }

  //before spinning, build out list to spin through and insert into the DOM
  $scope.makeSlots = function(){
      //start with current value
      var list = ['<li>'+$input.val()+'</li>'];

      //call recursive list builder that won't spin slots until it's finished
      makeSlotList(list);
  }

  $('#slot').jSlots({
      number: 1,
      spinner : '.jSlots-wrapper',
      spinEvent: 'spin',
      time: loopTime,
      loops: 4,
      endNum: 2,//spins backwards through the list. endNum 1 ends on the same value we started on
      onEnd: function(finalElement){
          //set result
          $input.val(msa[random_index].name);
          $input.css("font-size", 16);
          $input.css("font-weight", "normal");
          $input.css("padding-up", 6);
          $input.css("padding-bottom", 6);
          $input.css("padding-left", 6);
          $input.css("padding-right", 4);


          //hide spinner
          $(this.spinner).hide();
      }
  });

      //bind random button
      // $('#random_location').on('click', makeSlots);


//   $scope.getOrdinal = function(n) {
//    var s=["th","st","nd","rd"],
//        v=n%100;
//    return n+(s[(v-20)%10]||s[v]||s[0]);
// }

});
