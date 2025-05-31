#!/bin/bash
echo "Deploying LightBulb game to AWS..."

# Create a temporary directory for deployment
mkdir -p deploy
cp -r src/* deploy/

# Create a CloudFormation template for deployment
cat > deploy/cloudformation.yaml << EOF
AWSTemplateFormatVersion: "2010-09-09"
Resources:
  LightBulbWebsiteBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: lightbulb-game-\${AWS::AccountId}
      WebsiteConfiguration:
        IndexDocument: index.html
        ErrorDocument: index.html
  
  LightBulbBucketPolicy:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket: !Ref LightBulbWebsiteBucket
      PolicyDocument:
        Statement:
          - Action: s3:GetObject
            Effect: Allow
            Resource: !Join ["", ["arn:aws:s3:::", !Ref LightBulbWebsiteBucket, "/*"]]
            Principal: "*"
  
  LightBulbCloudFront:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - DomainName: !GetAtt LightBulbWebsiteBucket.WebsiteURL
            Id: S3Origin
            CustomOriginConfig:
              HTTPPort: 80
              HTTPSPort: 443
              OriginProtocolPolicy: http-only
        Enabled: true
        DefaultRootObject: index.html
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          AllowedMethods: ["GET", "HEAD"]
          CachedMethods: ["GET", "HEAD"]
          ForwardedValues:
            QueryString: false
            Cookies:
              Forward: none

Outputs:
  WebsiteURL:
    Description: URL for the website
    Value: !GetAtt LightBulbWebsiteBucket.WebsiteURL
  CloudFrontURL:
    Description: CloudFront URL
    Value: !Join ["", ["https://", !GetAtt LightBulbCloudFront.DomainName]]
EOF

echo "Deployment package created. To deploy:"
echo "1. Log into AWS Console"
echo "2. Go to CloudFormation"
echo "3. Create a new stack using the deploy/cloudformation.yaml template"
echo "4. After stack creation, upload the website files to the created S3 bucket"
echo "5. Access the website through the CloudFront URL provided in the outputs"

echo "Alternatively, you can use AWS CLI to deploy:"
echo "aws cloudformation create-stack --stack-name LightBulbGame --template-body file://deploy/cloudformation.yaml --capabilities CAPABILITY_IAM"

