drop database if exists spin;
create database spin;

CREATE TABLE spin.hostel_expense(hid CHAR(1),
h_date DATE,
h_eb_charge DECIMAL(8,2) NOT NULL,
mess_charge DECIMAL(8,2) NOT NULL,
maintenance_charge DECIMAL(8,2) NOT NULL,
constraint hid_pk primary key(hid,h_date)
);
CREATE TABLE spin.hostel_type(hid CHAR(1) primary key,
hostel_type varchar(30) NOT NULL);

CREATE TABLE spin.workers(
 wid SMALLINT UNSIGNED AUTO_INCREMENT NOT NULL,
 fname VARCHAR(20) NOT NULL,
 lname VARCHAR(20)NOT NULL,
 job_desc VARCHAR(20) NOT NULL,
 dob DATE,
 hid CHAR(1) NOT NULL,
 CONSTRAINT wid_pk primary key(wid));
 
 CREATE TABLE spin.working_details(
 wid SMALLINT UNSIGNED references workers(wid),
 month_year DATE NOT NULL,
 working_days INT NOT NULL CHECK (working_days<=31),
 monthly_salary DECIMAL(8,2) NOT NULL,
 PF DECIMAL(8,2) AS (monthly_salary * 0.12),
 constraint wd_pk primary key(wid,month_year));
 
CREATE TABLE spin.building(
bid CHAR(1) NOT NULL primary key,
b_size VARCHAR(7) NOT NULL,
construction_year DATE
);

CREATE TABLE spin.raw_material_name(
item_no CHAR(4) primary key,
item_name VARCHAR(30));

CREATE TABLE spin.raw_materials(
item_no CHAR(4) NOT NULL references raw_material_name(item_no),
lot_no INT NOT NULL,
staple_len FLOAT NOT NULL,
qty float NOT NULL,
density FLOAT,
CONSTRAINT PRIMARY KEY(item_no,lot_no));

CREATE TABLE spin.spinning_type(
m_id CHAR(3) primary key,
m_type VARCHAR(20) NOT NULL,
bid CHAR(1) REFERENCES building(bid));

CREATE TABLE spin.spinning_prod(
m_id CHAR(3) references spinning_type(m_id),
m_date DATE NOT NULL,
m_eb FLOAT NOT NULL,
m_prod FLOAT NOT NULL ,
m_yarn_count INT NOT NULL CHECK (m_yarn_count IN (2,10,20,30,40,50)),
m_waste FLOAT NOT NULL,
wid SMALLINT REFERENCES workers(wid),
item_no CHAR(4),
lot_no INT,
CONSTRAINT spin_pro_pk primary key(m_id,m_date),
CONSTRAINT spin_pro_fk foreign key(item_no,lot_no) references raw_materials(item_no,lot_no),
CONSTRAINT check_prod_postive CHECK (m_prod >0));

#create table spin.spinning_prod(mid char(4),m_date date,m_eb float,m_yarnCount int,m_waste float,