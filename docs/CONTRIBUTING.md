# Contributing to the Rigger Ecosystem

## Welcome Contributors! 👋

Thank you for your interest in contributing to the Rigger ecosystem! This guide covers contribution guidelines for all repositories within the ChaseWhiteRabbit NGO's Rigger platform.

## 🎯 About ChaseWhiteRabbit NGO

ChaseWhiteRabbit NGO is committed to empowering blue-collar workers through ethical, enterprise-grade technology solutions. Our mission is to create tools that:

- **Empower Workers**: Provide meaningful job opportunities and career advancement
- **Ensure Ethics**: Maintain algorithmic fairness and data privacy
- **Promote Safety**: Prioritize worker safety and well-being
- **Support Growth**: Enable professional development and skill building

## 📋 Repository Structure

Our ecosystem consists of multiple interconnected repositories:

### Core Repositories
- **[RiggerBackend](../RiggerBackend/)** - Node.js/TypeScript API server
- **[RiggerShared](../RiggerShared/)** - Shared libraries and utilities
- **[RiggerConnect-web](../RiggerConnect-web/)** - Web application for workers
- **[RiggerHub-web](../RiggerHub-web/)** - Administrative web interface

### Mobile Applications
- **[RiggerConnect-android](../RiggerConnect-android/)** - Native Android app
- **[RiggerConnect-ios](../RiggerConnect-ios/)** - Native iOS app
- **[RiggerConnect-capacitor](../RiggerConnect-capacitor/)** - Hybrid mobile app
- **[RiggerHub-android](../RiggerHub-android/)** - Android admin app
- **[RiggerHub-ios](../RiggerHub-ios/)** - iOS admin app

## 🚀 Getting Started

### 1. Choose Your Contribution Area

#### 🖥️ Backend Development
- **Technologies**: Node.js, TypeScript, PostgreSQL, Redis
- **Skills**: API design, database architecture, security
- **Repository**: `RiggerBackend`

#### 📱 Mobile Development
**Android**
- **Technologies**: Kotlin, Jetpack Compose, Room, Retrofit
- **Skills**: Android SDK, Material Design, performance optimization
- **Repository**: `RiggerConnect-android`, `RiggerHub-android`

**iOS**
- **Technologies**: Swift, SwiftUI, Core Data, URLSession
- **Skills**: iOS SDK, Human Interface Guidelines, App Store guidelines
- **Repository**: `RiggerConnect-ios`, `RiggerHub-ios`

**Cross-Platform**
- **Technologies**: Capacitor, Ionic, TypeScript
- **Skills**: Hybrid app development, web technologies
- **Repository**: `RiggerConnect-capacitor`

#### 🌐 Web Development
- **Technologies**: React, Next.js, TypeScript, Tailwind CSS
- **Skills**: Modern web development, responsive design, accessibility
- **Repository**: `RiggerConnect-web`, `RiggerHub-web`

#### 📚 Shared Libraries
- **Technologies**: TypeScript, Jest, ESLint
- **Skills**: Library design, API consistency, testing
- **Repository**: `RiggerShared`

### 2. Set Up Development Environment

#### Prerequisites
```bash
# Required for all repositories
git clone <repository-url>
cd <repository-name>

# Follow repository-specific setup guides
# See docs/development/developer-setup.md in each repo
```

#### Development Tools
- **Git**: Version control with GitFlow branching model
- **Docker**: Containerization for consistent environments
- **VS Code**: Recommended IDE with project-specific extensions
- **Node.js**: v18+ for JavaScript/TypeScript projects

## 📝 Contribution Process

### 1. Issue Identification

#### Finding Issues
- **Good First Issues**: Look for `good-first-issue` labels
- **Help Wanted**: Check `help-wanted` tagged issues
- **Bug Reports**: Address confirmed bugs
- **Feature Requests**: Implement approved new features

#### Creating New Issues
```markdown
**Issue Template:**

## Issue Type
- [ ] Bug Report
- [ ] Feature Request
- [ ] Documentation Update
- [ ] Performance Improvement
- [ ] Security Issue

## Description
Clear description of the issue or feature.

## Expected Behavior
What should happen?

## Current Behavior
What actually happens?

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Environment
- OS: [e.g., macOS 13.0]
- Browser: [e.g., Chrome 115]
- App Version: [e.g., 1.2.3]
- Device: [e.g., iPhone 14, Samsung Galaxy S23]

## Additional Context
Screenshots, logs, or other relevant information.
```

