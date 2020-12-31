let posiciones = [];
let puedeComenzarJuego = false;

let cajasConBarcos = 0

let componenteTablero = Vue.component("tablero", {
    template: `
        <div>
            <div id="second"></div>
            <p>Rellena los datos para comenzar a jugar</p> 
                    
            <div id="first">
                <p>Eje Y</p>
                
                <div class="row">
                    <div class="col-md-2" id="indices">
                    </div>
                
                    <div class="col-md-10" id="content">
                
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-2"></div>
                    
                    <div class="col-md-10">
                        <div id="under"></div>
                        <p>Eje X</p>
                    </div>
                </div>       
            </div>
        </div>
    `,
    data(){
        return{
        }
    },
    methods: {
        appendBtns(buttons){
            let index = buttons.length - 1;
            let indexForward = 0;

            buttons.map(div => {

                document.getElementById("indices").innerHTML += `
                    <div style="height: 26px; width: 30px;" class="mb-1">
                        ${index--}
                    </div>
                `;

                div.map(d => {
                    document.getElementById("content").appendChild(d);
                });

                document.getElementById("content").innerHTML += "<br>";


                document.getElementById("under").innerHTML += `
                    <p style="display: inline-block; width: 21px">${indexForward++}</p>
                `;
            });
        },
        createBtns(){
            let array = 11;
            let index = 0;
            let buttons = [];

            let data = [];

            for (let i = 0; i < 12; i++){
                data = [];

                posiciones.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

                for (let k = 0; k < 12; k++){

                    let btn = document.createElement("div");

                    btn.style.width = "25px";
                    btn.style.height = "25px";
                    btn.style.border = "1px solid black";
                    btn.style.display = "inline-block";

                    let txt = document.createTextNode("");

                    btn.appendChild(txt);

                    btn.setAttribute("class", "caja");
                    btn.setAttribute("id", "c" + index++ + "-" + array );

                    data.push(btn);
                }

                buttons.push(data);
                array--;
                index = 0;
            }

            return buttons;
        }
    },
    mounted(){
        let buttons = this.createBtns();
        this.appendBtns(buttons);
    }
});


