import "core-js/stable";
import "regenerator-runtime/runtime";

import { render, h } from 'preact';
import {useEffect, useState} from "preact/hooks";
const token = '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';

const PAGE = "*PAGE*"
//https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests
// todo rmk (10 Nov. 2021): is:open
// todo rmk (10 Nov. 2021):sort https://docs.github.com/en/search-github/getting-started-with-searching-on-github/sorting-search-results
//start(${PAGE})end
let page = "vs/venues/x/reports/register_show?show_id=x"
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

// todo rmk (09 Nov. 2021): page info?

function Repos() {
    const [issues, setIssues] = useState([]);
    const [currentPage, setCurrentPage] = useState("");

    useEffect(() => {
        const  getData= async () => {
            let queryOptions = { active: true, currentWindow: true };
            let [tab] = await chrome.tabs.query(queryOptions);
            const url = new URL(tab.url);
            console.log("*** URL ***", url); // todo rmk (10 Nov. 2021): remove
            console.log("*** pathname ***", url.pathname); // todo rmk (10 Nov. 2021): remove
            console.log("*** search ***", url.search); // todo rmk (10 Nov. 2021): remove
            // start(/vs/venues/x/reports/register_show?show_id=x)end"
            // start(/vs/venues/x/reports/register_show?show=x)end"
            let cP =(`${url.pathname}${url.search}`).replace(/\d+/g,'x');
            setCurrentPage(cP);
            console.log("*** RMK ***", cP); // todo rmk (10 Nov. 2021): remove

            let pageQuery = query.replace(PAGE,cP)
            // let pageQuery = query;
            console.log("*** RMK ***", typeof query, query); // todo rmk (10 Nov. 2021): remove
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
                console.log("*** data ***", data); // todo rmk (09 Nov. 2021): remove
                if (data.errors){
                    console.log("*** errors ***", data.errors); // todo rmk (10 Nov. 2021): remove
                } else {
                    setIssues(data.data.search.nodes)
                }

            } else{
                // todo rmk (09 Nov. 2021):
                console.log("*** error ***", response); // todo rmk (10 Nov. 2021): remove
                throw "???"
            }
                // .then(res => res.text())
                // .then(body => console.log(body)) // {"data":{"repository":{"issues":{"totalCount":247}}}}
                // .catch(error => console.error(error));
        }

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
