class Tab {

  public static current:Tab;
  public static all:Tab[];

  private $tab:$; // tab button dom element
  private $content:$; // tab content dom element

  public constructor(public readonly name:string, public readonly onOpen?:Function, public readonly onClose?:Function){
    this.$tab = $(`.tab.${name}`).on('click', this.open);
    this.$content = $(`.tab-content.${name}`);
    Tab.all.push(this);
  }

  public open(){
    Tab.current.close();
    Tab.current = this;
    this.onOpen && this.onOpen();
    this.$tab.add(this.$content).addClass(Css.OPEN);
    cookie('currentTab', this.name);
  }

  public close(){
    this.onClose && this.onClose();
    this.$tab.add(this.$content).removeClass(Css.OPEN);
  }

}
