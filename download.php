<?php

require_once('vendor/autoload.php');

if($argc < 2) {
    die("Please give RSS feed as parameter\n");
}
$url = $argv[1];

$feed = new SimplePie();
$feed->enable_cache(false);
$feed->set_feed_url($url);
if(!$feed->init()) {
    die($feed->error()."\n");
}

foreach($feed->get_items() as $item) {
    /** @var SimplePie_Item $item */

    $enclosures = $item->get_enclosures();
    if(!$enclosures) continue;

    foreach($enclosures as $enclosure) {
        /** @var SimplePie_Enclosure $enclosure */

        $url = $enclosure->get_link();
        if(preg_match('/soup\.io/', $url)) {
            // soup.io's "normal" RSS feed resizes all enclosures to 400px, we want the full glory
            $url = preg_replace('/_400\./', '.', $url);
        }
        $hash = md5($url);
        $mime = $enclosure->get_type();
        $ext  = $enclosure->get_extension();
        $dir  = substr($hash, 0, 1);
        $path = 'data/'.$dir.'/'.$hash.'.'.$ext;

        if(!preg_match('/^image\//', $mime)) continue;

        $out = __DIR__.'/'.$path;
        if(file_exists($out)) continue;
        @mkdir(dirname($out), 0777, true);

        echo "Fetching $url to $path...";
        $data = file_get_contents($url);
        if($data) {
            // store data
            if(file_put_contents($out, $data)) {
                // add to index
                file_put_contents(__DIR__.'/index.txt', "$path\n", FILE_APPEND);
                echo " okay.\n";
                continue;
            }
        }
        echo " failed.\n";
    }
}
