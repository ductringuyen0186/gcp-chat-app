#!/bin/bash

# Discord Clone Backend Deployment Script
# This script deploys the backend to Google Cloud Run

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID=${GOOGLE_CLOUD_PROJECT_ID:-"discord-clone-[YOUR-UNIQUE-ID]"}
SERVICE_NAME="discord-clone-api"
REGION="us-central1"
MEMORY="512Mi"
CPU="1"
MAX_INSTANCES="10"
MIN_INSTANCES="0"

echo -e "${BLUE}🚀 Starting deployment to Google Cloud Run...${NC}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${YELLOW}⚠️  Not authenticated with gcloud. Running authentication...${NC}"
    gcloud auth login
fi

# Set the project
echo -e "${BLUE}📋 Setting project to: $PROJECT_ID${NC}"
gcloud config set project $PROJECT_ID

# Enable required APIs if not already enabled
echo -e "${BLUE}🔧 Ensuring required APIs are enabled...${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com

# Build and deploy
echo -e "${BLUE}🏗️  Building and deploying to Cloud Run...${NC}"
gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory $MEMORY \
  --cpu $CPU \
  --max-instances $MAX_INSTANCES \
  --min-instances $MIN_INSTANCES \
  --set-env-vars NODE_ENV=production \
  --set-env-vars GOOGLE_CLOUD_PROJECT_ID=$PROJECT_ID \
  --timeout 300 \
  --concurrency 80

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${GREEN}🌐 Service URL: $SERVICE_URL${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "   1. Set environment variables using: gcloud run services update $SERVICE_NAME --region=$REGION --set-env-vars KEY=VALUE"
echo -e "   2. Test the health endpoint: curl $SERVICE_URL/health"
echo -e "   3. Configure your frontend to use: $SERVICE_URL"

# Test the health endpoint
echo -e "${BLUE}🔍 Testing health endpoint...${NC}"
if curl -f -s "$SERVICE_URL/health" > /dev/null; then
    echo -e "${GREEN}✅ Health check passed!${NC}"
else
    echo -e "${RED}❌ Health check failed. Check the logs:${NC}"
    echo -e "   gcloud run services logs read $SERVICE_NAME --region=$REGION"
fi
