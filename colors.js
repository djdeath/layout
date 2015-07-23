const Clutter = imports.gi.Clutter;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
//const Layout = imports.Layout;

/**/

// let loadFile = function(path) {
//   let file = Gio.File.new_for_path(path);
//   let [, source] = file.load_contents(null);
//   return '' + source;
// };

// let translate = function(input) {
//   try {
//     let structure = Layout.LayoutParser.matchAllStructure(input, 'allocation', undefined);
//     //let code = jsEmul.BSJSTranslator.match(structure.value, 'trans', undefined);
//     //return code;
//     log(JSON.stringify(structure));
//   } catch (e) {
//     log(e);
//   }
// };

// translate(loadFile('./test.js'));

let allocationBoxToString = function(box) {
  return box.x1 + 'x' + box.y1 + ' -> ' + box.x2 + 'x' + box.y2;
};

/**/

const MyLayout = new Lang.Class({
  Name: 'MyLayout',
  Extends: Clutter.LayoutManager,

  _init: function(args) {
    this.parent(args);
  },

  vfunc_allocate: function (container, allocation, flags) {
    let layoutChild = function (result,index,parent,children){
      result.translation_x=function(){if ((((index + (- (1))) >= (0)) && ((index + (- (1))) < children["length"])))return (children[index + (- (1))].translation_x + children[index + (- (1))].width);return (0);}();
      result.translation_y=function(){if ((((index + (- (1))) >= (0)) && ((index + (- (1))) < children["length"])))return (children[index + (- (1))].translation_y + children[index + (- (1))].height);return (0);}();
    };
    let children = container.get_children();
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      let childAllocation = new Clutter.ActorBox({ x1:0, y1:0, x2: child.width, y2: child.height });
      child.allocate(childAllocation, flags);
      layoutChild(child, i, container, children);
      //log(allocationBoxToString(childAllocation));
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
    width: 100 + (i % divisions) * 20,
    height: 100 + (i % divisions) * 20,
    background_color: color,
    opacity: 255,
  });
  stage.add_child(actor);
}

stage.show();

Clutter.main();
