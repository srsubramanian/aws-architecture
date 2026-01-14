# AWS Architecture Icons

This folder is designed to hold official AWS Architecture Icons for use in the diagram library.

## Downloading Official Icons

1. Visit https://aws.amazon.com/architecture/icons/
2. Download the **Asset Package** (PNG, SVG, or PowerPoint format)
3. Extract the downloaded archive
4. Copy the SVG icons you need to this folder

## Recommended Icons to Download

From the AWS Architecture Icons package, copy these files to this folder:

### Compute
- `Arch_AWS-Lambda/64/Arch_AWS-Lambda_64.svg` → `lambda.svg`
- `Arch_Amazon-EC2/64/Arch_Amazon-EC2_64.svg` → `ec2.svg`
- `Arch_Amazon-ECS/64/Arch_Amazon-ECS_64.svg` → `ecs.svg`
- `Arch_AWS-Fargate/64/Arch_AWS-Fargate_64.svg` → `fargate.svg`

### Database
- `Arch_Amazon-DynamoDB/64/Arch_Amazon-DynamoDB_64.svg` → `dynamodb.svg`
- `Arch_Amazon-RDS/64/Arch_Amazon-RDS_64.svg` → `rds.svg`
- `Arch_Amazon-Aurora/64/Arch_Amazon-Aurora_64.svg` → `aurora.svg`
- `Arch_Amazon-ElastiCache/64/Arch_Amazon-ElastiCache_64.svg` → `elasticache.svg`

### Networking
- `Arch_Amazon-API-Gateway/64/Arch_Amazon-API-Gateway_64.svg` → `api-gateway.svg`
- `Arch_Elastic-Load-Balancing/64/Arch_Elastic-Load-Balancing_64.svg` → `alb.svg`
- `Arch_Amazon-VPC/64/Arch_Amazon-VPC_64.svg` → `vpc.svg`
- `Arch_Amazon-CloudFront/64/Arch_Amazon-CloudFront_64.svg` → `cloudfront.svg`
- `Arch_Amazon-Route-53/64/Arch_Amazon-Route-53_64.svg` → `route53.svg`

### Storage
- `Arch_Amazon-Simple-Storage-Service/64/Arch_Amazon-Simple-Storage-Service_64.svg` → `s3.svg`
- `Arch_Amazon-Elastic-File-System/64/Arch_Amazon-Elastic-File-System_64.svg` → `efs.svg`
- `Arch_Amazon-Elastic-Block-Store/64/Arch_Amazon-Elastic-Block-Store_64.svg` → `ebs.svg`

### Messaging
- `Arch_Amazon-Simple-Queue-Service/64/Arch_Amazon-Simple-Queue-Service_64.svg` → `sqs.svg`
- `Arch_Amazon-Simple-Notification-Service/64/Arch_Amazon-Simple-Notification-Service_64.svg` → `sns.svg`
- `Arch_Amazon-EventBridge/64/Arch_Amazon-EventBridge_64.svg` → `eventbridge.svg`
- `Arch_Amazon-Kinesis/64/Arch_Amazon-Kinesis_64.svg` → `kinesis.svg`
- `Arch_AWS-Step-Functions/64/Arch_AWS-Step-Functions_64.svg` → `step-functions.svg`

### Security
- `Arch_AWS-WAF/64/Arch_AWS-WAF_64.svg` → `waf.svg`
- `Arch_AWS-Shield/64/Arch_AWS-Shield_64.svg` → `shield.svg`
- `Arch_AWS-Secrets-Manager/64/Arch_AWS-Secrets-Manager_64.svg` → `secrets-manager.svg`
- `Arch_AWS-Key-Management-Service/64/Arch_AWS-Key-Management-Service_64.svg` → `kms.svg`
- `Arch_Amazon-Cognito/64/Arch_Amazon-Cognito_64.svg` → `cognito.svg`

### Monitoring
- `Arch_Amazon-CloudWatch/64/Arch_Amazon-CloudWatch_64.svg` → `cloudwatch.svg`
- `Arch_AWS-X-Ray/64/Arch_AWS-X-Ray_64.svg` → `xray.svg`

## File Naming Convention

Rename the files using lowercase with hyphens:
- `lambda.svg`
- `api-gateway.svg`
- `dynamodb.svg`
- etc.

## Automatic Detection

The library will automatically detect and use official icons when present in this folder.
If an icon is not found, it will fall back to the built-in simplified icon.

## Icon License

AWS Architecture Icons are licensed for use according to the AWS Customer Agreement.
See https://aws.amazon.com/architecture/icons/ for full licensing terms.
