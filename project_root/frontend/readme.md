### Docker 개별적으로 돌리기
```
docker build -t frontend .
docker run -d --name frontend-container -p 443:443 frontend
```