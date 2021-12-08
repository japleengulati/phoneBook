//contacts table create statement
//There should be country codes columns for phone numbers too


create table `contacts` 
(id INT(20) NOT NULL AUTO_INCREMENT, `name` varchar(255), phonework INT(20),
 phonehome INT(20), phonemobile INT(20), phoneother INT(20), emailaddress varchar(255)
, mailingAddressCity varchar(255), mailingAddressCountry varchar(255), 
mailingAddress varchar(255),
 PRIMARY KEY(id))


 alter table contacts add column postcode varchar(255)


INSERT INTO contacts(`name`,`phonework`,`phonehome`,`phonemobile`,`emailaddress`, 
`mailingAddressCity`, `mailingAddressCountry`, `mailingAddress`, `postcode`) values('Alan', 074375839, 849373, 252737382,
 'alanshaw@gmail.com', 'London', 'United Kingdom', '13, Rennes Drive, Rickmansworth', 'HA5 3EE')

ALTER TABLE `japnadb`.`contacts` 
CHANGE COLUMN `user_id` `user_id` VARCHAR(255) NOT NULL ;

//Added more records and added User IDs to existing 

