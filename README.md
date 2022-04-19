# Ping Monorepo

## Status

client.ping.buzz: [![Netlify Status](https://api.netlify.com/api/v1/badges/317ab9aa-d5ea-4def-a4f7-a40452a0cbf6/deploy-status)](https://app.netlify.com/sites/ping-client/deploys)

admin.ping.buzz: [![Netlify Status](https://api.netlify.com/api/v1/badges/12980c82-4e75-4e7b-9b9d-f3990750d2a6/deploy-status)](https://app.netlify.com/sites/ping-admin/deploys)

## Stack
- Language: Typescript on NodeJS
- Front-end Framework: React
- DNS: Netlify
- Data Persistance: Google DataStore + local Redis
- Deployment: Netlify for ping-client / ping-admin, Google Cloud Platform Virtual Machine for ping-api (live.ping.buzz)
- Third-Party Services: Stripe, Twilio, SendGrid

## Setup

- install the latest versions of node, npm and redis on your machine
- run `npm run bootstrap` in the project root
- add `.env` files in `packages/api`, `packages/client` and `packages/admin` as described in each respective README

## Run Project

- run redis
- run `npm start` in the project root or inside each specific package
## Deployment

- Manually deploy `ping-api` in GCP Virtual Machine
- Automatically deploy `ping-client` and `ping-admin` by pushing to GitHub master branch
