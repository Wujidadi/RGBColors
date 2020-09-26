<?php

/*
 * 本工具用於依指定項（預設為第 0 項，即變數名稱）重新排序 RGBColor.json 中的顏色
 */

chdir(__DIR__);

$Json = file_get_contents('../data/RGBColor.json');

$Colors = json_decode($Json, true);

usort($Colors, function($a, $b)
{
    return $a[0] > $b[0];
});

$Json = json_encode($Colors, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

file_put_contents('../data/RGBColor.json', $Json);

exit;
