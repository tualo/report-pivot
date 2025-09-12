<?php

namespace Tualo\Office\ReportPivot\Routes;

use Tualo\Office\Basic\TualoApplication;
use Tualo\Office\Basic\Route;
use Tualo\Office\Basic\IRoute;

class Axis implements IRoute
{
    public static function register()
    {

        Route::add('/report-pivot/(?P<axis>(top|left|values))/(?P<tablename>\w+)', function ($matches) {
            TualoApplication::contenttype('application/json');
            $db = TualoApplication::get('session')->getDB();
            try {
                $data = $db->singleValue('select `' . $matches['axis'] . '` res from pivot_configuration_by_user where table_name = {table_name} ', ['table_name' => $matches['tablename']], 'res');
                if (is_string($data)) {
                    $data = json_decode($data, true);
                } else {
                    $data = [];
                }
                TualoApplication::result('data', $data);

                TualoApplication::result('success', true);
            } catch (\Exception $e) {
                TualoApplication::result('msg', $e->getMessage());
            }
        }, ['get'], true);
    }
}
