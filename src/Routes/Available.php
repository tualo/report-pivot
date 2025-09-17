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
                $data = $db->direct('
                with base as (
                    select 
                    
                    ds_column_list_label.table_name,
                    ds_column_list_label.column_name,
                    ds_column_list_label.language,
                    ds_column_list_label.label,
                    ds_column_list_label.xtype,
                    ds_column_list_label.editor,
                    ds_column_list_label.position,
                    ds_column_list_label.summaryrenderer,
                    ds_column_list_label.summarytype,
                    ds_column_list_label.hidden,
                    ds_column_list_label.active,
                    ds_column_list_label.filterstore,
                    ds_column_list_label.renderer,
                    ds_column_list_label.flex,
                    ds_column_list_label.direction,
                    if(ds_column_list_label.align="", 
                        case 
                            when ds_column_list_label.xtype="numbercolumn" then "right"
                            when ds_column_list_label.xtype="datecolumn" then "center"
                            when ds_column.data_type="int" then "end"
                            when ds_column.data_type="bigint" then "end"
                            when ds_column.data_type="decimal" then "end"
                            when ds_column.data_type="float" then "end"
                            when ds_column.data_type="double" then "end"
                            else "left" 
                        end
                        , ds_column_list_label.align
                    ) as align,
                    ds_column_list_label.grouped,
                    ds_column_list_label.listfiltertype,
                    ds_column_list_label.hint,
                    ds_column_list_label.width,

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
                    
                    where ds_column_list_label.table_name = {table_name} and ds_column_list_label.active=1 order by ds_column_list_label.position asc
                )
                select 

                    table_name,
                    column_name,
                    language,
                    label,
                    xtype,
                    editor,
                    position,
                    summaryrenderer,
                    summarytype,
                    hidden,
                    active,
                    filterstore,
                    if(renderer="", fn_ds_default_renderer(fieldtype), renderer) as renderer,
                    flex,
                    direction,
                    align,
                    grouped,
                    listfiltertype,
                    hint,
                    width,
                    fieldtype
                
                from base;    
                ', ['table_name' => $matches['tablename']]);
                TualoApplication::result('data', $data);



                TualoApplication::result('success', true);
            } catch (\Exception $e) {
                TualoApplication::result('sql', $db->getLastSQL());
                TualoApplication::result('msg', $e->getMessage());
            }
        }, ['get'], true);
    }
}
