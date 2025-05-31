# Deployment Guide

## AWS Deployment Options

### Option 1: Using CloudFormation with S3 and CloudFront

1. **Run the deployment script**:
   ```bash
   ./deploy-lightbulb.sh
   ```

2. **Create CloudFormation stack**:
   ```bash
   aws cloudformation create-stack --stack-name LightBulbGame --template-body file://deploy/cloudformation.yaml --capabilities CAPABILITY_IAM
   ```

3. **Upload website files to S3**:
   ```bash
   aws s3 sync src/ s3://[BUCKET_NAME]/ --region us-east-1
   ```
   Replace [BUCKET_NAME] with the bucket name from CloudFormation outputs.

4. **Access the website** through the CloudFront URL provided in the CloudFormation outputs.

### Option 2: Using CloudFront Origin Access Identity (OAI)

For enhanced security, use the CloudFront OAI approach:

1. **Deploy the CloudFront OAI stack**:
   ```bash
   aws cloudformation create-stack --stack-name LightBulbOAI --template-body file://cloudfront-oai.yaml --capabilities CAPABILITY_IAM
   ```

2. **Upload website files to S3**:
   ```bash
   aws s3 sync src/ s3://[BUCKET_NAME]/ --region us-east-1
   ```

3. **Access the website** through the CloudFront URL provided in the CloudFormation outputs.

## Cost Estimation

Based on typical usage patterns, the monthly cost for hosting this game on AWS is estimated to be:

- **Basic usage (low traffic)**: $0.50-$1.00/month
- **Medium traffic** (10,000 users/month): $5-$10/month
- **High traffic** (100,000 users/month): $50-$100/month

Cost components include:
- S3 storage (negligible for small website files)
- CloudFront data transfer
- CloudFront HTTP requests

## Troubleshooting

### 403 Forbidden Error

If you encounter a 403 Forbidden error when accessing your website:

1. **Check S3 bucket permissions**:
   ```bash
   aws s3api get-bucket-policy --bucket [BUCKET_NAME]
   ```

2. **Verify CloudFront distribution status**:
   ```bash
   aws cloudfront get-distribution --id [DISTRIBUTION_ID] --query "Distribution.Status"
   ```

3. **Check for account-level S3 block public access settings**:
   ```bash
   aws s3control get-public-access-block --account-id [ACCOUNT_ID]
   ```

### CloudFront Cache Issues

If updates to your website are not reflecting immediately:

1. **Create an invalidation**:
   ```bash
   aws cloudfront create-invalidation --distribution-id [DISTRIBUTION_ID] --paths "/*"
   ```

2. **Wait for the invalidation to complete** (typically 5-15 minutes).
