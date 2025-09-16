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


                $tables = [[
                    'table_name' => $payload_data['pivot']['top'][0]['table']
                ]];
                $db->direct('call p_pivot_aggregate({documentId},{tables},{preFilters},{pivot})', [
                    $payload_data['documentId'],
                    'tables' => json_encode($tables),
                    'preFilters' => json_encode($payload_data['preFilters']),
                    'pivot' => str_replace('{tabellenzusatz}', 'plenty', json_encode($payload_data['pivot']))
                ]);
                $res = $db->moreResults();

                /*
                $db->direct('drop table if exists mat_pivot_aggregate');
                $db->direct('create table mat_pivot_aggregate as select * from temp_pivot_aggregate');
                */

                App::result('data', $db->direct('select * from temp_pivot_aggregate'));
                App::result('map', $db->direct('select * from temp_pivot_aggregate_top_map'));
                App::result('success', true);
                App::result('res', $res);


                $save = $db->direct('
                insert into pivot_configuration_by_user 
                
                (id,name,table_name,`values`,`top`,`left`,`login`) values 
                ({id},{name},{table_name},{values},{top},{left},getSessionUser())

                on duplicate key update
                    name=values(name),
                    table_name=values(table_name),
                    `values`=values(`values`),
                    `top`=values(`top`),
                    `left`=values(`left`)
                ', [

                    'id' => $payload_data['documentId'],
                    'name' => isset($payload_data['name']) ? $payload_data['name'] : 'not set',
                    'table_name' => $payload_data['pivot']['top'][0]['table'],
                    'values' => json_encode($payload_data['pivot']['values']),
                    'top' => json_encode($payload_data['pivot']['top']),
                    'left' => json_encode($payload_data['pivot']['left']),
                    'filter' => json_encode($payload_data['pivot']['filter'])


                ]);
            } catch (\Exception $e) {
                App::result('sql', $db->getLastSQL());
                App::result('msg', $e->getMessage());
            }
        }, ['post', 'put'], true);
    }
}
