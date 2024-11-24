#!/usr/bin/env node
import "dotenv/config";
import * as cdk from "aws-cdk-lib";
import { DeployStack } from "../lib/deploy-stack.js";

const app = new cdk.App();
new DeployStack(app, `Eliza-${process.env.STAGE ?? "dev"}`, {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
});
