# metalsmith-one-lunr

A metalsmith/markdown plugin to implement [lurn](https://lunrjs.com/) search.

For detailed usage, refer to [wiki](https://github.com/GrapeCity/metalsmith-one-lunr/wiki).

## Installation

```bash
$ npm install metalsmith-one-lunr
```

## Config

Example

```js
...
{
    consoleLog: false,
    enabled: true
}
...
```

More information about config attributes:

* `consoleLog` (optional boolean default:`false`) - to log the info to console
* `enabled` (optional boolean default:`true`) - to enable/disable the entire plugin
* `ref` (optional string default:`filePath`) - sets the document field used as the document reference. The other value can be `id`.
* `fields` (optional key-value pair default: `contents:1` ) - list of document fields that to be indexed. The value part contains the boost value - that field to have more importance when ranking search results.
* `piplelineFunctions` (optional) - list of [pipeline functions](https://lunrjs.com/docs/lunr.PipelineFunction.html) to mutate the token string or mutate (or add) metadata for a given token.

## Documentation

Refer to the [wiki](https://github.com/GrapeCity/metalsmith-one-lunr/wiki)

## Credits

* [Oliver Nightingale](https://github.com/olivernn) for creating [lunr](https://github.com/olivernn/lunr.js), on which this plugin was based

## License

MIT
