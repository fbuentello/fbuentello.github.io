
$(window).scroll(function() {
	if ($(".navbar").offset().top > 50) {
		$(".navbar-fixed-top").addClass("top-nav-collapse");
	} else {
		$(".navbar-fixed-top").removeClass("top-nav-collapse");
	}
});

$(function() {
    $('.page-scroll a').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top -40
        }, 1500);
        // event.preventDefault();
    });
});

$(document).ready(function() {

    var scrollTo = function (pageSection) {
        $('html,body').animate({
            scrollTop: $(""+pageSection).offset().top -40},
            1500);
    }
    $("#scrollDown").click(function() {
        scrollTo('#profile');
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });
});

