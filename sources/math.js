Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

// 自定义向量类
function Vector(x, y, z)
{
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}

Vector.prototype.add = function(v)
{
  return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
}

Vector.prototype.substract = function(v)
{
  return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
}

Vector.prototype.mult = function(a)
{
  return new Vector(this.x * a, this.y * a, this.z * a);
}

Vector.prototype.divide = function(a)
{
  if (!Math.nearly_equal_zero(a))
  {
    return new Vector(this.x / a, this.y / a, this.z / a);
  }
  return new Vector(this.x, this.y, this.z);
}

Vector.prototype.normalize = function()
{
  let a = sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  if (!Math.nearly_equal_zero(a))
  {
    this.x /= a;
    this.y /= a;
    this.z /= a;
  }
}

Math.nearly_equal = function(a, b, e)
{
  return abs(a - b) < (e || 0.001);
}

Math.nearly_equal_zero = function(a, e)
{
  return Math.nearly_equal(a, 0, e);
}

Math.vadd = function(v1, v2)
{
  return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
}

Math.vsubstract = function(v1, v2)
{
  return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
}

Math.vmult = function(v, a)
{
  return new Vector(v.x * a, v.y * a, v.z * a);
}

Math.vdivide = function(v, a)
{
  if (!Math.nearly_equal_zero(a))
  {
    return new Vector(this.x / a, this.y / a, this.z / a);
  }
  return new Vector(this.x, this.y, this.z);
}

Math.vlerp = function(start, stop, amt) {
  return new Vector(lerp(start.x, stop.x, amt),
    lerp(start.y, stop.y, amt),
    lerp(start.z, stop.z, amt));
};

Math.normalize = function(v)
{
  let a = sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

  if (!Math.nearly_equal_zero(a))
  {
    return new Vector(v.x / a, v.y / a, v.z / a);
  }
  return new Vector(v.x, v.y, v.z);
}

Math.distance = function(v1, v2)
{
  let d = Math.vsubstract(v1, v2);
  return sqrt(d.x * d.x + d.y * d.y + d.z * d.z);
}

Math.angle = function(start_pos, end_pos)
{
  let dir = Math.normalize(Math.vsubstract(end_pos, start_pos));
  return Math.degrees(atan2(dir.y, dir.x));
}

Math.canvas_center_pos = function()
{
  return Math.vmult(new Vector(width, height), 0.5);
}
