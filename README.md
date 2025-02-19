## Overview

This is a repo that hosts Snappymob task, it's a VueJs application that would provide a simple interface to generate a
10MB txt file on demand which contains comma separated objects of the following:

1. Letters only (e.g., "abcdef", "klmno")
2. Decimal numbers (e.g., "123.456", "3.14159")
3. Whole numbers (e.g., "123", "456")
4. Mix of letters and numbers with spaces (e.g., "   abc123   ", "  xyz789 ")

## Setup

Make sure to install dependencies:

```bash
npm install
```

## Running Tests

In this project, I made sure everything is well tested and functioning as expected using TDD. You can run the tests by
running:

```bash
npm run test
```

## Dockerization

The application is dockerized and providing local directory mappings between the docker server and application. You can build the image by running:

```bash
docker compose up --build
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```