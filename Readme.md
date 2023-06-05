# Investment Portfolio

This is a passion project designed to solve two problems I've faced during my short time investing:

1. TDAmeritrade and other investing platforms don't provide sufficient data and visualizations regarding users portfolio performance and statistics

2. Using Excel is a good way to create nice visuals and data but doesn't scale well at all

Check out these images of the site:
<img width="1440" alt="Screen Shot 2021-03-01 at 11 38 09 AM" src="https://github.com/mactaggart-t/InvestmentPortfolio/assets/44453106/3c9db81c-a2a7-4d48-b5d7-73dff73f5207">
<img width="1440" alt="Screen Shot 2021-03-01 at 11 38 03 AM" src="https://github.com/mactaggart-t/InvestmentPortfolio/assets/44453106/02963fdf-e416-4900-b5ad-4faf4e18df57">
<img width="1440" alt="Screen Shot 2021-03-01 at 11 37 45 AM" src="https://github.com/mactaggart-t/InvestmentPortfolio/assets/44453106/2eec04cb-d604-4c67-a0b9-de279412f909">
<img width="1440" alt="Screen Shot 2021-03-01 at 11 37 28 AM" src="https://github.com/mactaggart-t/InvestmentPortfolio/assets/44453106/3cd2ccc3-4bc8-4b32-ac6b-15e0e4ce28c4">
<img width="1440" alt="Screen Shot 2021-03-01 at 11 37 14 AM" src="https://github.com/mactaggart-t/InvestmentPortfolio/assets/44453106/fa938c7d-b9b1-404b-be5c-1c537c7ec22d">
<img width="1440" alt="Screen Shot 2021-03-01 at 11 36 30 AM" src="https://github.com/mactaggart-t/InvestmentPortfolio/assets/44453106/2409e9f7-f127-461d-88ba-a4e151d293ff">
<img width="1440" alt="Screen Shot 2021-03-01 at 11 35 17 AM" src="https://github.com/mactaggart-t/InvestmentPortfolio/assets/44453106/c0cbcdcc-c146-495c-b448-f9cff34f787a">
<img width="1440" alt="Screen Shot 2021-03-01 at 11 35 06 AM" src="https://github.com/mactaggart-t/InvestmentPortfolio/assets/44453106/a3a86e30-6e32-4aca-9baf-b6e6faf5f1db">
<img width="1440" alt="Screen Shot 2021-03-01 at 11 35 01 AM" src="https://github.com/mactaggart-t/InvestmentPortfolio/assets/44453106/15819ccb-be0b-4aa9-a3fa-4d3b3639f994">
<img width="1440" alt="Screen Shot 2021-03-01 at 11 34 48 AM" src="https://github.com/mactaggart-t/InvestmentPortfolio/assets/44453106/10d590b9-792a-4d82-a223-92f6812dceb5">
<img width="1440" alt="Screen Shot 2021-03-01 at 11 34 36 AM" src="https://github.com/mactaggart-t/InvestmentPortfolio/assets/44453106/911e0add-f4b4-442f-92a3-9a21a1ae8a78">
<img width="1440" alt="Screen Shot 2021-03-01 at 11 33 53 AM" src="https://github.com/mactaggart-t/InvestmentPortfolio/assets/44453106/8b21f8ba-cdd8-430a-812d-e402b50e7222">



## Frontend

The frontend is built on a React Redux router

In order to build a production frontend run the script:
```bash
./deploy_frontend.sh
```
and then be sure to set the files in the s3 bucket to public

## Backend

The backend API is built as a flask app which is connected to an AWS RDS database.
 In order to build the backend for production run the script:
 
 ```bash
./deploy_backend.sh 
```

## Deployment notes

The deployment process was built off of the following medium [article](https://adamraudonis.medium.com/how-to-deploy-a-website-on-aws-with-docker-flask-react-from-scratch-d0845ebd9da4)

You can access the latest stable release of the website [here](https://d34dkp2lqieu89.cloudfront.net/) (backend currently down)

To run the app locally run the following commands:

```bash
cd flask-backend
gunicorn wsgi:app -w 2 -b 0.0.0.0:8080 -t 30
cd ..
cd react-frontend
export REACT_APP_API_URL=http://localhost:8080/api
npm start
```

and navigate to localhost:3000
