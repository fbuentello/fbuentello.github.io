/**
* myApp Module
*
* Fabians Personal Website
*/
app = angular.module('myApp', ['ngRoute','ngSanitize']);
app.controller('mainController', ['$scope', function($scope){

	$scope.languages = [{
		name:'Javascript(Frontend/Backend)',
		exp: '90%',
		langClass: 'javascript',
		text: "<h2 class='heading multiColor tileHeader'> Back end </h2><h5 class='heading multiColor tileHeader'>Go to Frameworks</h5><ul><li>NodeJS</li><li>SailsJS</li></ul><p>With excitment surrounding io.js, I'm excited for Node's future. ps: I can build one mean <a class='multiColor' href='http://www.sitepoint.com/introduction-mean-stack/'>MEAN Stack</a> app ;). </p><h2 class='heading multiColor tileHeader'> Front end </h2><h5 class='heading multiColor tileHeader'>Go to Frameworks</h5><ul><li>AngularJS</li><li>EmberJS</li><li>The emphamis <a class='multiColor' href='http://tholman.com/elevator.js/'>ElevatorJS</a> :P</li></ul><p>With new frameworks coming out every 7th minute of every hour. It's not so much about what Javascript frameworks you know, but how fast can you adopt a new one.</p>"
	}, {
		name:'Objective-C/Swift',
		exp: '95%',
		langClass: 'iOS',
		text: "<h2 class='heading multiColor tileHeader'>[[Speak Brackets] toMe];</h2><h5 class='heading multiColor tileHeader'>Go to Frameworks</h5><ul><li><a class='multiColor' href='https://github.com/Mantle/Mantle'>Mantle</a></li><li><a class='multiColor' href='https://github.com/ReactiveCocoa/ReactiveCocoa'>ReactiveCocoa</a></li></ul><p> first and foremost, Objective-C is my first passion. I learned it before I learned any other programming language. I had no idea it was one of the most <a class='multiColor' href='https://youtu.be/73uu9YTq_1M'>difficult languages to learn</a>. I use this as motivation when I come across obstacles. Now with swift making its way in, programming for Apple devices has never been easier. </p>"
	}, {
		name:'Android',
		exp: '50%',
		langClass: 'android',
		text: "<h2 class='heading multiColor tileHeader'>Confessions of a Java Head</h2><p> Been doing Android for about 2 years. Have built prototype POS system for dry cleaners to a mobile Injector for the <a class ='aTagInsideLanguage' href='http://nodered.org/'>Node-RED Project</a>. I would be lying if I said I do enough Android projects. Feel free to drop a few project suggestions below :). </p>"
	}, {
		name:'HTML/CSS',
		exp: '85%',
		langClass: 'htmlCSS',
		text: "Aliquam in pharetra leo. In congue, massa sed elementum dictum, justo quam efficitur risus, in posuere mi orci ultrices diam."
	}, {
		name:'Ruby on Rails',
		exp: '67%',
		langClass: 'rubyOnRails',
		text: "Aliquam in pharetra leo. In congue, massa sed elementum dictum, justo quam efficitur risus, in posuere mi orci ultrices diam."
	}, {
		name:'PHP',
		exp: '85%',
		langClass: 'php',
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



app.directive('sideBar', function(){
	return {
		restrict: 'E',
		controller: 'mainController',
		templateUrl: './partials/sideBar.tpl.html',
	};
});







