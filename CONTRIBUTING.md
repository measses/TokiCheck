# Contributing to TOKİCheck

First off, thank you for considering contributing to TOKİCheck! It's people like you that make TOKİCheck such a great tool for Turkish citizens evaluating their TOKİ housing options.

## 🌟 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed and what behavior you expected**
* **Include screenshots if relevant**
* **Include your environment details** (browser, OS, device)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a detailed description of the suggested enhancement**
* **Provide specific examples to demonstrate the use case**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the TypeScript styleguide
* Include thoughtfully-worded, well-structured tests
* Document new code
* End all files with a newline

## 🏗️ Development Process

### Setting Up Your Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/TokiCheck.git
   cd TokiCheck
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a branch:
   ```bash
   git checkout -b feature/my-new-feature
   ```

### Project Structure

```
TokiCheck/
├── apps/
│   └── web/              # Next.js application
├── packages/
│   ├── engine/           # Pure TypeScript calculation engine
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared configurations
```

### Coding Standards

#### TypeScript

* Use TypeScript for all new code
* Avoid `any` types - use proper type definitions
* Use meaningful variable and function names
* Document complex functions with JSDoc comments

#### Naming Conventions

* **Files**: Use kebab-case (e.g., `installment-calculator.ts`)
* **Functions**: Use camelCase (e.g., `calculateMonthlyPayment`)
* **Types/Interfaces**: Use PascalCase (e.g., `InstallmentConfig`)
* **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_LOAN_TERM`)

#### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
* `feat`: A new feature
* `fix`: A bug fix
* `docs`: Documentation only changes
* `style`: Changes that don't affect code meaning (formatting, etc.)
* `refactor`: Code change that neither fixes a bug nor adds a feature
* `perf`: Performance improvement
* `test`: Adding missing tests or correcting existing tests
* `chore`: Changes to build process or auxiliary tools

**Examples:**
```
feat(engine): add inflation-adjusted installment calculator

fix(ui): correct chart tooltip formatting for large numbers

docs(readme): update installation instructions
```

### Testing

* Write unit tests for all calculation logic in `packages/engine`
* Write integration tests for API routes
* Run tests before submitting PR:
  ```bash
  npm test
  ```

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## 📝 Documentation

* Update README.md if you change functionality
* Update inline code documentation
* Add JSDoc comments for public APIs
* Update Turkish (TR) and English (EN) translations

## 🌍 Internationalization (i18n)

* All user-facing strings must be translatable
* Add translations in both Turkish and English
* Translation files are located in `apps/web/locales/`

## 🧪 Code Review Process

1. All submissions require review
2. Reviewers may ask questions, request changes, or approve
3. Address reviewer feedback by pushing new commits
4. Once approved, maintainers will merge your PR

## 🎯 Priority Areas

We especially welcome contributions in these areas:

1. **Calculation Engine**: Improving accuracy, adding new scenarios
2. **Data Sources**: Integrating official data sources (TCMB, TÜİK APIs)
3. **UI/UX**: Making the tool more intuitive and accessible
4. **Testing**: Increasing test coverage
5. **Documentation**: Improving guides and examples
6. **Accessibility**: Making the tool usable for everyone
7. **Performance**: Optimizing calculation and rendering speed

## 💬 Community

* Be respectful and inclusive (see [Code of Conduct](CODE_OF_CONDUCT.md))
* Ask questions in GitHub Discussions or Issues
* Help others when you can

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Your contributions to open source, large or small, make projects like this possible. Thank you for taking the time to contribute.

---

**Türkçe katkı rehberi için lütfen [CONTRIBUTING.tr.md](CONTRIBUTING.tr.md) dosyasına bakın.**
