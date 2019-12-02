let msyhFont;
let node_manager = null;
let fps = 60;
let delate_time = 1 / fps;

function preload()
{
  msyhFont = loadFont('https://github.com/Code-Guy/know-node/blob/master/static/fonts/msyh.otf');
}

function setup()
{
  createCanvas(1920, 1080);
  colorMode(HSB);
  textFont(msyhFont);
  frameRate(fps);

  let root_node = new Node('知识');
  let science_node = new Node('科学');
  let humanity_node = new Node('人文学');
  let society_node = new Node('社会学');

  science_node.add_child(new Node('数学'));
  science_node.add_child(new Node('物理学'));
  science_node.add_child(new Node('化学'));
  science_node.add_child(new Node('天文学'));
  science_node.add_child(new Node('地理学'));
  science_node.add_child(new Node('生物学'));
  science_node.add_child(new Node('医学'));

  humanity_node.add_child(new Node('哲学'));
  humanity_node.add_child(new Node('文学'));
  humanity_node.add_child(new Node('语言学'));
  humanity_node.add_child(new Node('历史学'));
  humanity_node.add_child(new Node('考古学'));
  humanity_node.add_child(new Node('伦理学'));
  humanity_node.add_child(new Node('美学'));
  humanity_node.add_child(new Node('宗教学'));

  society_node.add_child(new Node('政治学'));
  society_node.add_child(new Node('经济学'));
  society_node.add_child(new Node('军事学'));
  society_node.add_child(new Node('法学'));
  society_node.add_child(new Node('教育学'));
  society_node.add_child(new Node('管理学'));

  root_node.add_child(science_node);
  root_node.add_child(humanity_node);
  root_node.add_child(society_node);

  // 设置root_node的位置为画布中心
  node_manager = NodeManager.get_instance();
  node_manager.set_root_node(root_node);
}

function draw()
{
  clear();
  background(color(107, 0, 50));

  node_manager.draw()
}

function mousePressed()
{
  node_manager.on_pressed(mouseX, mouseY);

  // prevent default
  return false;
}

function mouseMoved()
{
  if (node_manager != null)
  {
    node_manager.on_moved(mouseX, mouseY);
  }

  // prevent default
  return false;
}

function mouseReleased()
{
  node_manager.on_released(mouseX, mouseY);

  // prevent default
  return false;
}
