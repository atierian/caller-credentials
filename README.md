# Testing Instructions

Deploy backend
```sh
npx ampx sandbox --once
```

```sh
npm run dev
```

**Testing authenticated role**
1. Create account
2. Create todo
3. List Todos / Get Todo with ID
4. Repeat steps 1 through 3

You'll observe that listing Todos returns both records.
This is because `dynamodb:LeadingKeys` isn't evaluated on SCAN operations.

Attempt to get the Todo based on the `id` of User A's Todo.
You'll observe this error (as expected):
```json
{
  "path": [
    "getTodo"
  ],
  "data": null,
  "errorType": "DynamoDB:DynamoDbException",
  "errorInfo": null,
  "locations": [
    {
      "line": 2,
      "column": 3,
      "sourceName": null
    }
  ],
  "message": "User: arn:aws:sts::[account]>:assumed-role/amplify-callercredentials-amplifyAuthauthenticatedU-A1QYRksaznNf/CognitoIdentityCredentials is not authorized to perform: dynamodb:Query on resource: arn:aws:dynamodb:us-east-1:[account]:table/Todo because no identity-based policy allows the dynamodb:Query action (Service: DynamoDb, Status Code: 400, Request ID: <id>)"
}
```

**Testing unauthenticated role**
Comment out / remove these lines in App.tsx

```tsx
<Authenticator>
  {({ signOut }) => (

    <Button onClick={signOut}>Sign Out</Button>
  )}
</Authenticator>
```

Create + List / Get Todos and observe behavior.