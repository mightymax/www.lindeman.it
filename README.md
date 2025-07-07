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

## TLS
```bash
microk8s enable cert-manager
microk8s kubectl apply -f - <<EOF
---
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
 name: lets-encrypt
spec:
 acme:
   email: mark@Lindeman.it
   server: https://acme-v02.api.letsencrypt.org/directory
   privateKeySecretRef:
     # Secret resource that will be used to store the account's private key.
     name: lets-encrypt-priviate-key
   # Add a single challenge solver, HTTP01 using nginx
   solvers:
   - http01:
       ingress:
         class: public
EOF
microk8s kubectl get clusterissuer -o wide
microk8s kubectl create deploy -n axiell --image cdkbot/microbot:1 --replicas 3 microbot
microk8s kubectl expose deploy -n axiell microbot --port 80 --type ClusterIP
microk8s kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
 name: microbot-ingress
 namespace: axiell
 annotations:
   cert-manager.io/cluster-issuer: lets-encrypt
spec:
 tls:
 - hosts:
   - data.axiell.com
   secretName: microbot-ingress-tls
 rules:
 - host: data.axiell.com
   http:
     paths:
     - backend:
         service:
           name: microbot
           port:
             number: 80
       path: /
       pathType: Exact
EOF
```