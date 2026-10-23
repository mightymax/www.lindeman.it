# www.lindeman.it

Statische website; bron en deployment in deze repo. Lokaal: `~/Code/cluster/www.lindeman.it`.

## Release

Commit en push wijzigingen naar `main`, daarna:

```sh
npm version patch # of minor / major
```

Dit maakt en pusht de versiecommit en tag. GitHub Actions bouwt uitsluitend
linux/arm64, publiceert `ghcr.io/mightymax/www-lindeman-it-app`, test HTTP en CSS,
en werkt de image-tag en digest bij op branch `release`. Argo CD Application
`www.lindeman.it` volgt `infrastructure/overlays/prod` op die branch.

Dockerbasis: NGINX 1.30.6 / Alpine 3.24, gepind op digest.
Bestaande ingressroutes en namespace `www` blijven behouden. De wildcard-ingress
is bewust uitsluitend voor de standby NGINX-controller en heeft geen healthcheck.
Het bestaande `ghcr-creds` pull secret blijft buiten deze repo.

Controle: `gh run list --workflow release.yml` en
`kubectl -n argocd get application www.lindeman.it`.
