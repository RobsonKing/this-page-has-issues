import {DocumentNode, gql} from "@apollo/client";

const PAGE = "*PAGE*";
//https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests
// todo rmk (10 Nov. 2021): is:open  OPTIONAL ARGUMENTS!
// todo rmk (10 Nov. 2021):sort https://docs.github.com/en/search-github/getting-started-with-searching-on-github/sorting-search-results
// todo rmk (09 Nov. 2021): page info?
// todo rmk (10 Nov. 2021):is there a better way to build the url?  git hub ignores special characters, quotes mean the
//  words must be together, but need and end so it doesn't find child pages or other URLs

const ISSUE_QUERY = gql`
    query GetIssues($first : Int!, $query: String!){
        search(first: $first, query: $query, type:ISSUE){
            nodes{
                ... on Issue{
                    number
                    milestone{
                        title
                    }
                    state
                    title
                    author{
                        login
                        avatarUrl
                    }
                    url
                }
            }
        }
    }`;

export interface Filters {
    showOpenIssues: boolean
    showClosedIssues: boolean
}


export default class IssueService {

    /*
    * all ids replaced with 'x'
    * looks something like: /place/thing/x/reports/?id=x
    */
    buildPageSearchString(url): string {
        // todo rmk (12 Nov. 2021):this is where options to make the search string will go
        return `${url.pathname}${url.search}`.replace(/\d+/g, 'x');
    }

    getQueryParams(url, filters: Filters): { first: number; query: string } {
        // todo rmk (27 Dec. 2021):  hard coded to a repo!!!

        return {
            first: 10,
            query: this.getQuery(url, filters)
        };
    }

    getQuery(url, filters: Filters): string {
        const repo = "atvenu/atvenu";
        const urlSearchString = this.buildPageSearchString(url);
        const query = `repo:${repo} is:issue ${this.getStatusFilter(filters)} "start(${PAGE})end"`;
        return query.replace(PAGE, urlSearchString);
    }

    getQueryParamsAsString(url, filters: Filters): string {
        //building this ?q=is%3Aissue+is%3Aopen+refund
        return encodeURI(this.getQuery(url, filters).replace(' ', '+'));
    }

    getIssueQueryForCurrentPage(): DocumentNode {
        return ISSUE_QUERY;
    }

    private getStatusFilter(filters): string {
        let result = "";
        if (!filters.showClosedIssues && filters.showOpenIssues) {
            result = "is:open";
        } else if (!filters.showOpenIssues && filters.showClosedIssues) {
            result = "is:closed";
        }

        return result;
    }
}

