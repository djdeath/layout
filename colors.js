const Clutter = imports.gi.Clutter;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const Layout = imports.Layout;

/**/

let loadFile = function(path) {
  let file = Gio.File.new_for_path(path);
  let [, source] = file.load_contents(null);
  return '' + source;
};

let translate = function(input) {
  try {
    let structure = Layout.LayoutParser.matchAllStructure(input, 'allocation', undefined);
    //let code = jsEmul.BSJSTranslator.match(structure.value, 'trans', undefined);
    //return code;
    log(JSON.stringify(structure));
  } catch (e) {
    log(e);
  }
};

translate(loadFile('./test.js'));

/**/

const MyLayout = new Lang.Class({
  Name: 'MyLayout',
  Extends: Clutter.LayoutManager,

  _init: function(args) {
    this.parent(args);
  },

  vfunc_allocate: function(container, allocation, flags) {
    let children = container.get_children();
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      child.allocate(allocation, flags);
    }
  },
});

/**/

Clutter.init(null, null);

let stage = new Clutter.Stage({
  width: 800,
  height: 600,
  layout_manager: new MyLayout(),
  user_resizable: true,
  background_color: new Clutter.Color({ alpha: 0xff }),
});
stage.connect('destroy',
              function() { Clutter.main_quit(); }.bind(this));

let nbColors = 100;
let divisions = 4;
for (let i = 0; i < nbColors; i++) {
  let hue = i * (360.0 / divisions / nbColors) + (180.0 * (i % divisions));
  let color = Clutter.Color.from_hls(hue, 100, 100);
  color.alpha = 0xff;
  let actor = new Clutter.Actor({
    width: 100,
    height: 100,
    background_color: color,
  });
  stage.add_child(actor);
}

stage.show();

Clutter.main();
