# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

-   `npm run build` compile typescript to js
-   `npm run watch` watch for changes and compile
-   `npm run test` perform the jest unit tests
-   `npx cdk deploy` deploy this stack to your default AWS account/region
-   `npx cdk diff` compare deployed stack with current state
-   `npx cdk synth` emits the synthesized CloudFormation template

## Creating an alchemy webhook

from: https://docs.alchemy.com/reference/custom-webhooks-faq

```
curl --request POST \
     --url https://dashboard.alchemy.com/api/create-webhook \
     --header 'X-Alchemy-Token: ${WEBHOOK_AUTH_TOKEN}' \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "network": "BASE_MAINNET",
  "webhook_type": "GRAPHQL",
  "graphql_query": {
    "skip_empty_messages": true,
    "query": "{   block {     logs(filter: {addresses: [\"0xf307e242BfE1EC1fF01a4Cef2fdaa81b10A52418\",\"0xBB5ED04dD7B207592429eb8d599d103CCad646c4\"], topics: []}) {       data       topics       transaction {         hash         from {           address         }         to {           address         }         logs {           account {             address           }           data           topics         }         type         status       }     }   } }"
  },
  "webhook_url": "${WEBHOOK_ENDPOINT}"
}
'
```
