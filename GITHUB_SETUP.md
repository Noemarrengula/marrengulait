# ============================================
# MARAENGULA-IT - GIT & GITHUB SETUP
# ============================================

# 1. Initialize git (if not already initialized)
# git init

# 2. Add all files
git add .

# 3. Create initial commit
git commit -m "Initial commit - Marrengula-IT e-commerce platform

Features:
- Full e-commerce functionality
- Admin panel
- User authentication with Magic Links
- Cart and checkout system
- Product management
- Dark mode support
- Mobile responsive design
- Newsletter subscription
- Price alerts
- Stock notifications
- Recently viewed products
- Save for later functionality
- Trust badges
- SEO schema markup
- Analytics dashboard
- Code splitting for performance"

# 4. Create main branch
git branch -M main

# 5. Add remote (replace with your repository URL)
# git remote add origin https://github.com/YOUR_USERNAME/marrengulait.git

# 6. Push to GitHub
git push -u origin main

# ============================================
# ALIASES FOR COMMON COMMANDS
# ============================================

# Create and switch to new branch
alias gcb='git checkout -b'

# Quick commit with message
alias gc='git commit -m'

# Push current branch
alias gp='git push -u origin HEAD'

# Pull and rebase
alias gl='git pull --rebase'

# Status short
alias gs='git status -s'

# ============================================
# WORKFLOW FOR UPDATES
# ============================================

# 1. Make changes to code
# 2. git add .
# 3. git commit -m "Description of changes"
# 4. git push

# ============================================
# DEPLOY WORKFLOW
# ============================================

# Development:
# 1. npm run dev

# Build for production:
# 1. npm run build

# Deploy to Vercel:
# 1. vercel --prod

# Or push to main and Vercel auto-deploys
