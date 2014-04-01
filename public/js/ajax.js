function get(uri, params){
  var params = params ? params : {};
  ajax(uri, {
    query: params.query,
    headers: params.headers,
    success: params.success,
    httpError: params.httpError,
    otherError: params.otherError,
    method: 'get'
  });
}

function post(uri, params){
  var params = params ? params : {};
  ajax(uri, {
    query: params.query,
    headers: params.headers,
    success: params.success,
    httpError: params.httpError,
    otherError: params.otherError,
    method: 'post',
    body: params.body
  });
}

function ajax(uri, params){
  var query = params.query;
  var body = params.body;
  var headers = params.headers;
  var success = params.success;
  var httpError = params.httpError;
  var otherError = params.otherError;
  var method = params.method;

  function encodeQueryString(query){
    var parts = [];
    for(k in query){
      parts.push(
        encodeURIComponent(k) + '=' + encodeURIComponent(query[k])
      );
    }
    return parts.join('&');
  }

  var xhr = new XMLHttpRequest();
  xhr.open(method, uri + (query ? '?'+encodeQueryString(query) : ''));

  function load(e){
    if(this.status >= 200 && this.status < 300){
      if(success) success(this.responseText);
    }
    else{
      if(httpError) httpError(this.status, this.responseText);
    }
  }

  function bork(e){
    if(otherError) otherError();
  }

  xhr.addEventListener("load", load, false);
  xhr.addEventListener("error", bork, false);

  if(headers){
    var k;
    for(k in headers){
      xhr.setRequestHeader(k, headers[k]);
    }
  }

  if(body) xhr.send(body);
  else xhr.send();
}
