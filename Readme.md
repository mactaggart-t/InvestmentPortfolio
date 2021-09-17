# Investment Portfolio

This is a passion project designed to solve two problems I've faced during my short time investing:

1. TDAmeritrade and other investing platforms don't provide sufficient data and visualizations regarding users portfolio performance and statistics

2. Using Excel is a good way to create nice visuals and data but doesn't scale well at all

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

You can access the latest stable release of the website [here](https://d34dkp2lqieu89.cloudfront.net/)

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