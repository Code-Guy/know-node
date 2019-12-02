function AnimParam(start_val, target_val, interval_time, delay_time, is_loop)
{
  this.timer = 0;
  this.start_val = start_val;
  this.target_val = target_val;
  this.interval_time = interval_time;
  this.delay_time = delay_time;
  this.is_loop = is_loop;
}

function Animator()
{
  this.anim_map = new Map();
}

Animator.get_instance = (function() {
   let instance;
   return function(name) {
       if(instance) return instance;
       return instance = new Animator()
   }
})()

Animator.prototype.register = function(setter, start_val, target_val,
  interval_time, delay_time, is_loop)
{
  this.unregister(setter);

  setter(start_val);
  this.anim_map.set(setter, new AnimParam(start_val, target_val,
    interval_time, delay_time || 0, is_loop || false));
}

Animator.prototype.unregister = function(setter)
{
  if (this.anim_map.has(setter))
  {
    this.anim_map.delete(setter);
  }
}

Animator.prototype.animate = function()
{
  let removed_setters = []
  for(let [setter, anim_param] of this.anim_map)
  {
    anim_param.timer += delate_time;
    if (anim_param.timer >= anim_param.delay_time)
    {
      t = anim_param.timer - anim_param.delay_time;
      if (t > anim_param.interval_time)
      {
        if (anim_param.is_loop)
        {
          anim_param.timer = 0;
        }
        else
        {
          removed_setters.push(setter);
          setter(anim_param.target_val);
        }
      }
      else
      {
        let lerp_func = lerp;
        if (anim_param.start_val instanceof Vector)
        {
          lerp_func = Math.vlerp;
        }

        cur_val = lerp_func(anim_param.start_val, anim_param.target_val, t / anim_param.interval_time)
        setter(cur_val);
      }
    }
  }

  for (let removed_setter of removed_setters)
  {
    this.anim_map.delete(removed_setter);
  }
}
