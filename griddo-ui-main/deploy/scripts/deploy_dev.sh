#!/usr/bin/env bash
# login into gitlab docker registry
docker info
docker login -u griddo-staging -p zBSDG2K34oR7d7-BsTL1 registry.gitlab.com

# stop and remove the older docker deployment
docker stop griddo_staging_frontend && docker rm griddo_staging_frontend

# pulling the updated image
docker pull registry.gitlab.com/trutech/griddo/griddo.frontend:develop

# Deploying the updated image
docker run -d --name griddo_staging_frontend -p 3000:80 -p 3443:443 registry.gitlab.com/trutech/griddo/griddo.frontend:develop

# Cleaning up the system
docker system prune -f
