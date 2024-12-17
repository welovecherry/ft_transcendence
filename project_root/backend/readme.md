### Docker 개별적으로 돌리기
```
docker build -t backend .
docker run -d --name backend-container -p 8000:8000 backend
```

### requirements.txt 작성
requirements.txt 파일에 필요한 패키지들을 나열해두면,
Dockerfile에서 이를 자동으로 설치할 수 있습니다.
Dockerfile에 명시한 RUN pip install -r requirements.txt 명령어가 바로 이 작업을 수행합니다.

- example
```
Django>=3.2,<4.0
psycopg2>=2.9
mysqlclient>=2.0
djangorestframework>=3.12
gunicorn>=20.0
```