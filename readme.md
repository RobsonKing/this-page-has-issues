## todo rmk (08 Nov. 2021):

- menu item to get page url
- menu item to log bug
- preview issue
- filter closed vs open issues
- add extra search params
- bring over: menu code
- save token
- save URL mapping
- search limit... paging...
- tests
- record what url = what repo (staging, dev, etc)
  - is the page part of your site?
-
  * issue assigned to
- copy URL and create bug
- group by bug, issues, etc
- alias routes (vs vs as)
- fall back to wild card search
- search by page title
- search by location on page (right click)
  - show tree of nodes? let the user select
- respect browser dark mode
- apollo
  - network status
  - build custom hook
    - this is where stuff will live to check config etc
- error boundary

# Getting Started

## Install

`yarn`

## Develop

js that is not minified and easier to debug

start watching the source and rebuilding.

`yarn dev:watch`

one time dev build

`yarn dev`

## Code Gen typescript types for queries

Because we use graphql which has types and typescript we can use some magic from apollo to code get our types for us. It
will look through our code for any gql queries and generate the types for just those queries and results.

Which is great when dealing with a large schema like github which we don't use!

Update the schema file by downloading from:
https://docs.github.com/en/graphql/overview/public-schema

Build the types for the queries you are using npx apollo:
`client:codegen --localSchemaFile schema.docs.graphql --target typescript --includes 'src/**/*.{ts,tsx}'`

## Production

`yarn build`

## Install in Chrome

todo

## How to see errors in Chrome

todo
