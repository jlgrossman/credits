abstract class Component extends AjaxProcess {

  public abstract update(params?:Object):void;

}

class TextComponent extends Component {

  public constructor(webservice:string, public readonly $$binding:$$, success?:(data:Object)=>void, error?:(msg:string)=>void){
    super(webservice, success, error);
  }

  public update(params?:Object):void {
    ajax({
      url: this.webservice,
      responseType: 'json',
      params: extend(params, {output: 'json'}),
      success: (data) => {
        if(!data.success) return this.error(data.msg);
        this.$$binding.value = data.msg;
        this.success(data);
      },
      error: (msg) => this.error(msg)
    });
  }

}

class HTMLComponent extends Component {

  public constructor(webservice:string, public readonly $container:$, success?:(data:Object)=>void, error?:(msg:string)=>void){
    super(webservice, success, error);
  }

  public update(params?:Object):void {
    ajax({
      url: this.webservice,
      responseType: 'text',
      params: extend(params, {output: 'html'}),
      success: (data) => {
        this.$container.html(data);
        this.success && this.success(data);
      },
      error: (msg) => this.error(msg)
    });
  }

}

class SynchronizedComponent {

  private _timeout:number;
  private _running:boolean;

  public constructor(public readonly component:Component, public readonly getTimeout:()=>number){}
  
  private update (onlySetTimeout:boolean){
    if(!onlySetTimeout) this.component.update();
    this._timeout = setTimeout(this.update, this.getTimeout());
  }

  public get isRunning():boolean { return this._running; }
  public start(doImmediately?:boolean){ !this._running && (this._running = true) && this.update(!doImmediately); }
  public stop(){ this._running && ((this._running = false) || clearTimeout(this._timeout)); }

}
