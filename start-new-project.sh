#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Arrays to track completion status
COMPLETED=()
SKIPPED=()
PENDING=()

# Function to print headers
print_header() {
    echo -e "\n${CYAN}╔════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC} $1"
    echo -e "${CYAN}╚════════════════════════════════════════╝${NC}\n"
}

# Function to print section
print_section() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Function to print error and exit
print_error() {
    echo -e "${RED}✗ $1${NC}"
    exit 1
}

# Function to ask for confirmation
ask_continue() {
    local prompt=$1
    local response
    
    while true; do
        echo -e "${BLUE}${prompt}${NC} ${YELLOW}(y/n)${NC}"
        read -r response
        case "$response" in
            [Yy]) return 0 ;;
            [Nn]) return 1 ;;
            *) echo "Please answer y or n" ;;
        esac
    done
}

# Function to track completion
track_completed() {
    COMPLETED+=("$1")
    print_success "$1"
}

# Function to track skipped
track_skipped() {
    SKIPPED+=("$1")
    print_warning "Skipped: $1"
}

# Function to track pending
track_pending() {
    PENDING+=("$1")
}

# ============================================
# MAIN SCRIPT STARTS HERE
# ============================================

print_header "🚀 NextJS Starter Project Setup Script"

echo -e "${CYAN}This script will help you set up a new project from the starter template.${NC}\n"

# ============================================
# STEP 1: PROJECT NAME
# ============================================

print_section "Step 1: Project Configuration"

echo -e "${BLUE}Enter your new project name (kebab-case, e.g., my-awesome-app):${NC}"
read -r PROJECT_NAME

if [ -z "$PROJECT_NAME" ]; then
    print_error "Project name cannot be empty"
fi

# Validate project name (kebab-case)
if ! [[ "$PROJECT_NAME" =~ ^[a-z0-9]([a-z0-9-]*[a-z0-9])?$ ]]; then
    print_warning "Project name doesn't follow kebab-case convention"
    echo -e "${BLUE}Continue anyway? (y/n)${NC}"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        print_error "Aborted by user"
    fi
fi

PACKAGE_NAME=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]')
DB_NAME=$(echo "$PROJECT_NAME" | tr '-' '_')

track_completed "Project name set: $PACKAGE_NAME"

# ============================================
# STEP 2: GIT INITIALIZATION
# ============================================

print_section "Step 2: Git Repository Setup"

if [ -d .git ]; then
    rm -rf .git
    print_success "Removed old git history"
fi

git init --quiet
track_completed "Initialized new git repository"

# ============================================
# STEP 3: UPDATE PACKAGE.JSON
# ============================================

print_section "Step 3: Update Configuration Files"

if sed --version 2>&1 | grep -q GNU; then
    sed -i "s/\"name\": \"starter\"/\"name\": \"$PACKAGE_NAME\"/" package.json
else
    sed -i '' "s/\"name\": \"starter\"/\"name\": \"$PACKAGE_NAME\"/" package.json
fi
track_completed "Updated package.json"

# ============================================
# STEP 4: INSTALL DEPENDENCIES
# ============================================

print_section "Step 4: Dependencies"

if ask_continue "Install npm dependencies?"; then
    echo -e "\n${BLUE}Installing dependencies (this may take a few minutes)...${NC}\n"
    
    if npm install; then
        track_completed "Installed npm dependencies"
    else
        print_error "Failed to install dependencies"
    fi
else
    track_skipped "Install npm dependencies"
    track_pending "Run 'npm install' manually"
fi

# ============================================
# STEP 5: CREATE ENV FILE
# ============================================

print_section "Step 5: Environment Configuration"

cat > .env.local << EOF
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/${DB_NAME}_db"

# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
EOF
track_completed "Created .env.local"
track_pending "Fill in DATABASE_URL and Clerk credentials in .env.local"

# Create initial commit
git add .
git commit -m "Initial commit from starter template" --quiet
track_completed "Created initial commit"

# ============================================
# STEP 6: LINK REMOTE REPOSITORY
# ============================================

print_section "Step 6: Remote Repository Setup"

