const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  playbackRate: 'fixed',
  loop: true
};

//Siccome width e height srebbero definite solo dopo il ciclo,
//copiamo ed incolliamo nella funzione sketch, che in canvas-sketch ha anch'ella
//questi parametri

const sketch = ({context, width, height}) => {

  //Creiamo un vettore per contenere gli agent
  const agents = [];

  for (let i = 0; i < 40; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);

    agents.push(new Agent(x, y));
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);

    //Creiamo un oggetto, in questo caso un punto, e disegniamolo

    //const point = {x: 800, y: 400, radius: 10};

    //Usiamo la classe per creare un punto

    //const agentA = new Agent(800, 400);
    //const agentB = new Agent(300, 700);

    //agentA.draw(context);
    //agentB.draw(context);

    //creiamo un nested loop per tracciare linee che uniscano tutti gli agent fra loro

    for (let i = 0; i < agents.length; i++) {

      const agent = agents[i];

      for (let j = i + 1; j < agents.length; j++) { //facendo partire j da i + 1, ottimizziamo la perfomance
                                                    //tagliando controlli inutili ed evitando di
                                                    //disegnare due volte la stessa linea; scendiamo da 1600 a 780

        const other = agents[j];

        //Disegniamo linee solo tra agenti "vicini" tra loro, usando il teorema di Pitagora

        const dist = agent.pos.getDistance(other.pos);

        if (dist > 200) continue; //continue fa passare alla prossima iterazione del loop
                                  //ignorando tutto ciò che viene dopo
        
        context.lineWidth = math.mapRange(dist, 0 , 200, 12, 1); //mappa valori da un intervallo ad un altro

        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y); //Muove il path in posizione senza tracciare una linea
        context.lineTo(other.pos.x, other.pos.y); //Traccia una linea dalla posizione del path al punto indicato come argomento
        context.stroke();
      }
    }

    //Possiamo ciclare gli elementi del vettore usando agents.forEach

    agents.forEach(agent => {
      agent.update();
      agent.draw(context);
      agent.bounce(width, height);
    });

  };
};

canvasSketch(sketch, settings);

//Creiamo una classe per il nostro oggetto. Siccome separiamo il punto
//dalla sua rappresentazione grafica, la classe Point sarà usata
//esclusivamente per i dati posizionali

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(v) {
    //Vogliamo disegniare linee solo tra agenti "vicini" tra loro; usiamo il teorema di Pitagora
    //e lo passiamo come metodo

    const dx = this.x - v.x;
    const dy = this.y - v.y;

    return Math.sqrt(dx * dx + dy * dy);

  }
}

//Voglio separare il punto dal disegno del punto, disegno per il quale creiamo un'altra classe

class Agent {
  constructor(x, y){
    this.pos = new Vector (x, y);
    this.radius = random.range(4, 12);
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1));//Cambiamo nome da Point a Vector, siccome
                                                                    //definire la velocità come un punto non aveva
                                                                    //più senso
  }

  //Creiamo il metodo update per sfruttare la proprietà vel

  //Portiamo il codice per il disegno direttamente nella classe e creiamo un
  //nuovo metodo

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {

    // Invece di disegnare l'arco usando pos.x e pos.y, usiamo quanto imparato prima

    context.save();

    context.translate(this.pos.x, this.pos.y);
    context.lineWidth = 4;

    context.beginPath();
    context.arc(0, 0, this.radius, 0, 2 * Math.PI);

    context.fill(); //Riempie di bianco i nostri agent, così non si vedono le linee
                    //di congiunzione fino al centro del cerchio
    context.stroke(); //Uso stroke invece di fill di modo che sia disegnato
                      //solo il borso

    context.restore();
  }

  //Gli Agent scompaiono fuori dallo schermo dopo un po'. Questo perché
  //non sanno nulla delle dimensioni della canvas. Creiamo un metodo
  //per farli rimbalzare sulle pareti

  bounce(width, height) {
    if (this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1;
    if (this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
  }
}