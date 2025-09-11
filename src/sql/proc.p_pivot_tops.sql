delimiter //



CREATE OR REPLACE PROCEDURE p_pivot_tops(
    out sql_table_query LONGTEXT
)
DETERMINISTIC
begin 
DECLARE q LONGTEXT;


    create temporary table if not exists temp_pivot_aggregate_top_map 
    (
        
        id integer ,
        seq integer ,
        tn VARCHAR(255),
        col VARCHAR(255),
        dataIndex VARCHAR(255),
        `value` VARCHAR(255),
        primary key (id, dataIndex)

    );
 
    -- select * from temp_pivot_aggregate_top;

    for rec in (select temp_pivot_aggregate_top.*, row_number() over (order by dataIndex) seq from temp_pivot_aggregate_top) 
    do 

        set q = replace( replace( 'SELECT DISTINCT #expr# AS val FROM #tn# ORDER BY 1','#expr#', rec.expr), '#tn#', rec.tn );


        set q = concat('insert into  temp_pivot_aggregate_top_map (id,seq,tn,col,dataIndex,value) select row_number() over (order by q.val), ', quote(rec.seq), ', ', quote(rec.tn), ', ', quote(rec.col), ', ', quote(rec.dataIndex), ', q.val from (', q,') q');
        PREPARE stmt FROM q;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
            
        -- insert into temp_pivot_aggregate_top_map (tn,col,dataIndex) values (rec.tn,rec.col,rec.dataIndex);

    end for; 
    
    

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
                'create temporary table if not exists temp_p_pivot_tops_t2 as ',
                cte,char(10),
                'select',char(10),
                
                ' ',field_term,' `cond`,',char(10),
                ' ',field_alias,' `alias`',char(10),

                'from ',from_term,'',char(10)

            ) x
        into q
        from fn
    ;

 
    
    PREPARE stmt FROM q;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    create temporary table if not exists temp_p_pivot_tops_t3 as
    select

        case 

            -- old style
            when pivotFunction='Ext.tualo.PivotGridFunctionSum' then concat( ' round( sum(IF(',cond,',  `',v.tn,'`.`',v.col,'` , 0))) AS ',v.dataIndex,'_',alias)
            when pivotFunction='Ext.tualo.PivotGridFunctionMin' then concat( ' round( min(IF(',cond,',  `',v.tn,'`.`',v.col,'` , NULL))) AS ',v.dataIndex,'_',alias)
            when pivotFunction='Ext.tualo.PivotGridFunctionMax' then concat( ' round( max(IF(',cond,',  `',v.tn,'`.`',v.col,'` , NULL))) AS ',v.dataIndex,'_',alias)
            when pivotFunction='Ext.tualo.PivotGridFunctionCount' then concat( ' count( IF(',cond,', 1 , NULL)) AS ',v.dataIndex,'_',alias)
            when pivotFunction='Ext.tualo.PivotGridFunctionDistinctCount' then concat( ' count( distinct IF(',cond,',  `',v.tn,'`.`',v.col,'` , NULL)) AS ',v.dataIndex,'_',alias)
            when pivotFunction='Ext.tualo.PivotGridFunctionAverage' then concat( ' round( avg(IF(',cond,', `',v.tn,'`.`',v.col,'` , NULL))) AS ',v.dataIndex,'_',alias)
            when pivotFunction='Ext.tualo.PivotGridFunctionSum2Digits' then concat( ' round( sum(IF(',cond,', `',v.tn,'`.`',v.col,'` , 0)),2) AS ',v.dataIndex,'_',alias)
            
            
            when pivotFunction='sum' then concat( ' round( sum(IF(',cond,',  `',v.tn,'`.`',v.col,'` , 0))) AS ',v.dataIndex,'_',alias)
            when pivotFunction='min' then concat( ' round( min(IF(',cond,',  `',v.tn,'`.`',v.col,'` , NULL))) AS ',v.dataIndex,'_',alias)
            when pivotFunction='max' then concat( ' round( max(IF(',cond,',  `',v.tn,'`.`',v.col,'` , NULL))) AS ',v.dataIndex,'_',alias)
            when pivotFunction='count' then concat( ' count( IF(',cond,', 1 , NULL)) AS ',v.dataIndex,'_',alias)
            when pivotFunction='distinctCount' then concat( ' count( distinct IF(',cond,',  `',v.tn,'`.`',v.col,'` , NULL)) AS ',v.dataIndex,'_',alias)
            when pivotFunction='average' then concat( ' round( avg(IF(',cond,', `',v.tn,'`.`',v.col,'` , NULL))) AS ',v.dataIndex,'_',alias)
            when pivotFunction='sum2digits' then concat( ' round( sum(IF(',cond,', `',v.tn,'`.`',v.col,'` , 0)),2) AS ',v.dataIndex,'_',alias)
            
            
            else concat( ' round( sum(IF(',cond,', `',v.tn,'`.`',v.col,'` , 0))) AS ',v.dataIndex,'_',alias)
        end as fnx,

        cond,
        alias,
        pivotFunction

    from    
    temp_p_pivot_tops_t2
        join temp_pivot_aggregate_values v
    ;

    select 
        group_concat(
            fnx
            separator ', '
        ) tc
    into sql_table_query

    from    
    temp_p_pivot_tops_t3
    ;


end //