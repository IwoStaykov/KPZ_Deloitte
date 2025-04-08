import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/

const schema = a.schema({
  Prompt: a
    .model({
      title: a.string().required(),
      description: a.string(),
      content: a.string().required(),
      tags: a.string().array(),
      authorId: a.id().required(), // Klucz obcy do user
      creationDate: a.datetime().required(),
      lastModifiedDate: a.datetime().required(),
      latestVersionId: a.id(),
      author: a.belongsTo('User', 'authorId'),
      versions: a.hasMany("Version", "promptId"),
      latestVersion: a.belongsTo('Version', 'latestVersionId'),
      favoritedBy: a.hasMany('UserFavoritePrompt', 'promptId')
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Version: a
    .model({
      content: a.string().required(),
      versionNumber: a.string().required(),
      creationDate: a.datetime().required(),
      promptId: a.id().required(), // Klucz obcy do Prompt
      prompt: a.belongsTo("Prompt", 'promptId') // Relacja do nadrzędnego promptu
    })
    .authorization((allow) => [allow.publicApiKey()]),

  
  User: a
    .model({
      name: a.string().required(),
      surname: a.string().required(),
      email: a.email(),
      authoredPrompts: a.hasMany('Prompt', 'authorId'),
      favoritePrompts: a.hasMany('UserFavoritePrompt', 'userId')
    })
    .authorization((allow) => [allow.publicApiKey()]),


  UserFavoritePrompt: a
    .model({
      userId: a.id().required(), // Klucz obcy do User
      user: a.belongsTo('user', 'userId'),
      promptId: a.id().required(), // Klucz obcy do Prompt
      prompt: a.belongsTo('Prompt', 'promptId')
    })
    .authorization((allow) => [allow.publicApiKey()])
    .identifier(['userId', 'promptId']), // Klucz złożony zapobiega duplikatom
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool", // Zalecany tryb dla aplikacji z logowaniem użytkowników
    // Opcjonalnie: Konfiguracja API Key jeśli jest potrzebny dostęp publiczny
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>