let pintarTablero = Vue.component("pintar-tablero", {
   template: `
        <div id="opcionesTablero">
            <form action="#" @submit.prevent="pintarBarco">
                <h3>Tipo de barco </h3>
    
                <select class="mb-3" name="shipType" required @change="tipoBarco($event)">
                    <option id="defaultTipoBarco" selected disabled>Tipo Barco</option>
                    <option id="opt8" value="8">8</option>
                    <option id="opt6" value="6">6 (2)</option>
                    <option id="opt4" value="4">4</option>
                    <option id="opt2" value="2">2 (2)</option>
                </select>
    
                <h3>Orientacion</h3>
    
                <select name="orientation" @change="orientacion($event)" required class="mb-3">
                    <option disabled selected>Orientacion</option>
                    <option value="vertical">Vertical</option>
                    <option value="horizontal">Horizontal</option>
                </select>
    
                <h3>Posición barco</h3>
                <p style="display: inline-block">X:</p>
    
                <select class="mr-2" @change="posX($event)" required name="positionX">
                    <option selected disabled>Eje X</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                </select>
    
                <p style="display: inline-block">Y:</p>
    
                <select name="positionY" required @change="posY($event)">
                    <option disabled selected>Eje Y</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                </select>
    
                <br>
    
                <input type="submit" value="Pintar Barco">
            </form>
        </div>
   `,
   data(){
       return {
           axisX: 0,
           axisY: 0,
           canDraw: false,
           oldAxisY: 0,
           oldAxisX: 0,
           orientation: "",
           shipType: 0,
           shipTypes: [[8, 1], [6, 2], [4, 1], [2, 2]],
           leftShips: 4
       }
   },
   computed: {
    position(){
        return "c" + this.axisX + "-" + this.axisY;
    }
   },
   methods: {
        posX(el){
            this.axisX = el.target.value;
        },
        posY(el){
            this.axisY = el.target.value;
        },
        orientacion(el){
            this.orientation = el.target.value;
        },
        tipoBarco(el){
            this.shipType = parseInt(el.target.value);
        },
        barcosSuficientes(){
           let resultados = null;

           this.shipTypes.map((ship, index) => {

               if (ship[0] === this.shipType){
                   cajasConBarcos+=this.shipType;

                   if (ship[1] > 0){
                       resultados = index;
                   }
               }
           });

           return resultados;
       },
        reducirBarcos(indice){
            this.shipTypes[indice][1]-=1;

            this.shipTypes.map((ship, index) => {
                if (ship[0] === this.shipType && ship[1] === 0) {
                    this.leftShips--;

                    document.getElementById(`opt${this.shipType}`).disabled = true;
                    document.getElementById("defaultTipoBarco").selected = true;
                    return;
                }
            });
        },
        puedePintar(direccion){
           let barcosSuficientes = this.barcosSuficientes();

           if (direccion === "arriba"){
               let resultado = true;

               for(let i = 0; i < this.shipType; i++){
                   if (document.querySelector(`#${this.position}`).style.backgroundColor.toString().startsWith("rgb")){
                       resultado = false;
                       break;
                   }

                   this.axisY++;
               }

               if (barcosSuficientes !== null && resultado) this.reducirBarcos(barcosSuficientes);
               return resultado;
           }

           if (direccion === "abajo"){
               let resultado = true;

               for(let i = this.shipType; i > 0; i--){
                   if (document.querySelector(`#${this.position}`).style.backgroundColor.toString().startsWith("rgb")){
                       resultado = false;
                       return resultado;
                   }

                   this.axisY--;
               }

               if (barcosSuficientes !== null && resultado) this.reducirBarcos(barcosSuficientes);
               return resultado;
           }

           if (direccion === "horizontalDerecha"){
            let resultado = true;

            for(let i = 0; i < this.shipType; i++){
                if (document.querySelector(`#${this.position}`).style.backgroundColor.toString().startsWith("rgb")){
                    resultado = false;
                    return resultado;
                }

                this.axisX++;
            }

               if (barcosSuficientes !== null && resultado) this.reducirBarcos(barcosSuficientes);
               return resultado;
           }

            if (direccion === "horizontalIzquierda"){
                let resultado = true;

                for(let i = this.shipType; i > 0; i--){
                    if (document.querySelector(`#${this.position}`).style.backgroundColor.toString().startsWith("rgb")){
                        resultado = false;
                        return resultado;
                    }

                    this.axisX--;
                }

                if (barcosSuficientes !== null && resultado) this.reducirBarcos(barcosSuficientes);
                return resultado;
            }


       },
       pintarBarco(){

           if (this.orientation === "vertical"){
               this.pintarVertical();
           }

           if (this.orientation === "horizontal"){
               this.pintarHorizontal();
           }


           if (this.leftShips === 0){
               puedeComenzarJuego = true;
               document.getElementById("opcionesTablero").style.visibility = "hidden";

               document.getElementById("hundir-flota").style.visibility = "visible";

           }
       },
       pintarVertical(){
           let pintarHaciaArriba = 12 - this.axisY;
           let pintarHaciaAbajo = 12 - pintarHaciaArriba;

           if (pintarHaciaArriba >= this.shipType){
               this.oldAxisY = this.axisY;

               let pintar = this.puedePintar("arriba");

               if (pintar){
                   // Pinta hacia arriba ya que no hay nada pintado en posteriores casillas
                   this.axisY = this.oldAxisY;

                   let colorRandom = `rgb(${[1,2,3].map(x=>Math.random()*256|0)})`;

                   for(let i = 0; i < this.shipType; i++){
                       document.querySelector(`#${this.position}`).style.background = colorRandom;
                       posiciones[this.axisY][this.axisX] = 1;
                       this.axisY++;
                   }
               }else{
                   this.axisY = this.oldAxisY;

                   alert("No puedes pintar en > X: " + this.axisX + ", Y: " + this.axisY + " debido a que hay posiciones ya pintadas en este rango");
               }

               this.axisY = this.oldAxisY;
               return;
           }

           if (pintarHaciaAbajo >= this.shipType){
               this.oldAxisY = this.axisY;

               let pintar = this.puedePintar("abajo");

               if (pintar){
                   this.axisY = this.oldAxisY;

                   let colorRandom = `rgb(${[1,2,3].map(x=>Math.random()*256|0)})`;

                   for(let i = this.shipType; i > 0; i--){
                       document.querySelector(`#${this.position}`).style.background = colorRandom;
                       posiciones[this.axisY][this.axisX] = 1;
                       this.axisY--;
                   }
               }else{
                   this.axisY = this.oldAxisY;

                   alert("No puedes pintar en > X: " + this.axisX + ", Y: " + this.axisY + " debido a que hay posiciones ya pintadas en este rango");
               }

               this.axisY = this.oldAxisY;
               return;
           }

           alert("No puedes pintar un barco de " + this.shipType + " porque no dispones de suficiente tamaño empezando en " +
               " los ejes X: " + this.axisX + ", Y: " + this.axisY);
       },
       pintarHorizontal(){
            let pintarDerecha = 12 - this.axisX;
            let pintarIzquierda = 12 - pintarDerecha;

            this.oldAxisX = this.axisX;

            if (pintarDerecha >= this.shipType){

                let pintar = this.puedePintar("horizontalDerecha");

                if (pintar){
                    this.axisX = this.oldAxisX;

                    let colorRandom = `rgb(${[1,2,3].map(x=>Math.random()*256|0)})`;

                    for(let i = 0; i < this.shipType; i++){
                        document.querySelector(`#${this.position}`).style.background = colorRandom;
                        posiciones[this.axisY][this.axisX] = 1;
                        this.axisX++;
                    }
                }else{
                    this.axisX = this.oldAxisX;
 
                    alert("No puedes pintar en > X: " + this.axisX + ", Y: " + this.axisY + " debido a que hay posiciones ya pintadas en este rango");
                }
 
                this.axisX = this.oldAxisX;
                return;
            }

            if (pintarIzquierda >= this.shipType){
                this.oldAxisX = this.axisX;

                let pintar = this.puedePintar("horizontalIzquierda");

                if (pintar){
                    this.axisX = this.oldAxisX;

                    let colorRandom = `rgb(${[1,2,3].map(x=>Math.random()*256|0)})`;

                    for(let i = this.shipType; i > 0; i--){
                        document.querySelector(`#${this.position}`).style.background = colorRandom;
                        posiciones[this.axisY][this.axisX] = 1;
                        this.axisX--;
                    }
                }else{
                    this.axisX = this.oldAxisX;

                    alert("No puedes pintar en > X: " + this.axisX + ", Y: " + this.axisY + " debido a que hay posiciones ya pintadas en este rango");
                }

                this.axisX = this.oldAxisX;
                return;
            }

           alert("No puedes pintar un barco de " + this.shipType + " porque no dispones de suficiente tamaño empezando en " +
               " los ejes X: " + this.axisX + ", Y: " + this.axisY);
            
       }
    }
});

