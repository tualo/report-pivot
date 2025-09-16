set @t='{
    "documentId": "x",
    "preFilters": [],
    "pivot": {
        "filters": [
            {
                "func": "year({#})",
                "column": "datum",
                "operator": "in",
                "value": [
                    "2023",
                    "2024"
                ],
                "type": "number",
                "table": "",
                "id": "Tualo.reportPivot.lazy.controlls.models.PivotGridFilters-1"
            },
            {
                "table_name": "view_pivot_plenty",
                "column_name": "monat",
                "language": "DE",
                "label": "Belegmonat",
                "xtype": "gridcolumn",
                "editor": "",
                "position": 2,
                "summaryrenderer": "",
                "renderer": "deMonth",
                "summarytype": "",
                "hidden": false,
                "active": true,
                "filterstore": "",
                "grouped": false,
                "flex": 1,
                "direction": "",
                "align": "start",
                "listfiltertype": "",
                "hint": "NULL",
                "width": 0,
                "fieldtype": "integer",
                "type": "",
                "func": "",
                "pivotFunction": "Ext.tualo.PivotGridFunctionSum",
                "filterValue": "{}",
                "dataIndex": "monat",
                "column": "monat",
                "text": "Belegmonat",
                "table": "view_pivot_plenty",
                "operator": "=",
                "value": "1",
                "id": "Tualo.reportPivot.lazy.controlls.models.PivotGridFilters-3"
            },
            {
                "table_name": "view_pivot_plenty",
                "column_name": "monat",
                "language": "DE",
                "label": "Belegmonat",
                "xtype": "gridcolumn",
                "editor": "",
                "position": 2,
                "summaryrenderer": "",
                "renderer": "deMonth",
                "summarytype": "",
                "hidden": false,
                "active": true,
                "filterstore": "",
                "grouped": false,
                "flex": 1,
                "direction": "",
                "align": "start",
                "listfiltertype": "",
                "hint": "NULL",
                "width": 0,
                "fieldtype": "integer",
                "type": "",
                "func": "",
                "pivotFunction": "Ext.tualo.PivotGridFunctionSum",
                "filterValue": "{}",
                "dataIndex": "monat",
                "column": "monat",
                "text": "Belegmonat",
                "table": "view_pivot_plenty",
                "operator": "=",
                "value": "5",
                "id": "Tualo.reportPivot.lazy.controlls.models.PivotGridFilters-5"
            }
        ],
        "top": [
            {
                "table_name": "view_pivot_plenty",
                "column_name": "jahr",
                "language": "DE",
                "label": "Belegjahr",
                "xtype": "gridcolumn",
                "editor": "",
                "position": 3,
                "summaryrenderer": "",
                "renderer": "deNatualRenderer",
                "summarytype": "",
                "hidden": false,
                "active": true,
                "filterstore": "",
                "grouped": false,
                "flex": 1,
                "direction": "",
                "align": "start",
                "listfiltertype": "",
                "hint": "NULL",
                "width": 0,
                "type": "",
                "func": "",
                "pivotFunction": "Ext.tualo.PivotGridFunctionSum",
                "dataIndex": "jahr",
                "column": "jahr",
                "text": "Belegjahr",
                "table": "view_pivot_plenty",
                "filterValue": "{}",
                "id": "Tualo.reportPivot.lazy.controlls.PivotGridAxisModel-2"
            }
        ],
        "left": [
            {
                "table_name": "view_pivot_plenty",
                "column_name": "wochetag",
                "language": "DE",
                "label": "Wochentag",
                "xtype": "gridcolumn",
                "editor": "",
                "position": 4,
                "summaryrenderer": "",
                "renderer": "deWeekday",
                "summarytype": "",
                "hidden": false,
                "active": true,
                "filterstore": "",
                "grouped": false,
                "flex": 1,
                "direction": "",
                "align": "start",
                "listfiltertype": "",
                "hint": "NULL",
                "width": 0,
                "type": "",
                "func": "",
                "pivotFunction": "Ext.tualo.PivotGridFunctionSum",
                "filterValue": "{}",
                "id": "Tualo.reportPivot.lazy.controlls.PivotGridAxisModel-6",
                "dataIndex": "wochetag",
                "column": "wochetag",
                "text": "Wochentag",
                "table": "view_pivot_plenty"
            }
        ],
        "values": [
            {
                "table_name": "view_pivot_plenty",
                "column_name": "brutto",
                "language": "DE",
                "label": "Brutto",
                "xtype": "gridcolumn",
                "editor": "",
                "position": 8,
                "summaryrenderer": "",
                "renderer": "deColoredMoneyRenderer",
                "summarytype": "",
                "hidden": false,
                "active": true,
                "filterstore": "",
                "grouped": false,
                "flex": 1,
                "direction": "",
                "align": "end",
                "listfiltertype": "",
                "hint": "NULL",
                "width": 0,
                "type": "",
                "func": "",
                "pivotFunction": "sum",
                "filterValue": "{}",
                "id": "Tualo.reportPivot.lazy.controlls.PivotGridAxisModel-10",
                "dataIndex": "brutto",
                "column": "brutto",
                "text": "Brutto",
                "table": "view_pivot_plenty"
            }
        ]
    }
}';

set @j=JSON_EXTRACT(@t,'$.pivot');
-- select JSON_EXTRACT(@t, '$.top[*]') c;

/*
select 
    ifnull(replace(ifnull(fn,'{#}'), '{#}', concat('`',tn,'`','.','`',col,'`')),concat('`',tn,'`','.','`',col,'`')) as expr,
    t.*
from JSON_TABLE(@j, '$.top[*]' COLUMNS (
    tn VARCHAR(255) PATH '$.table',
    fn VARCHAR(255) PATH '$.func',
    col VARCHAR(255) PATH '$.column',
    dataIndex VARCHAR(255) PATH '$.dataIndex'
)) t;
*/
call p_pivot_aggregate('none','[{"table_name": "view_pivot_plenty"}]','[]',JSON_EXTRACT(@t,'$.pivot'));

select * from temp_pivot_aggregate;

select * from temp_pivot_aggregate_top_map;