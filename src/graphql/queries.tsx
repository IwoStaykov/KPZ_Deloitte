export const listPrompts = /* GraphQL */ `
  query ListPrompts($filter: ModelPromptFilterInput, $limit: Int) {
    listPrompts(filter: $filter, limit: $limit) {
      items {
        id
        title
        description
        tags
        category
        createdAt
      }
    }
  }
`;