let hundirFlota = Vue.component("hundir-flota", {
    template: `
        <div>
            <p>Posibilidades de dar agua > <strong style="color: blue">{{darAgua}}</strong></p>
            <br>
            
            <button id="btnComenzar" @click="jugar">Comenzar el juego</button> <br>
            
            <button id="mostrarTodos" v-if="darAgua === 0" @click="mostrarPosiciones">Mostrar Posiciones</button>
            
            <h1 id="mensajeGanador" style="color: blue; visibility: hidden;">Has ganado!</h1>
        </div>
    `,
    data(){
        return {
            botonComenzar: false,
            darAgua: 10,
            correctas: 0,
            haPerdido: false
        }
    },
    mounted(){
        document.querySelectorAll(".caja").forEach(el => {
            el.addEventListener("click",e => {

               if (!puedeComenzarJuego || !this.botonComenzar) {
                    alert("1.- Debes utilizar todos los barcos. 2.- Debes pulsar comenzar el juego, " +
                        "que aparecerá cuando utilices todos los barcos");

                    return;
                }

               this.comprobarPosicion(e.target.id);
            });
        });
    },
    methods: {
        jugar(){
          this.botonComenzar = true;

            document.querySelectorAll(".caja").forEach(el => {
                el.style.background = "";
            });

            document.getElementById("btnComenzar").disabled = true;
        },
        comprobarPosicion(index){
            let splittedIndex = index.split(new RegExp("[c-]"));

            if (document.querySelector(`#${index}`).style.backgroundColor === "red"
                || document.querySelector(`#${index}`).style.backgroundColor === "blue"){
                return;
            }

            if (posiciones[splittedIndex[2]][splittedIndex[1]] !== 1 && !(this.correctas === cajasConBarcos) && this.darAgua > 0){
                document.querySelector(`#${index}`).style.background = "blue";
                this.darAgua-=1;
            }

            if (this.darAgua === 0) {
                this.haPerdido = true;
                alert("Has perdido, ya no te quedan más oportunidades");
                return;
            }

            if (posiciones[splittedIndex[2]][splittedIndex[1]] === 1 && !this.haPerdido){
                document.querySelector(`#${index}`).style.background = "red";
                this.correctas++;
            }

            if (this.darAgua > 0 && this.correctas === cajasConBarcos){
                document.getElementById("mensajeGanador").style.visibility = "visible";
                alert("Has ganado!");
                return;
            }
        },
        mostrarPosiciones(){
            posiciones.map((arr, index) => {

                arr.map((el, elIndex) => {
                   if (el === 1 && document.getElementById(`c${elIndex}-${index}`).style.backgroundColor === ""){
                       document.getElementById(`c${elIndex}-${index}`).style.backgroundColor = "yellow";
                   }
                });
            });
        }
    }
});

new Vue({
    el: "#app",
    components: {
        "tablero": componenteTablero,
        "pintar-tablero": pintarTablero,
        "hundir-flota": hundirFlota
    }
});
