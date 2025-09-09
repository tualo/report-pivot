<?php

namespace Tualo\Office\ReportPivot\Checks;

use Tualo\Office\Basic\Middleware\Session;
use Tualo\Office\Basic\PostCheck;
use Tualo\Office\Basic\TualoApplication as App;


class Tables extends PostCheck
{

    public static function testSessionDB(array $config)
    {
        $tables = [];
        self::tableCheck('report_pivot', $tables);
    }

    public static function test(array $config)
    {
        $tables = [
            'report_pivot' => [
                'columns' => [
                    // 'group'=>'varchar(100)'
                ]
            ],
        ];
        self::tableCheck('report_pivot', $tables);
    }
}
