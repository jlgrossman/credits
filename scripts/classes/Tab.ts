class Tab {

  private static _$tabs:$;
  private static _$contents:$;
  public static current:Tab;

  private $tab:$; // tab button dom element
  private $content:$; // tab content dom element

  public constructor(public readonly name:string, public readonly action:Function){
    this.$tab = $(`.tab.${name}`).on('click', this.open);
    this.$content = $(`.tab-content.${name}`);
  }

  public static get $tabs():$ { return Tab._$tabs || (Tab._$tabs = $('.tab')); }
  public static get $contents():$ { return Tab._$contents || (Tab._$contents = $('.tab-content')); }

  public open(){
    this.action();
    Tab.$tabs.add(Tab.$contents).removeClass(Css.OPEN);
    this.$tab.add(this.$content).addClass(Css.OPEN);
    Tab.current = this;
    cookie('currentTab', this.name);
  }

}
