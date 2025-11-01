# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The Sosyal Konut App team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report a Security Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **GitHub Security Advisory** (Preferred)
   - Go to the Security tab of this repository
   - Click "Report a vulnerability"
   - Fill in the details

2. **Email**
   - Send an email to: [security contact to be added]
   - Include as much information as possible (see below)

### What to Include in Your Report

Please include the following information to help us better understand the nature and scope of the issue:

* Type of issue (e.g., buffer overflow, SQL injection, XSS, etc.)
* Full paths of source file(s) related to the manifestation of the issue
* The location of the affected source code (tag/branch/commit or direct URL)
* Any special configuration required to reproduce the issue
* Step-by-step instructions to reproduce the issue
* Proof-of-concept or exploit code (if possible)
* Impact of the issue, including how an attacker might exploit it

### What to Expect

* You will receive an acknowledgment within 48 hours
* We will investigate and validate the report
* We will keep you informed about the progress
* We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Best Practices for Contributors

When contributing to Sosyal Konut App, please follow these security practices:

### Code Security

* Never commit sensitive data (API keys, passwords, credentials)
* Use environment variables for configuration
* Validate and sanitize all user inputs
* Follow principle of least privilege
* Keep dependencies up to date

### Data Privacy

* Don't store personal financial data
* All calculations should happen client-side when possible
* If server-side processing is needed, ensure data is not logged or persisted
* Follow GDPR and Turkish KVKK (Personal Data Protection Law) principles

### Dependencies

* Regularly update dependencies
* Review dependency vulnerabilities using `npm audit`
* Use lock files (`package-lock.json`) to ensure reproducible builds

## Disclosure Policy

* We ask that you do not publicly disclose the issue until we've had a chance to address it
* We will work with you to understand and resolve the issue quickly
* Once the issue is resolved, we will publish a security advisory
* We will credit you for the discovery (unless you prefer anonymity)

## Security Update Process

1. Security issue is reported and confirmed
2. A patch is prepared in a private repository
3. A CVE number is requested (if applicable)
4. The patch is reviewed and tested
5. A security release is published
6. A security advisory is published
7. The reporter is credited

## Known Security Considerations

### Client-Side Calculations

Sosyal Konut App performs financial calculations primarily on the client-side. Users should be aware:

* Calculations are estimates and should not be considered financial advice
* Results should be verified with official TOKİ sources
* The tool is for informational purposes only

### No User Data Storage

* We do not store user calculation data
* Shared links may contain calculation parameters in the URL
* Users should avoid sharing links with sensitive personal information

## Security-Related Configuration

### Environment Variables

Never commit files containing:
* API keys
* Database credentials
* Secret tokens
* Private keys

Always use `.env.local` (which is gitignored) for local development secrets.

## Questions?

If you have questions about this security policy, please open a GitHub Discussion or contact the maintainers.

---

**Last Updated**: 2025-10-29
