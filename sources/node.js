function Node(title)
{
  this.title = title;
  this.bg_color_hue = random(0, 360);
  this.bg_color_saturation = random(30, 70);
  this.bg_color_brightness = random(60, 80);
  this.bg_color = color(this.bg_color_hue,
    this.bg_color_saturation,
    this.bg_color_brightness,
    255);
  this.font_size = 24;
  this.node_size = this.font_size;

  this.angle = 0;
  this.radius = 0;
  this.scale = 1;

  this.parent = null;
  this.anchor = null;
  this.children = []

  this.is_hovered = false;
  this.is_pressed = false;

  this.node_manager = NodeManager.get_instance();
  this.animator = Animator.get_instance();
  this.hovered_anim_time = 2.0;

  let self = this;

  this.set_angle = function(angle)
  {
    this.angle = angle;
  }

  this.set_radius = function(radius)
  {
    this.radius = radius;
  }

  this.set_scale = function(scale)
  {
    this.scale = scale;
  }

  this.set_hue = function(hue)
  {
    this.bg_color = color(hue % 360,
      this.bg_color_saturation,
      this.bg_color_brightness,
      255);
  }

  this.on_pressed = function(x, y)
  {
    if (!this.is_visible())
    {
      return;
    }
  }

  this.on_moved = function(x, y)
  {
    if (!this.is_visible())
    {
      return;
    }

    if (this.contains(x, y))
    {
      if (!this.is_hovered)
      {
        this.is_hovered = true;
        this.animator.register(this.hue_setter,
          this.bg_color_hue, this.bg_color_hue + 360, this.hovered_anim_time, 0.0, true);
      }
    }
    else
    {
      if (this.is_hovered)
      {
        this.is_hovered = false;
        this.animator.unregister(this.hue_setter);
        this.set_hue(this.bg_color_hue);
      }
    }
  }

  this.on_released = function(x, y)
  {
    if (!this.is_visible())
    {
      return;
    }

    if (this.contains(x, y))
    {
      if (this.node_manager.set_anchor_node(this))
      {
        this.animator.unregister(this.hue_setter);
        this.set_hue(this.bg_color_hue);
      }
    }
  }

  // 注册鼠标事件
  this.node_manager.register_mouse_event(this);

  // 初始化动画设置函数
  this.angle_setter = this.set_angle.bind(this);
  this.radius_setter = this.set_radius.bind(this);
  this.scale_setter = this.set_scale.bind(this);
  this.hue_setter = this.set_hue.bind(this);
}

Node.prototype.is_root = function()
{
  return this.parent == null;
}

Node.prototype.add_child = function(child)
{
  child.set_parent(this);
  this.children.push(child);
}

Node.prototype.set_parent = function(parent)
{
  this.parent = parent;
}

Node.prototype.set_anchor = function(anchor)
{
  this.anchor = anchor;
}

Node.prototype.reset_anchor = function(anchor)
{
  cur_pos = this.get_pos();
  anchor_pos = anchor == null ? Math.canvas_center_pos() : anchor.get_pos();
  this.set_radius(Math.distance(anchor_pos, cur_pos));
  this.set_angle(Math.angle(anchor_pos, cur_pos));

  this.anchor = anchor;
}

Node.prototype.is_visible = function()
{
  return !Math.nearly_equal_zero(this.scale);
}

Node.prototype.get_pos = function()
{
  let anchor_pos = Math.canvas_center_pos();
  if (this.anchor != null)
  {
    anchor_pos = this.anchor.get_pos();
  }

  let radian = Math.radians(this.angle);
  let offset = Math.vmult(new Vector(Math.cos(radian), Math.sin(radian)), this.radius);
  return Math.vadd(anchor_pos, offset);
}

Node.prototype.contains = function(x, y)
{
  let pos = this.get_pos();
  scaled_size = Math.vmult(this.node_size, this.scale);
  return x > pos.x - scaled_size.x * 0.5 && x < pos.x + scaled_size.x * 0.5 &&
    y > pos.y - scaled_size.y * 0.5 && y < pos.y + scaled_size.y * 0.5;
}

Node.prototype.get_linked_nodes = function(except_node)
{
  let linked_nodes = [];
  if (this.parent)
  {
    linked_nodes.push(this.parent);
  }
  linked_nodes = linked_nodes.concat(this.children);
  linked_nodes = linked_nodes.filter(linked_node => linked_node != except_node);

  return linked_nodes;
}

Node.prototype.draw = function()
{
  if (!this.is_visible())
  {
    return;
  }

  let pos = this.get_pos();
  translate(pos.x, pos.y);
  scale(this.scale);

  textSize(this.font_size);
  textAlign(CENTER, CENTER);
  let text_width = textWidth(this.title);

  this.node_size = new Vector(text_width + this.font_size * 2, this.font_size * 4);
  this.node_size.y = min(this.node_size.y, this.node_size.x);

  this.shadowEllipse(0, 0, this.node_size.x, this.node_size.y, this.bg_color);

  fill(255);
  text(this.title, 0, -this.font_size * 0.2);

  scale(1.0 / this.scale);
  translate(-pos.x, -pos.y);
}

Node.prototype.shadowEllipse = function(x, y, w, h, content_color, shadow_color, shadow_size)
{
  shadow_color = shadow_color || color(0, 0, 10);
  shadow_size = shadow_size || 3;
  fill(shadow_color);
  ellipse(x + shadow_size, y + shadow_size, w, h);
  fill(content_color);
  ellipse(x, y, w, h);
}
