<?php

namespace Tualo\Office\ReportPivot\Routes;

use Tualo\Office\Basic\TualoApplication as App;
use Tualo\Office\Basic\Route as BasicRoute;
use Tualo\Office\Basic\RouteSecurityHelper;
use Tualo\Office\Basic\IRoute;

class Aggregate implements IRoute
{
    public static function register()
    {

        BasicRoute::add('/report-pivot/aggregate', function ($matches) {
            App::contenttype('application/json');
            $db = App::get('session')->getDB();
            try {
                $payload_data = json_decode(@file_get_contents('php://input'), true);

                if (is_null($payload_data)) throw new \Exception('no payload');
                unset($payload_data['pivot']['available']);
                $db->direct('call p_pivot_aggregate({documentId},\'[{"table_name": "view_pivot_blg_hdr_plenty"}]\',{preFilters},{pivot})', [
                    $payload_data['documentId'],
                    'preFilters' => json_encode($payload_data['preFilters']),
                    'pivot' => json_encode($payload_data['pivot'])
                ]);
                $res = $db->moreResults();
                App::result('data', $db->direct('select * from temp_pivot_aggregate'));
                App::result('success', true);
                App::result('res', $res);
            } catch (\Exception $e) {
                App::result('msg', $e->getMessage());
            }
        }, ['post', 'put'], true);
    }
}
