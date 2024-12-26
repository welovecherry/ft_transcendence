DIR = ./project_root

TARGET = ${DIR}/docker-compose.yml

all: up

up:
	docker-compose -f $(TARGET) up --build

upd:
	docker-compose -f $(TARGET) up --build -d

# frontend 빌드 및 컨테이너 실행용 임시 레시피
fr:
	docker build ${DIR}/frontend/ -t frontend
	docker run -it -p 80:80 frontend

down:
	docker-compose -f $(TARGET) down

exec:
	docker exec -it backend /bin/bash

migrate:
	docker-compose exec backend python manage.py makemigrations
	docker-compose exec backend python manage.py migrate

re: down up

clean: down
	docker image prune -af

# 현재 컨테이너 및 이미지 삭제용 임시 레시피
fc:
	docker stop $(shell docker ps -aq) && docker rm $(shell docker ps -aq) && docker rmi $(shell docker images -q)

.PHONY: all up upd down re exec clean