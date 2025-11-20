#!/bin/bash

# Check if bucket name is provided
if [ -z "$1" ]; then
  echo "Usage: ./deploy.sh <bucket-name>"
  echo "Example: ./deploy.sh my-sudoku-game-bucket"
  exit 1
fi

BUCKET_NAME=$1

echo "🚀 Starting deployment to s3://$BUCKET_NAME..."

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed. Aborting deployment."
  exit 1
fi

# Sync to S3
echo "🔄 Syncing to S3..."
aws s3 sync out s3://$BUCKET_NAME --delete

if [ $? -eq 0 ]; then
  echo "✅ Deployment complete! Visit your S3 bucket website endpoint to play."
else
  echo "❌ S3 Sync failed. Please check your AWS credentials and bucket name."
fi
