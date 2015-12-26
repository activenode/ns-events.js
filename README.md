# ns-events.js
&lt; 1kb library to enable namespaced events element.bind('click.namespace')

Usage
------
The usage is straight-forward and simple. 
Instead of 'addEventListener', you write 'bind'. Then go ahead and namespace your events.

## Example 1, no namespaces

    document.querySelector('body').bind('click', function(event){
      alert('hello');
    });

## Example 2, namespace your events, yeeehaa!

    document.querySelector('body').bind('click', function(event){
      alert('hello');
    });
    
    document.querySelector('body').bind('click.world', function(event){
      alert('world');
      document.querySelector('body').unbind('click.world');
    });
