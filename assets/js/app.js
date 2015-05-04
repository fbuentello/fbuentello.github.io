
app =angular.module('myApp', []);

app.factory('DataFactory', ['$http','$q', function ($http, $q) {

	return {
		getData: $http.get('personalData.json')
	};
}]);

app.controller('MainController', ['$scope','DataFactory', function($scope,DataFactory){
	DataFactory.getData.success(function(response){
		$scope.personalInfo = response.personalInfo;
		$scope.skills = response.skills;
	});
}]);

app.directive('resumeTemplate', [function () {
	return {
		restrict: 'E',
		templateUrl:'./assets/partials/resume-template.html'
	};
}]);