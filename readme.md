# This page has Issues

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

1. Build for production
2. Navigate to chrome://extensions/
3. Click 'Load Unpacked'
4. Select your 'dist folder'

Plug in should ot be available, if you want to always see it on your toolbar, you can pin it.

## How to see errors in Chrome
To use the Chrome dev tools, right click on the extension icon and choose inspect popup

-----

## Todo: Ideas

- context menu
  - menu item to get page url (so you can copy it to a bug)
  - menu item to log bug
- preview issue  (just click on it?)
- saving:
  - obfuscate token
  - is there somewhere better to store token
- STYLES
  - share styles
  - dark mode
    - option to turn off.
- multiple configured repos
- search 
  - paging... (+)
  - issue count (+)
  - has more (+)
  - next, previous (+)
  - add extra search params
  - search options
    - search by page title
    - search by location on page (right click)
      - show tree of nodes? let the user select
- tests (+)
- fields to add :
- group by bug, issues, etc
- filter by bug, issue, etc, pr
- alias routes (vs vs as)
- publish plugin


