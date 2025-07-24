#!/bin/bash

# Integration script for RiggerShared across the Rigger ecosystem
# This script will help integrate @rigger/shared into other repositories

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
REPOS_BASE_DIR="/Users/tiaastor/Github/tiation-repos"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}🔧 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if a directory exists
check_repo_exists() {
    local repo_path="$1"
    if [ ! -d "$repo_path" ]; then
        print_error "Repository not found: $repo_path"
        return 1
    fi
    return 0
}

# Function to add @rigger/shared dependency to a repository
add_shared_dependency() {
    local repo_path="$1"
    local repo_name="$(basename "$repo_path")"
    
    print_step "Adding @rigger/shared dependency to $repo_name"
    
    if ! check_repo_exists "$repo_path"; then
        return 1
    fi
    
    cd "$repo_path"
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_error "No package.json found in $repo_name"
        return 1
    fi
    
    # Add the dependency
    if [ -f "package-lock.json" ]; then
        npm install --save @rigger/shared@latest
    elif [ -f "yarn.lock" ]; then
        yarn add @rigger/shared@latest
    else
        npm install --save @rigger/shared@latest
    fi
    
    print_success "Added @rigger/shared dependency to $repo_name"
}

# Function to create integration examples
create_integration_examples() {
    local repo_path="$1"
    local repo_name="$(basename "$repo_path")"
    
    print_step "Creating integration examples for $repo_name"
    
    cd "$repo_path"
    
    # Create examples directory if it doesn't exist
    mkdir -p examples/shared-integration
    
    # Create basic integration example
    cat > examples/shared-integration/basic-usage.js << 'EOF'
// Example of using @rigger/shared utilities
import { 
    formatCurrency, 
    validateEmail, 
    generateId, 
    API_ENDPOINTS,
    USER_ROLES,
    Logger 
} from '@rigger/shared';

// Example usage
console.log('Currency formatting:', formatCurrency(1234.56));
console.log('Email validation:', validateEmail('test@example.com'));
console.log('Generated ID:', generateId());
console.log('API endpoints:', API_ENDPOINTS);
console.log('User roles:', USER_ROLES);

// Logging example
Logger.info('RiggerShared integration successful', { 
    repository: process.env.npm_package_name || 'unknown'
});
EOF

    # Create constants migration example
    cat > examples/shared-integration/constants-migration.js << 'EOF'
// Example of migrating to shared constants
import { 
    API_ENDPOINTS,
    HTTP_STATUS,
    USER_ROLES,
    JOB_CATEGORIES,
    FEATURE_FLAGS 
} from '@rigger/shared';

// Replace local constants with shared ones
export const config = {
    apiUrl: API_ENDPOINTS.BASE_URL,
    statusCodes: HTTP_STATUS,
    userPermissions: USER_ROLES,
    jobTypes: JOB_CATEGORIES,
    features: FEATURE_FLAGS
};
EOF

    # Create utilities migration example  
    cat > examples/shared-integration/utilities-migration.js << 'EOF'
// Example of migrating to shared utilities
import { 
    formatDate,
    formatCurrency,
    validateEmail,
    validatePhone,
    sanitizeString,
    deepMerge,
    retry,
    Logger
} from '@rigger/shared';

// Replace local utility functions with shared ones
export class UserService {
    static async createUser(userData) {
        try {
            // Validate input using shared validators
            const isValidEmail = validateEmail(userData.email);
            const isValidPhone = validatePhone(userData.phone);
            
            if (!isValidEmail || !isValidPhone) {
                throw new Error('Invalid user data');
            }
            
            // Sanitize input using shared utilities
            const sanitizedData = {
                ...userData,
                name: sanitizeString(userData.name),
                bio: sanitizeString(userData.bio)
            };
            
            // Use shared retry utility for API calls
            const result = await retry(async () => {
                // API call here
                return await this.apiCall(sanitizedData);
            }, 3);
            
            Logger.info('User created successfully', { userId: result.id });
            return result;
            
        } catch (error) {
            Logger.error('Failed to create user', { error: error.message, userData });
            throw error;
        }
    }
}
EOF

    print_success "Created integration examples for $repo_name"
}

