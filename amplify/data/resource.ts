import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Prompt: a
    .model({
      title: a.string().required(),
      description: a.string(),
      content: a.string().required(),
      tags: a.string().array(),
      authorId: a.id().required(), // sub z Cognito
      creationDate: a.datetime().required(),
      lastModifiedDate: a.datetime().required(),
      latestVersionId: a.id(),
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
      prompt: a.belongsTo("Prompt", 'promptId'), // Relacja do nadrzędnego promptu
      latestForPrompt: a.hasOne("Prompt", "latestVersionId"),
    })
    .authorization((allow) => [allow.publicApiKey()]),

    UserFavoritePrompt: a
    .model({
      userId: a.id().required(), // sub z Cognito
      promptId: a.id().required(),
      prompt: a.belongsTo('Prompt', 'promptId')
    })
    .authorization((allow) => [allow.publicApiKey()])
    .identifier(['userId', 'promptId']),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey", // Zalecany tryb dla aplikacji z logowaniem użytkowników
    // Opcjonalnie: Konfiguracja API Key jeśli jest potrzebny dostęp publiczny
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

