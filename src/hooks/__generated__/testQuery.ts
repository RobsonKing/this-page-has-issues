/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: testQuery
// ====================================================

export interface testQuery_search_nodes {
  __typename: "App" | "Discussion" | "Issue" | "MarketplaceListing" | "Organization" | "PullRequest" | "Repository" | "User";
}

export interface testQuery_search {
  __typename: "SearchResultItemConnection";
  /**
   * A list of nodes.
   */
  nodes: (testQuery_search_nodes | null)[] | null;
}

export interface testQuery {
  /**
   * Perform a search across resources.
   */
  search: testQuery_search;
}

export interface testQueryVariables {
  query: string;
}
