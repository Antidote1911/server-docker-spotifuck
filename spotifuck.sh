#! /bin/bash
# 

cd /mnt/Partage/Logiciels/spotifuck/

# Stop all containers
docker stop spotifuck

# Purge all stoped
docker system prune -a

# Build and run spotifuck
docker compose up -d
