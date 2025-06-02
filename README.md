This is no longer used, we use the NFS mount.

```bash
export GHT=<GIT-PERSONAL-TOKEN> 
echo $GHT | docker login ghcr.io -u mightymax --password-stdin
docker build -t ghcr.io/mightymax/load-balancer-html:latest .
docker push ghcr.io/mightymax/load-balancer-html:latest
kubectl create namespace loadbalancer
kubectl create secret docker-registry ghcr-creds \
  --docker-server=ghcr.io \
  --docker-username=mightymax \
  --docker-password=$GHT \
  --docker-email=mark@lindeman.nu \
  --namespace=loadbalancer

```

New Image?
```bash
kubectl rollout restart deployment ldmax-loadbalancer-html -n loadbalancer
```