DIR = ./project_root

TARGET = ${DIR}/docker-compose.yml

all: up

up:
	docker-compose -f $(TARGET) up --build

upd:
	docker-compose -f $(TARGET) up --build -d

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

.PHONY: all up upd down re exec clean