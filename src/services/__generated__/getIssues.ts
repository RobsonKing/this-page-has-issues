/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { IssueState } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetIssues
// ====================================================

export interface GetIssues_search_nodes_App {
  __typename: "App" | "Discussion" | "MarketplaceListing" | "Organization" | "PullRequest" | "Repository" | "User";
}

export interface GetIssues_search_nodes_Issue_milestone {
  __typename: "Milestone";
  /**
   * Identifies the title of the milestone.
   */
  title: string;
}

export interface GetIssues_search_nodes_Issue_author {
  __typename: "Bot" | "EnterpriseUserAccount" | "Mannequin" | "Organization" | "User";
  /**
   * The username of the actor.
   */
  login: string;
}

export interface GetIssues_search_nodes_Issue {
  __typename: "Issue";
  /**
   * Identifies the issue number.
   */
  number: number;
  /**
   * Identifies the milestone associated with the issue.
   */
  milestone: GetIssues_search_nodes_Issue_milestone | null;
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
  author: GetIssues_search_nodes_Issue_author | null;
  /**
   * The HTTP URL for this issue
   */
  url: any;
}

export type GetIssues_search_nodes = GetIssues_search_nodes_App | GetIssues_search_nodes_Issue;

export interface GetIssues_search {
  __typename: "SearchResultItemConnection";
  /**
   * A list of nodes.
   */
  nodes: (GetIssues_search_nodes | null)[] | null;
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
}
