//jQuery to collapse the navbar on scroll
$(window).scroll(function() {
	if ($(".navbar").offset().top > 50) {
		$(".navbar-fixed-top").addClass("top-nav-collapse");
	} else {
		$(".navbar-fixed-top").removeClass("top-nav-collapse");
	}
});




$(document).ready(function() {

	var scrollTo = function (pageSection) {
		$('html,body').animate({
			scrollTop: $(""+pageSection).offset().top -40},
			1000);
	}
	$("#scrollDown").click(function() {
		scrollTo('#profile');
	});
	$("#navProfile").click(function() {
		scrollTo("#profile");
	});
	$("#navSkills").click(function() {
		scrollTo("#skills");
	});
	$("#navResume").click(function() {
		scrollTo("#resume");
	});

});