var app = angular.module('starter.services', ['ngResource'])

app.factory('qSet', function ($resource) {
    //console.log($resource('/qSet').query());
    return $resource('/qSet/:qId/:data');
});

app.factory('socket', ['$rootScope', function($rootScope) {
  var socket = io.connect();

  return {
    on: function(eventName, callback){
      socket.on(eventName, callback);
    },
    emit: function(eventName, data) {
      socket.emit(eventName, data);
    }
  };
}]);

app.factory('User', function () {
    user = {};
    user.First = '';
    user.Last = '';
    user.Com = '';  
    user.submit = false;
    return user;

});

app.factory('localData', function () {
    local = {
        Q1: "",
        Q2: "",
        Q3: "",
        Q4: "",
        Q5: "",
        Q6: ""
      }

    return local;

});

app.factory('Submit', function ($resource) {
    return $resource('/submit/:qsid',  null,{
        postData: {
          method: 'PUT'
        }
    });
}); 