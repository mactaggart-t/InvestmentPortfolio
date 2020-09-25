CREATE TABLE investment_portfolio.all_securities (
		sec_id int NOT NULL AUTO_INCREMENT,
        sec_name varchar(255) NOT NULL,
        sector varchar(255) NOT NULL,
        industry varchar(255) NOT NULL,
        ticker varchar(32) NOT NULL,
        PRIMARY KEY(sec_id)
);