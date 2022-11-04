# Hello Application example

## Run with Docker directly
There are two services, hello and loadgen. Each runs in its own isolated containers, and 
are linked only by network. We use containers because it gives reproducible builds.

Run directly using Docker containers and the docker compose plugin. It: 
* builds the images, 
* creates a container for each image, 
* links containers by network, 
* and starts all containers.

```
docker compose up --build --remove-orphans
# Ctrl+C to stop, and check docker compose images
```

(This should be equivalent to `docker compose build && docker compose up --remove-orphans`)

<!-- Build the containers individually,
```
PROJECT=$PWD
cd $PROJECT/src/helloservice
docker build -t helloapp ./
cd $PROJECT/src/loadgeneratorservice
docker build -t loadgenapp ./
``` -->

## Run in a cluster
We might want to deploy our containers to a cluster.
We use kubectl to interact with our cluster.
Our docker-compse.yaml is translated into a kubectl compatible file.
A cluster has resources that are grouped into namespaces. 
* We run our application resources in the default namespace
* Our application is profiled by Pixie resources in the pl namespace

Spin up your cluster, and clear existing pods and services,
```
minikube stop --all && minikube delete --all
minikube start --driver=kvm2 --cni=flannel --cpus=4 --memory=4000
kubectl get namespace
kubectl -n "default" delete pod,svc --all --wait=false # on namespace 'default', delete pods and services
kubectl get pods && kubectl get services
eval $(minikube docker-env) # exposes registry for minikube to access
```

Install kompose,
```
curl -L https://github.com/kubernetes/kompose/releases/latest/download/kompose-linux-amd64 -o kompose
chmod +x kompose
```

Build images so that they are available to the cluster, run kompose, and apply it,
```
./kompose convert --out kubectl-kompose.yaml --build local
kubectl apply -f kubectl-kompose.yaml
kubectl get pods            # helloservice and loadgenservice should be Running
minikube service hello      # peek at the hello service
kubectl describe svc hello  # peek at the hello service
minikube ssh && htop        # peek at CPU and memory usage
```

Install Pixie on the cluster,
```
~/bin/px deploy --cluster_name minikube --pem_memory_limit 1Gi
```

After selecting your cluster, and with the px/cluster script, see the Nodes panel and click "minikube".
Scroll to the bottom to see the CPU Flamegraph.

Then clean up,
```
minikube stop --all
minikube delete --all
```

<!-- 
[![Open in Cloud Shell](https://gstatic.com/cloudssh/images/open-btn.svg)](https://ssh.cloud.google.com/cloudshell/editor?cloudshell_git_repo=https://github.com/GoogleCloudPlatform/kubernetes-engine-samples&cloudshell_tutorial=cloudshell/tutorial.md&cloudshell_workspace=hello-app)

This example shows how to build and deploy a containerized Go web server
application using [Kubernetes](https://kubernetes.io).

Visit https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app
to follow the tutorial and deploy this application on [Google Kubernetes
Engine](https://cloud.google.com/kubernetes-engine).

This directory contains:

- `main.go` contains the HTTP server implementation. It responds to all HTTP
  requests with a  `Hello, world!` response.
- `Dockerfile` is used to build the Docker image for the application.

This application is available as two Docker images, which respond to requests
with different version numbers:

- `us-docker.pkg.dev/google-samples/containers/gke/hello-app:1.0`
- `us-docker.pkg.dev/google-samples/containers/gke/hello-app:2.0`

This example is used in many official/unofficial tutorials, some of them
include:
- [Kubernetes Engine Quickstart](https://cloud.google.com/kubernetes-engine/docs/quickstart)
- [Kubernetes Engine - Deploying a containerized web application](https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app) tutorial
- [Kubernetes Engine - Setting up HTTP Load Balancing](https://cloud.google.com/kubernetes-engine/docs/tutorials/http-balancer) tutorial -->
