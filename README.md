# www.lindeman.it

Deze deployment is bedoeld voor een image-based setup:

- de statische bestanden staan in `deployments/www.lindeman.it/www/`
- GitHub Actions bouwt daar een image van
- Argo CD deployed vervolgens de nieuwe image-tag

De oude NFS-workflow met handmatig `scp` of `rsync` naar een nodepad is hiervoor niet meer het gewenste model.

## GHCR pull secret

Als de GHCR package private is, maak dan in namespace `www` een pull secret aan:

```bash
./tools/create-secret-ghcr www
```

Of handmatig:

```bash
kubectl create secret docker-registry ghcr-creds \
  --docker-server=ghcr.io \
  --docker-username=mightymax \
  --docker-password=$GITHUB_TOKEN \
  --docker-email=mark@lindeman.nu \
  --namespace=www
```
