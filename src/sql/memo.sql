select
    group_concat(
    replace(
        '
        (
            select 
                row_number() over ( order by val ) num ,
                concat( term, \' = \', quote(val) ) a 
            from condition_values_#seq#
        ) jointable_#seq#',
        '#seq#',
        seq
    )
    separator ' join '
    )  as `from_term`,

    concat(
        'concat(',
            group_concat( 
            replace(
                'jointable_#seq#.a',
                '#seq#',
                seq
            )
            separator ',\' and \','
            ),
        
        ')'
    )
     as `field_term`,



    concat(
        'concat(',
            group_concat( 
            replace(
                'jointable_#seq#.num',
                '#seq#',
                seq
            )
            separator ',\'_\','
            ),
        
        ')'
    )
     as `field_alias`,


    concat( 'with ',
     group_concat(


replace(
    replace(
        replace(
            '
                condition_values_#seq# as (
                    SELECT DISTINCT #expr# AS val , \' #expr# \' term FROM #tn# ORDER BY 1
                )
            ',
            '#seq#',
            d.seq
        ),
        '#expr#',
        d.expr
    ),
    '#tn#',
    d.tn
) 

separator ', '

     )) as cte
    
from (select mat_temp_pivot_aggregate_top.*, row_number() over (order by dataIndex) seq from mat_temp_pivot_aggregate_top) d



with fn as (
select
    group_concat(
    replace(
        '
        (
            select 
                row_number() over ( order by val ) num ,
                concat( term, \' = \', quote(val) ) a 
            from condition_values_#seq#
        ) jointable_#seq#',
        '#seq#',
        seq
    )
    separator ' join '
    )  as `from_term`,

    concat(
        'concat(',
            group_concat( 
            replace(
                'jointable_#seq#.a',
                '#seq#',
                seq
            )
            separator ',\' and \','
            ),
        
        ')'
    )
     as `field_term`,



    concat(
        'concat(',
            group_concat( 
            replace(
                'jointable_#seq#.num',
                '#seq#',
                seq
            )
            separator ',\'_\','
            ),
        
        ')'
    )
     as `field_alias`,


    concat( 'with ',
     group_concat(


replace(
    replace(
        replace(
            '
                condition_values_#seq# as (
                    SELECT DISTINCT #expr# AS val , \' #expr# \' term FROM #tn# ORDER BY 1
                )
            ',
            '#seq#',
            d.seq
        ),
        '#expr#',
        d.expr
    ),
    '#tn#',
    d.tn
) 

separator ', '

     )) as cte
    
from (select temp_pivot_aggregate_top.*, row_number() over (order by dataIndex) seq from temp_pivot_aggregate_top) d

)

select

concat(

    cte,char(10),
    'select',char(10),
    
    ' ',field_term,' `cond`,',char(10),
    ' ',field_alias,' `alias`',char(10),

    'from ',from_term,'',char(10)

) x

from fn