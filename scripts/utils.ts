declare var USER_KEY : string;

type $ = HTMLElement[] & {
  each:(f:Function)=>$,
  append:(e:HTMLElement|HTMLElement[])=>$,
  clone:(b?:boolean)=>$,
  find:(s:string)=>$,
  remove:()=>$,
  parent:()=>$,
  on:(e:string,f:Function)=>$,
  trigger:(e:string,d?:Object)=>$,
  addClass:(c:string)=>$,
  removeClass:(c:string)=>$,
  toggleClass:(c:string)=>$,
  hasClass:(s:string)=>boolean,
  text:{
    ():string
    (t:string):$
  },
  data: {
    (m:string):string
    (m:string,v:any):$
  },
  html: {
    ():string
    (d:string):$
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
            n.addEventListener(e, f);
        });
    };
    a.trigger = function(e,d){
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
    a.text = function(t) {
        return t == undefined ? (this[0].innerText || this[0].value) : this.each(function(n) {
            "value" in n ? n.value = t : n.appendChild(document.createTextNode(t));
        });
    };
    a.data = function(m, v) {
        return !v ? this[0].dataset[m] : this.each(function(n) {
            n.dataset[m] = v;
        });
    };
    a.html = function(d){
        return !d ? this[0].innerHTML : this.each(function(n) {
            n.innerHTML = d;
        });
    };
    return a;
}

function ready(f) {
    window.addEventListener('load', f);
};
