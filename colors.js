const Gtk = imports.gi.Gtk;
const Clutter = imports.gi.Clutter;
const GtkClutter = imports.gi.GtkClutter;
const GtkSource = imports.gi.GtkSource;
const Gio = imports.gi.Gio;
const Lang = imports.lang;

/**/
let layoutFunc = function() {};
let replaceLayoutFunction = function(text) {
  try {
    layoutFunc = eval('(function() { return ' + text + '; })()');
  } catch (error) {
    log(error);
  }
};

/**/

const MyLayout = new Lang.Class({
  Name: 'MyLayout',
  Extends: Clutter.LayoutManager,

  _init: function(args) {
    this.parent(args);
  },

  vfunc_allocate: function (container, allocation, flags) {
    let children = container.get_children();
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      let childAllocation = new Clutter.ActorBox({ x1:0, y1:0, x2: child.width, y2: child.height });
      child.allocate(childAllocation, flags);
      layoutFunc(child, i, container, children);
    }
  },
});

/**/

GtkClutter.init(null, null);

let win = new Gtk.Window();
win.resize(800, 600);
win.connect('destroy',
            function() { Gtk.main_quit(); }.bind(this));
let paned = Gtk.Paned.new(Gtk.Orientation.VERTICAL);
win.add(paned);

let embed_stage = new GtkClutter.Embed();
embed_stage.set_size_request(800, 600);
paned.add1(embed_stage);

let stage = embed_stage.get_stage();
stage.layout_manager = new MyLayout();
stage.background_color = new Clutter.Color({ alpha: 0xff });

let nbColors = 100;
let divisions = 4;
for (let i = 0; i < nbColors; i++) {
  let hue = i * (360.0 / divisions / nbColors) + (180.0 * (i % divisions));
  let color = Clutter.Color.from_hls(hue, 100, 100);
  color.alpha = 0xff;
  let actor = new Clutter.Actor({
    width: 100 + (i % divisions) * 20,
    height: 100 + (i % divisions) * 20,
    background_color: color,
    opacity: 255,
  });
  stage.add_child(actor);
}

/**/

let createEditor = function() {
  let scrollview = new Gtk.ScrolledWindow();
  paned.add2(scrollview);
  let textview = new GtkSource.View();
  scrollview.add(textview);
  return textview.buffer;
};

let buffer = createEditor();
buffer.connect('changed', function() {
  let text = buffer.get_text(buffer.get_start_iter(),
                             buffer.get_end_iter(),
                             true);
  replaceLayoutFunction(text);
  stage.queue_relayout();
}.bind(this));

/**/
win.show_all();

Gtk.main();
