FROM python:3.7

WORKDIR /app

ENV FLASK_APP=app.py

ENV FLASK_ENV=development

COPY ./requirements.txt .

RUN pip3 install --upgrade pip

RUN pip install -r requirements.txt

COPY . .

CMD [ "python", "app.py" ]