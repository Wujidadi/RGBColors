<?php

/*
 * 本工具用於將來自 Encycolorpedia 網站的色彩名稱清單（/data/NamedColors.txt）轉換成如同 RGBColor.json 的格式
 */

chdir(__DIR__);

// $ColorFile = '../data/NamedColors.txt';
$ColorFile = '../data/NonrepeatedColor.txt';
// $ColorFile = '../data/RepeatedColor.txt';

$File = fopen($ColorFile, 'r');

$Color = [];
$i = 0;

while (!feof($File))
{
    $Line = fgets($File);
    if (!preg_match('/^#[a-zA-z0-9]{6}$/', $Line))
    {
        $Color[$i][0] = preg_replace(
            [
                '/^A/',
                '/^B/',
                '/^C/',
                '/^D/',
                '/^E/',
                '/^F/',
                '/^G/',
                '/^H/',
                '/^I/',
                '/^J/',
                '/^K/',
                '/^L/',
                '/^M/',
                '/^N/',
                '/^O/',
                '/^P/',
                '/^Q/',
                '/^R/',
                '/^S/',
                '/^T/',
                '/^U/',
                '/^V/',
                '/^W/',
                '/^X/',
                '/^Y/',
                '/^Z/',
                '/ a/',
                '/ b/',
                '/ c/',
                '/ d/',
                '/ e/',
                '/ f/',
                '/ g/',
                '/ h/',
                '/ i/',
                '/ j/',
                '/ k/',
                '/ l/',
                '/ m/',
                '/ n/',
                '/ o/',
                '/ p/',
                '/ q/',
                '/ r/',
                '/ s/',
                '/ t/',
                '/ u/',
                '/ v/',
                '/ w/',
                '/ x/',
                '/ y/',
                '/ z/',
                '/ /',
                '/\n/'
            ],
            [
                'a',
                'b',
                'c',
                'd',
                'e',
                'f',
                'g',
                'h',
                'i',
                'j',
                'k',
                'l',
                'm',
                'n',
                'o',
                'p',
                'q',
                'r',
                's',
                't',
                'u',
                'v',
                'w',
                'x',
                'y',
                'z',
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
                'G',
                'H',
                'I',
                'J',
                'K',
                'L',
                'M',
                'N',
                'O',
                'P',
                'Q',
                'R',
                'S',
                'T',
                'U',
                'V',
                'W',
                'X',
                'Y',
                'Z',
                '',
                ''
            ],
            $Line
        );
        $Color[$i][1] = preg_replace('/\n/', '', $Line);
        $Color[$i][2] = '';
    }
    else
    {
        $Color[$i][3] = hexdec(substr($Line, 1, 2));
        $Color[$i][4] = hexdec(substr($Line, 3, 2));
        $Color[$i][5] = hexdec(substr($Line, 5, 2));
        $i++;
    }
}

usort($Color, function($a, $b)
{
    return $a[1] > $b[1];
});

$Json = json_encode($Color, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

file_put_contents('../data/ColorsFromEncycolorpedia.json', $Json);

exit;
