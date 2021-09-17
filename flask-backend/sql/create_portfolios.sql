CREATE TABLE investment_portfolio.all_securities (
		index_id int NOT NULL AUTO_INCREMENT,
        user_id int NOT NULL,
        sec_id int NOT NULL,
        record_dt date NOT NULL,
        price float(10, 2),
        PRIMARY KEY(index_id)
);