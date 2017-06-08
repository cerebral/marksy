# marksy
A markdown to custom components library. Supports any virtual DOM library.

## Install

`npm install marksy`

## API
```js
import React, {createElement} from 'React';
import marksy from 'marksy'
// const marksy = require('marksy').marksy

const compile = marksy({
  // Pass in whatever creates elements for your
  // virtual DOM library. h('h1', {})
  createElement,

  // You can override the default elements with
  // custom VDOM trees
  elements: {
    h1 ({id, children}) {
      return <h1 className="my-custom-class">{children}</h1>
    },
    h2 ({id, children}) {},
    h3 ({id, children}) {},
    h4 ({id, children}) {},
    blockquote ({children}) {},
    hr () {},
    ol ({children}) {},
    ul ({children}) {},
    p ({children}) {},
    table ({children}) {},
    thead ({children}) {},
    tbody ({children}) {},
    tr ({children}) {},
    th ({children}) {},
    td ({children}) {},
    a ({href, title, target, children}) {},
    strong ({children}) {},
    em ({children}) {},
    br () {},
    del ({children}) {},
    img ({src, alt}) {},
    code ({language, code}) {},
    codespan ({children}) {}
  }
})

const compiled = compile('# hello', {
  // Options passed to "marked" (https://www.npmjs.com/package/marked)
})

compiled.tree // The React tree of components
compiled.toc // The table of contents, based on usage of headers
```

### Custom components
You can also add your own custom components. You do this by importing `marksy/components`. This build of marksy includes babel transpiler which will convert any HTML to elements and allow for custom components:

<pre lang="js"><code>
import React, {createElement} from 'react'
import marksy from 'marksy/components'

const compile = marksy({
  createElement,
  components: {
    MyCustomComponent (props) {
      return &lt;h1>{props.children}&lt;/h1>
    }
  }
})

/* MARKDOWN:
  # Just a test
  &lt;MyCustomComponent>some text&lt;/MyCustomComponent>
*/

/* WITH LANGUAGE FOR GENERIC SUPPORT:
  # Just a test
  ```marksy
  &lt;/MyCustomComponent>some text&lt;/MyCustomComponent>
  ```
*/
</code></pre>

This will be converted to the component above. You can pass in any kind of props, as if it was normal code.


## Code highlighting
To enable code highlighting the [Highlight.js](https://highlightjs.org/) project needs to be passed in as an option. It can be a good idea to register only necessary languages you need:

```js
import {createElement} from 'react'
import 'highlight.js/styles/github.css';
import highlight from 'highlight.js/lib/highlight';
import hljsJavascript from 'highlight.js/lib/languages/javascript';
import marksy from 'marksy/components'

highlight.registerLanguage('javascript', hljsJavascript);

const compile = marksy({
  createElement,
  highlight
})
```

This can also be used on server side.

## Developing
1. Clone repo
2. `npm install`
3. `npm start` -> localhost:8080 (development app)
