# Ping Monorepo

## Netlify Latest Build Status

### Ping Client

[![Netlify Status](https://api.netlify.com/api/v1/badges/317ab9aa-d5ea-4def-a4f7-a40452a0cbf6/deploy-status)](https://app.netlify.com/sites/ping-client/deploys)

### Ping Admin

[![Netlify Status](https://api.netlify.com/api/v1/badges/12980c82-4e75-4e7b-9b9d-f3990750d2a6/deploy-status)](https://app.netlify.com/sites/ping-admin/deploys)

## Stack

- Language: Typescript + NodeJS
- Front-end Framework: React
- Data Persistance: Google FireStore + Redis // TODO replace with PostGreSQL
- Deployment: Netlify for ping-client / ping-admin, Google Cloud Platform Virtual Machine for ping-api
- Third-Party Services: Stripe, Twilio, SendGrid

## Setup

- install the latest versions of node, npm and redis on your machine
- run `npm run bootstrap` in the project root
- add `.env` files in `packages/api`, `packages/client` and `packages/admin` as described in each respective README

## Run Project

- run Redis
- run `npm start` in the project root or inside each specific package

- Make AuthService work like AccountService
- Add messages to errors and update toasts

## Deployment

- Manually deploy `ping-api` in GCP Virtual Machine
- Automatically deploy `ping-client` and `ping-admin` by pushing to GitHub master branch
