DELIMITER //

create table if not exists p_pivot_query_last_statement (  
    id int auto_increment primary key,
    `statement` text,
    created_at timestamp default current_timestamp
) //

CREATE OR REPLACE PROCEDURE p_pivot_query_ex(
    IN tbl_name VARCHAR(99),
    IN order_by VARCHAR(99),
    IN where_clause LONGTEXT,
    OUT stmt2 TEXT
)
DETERMINISTIC
BEGIN
    DECLARE sql_statement TEXT;
    DECLARE sql_left TEXT;
    DECLARE sql_top TEXT;
    DECLARE sql_grouped TEXT;

    
    set sql_left = ( select group_concat(  expr_width_alias  SEPARATOR ', ' ) from temp_pivot_aggregate_left );
    set sql_grouped = ( select group_concat(  expr  SEPARATOR ', ' ) from temp_pivot_aggregate_left );



    call p_pivot_tops(sql_top,where_clause);
    
    set sql_statement ='
        SELECT 

            &l&,
            &t&


        FROM 
            &tbl&
        
        &w&
        
        GROUP BY &g&
        
        &o&
    ';
--        WITH ROLLUP
    set sql_statement = replace(sql_statement, '&l&', sql_left);
    set sql_statement = replace(sql_statement, '&g&', sql_grouped);
    set sql_statement = replace(sql_statement, '&t&', sql_top);
    -- set sql_statement = replace(sql_statement, '&n', tally_col);
    set sql_statement = replace(sql_statement, '&tbl&', tbl_name);
    set sql_statement = replace(sql_statement, '&w&', where_clause);
    
    set sql_statement = replace(sql_statement, '&o&', order_by);

select sql_statement;
    set stmt2 = sql_statement;

END;
//


CREATE OR REPLACE PROCEDURE `p_pivot_filters`(
     in in_json JSON,
     OUT out_where LONGTEXT
)
BEGIN
    DECLARE use_where LONGTEXT;
    DECLARE fn LONGTEXT;
    DECLARE value_term LONGTEXT;

    FOR `filter` IN (select 
    
        `table_name`,
            `filter_type`,
            `column_name`,
            `operator`,
            if (
                if(`func` is null, '{#}', `func`)='',
                '{#}', 
                if(`func` is null, '{#}', `func`)
            ) as `func`,
            `value`,
            `valuelist`
    from JSON_TABLE(in_json, '$.filters[*]' COLUMNS (
        `table_name` VARCHAR(255) PATH '$.table',
        `filter_type` VARCHAR(255) PATH '$.type',
        `column_name` VARCHAR(255) PATH '$.column',
        `operator` VARCHAR(10) PATH '$.operator',
        `func` VARCHAR(10) PATH '$.func' ,
        `value` VARCHAR(255) PATH '$.value',
        `valuelist` JSON PATH '$.value' -- if operator is in or not in
    )) jt ) DO

        -- select filter.column_name, filter.value, filter.operator, filter.filter_type, filter.func;

        if use_where is null then
            set use_where = ' WHERE ';
        else
            set use_where = concat(use_where, ' AND ');
        end if;

        case filter.operator
            when 'eq' then set filter.operator = '=';
            when 'ne' then set filter.operator = '<>';
            when 'lt' then set filter.operator = '<';
            when 'le' then set filter.operator = '<=';
            when 'gt' then set filter.operator = '>';
            when 'ge' then set filter.operator = '>=';
            when 'like' then set filter.operator = 'LIKE';
            when 'in' then set filter.operator = 'IN';
            when 'not in' then set filter.operator = 'NOT IN';
            when 'between' then set filter.operator = 'BETWEEN';
            else set filter.operator = '=';
        end case;   

        case filter.filter_type
            when 'string' then set filter.value = quote(filter.value);
            when 'date' then set filter.value = quote(filter.value);
            when 'datetime' then set filter.value = quote(filter.value);
            when 'number' then set filter.filter_type = 'number';
            when 'like' then set filter.value = quote(concat('%', filter.value, '%'));
            when 'start' then set filter.value = quote(concat(filter.value, '%'));
            when 'end' then set filter.value = quote(concat('%', filter.value));
            else set filter.filter_type = 'string';
        end case;

        if filter.operator = 'IN' or filter.operator = 'NOT IN' then
            
            set value_term = '';

            for r in (select trim(v) as v from JSON_TABLE(filter.valuelist, '$[*]' COLUMNS (v text PATH '$')) jt2) do
                if   value_term = '' then
                    set value_term = quote(r.v);
                else
                    set value_term =   concat(value_term, ',', quote(r.v));
                end if;
            end for;
            
            set filter.value = concat('(', value_term, ')');
        end if;

        if filter.operator = 'BETWEEN' then
            set filter.value = concat(quote( JSON_VALUE( filter.valuelist, '$[0]') ), ' AND ', quote( JSON_VALUE(filter.valuelist, '$[1]') ));
        end if;

        set use_where = concat(use_where, '  #func# ', filter.operator, ' ', ifnull(filter.value,'NULL'), ' ');

        set fn = filter.func;
        if fn is null then
            set fn = '{#}';
        end if;

        set fn = replace(fn, '{#}', concat('`', filter.column_name, '`')    );


        set use_where = replace(use_where, '#func#', fn);



         



    END FOR;
    
    if use_where is null then
        set use_where = '';
    end if;

    set out_where = use_where;
