// Import necessary CDK libraries
import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import { createHash } from "crypto";
import * as path from "path";

type Props = {
    buildSha: string;
    discordApplicationId: string;
    discordApiToken: string;
    openaiApiKey: string;
    redpillApiKey: string;
    grokApiKey: string;
    groqApiKey: string;
    openrouterApiKey: string;
    googleGenerativeAiApiKey: string;
    lumaApiKey: string;
    elevenlabsXiApiKey: string;
};

export class ElizaEc2 extends Construct {
    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);

        const {
            buildSha,
            discordApplicationId,
            discordApiToken,
            openaiApiKey,
            redpillApiKey,
            grokApiKey,
            groqApiKey,
            openrouterApiKey,
            googleGenerativeAiApiKey,
            lumaApiKey,
            elevenlabsXiApiKey,
        } = props;

        // Define a VPC for the EC2 instance
        const vpc = new ec2.Vpc(this, "NodejsAppVpc", {
            maxAzs: 2,
        });

        // Define an EC2 instance type. Suitable for NodeJS with some AI capabilities
        const instanceType = new ec2.InstanceType("t3a.large"); // 8GB RAM, AMD64 architecture

        // Create a security group for the instance
        const securityGroup = new ec2.SecurityGroup(
            this,
            "NodejsAppSecurityGroup",
            {
                vpc,
                allowAllOutbound: true,
            }
        );
        securityGroup.addIngressRule(
            ec2.Peer.anyIpv4(),
            ec2.Port.tcp(22),
            "Allow SSH access"
        );

        // Create an S3 bucket to store the application code
        const appBucket = new s3.Bucket(this, "NodejsAppBucket", {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });

        // Upload the application code to the S3 bucket, excluding node_modules
        const envFile = `
DISCORD_APPLICATION_ID=${discordApplicationId}
DISCORD_API_TOKEN=${discordApiToken}
OPENAI_API_KEY=${openaiApiKey}
REDPILL_API_KEY=${redpillApiKey}
GROK_API_KEY=${grokApiKey}
GROQ_API_KEY=${groqApiKey}
OPENROUTER_API_KEY=${openrouterApiKey}
GOOGLE_GENERATIVE_AI_API_KEY=${googleGenerativeAiApiKey}
LUMA_API_KEY=${lumaApiKey}
ELEVENLABS_XI_API_KEY=${elevenlabsXiApiKey}
`;

        const envFileHash = createHash("sha256").update(envFile).digest("hex");
        const deployment = new s3deploy.BucketDeployment(
            this,
            "DeployAppToS3",
            {
                sources: [
                    s3deploy.Source.asset("..", {
                        exclude: ["**/node_modules/**", "deploy/**"],
                        ignoreMode: cdk.IgnoreMode.GLOB,
                    }),
                    s3deploy.Source.data(`app/${envFileHash}/.env`, envFile),
                ],
                destinationBucket: appBucket,
                destinationKeyPrefix: `app/${buildSha}`,
                expires: cdk.Expiration.atTimestamp(
                    new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).getTime() // 30 days
                ),
            }
        );

        // Create an EC2 instance
        const ec2Instance = new ec2.Instance(this, "NodejsAppInstance", {
            vpc,
            instanceType,
            machineImage: ec2.MachineImage.latestAmazonLinux2023(),
            securityGroup,
        });

        // User data script to install NodeJS 23.1.0 and other dependencies on AL2023
        ec2Instance.addUserData(
            "# Install NodeJS 23.1.0 and dependencies",
            "curl -sL https://rpm.nodesource.com/setup_23.x | bash -",
            "yum install -y nodejs",
            "npm install -g pnpm",
            "mkdir -p /home/ec2-user/app",
            "cd /home/ec2-user",
            "# Copy application code and install dependencies",
            `aws s3 cp s3://${appBucket.bucketName}/app/${buildSha} /home/ec2-user/app --recursive`,
            `aws s3 cp s3://${appBucket.bucketName}/app/${envFileHash}/.env /home/ec2-user/app/packages/eliza-starter/.env`,
            "cd /home/ec2-user/app",
            "pnpm install",
            "pnpm run build",
            "pnpm install --production",
            "cd packages/eliza-starter",
            "pnpm start"
        );

        // Grant the EC2 instance permission to read from the S3 bucket
        appBucket.grantRead(ec2Instance.role);
    }
}

const app = new cdk.App();
new NodejsAppStack(app, "NodejsAppStack");
