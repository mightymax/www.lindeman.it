# Image-based deployment for www.lindeman.it

This directory contains a future replacement for the current NFS-backed static site deployment.

## Intended flow

1. Commit changes under `deployments/www.lindeman.it/www/`.
2. GitHub Actions builds `ghcr.io/mightymax/www.lindeman.it:<git-sha>`.
3. The workflow updates `manifest.image-based.yaml` to that immutable tag and commits it back.
4. Argo CD or `kubectl apply` deploys the updated manifest.

## Why this is better than NFS or Longhorn RWX

- No shared writable volume for static files
- Reproducible builds and rollbacks
- No manual `scp` or `rsync` to a single node
- No dependency on NFS or Longhorn RWX for a simple static site

## GitHub Actions credentials

The GitHub Actions workflow uses the built-in `GITHUB_TOKEN` to push to GHCR.
No separate registry credentials are needed in Actions, as long as the repository
is allowed to publish packages.

## Cluster pull secret

If you make the GHCR package public, you do not need an image pull secret.
If you keep it private, create one in the `www` namespace:

```bash
kubectl create secret docker-registry ghcr-creds \
  --namespace www \
  --docker-server=ghcr.io \
  --docker-username=<github-username> \
  --docker-password=<github-token>
```

Then add `imagePullSecrets` to the deployment if you want to keep the package private.

## Argo CD

Argo CD can deploy this just fine, but it does not build images by itself.
You still need a CI step such as GitHub Actions to build and push the image.