if ask_continue "Link to a remote GitHub repository?"; then
    echo -e "${BLUE}Do you already have a GitHub repository created?${NC} ${YELLOW}(y/n)${NC}"
    read -r has_repo
    
    if [[ "$has_repo" =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}Enter your GitHub repository URL (e.g., https://github.com/username/repo.git):${NC}"
        read -r repo_url
        
        if [ -z "$repo_url" ]; then
            print_warning "Repository URL cannot be empty"
            track_skipped "Link remote repository"
        else
            git remote add origin "$repo_url"
            track_completed "Added remote repository: $repo_url"
            track_pending "Push to GitHub: git push -u origin main"
        fi
    else
        echo -e "${CYAN}Next steps to create a repository:${NC}"
        echo -e "  1. Go to ${YELLOW}https://github.com/new${NC}"
        echo -e "  2. Create a new repository named: ${YELLOW}${PACKAGE_NAME}${NC}"
        echo -e "  3. Come back and run this command:"
        echo -e "     ${GREEN}git remote add origin <your-repo-url>${NC}"
        echo -e "     ${GREEN}git push -u origin main${NC}"
        track_pending "Create GitHub repository and link it manually"
    fi
else
    track_skipped "Link remote repository"
    track_pending "Create GitHub repository and link it manually"
fi

# ============================================
# STEP 7: DATABASE SETUP
# ============================================

print_section "Step 7: Database Setup"

echo -e "${CYAN}Database setup has two options:${NC}"
echo -e "  1. ${GREEN}Quick setup${NC}: Run Drizzle commands now"
echo -e "  2. ${YELLOW}Manual setup${NC}: You'll run these commands yourself later\n"

if ask_continue "Run database generation and migration now?"; then
    echo -e "\n${BLUE}Generating database schema...${NC}\n"
    
    if npx drizzle-kit generate; then
        track_completed "Generated database schema with Drizzle"
        
        echo -e "\n${BLUE}Pushing schema to database...${NC}\n"
        if npx drizzle-kit push; then
            track_completed "Pushed schema to database with Drizzle"
        else
            print_warning "drizzle-kit push encountered an issue"
            track_pending "Run 'npx drizzle-kit push' manually after updating DATABASE_URL"
        fi
    else
        print_warning "drizzle-kit generate encountered an issue"
        track_pending "Run 'npx drizzle-kit generate' and 'npx drizzle-kit push' manually"
    fi
else
    track_skipped "Database generation and migration"
    track_pending "Run 'npx drizzle-kit generate' and 'npx drizzle-kit push' when ready"
fi

# ============================================
# STEP 8: CLEANUP
# ============================================

print_section "Step 8: Cleanup"

if ask_continue "Remove the setup script (this file)?"; then
    SCRIPT_NAME="${BASH_SOURCE[0]}"
    if [ -f "$SCRIPT_NAME" ]; then
        rm "$SCRIPT_NAME"
        track_completed "Removed setup script"
    else
        track_skipped "Remove setup script"
    fi
else
    track_skipped "Remove setup script"
    track_pending "Manually delete the setup script: rm setup-new-project.sh"
fi

# ============================================
# FINAL SUMMARY
# ============================================

print_header "📋 Setup Summary"

echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}COMPLETED (${#COMPLETED[@]})${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"

if [ ${#COMPLETED[@]} -gt 0 ]; then
    for item in "${COMPLETED[@]}"; do
        echo -e "${GREEN}✓${NC} $item"
    done
else
    echo -e "${YELLOW}None${NC}"
fi

echo ""
echo -e "${YELLOW}═══════════════════════════════════════${NC}"
echo -e "${YELLOW}SKIPPED (${#SKIPPED[@]})${NC}"
echo -e "${YELLOW}═══════════════════════════════════════${NC}"

if [ ${#SKIPPED[@]} -gt 0 ]; then
    for item in "${SKIPPED[@]}"; do
        echo -e "${YELLOW}⊘${NC} $item"
    done
else
    echo -e "${YELLOW}None${NC}"
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════${NC}"
echo -e "${CYAN}PENDING (${#PENDING[@]})${NC}"
echo -e "${CYAN}═══════════════════════════════════════${NC}"

if [ ${#PENDING[@]} -gt 0 ]; then
    for item in "${PENDING[@]}"; do
        echo -e "${CYAN}⏳${NC} $item"
    done
else
    echo -e "${CYAN}Nothing pending!${NC}"
fi

# ============================================
# NEXT STEPS
# ============================================

print_header "🚀 Next Steps"

echo -e "${BLUE}Your project '${YELLOW}${PACKAGE_NAME}${BLUE}' is ready!${NC}\n"

echo -e "${CYAN}1. Environment Configuration:${NC}"
echo -e "   ${YELLOW}⏳ Update credentials in .env.local:${NC}"
echo -e "     → DATABASE_URL=your_postgres_url"
echo -e "     → Clerk keys (from https://dashboard.clerk.com)"

echo -e "\n${CYAN}2. Database Setup:${NC}"
if [[ " ${COMPLETED[@]} " =~ " Pushed schema to database with Drizzle " ]]; then
    echo -e "   ${GREEN}✓ Database initialized${NC}"
else
    echo -e "   ${YELLOW}⏳ Pending${NC}"
    echo -e "     → Run: ${GREEN}npx drizzle-kit generate${NC}"
    echo -e "     → Run: ${GREEN}npx drizzle-kit push${NC}"
fi

echo -e "\n${CYAN}3. Development:${NC}"
echo -e "   → Start dev server: ${GREEN}npm run dev${NC}"
echo -e "   → Open browser: ${GREEN}http://localhost:3000${NC}"

echo -e "\n${CYAN}4. Database Tools:${NC}"
echo -e "   → Open Drizzle Studio: ${GREEN}npx drizzle-kit studio${NC}"

echo -e "\n${CYAN}5. Git & GitHub:${NC}"
if [[ " ${COMPLETED[@]} " =~ " Added remote repository " ]]; then
    echo -e "   ${GREEN}✓ Remote repository linked${NC}"
    echo -e "     → Run: ${GREEN}git push -u origin main${NC}"
else
    echo -e "   ${YELLOW}⏳ Pending${NC}"
    echo -e "     → Create repo on GitHub: ${GREEN}https://github.com/new${NC}"
    echo -e "     → Run: ${GREEN}git remote add origin <your-repo-url>${NC}"
    echo -e "     → Run: ${GREEN}git push -u origin main${NC}"
fi

echo -e "\n${CYAN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}Happy coding! 🎉${NC}\n"