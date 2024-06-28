#!/usr/bin/env bash
# login into gitlab docker registry
docker info
docker login -u griddo-staging -p zBSDG2K34oR7d7-BsTL1 registry.gitlab.com

# stop and remove the older docker deployment
docker stop griddo_qa_frontend && docker rm griddo_qa_frontend

# pulling the updated image
docker pull registry.gitlab.com/trutech/griddo/griddo.frontend:qa-griddo

# Deploying the updated image
docker run -d --name griddo_qa_frontend -p 8080:80 registry.gitlab.com/trutech/griddo/griddo.frontend:qa-griddo

# Cleaning up the system
docker system prune -f
