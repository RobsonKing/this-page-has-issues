import "core-js/stable";
import "regenerator-runtime/runtime";

import { render, h } from 'preact';
import {useEffect, useState} from "preact/hooks";
const token = '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';

const query = `
  query {
     search(first:5,query:"repo:atvenu/atvenu refund",type:ISSUE){
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

    useEffect(() => {
        const  getData= async () => {
            let response = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                body: JSON.stringify({query}),
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            if (response.status === 200){
                let data = await response.json();
                console.log("*** data ***", data); // todo rmk (09 Nov. 2021): remove
                setIssues(data.data.search.nodes)

            } else{
                // todo rmk (09 Nov. 2021):
                throw "???"
            }
            console.log("*** RMK ***", response); // todo rmk (09 Nov. 2021): remove
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
