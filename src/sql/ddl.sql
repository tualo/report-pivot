DELIMITER ;


create table if not exists pivot_configuration_by_user (  
    `id` varchar(36) not null,
    `name` varchar(255) default '',
    `table_name` varchar(128) not null,
    `values` JSON,
    `top` JSON,
    `left` JSON,
    `filter` JSON,
    `login` varchar(255),
    primary key (id, login)
);