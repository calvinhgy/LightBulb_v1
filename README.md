# 五彩灯泡 (Colorful Light Bulbs)

A web-based match-3 puzzle game featuring colorful light bulbs in a 40x40 grid.

## Project Overview

"五彩灯泡" (Colorful Light Bulbs) is a match-3 puzzle game where players swap adjacent light bulbs to create matches of three or more identical colors. When matched, these light bulbs disappear from the board, creating cascading effects and chain reactions.

### Key Features

- 40x40 grid of colorful light bulbs
- Four distinct colors: Red, Yellow, Blue, and Green
- Intuitive drag-and-drop gameplay
- Cascading effects and chain reactions
- Progressive difficulty through levels

## Deployment Instructions

### Option 1: Using the Deployment Script

1. Run the deployment script:
   ```
   ./deploy-lightbulb.sh
   ```

2. Follow the instructions provided by the script to complete the deployment using AWS CloudFormation.

3. After the CloudFormation stack is created, upload the website files to the S3 bucket.

4. Access your game through the CloudFront URL provided in the CloudFormation outputs.

### Option 2: Manual Deployment to AWS

1. Create an S3 bucket for hosting the website files.

2. Configure the S3 bucket for static website hosting with index.html as both the index and error document.

3. Upload all files from the `src/` directory to the S3 bucket.

4. Create a CloudFront distribution pointing to the S3 bucket to deliver the website content globally with HTTPS.

5. Access your game through the CloudFront domain name.

## Documentation Structure

This repository contains comprehensive documentation for the game development process, following prompt-driven development principles. The documentation is organized as follows:

### Design Documentation

- [Game Design Document](docs/design/game_design_document.md): Core concept, mechanics, and overall vision
- [Game Mechanics](docs/design/game_mechanics.md): Detailed explanation of gameplay systems
- [User Experience](docs/design/user_experience.md): Player journey, UI design, and interaction patterns

### Technical Documentation

- [Technical Specification](docs/technical/technical_specification.md): Technology stack and architecture overview
- [Code Architecture](docs/technical/code_architecture.md): Class structure, module interactions, and state management
- [Implementation Plan](docs/technical/implementation_plan.md): Development phases, task breakdown, and timeline

### Asset Requirements

- [Asset Requirements](docs/assets/asset_requirements.md): Detailed specifications for visual and audio assets

## Development Approach

This project follows a prompt-driven development approach, where comprehensive documentation is created before any code is written. This ensures:

1. Clear vision and direction for the project
2. Well-defined scope and requirements
3. Thoughtful architecture and design decisions
4. Efficient implementation process

## Getting Started

To begin development:

1. Review the documentation in the `docs` directory
2. Set up the development environment as specified in the technical documentation
3. Follow the implementation plan for a structured development process

## Directory Structure

```
/
├── docs/                  # Documentation files
│   ├── design/            # Game design documents
│   ├── technical/         # Technical specifications
│   └── assets/            # Asset requirements
├── src/                   # Source code
│   ├── js/                # JavaScript files
│   ├── css/               # CSS stylesheets
│   └── assets/            # Game assets
├── deploy-lightbulb.sh    # Deployment script
└── README.md              # Project overview
```

## License

[License information to be added]

## Credits

[Credits information to be added]
