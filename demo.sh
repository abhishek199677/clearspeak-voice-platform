#!/bin/bash
# ClearSpeak Demo - Automated API Calls
# Run this script while recording your screen

echo "============================================"
echo "  ClearSpeak Voice AI Platform - Demo"
echo "============================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Wait for user to start recording
echo -e "${YELLOW}Press Enter to start the demo...${NC}"
read

# Part 1: Health Check
echo -e "\n${BLUE}[1/6] Health Check${NC}"
echo "--------------------------------------------"
curl -s http://localhost:8000/health | python3 -m json.tool
echo ""
sleep 2

# Part 2: Platform Stats
echo -e "${BLUE}[2/6] Platform Statistics${NC}"
echo "--------------------------------------------"
curl -s http://localhost:8000/stats | python3 -m json.tool
echo ""
sleep 2

# Part 3: Translation Demo - English to Hindi
echo -e "${BLUE}[3/6] Translation: English → Hindi${NC}"
echo "--------------------------------------------"
echo "Input: 'Hello, how are you today?'"
curl -s -X POST "http://localhost:8000/translate?text=Hello%2C%20how%20are%20you%20today%3F&target_language=hi" | python3 -m json.tool
echo ""
sleep 2

# Part 4: Translation Demo - English to Telugu
echo -e "${BLUE}[4/6] Translation: English → Telugu${NC}"
echo "--------------------------------------------"
echo "Input: 'My name is Abhishek. What is your name?'"
curl -s -X POST "http://localhost:8000/translate?text=My%20name%20is%20Abhishek.%20What%20is%20your%20name%3F&target_language=te" | python3 -m json.tool
echo ""
sleep 2

# Part 5: Indic Translation Demo
echo -e "${BLUE}[5/6] Indic Translation: English → Tamil${NC}"
echo "--------------------------------------------"
echo "Input: 'Welcome to ClearSpeak Voice AI Platform'"
curl -s -X POST "http://localhost:8000/translate/indic?text=Welcome%20to%20ClearSpeak%20Voice%20AI%20Platform&source_language=en&target_language=ta" | python3 -m json.tool
echo ""
sleep 2

# Part 6: Supported Languages
echo -e "${BLUE}[6/6] Supported Languages (22 Indian + 10 Global)${NC}"
echo "--------------------------------------------"
curl -s http://localhost:8000/languages | python3 -m json.tool
echo ""

# Summary
echo "============================================"
echo -e "${GREEN}Demo Complete!${NC}"
echo "============================================"
echo ""
echo "Next steps:"
echo "1. Open http://localhost:8000 to show the landing page"
echo "2. Click 'Try Translation Mode' to demo the voice interface"
echo "3. Navigate to http://localhost:8000/admin for the monitoring dashboard"
echo ""
echo "Press Enter to exit..."
read
