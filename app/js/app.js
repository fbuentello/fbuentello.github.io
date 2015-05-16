/**
* myApp Module
*
* Fabians Personal Website
*/
app = angular.module('myApp', ['ngRoute']);
app.controller('mainController', ['$scope', function($scope){

	$scope.languages = [{
		name:'Javascript',
		exp: '90%',
		color: '#c8102e',
		text: "Aliquam in pharetra leo. In congue, massa sed elementum dictum, justo quam efficitur risus, in posuere mi orci ultrices diam."
	},
	{
		name:'Objective-C/Swift',
		exp: '95%',
		color: '#9c27b0',
		text: "Aliquam in pharetra leo. In congue, massa sed elementum dictum, justo quam efficitur risus, in posuere mi orci ultrices diam."
	},
	{
		name:'Android',
		exp: '50%',
		color: '#4caf50',
		text: "Aliquam in pharetra leo. In congue, massa sed elementum dictum, justo quam efficitur risus, in posuere mi orci ultrices diam."
	},
	{
		name:'HTML/CSS',
		exp: '85%',
		color: '#2196f3',
		text: "Aliquam in pharetra leo. In congue, massa sed elementum dictum, justo quam efficitur risus, in posuere mi orci ultrices diam."
	}
	];

	$scope.projHacks = [
	{
		name: 'NR-Injector',
		desc: 'Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.',
		type: 'project'
	}, {
		name: 'CodeRED WebApp',
		desc: 'Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.',
		type: 'project'
	}, {
		name: 'Morning Hack',
		desc: 'Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.',
		type: 'hack'
	}, {
		name: 'The Other Guys',
		desc: 'Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.',
		type: 'project'
	}, {
		name: 'Mood Swing',
		desc: 'Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.',
		type: 'hack'
	}, {
		name: 'Siddy Talk',
		desc: 'Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.',
		type: 'project'
	}, {
		name: 'Mioty',
		desc: 'Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.',
		type: 'project'
	}
	];
	var lightColors = [
	'#F44336',
	'#9C27B0',
	'#673AB7',
	'#3F51B5',
	'#2196F3',
	'#03A9F4',
	'#009688',
	'#00BCD4',
	'#4CAF50',
	'#FF5722',
	'#9E9E9E',
	'#607D8B'
	];

	var darkColors = [
	'#B43128',
	'#631970',
	'#432677',
	'#293475',
	'#186FB3',
	'#027DB4',
	'#00564E',
	'#008394',
	'#306F33',
	'#BF4119',
	'#5E5E5E',
	'#34444B'
	];
	var randNum = Math.floor(Math.random() * lightColors.length);
	$scope.pageColor = lightColors[randNum];
	$scope.darkerColor = darkColors[randNum];
}]);



app.directive('sideBar', function(){
	return {
		restrict: 'E',
		controller: 'mainController',
		templateUrl: './partials/sideBar.tpl.html',
	};
});







