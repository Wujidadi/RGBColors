<?php

/*
 * 本工具用於將 RGBColor.json 中的顏色資料輸出為 Dart RGBColors 類別的程式碼
 */

chdir(__DIR__);

$Json = file_get_contents('../data/RGBColor.json');

$Colors = json_decode($Json, true);

$Version = '2020.09.28.05.04.31';

$Lines = [
    "import 'rgbColor.dart';",      // 使用時，應隨實際專案名稱、路徑而調整
    '',
    "/// RGB 顏色集（版本：{$Version}）",
    'class RGBColors',
    '{'
];

foreach ($Colors as $i => $Color)
{
    $Lines[] = '    /// ' . ($Color[2] !== '' ? $Color[2] : $Color[1]);
    $Lines[] = '    static RGBColor ' . $Color[0] . ' = RGBColor(r: ' . $Color[3] . ', g: ' . $Color[4] . ', b: ' . $Color[5] . ');';
    if ($i < count($Colors) - 1)
    {
        $Lines[] = '';
    }
}

$Lines[] = '}';
$Lines[] = '';

$Full = implode("\n", $Lines);

file_put_contents('../dart/rgbColors.dart', $Full);

exit;
