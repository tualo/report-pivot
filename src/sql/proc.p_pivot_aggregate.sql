DELIMITER //


CREATE OR REPLACE PROCEDURE p_pivot_query(
    IN tbl_name VARCHAR(99),       -- table name (or db.tbl)
    IN base_cols VARCHAR(400),      -- column(s) on the left, separated by commas
    IN pivot_col VARCHAR(400),      -- name of column to put across the top
    IN tally_col VARCHAR(400),      -- name of column to SUM up
    IN where_clause VARCHAR(99),   -- empty string or "WHERE ..."
    IN order_by VARCHAR(99)  ,      -- empty string or "ORDER BY ..."; usually the base_cols
    OUT stmt2 TEXT
)
DETERMINISTIC
BEGIN
    -- Find the distinct values
    -- Build the SUM()s
    SET @subq = CONCAT('SELECT DISTINCT ', pivot_col, ' AS val ',
                    ' FROM ', tbl_name, ' ', where_clause, ' ORDER BY 1');
    -- select @subq;

    SET @cc1 = "CONCAT('SUM(IF(&p = ', &v, ', &t, 0)) AS ', &v)";
    SET @cc2 = REPLACE(@cc1, '&p', pivot_col);
    SET @cc3 = REPLACE(@cc2, '&t', tally_col);
    -- select @cc2, @cc3;
    SET @qval = CONCAT("'\"', val, '\"'");
    -- select @qval;
    SET @cc4 = REPLACE(@cc3, '&v', @qval);
    -- select @cc4;

    SET SESSION group_concat_max_len = 10000;   -- just in case
    SET @stmt = CONCAT(
            'SELECT  GROUP_CONCAT(', @cc4, ' SEPARATOR ",\n")  INTO @sums',
            ' FROM ( ', @subq, ' ) AS top');
     select @stmt;
    PREPARE _sql FROM @stmt;
    EXECUTE _sql;                      -- Intermediate step: build SQL for columns
    DEALLOCATE PREPARE _sql;
    -- Construct the query and perform it
    SET @stmt2 = CONCAT(
            'SELECT ',
                base_cols, ',\n',
                @sums,
                ',\n SUM(', tally_col, ') AS Total'
            '\n FROM ', tbl_name, ' ',
            where_clause,
            ' GROUP BY ', base_cols,
            '\n WITH ROLLUP',
            '\n', order_by
        );
    /*select @stmt2;                    -- The statement that generates the result
    PREPARE _sql FROM @stmt2;
    EXECUTE _sql;                     -- The resulting pivot table ouput
    DEALLOCATE PREPARE _sql;
    */
    SET stmt2 = @stmt2;
    -- For debugging / tweaking, SELECT the various @variables after CALLing.
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
        from JSON_TABLE(?, \'$.####[*]\' COLUMNS (
            tn VARCHAR(255) PATH \'$.table\',
            fn VARCHAR(255) PATH \'$.func\',
            col VARCHAR(255) PATH \'$.column\',
            dataIndex VARCHAR(255) PATH \'$.dataIndex\'
        )) t
    )', '####', in_name);

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
    DECLARE sql_table_query TEXT;

    IF JSON_VALID(in_preFilters)=0 THEN
        SET in_preFilters = JSON_ARRAY();
    END IF;
    IF JSON_VALID(in_pivot)=0 THEN
        SET in_pivot = JSON_OBJECT();
    END IF;


    call p_pivot_cols('top', in_pivot);
    call p_pivot_cols('left', in_pivot);



    if true then
    
        for tbl in (select table_name, table_alias from JSON_TABLE(in_tables, '$[*]' COLUMNS (
            table_name VARCHAR(255) PATH '$.table_name',
            table_alias VARCHAR(255) PATH '$.alias'
        )) jt ) DO

            set @left = ( select group_concat(  expr  order by expr ) from temp_pivot_aggregate_left );
            set @top = ( select group_concat(  expr  order by expr ) from temp_pivot_aggregate_top );


            set @left = replace(@left, '{tabellenzusatz}', 'plenty');
            set @top = replace(@top, '{tabellenzusatz}', 'plenty');


            set @values = (
                select group_concat(table_name order by table_name) from JSON_TABLE(in_pivot, '$.values[*]' COLUMNS (
                    table_name VARCHAR(255) PATH '$.dataIndex'
                )) v
            );

            call p_pivot_query(
                tbl.table_name, 
                @left, 
                @top, 
                @values, 
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
        
        select sql_query ;

        PREPARE stmt FROM sql_query;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;

    end if;

END // 
