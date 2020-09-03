
//Mover class;

function Mover(origin, target){
  this.pos = origin.copy();
  this.target = target.copy();
  this.r = 10; //radius;
  this.stuck = false; //tells if the mover is stuck;
  this.genome;

  this.setAttr = function(genome){
    this.genome = [...genome];

    //Obtain attributes from genome with basic decoding;
    //We divide by the number of attributes, i.e. each bit-word has the same length;
    let l = this.genome.length/3;

    this.theta = 0;
    for( let z = 1; z <= l; z++ ){
      this.theta += this.genome[l - z ] * pow(2, z-1);
    }
    this.theta *= 1.0/(pow(2, l) - 1);

    this.mag = 0;
    for( let z = 1; z <= l; z++ ){
      this.mag += this.genome[2*l - z ] * pow(2, z-1);
    }
    this.mag *= 2.0/(pow(2, l) - 1);
    this.mag += 1.0;

    this.mass = 0 ;
    for( let z = 1; z <= l; z++ ){
      this.mass += this.genome[3*l - z ] * pow(2, z-1);
    }
    this.mass *= 1.0/(pow(2, l) - 1);
    this.mass += 1.0;

    //The radius is affected by the mass;
    this.r += this.mass * 4;

  }

  //Initialize the mover;
  this.init = function(){
    this.vel = new p5.Vector(cos(this.theta * PI), -sin(this.theta * PI));
    this.vel.mult(this.mag);
  }

  this.move = function(){
    if (!this.stuck){
    //Steering towards the target;
    let target_dir = new p5.Vector(this.target.x - this.pos.x, this.target.y - this.pos.y);
    target_dir.normalize();
    let dir = this.vel.copy();
    dir.normalize();
    let steer = new p5.Vector(target_dir.x - dir.x , target_dir.y - dir.y);
    //Steering capacity is affected by the mass;
    steer.mult(0.01/this.mass);

    this.vel.add(steer);
    this.pos.add(this.vel);
  }
  }

 //Display mover;
  this.display = function(){
    noStroke();
    fill(229,158,31, 100);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
  }

}
