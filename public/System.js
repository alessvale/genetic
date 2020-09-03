
//System class;

function System(origin, target){
  this.movers = [];
  this.num = 300; //Number of movers;
  this.num_bits = 30; //Number of bits encoding the genome;

  this.origin = origin;
  this.target = target;

  this.init = function(){
    for (let i = 0; i < this.num; i++){
      this.movers.push(new Mover(this.origin, this.target));
      //When first initialized, produce random genomes;
      let genome = this.makeGenome();

      this.movers[i].setAttr(genome);
      this.movers[i].init();
    }
  }

  //Make a new generation from a list of genomes;
  this.newGen = function(genomes){
    for (let i = 0; i < this.num; i++){
      this.movers[i] = new Mover(this.origin, this.target);
      this.movers[i].setAttr(genomes[i]);
      this.movers[i].init();
    }
  }

  //Utility function;
  this.makeGenome = function(){
    let genome = [];
    for (let i = 0; i < this.num_bits; i++){
      if (random(0.0, 1.0) < 0.5){
        genome.push(0);
      }
      else {
        genome.push(1);
      }
    }
    return genome;
  }

  //Update movers;
  this.update = function(obst){
    for (let i = 0; i < this.num; i++){
      let m = this.movers[i];
      if (!m.stuck){
       if (dist(m.pos.x, m.pos.y, obst.pos.x, obst.pos.y) <= (m.r + obst.r) * 0.5){
         m.stuck = true;
         stuck_count += 1;
       }
       }
    }


    for (let i = 0; i < this.num; i++){
      let m = this.movers[i];
      if (! m.stuck){
      m.move();
    }
    }
  }

  //Display movers;
  this.display = function(){
    for (let i = 0; i < this.num; i++){
      let m = this.movers[i];
      m.display();
    }
  }
}
