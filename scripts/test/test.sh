#!/bin/bash

# =============================================================================
# RiggerShared - Enterprise Testing Script
# Comprehensive testing suite with coverage reporting and quality gates
# =============================================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
COVERAGE_DIR="$PROJECT_ROOT/coverage"
TEST_RESULTS_DIR="$PROJECT_ROOT/test-results"
TEST_TYPE="${TEST_TYPE:-all}"
COVERAGE_THRESHOLD="${COVERAGE_THRESHOLD:-80}"
PARALLEL_TESTS="${PARALLEL_TESTS:-true}"

# Test configuration
declare -a TEST_TYPES=("unit" "integration" "security" "performance" "accessibility" "cross-platform")

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

show_banner() {
    echo -e "${PURPLE}"
    cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║                🧪 RIGGERSHARED TEST SUITE                     ║
║                                                                ║
║              Enterprise-Grade Testing Pipeline                 ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

cleanup() {
    log "🧹 Cleaning up test artifacts..."
    # Clean up any temporary test files
    find "$PROJECT_ROOT" -name "*.test.tmp" -delete 2>/dev/null || true
    log_success "Test cleanup completed"
}

# Set trap for cleanup
trap cleanup EXIT

setup_test_environment() {
    log "🔧 Setting up test environment..."
    
    cd "$PROJECT_ROOT"
    
    # Create test directories
    mkdir -p "$COVERAGE_DIR"
    mkdir -p "$TEST_RESULTS_DIR"
    
    # Install test dependencies if not already installed
    if [[ ! -d "node_modules" ]]; then
        npm ci --silent
    fi
    
    # Set test environment variables
    export NODE_ENV=test
    export CI=true
    
    log_success "Test environment ready"
}

run_unit_tests() {
    log "🔬 Running unit tests..."
    
    cd "$PROJECT_ROOT"
    
    local test_cmd="npm run test:unit"
    
    # Add coverage if requested
    if [[ "$TEST_TYPE" == "all" || "$TEST_TYPE" == "coverage" ]]; then
        test_cmd="npm run test:unit:coverage"
    fi
    
    # Run tests with timeout
    timeout 600 $test_cmd || {
        log_error "Unit tests failed or timed out"
    }
    
    log_success "Unit tests completed"
}

run_integration_tests() {
    log "🔗 Running integration tests..."
    
    cd "$PROJECT_ROOT"
    
    # Start test services if docker-compose exists
    if [[ -f "docker-compose.test.yml" ]]; then
        log "Starting test services..."
        docker-compose -f docker-compose.test.yml up -d
        sleep 30 # Wait for services to be ready
    fi
    
    # Run integration tests
    timeout 900 npm run test:integration || {
        log_error "Integration tests failed or timed out"
    }
    
    # Clean up test services
    if [[ -f "docker-compose.test.yml" ]]; then
        docker-compose -f docker-compose.test.yml down --remove-orphans
    fi
    
    log_success "Integration tests completed"
}

run_security_tests() {
    log "🛡️ Running security tests..."
    
    cd "$PROJECT_ROOT"
    
    # Dependency security audit
    log "Running dependency security audit..."
    npm audit --audit-level moderate || {
        log_warning "Security vulnerabilities found in dependencies"
    }
    
    # Static security analysis with Semgrep (if available)
    if command -v semgrep &> /dev/null; then
        log "Running static security analysis..."
        semgrep --config=auto --json --output="$TEST_RESULTS_DIR/security-scan.json" . || {
            log_warning "Static security analysis found issues"
        }
    fi
    
    # Secret scanning (if available)
    if command -v gitleaks &> /dev/null; then
        log "Running secret scanning..."
        gitleaks detect --source="$PROJECT_ROOT" --report-path="$TEST_RESULTS_DIR/secrets-scan.json" || {
            log_warning "Secret scanning found potential issues"
        }
    fi
    
    # License compliance check
    if npm list license-checker --depth=0 &> /dev/null; then
        log "Checking license compliance..."
        npx license-checker --json --out "$TEST_RESULTS_DIR/license-report.json"
    fi
    
    log_success "Security tests completed"
}

run_performance_tests() {
    log "⚡ Running performance tests..."
    
    cd "$PROJECT_ROOT"
    
    # Performance tests (if script exists)
    if npm run test:performance --if-present &> /dev/null; then
        timeout 1200 npm run test:performance || {
            log_warning "Performance tests failed or timed out"
        }
    else
        log_info "No performance tests configured"
    fi
    
    # Bundle size analysis
    if [[ -d "dist" ]]; then
        log "Analyzing bundle sizes..."
        local bundle_size=$(du -sh dist | cut -f1)
        echo "Total bundle size: $bundle_size" > "$TEST_RESULTS_DIR/bundle-analysis.txt"
        
        # Check if bundle size exceeds threshold (example: 5MB)
        local size_bytes=$(du -sb dist | cut -f1)
        local threshold_bytes=$((5 * 1024 * 1024)) # 5MB in bytes
        
        if [[ $size_bytes -gt $threshold_bytes ]]; then
            log_warning "Bundle size ($bundle_size) exceeds threshold (5MB)"
        fi
    fi
    
    log_success "Performance tests completed"
}

run_accessibility_tests() {
    log "♿ Running accessibility tests..."
    
    cd "$PROJECT_ROOT"
    
    # Accessibility tests (if configured)
    if npm run test:a11y --if-present &> /dev/null; then
        npm run test:a11y || {
            log_warning "Accessibility tests found issues"
        }
    else
        log_info "No accessibility tests configured"
    fi
    
    log_success "Accessibility tests completed"
}

run_cross_platform_tests() {
    log "🌐 Running cross-platform tests..."
    
    cd "$PROJECT_ROOT"
    
    # Cross-platform compatibility tests
    local platforms=("android" "ios" "web")
    
    for platform in "${platforms[@]}"; do
        if npm run "test:platform:$platform" --if-present &> /dev/null; then
            log "Testing $platform platform..."
            npm run "test:platform:$platform" || {
                log_warning "$platform platform tests failed"
            }
        fi
    done
    
    log_success "Cross-platform tests completed"
}

generate_coverage_report() {
    log "📊 Generating coverage report..."
    
    cd "$PROJECT_ROOT"
    
    if [[ -d "$COVERAGE_DIR" ]]; then
        # Generate HTML coverage report
        if command -v nyc &> /dev/null; then
            nyc report --reporter=html --report-dir="$COVERAGE_DIR/html"
        fi
        
        # Extract coverage percentage
        local coverage_file="$COVERAGE_DIR/lcov.info"
        if [[ -f "$coverage_file" ]]; then
            local coverage_percent=$(grep -E "LF:" "$coverage_file" | awk -F: '{found+=$2} END {print (found/NR)*100}' 2>/dev/null || echo "0")
            
            echo "Coverage: ${coverage_percent}%" > "$TEST_RESULTS_DIR/coverage-summary.txt"
            
            # Check coverage threshold
            if (( $(echo "$coverage_percent < $COVERAGE_THRESHOLD" | bc -l) )); then
                log_warning "Coverage ($coverage_percent%) is below threshold ($COVERAGE_THRESHOLD%)"
            else
                log_success "Coverage ($coverage_percent%) meets threshold ($COVERAGE_THRESHOLD%)"
            fi
        fi
    fi
    
    log_success "Coverage report generated"
}

run_quality_gates() {
    log "🚦 Running quality gates..."
    
    cd "$PROJECT_ROOT"
    
    local gate_failures=0
    
    # Test results validation
    if [[ -f "$TEST_RESULTS_DIR/junit.xml" ]]; then
        local failed_tests=$(grep -c 'failure\|error' "$TEST_RESULTS_DIR/junit.xml" 2>/dev/null || echo "0")
        if [[ $failed_tests -gt 0 ]]; then
            log_warning "Quality gate: $failed_tests test failures detected"
            ((gate_failures++))
        fi
    fi
    
    # Coverage threshold check
    if [[ -f "$TEST_RESULTS_DIR/coverage-summary.txt" ]]; then
        local coverage=$(grep -o '[0-9.]*' "$TEST_RESULTS_DIR/coverage-summary.txt" 2>/dev/null || echo "0")
        if (( $(echo "$coverage < $COVERAGE_THRESHOLD" | bc -l) )); then
            log_warning "Quality gate: Coverage below threshold"
            ((gate_failures++))
        fi
    fi
    
    # Security vulnerabilities check
    if [[ -f "$TEST_RESULTS_DIR/security-scan.json" ]]; then
        local vuln_count=$(jq '.results | length' "$TEST_RESULTS_DIR/security-scan.json" 2>/dev/null || echo "0")
        if [[ $vuln_count -gt 0 ]]; then
            log_warning "Quality gate: $vuln_count security vulnerabilities found"
            ((gate_failures++))
        fi
    fi
    
    if [[ $gate_failures -gt 0 ]]; then
        log_error "Quality gates failed: $gate_failures issues detected"
    else
        log_success "All quality gates passed"
    fi
}

generate_test_report() {
    log "📋 Generating comprehensive test report..."
    
    local report_file="$TEST_RESULTS_DIR/test-summary.json"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    cat > "$report_file" << EOF
{
  "timestamp": "$timestamp",
  "project": "RiggerShared",
  "testSuite": {
    "unit": $(test -f "$TEST_RESULTS_DIR/unit-tests.xml" && echo "true" || echo "false"),
    "integration": $(test -f "$TEST_RESULTS_DIR/integration-tests.xml" && echo "true" || echo "false"),
    "security": $(test -f "$TEST_RESULTS_DIR/security-scan.json" && echo "true" || echo "false"),
    "performance": $(test -f "$TEST_RESULTS_DIR/performance-results.json" && echo "true" || echo "false"),
    "accessibility": $(test -f "$TEST_RESULTS_DIR/a11y-results.json" && echo "true" || echo "false"),
    "crossPlatform": $(test -f "$TEST_RESULTS_DIR/platform-tests.json" && echo "true" || echo "false")
  },
  "coverage": {
    "threshold": $COVERAGE_THRESHOLD,
    "actual": $(grep -o '[0-9.]*' "$TEST_RESULTS_DIR/coverage-summary.txt" 2>/dev/null || echo "0")
  },
  "qualityGates": {
    "passed": $(test $? -eq 0 && echo "true" || echo "false")
  }
}
EOF
    
    log_success "Test report generated: $report_file"
}

main() {
    show_banner
    
    log "🚀 Starting RiggerShared test suite..."
    log_info "Test type: $TEST_TYPE"
    log_info "Coverage threshold: $COVERAGE_THRESHOLD%"
    log_info "Parallel execution: $PARALLEL_TESTS"
    
    # Setup test environment
    setup_test_environment
    
    # Run tests based on type
    case "$TEST_TYPE" in
        "unit")
            run_unit_tests
            ;;
        "integration")
            run_integration_tests
            ;;
        "security")
            run_security_tests
            ;;
        "performance")
            run_performance_tests
            ;;
        "accessibility")
            run_accessibility_tests
            ;;
        "cross-platform")
            run_cross_platform_tests
            ;;
        "all"|*)
            run_unit_tests
            run_integration_tests
            run_security_tests
            run_performance_tests
            run_accessibility_tests
            run_cross_platform_tests
            ;;
    esac
    
    # Generate reports and run quality gates
    generate_coverage_report
    run_quality_gates
    generate_test_report
    
    log_success "🎉 Test suite completed successfully!"
    
    # Test summary
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                        TEST SUMMARY                            ║${NC}"
    echo -e "${GREEN}╠════════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${GREEN}║ Test Type: $TEST_TYPE$(printf '%*s' $((55 - ${#TEST_TYPE})) '')║${NC}"
    echo -e "${GREEN}║ Coverage Threshold: $COVERAGE_THRESHOLD%$(printf '%*s' $((46 - ${#COVERAGE_THRESHOLD})) '')║${NC}"
    echo -e "${GREEN}║ Results Directory: test-results/$(printf '%*s' 40 '')║${NC}"
    echo -e "${GREEN}║ Status: SUCCESS$(printf '%*s' 52 '')║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --type)
            TEST_TYPE="$2"
            shift 2
            ;;
        --coverage-threshold)
            COVERAGE_THRESHOLD="$2"
            shift 2
            ;;
        --parallel)
            PARALLEL_TESTS="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --type TYPE                 Test type (unit, integration, security, performance, accessibility, cross-platform, all)"
            echo "  --coverage-threshold NUM    Coverage threshold percentage (default: 80)"
            echo "  --parallel BOOL            Enable parallel test execution (default: true)"
            echo "  --help                     Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 --type unit"
            echo "  $0 --type all --coverage-threshold 85"
            echo "  $0 --type security --parallel false"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            ;;
    esac
done

# Execute main function
main
