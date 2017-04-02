abstract class AjaxProcess {

  public constructor(public webservice:string, public readonly success?:(data:Object)=>void, public readonly error?:(msg:string)=>void){}

}
