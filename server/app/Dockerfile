FROM public.ecr.aws/lambda/python:3.9

WORKDIR /app
COPY app.py requirements.txt ./
ADD model model/

RUN python3.9 -m pip install -r requirements.txt -t .

CMD ["app.website_inference"]
