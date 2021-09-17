echo "Deploying Backend..."
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 862393548945.dkr.ecr.us-east-1.amazonaws.com
docker build -t flask-backend .
docker tag flask-backend:latest 862393548945.dkr.ecr.us-east-1.amazonaws.com/flask-backend:latest
docker push 862393548945.dkr.ecr.us-east-1.amazonaws.com/flask-backend:latest
cd aws_deploy
eb deploy