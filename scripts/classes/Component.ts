abstract class Component {

  public constructor(public webservice:string, public readonly success?:(data:Object)=>void, public readonly error?:(msg:string)=>void){}

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

class FormComponent extends Component {

  private _$fields:$;
  private _$submit:$;
  private _$errorMessage:$;
  private _submitInProgress:boolean;

  public constructor(webservice:string, public readonly $form:$, public readonly validate:(fields:Object)=>string, success?:(data:Object)=>void, error?:(msg:string)=>void){
    super(webservice, success, error);
    this._$fields = this.$form.find('.field');
    this._$submit = this.$form.find('.submit');
    this._$errorMessage = this.$form.find('.error-msg');
    this._submitInProgress = false;
  }

  public get $fields():$ { return this._$fields; }

  public update(params?:Object):void {
    const fields = {};
    let validationMessage:string;

    this._$fields.each((field) => {
      const $field = $(field);
      fields[$field.data('name')] = $field.text();
    });

    if(!this._submitInProgress && (validationMessage = this.validate(fields))){
      this._$submit.addClass(Css.LOADING);
      this._submitInProgress = true;
      ajax({
        url: this.webservice,
        params: extend(params, fields),
        success: (data) => {
          this._$submit.removeClass(Css.LOADING);
          this._submitInProgress = false;
          if(data.success) {
            this._$errorMessage.removeClass(Css.OPEN);
            this.success(data);
          } else {
            this._$errorMessage.text(data.msg).addClass(Css.OPEN);
            this.error(data.msg);
          }
        },
        error: (msg) => {
          this._$submit.removeClass(Css.LOADING);
          this._submitInProgress = false;
          this._$errorMessage.text(msg).addClass(Css.OPEN);
          this.error(msg);
        }
      });
    } else {
      this._$errorMessage.text(validationMessage).addClass(Css.OPEN);
      this.error(validationMessage);
    }
  }

}
