Load generator service for simulating load

Run this in a container,
```
docker build -t loadgenapp:v1 ./
docker run --rm -p 8080:8080 loadgenapp:v1
```

Then stop it,
```
docker ps
docker stop containerId
```