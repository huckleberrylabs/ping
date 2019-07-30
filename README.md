# Monorepo

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

- If you would like a GUI for Git, I recommend GitKraken.

## Run Project

- Option 1: `npm start` at project root. Variables are loaded from .env file
- Option 2: `now dev` at project root. Variables are loaded from .env file
- Option 3: `npm start` inside a specific package. Variables are loaded from .env file
