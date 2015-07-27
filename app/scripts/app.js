'use strict';

/* myApp Module
*
* Fabians Personal Website
*/
angular.module('websiteApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ui.ace'
  ])
.controller('mainController', ['$scope', function($scope){
  $scope.languages = [
    {'name': 'Javascript(Frontend/Backend)',
      'langClass': 'javascript'},
    {'name': 'Objective-C/Swift',
      'langClass': 'iOS'},
    {'name': 'Hardware',
      'langClass': 'htmlCSS'},
    {'name': 'Machine Learning',
      'langClass': 'machineLearning'}
  ];

  $scope.pageColor = '#2196F3';
  $scope.darkerColor = '#186FB3';
}])
.controller('blogController', ['$scope','$window',function($scope,$window){
  $scope.blogs = {
    'NBA_Machine_Learning_Tutorial' : {
      'title': 'Predict NBA Players PER with Machine Learning',
    }
  };
  var editor;
  if (document.getElementsByClassName('codeView_python')) {
    [].forEach.call(document.getElementsByClassName('codeView_python'), function (el) {
      editor = $window.ace.edit(el);
      editor.setTheme('ace/theme/tomorrow_night_eighties');
      editor.getSession().setMode('ace/mode/python');
      editor.setReadOnly(true);
      editor.getSession().setUseSoftTabs(false);
      editor.getSession().setUseWorker(false);

    });
  }
  if (document.getElementsByClassName('codeView')) {
    [].forEach.call(document.getElementsByClassName('codeView'), function (el) {
      editor = $window.ace.edit(el);
      editor.setTheme('ace/theme/tomorrow_night_eighties');
      editor.getSession().setMode('ace/mode/javascript');
      editor.setReadOnly(true);
      editor.getSession().setUseSoftTabs(false);
      editor.getSession().setUseWorker(false);

    });
  }

}])

.config(['$stateProvider','$urlRouterProvider',
  function($stateProvider,$urlRouterProvider) {
  $stateProvider
    .state('main', {
      url:'/',
      templateUrl:'/views/main.tpl.html',
    })
    .state('blog', {
      url:'/blog',
      templateUrl:'/views/blogMain.tpl.html',
    })
    .state('blog.NBA_Machine_Learning_Tutorial', {
      templateUrl: '/views/NBA_ML_Chapter0.tpl.html',
      url: '/NBA_Machine_Learning_Tutorial',
      controller: 'blogController'
    })
    .state('blog.NBA_Machine_Learning_Tutorial1', {
      templateUrl: '/views/NBA_ML_Chapter1.tpl.html',
      url: '/NBA_Machine_Learning_Tutorial/1',
      controller: 'blogController'
    })
    .state('blog.NBA_Machine_Learning_Tutorial2', {
      templateUrl: '/views/NBA_ML_Chapter2.tpl.html',
      url: '/NBA_Machine_Learning_Tutorial/2',
      controller: 'blogController'
    })
    .state('blog.NBA_Machine_Learning_Tutorial3', {
      templateUrl: '/views/NBA_ML_Chapter3.tpl.html',
      url: '/NBA_Machine_Learning_Tutorial/3',
      controller: 'blogController'
    })
    .state('blog.NBA_Machine_Learning_Tutorial4', {
      templateUrl: '/views/NBA_ML_Chapter4.tpl.html',
      url: '/NBA_Machine_Learning_Tutorial/4',
      controller: 'blogController'
    });
    $urlRouterProvider.otherwise('/');
  }]);




