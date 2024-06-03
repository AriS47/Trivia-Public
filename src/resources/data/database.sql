create table if not exists login_info(
	user_id serial primary key,
	username varchar(50) unique not null,
	password varchar(50) not null,
	firstname varchar(50) not null,
	lastname varchar(50) not null,
	created_on timestamp not null

);



create table if not exists category(
	cat_id int primary key,
	cat_name varchar(50) unique not null,
	cat_topic varchar(25) not null,
	cat_desc varchar(50) not null,
	cat_dif varchar(5) unique not null
);