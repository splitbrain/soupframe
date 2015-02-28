/** How long to show image (in seconds) */
var TIMEOUT = 20;
/** under what ratio should images be skipped */
var BADRATIO = 0.3;

/** holds the list of images */
var THE_LIST = [];
/** preloader image object */
var THE_IMAGE = {};
/** image display div */
var $THE_IMAGE = {};

/**
 * Start processing the list
 */
function start() {
    // preloader image thisent
    THE_IMAGE = document.createElement('IMG');
    THE_IMAGE.id = 'top_image';
    THE_IMAGE.onload = switcher;

    // div to display the images
    $THE_IMAGE = $('div');

    // start showing images
    window.setInterval(next, 1000 * TIMEOUT);
    next();

    // refresh the list
    window.setInterval(load, 1000 * 60 * 60);
}

/**
 * Switch between images
 *
 * does fadeout/in once the image has been loaded
 */
function switcher() {

    var w = THE_IMAGE.naturalWidth;
    var h = THE_IMAGE.naturalHeight;

    if (w / h < BADRATIO || h / w < BADRATIO) {
        // we don't want that image
        next();
        return;
    }

    $THE_IMAGE.fadeOut('medium', function () {
        $THE_IMAGE.css('background-image', 'url(' + THE_IMAGE.src + ')');
        $THE_IMAGE.fadeIn('medium');
    });
}

/**
 * Switch to the next image
 *
 * preloads the image
 */
function next() {
    var next = Math.floor(Math.random() * (THE_LIST.length));
    THE_IMAGE.src = THE_LIST[next];
    $THE_IMAGE.text(next + '/' + THE_LIST.length);
}

/**
 * (Re)load the list of images
 */
function load() {
    $.ajax(
        'index.txt',
        {
            cache:   false,
            success: function (data) {
                var first = (THE_LIST.length === 0);
                THE_LIST = data.split("\n");

                if (first) start();
            }
        }
    )
}

/* Main */
$(function () {
    load();
    $('body').click(function () {
        if (this.requestFullscreen) {
            this.requestFullscreen();
        } else if (this.msRequestFullscreen) {
            this.msRequestFullscreen();
        } else if (this.mozRequestFullScreen) {
            this.mozRequestFullScreen();
        } else if (this.webkitRequestFullscreen) {
            this.webkitRequestFullscreen();
        }
    });
});