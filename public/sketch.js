
const NUM_PARENTS = 100;

let system;
let obsts;
let origin;
let target;
let gen_count = 0;
let stuck_count = 0;
let stop_count = 1000;
let count = 0;

function setup(){
  createCanvas(800, 800);
  background(255);

  //Choose origin and target for the movers;

  origin = new p5.Vector(width * 0.5, height * 0.9);
  target = new p5.Vector(width * 0.5, height * 0.1);
  system = new System(origin, target);
  system.init();

  //Initialize the obtacle;
  obsts = [];
  obsts.push(new Mover( new p5.Vector(width * 0.2, height * random(0.3, 0.6)), new p5.Vector(0.0, 0.0)));
  obsts.push(new Mover( new p5.Vector(width * 0.8, height * random(0.3, 0.6)), new p5.Vector(0.0, 0.0)));
  obsts[0].stuck = true;
  obsts[0].r = random(200, 400);
  obsts[1].stuck = true;
  obsts[1].r = random(200, 400);

}

function draw(){

  background(255);

  //Displaying obstacle, target and basic stats;
  let disp1 = "Generation: " + gen_count;
  let disp2 = "Stuck: " + stuck_count + "/" + system.num;
  fill(0);
  textSize(20);
  textFont('Abel');
  text(disp1, 10, 30);
  text(disp2, 10, 60);
  for (let i = 0; i < obsts.length; i++){
    let obst = obsts[i];
  fill(100, 149, 237);
  ellipse(obst.pos.x, obst.pos.y, obst.r, obst.r);
}
  fill(120,100,237);
  ellipse(target.x, target.y, 50, 50);

  //Halt the simulation after stop_count steps;
  if (count < stop_count){
  system.update(obsts);
  count += 1;
}
else {
  //Spawn new generation
  makeNewGen();
}
  system.display();
}

// Make the new generation;

function makeNewGen(){
  //Choose parents;
  let parents = chooseParents();
  //Shuffle array for more statistical randomness;
  shuffle(parents, true);

  let newgen = [];
  let size = system.num;

  for (let i = 0; i < size; i++){
    //Choose parents; We allow self-replication;
    let parent1 = parents[int(random(0, parents.length))];
    let parent2 = parents[int(random(0, parents.length))];
    //Make the genome of the baby;
    let baby_genome = crossover(parent1, parent2);
    //Mutate the genome;
    mutation(baby_genome);
    //Add to the list of the new genomes
    newgen.push(baby_genome);
  }

  system.newGen(newgen);
  count = 0;
  stuck_count = 0;
  gen_count += 1;
}


function crossover(parent1, parent2){
  //Copy genome arrays;
  let g1 = [...parent1.genome];
  let g2 = [...parent2.genome];
  //Choose a cut point;
  let cut = int(random(0, g1.length));
  //New genome array;
  let baby_genome = [];

  for (let i = 0 ; i < g1.length; i++){
    if (i < cut){
      baby_genome.push(g1[i]);
    }
    else{
      baby_genome.push(g2[i])
    }
  }
  return baby_genome;
}

//Mutate the genome;
function mutation(genome){
  for (let i = 0; i < 3; i++){
    let index = int(random(0, genome.length));
    //A single mutation happens with probability 1/10;
    if (random(0, 1) < 0.1){
    genome[index] = int(random(0, 2));
  }
  }
}


//Choose parents according to fitness;
function chooseParents(){
  let total_fitness = 0.0;
  let parents = [];

  //Useful to compute the "normalized fitness";
  for (let i = 0; i < system.movers.length; i++){
    total_fitness += fitness(system.movers[i]);
  }

  let count = 0;

  while (count < NUM_PARENTS){
    let index = int(random(0, system.movers.length));
    let m = system.movers[index];
    //Only consider movers which are alive, i.e. not stuck;
    if ((random(0, 1) < 1.0 - fitness(m)/total_fitness) && !m.stuck){
      parents.push(m);
      count++;
    }
  }
  return parents;
}

//Fitness function;

function fitness(mover){
  return dist(mover.pos.x, mover.pos.y, target.x, target.y);
}