### 2. Development Workflow

#### Branching Strategy
```bash
# 1. Fork the repository (first-time contributors)
# 2. Clone your fork
git clone git@github.com:yourusername/repository-name.git

# 3. Add upstream remote
git remote add upstream git@github.com:chasewhiterabbit/repository-name.git

# 4. Create feature branch
git checkout -b feature/descriptive-feature-name

# 5. Make your changes
# 6. Commit with conventional commits
git add .
git commit -m "feat: add job search filtering functionality"

# 7. Push to your fork
git push origin feature/descriptive-feature-name

# 8. Create pull request
```

#### Conventional Commit Messages
```bash
# Format: type(scope): description

# Types:
feat: new feature
fix: bug fix
docs: documentation changes
style: formatting, missing semicolons, etc.
refactor: code restructuring
test: adding tests
chore: maintenance tasks

# Examples:
feat(auth): add OAuth2 integration
fix(api): resolve user profile update bug
docs(readme): update installation instructions
test(jobs): add unit tests for job matching
```

### 3. Code Standards

#### Code Quality Requirements
- **Linting**: Code must pass ESLint/Detekt checks
- **Formatting**: Use Prettier/KtLint for consistent formatting
- **Testing**: Maintain or improve test coverage (>80%)
- **Documentation**: Update relevant documentation
- **Security**: Follow security best practices

#### Language-Specific Guidelines

**TypeScript/JavaScript**
```typescript
// Use explicit types
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// Prefer async/await over promises
async function fetchUserProfile(id: string): Promise<UserProfile> {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

// Use meaningful variable names
const isUserAuthenticated = checkAuthStatus();
const userJobRecommendations = await getRecommendations(userId);
```

**Kotlin (Android)**
```kotlin
// Use data classes for models
data class JobListing(
    val id: String,
    val title: String,
    val description: String,
    val location: Location
)

// Follow Jetpack Compose patterns
@Composable
fun JobListItem(
    job: JobListing,
    onJobClick: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.clickable { onJobClick(job.id) }
    ) {
        // Compose UI implementation
    }
}
```

**Swift (iOS)**
```swift
// Use structs for data models
struct JobListing: Codable, Identifiable {
    let id: String
    let title: String
    let description: String
    let location: Location
}

// Follow SwiftUI patterns
struct JobListView: View {
    @StateObject private var viewModel = JobListViewModel()
    
    var body: some View {
        NavigationView {
            List(viewModel.jobs) { job in
                JobRowView(job: job)
            }
        }
    }
}
```

### 4. Testing Requirements

#### Test Coverage Standards
- **Unit Tests**: 80%+ coverage for business logic
- **Integration Tests**: API endpoints and data flows
- **UI Tests**: Critical user journeys
- **E2E Tests**: Complete workflows

#### Testing Examples

**Backend (Jest)**
```typescript
describe('JobService', () => {
  let jobService: JobService;
  let mockRepository: jest.Mocked<JobRepository>;

  beforeEach(() => {
    mockRepository = createMockRepository();
    jobService = new JobService(mockRepository);
  });

  it('should create job with valid data', async () => {
    const jobData = createValidJobData();
    const expectedJob = createExpectedJob();
    
    mockRepository.create.mockResolvedValue(expectedJob);
    
    const result = await jobService.createJob(jobData);
    
    expect(result).toEqual(expectedJob);
    expect(mockRepository.create).toHaveBeenCalledWith(jobData);
  });
});
```

**Android (JUnit)**
```kotlin
@Test
fun `createJob with valid data should return success`() = runTest {
    // Given
    val jobData = createValidJobData()
    val expectedJob = createExpectedJob()
    coEvery { repository.createJob(jobData) } returns Result.success(expectedJob)
    
    // When
    val result = jobService.createJob(jobData)
    
    // Then
    assertTrue(result.isSuccess)
    assertEquals(expectedJob, result.getOrNull())
}
```

