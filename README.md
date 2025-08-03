# Multiplication Drill

[![CI/CD Pipeline](https://github.com/multiplicationdrill/multiplicationdrill.github.io/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/multiplicationdrill/multiplicationdrill.github.io/actions/workflows/ci-cd.yml)
[![codecov](https://codecov.io/gh/multiplicationdrill/multiplicationdrill.github.io/branch/main/graph/badge.svg)](https://codecov.io/gh/multiplicationdrill/multiplicationdrill.github.io)

A reactive math quiz application built with TypeScript and a custom signal-based state management system.

## Features

- **Interactive Math Quiz**: Practice multiplication with timed questions and answers
- **Difficulty Levels**: Choose from Easy, Medium, Hard, or Expert
- **Manual Mode**: Increment counter manually or with auto-update
- **Dark/Light Theme**: Toggle between themes with persistent preference
- **Responsive Design**: Works on desktop and mobile devices
- **Settings Persistence**: Your preferences are saved locally

## Technology Stack

- **TypeScript**: For type-safe code
- **Vite**: Fast build tool and dev server
- **Custom Signal System**: Reactive state management inspired by SolidJS
- **Vitest**: Unit testing framework
- **GitHub Actions**: CI/CD pipeline
- **GitHub Pages**: Hosting

## Development

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
# Clone the repository
git clone https://github.com/multiplicationdrill/multiplicationdrill.github.io.git
cd multiplicationdrill.github.io

# Install dependencies
npm install

# Run development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run linter
- `npm run type-check` - Check TypeScript types

## Architecture

### Signal System

The application uses a custom reactive signal system for state management:

- **Signal**: Holds a value and notifies observers when it changes
- **ComputedSignal**: Derives values from other signals, with automatic dependency tracking
- **effect**: Runs side effects when dependencies change

### Project Structure

```
src/
├── __tests__/       # Unit tests
├── signals.ts       # Signal system implementation
├── types.ts         # TypeScript type definitions
├── utils.ts         # Utility functions
├── state.ts         # Application state
├── app.ts           # Main application logic
├── main.ts          # Entry point
├── style.css        # Styles
## Testing

The project uses Vitest for unit testing:

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

Tests cover:
- Signal system functionality
- Utility functions
- State computations
- Local storage persistence

## Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the main branch:

1. Tests run on Node.js 18.x and 20.x
2. Linting and type checking are performed
3. If all checks pass, the app is built and deployed

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.