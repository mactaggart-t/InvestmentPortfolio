CREATE TABLE investment_portfolio.historic_data (
		index_id int NOT NULL AUTO_INCREMENT,
		sec_id int NOT NULL,
        record_dt DATE NOT NULL,
        close_price FLOAT(10, 2),
        PRIMARY KEY(index_id)
);