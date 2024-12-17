### Docker 개별적으로 돌리기
`docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres`

### Init, configuration 설정
The default postgres user and database are created in the entrypoint with initdb.
The postgres database is a default database meant for use by users, utilities and third party applications.

- 참고 docs: https://www.postgresql.org/docs/14/app-initdb.html

- DB 초기화 및 configuration은 다음 링크 참고:
https://hub.docker.com/_/postgres#:~:text=and%20POSTGRES_DB.-,Initialization%20scripts,-If%20you%20would
