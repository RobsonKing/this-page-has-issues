import {DocumentNode, gql} from "@apollo/client";

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

interface Filters {
    showOpenIssues: boolean
    showClosedIssues: boolean
}

export enum SearchOption {
    PARTIAL = "partial",
    FULL = "full",
}

export default class IssueService {

    /*
    * all ids replaced with 'x'
    * looks something like: start(/place/thing/x/reports/?id=x)end
    * looks something like: /place/thing/  * /reports/?id=*
    */
    buildPageSearchString(url, searchOption: SearchOption): string {
        console.log("*** searchOption ***", searchOption); // todo rmk (31 Jan. 2022): remove
        if (searchOption === SearchOption.FULL) {
            return `start(${url.pathname}${url.search})end`.replace(/\d+/g, 'x');
        }
        if (searchOption === SearchOption.PARTIAL) {
            return `${url.pathname}${url.search}`.replace(/\d+/g, '*');
        }
        // todo rmk (31 Jan. 2022): default? throw?
        return "";
    }

    getQueryParams(url, filters: Filters, searchOption: SearchOption): { first: number; query: string } {
        return {
            first: 10,
            query: this.getQuery(url, filters, searchOption)
        };
    }

    getQuery(url, filters: Filters, searchOption: SearchOption): string {
        // todo rmk (27 Dec. 2021):  hard coded to a repo!!!
        const repo = "atvenu/atvenu";
        return `repo:${repo} is:issue ${this.getStatusFilter(filters)} "${this.buildPageSearchString(url, searchOption)}"`;
    }

    getQueryParamsAsString(url, filters: Filters, searchOption: SearchOption): string {
        //building this ?q=is%3Aissue+is%3Aopen+refund
        return encodeURI(this.getQuery(url, filters, searchOption).replace(' ', '+'));
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