# Function to create migration checklist
create_migration_checklist() {
    local repo_path="$1"
    local repo_name="$(basename "$repo_path")"
    
    print_step "Creating migration checklist for $repo_name"
    
    cd "$repo_path"
    
    cat > SHARED_INTEGRATION_CHECKLIST.md << 'EOF'
# RiggerShared Integration Checklist

This checklist helps ensure proper integration of @rigger/shared into this repository.

## 🏗️ Installation
- [ ] Added @rigger/shared as a dependency
- [ ] Verified package.json includes correct version
- [ ] Ran npm install/yarn install successfully

## 🔄 Code Migration

### Constants Migration
- [ ] Identified local constants that exist in @rigger/shared
- [ ] Replaced local API_ENDPOINTS with shared version
- [ ] Replaced local HTTP_STATUS codes with shared version
- [ ] Replaced local USER_ROLES with shared version
- [ ] Replaced local JOB_CATEGORIES with shared version
- [ ] Updated FEATURE_FLAGS to use shared version

### Utilities Migration
- [ ] Identified local utility functions available in @rigger/shared
- [ ] Replaced string manipulation functions (sanitizeString, formatName, etc.)
- [ ] Replaced validation functions (validateEmail, validatePhone, etc.)
- [ ] Replaced date/time formatting functions
- [ ] Replaced currency formatting functions
- [ ] Replaced array/object helper functions
- [ ] Updated ID generation to use shared generateId()

### Logging Migration
- [ ] Replaced local logger with shared Logger
- [ ] Updated log calls to use consistent format
- [ ] Verified structured logging is working
- [ ] Updated error handling to use shared logger

### Types/Enums Migration
- [ ] Replaced local type definitions with shared ones
- [ ] Updated TypeScript imports if applicable
- [ ] Verified type compatibility

## 🧪 Testing
- [ ] Updated unit tests to work with shared utilities
- [ ] Added tests for shared utility usage
- [ ] Verified integration tests pass
- [ ] Tested error handling with shared logger

## 📚 Documentation
- [ ] Updated README to mention @rigger/shared dependency
- [ ] Updated code comments to reference shared utilities
- [ ] Added examples of shared utility usage
- [ ] Updated API documentation if needed

## 🔍 Code Review
- [ ] Removed duplicate utility functions
- [ ] Removed duplicate constants
- [ ] Verified no unused imports remain
- [ ] Checked for consistent usage patterns

## 🚀 Deployment
- [ ] Updated CI/CD to include @rigger/shared
- [ ] Verified build process works with shared dependency
- [ ] Updated deployment scripts if needed
- [ ] Tested in staging environment

## 📋 Post-Integration
- [ ] Monitored logs for any issues
- [ ] Verified functionality in production
- [ ] Updated team documentation
- [ ] Conducted team training if needed

## Notes
Add any repository-specific notes or considerations here.
EOF

    print_success "Created migration checklist for $repo_name"
}

# Main integration function
integrate_repository() {
    local repo_path="$1"
    local repo_name="$(basename "$repo_path")"
    
    echo -e "\n${BLUE}🚀 Starting integration for $repo_name${NC}\n"
    
    add_shared_dependency "$repo_path"
    create_integration_examples "$repo_path"
    create_migration_checklist "$repo_path"
    
    echo -e "\n${GREEN}✅ Integration setup complete for $repo_name${NC}"
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Review the integration examples in examples/shared-integration/"
    echo "2. Follow the checklist in SHARED_INTEGRATION_CHECKLIST.md"
    echo "3. Begin migrating local utilities to use @rigger/shared"
    echo ""
}

