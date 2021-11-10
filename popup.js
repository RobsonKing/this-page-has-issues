import { render, h } from 'preact';
import GitHub from 'github-api';
import {useEffect, useState} from "preact/hooks";
// import fetch from "node-fetch";
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

function Repos() {
    const [repos, setRepos] = useState([]);
    // const increment = useCallback(() => {
    //     setValue(value + 1);
    // }, [value]);

    useEffect(() => {
        fetch('https://api.github.com/graphql', {
            method: 'POST',
            body: JSON.stringify({query}),
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }).then(res => res.text())
            .then(body => console.log(body)) // {"data":{"repository":{"issues":{"totalCount":247}}}}
            .catch(error => console.error(error));
// todo rmk (08 Nov. 2021):
//        - parse body
//        - use await
//        - display results
//        - WhereTheBug
//        - test searching for url
//        - does regex help?
//        - menu item to get page url
//        - menu item to log bug
//        - link to issue
//        - preview issue
//        - closed vs open issues
//        - add extra search params
//        - bring over: menu code
//        - save token
//        - save URL mapping
//        - abstract the issue module
//        - abstract an issue
//        - search limit... paging...


        // Trigger your effect
        // console.log("*** here we go! ***", ); // todo rmk (07 Nov. 2021): remove
        // const gh = new GitHub({
        //     token: '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'
        // });
        //
        // let me = gh.getUser();
        // me.listStarredRepos(function(err, repos) {
        //     // look at all the starred repos!
        //     console.log("*** err ***", err); // todo rmk (07 Nov. 2021): remove
        //     console.log("*** repos ***", repos); // todo rmk (07 Nov. 2021): remove
        //     setRepos(repos)
        // });

        // let search = gh.search()
        //
        // console.log("*** RMK 3***", search); // todo rmk (08 Nov. 2021): remove
        //
        // search.forIssues(function(err, results) {
        //         console.log("*** err ***", err); // todo rmk (07 Nov. 2021): remove
        //         console.log("*** repos ***", results); // todo rmk (07 Nov. 2021): remove
        //         setRepos(results)
        //     })
        return () => {
            // Optional: Any cleanup code
        };
    }, []);

    return (
        <div>
           Repos
            {repos.map( (repo)=><div>{repo.name}</div>)}
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
