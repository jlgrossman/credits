class Form extends AjaxProcess {

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

    let $next:$;
    const formProgress:Function = ($next:$) => (e) => e.keyCode == 13 && $next[0].focus();
    for(let i = this._$fields.length - 1; i >= 0; i--){
      $next = this._$fields.get(i).on('keypress',
        $next ?
        formProgress($next) :
        (e) => e.keyCode == 13 && this.submit()
      );
    }
  }

  public get $fields():$ { return this._$fields; }

  public submit(params?:Object):void {
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
