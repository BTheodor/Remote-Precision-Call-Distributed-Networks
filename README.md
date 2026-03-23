# Remote-Precision-Call-Distributed-Networks

An academic and portfolio-ready project focused on Remote Procedure Call concepts in distributed systems. It presents RPC theory through an interactive frontend and complementary protocol demos, helping explain how remote communication works across different implementations and message formats.

Live Demo: https://b4ae51d5.remote-precision-call-distributed-networks.pages.dev/

## Project Summary

This project was built as an educational showcase for Distributed Networks topics, with an emphasis on RPC architecture, request flow, serialization, transport, and error handling.

The web application provides an interactive presentation of:

- the classic RPC communication model
- remote math-style procedure execution
- error propagation in distributed calls
- mutation-style workflows
- JSON-RPC request and response patterns
- XML-RPC and Apache Thrift reference implementations

The current deployed application is a static frontend built with `TypeScript`, `React`, and `Vite`, while the repository also includes `Python` examples for protocol-level demonstrations.

## Portfolio Highlights

- Designed as a practical explanation of RPC in distributed systems
- Combines theory, UI presentation, and protocol examples in one repository
- Includes multiple RPC styles for comparison: JSON-RPC, XML-RPC, and Apache Thrift
- Deployed publicly on Cloudflare Pages
- Structured for academic presentation and technical portfolio review

## Key Concepts Demonstrated

- Client program and remote service interaction
- RPC request lifecycle and logical call flow
- Serialization and transport concerns
- Structured error handling across service boundaries
- Differences between modern TypeScript-first workflows and classic IDL-based RPC
- Comparison of developer experience across RPC approaches

## Tech Stack

### Main Application

- TypeScript
- React 18
- Vite 5
- Cloudflare Pages

### Demo Implementations

- Python
- XML-RPC
- JSON-RPC
- Apache Thrift

## Repository Structure

- `src/` - main frontend application
- `demos/xmlrpc/` - XML-RPC Python examples
- `demos/jsonrpc/` - JSON-RPC Python examples
- `demos/thrift/` - Apache Thrift IDL and Python examples
- `wrangler.toml` - Cloudflare Pages configuration

## Running the Project Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment

This project is configured for Cloudflare Pages with the following setup:

- Build command: `npm run build`
- Output directory: `dist`

## Learning Objectives

This project is suitable for demonstrating understanding of:

- distributed systems fundamentals
- RPC communication patterns
- protocol design differences
- service-oriented interaction models
- educational software presentation

## Why This Project Matters

This repository is not just a frontend exercise. It is a technical learning artifact that translates distributed systems theory into a form that is easier to demonstrate, discuss, and evaluate. It is well suited for coursework presentation, GitHub portfolios, and interviews where system communication concepts need to be explained clearly.

## License

This project is distributed under the terms of the license included in this repository.
