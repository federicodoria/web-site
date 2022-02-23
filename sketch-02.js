const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};

//Definiamo una funzione di conversione da gradi a radiant
//const degToRad = (degrees) => {
//  return degrees / 180 * Math.PI;
//};

//Definiamo una funzione per dare un range alla generazione di numeri casuali

//const randomRange= (min, max) => {
//  return Math.random() * (max - min) + min;
//};

//Nella pratica invece, importeremo le funzioni che ci servono dal pacchetto "gemello"
//di canvas-sketch, canvas-sketch-util

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';

    const cx = width * .5; //Sono le coordinate del centro del cerchio
    const cy = height * .5;
    const w = width * .01;
    const h = height * .1;

    //Siccome la x e la y di ogni singola forma cambierà, essendo attorno ad un cerchio, dichiariamo usando
    //let, visto che le faremo variare nel ciclo

    let x, y;

    //Le trasformazioni cominceranno con un context.save() e finiranno con context.restore()

    //Vogliamo distribuire le forme attorno al cerchio. Definiamo una variabile per il numero di copie.

    const num = 40;

    //Definiamo la variabile radius per distribuire le forme attorno ad un cerchio definendo il raggio di quest'ultimo.

    const radius = width * .9;

    //Creiamo un ciclo all'interno del quale poniamo il codice di disegno

    for (let i = 0; i < num; i++) {

      //Dobbiamo cambiare l'angolo di rotazione a seconda dell'indice del ciclo. La costante slice sarà l'ampiezza del
      //settore circolare.

      const slice = math.degToRad(360/num);

      //Ora definiamo la variabile angle, che traccia l'angolo a cui si posiziona il singolo settore

      const angle = slice * i;

      x = cx + radius * Math.sin(angle); //Se andiamo a scambiare sin e cos, e cambiare con +  o -
      y = cy + radius * Math.cos(angle); //il segno dell'angolo, si ottengono pattern interessanti

      //N.B. Su usa cosa per la y e viceversa per un motivo simile al piano inclinato;
      //ricordiamo che il centro da cui disegniamo l'abbiamo posto al centro dell'immagine

      //Salviamo lo stato del context
      context.save();

      // Trasformiamo il context, il "foglio di disegno"; le trasformazioni sono cumulative
      context.rotate(-angle); //Mettiamo -angle affinché le forme siano girate verso l'interno del cerchio,
                             //si può anche mettere nella formula per x ed y
      context.scale(random.range(.1, 2),random.range(.2, .5));                       

      //Disegniamo forme; qui cominciamo a disegnare con la "penna"
      context.beginPath();
      context.rect(radius, random.range(0, - h * .5), w, h);
      context.fill();

      //Riportiamo il context allo stato salvato, in modo da non dover invertire manualmente le trasformazioni precedenti,
      //visto che vogliamo che il cerchio non venga ruotato o spostato
      context.restore();
      
      //Abbiamo bisogno di un altro set di trasformazioni, quindi di un altro blocco
      //incluso context.save() e context.restore()

      context.save();
      
      //Ci spostiamo all'interno del cerchio.

      context.rotate(-angle);

      //Disegniamo una nuova forma

      context.lineWidth = random.range(5, 20); //Ispessiamo le linee

      context.beginPath();
      context.arc(0, 0, radius * random.range(.7, 1.3), slice * random.range(-8, 1), slice * random.range(1, 5));
      context.stroke();

      context.restore();

      //Abbiamo aggiunto aleatorietà a molte delle variabili in gioco, in particolare a quelle che determinano posizione  e dimensione delle forme.
    };

  };
};

canvasSketch(sketch, settings);
