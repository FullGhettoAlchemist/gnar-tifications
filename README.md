# Gnartifications

gnartifying the world one silky powder turn at a time

## prerequisets
- docker

## running docker containers
docker-compose up --build

## terminating docker containers
docker stop $(docker ps -aq)

## executing commands inside a docker container
docker exec -it <container_id_or_name> <command>