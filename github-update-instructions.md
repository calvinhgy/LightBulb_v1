# GitHub Update Instructions for LightBulb Project

I've prepared all the changes to be pushed to GitHub, but we need to authenticate properly. Here are the steps to complete the update:

## Option 1: Using GitHub Personal Access Token (Recommended)

1. **Create a Personal Access Token (PAT) on GitHub**:
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name like "LightBulb Project Update"
   - Select scopes: at minimum, check "repo" for full repository access
   - Click "Generate token" and **copy the token** (you won't see it again!)

2. **Use the token to push your changes**:
   ```bash
   cd /home/ec2-user/hgy/LightBulb
   git push https://YOUR_USERNAME:YOUR_TOKEN@github.com/Calvinhgy/LightBulb_v1.git main
   ```
   Replace `YOUR_USERNAME` with your GitHub username and `YOUR_TOKEN` with the token you just created.

## Option 2: Configure Git Credential Helper

1. **Store your credentials temporarily**:
   ```bash
   cd /home/ec2-user/hgy/LightBulb
   git config credential.helper store
   git push origin main
   ```
   
2. **Enter your GitHub username and personal access token** when prompted.

## Option 3: SSH Authentication

1. **Generate an SSH key** (if you don't already have one):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **Add the SSH key to your GitHub account**:
   - Copy the public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to GitHub → Settings → SSH and GPG keys → New SSH key
   - Paste your key and save

3. **Change the remote URL to use SSH**:
   ```bash
   cd /home/ec2-user/hgy/LightBulb
   git remote set-url origin git@github.com:Calvinhgy/LightBulb_v1.git
   git push origin main
   ```

## What's Been Updated

The following changes are ready to be pushed:

1. **Updated README.md** with deployment instructions
2. **Added deployment scripts**:
   - `deploy-lightbulb.sh`: Main deployment script
   - `deploy/cloudformation.yaml`: AWS CloudFormation template
3. **Added CloudFront OAI configuration**:
   - `cloudfront-oai.yaml`: CloudFront Origin Access Identity setup
4. **Added .gitignore** to exclude unnecessary files

## After Pushing to GitHub

Once you've successfully pushed to GitHub, you can verify the changes on the repository page:
https://github.com/Calvinhgy/LightBulb_v1

The repository now includes all the necessary files for deploying the LightBulb game to AWS using CloudFormation and CloudFront OAI.
