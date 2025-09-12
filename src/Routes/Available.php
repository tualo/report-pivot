<?php

namespace Tualo\Office\ReportPivot\Routes;

use Tualo\Office\Basic\TualoApplication;
use Tualo\Office\Basic\Route;
use Tualo\Office\Basic\IRoute;


class Available implements IRoute
{
    public static function register()
    {
        Route::add('/report-pivot/available/(?P<tablename>\w+)', function ($matches) {
            TualoApplication::contenttype('application/json');
            $db = TualoApplication::get('session')->getDB();
            try {
                $data = $db->direct('select 
                
                ds_column_list_label.*,

                if(
                    `ds_column`.`fieldtype` <> "",
                    `ds_column`.`fieldtype`,
                    if(
                        `ds_column`.`column_type` = "bigint(4)"
                        or `ds_column`.`column_type` = "int(4)"
                        or `ds_column`.`column_type` = "tinyint(4)",
                        "boolean",
                        ifnull(
                            `ds_column_forcetype`.`fieldtype`,
                            ifnull(`ds_db_types_fieldtype`.`fieldtype`, "string")
                        )
                    )
                ) as fieldtype
                
                from ds_column_list_label 
                
                join ds_column on ds_column_list_label.table_name = ds_column.table_name and ds_column_list_label.column_name = ds_column.column_name
                left join `ds_column_forcetype` on(
                    (
                        `ds_column`.`table_name`,
                        `ds_column`.`column_name`
                    ) = (
                        `ds_column_forcetype`.`table_name`,
                        `ds_column_forcetype`.`column_name`
                    )
                )
                left join `ds_db_types_fieldtype` on
                (
                    `ds_column`.`data_type` = `ds_db_types_fieldtype`.`dbtype`
                )
                
                where ds_column_list_label.table_name = {table_name} and ds_column_list_label.active=1 order by ds_column_list_label.position asc', ['table_name' => $matches['tablename']]);
                TualoApplication::result('data', $data);

                $data = $db->direct('select * from ds_column_list_label where table_name = {table_name} and active=1 order by position asc', ['table_name' => $matches['tablename']]);
                TualoApplication::result('data', $data);


                TualoApplication::result('success', true);
            } catch (\Exception $e) {
                TualoApplication::result('msg', $e->getMessage());
            }
        }, ['get'], true);
    }
}