END //

CREATE OR REPLACE PROCEDURE `p_pivot_cols`(
     in in_name varchar(25),
     in in_pivot JSON
)
BEGIN

    DECLARE temp_query TEXT;
    set temp_query = replace('create temporary table if not exists temp_pivot_aggregate_#### as (
        select 
            concat(ifnull(replace(ifnull(fn,\'{#}\'), \'{#}\', concat(\'`\',tn,\'`\',\'.\',\'`\',col,\'`\')),concat(\'`\',tn,\'`\',\'.\',\'`\',col,\'`\')) ,\' AS \', dataIndex)  as expr_width_alias,
            concat( ifnull(replace(ifnull(fn,\'{#}\'), \'{#}\', concat(\'`\',tn,\'`\',\'.\',\'`\',col,\'`\')),concat(\'`\',tn,\'`\',\'.\',\'`\',col,\'`\')) )  as expr,
            t.*
        from (
            select 
                
                tn, 
                if(fn = \'\', null, fn) as fn,
                col, 
                dataIndex,
                pivotFunction
                
            from 
                JSON_TABLE(?, \'$.####[*]\' COLUMNS (
                    tn VARCHAR(255) PATH \'$.table\',
                    fn VARCHAR(255) PATH \'$.func\',
                    col VARCHAR(255) PATH \'$.column\',
                    dataIndex VARCHAR(255) PATH \'$.dataIndex\',
                    pivotFunction VARCHAR(255) PATH \'$.pivotFunction\'
                )) x
         ) t
    )', '####', in_name);

    
    insert into p_pivot_query_last_statement (`statement`) values (temp_query);

    PREPARE stmt FROM temp_query;
    EXECUTE stmt USING in_pivot;
    DEALLOCATE PREPARE stmt;


END //

CREATE OR REPLACE PROCEDURE `p_pivot_aggregate`(
     in in_id char(36),
     in in_tables JSON,
     in in_preFilters JSON,
     in in_pivot JSON
)
BEGIN
    DECLARE sql_query TEXT;
    DECLARE temp_query TEXT;
    DECLARE sql_table_query LONGTEXT;
    DECLARE sql_table_where LONGTEXT DEFAULT '';

    IF JSON_VALID(in_preFilters)=0 THEN
        SET in_preFilters = JSON_ARRAY();
    END IF;
    IF JSON_VALID(in_pivot)=0 THEN
        SET in_pivot = JSON_OBJECT();
    END IF;


    call p_pivot_cols('top', in_pivot);
    call p_pivot_cols('left', in_pivot);
    call p_pivot_cols('values', in_pivot);
 
    call p_pivot_filters(in_pivot, sql_table_where);



    if true then
    
        for tbl in (select table_name, table_alias from JSON_TABLE(in_tables, '$[*]' COLUMNS (
            table_name VARCHAR(255) PATH '$.table_name',
            table_alias VARCHAR(255) PATH '$.alias'
        )) jt ) DO




            call p_pivot_query_ex(
                tbl.table_name,
                "",
                sql_table_where,
                sql_table_query

            );



            if sql_query is null then
                set sql_query = sql_table_query;
            else
                set sql_query = concat(sql_query, ' UNION ALL ', sql_table_query);
            end if;

        END FOR;


        set sql_query = replace(sql_query, '{tabellenzusatz}', 'plenty');


        set sql_query = concat('create temporary table temp_pivot_aggregate as (', sql_query, ')');
        


        insert into p_pivot_query_last_statement (`statement`) values (sql_query);

        PREPARE stmt FROM sql_query;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;

    end if;

END // 
