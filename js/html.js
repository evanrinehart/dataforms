var HTML = (function(){

  function type(x){
    return ({}).toString.call(x).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  }

  function h(text){
    /* < > " ' and & */
    return text
      .replace('&', '&amp;')
      .replace('"', '&quot;')
      .replace('<', '&lt;')
      .replace('>', '&gt;')
      .replace("'", '&#39;')
  }

  function encode_attrs(attrs){
    result = [];
    for(k in attrs){
      result.push(k);
      result.push('=');
      result.push('"'+h(attrs[k])+'" ');
    }
    return result;
  }

  function inner_flatten_array(accum, tree){
    var L = tree.length;
    var i;
    var v;
    for(i=0; i<L; i++){
      v = tree[i];
      if(v.constructor == Array){
        inner_flatten_array(accum, v);
      }
      else if(v.constructor == String || v.constructor == Number){
        accum.push(v);
      }
      else{
        throw new Error("html tree contains bad value of type "+type(v));
      }
    }
  }

  function flatten(tree){
    return inner_flatten_array([], tree);
  }

  function dom(tree){
    var html = flatten(tree).join('');
    var el = document.createElement('div');
    el.innerHTML = html;
    return el.children; 
  }

  function tags(tag_name, arg1, arg2){
    if(type(arg1)=='string' || type(arg1)=='array'){
      var content = arg1;
      var attrs = {};
    }
    else if(type(arg1)=='object'){
      var content = arg2;
      var attrs = arg1;
    }
    else{
      throw new Error('bad arguments');
    }

    return [
      "<",tag_name," ",encode_attrs(attrs),">",
      content,
      "</",tag_name,">"
    ];
  }

  function tag(tag_name, attrs){
    var attrs = attrs ? attrs : {};
    return ["<",tag_name," ",encode_attrs(attrs),">"];
  }

  function tsb(name){ return function(a,b){ tags(name,a,b); }}
  function tb(name){ return function(attrs){ tag(name,attrs); }}

  return {
    span: tsb('span'),
    div: tsb('div'),
    code: tsb('code'),
    a: tsb('a'),
    strong: tsb('strong'),
    br: tb('br'),
    i: tsb('i'),
    tags: tags,
    tag: tag,
    h: h,
    dom: dom
  };

});
