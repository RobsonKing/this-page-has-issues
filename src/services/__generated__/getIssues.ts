/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { IssueState } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetIssues
// ====================================================

export interface GetIssues_search_pageInfo {
  __typename: "PageInfo";
  /**
   * When paginating forwards, the cursor to continue.
   */
  endCursor: string | null;
  /**
   * When paginating forwards, are there more items?
   */
  hasNextPage: boolean;
}

export interface GetIssues_search_edges_node_App {
  __typename: "App" | "Discussion" | "MarketplaceListing" | "Organization" | "PullRequest" | "Repository" | "User";
}

export interface GetIssues_search_edges_node_Issue_milestone {
  __typename: "Milestone";
  /**
   * Identifies the title of the milestone.
   */
  title: string;
}

export interface GetIssues_search_edges_node_Issue_author {
  __typename: "Bot" | "EnterpriseUserAccount" | "Mannequin" | "Organization" | "User";
  /**
   * The username of the actor.
   */
  login: string;
  /**
   * A URL pointing to the actor's public avatar.
   */
  avatarUrl: any;
}

export interface GetIssues_search_edges_node_Issue_assignees_nodes {
  __typename: "User";
  /**
   * The username used to login.
   */
  login: string;
  /**
   * A URL pointing to the user's public avatar.
   */
  avatarUrl: any;
}

export interface GetIssues_search_edges_node_Issue_assignees {
  __typename: "UserConnection";
  /**
   * A list of nodes.
   */
  nodes: (GetIssues_search_edges_node_Issue_assignees_nodes | null)[] | null;
}

export interface GetIssues_search_edges_node_Issue {
  __typename: "Issue";
  /**
   * Identifies the issue number.
   */
  number: number;
  /**
   * Identifies the milestone associated with the issue.
   */
  milestone: GetIssues_search_edges_node_Issue_milestone | null;
  /**
   * Identifies the state of the issue.
   */
  state: IssueState;
  /**
   * Identifies the issue title.
   */
  title: string;
  /**
   * The actor who authored the comment.
   */
  author: GetIssues_search_edges_node_Issue_author | null;
  /**
   * The HTTP URL for this issue
   */
  url: any;
  /**
   * A list of Users assigned to this object.
   */
  assignees: GetIssues_search_edges_node_Issue_assignees;
}

export type GetIssues_search_edges_node = GetIssues_search_edges_node_App | GetIssues_search_edges_node_Issue;

export interface GetIssues_search_edges {
  __typename: "SearchResultItemEdge";
  /**
   * The item at the end of the edge.
   */
  node: GetIssues_search_edges_node | null;
}

export interface GetIssues_search {
  __typename: "SearchResultItemConnection";
  /**
   * Information to aid in pagination.
   */
  pageInfo: GetIssues_search_pageInfo;
  /**
   * A list of edges.
   */
  edges: (GetIssues_search_edges | null)[] | null;
}

export interface GetIssues {
  /**
   * Perform a search across resources.
   */
  search: GetIssues_search;
}

export interface GetIssuesVariables {
  first: number;
  query: string;
  cursor?: string | null;
}
