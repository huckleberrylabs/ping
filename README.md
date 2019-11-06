# Monorepo

Huckleberry API: [![Netlify Status](https://api.netlify.com/api/v1/badges/396d060e-4546-47c6-93f6-ec864ec808b7/deploy-status)](https://app.netlify.com/sites/huckleberry-api/deploys)

Ping Admin: [![Netlify Status](https://api.netlify.com/api/v1/badges/12980c82-4e75-4e7b-9b9d-f3990750d2a6/deploy-status)](https://app.netlify.com/sites/ping-admin/deploys)

Ping Client: [![Netlify Status](https://api.netlify.com/api/v1/badges/317ab9aa-d5ea-4def-a4f7-a40452a0cbf6/deploy-status)](https://app.netlify.com/sites/ping-client/deploys)

## Stack

- Language: Typescript + NodeJS
- Front-end Framework: React
- Testing Framework: Jest
- Integrated Continuous Test Runner: WallabyJS
- Serverless Continuous Deployment: Zeit Now
- Continuous Integration: CircleCI
- Monorepo Package Management: Lerna

## Development Environment

### Setup

- NodeJS + NPM
- Git
- Visual Studio Code
- The following Plugins for Visual Studio

  - GitLens
  - Wallaby.js
  - Quokka.js
  - Prettier
  - TSLint
  - ESLint
  - StyleLint
  - GraphQL for VSCode

If you would like a GUI for Git, I recommend GitKraken.

## Run Project

- Option 1: `npm start` at project root. Variables are loaded from .env file
- Option 2: `now dev` at project root. Variables are loaded from .env file
- Option 3: `npm start` inside a specific package. Variables are loaded from .env file
