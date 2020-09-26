<?php

$Json = file_get_contents('RGBColor.json');
$Colors = json_decode($Json, true);

// usort($Colors, function($a, $b) {
//     return $a[0] > $b[0];
// });
// $Json = json_encode($Colors, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
// file_put_contents('RGBColor.json', $Json);
// exit;

$Lines = [
    "import 'package:inappwebview_test/helpers/rgbColor.dart';",
    '',
    'class RGBColors',
    '{'
];

foreach ($Colors as $i => $Color) {
    $Lines[] = '    /// ' . ($Color[2] !== '' ? $Color[2] : $Color[1]);
    $Lines[] = '    static RGBColor ' . $Color[0] . ' = RGBColor(r: ' . $Color[3] . ', g: ' . $Color[4] . ', b: ' . $Color[5] . ');';
    if ($i < count($Colors) - 1) {
        $Lines[] = '';
    }
}

$Lines[] = '}';
$Lines[] = '';

$Full = implode("\n", $Lines);

// print_r($Full);

file_put_contents('rgbColors.dart', $Full);

exit;
