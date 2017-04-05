type joshQuery = {
  [key:number]:Element,
  length:number,
  each:(func:(element?:Element, index?:number) => any) => joshQuery,
  get:(index:number) => joshQuery,
  add:(selectorOrElements:string|joshQuery) => joshQuery,
  append:(elements:Element|joshQuery|string) => joshQuery,
  remove:() => joshQuery,
  clone:(deep:boolean) => joshQuery,
  find:(selector:string) => joshQuery,
  parent:() => joshQuery,
  addClass:(className:string) => joshQuery,
  removeClass:(className:string) => joshQuery,
  toggleClass:(className:string) => joshQuery,
  hasClass:(className:string) => boolean,
  text:(value?:string) => joshQuery,
  html:(value?:string) => joshQuery,
  data:(key:string, value?:string|number|boolean) => joshQuery,
  css:(property:string, value?:string) => joshQuery
};

const joshQuery = (function(){

  class Binding implements Binding {

  }

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
      (val instanceof Element) ?
      [val] :
      (typeof(val) == 'string' && val.indexOf('<') >= 0) ?
      [stringToHTML(val)] :
      document.querySelectorAll(val)
    );

    _.each = function(func:(element?:Element, index?:number) => any):joshQuery {
      for(let i = 0; i < this.length; i++) if(func.call(this[i], i) === false) break;
      return this;
    };

    _.get = function(index:number):joshQuery {
      return _joshQuery(this[index]);
    };

    _.add = function(selectorOrElements:string|joshQuery):joshQuery {
      const sum = [].slice.call(this);
      sum.push( ...<Element[]>(typeof(selectorOrElements) === 'string' ? _joshQuery(selectorOrElements) as any : selectorOrElements) );
      return _joshQuery(sum);
    }

    _.append = function(elements:Element|joshQuery|string):joshQuery {
      if(typeof(elements) === 'string') elements = _joshQuery(elements);
      return this.each(function(){
        if(elements instanceof Element) this.appendChild(elements);
        else for(let i = 0; i < elements.length; i++) this.appendChild(elements[i]);
      });
    };

    _.remove = function():joshQuery {
      return this.each((el) => el.parentNode.removeChild(el));
    };

    _.clone = function(deep:boolean):joshQuery {
      const clone:Element[] = [];
      this.each((el) => clone.push(el.cloneElement(deep)));
      return _joshQuery(clone);
    };

    _.find = function(selector:string):joshQuery {
      const result:Element[] = [];
      this.each((el) => result.push(...el.querySelectorAll(selector)));
      return _joshQuery(result);
    };

    _.parent = function():joshQuery {
      const parents:Element[] = [];
      this.each(function(){
        if(parents.indexOf(this.parentNode) < 0) parents.push(this.parentNode);
      });
      return _joshQuery(parents);
    };

    _.addClass = (className:string) => _.each((el) => el.classList.add(className));
    _.removeClass = (className:string) => _.each((el) => el.classList.remove(className));
    _.toggleClass = (className:string) => _.each((el) => el.classList.toggle(className));
    _.hasClass = function(className:string):boolean {
      for(let i = 0; i < this.length; i++) if(this[i].classList.contains(className)) return true;
      return false;
    };

    _.text = function(value?:string):joshQuery {
      return value === undefined ? (this[0].textContent || this[0].value)
      : this.each((n) => n['value' in n ? 'value' : 'textContent'] = value);
    };

    _.html = function(value?:string):joshQuery {
      return value === undefined ? this[0].innerHTML
      : this.each((n) => n.innerHTML = value);
    };

    _.data = function(key:string, value?:string):joshQuery {
      return value === undefined ? this[0].dataset[key]
      : this.each((n) => n.dataset[key] = value);
    };

    _.css = function(property:string, value?:string):joshQuery {
      return value === undefined ? this[0].style[property]
      : this.each((n) => n.style[property] = value);
    }

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
