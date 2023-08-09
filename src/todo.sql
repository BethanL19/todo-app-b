drop table if exists todo;

create table todo (
id serial primary key,
  task VARCHAR(255),
  complete boolean
);