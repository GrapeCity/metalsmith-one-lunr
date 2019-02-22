module.exports = class Plugin {
    
    constructor(options) {
      this.consoleLog = typeof options.consoleLog === 'boolean' ? options.consoleLog : false;
      this.enabled = typeof options.enabled === 'boolean' ? options.enabled : true;
      this.indexPath = typeof opts.indexPath === 'string' ? options.indexPath : 'searchIndex.json';
      this.fields = options.fields || {contents: 1};
      this.ref = options.ref || 'filePath';
      this.pipelineFunctions = options.pipelineFunctions || [];

      this._actions =  typeof options.actions === 'object'
        ? this.ActionBuilders(options.actions)
        : [];
    }
  
    get actions() {
      if (this._actions) {
        return this._actions.sort((a, b) => {
          if (a.priority < b.priority) return -1;
          if (a.priority > b.priority) return 1;
          return 0;
        }).filter(x=>{ return x.enabled});
      } else return [];
    }
    set actions(val) {
      this._actions = val;
    }
  
    hasActions() {
      return this.actions.length > 0 ? true : false;
    }
    
    Logger(output) {
      if (this.consoleLog) console.log(output);
    }
  
    ActionBuilders(actions) {
      var _actions = actions.map(action => {
        if (actionTypes.indexOf(action.type.toLowerCase() > -1)) {
          switch (action.type) {
            case 'var':
              return new VarPluginAction(action);
              break;
            case 'file':
              return new FilePluginAction(action);
              break;
            case 'replace':
              return new ReplacePluginAction(action);
              break;
            default:
              break;
          }
        } else {
          console.warn(`WARNING:Action type ${action.type} can not be found!  Skipping item...`);
        }
      });
      return _actions;
    }
  }