import "core-js/stable";
import "regenerator-runtime/runtime";

import { render, h } from 'preact';
import {useEffect, useState} from "preact/hooks";
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

function Repos() {
    const [issues, setIssues] = useState([]);
    const [currentPage, setCurrentPage] = useState("");

    useEffect(() => {
        const  getData= async () => {
            let queryOptions = { active: true, currentWindow: true };
            let [tab] = await chrome.tabs.query(queryOptions);
            const url = new URL(tab.url);
            let cP =(`${url.pathname}${url.search}`).replace(/\d+/g,'x');
            setCurrentPage(cP);

            let pageQuery = query.replace(PAGE,cP)
            console.log("*** pageQuery ***",typeof pageQuery,pageQuery); // todo rmk (10 Nov. 2021): remove
            let response = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                body: JSON.stringify({query: pageQuery}),
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            if (response.status === 200){
                let data = await response.json();
                if (data.errors){
                    console.log("*** errors ***", data.errors); // todo rmk (10 Nov. 2021): remove
                } else {
                    console.log("*** data ***", data); // todo rmk (09 Nov. 2021): remove
                    setIssues(data.data.search.nodes)
                }

            } else{
                // todo rmk (09 Nov. 2021):
                console.log("*** error ***", response); // todo rmk (10 Nov. 2021): remove
                throw "???"
            }
        }

        // noinspection JSIgnoredPromiseFromCall
        getData();
        return () => {
            // Optional: Any cleanup code
        };
    }, []);

    return (
        <div>
            Current Page
            {currentPage}
           Repos
            {issues.map( (repo)=><div>{repo.title}</div>)}
        </div>
    );
}

render(
    <div>
        Hello world
        <Repos/>
    </div>,
    document.getElementById('app')
);
