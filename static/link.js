function Link(start_node, end_node)
{
  this.start_node = start_node;
  this.end_node = end_node;
}

Link.prototype.draw = function()
{
  strokeWeight(2);

  start_node_pos = this.start_node.get_pos();
  end_node_pos = this.end_node.get_pos();
  line(start_node_pos.x, start_node_pos.y, end_node_pos.x, end_node_pos.y);

  strokeWeight(1);
}

Link.prototype.is_degenerated = function()
{
  return !this.start_node.is_visible() || !this.end_node.is_visible();
}
