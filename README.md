# RiggerShared

<div align="center">

### **A ChaseWhiteRabbit NGO Initiative**
*Shared Libraries and Components for Rigger Ecosystem*

[![GitLab CI/CD](https://gitlab.sxc.codes/tiation/RiggerShared/badges/main/pipeline.svg)](https://gitlab.sxc.codes/tiation/RiggerShared/-/pipelines)
[![Build Status](https://github.com/tiation/RiggerShared/workflows/CI/badge.svg)](https://github.com/tiation/RiggerShared/actions)
[![Security Rating](https://img.shields.io/badge/security-A+-brightgreen)](docs/security/)
[![Ethics Compliance](https://img.shields.io/badge/ethics-compliant-blue)](docs/ethics/)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

```ascii
    🔧 SHARED FOUNDATION FOR ENTERPRISE GRADE 🔧
    ╔════════════════════════════════════════════╗
    ║  CONSISTENCY • EFFICIENCY • MODULARITY                          ║
    ╚════════════════════════════════════════════╝
    📦 COMPONENTS • 🔄 REUSABLE • 🏗️ MODULAR • ⚡ EFFICIENT
```

</div>

## 🎯 Project Overview

RiggerShared houses pivotal shared libraries and components forming the backbone of Rigger's entire ecosystem. These standardized modules optimize resource utilization and simplify consistent functionality across RiggerConnect, RiggerHub, and related platforms.

### 🌟 Key Features
- 🚀 **Modern Architecture** - Built with latest technologies and best practices
- 🔒 **Enterprise Security** - Multi-layer security with encryption and access control
- ⚡ **High Performance** - Optimized for speed and scalability
- 🌟 **Ethical Design** - Privacy-first, bias-free, worker-empowering technology

## 🔗 Related Repositories

### Core Platform Components

| Repository | Platform | Description | GitHub SSH URL |
|------------|----------|-------------|----------------|
| **RiggerConnect-web** | Web | Business-focused recruitment platform | `git@github.com:tiation/RiggerConnect-web.git` |
| **RiggerConnect-android** | Android | Mobile business management app | `git@github.com:tiation/RiggerConnect-android.git` |
| **RiggerConnect-ios** | iOS | Mobile business management app | `git@github.com:tiation/RiggerConnect-ios.git` |
| **RiggerConnect-capacitor** | Cross-platform | Cross-platform mobile framework | `git@github.com:tiation/RiggerConnect-capacitor.git` |
| **RiggerHub-web** | Web | Worker-focused job search platform | `git@github.com:tiation/RiggerHub-web.git` |
| **RiggerHub-android** | Android | Mobile worker app | `git@github.com:tiation/RiggerHub-android.git` |
| **RiggerHub-ios** | iOS | Mobile worker app | `git@github.com:tiation/RiggerHub-ios.git` |
| **RiggerBackend** | API/Backend | Core backend services and APIs | `git@github.com:tiation/RiggerBackend.git` |
| **RiggerShared** | Multi-platform | Shared libraries and components | `git@github.com:tiation/RiggerShared.git` |

### Enterprise Integration Architecture

```mermaid
graph TB
    RB[RiggerBackend<br/>Core API Services] --> RCW[RiggerConnect-web]
    RB --> RCA[RiggerConnect-android]
    RB --> RCI[RiggerConnect-ios]
    RB --> RHW[RiggerHub-web]
    RB --> RHA[RiggerHub-android]
    RB --> RHI[RiggerHub-ios]
    RS[RiggerShared<br/>Common Libraries] --> RCW
    RS --> RCA
    RS --> RCI
    RS --> RHW
    RS --> RHA
    RS --> RHI
    
    style RS fill:#00FF00,color:#000
    style RB fill:#FF00FF,color:#000
    style RCW fill:#00FFFF,color:#000
```

### ChaseWhiteRabbit NGO License Framework

All repositories in the Rigger ecosystem are licensed under **GPL v3**, ensuring:
- ✅ **Open Source Transparency**: Complete code visibility and community auditing
- ✅ **Ethical Technology Standards**: Algorithmic fairness and bias prevention
- ✅ **Worker Empowerment Focus**: Technology serving users, not corporate profits
- ✅ **Community Ownership**: Improvements benefit the entire rigger community
- ✅ **Corporate Responsibility**: Commercial use must remain open and accessible

## 📍 Repository Location & Structure

**Current Location**: `/Users/tiaastor/Github/tiation-repos/RiggerShared/`

This repository is part of the **Tiation Enterprise Repository Structure**, specifically designed to house **ChaseWhiteRabbit NGO's** technology initiatives following enterprise-grade development practices.

### 🏗️ Enterprise Ecosystem
- **Repository Collection**: [Enterprise Repository Index](../ENTERPRISE_REPOSITORY_INDEX.md)
- **Related Projects**: [List related repositories]
- **Infrastructure**: Hosted on Hostinger VPS cluster with enterprise DevOps practices

### 🌟 NGO Integration
As a **ChaseWhiteRabbit NGO Initiative**, this project adheres to:
- ✅ **Enterprise-grade development practices**
- ✅ **Ethical technology standards**
- ✅ **Worker empowerment focus**
- ✅ **DevOps best practices with CI/CD**
- ✅ **Open development transparency**

## 🚀 Technology Stack

| Technology | Version | Purpose |
|------------|---------|------------|
| Node.js, TypeScript | Latest | Core technology stack |
| TypeScript | Latest | Core technology stack |
| ESLint | Latest | Core technology stack |
| Prettier | Latest | Core technology stack |

## ⚡ Quick Start

### Prerequisites
- System requirements as per documentation
- Development tools and dependencies
- Configuration and setup requirements

### Installation

```bash
# Clone the repository
git clone git@github.com:tiation/RiggerShared.git
cd RiggerShared

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Development Workflow

```bash
# Development server with hot reload
npm run dev

# Type checking
npm run type-check

# Linting and formatting
npm run lint
npm run format

# Testing
npm test
npm run test:coverage

# Build for production
npm run build
```

## 🏗️ Architecture Overview

### System Design
Modern, scalable architecture following enterprise best practices

### Core Components
- Core application logic
- User interface components
- Data management layer

### Integration Points
- Database integration
- Authentication system
- API endpoints

## 📚 Documentation

| Resource | Description |
|----------|-------------|
| [🚀 Setup Guide](docs/setup/) | Development environment setup |
| [🏗️ Architecture](docs/architecture/) | System design and patterns |
| [🚀 Deployment](docs/deployment/) | Production deployment guide |
| [🔧 Troubleshooting](docs/troubleshooting/) | Common issues and solutions |
| [⚖️ Ethics Framework](docs/ethics/) | Responsible AI and ethical guidelines |

## 🔄 CI/CD Pipeline

Our enterprise-grade deployment pipeline ensures reliable, automated delivery:

| Environment | Trigger | Deployment Target | Purpose |
|-------------|---------|-------------------|----------|
| **Development** | Pull Request | Development Server | Feature testing and review |
| **Staging** | Merge to `develop` | Staging Environment | Pre-production validation |
| **Production** | Merge to `main` | Production Cluster | Live application deployment |

### Infrastructure Partners
- **Primary CI/CD**: docker.sxc.codes (145.223.22.7)
- **Kubernetes Management**: helm.sxc.codes (145.223.21.248)
- **GitLab CI/CD**: gitlab.sxc.codes (145.223.22.10)
- **Monitoring**: grafana.sxc.codes (153.92.214.1)

## 🔒 Security & Compliance

### Security Features
- **Authentication**: JWT-based authentication with multi-factor support
- **Data Protection**: End-to-end encryption and GDPR compliance
- **Access Control**: Role-based access control (RBAC)
- **Encryption**: AES-256 encryption for data at rest and in transit

### Ethical AI Standards
- **Bias Prevention**: Regular algorithmic auditing
- **Explainable Decisions**: Transparent recommendation logic
- **Human Oversight**: Manual review capabilities
- **Privacy by Design**: Data minimization and user control

## 🧪 Testing & Quality Assurance

```bash
# Run all tests
npm test

# Coverage report
npm run test:coverage

# E2E testing
npm run test:e2e

# Performance testing
npm run test:perf

# Security audit
npm run security:audit
```

### Quality Standards
- **Code Coverage**: 90%+ test coverage
- **Performance**: < 200ms response time, 99.9% uptime
- **Security**: OWASP Top 10 compliance, regular security audits
- **Accessibility**: WCAG 2.1 AA compliant

## 🤝 Contributing

We welcome contributions from the community! Please read our contributing guidelines before submitting pull requests.

### Development Guidelines
1. Follow the [ChaseWhiteRabbit NGO Code of Conduct](docs/CODE_OF_CONDUCT.md)
2. Use the established [coding standards](docs/setup/coding-standards.md)
3. Include tests for all new features
4. Update documentation for changes
5. Ensure accessibility compliance

### Pull Request Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper testing
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request with detailed description

### Getting Started with Contributing
- Check out our [Good First Issues](https://github.com/tiation/RiggerShared/labels/good%20first%20issue)
- Read the [Development Setup Guide](docs/setup/)
- Join our [Community Discussions](https://github.com/tiation/RiggerShared/discussions)

## 🌍 Social Impact

Supporting ChaseWhiteRabbit NGO's mission through:
- Professional development through ethical technology
- Worker empowerment and career advancement
- Community building and knowledge sharing
- Ethical AI and bias prevention

## 👥 Contact & Team

### Project Leaders

**Jack Jonas** - Karratha Crane Operator & Industry Expert  
📧 [jackjonas95@gmail.com](mailto:jackjonas95@gmail.com)  
🏗️ **Industry Expertise**: Seasoned rigger, crane operator, and heavy vehicle mechanic based in Karratha, Western Australia. Jack's extensive experience across the rigging ecosystem ensures our shared libraries and components address the real modularity and consistency needs that enable effective resource utilization and standardized functionality across all platform applications.

**Tia** - ChaseWhiteRabbit NGO Technical Leadership  
📧 [tiatheone@protonmail.com](mailto:tiatheone@protonmail.com)  
🌟 **NGO Mission-Driven Leadership**: Swedish software developer and founder of ChaseWhiteRabbit NGO, dedicated to creating shared foundations for enterprise-grade systems. Tia's mission-driven approach ensures our shared libraries optimize efficiency while maintaining the ethical design principles and worker empowerment focus that define the entire Rigger ecosystem.

## 📞 Support & Contact

### Technical Support
- 📧 **Project Support**: support@chasewhiterabbit.org
- 🔒 **Security Issues**: security@chasewhiterabbit.org
- 📖 **Documentation**: docs@chasewhiterabbit.org
- ⚖️ **Ethics Concerns**: ethics@chasewhiterabbit.org

### ChaseWhiteRabbit NGO
- 🌐 **Website**: [chasewhiterabbit.org](https://chasewhiterabbit.org)
- 📧 **Contact**: info@chasewhiterabbit.org
- 🐦 **Twitter**: [@ChaseWhiteRabbitNGO](https://twitter.com/ChaseWhiteRabbitNGO)

### Development Team
- 🔧 **Technical Lead**: tiatheone@protonmail.com
- 🌐 **Enterprise Inquiries**: jackjonas95@gmail.com

## 🤝 Project Team & Purpose

This project is part of a broader suite of repositories aimed at supporting the **transient rigging and heavy lifting industry** in Western Australia and beyond.

🔗 **Related Repositories**:

* [`RiggerConnect-web`](https://github.com/ChaseWhiteRabbit/RiggerConnect-web) - Professional networking platform for construction workers
* [`RiggerConnect-android`](https://github.com/ChaseWhiteRabbit/RiggerConnect-android) - Native Android mobile networking application
* [`RiggerConnect-ios`](https://github.com/ChaseWhiteRabbit/RiggerConnect-ios) - Native iOS mobile networking application
* [`RiggerConnect-capacitor`](https://github.com/ChaseWhiteRabbit/RiggerConnect-capacitor) - Cross-platform mobile app built with Ionic Capacitor
* [`RiggerHub-web`](https://github.com/ChaseWhiteRabbit/RiggerHub-web) - Operations management hub for business users
* [`RiggerHub-android`](https://github.com/ChaseWhiteRabbit/RiggerHub-android) - Native Android operations management application
* [`RiggerHub-ios`](https://github.com/ChaseWhiteRabbit/RiggerHub-ios) - Native iOS operations management application
* [`RiggerShared`](https://github.com/ChaseWhiteRabbit/RiggerShared) - Shared libraries, components, and utilities
* [`RiggerBackend`](https://github.com/ChaseWhiteRabbit/RiggerBackend) - Core backend services and APIs for the Rigger ecosystem

📬 **Contact**:
For questions, ideas, or collaboration inquiries, please reach out to:

* **Jack Jonas** – [jackjonas95@gmail.com](mailto:jackjonas95@gmail.com)
* **Tia** – [tiatheone@protonmail.com](mailto:tiatheone@protonmail.com)

---

### 🙌 About the Founders

**Jack Jonas** is a seasoned rigger, crane operator, and heavy vehicle mechanic based in Karratha, Western Australia. His firsthand experience in the field shapes the practical backbone of this platform.

**Tia** is a Swedish software developer and founder of the NGO **ChaseWhiteRabbit**, which is dedicated to building inclusive, systemic solutions to complex challenges.

Together, they created this SaaS platform to:

* Help connect riggers, doggers, and crane operators to real work opportunities.
* Support better logistics, transparency, and compliance in the field.
* Fund and sustain the good work being done by **ChaseWhiteRabbit** in disadvantaged communities.

## 🌟 Project Vision: Empowering Industry Through Ethical Technology

### How This Platform Serves Jack Jonas and the Rigging Industry

RiggerShared provides the foundational shared libraries and components crucial for the interoperability and efficiency of the entire Rigger ecosystem. For industry specialists like Jack Jonas, these shared modules ensure:

- **Consistent Worker Tools**: Harmonized libraries that provide a seamless experience across the RiggerConnect and RiggerHub platforms
- **Optimized Resource Utilization**: Modular components that reduce duplication and enhance resource efficiency in dealing with diverse user interactions
- **Scalable Development Practices**: Shared codebases that allow for rapid feature deployment and compliance with industry needs
- **Standardized Compliance Methods**: Integrated libraries that automate and simplify adherence to safety standards and operational protocols
- **Robust Interoperability**: Components designed to interlink smoothly with the wider Rigger platform apps and services

### Supporting ChaseWhiteRabbit NGO's Charitable Mission

Utilizing RiggerShared libraries across the ecosystem generates sustainable funding for ChaseWhiteRabbit NGO's charitable initiatives:

- **Modular Impact**: Shared technology solutions free up resources, enabling investment in NGO initiatives focused on community growth and empowerment
- **Code Reuse Efficiency**: Resource savings through shared solutions support broader NGO missions for workforce development and community empowerment
- **Community Contributions**: Open-source shared code attracts contributions and fosters a community-driven improvement ecosystem, supporting NGO goals
- **Equitable Technological Growth**: Platform stability through shared foundations supports educational programs promoting digital literacy and vocational proficiency
- **Framework for Advocacy**: Revenue from shared technology efficiency is reinvested in policy work, enhancing worker protections and fair industry labor standards

### Ethical, Accessible, and Worker-First Technology

RiggerShared embodies ChaseWhiteRabbit NGO's commitment to a robust, scalable, and ethical foundation for blue-collar excellence:

**🔍 Ethical by Design**
- GPL v3 licensing ensures transparency and prevents proprietary exploitation of collaborative efforts and shared resources
- Fair use of modular components ensures equitable resource distribution across platform applications
- Privacy-first architectural patterns respecting user data and operational information security
- Built-in safeguards in modular design protecting against algorithmic biases across all dependent applications

**♿ Accessibility as a Core Value**
- Shared components designed with accessibility at heart, supporting consistently accessible user interfaces across all platforms
- Multi-language support infrastructure recognizing Australia's diverse workforce communities
- Offline-capable shared libraries reflecting remote field usage requirements
- Performance optimization for low-bandwidth and high-demand environments common in industrial settings

**👷 Worker-Focused Philosophy**
- Platform-level consistency ensures workers engage with familiar tools regardless of application within the ecosystem
- Transparent contribution systems for workers and community members to suggest and participate in shared component development
- Recognition systems incorporating peer and community feedback to shape the evolution of shared resources
- Modular design that values practical usability and worker experience over technical complexity

RiggerShared proves that a well-architected, enterprise-grade suite of shared tools can support business needs while empowering workers and contributing to social good, demonstrating that ethical technology practices foster resilience, efficiency, and scalability.

## 📧 Contact Information

### Primary Maintainers

For inquiries related to the Rigger ecosystem, please contact our primary maintainers:

- **Jack Jonas**: [jackjonas95@gmail.com](mailto:jackjonas95@gmail.com)
- **Tia Astor**: [tiatheone@protonmail.com](mailto:tiatheone@protonmail.com)

These maintainers oversee the development and coordination of the entire Rigger platform ecosystem, including RiggerConnect, RiggerHub, RiggerBackend, and RiggerShared repositories.

## 📜 License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

### Open Source Commitment
As a **ChaseWhiteRabbit NGO** initiative, we believe in:
- **Transparency**: All code is open and auditable
- **Community Ownership**: Improvements benefit the entire community
- **Ethical Technology**: No vendor lock-in or proprietary restrictions
- **Worker Empowerment**: Technology that serves users, not profits

## 🙏 Acknowledgments

- **ChaseWhiteRabbit NGO** - For their vision and partnership in ethical technology
- **Tiation Team** - For technical excellence and innovative solutions
- **Open Source Community** - For the amazing tools and libraries that make this possible
- **Contributors** - Thank you to all who have contributed to this project

## 📈 Project Status

- **Current Version**: Latest
- **Development Status**: Active Development
- **Last Updated**: 2025-07-24
- **Next Milestone**: Feature completion and testing

---

<div align="center">

### 🏗️ **ChaseWhiteRabbit NGO Initiative** 🏗️

**Transforming Lives Through Ethical Technology**

```ascii
🔧 ENTERPRISE GRADE • ETHICAL • STRIKING DESIGN 🔧
```

[![ChaseWhiteRabbit NGO](https://img.shields.io/badge/ChaseWhiteRabbit-NGO-orange)](https://chasewhiterabbit.org)
[![Enterprise Grade](https://img.shields.io/badge/Enterprise-Grade-blue)](docs/)
[![Ethical Technology](https://img.shields.io/badge/Technology-Ethical-green)](docs/ethics/)
[![DevOps Ready](https://img.shields.io/badge/DevOps-Ready-purple)](docs/deployment/)

### 🌐 **Infrastructure & Hosting**

**Hostinger VPS Cluster** | **Enterprise-Grade DevOps**

- **🐳 Primary CI/CD**: docker.sxc.codes (145.223.22.7)
- **⚓ Helm Manager**: helm.sxc.codes (145.223.21.248) 
- **📊 Monitoring**: grafana.sxc.codes (153.92.214.1)
- **🗄️ Database**: supabase.sxc.codes (93.127.167.157)

---

**🏗️ RiggerShared - ChaseWhiteRabbit NGO Initiative 🏗️**

*Enterprise-grade technology empowering construction industry professionals*

[![Tiation Platform](https://img.shields.io/badge/🔮_Platform-Tiation-00FFFF?style=for-the-badge&labelColor=0A0A0A)](https://tiation.github.io/)
[![Project Badge](https://img.shields.io/badge/🏗️_RiggerShared-FF00FF?style=for-the-badge&labelColor=0A0A0A)](https://tiation.github.io/)
[![ChaseWhiteRabbit NGO](https://img.shields.io/badge/🌟_NGO-Mission-00FFFF?style=for-the-badge&labelColor=0A0A0A)](https://tiation.github.io/)

**Ethical • Enterprise • Empowering**

**[Discover More Projects →](https://tiation.github.io/)**

*"Technology should lift up workers, not replace them."*

</div>
