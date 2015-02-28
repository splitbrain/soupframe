SoupFrame
=========

This is a quickly hacked together thingy to make a digital picture frame out of a soup.io account's images. Actually
it does two things that are very much generic and would work with all kinds of sources:

1. A downloader script for images referenced as enclosure in a given RSS feed
2. A JavaScript/HTML site that displays these images in random order full screen

## Installation

1. Clone the or download the repository somewhere in your webserver root
2. Install composer ```curl -sS https://getcomposer.org/installer | php```
3. Download the libraries ```php composer.phar update```

### Why PHP?

Because it was the easiest and fastest way for me to hack this together. The downloader would be better fitted for
Python I guess and maybe I'll redo it some time. For now: deal with it!

Also I did not add any cool HTTP client library, so you need to make sure your PHP can access URLs via
file_get_contents.

## Downloading your soup.io

You first want to start with everything you ever had in your soup. You need an Export RSS feed for that:

1. Go to **your** soup at http://<yourusername>.soup.io
2. Open the options
3. Go to the privacy tab
4. Download the Export RSS URL (this takes ages to generate, so maybe do it on command line)
5. Run it through the downloader script ```php download.php <yourexport>.rss```

## Create a cronjob to update

You want to have this update regularly from your "normal" feed. To do so set up a cronjob to run
```php downloader.php http://<yourusername>.soup.io/rss``` as often as needed. The downloader should skip images
it already knows. **Be sure not to pull the export feed everytime!**

## Set up your display

Open the index.html on your device's browser. It should start to cycle through the images. Click the image once
to switch to full screen mode.
