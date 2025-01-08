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

re: down up

clean: down
	docker image prune -af

fclean:
	docker-compose -f $(TARGET) down --volumes --remove-orphans --rmi all
	docker image prune -af

.PHONY: all up upd down re exec clean fclean