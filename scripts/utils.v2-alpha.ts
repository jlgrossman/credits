type joshQuery = {
  [key:number]:Element,
  length:number,
  each:(func:(index?:number) => any) => joshQuery,
  get:(index:number) => joshQuery,
  add:(selectorOrElements:string|joshQuery) => joshQuery,
  append:(elements:Element|joshQuery|string) => joshQuery,
  clone:(deep:boolean) => joshQuery,
  find:(selector:string) => joshQuery,
};

const joshQuery = (function(){

  function stringToHTML(str:string):Element {
    const temp:HTMLTemplateElement = document.createElement('template');
    temp.innerHTML = str;
    return (temp.content.firstChild) as Element;
  }

  function _joshQuery(selectorOrHTML:string):joshQuery;
  function _joshQuery(element:Element):joshQuery;
  function _joshQuery(elements:Element[]):joshQuery;
  function _joshQuery(func:Function):joshQuery;
  function _joshQuery(val:any):joshQuery {
    if(val instanceof Function) window.addEventListener('load', val);
    else if(val.each) return val;
    const _:joshQuery = (
      (val instanceof Array) ?
      val :
      (typeof(val) == 'string' && val.indexOf('<') >= 0) ?
      [stringToHTML(val)] :
      val instanceof Element ?
      [val] :
      document.querySelectorAll(val)
    );

    _.each = function(func:(index?:number) => any):joshQuery {
      for(let i = 0; i < this.length; i++) func.call(this[i], i);
      return this;
    };

    _.get = function(index:number):joshQuery {
      return _joshQuery(this[index]);
    };

    _.add = function(selectorOrElements:string|joshQuery):joshQuery {
      const sum = [].slice.call(this);
      sum.push( typeof(selectorOrElements) === 'string' ? (..._joshQuery(selectorOrElements)) : (...selectorOrElements));
      return _joshQuery(sum);
    }

    _.append = function(elements:Element|joshQuery|string):joshQuery {
      if(typeof(elements) === 'string') elements = _joshQuery(elements);
      return this.each(function(){
        if(elements instanceof Element) this.appendChild(elements);
        else for(let i = 0; i < elements.length; i++) this.appendChild(elements[i]);
      });
    };

    _.clone = function(deep:boolean):joshQuery {
      const clone:Element[] = [];
      this.each(function(){
        clone.push(this.cloneElement(deep));
      });
      return _joshQuery(clone);
    };

    _.find = function(selector:string):joshQuery {
      const result:Element[] = [];
      this.each(function(){
        result.push(...this.querySelectorAll(selector));
      });
      return _joshQuery(result);
    };

    return _;
  }

  const joshQuery = _joshQuery as {
    (selectorOrHTML:string):joshQuery;
    (element:Element):joshQuery;
    (elements:Element[]):joshQuery;
    (func:Function):joshQuery;

    ajax:(url:string, obj?:{
      params?:Object,
      responseType?:string,
      success?:Function,
      error?:Function
    }) => void,

    cookie:(key:string, value?:string) => string,
    throttle:(time:number, func:Function, throttled?:Function) => Function,
    compose:(f:Function, g:Function) => Function,
    extend:(a:Object, b:Object) => Object

  };

  joshQuery.ajax = function(url:string, obj:{
    params?:Object,
    responseType?:string,
    success?:Function,
    error?:Function
  } = {}){
    const paramArray:string[] = [];
    for(let i in obj.params) paramArray.push(`${encodeURIComponent(i)}=${encodeURIComponent(obj.params[i])}`);
    const xhr:XMLHttpRequest = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = () => {
      if(xhr.readyState == XMLHttpRequest.DONE){
        if(xhr.status == 200){
          try {
            obj.success && obj.success(
              (obj.responseType && obj.responseType.toLowerCase() == 'html') ?
              xhr.responseText :
              JSON.parse(xhr.responseText)
            )
          } catch(exception){
            obj.error && obj.error(exception);
          }
        } else {
          obj.error && obj.error(xhr.status);
        }
      }
    };
    xhr.send(paramArray.join('&'));
  };

  joshQuery.cookie = function(key:string, value?:string):string {
    if(value) document.cookie = `${key}=${value}`;
    return value || document.cookie.replace(new RegExp(`(?:(?:^|.*;\\s*)${key}\\s*\=\\s*([^;]*).*$)|^.*$`), "$1");
  };

  joshQuery.throttle = function(time:number, func:Function, throttledFunc?:Function):Function {
    let throttled:boolean = false;
    return function(){
      if(!throttled){
        throttled = true;
        setTimeout(() => throttled = false, time);
        return func.apply(null, arguments);
      } else if (throttledFunc) {
        return throttledFunc.apply(null, arguments);
      }
    }
  };

  joshQuery.extend = function(a:Object, b:Object):Object {
    const e:Object = {};
    for(let i in a) e[i] = a[i];
    for(let i in b) if(e[i] == undefined) e[i] = b[i];
    return e;
  };

  return joshQuery;

})();
