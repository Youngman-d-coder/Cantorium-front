# Contributing to Cantorium

Thank you for your interest in contributing to Cantorium! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

Before creating a bug report:
- Check the existing issues to avoid duplicates
- Use the latest version of the application
- Collect relevant information (browser version, OS, error messages, etc.)

When creating a bug report:
- Use a clear and descriptive title
- Describe the steps to reproduce the issue
- Explain the expected vs. actual behavior
- Include screenshots if applicable
- Provide system information

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:
- Use a clear and descriptive title
- Provide a detailed description of the proposed feature
- Explain why this enhancement would be useful
- Include mockups or examples if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`:
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**:
   - Write or update tests as needed
   - Follow the existing code style
   - Update documentation if necessary
   - Keep changes focused and atomic

3. **Test your changes**:
   ```bash
   npm test              # Run tests
   npm run lint          # Check linting
   npm run build         # Verify build
   ```

4. **Commit your changes**:
   - Use clear, descriptive commit messages
   - Follow conventional commits format:
     - `feat:` for new features
     - `fix:` for bug fixes
     - `docs:` for documentation changes
     - `style:` for formatting changes
     - `refactor:` for code refactoring
     - `test:` for test additions/updates
     - `chore:` for maintenance tasks

5. **Push to your fork** and submit a pull request:
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Wait for review**:
   - Address any feedback from maintainers
   - Keep your branch up to date with main
   - Be patient and respectful

## Development Setup

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

### Setup Instructions

1. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Cantorium-front.git
   cd Cantorium-front
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Avoid `any` type when possible
- Define interfaces for complex objects
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### React

- Use functional components with hooks
- Keep components focused and small
- Extract reusable logic into custom hooks
- Use proper prop types
- Follow React best practices

### Styling

- Use Tailwind CSS for styling
- Follow the existing design system
- Ensure responsive design
- Test on multiple screen sizes
- Maintain accessibility standards

### Testing

- Write tests for new features
- Update tests when modifying existing features
- Aim for meaningful test coverage
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern

## Project Structure

```
Cantorium-front/
├── src/
│   ├── components/       # Reusable React components
│   │   └── ui/          # UI components (buttons, modals, etc.)
│   ├── pages/           # Page components
│   ├── test/            # Test utilities and setup
│   ├── App.tsx          # Main application component
│   ├── auth.tsx         # Authentication logic
│   ├── config.ts        # Configuration utilities
│   ├── env.ts           # Environment validation
│   ├── performance.ts   # Performance monitoring
│   └── main.tsx         # Application entry point
├── .github/             # GitHub Actions workflows
├── public/              # Static assets
└── ...
```

## Commit Message Guidelines

Use conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Example:
```
feat(auth): add password reset functionality

- Add password reset form
- Implement email verification
- Update auth context with reset flow

Closes #123
```

## Questions?

If you have questions or need help:
- Open a discussion on GitHub
- Check existing documentation
- Reach out to maintainers

## License

By contributing to Cantorium, you agree that your contributions will be licensed under the same license as the project.

Thank you for contributing! 🎉
