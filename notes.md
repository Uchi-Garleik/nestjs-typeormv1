docker build -t nestjs-docker .
docker run -p 300:300 nestjs-docker
docker-compose -f docker-compose.prod.yml up --build -d
