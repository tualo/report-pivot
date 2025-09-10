set @t='{
    "documentId": "98248723",
    "preFilters": [],
    "pivot": {
        "top": [
            {
                "dataIndex": "belegjahr",
                "column": "datum",
                "table": "blg_hdr_{tabellenzusatz}",
                "align": "left",
                "pivotFunction": null,
                "func": "substring({#},1,4)"
            }
        ],
        "left": [
            {
                "dataIndex": "belegjahr",
                "column": "datum",
                "table": "blg_hdr_{tabellenzusatz}",
                "align": "left",
                "pivotFunction": null,
                "func": "substring({#},1,4)"
            },
            {
                "dataIndex": "belegmonat",
                "column": "datum",
                "table": "blg_hdr_{tabellenzusatz}",
                "align": "left",
                "pivotFunction": null,
                "func": "substring({#},1,7)"
            }
        ],
        "values": [
            {
                "dataIndex": "netto",
                "column": "netto",
                "table": "blg_hdr_{tabellenzusatz}",
                "align": "right",
                "pivotFunction": "Ext.tualo.PivotGridFunctionSum",
                "func": ""
            }
        ]
    }
}';


set @j=JSON_EXTRACT(@t,'$.pivot');
select JSON_EXTRACT(@t, '$.top[*]') c;

select 
    ifnull(replace(ifnull(fn,'{#}'), '{#}', concat('`',tn,'`','.','`',col,'`')),concat('`',tn,'`','.','`',col,'`')) as expr,
    t.*
from JSON_TABLE(@j, '$.top[*]' COLUMNS (
    tn VARCHAR(255) PATH '$.table',
    fn VARCHAR(255) PATH '$.func',
    col VARCHAR(255) PATH '$.column',
    dataIndex VARCHAR(255) PATH '$.dataIndex'
)) t;

call p_pivot_aggregate('none','[{"table_name": "blg_hdr_plenty"}]','[]',JSON_EXTRACT(@t,'$.pivot'));

select * from temp_pivot_aggregate;