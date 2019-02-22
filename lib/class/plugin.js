'use strict';

var lunr = require('lunr');

module.exports = class Plugin {

  constructor(options) {
    this.consoleLog = typeof options.consoleLog === 'boolean' ? options.consoleLog : false;
    this.enabled = typeof options.enabled === 'boolean' ? options.enabled : true;
    this.indexFile = typeof options.indexFile === 'string' ? options.indexFile : 'searchIndex.json';
    this.fields = options.fields || { contents: 1 }; //list of documents fields with their boost number that will be indexed.
    this.ref = options.ref || 'filePath'; //sets the document field used as the document reference.
    this.pipelineFunctions = options.pipelineFunctions || [];
  }

  Logger(output) {
    if (this.consoleLog) console.log(output);
  }

  buildIndex(files) {
    this.Logger('m-o-l: Building index...');
    var _plugin = this;
    var store = {};
    var searchIndex = {
      index: lunr(function () {
        if (_plugin.pipelineFunctions) {
          this.pipeline.reset();
          _plugin.pipelineFunctions.forEach(function (f) {
            this.pipeline.add(f);
          }, this);
        }
        for (_field in _plugin.fields) {
          this.field(_field, { boost: _plugin.fields[_field] });
        }
        this.ref(_plugin.ref);
        this.metadataWhitelist = ['position'];
        for (file in files) {
          if (files[file].lunr) {
            var doc = createDocumentIndex(files[file], file);
            this.add(doc.index);
            store[file.substring(3)] = doc.store; //removing language prefix from the URL from file variable
          }
        }
      }),
      store: store
    };
    return searchIndex;
  }

  createDocumentIndex(file, path) {
    var contents, doc = {}, index = {}, store = {};
    if (this.ref == 'filePath') {
      index.filePath = path.substring(3); //removing language prefix from the URL
    } else {
      index[this.ref] = file[this.ref];
    }
    for (field in this.fields) {
      if (field === 'contents') {
        contents = file.contents.toString();
        if (typeof this.preprocess === 'function') {
          contents = this.preprocess.call(file, contents);
        }
        index.contents = cleanupContent(contents);
      } else {
        index[field] = file[field];
      }
    }
    store = { title: file['title'], abstract: file['description'], content: index.contents };
    doc = { index: index, store: store };
    return doc;
  }

  cleanupContent(content) {
    var cleanedText = content.replace(/<[^>]*>/g, '');
    cleanedText = cleanedText.replace(/(&.*?;)/g, '');
    cleanedText = cleanedText.replace(/[,.;:!]/g, ' ');
    cleanedText = cleanedText.replace(/[/]/g, ' ');
    cleanedText = cleanedText.replace(/\[.*?\]/g, ' ');
    cleanedText = cleanedText.replace(/\(.*\)/g, ' ')
    cleanedText = cleanedText.replace(/\r?\n|\r/g, '');
    cleanedText = cleanedText.replace(/  +/g, ' ');
    return cleanedText;
  }

  AddAsFile(searchIndex) {
    var contents = new Buffer(JSON.stringify({
      index: searchIndex.index,
      store: searchIndex.store
    }));
    files[this.indexFile] = { contents: contents };
  }
}