# Enhanced repository configuration with metadata
declare -A REPOSITORY_CONFIG
REPOSITORY_CONFIG["RiggerHub-web"]="frontend,react,web"
REPOSITORY_CONFIG["RiggerHub-ios"]="mobile,react-native,ios"
REPOSITORY_CONFIG["RiggerHub-android"]="mobile,react-native,android"
REPOSITORY_CONFIG["RiggerConnect-web"]="frontend,react,web"
REPOSITORY_CONFIG["RiggerConnect-capacitor"]="hybrid,capacitor,cross-platform"
REPOSITORY_CONFIG["RiggerConnect-ios"]="mobile,native,ios"
REPOSITORY_CONFIG["RiggerConnect-android"]="mobile,native,android"
REPOSITORY_CONFIG["RiggerBackend"]="backend,api,node"

# List of repositories to integrate
REPOSITORIES=()
for repo in "${!REPOSITORY_CONFIG[@]}"; do
    repo_path="$REPOS_BASE_DIR/$repo"
    if [ -d "$repo_path" ]; then
        REPOSITORIES+=("$repo_path")
    fi
done

# Main execution
main() {
    echo -e "${BLUE}🏗️  RiggerShared Integration Script${NC}"
    echo -e "${BLUE}=====================================${NC}\n"
    
    # Check if we're in the RiggerShared directory
    if [ "$(basename "$PWD")" != "RiggerShared" ]; then
        print_error "This script must be run from the RiggerShared directory"
        exit 1
    fi
    
    # Build RiggerShared first
    print_step "Building RiggerShared package"
    npm run clean && npm run build
    print_success "RiggerShared build complete"
    
    # Offer to publish package
    echo -e "\n${YELLOW}📦 Publishing Options:${NC}"
    echo "1. Skip publishing (use local development)"
    echo "2. Publish to npm registry"
    echo "3. Create tarball for local installation"
    
    read -p "Choose an option (1-3): " publish_choice
    
    case $publish_choice in
        1)
            print_warning "Skipping package publishing"
            ;;
        2)
            print_step "Publishing to npm registry"
            npm run publish:latest
            print_success "Package published to npm"
            ;;
        3)
            print_step "Creating tarball"
            npm pack
            print_success "Tarball created"
            ;;
        *)
            print_warning "Invalid choice, skipping publishing"
            ;;
    esac
    
    # Integrate with each repository
    echo -e "\n${BLUE}🔗 Repository Integration${NC}"
    echo "Available repositories for integration:"
    
    for i in "${!REPOSITORIES[@]}"; do
        repo_path="${REPOSITORIES[$i]}"
        repo_name="$(basename "$repo_path")"
        if check_repo_exists "$repo_path"; then
            echo "$((i+1)). $repo_name ✅"
        else
            echo "$((i+1)). $repo_name ❌ (not found)"
        fi
    done
    
    echo "$((${#REPOSITORIES[@]}+1)). All available repositories"
    echo "$((${#REPOSITORIES[@]}+2)). Skip repository integration"
    
    read -p "Choose repositories to integrate (1-$((${#REPOSITORIES[@]}+2))): " repo_choice
    
    case $repo_choice in
        $((${#REPOSITORIES[@]}+1)))
            # Integrate all available repositories
            for repo_path in "${REPOSITORIES[@]}"; do
                if check_repo_exists "$repo_path"; then
                    integrate_repository "$repo_path"
                fi
            done
            ;;
        $((${#REPOSITORIES[@]}+2)))
            print_warning "Skipping repository integration"
            ;;
        *)
            # Integrate specific repository
            if [[ "$repo_choice" -ge 1 && "$repo_choice" -le "${#REPOSITORIES[@]}" ]]; then
                repo_path="${REPOSITORIES[$((repo_choice-1))]}"
                if check_repo_exists "$repo_path"; then
                    integrate_repository "$repo_path"
                else
                    print_error "Repository not found"
                fi
            else
                print_error "Invalid choice"
            fi
            ;;
    esac
    
    echo -e "\n${GREEN}🎉 RiggerShared integration process complete!${NC}"
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Review integration checklists in each repository"
    echo "2. Begin migrating duplicate code to use shared utilities"
    echo "3. Update tests and documentation"
    echo "4. Test the integration in development environments"
}

# Run the main function
main "$@"
EOF
