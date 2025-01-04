FROM python:3.13

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		postgresql-client \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY ./pong-game /usr/src/app/pong-game
COPY ./sub_game /usr/src/app/sub_game
WORKDIR /usr/src/app/pong-game

ENV PYTHONPATH="${PYTHONPATH}:/usr/src/app/sub_game"

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

EXPOSE 8000
ENTRYPOINT ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
# ENTRYPOINT [ "sleep", "infinity" ]