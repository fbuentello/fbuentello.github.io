/**
* myApp Module
*
* Fabians Personal Website
*/
app = angular.module('myApp', ['ui.router','ngSanitize','ngAnimate','ui.ace'])
.controller('mainController', ['$scope','DataFactory', function($scope, DataFactory){
	$scope.sbBool = false;
	DataFactory.getData('personalData.json').success(function(response) {
		$scope.languages = response.languages;
		$scope.projHacks = response.projHacks;
		$scope.blogs = response.blogs;
	});

	var lightColors = [
		'#F44336',
		'#9C27B0',
		'#3F51B5',
		'#2196F3',
		'#009688',
		'#00BCD4',
		'#FF5722'

	];

	var darkColors = [
		'#B43128',
		'#631970',
		'#293475',
		'#186FB3',
		'#00564E',
		'#008394',
		'#BF4119'
	];
	var randNum = Math.floor(Math.random() * lightColors.length);
	// $scope.pageColor = lightColors[randNum];
	// $scope.darkerColor = darkColors[randNum];
	$scope.pageColor = '#2196F3';
	$scope.darkerColor = '#186FB3';
}])
.controller('blogController', ['$scope','DataFactory',function($scope, DataFactory){
	DataFactory.getData('personalData.json').success(function(response) {
		$scope.blogs = response.blogs;
	});

	var editor;
	if (document.getElementsByClassName('codeView_python')) {
		console.log('codeView_python is set');
		console.log(document.getElementsByClassName('codeView_python').length);
		[].forEach.call(document.getElementsByClassName("codeView_python"), function (el) {
			editor = ace.edit(el);
			editor.setTheme("ace/theme/tomorrow_night_eighties");
			editor.getSession().setMode("ace/mode/python");
			editor.setReadOnly(true);
			editor.getSession().setUseSoftTabs(false);

		});
	}
	if (document.getElementsByClassName('codeView')) {
		[].forEach.call(document.getElementsByClassName("codeView"), function (el) {
			editor = ace.edit(el);
			editor.setTheme("ace/theme/tomorrow_night_eighties");
			editor.getSession().setMode("ace/mode/javascript");
			editor.setReadOnly(true);
			editor.getSession().setUseSoftTabs(false);

		});
	}

}])

.factory('DataFactory', ['$http','$q', function ($http, $q) {

	return {
		getData: $http.get
	};
}])

.directive('sideBar', function(){
	return {
		restrict: 'E',
		controller: 'mainController',
		templateUrl: './partials/sideBar.tpl.html',
	};
})


.config(['$stateProvider','$urlRouterProvider',
	function($stateProvider,$urlRouterProvider) {
	$stateProvider
		.state('main', {
			url:'/',
			templateUrl:'/partials/main.tpl.html',
		})
		.state('blog', {
			url:'/blog',
			templateUrl:'/partials/blogMain.tpl.html',
		})
		.state('blog.NBA_Machine_Learning_Tutorial', {
			templateUrl: '/files/NBA_ML_Chapter0.html',
			url: '/NBA_Machine_Learning_Tutorial',
			controller: 'blogController'
		})
		.state('blog.NBA_Machine_Learning_Tutorial1', {
			templateUrl: '/files/NBA_ML_Chapter1.html',
			url: '/NBA_Machine_Learning_Tutorial/1',
			controller: 'blogController'
		})
		.state('blog.NBA_Machine_Learning_Tutorial2', {
			templateUrl: '/files/NBA_ML_Chapter2.html',
			url: '/NBA_Machine_Learning_Tutorial/2',
			controller: 'blogController'
		})
		.state('blog.NBA_Machine_Learning_Tutorial3', {
			templateUrl: '/files/NBA_ML_Chapter3.html',
			url: '/NBA_Machine_Learning_Tutorial/3',
			controller: 'blogController'
		})
		.state('blog.NBA_Machine_Learning_Tutorial4', {
			templateUrl: '/files/NBA_ML_Chapter4.html',
			url: '/NBA_Machine_Learning_Tutorial/4',
			controller: 'blogController'
		});
		$urlRouterProvider.otherwise('/');
	}]);




