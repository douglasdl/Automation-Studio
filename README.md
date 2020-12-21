# Automation-Studio
> Reference codes for MappView XML codes.

How to implement basic functions usingMappView.

![](header.png)

## Installation

Windows:
<br>
[Download](https://www.br-automation.com/en/downloads/#categories=Software-1344987434933/Automation+Studio-1344987435049/Automation+Studio+4.9-1607265468893) from B&R.

## Usage examples

## EventBindings
<br>
EventBindingSet
<pre>
  <code>
    &lt;EventBindingSet&gt;
        &lt;Bindings&gt;&lt;/Bindings&gt;
    &lt;/EventBindingSet&gt;
  </code>
</pre>
<br>

EventBindingSet
<pre><code>
  &lt;Bindings&gt;
    &lt;EventBinding&gt;&lt;/EventBinding&gt;
  &lt;/Bindings&gt;</code>
</pre>

EventBindingSet
<pre><code>
<EventBinding>
  <Source />
  <EventHandler></EventHandler>
</EventBinding>
</pre>

_For more examples and usage, please refer to the [B&R Tutorial Portal](https://www.br-automation.com/en/academy/br-tutorial-portal/)._

## Development setup

Describe how to install all development dependencies and how to run an automated test-suite of some kind. Potentially do this for multiple platforms.

```sh
make install
npm test
```


## Contributing

1. Fork it (<https://github.com/douglasdl/Automation-Studio/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/newFeature`)
5. Create a new Pull Request

<!-- Markdown link & img dfn's -->
[npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[wiki]: https://github.com/yourname/yourproject/wiki


