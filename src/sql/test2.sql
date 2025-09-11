set @t='{
    "documentId": "x",
    "preFilters": [],
    "pivot": {
        "top": [
            {
                "dataIndex": "artikel",
                "column": "artikel",
                "text": "Artikel",
                "table": "view_pivot_plenty",
                "align": "start",
                "renderer": "",
                "pivotFunction": "Ext.tualo.PivotGridFunctionSum",
                "func": ""
            },
            {
                "dataIndex": "steuersatz",
                "column": "steuersatz",
                "text": "Steuer",
                "table": "view_pivot_plenty",
                "align": "start",
                "renderer": "",
                "pivotFunction": "Ext.tualo.PivotGridFunctionSum",
                "func": ""
            }
        ],
        "left": [
            {
                "dataIndex": "zahlungsart",
                "column": "zahlungsart",
                "text": "Zahlungsart",
                "table": "view_pivot_plenty",
                "align": "start",
                "renderer": "",
                "pivotFunction": "Ext.tualo.PivotGridFunctionSum",
                "func": ""
            }
        ],
        "values": [
            {
                "dataIndex": "netto",
                "column": "netto",
                "text": "Netto",
                "table": "view_pivot_plenty",
                "align": "end",
                "renderer": "deColoredMoneyRenderer",
                "pivotFunction": "Ext.tualo.PivotGridFunctionSum",
                "func": ""
            },
            {
                "dataIndex": "brutto",
                "column": "brutto",
                "text": "Brutto",
                "table": "view_pivot_plenty",
                "align": "end",
                "renderer": "deColoredMoneyRenderer",
                "pivotFunction": "Ext.tualo.PivotGridFunctionSum",
                "func": ""
            }
        ],
        "available": [
            {
                "dataIndex": "belegnummer",
                "column": "belegnummer",
                "text": "Belegnummer",
                "table": "view_pivot_plenty",
                "align": "start",
                "renderer": "",
                "pivotFunction": "Ext.tualo.PivotGridFunctionSum",
                "func": ""
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