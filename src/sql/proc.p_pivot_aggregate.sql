DELIMITER //

create table if not exists p_pivot_query_last_statement (  
    id int auto_increment primary key,
    `statement` text,
    created_at timestamp default current_timestamp
);

CREATE OR REPLACE PROCEDURE p_pivot_query_ex(
    IN tbl_name VARCHAR(99),
    IN order_by VARCHAR(99),
    IN where_clause VARCHAR(99),
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



    call p_pivot_tops(sql_top);
    
    set sql_statement ='
        SELECT 

            &l&,
            &t&


        FROM 
            &tbl&
        
        &w&
        
        GROUP BY &g&
        WITH ROLLUP
        
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

    set stmt2 = sql_statement;

END;
//


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

    IF JSON_VALID(in_preFilters)=0 THEN
        SET in_preFilters = JSON_ARRAY();
    END IF;
    IF JSON_VALID(in_pivot)=0 THEN
        SET in_pivot = JSON_OBJECT();
    END IF;


    call p_pivot_cols('top', in_pivot);
    call p_pivot_cols('left', in_pivot);
    call p_pivot_cols('values', in_pivot);



    if true then
    
        for tbl in (select table_name, table_alias from JSON_TABLE(in_tables, '$[*]' COLUMNS (
            table_name VARCHAR(255) PATH '$.table_name',
            table_alias VARCHAR(255) PATH '$.alias'
        )) jt ) DO

            set @left = ( select group_concat(  expr  order by expr ) from temp_pivot_aggregate_left );
            set @top = ( select group_concat(  expr  order by expr ) from temp_pivot_aggregate_top );


   
            set @values = (
                select group_concat(table_name order by table_name) from JSON_TABLE(in_pivot, '$.values[*]' COLUMNS (
                    table_name VARCHAR(255) PATH '$.dataIndex'
                )) v
            );



            call p_pivot_query_ex(
                tbl.table_name,
                "",
                "",
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
