<?php

namespace Tualo\Office\ReportPivot\Routes;

use Tualo\Office\Basic\TualoApplication;
use Tualo\Office\Basic\Route;
use Tualo\Office\Basic\IRoute;
use Tualo\Office\FiskalyAPI\API;

use Tualo\Office\Basic\Session;
use Tualo\Office\Basic\MYSQL\Database;

class Tree implements IRoute
{
    public static function register()
    {
        Route::add('/report-pivot/tree', function ($matches) {
            TualoApplication::contenttype('application/json');
            $db = TualoApplication::get('session')->getDB();
            try {
            } catch (\Exception $e) {
                TualoApplication::result('msg', $e->getMessage());
            }
        }, ['get'], true);

        Route::add('/report-pivot/available', function ($matches) {
            TualoApplication::contenttype('application/json');
            $db = TualoApplication::get('session')->getDB();
            try {
                $data = json_decode(file_get_contents(__DIR__ . '/json/columns.json'));
                TualoApplication::result('data', $data);
                TualoApplication::result('success', true);
            } catch (\Exception $e) {
                TualoApplication::result('msg', $e->getMessage());
            }
        }, ['get'], true);



        Route::add('/report-pivot/columns', function ($matches) {
            TualoApplication::contenttype('application/json');
            $db = TualoApplication::get('session')->getDB();
            try {
                $data = []; // json_decode(file_get_contents(__DIR__ . '/json/columns.json'));
                TualoApplication::result('data', $data);
                TualoApplication::result('success', true);
            } catch (\Exception $e) {
                TualoApplication::result('msg', $e->getMessage());
            }
        }, ['get'], true);

        Route::add('/report-pivot/rows', function ($matches) {
            TualoApplication::contenttype('application/json');
            $db = TualoApplication::get('session')->getDB();
            try {
                $data = []; // json_decode(file_get_contents(__DIR__ . '/json/columns.json'));
                TualoApplication::result('data', $data);
                TualoApplication::result('success', true);
            } catch (\Exception $e) {
                TualoApplication::result('msg', $e->getMessage());
            }
        }, ['get'], true);


        Route::add('/report-pivot/values', function ($matches) {
            TualoApplication::contenttype('application/json');
            $db = TualoApplication::get('session')->getDB();
            try {
                $data = []; // json_decode(file_get_contents(__DIR__ . '/json/columns.json'));
                TualoApplication::result('data', $data);
                TualoApplication::result('success', true);
            } catch (\Exception $e) {
                TualoApplication::result('msg', $e->getMessage());
            }
        }, ['get'], true);
    }
}
