(function _polyBind (bAttachEvent){
    window.parseEvtExpr = function(expr){
      expr = expr.split('.');
      var _namespace = '__a__';
      var eventType = expr[0]; //e.g. click
      if (expr.length > 1) {
        _namespace = expr.slice(1).join('.').trim(); //e.g. "my-namespace"
      }

      return [eventType, _namespace];
    };
    function protify(key,v){
      Element.prototype[key] = v;
    }

    if (bAttachEvent) {
      protify('addEventListener', function(eventType, cb){
        this.attachEvent('on'+eventType, cb);
      });

      protify('removeEventListener', function(eventType, cb){
        this.detachEvent('on'+eventType, cb);
      });
    }

    protify('_bdlib', {});
    protify('bind', function(eventExpr, listenerCallback){

      //at first we need to make the function public
      eventExpr = parseEvtExpr(eventExpr);
      var eventType = eventExpr[0], ns = eventExpr[1];

      if (this._bdlib[eventType] == undefined) {
        this._bdlib[eventType] = {}; //HashMap<KeyStr,Array<Function>>
      }

      if (this._bdlib[eventType][ns] == undefined) {
        this._bdlib[eventType][ns] = []; //Array<Function>
      }

      this._bdlib[eventType][ns].push(listenerCallback);
      this.addEventListener(eventType, this._bdlib[eventType][ns][this._bdlib[eventType][ns].length - 1]);

      return this;
    });
    protify('unbind', function(eventExpr) {
      eventExpr = parseEvtExpr(eventExpr);
      var eventType = eventExpr[0], ns = eventExpr[1];

      var removeNamespaced = (function(context) {
        return function(evtType, _namespace){
          if (context._bdlib[evtType]) {
            for (var i in context._bdlib[evtType][_namespace]) {
              context.removeEventListener(evtType, context._bdlib[evtType][_namespace][i]);
            }
            delete context._bdlib[evtType][_namespace];
          }
        };
      }(this));

      if (ns=='__a__') {
        //run through ALL namespaced ones of type "eventType" and remove ALL
        //events
        for (var key in this._bdlib[eventType]) {
          removeNamespaced(eventType, key);
        }
      } else {
        removeNamespaced(eventType, ns);
      }

      return this;
    });
  }(!!document.attachEvent));
