const token = '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';

const PAGE = "*PAGE*"
//https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests
// todo rmk (10 Nov. 2021): is:open
// todo rmk (10 Nov. 2021):sort https://docs.github.com/en/search-github/getting-started-with-searching-on-github/sorting-search-results
// todo rmk (09 Nov. 2021): page info?
// todo rmk (10 Nov. 2021):is there a better way to build the url?  git hub ignores special characters, quotes mean the
//  words must be together, but need and end so it doesn't find child pages or other URLs
const query = `
  query {
     search(first:5,query:"repo:atvenu/atvenu \\"start(${PAGE})end\\"",type:ISSUE){
    nodes{
      __typename
      ... on Issue{
        number
        milestone{
          title
        }
        state
        title
        author{
          login          
        }
        url
      }
    }
  }
  }`;

// todo rmk (12 Nov. 2021):move to different file
export class IssueModel {
    constructor(issue) {
        this._issue = issue;
    }

    get title() {
        return this._issue.title;
    }

    get number() {
        return this._issue.number;
    }

    get milestone() {
        return this._issue.milestone?.title;
    }

    // todo: closed, fixed...
    get isOpen() {
        return this._issue.state === "OPEN"
    }

    get url() {
        return this._issue.url;
    }
}

class GithubIssueProvider {

    /*
    * all ids replaced with 'x'
    * looks something like: /place/thing/x/reports/?id=x
    */
    buildPageSearchString(url) {
        // todo rmk (12 Nov. 2021):this is where options to make the search string will go
        return (`${url.pathname}${url.search}`).replace(/\d+/g, 'x');
    }

    async getIssues(url) {
        const urlSearchString = this.buildPageSearchString(url);
        let pageQuery = query.replace(PAGE, urlSearchString)

        console.log("*** pageQuery ***", typeof pageQuery, pageQuery); // todo rmk (10 Nov. 2021): remove
        let response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            body: JSON.stringify({query: pageQuery}),
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        let data = await response.json();
        if (response.status === 200 && !data.error) {
            console.log("*** data ***", data); // todo rmk (09 Nov. 2021): remove
            // todo rmk (12 Nov. 2021): page infor
            return data.data.search.nodes.map(issue => new IssueModel(issue));
        } else {
            console.log("Failure to fetch issues", response, data?.error);
            return [];
        }
    }
}

class IssueService {
    constructor(issueProvider) {
        this.issueProvider = issueProvider;
    }

    async getIssuesForCurrentPage() {
        return this.issueProvider.getIssues(await this._getCurrentUrl());
    }

    async _getCurrentUrl() {
        let queryOptions = {active: true, currentWindow: true};
        let [tab] = await chrome.tabs.query(queryOptions);
        return new URL(tab.url);
    }
}

// todo rmk (12 Nov. 2021): export some sort of builder/factory
export const githubIssueService = new IssueService(new GithubIssueProvider());
