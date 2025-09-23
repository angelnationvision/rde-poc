async function fetchGraphQL(endpoint, query, headers, variables = {}) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(`GraphQL Error: ${JSON.stringify(result.errors)}`);
    }

    return result.data;
  } catch (error) {
    console.error('fetchGraphQL error:', error);
    throw error;
  }
}
// eslint-disable-next-line import/prefer-default-export
export { fetchGraphQL };