**iOS (XCTest)**
```swift
func testCreateJobWithValidData() async throws {
    // Given
    let jobData = createValidJobData()
    let expectedJob = createExpectedJob()
    mockRepository.createJobResult = .success(expectedJob)
    
    // When
    let result = await jobService.createJob(jobData)
    
    // Then
    XCTAssertEqual(result, expectedJob)
}
```

## 🔒 Security Guidelines

### Security Best Practices
1. **Never commit secrets**: Use environment variables
2. **Validate input**: Sanitize all user inputs
3. **Use HTTPS**: All external communications must be encrypted
4. **Implement authentication**: Proper JWT token handling
5. **Follow OWASP guidelines**: Regular security audits

### Reporting Security Issues
**DO NOT** create public issues for security vulnerabilities.

Instead, email: **security@chasewhiterabbit.org**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Suggested fix (if known)

## 📚 Documentation Standards

### Documentation Requirements
- **README**: Clear setup and usage instructions
- **API Documentation**: OpenAPI/Swagger specifications
- **Code Comments**: Document complex business logic
- **Architecture Docs**: System design and patterns
- **User Guides**: End-user documentation

### Documentation Style
```markdown
# Use Clear Headings

## Be Specific and Actionable

### Provide Examples
```bash
# Commands should be copy-pasteable
npm install
npm run dev
```

**Use consistent formatting:**
- `code` for inline code
- **bold** for emphasis  
- *italic* for definitions
- > blockquotes for important notes

> **Note**: Always test your documentation by following it step-by-step.
```

## 🌟 Recognition Program

### Contributor Recognition
- **First-time contributors**: Welcome package and mentorship
- **Regular contributors**: Listed in project acknowledgments
- **Core contributors**: Invited to project planning discussions
- **Outstanding contributions**: Featured in NGO newsletters

### Contribution Levels
- **🌱 Newcomer**: First successful contribution
- **🌿 Regular**: 5+ merged contributions
- **🌳 Seasoned**: 15+ contributions or major feature
- **🏆 Core**: Ongoing project maintenance

## 🤝 Community Guidelines

### Code of Conduct
We are committed to providing a welcoming and inclusive environment:

1. **Be Respectful**: Treat all community members with dignity
2. **Be Collaborative**: Work together to achieve common goals
3. **Be Patient**: Help newcomers learn and grow
4. **Be Constructive**: Provide helpful feedback and suggestions
5. **Be Ethical**: Align with our NGO's mission and values

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Email**: security@chasewhiterabbit.org for security issues
- **Email**: contributors@chasewhiterabbit.org for contributor questions

## 🎉 Onboarding Checklist

### New Contributor Checklist
- [ ] Read this contributing guide
- [ ] Set up development environment
- [ ] Join communication channels
- [ ] Find a good first issue
- [ ] Introduce yourself in GitHub Discussions
- [ ] Make your first contribution
- [ ] Celebrate! 🎉

### Repository-Specific Setup
Each repository has its own setup guide:
- [ ] Follow `docs/development/developer-setup.md`
- [ ] Install required dependencies
- [ ] Run tests to verify setup
- [ ] Build project successfully

## 📞 Getting Help

### Resources
- **Documentation**: Each repo's `/docs` folder
- **Examples**: Check `/examples` directories
- **Tests**: Look at existing tests for patterns
- **Issues**: Search existing issues for similar problems

### Support Channels
- **Technical Questions**: Create GitHub issue with `question` label
- **Bug Reports**: Use bug report template
- **Feature Ideas**: Start a GitHub Discussion
- **Security Issues**: Email security@chasewhiterabbit.org

## 🚀 Advanced Contributions

### Architecture Contributions
- **System Design**: Propose architectural improvements
- **Performance**: Optimize critical paths
- **Scalability**: Design for growth
- **Security**: Enhance security measures

### Leadership Opportunities
- **Mentoring**: Help new contributors
- **Code Review**: Review pull requests
- **Documentation**: Improve project documentation
- **Planning**: Participate in roadmap discussions

---

## Thank You! 🙏

Your contributions help empower blue-collar workers worldwide. Every line of code, documentation update, and bug report makes a difference in someone's career journey.

**Together, we're building ethical technology that puts workers first.**

---

*ChaseWhiteRabbit NGO - Empowering Blue-Collar Excellence Through Ethical Technology*

For questions about this guide, please open an issue or contact contributors@chasewhiterabbit.org
