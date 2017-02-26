declare var USER_KEY : string;

type $ = HTMLElement[] & {
  each:(f:Function)=>$,
  append:(e:HTMLElement|HTMLElement[])=>$,
  find:(s:string)=>$,
  remove:()=>$,
  parent:()=>$,
  on:(e:string,f:Function)=>$,
  addClass:(c:string)=>$,
  removeClass:(c:string)=>$,
  toggleClass:(c:string)=>$,
  hasClass:(s:string)=>boolean,
  text:{
    ():string
    (t:string):$
  }
  data: {
    (m:string):string
    (m:string,v:any):$
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
        if (xhr.readyState == 4 && xhr.status == 200) {
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
        }
    };
    xhr.send(params);
}

function $(arg:any):$ {
    var a;
    if (arg instanceof Array) a = arg;
    else a = (/<[a-zA-Z0-9]+>/.test(arg)) ? [document.createElement(arg.replace(/<|>/g, ""))] : arg instanceof HTMLElement ? [arg] : document.querySelectorAll(arg);
    a['each'] = function(f) {
        for (var i = 0; i < this.length; i++) f(this[i]);
        return this;
    };
    a['append'] = function(e) {
        return this.each(function(n) {
            n.appendChild((e instanceof Array) ? e[0] : e);
        });
    };
    a['find'] = function(s) {
        var a = [];
        this.each(function(n) {
            a.push(...n.querySelectorAll(s));
        });
        return $(a);
    };
    a['remove'] = function() {
        return this.each(function(n) {
            n.parentNode.removeChild(n);
        });
    };
    a['parent'] = function() {
        return $(this[0].parentNode);
    };
    a['on'] = function(e, f) {
        return this.each(function(n) {
            n.addEventListener(e, f);
        });
  };
    a['addClass'] = function(c) {
        return this.each(function(n) {
            n.classList.add(c);
        });
    };
    a['removeClass'] = function(c) {
        return this.each(function(n) {
            n.classList.remove(c);
        });
    };
    a['toggleClass'] = function(c) {
        return this.each(function(n) {
            n.classList.toggle(c);
        });
    };
    a['hasClass'] = function(c) {
        for (var i = 0; i < this.length; i++)
            if (this[i].classList.contains(c)) return true;
        return false;
    };
    a['text'] = function(t) {
        return t == undefined ? (this[0].innerText || this[0].value) : this.each(function(n) {
            "value" in n ? n.value = t : n.appendChild(document.createTextNode(t));
        });
    };
    a['data'] = function(m, v) {
        return !v ? this[0].dataset[m] : this.each(function(n) {
            n.dataset[m] = v;
        });
    };
    return a;
}

function ready(f) {
    window.addEventListener('load', f);
};
