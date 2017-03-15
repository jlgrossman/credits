type $ = HTMLElement[] & {
  each:(func:Function)=>$,
  append:(element:HTMLElement|HTMLElement[])=>$,
  clone:(deepCopy?:boolean)=>$,
  find:(selector:string)=>$,
  add:($:$)=>$,
  remove:()=>$,
  parent:()=>$,
  on:(event:string,handler:Function)=>$,
  off:(event:string,handler:Function)=>$,
  trigger:(event:string,data?:Object)=>$,
  addClass:(className:string)=>$,
  removeClass:(className:string)=>$,
  toggleClass:(className:string)=>$,
  hasClass:(className:string)=>boolean,
  delay:(time:number, func:Function)=>$,
  text:{
    ():string
    (text:any):$
  },
  data: {
    (name:string):string
    (name:string,value:any):$
  },
  html: {
    ():string
    (html:any):$
  },
  css : {
    (property:string):string
    (property:string,value:string):$
  }
};

function ajax(obj:{url:string, params?:Object, responseType?:string, success?:Function, error?:Function}) {
    if (!obj.url) return;
    var params: any = [];
    for (var i in obj.params) params.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj.params[i]));
    params = params.join("&");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", obj.url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          if(xhr.status == 200){
            try {
                if (obj.success) {
                    obj.success(
                        (obj.responseType && obj.responseType.toLowerCase() == 'text') ?
                        xhr.responseText :
                        JSON.parse(xhr.responseText)
                    );
                }
            } catch (e) {
                if (obj.error) obj.error(e);
            }
          } else {
            obj.error(xhr.status);
          }
        }
    };
    xhr.send(params);
}

function $(arg:any):$ {
    var a;
    if(arg.each) return arg;
    else if (arg instanceof Array) a = arg;
    else a = (/<[a-zA-Z0-9]+>/.test(arg)) ? [document.createElement(arg.replace(/<|>/g, ""))] : arg instanceof HTMLElement ? [arg] : document.querySelectorAll(arg);
    a.each = function(f) {
        for (var i = 0; i < this.length; i++) f(this[i]);
        return this;
    };
    a.append = function(e) {
        return this.each(function(n) {
            if(!('length' in e)) e = [e];
            for(var el of e) n.appendChild(el);
        });
    };
    a.clone = function(d){
        var a = [];
        this.each(function(n){
            a.push(n.cloneNode(d));
        });
        return $(a);
    };
    a.find = function(s) {
        var a = [];
        this.each(function(n) {
            a.push(...n.querySelectorAll(s));
        });
        return $(a);
    };
    a.add = function(o) {
        var na = [].slice.call(a);
        na.push(...o);
        return $(na);
    };
    a.remove = function() {
        return this.each(function(n) {
            n.parentNode.removeChild(n);
        });
    };
    a.parent = function() {
        return $(this[0].parentNode);
    };
    a.on = function(e, f) {
        return this.each(function(n) {
            n.addEventListener(e, f.bind(n));
        });
    };
    a.off = function(e, f) {
      return this.each(function(n) {
        n.removeEventListener(e, f);
      });
    }
    a.trigger = function(e,d) {
        var evt = d ? new CustomEvent(e,d) : new Event(e);
        return this.each(function(n){
          n.dispatchEvent(evt);
        });
    };
    a.addClass = function(c) {
        return this.each(function(n) {
            n.classList.add(c);
        });
    };
    a.removeClass = function(c) {
        return this.each(function(n) {
            n.classList.remove(c);
        });
    };
    a.toggleClass = function(c) {
        return this.each(function(n) {
            n.classList.toggle(c);
        });
    };
    a.hasClass = function(c) {
        for (var i = 0; i < this.length; i++)
            if (this[i].classList.contains(c)) return true;
        return false;
    };
    a.delay = function(t,f){
    	setTimeout(()=>{
    		this.each(function(n){f.apply(n)})
    	},t)
    	return this;
    };
    a.text = function(t) {
        return t == undefined ? (this[0].textContent || this[0].value) : this.each(function(n) {
            "value" in n ? n.value = t : n.textContent = t;
        });
    };
    a.data = function(m, v) {
        return !v ? this[0].dataset[m] : this.each(function(n) {
            n.dataset[m] = v;
        });
    };
    a.html = function(d){
        return d == undefined ? this[0].innerHTML : this.each(function(n) {
            n.innerHTML = d;
        });
    };
    a.css = function(s,v){
        return !v ? this[0].style[s] : this.each(function(n) {
            n.style[s] = v;
        });
    };
    return a;
}

function ready(f) {
    window.addEventListener('load', f);
}

function throttle(ms:number, func:Function, throttledFunc?:Function):Function{
  var throttled:boolean = false;
  return function(){
    if(!throttled){
      func.apply(null, arguments);
      throttled = true;
      setTimeout(function(){throttled = false;},ms);
    } else {
      if(throttledFunc) throttledFunc.apply(null, arguments);
    }
  };
}

function compose(f:Function, g:Function):Function {
  return function(){
    f.apply(null, arguments);
    return g.apply(null, arguments);
  }
}
