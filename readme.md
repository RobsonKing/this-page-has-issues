# Getting Started

## Install

`yarn`

## Develop

js that is not minified and easier to debug

Start watching the source and rebuilding.

`yarn dev:watch`

One time dev build

`yarn dev`

## Code Gen typescript types for queries

Because we use graphql which has types and typescript we can use some magic from apollo to code get our types for us. It
will look through our code for any gql queries and generate the types for just those queries and results.

Which is great when dealing with a large schema like github which we don't use!

So if you change/add a query regenerate the types!

Update the schema file by downloading from:
https://docs.github.com/en/graphql/overview/public-schema

Build the types for the queries you are using
`npx apollo client:codegen --localSchemaFile schema.docs.graphql --target typescript --includes 'src/**/*.{ts,tsx}'`

## Production

`yarn build`

## Install in Chrome

todo

## How to see errors in Chrome
To use the Chrome dev tools, right click on the extension icon and choose inspect popup

-----

## Todo: Ideas

- context menu
  - menu item to get page url (so you can copy it to a bug)
  - menu item to log bug
  - copy URL and create bug
  - bring over: menu code
- preview issue  (just click on it?)
- add extra search params
- save:
  - multiple repos
  - obfuscate token
  - is there somewhere better to store token
- STYLES
  - share styles
  - respect browser dark mode
  - is the site using dark mode?
    - switch styles to dark mode
- allow user to switch between configured repos
- search limit...
  - paging... (+)
  - issue count (+)
  - has more (+)
  - next, previous (+)
- tests (+)
- fields to add :
  * issue assigned to
- group by bug, issues, etc
- alias routes (vs vs as)
- search options
    - fall back to wild card search (+)
    - search by page title
    - search by location on page (right click)
      - show tree of nodes? let the user select
