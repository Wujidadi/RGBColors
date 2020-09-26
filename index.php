<?php

$Json = file_get_contents('RGBColor.json');
$Colors = json_decode($Json, true);

$Sort = isset($_GET['sort']) ? $_GET['sort'] : 'var';
$Order = isset($_GET['order']) && strtolower($_GET['order']) === 'desc' ? 'desc' : 'asc';

$Index = 0;
$Params = [
    'var' => 0,
    'en' => 1,
    'ch' => 2,
    'r' => 3,
    'g' => 4,
    'b' => 5
];

if ($Sort !== 'var' && in_array($Sort, array_keys($Params))) {
    $Index = $Params[$Sort];
}
switch ($Order) {
    case 'asc':
        usort($Colors, function($a, $b) use ($Index) {
            return $a[$Index] > $b[$Index];
        });
        break;
    case 'desc':
        usort($Colors, function($a, $b) use ($Index) {
            return $a[$Index] < $b[$Index];
        });
        break;
}

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RGB 顏色列表</title>
    <style>
        body {
            background-color: rgb(248, 255, 255);
        }
        #color-list, #color-list th, #color-list td {
            border-collapse: collapse;
            border-color: silver;
            border-style: solid;
            border-width: 1px;
        }
        .color {
            width: 8%;
        }
        .var {
            width: 20%;
        }
        .en {
            width: 20%;
        }
        .ch {
            width: 24%;
        }
        .r, .g, .b {
            width: 4%;
        }
        .rgb {
            width: 16%
        }
        #color-list th {
            background-color: rgb(220, 235, 235);
        }
        #color-list th.sortable {
            cursor: pointer;
        }
        #color-list th.sortable:hover {
            background-color: rgb(165, 208, 208);
        }
        #color-list {
            width: 100%
        }
        #color-list th, #color-list td {
            padding: 6px;
            text-align: center;
        }
        .color-display {
            height: 3rem;
            width: 8rem;
        }
    </style>
</head>
<body>
    <main>
        <table id="color-list">
            <thead>
                <tr>
                    <th class="color"></th>
                    <th class="var sortable" onclick="sortBy('var')">顏色變數名</th>
                    <th class="en sortable" onclick="sortBy('en')">英文名稱</th>
                    <th class="ch sortable" onclick="sortBy('ch')">中文名稱</th>
                    <th class="r sortable" onclick="sortBy('r')">R</th>
                    <th class="g sortable" onclick="sortBy('g')">G</th>
                    <th class="b sortable" onclick="sortBy('b')">B</th>
                    <th class="rgb">RGB 色碼</th>
                </tr>
            </thead>
            <tbody><?php
foreach ($Colors as $Color) {
    echo <<<TR

                    <tr>
                        <td class="color color-display" style="background: rgb({$Color[3]}, {$Color[4]}, {$Color[5]})"></td>
                        <td class="var">{$Color[0]}</td>
                        <td class="en">{$Color[1]}</td>
                        <td class="ch">{$Color[2]}</td>
                        <td class="r">{$Color[3]}</td>
                        <td class="g">{$Color[4]}</td>
                        <td class="b">{$Color[5]}</td>
                        <td class="rgb">rgb({$Color[3]}, {$Color[4]}, {$Color[5]})</td>
                    </tr>
    TR;
}
?>

            </tbody>
        </table>
    </main>
    <script>
        function sortBy(col) {
            let order = <?php echo '\'' . $Order . '\''; ?>,
                target = '/',
                param = [];
            if (col !== 'var') {
                param.push(`sort=${col}`);
            }
            if (order === 'asc') {
                param.push(`order=desc`);
            }
            if (param.length > 0) {
                target += '?' + param.join('&');
            }
            location.href = target;
        }
    </script>
</body>
</html>