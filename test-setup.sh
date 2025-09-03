#!/bin/bash

# ARKHITEKTON UX Testing Framework Setup
echo "🏛️  Setting up ARKHITEKTON UX Testing Framework..."

# Install Playwright browsers
echo "📦 Installing Playwright browsers..."
npx playwright install

# Create test directories
echo "📁 Creating test result directories..."
mkdir -p test-results/screenshots
mkdir -p test-results/html-report
mkdir -p test-results/ux-reports
mkdir -p test-results/coverage

# Make scripts executable
chmod +x scripts/run-ux-tests.ts

echo "✅ UX Testing Framework setup complete!"
echo ""
echo "🧪 Available Test Commands:"
echo "  tsx scripts/run-ux-tests.ts              # Run all UX tests"
echo "  npx playwright test visual-regression     # Visual tests only"
echo "  npx playwright test accessibility         # Accessibility tests"
echo "  npx playwright test performance           # Performance tests"
echo "  npx playwright test user-flows            # User flow tests"
echo ""
echo "📊 View Reports:"
echo "  npx playwright show-report               # View latest test report"
echo "  open test-results/ux-reports/            # View UX analysis reports"