import { RadarConfig } from '../radarConfig';
import { DA_THEME } from '../constants/colors';

export const daRadar: RadarConfig = {
  id: 'da',
  name: 'DA Tech Radar',
  theme: DA_THEME,
  data: `# Observere
- Deno 2.0 [Lang] (1) - Major update to Deno runtime with improved Node.js compatibility and performance
- Go [Lang] (1) - Statically typed compiled language designed for simplicity, reliability, and efficiency
- GraalVM [Plat] (3) - High-performance polyglot VM supporting multiple languages with ahead-of-time compilation
- Java 25 [Lang] (5) - Latest Java release with preview features and ongoing improvements
- Rust [Lang] (1) - Systems programming language with memory safety without garbage collection
- WebAssembly [Lang] (3) - Binary instruction format for stack-based VM, enables near-native performance in browsers
- Zig [Lang] (4) - Low-level systems language focusing on simplicity and compile-time code execution

# Prøve
- ArgoCD [Tool] (2) - GitOps continuous delivery tool for Kubernetes with declarative setup
- Backstage [Plat] (3) - Open platform for building developer portals and unifying infrastructure tooling
- Crossplane [Infra] (3) - Kubernetes-native infrastructure management using custom resource definitions
- Grafana [Tool] (1) - Multi-platform analytics and interactive visualization web application
- Helm [Tool] (1) - Package manager for Kubernetes applications using templated manifests
- Jaeger [Tool] (2) - Distributed tracing system for monitoring and troubleshooting microservices
- OpenTelemetry [Lib] (2) - Vendor-neutral observability framework for traces, metrics, and logs
- Pact [Tool] (2) - Contract testing framework for microservices and APIs
- Playwright [Tool] (1) - Modern end-to-end testing framework for web applications
- Prometheus [Tool] (2) - Systems monitoring and alerting toolkit with time-series database
- Terraform [Tool] (1) - Infrastructure as code tool for building, changing, and versioning infrastructure

# Bruke
- Deno [Lang] (3) - Secure JavaScript and TypeScript runtime built on V8 with native TypeScript support
- Docker [Tool] (1) - Platform for developing, shipping, and running applications in containers
- Elasticsearch [DB] (2) - Distributed search and analytics engine built on Apache Lucene
- ELSA [Plat] (2) - Enterprise logging and security analytics platform
- Flyway [Tool] (2) - Database migration tool with version control for schema changes
- Git [Tool] (1) - Distributed version control system for tracking changes in source code
- GitHub Actions [Tool] (1) - CI/CD platform integrated with GitHub for automating workflows
- Gradle [Tool] (1) - Build automation tool for multi-language software development
- GraphQL [Proto] (2) - Query language for APIs with flexible data fetching
- Istio [Infra] (2) - Service mesh providing traffic management, security, and observability
- Java 21 [Lang] (1) - Long-term support release with virtual threads and pattern matching
- Jest [Tool] (1) - JavaScript testing framework with focus on simplicity
- JSON [Format] (1) - Lightweight data interchange format that is easy to read and write
- JUnit [Tool] (1) - Unit testing framework for Java applications
- Kafka [Plat] (1) - Distributed event streaming platform for high-throughput data pipelines
- Keycloak [Plat] (2) - Open source identity and access management solution
- Kibana [Tool] (1) - Data visualization and exploration tool for Elasticsearch
- Kotlin [Lang] (1) - Modern statically typed language for JVM, Android, and multiplatform development
- Ktor [FW] (2) - Asynchronous framework for creating web applications in Kotlin
- Kubernetes [Plat] (1) - Container orchestration platform for automating deployment and scaling
- Logstash [Tool] (2) - Server-side data processing pipeline for ingesting and transforming data
- Maven [Tool] (1) - Build automation and dependency management tool for Java projects
- Nginx [Tool] (1) - High-performance web server and reverse proxy
- Node.js [Lang] (1) - JavaScript runtime built on Chrome's V8 engine for server-side applications
- OAuth2/OIDC [Proto] (1) - Industry-standard protocols for authorization and authentication
- OpenAPI [Proto] (1) - Specification for designing and documenting RESTful APIs
- OpenShift [Plat] (2) - Enterprise Kubernetes platform with developer and operational tools
- pnpm [Tool] (2) - Fast, disk space efficient package manager for Node.js
- PostgreSQL [DB] (1) - Advanced open source relational database with strong SQL compliance
- Python 3 [Lang] (1) - High-level interpreted language known for readability and versatility
- RabbitMQ [Plat] (1) - Message broker implementing AMQP for reliable message delivery
- React [Lib] (1) - JavaScript library for building user interfaces with component-based architecture
- REST [Proto] (1) - Architectural style for designing networked applications using HTTP
- SAST [Tool] (2) - Static Application Security Testing for analyzing source code vulnerabilities
- DAST [Tool] (2) - Dynamic Application Security Testing for runtime security analysis
- Dependabot [Tool] (1) - Automated dependency updates and security vulnerability alerts
- Dependency Management [Tool] (1) - Practices and tools for managing external libraries and versions
- Shell scripting [Lang] (1) - Command-line scripting for automation and system administration
- Spring Boot [FW] (1) - Java framework for building production-ready applications with minimal configuration
- SQL [Lang] (1) - Standardized language for managing and querying relational databases
- S3 [Plat] (1) - Object storage service offering scalability, availability, and security
- TypeScript [Lang] (1) - Typed superset of JavaScript that compiles to plain JavaScript
- Vault [Tool] (2) - Secrets management tool for securing, storing, and controlling access
- YAML [Format] (1) - Human-readable data serialization format commonly used for configuration

# Unngå
- Active MQ [Plat] (1) - Legacy message broker superseded by more modern alternatives
- Angular [FW] (2) - Full-featured web framework with steep learning curve and frequent breaking changes
- Apache Camel [FW] (2) - Integration framework with complex configuration and heavy dependencies
- FTP [Proto] (1) - Insecure file transfer protocol lacking encryption and modern features
- Java 8 [Lang] (1) - Outdated Java version lacking modern language features and security updates
- Java 11 [Lang] (2) - Older LTS release superseded by Java 17 and 21
- Java 17 [Lang] (3) - Previous LTS release, migrate to Java 21 for latest features
- Jenkins [Tool] (1) - Legacy CI/CD tool with complex plugin management and maintenance overhead
- jQuery [Lib] (1) - DOM manipulation library obsoleted by modern JavaScript and frameworks
- Python 2 [Lang] (1) - Deprecated Python version with no security updates since 2020
- SOAP [Proto] (1) - Heavyweight protocol with complex XML processing, use REST or GraphQL
- Vue [FW] (3) - Component framework with smaller ecosystem compared to React
- XML over JSON [Format] (1) - Verbose format with parsing overhead, prefer JSON for data interchange
`
};
