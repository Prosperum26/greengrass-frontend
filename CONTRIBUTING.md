# Contributing to Greengrass Frontend

Thank you for your interest in contributing to Greengrass! This document provides guidelines and best practices for contributing to this project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Code Style](#code-style)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Questions?](#questions)

---

## Getting Started

### Fork & Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/greengrass-frontend.git
cd greengrass-frontend
```

3. Add the upstream remote:

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/greengrass-frontend.git
```

4. Install dependencies:

```bash
yarn install
```

5. Copy environment file:

```bash
cp .env.example .env
```

6. Start the development server:

```bash
yarn dev
```

---

## Development Workflow

### 1. Sync with Upstream

Before starting work, ensure your fork is up-to-date:

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. Create a Branch

Create a new branch for your feature or fix:

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Write clean, maintainable code
- Follow the project's code style
- Add comments where necessary
- Update documentation if needed

### 4. Commit Changes

Commit your changes with a clear, descriptive message (see [Commit Messages](#commit-messages)):

```bash
git add .
git commit -m "feat: add user profile page"
```

### 5. Push & Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

---

## Branch Naming

Use the following prefixes for branch names:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` | New features | `feature/qr-scanner` |
| `fix/` | Bug fixes | `fix/login-redirect` |
| `chore/` | Maintenance tasks | `chore/update-deps` |
| `docs/` | Documentation | `docs/api-guide` |
| `refactor/` | Code refactoring | `refactor/auth-hook` |
| `test/` | Adding/updating tests | `test/event-form` |

---

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style (formatting, no logic change) |
| `refactor` | Code refactoring |
| `test` | Adding/updating tests |
| `chore` | Build process, dependencies, etc. |

### Examples

```bash
feat(events): add event registration form

fix(auth): resolve token refresh loop
docs(readme): update deployment instructions
style(components): format with prettier
refactor(api): consolidate error handling
chore(deps): update axios to v1.6
test(auth): add login form tests
```

---

## Code Style

### General Rules

- Use **2 spaces** for indentation
- Use **single quotes** for strings
- Add **trailing commas** in multi-line objects/arrays
- Maximum line length: **100 characters**

### React Components

```jsx
// Component naming: PascalCase
function EventCard({ event, onRegister }) {
  // Hooks at the top
  const [loading, setLoading] = useState(false);
  
  // Handlers
  const handleClick = () => {
    onRegister(event.id);
  };
  
  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <Button onClick={handleClick} disabled={loading}>
        Register
      </Button>
    </div>
  );
}

export default EventCard;
```

### Custom Hooks

```jsx
// Hook naming: camelCase with 'use' prefix
function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  const fetchEvents = async () => {
    setLoading(true);
    // ...
    setLoading(false);
  };
  
  return { events, loading, refetch: fetchEvents };
}
```

### Imports Order

```jsx
// 1. React & libraries
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 2. Absolute imports (features)
import { useAuth } from '../features/auth';
import { EventCard } from '../features/events';

// 3. Relative imports (same directory)
import { formatDate } from './utils';
import styles from './styles.module.css';
```

### Tailwind CSS

- Use Tailwind classes over custom CSS
- Group related classes logically
- Use custom colors from `tailwind.config.js`

```jsx
// Good
<div className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg">

// Avoid
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
```

---

## Pull Request Process

### Before Submitting

- [ ] Branch is up-to-date with `main`
- [ ] All tests pass (`yarn test`)
- [ ] Linting passes (`yarn lint`)
- [ ] Build succeeds (`yarn build`)
- [ ] Code is properly formatted
- [ ] No console errors or warnings
- [ ] Changes are documented

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Fixes #123
```

### Review Process

1. Automated checks must pass (CI/CD)
2. At least one code review approval required
3. Address all review comments
4. Maintainers will merge when ready

---

## Testing

### Running Tests

```bash
# Run all tests
yarn test

# Run with coverage
yarn test:coverage

# Watch mode
yarn test:watch
```

### Test Guidelines

- Write tests for new features
- Update tests when modifying existing code
- Aim for meaningful test coverage

---

## Questions?

- **General questions**: Open a [Discussion](https://github.com/ORIGINAL_OWNER/greengrass-frontend/discussions)
- **Bug reports**: Create an [Issue](https://github.com/ORIGINAL_OWNER/greengrass-frontend/issues)
- **Security issues**: Email security@greengrass.vn

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Greengrass! 🌱
