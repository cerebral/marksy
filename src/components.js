import createRenderer from './createRenderer';
import marked from 'marked';
import {transform} from 'babel-standalone';

export function marksy (options = {}) {
  options.components = options.components || {};

  const tracker = {
    tree: null,
    elements: null,
    nextElementId: null,
    toc: null
  };
  const renderer = createRenderer(tracker, options, {
    html: function (html) {
      try {
        const code = transform(html, {
          presets: ['react']
        }).code;
        const components = Object.keys(options.components).map(function (key) {
          return options.components[key];
        });
        const mockedReact = {createElement: options.createElement};

        tracker.tree.push(options.createElement(function () {
          return new Function('React', ...Object.keys(options.components), `return ${code}`)(mockedReact, ...components) || null;
        }, {key: tracker.nextElementId++}));
      } catch (e) {}
    },
    code: !(options.elements && options.elements['code']) ? function (code, language) {
      if (language === 'marksy') {
        return renderer.html(code)
      } else {
        const elementId = tracker.nextElementId++;

        function CodeComponent () {
          return options.createElement('pre', null, options.createElement('code', {
            className: `hljs ${language}`,
            dangerouslySetInnerHTML: {__html: options.highlight ? options.highlight.highlightAuto(code).value : code}
          }))
        }

        tracker.elements[elementId] = options.createElement(CodeComponent, {key: elementId});

        tracker.tree.push(tracker.elements[elementId]);

        return `{{${elementId}}}`;
      }
    } : undefined
  })

  return function compile (content, markedOptions = {}) {
    tracker.tree = [];
    tracker.elements = {};
    tracker.toc = [];
    tracker.nextElementId = 0;
    marked(content, Object.assign({renderer: renderer, smartypants: true}, markedOptions));

    return {tree: tracker.tree, toc: tracker.toc};
  };
}


export default function (options) {
  return marksy(options)
};
