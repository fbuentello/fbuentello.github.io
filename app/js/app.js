/**
* myApp Module
*
* Fabians Personal Website
*/
app = angular.module('myApp', ['ngRoute','ngSanitize']);
app.controller('mainController', ['$scope','DataFactory', function($scope, DataFactory){
	DataFactory.getData.success(function(response) {
		$scope.languages = response.languages;
		$scope.projHacks = response.projHacks;
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
	$scope.pageColor = lightColors[randNum];
	$scope.darkerColor = darkColors[randNum];
}]);

app.factory('DataFactory', ['$http','$q', function ($http, $q) {

	return {
		getData: $http.get('personalData.json')
	};
}]);

app.directive('sideBar', function(){
	return {
		restrict: 'E',
		controller: 'mainController',
		templateUrl: './partials/sideBar.tpl.html',
	};
});







