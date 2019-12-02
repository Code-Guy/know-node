function NodeManager()
{
  this.anchor_node = null;
  this.prev_anchor_node = null;
  this.anchor_linked_nodes = [];
  this.prev_anchor_linked_nodes = [];
  this.links = [];

  this.animator = Animator.get_instance();
  this.anim_time = 0.8;
  this.anchor_node_scale = 1.5;
  this.dist_to_anchor = width * 0.2;

  this.on_pressed_cbs = [];
  this.on_moved_cbs = [];
  this.on_released_cbs = [];
}

NodeManager.get_instance = (function() {
   let instance;
   return function(name) {
       if(instance) return instance;
       return instance = new NodeManager()
   }
})()

NodeManager.prototype.set_root_node = function(root_node)
{
  this.anchor_node = root_node;

  // 设置锚节点的放大动画
  this.animator.register(this.anchor_node.scale_setter,
    1.0, this.anchor_node_scale, this.anim_time);

  this.anchor_linked_nodes = this.anchor_node.get_linked_nodes();
  for (let i = 0; i < this.anchor_linked_nodes.length; i++)
  {
    let node = this.anchor_linked_nodes[i];
    node.set_anchor(this.anchor_node);
    node.set_angle(i * 360.0 / this.anchor_linked_nodes.length - 90);

    // 设置子节点的放大动画
    this.animator.register(node.scale_setter, 0.0, 1.0, this.anim_time);

    // 设置子节点的延伸动画
    this.animator.register(node.radius_setter, 0.0, this.dist_to_anchor, this.anim_time);

    this.links.push(new Link(this.anchor_node, node));
  }
}

NodeManager.prototype.set_anchor_node = function(anchor_node)
{
  if (this.anchor_node == anchor_node)
  {
    return false;
  }

  // 新老锚节点交换锚点关系
  this.prev_anchor_node = this.anchor_node;
  this.anchor_node = anchor_node;
  this.anchor_node.reset_anchor(null);
  this.prev_anchor_node.reset_anchor(this.anchor_node);

  // 删除已经退化（长度为0）的连线
  for (let i = this.links.length - 1; i >= 0; i--)
  {
    if (this.links[i].is_degenerated())
    {
      this.links.splice(i, 1);
    }
  }

  // 设置老锚节点的缩小动画
  this.animator.register(this.prev_anchor_node.scale_setter,
    this.anchor_node_scale, 1.0, this.anim_time);

  // 设置老锚节点的子节点的动画
  this.prev_anchor_linked_nodes = this.prev_anchor_node.get_linked_nodes(this.anchor_node);
  for (let node of this.prev_anchor_linked_nodes)
  {
    // 设置子节点的缩小动画
    this.animator.register(node.scale_setter, 1.0, 0.0, this.anim_time);
    // 设置子节点的延伸动画
    this.animator.register(node.radius_setter, this.dist_to_anchor, 0.0, this.anim_time);
  }

  // 设置锚节点的放大动画
  this.animator.register(this.anchor_node.scale_setter,
    1.0, this.anchor_node_scale, this.anim_time);

  // 设置锚节点的位移动画
  this.animator.register(this.anchor_node.radius_setter,
    this.anchor_node.radius, 0.0, this.anim_time);

  // 设置锚节点的子节点的动画
  this.anchor_linked_nodes = this.anchor_node.get_linked_nodes(this.prev_anchor_node);
  let base_angle = this.prev_anchor_node.angle;

  for (let i = 0; i < this.anchor_linked_nodes.length; i++)
  {
    let node = this.anchor_linked_nodes[i];
    node.set_anchor(this.anchor_node);
    node.set_angle(base_angle + (i + 1) * 360.0 / (this.anchor_linked_nodes.length + 1));

    // 设置子节点的放大动画
    this.animator.register(node.scale_setter, 0.0, 1.0, this.anim_time);
    // 设置子节点的延伸动画
    this.animator.register(node.radius_setter, 0.0, this.dist_to_anchor, this.anim_time);

    this.links.push(new Link(this.anchor_node, node));
  }

  return true;
}

NodeManager.prototype.register_mouse_event = function(node)
{
  this.on_pressed_cbs.push(node.on_pressed.bind(node));
  this.on_moved_cbs.push(node.on_moved.bind(node));
  this.on_released_cbs.push(node.on_released.bind(node));
}

NodeManager.prototype.on_pressed = function(x, y)
{
  for (let on_pressed_cb of this.on_pressed_cbs)
  {
    on_pressed_cb(x, y);
  }
}

NodeManager.prototype.on_moved = function(x, y)
{
  for (let on_moved_cb of this.on_moved_cbs)
  {
    on_moved_cb(x, y);
  }
}

NodeManager.prototype.on_released = function(x, y)
{
  for (let on_released_cb of this.on_released_cbs)
  {
    on_released_cb(x, y);
  }
}

NodeManager.prototype.draw = function()
{
  if (this.anchor_node == null)
  {
    return;
  }

  // 更新动画器逻辑
  this.animator.animate();

  // 绘制连线
  for (let link of this.links)
  {
    link.draw();
  }

  if (this.prev_anchor_node)
  {
    // 绘制锚节点的父节点的连接节点
    for (let node of this.prev_anchor_linked_nodes)
    {
      node.draw();
    }

    // 绘制锚节点的父节点
    this.prev_anchor_node.draw();
  }

  // 绘制锚节点的连接节点
  for (let node of this.anchor_linked_nodes)
  {
    node.draw();
  }

  // 绘制锚节点
  this.anchor_node.draw();
}
