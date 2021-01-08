const pikachu = document.getElementById('pokemon-pik')
const squirtle = document.getElementById('pokemon-squ')
const bulbasaur = document.getElementById('pokemon-bul')
const charmander = document.getElementById('pokemon-cha')
const btnEmpezar = document.getElementById('btnEmpezar')
const imgBtnEmpezar = document.getElementById('img-btn-iniciar')
const txtNivelActual = document.getElementById('nivelActual')
const txtPuntuacionActual = document.getElementById('puntuacionActual')
const txtPuntuacionMaxima = document.getElementById('puntuacionMaxima')
let mejorPuntuacion = 0


class Juego {
    constructor(nivelPersonalizado) {
        this.nivelPersonalizado = nivelPersonalizado
        this.inicializar = this.inicializar.bind(this)
        this.inicializar()
        this.generarSecuencia()
        setTimeout(this.siguienteNivel, 1000)
     }

    inicializar() {
        this.elegirPokemon = this.elegirPokemon.bind(this)
        this.siguienteNivel = this.siguienteNivel.bind(this)
        this.nivel = 1
        this.puntuacion = 0
        this.multiplicador = 100
        this.pokemonList = {
            pikachu, 
            squirtle, 
            bulbasaur, 
            charmander
        }
        this.toggleBtnEmpezar()
     }

    toggleBtnEmpezar(){

        if (imgBtnEmpezar.classList.contains('grayScale')){
            imgBtnEmpezar.classList.remove('grayScale')
            btnEmpezar.disabled = false

        }else{
            imgBtnEmpezar.classList.add('grayScale')
            btnEmpezar.disabled = true  
        }

        if (!pikachu.classList.contains('grayScale') && 
            !squirtle.classList.contains('grayScale') && 
            !bulbasaur.classList.contains('grayScale') && 
            !charmander.classList.contains('grayScale')){

            pikachu.classList.add('grayScale')
            squirtle.classList.add('grayScale')
            bulbasaur.classList.add('grayScale')
            charmander.classList.add('grayScale')

        }else {
            pikachu.classList.remove('grayScale')
            squirtle.classList.remove('grayScale')
            bulbasaur.classList.remove('grayScale')
            charmander.classList.remove('grayScale')
        }
    

    }

    generarSecuencia(){
        txtNivelActual.innerHTML = this.nivel
        this.secuencia = new Array(this.nivelPersonalizado).fill(0).map(n => Math.floor(Math.random() * 4))
    }

    siguienteNivel(){
        this.subnivel = 0
        this.iluminarSecuencia()
    }

    transformarNumeroAPokemon(numero){
        switch(numero){
            case 0:
                return 'pikachu'
            case 1:
                return 'squirtle'
            case 2:
                return 'bulbasaur'
            case 3:
                return 'charmander'
        }
    }

    transformarPokemonANumero(color){
        switch(color){
            case 'pikachu':
                return 0
            case 'squirtle':
                return 1
            case 'bulbasaur':
                return 2
            case 'charmander':
                return 3
        }
    }

    iluminarSecuencia(){
        for(let i = 0; i < this.nivel; i++){
            const pokemon = this.transformarNumeroAPokemon(this.secuencia[i])
            setTimeout(() => this.iluminarPokemon(pokemon), 1000 * i)
        }
        setTimeout(() => this.agregarEventosClick(), 1000 * this.nivel) //evitar clicks antes de tiempo
    }

    iluminarPokemon(pokemon){
        this.pokemonList[pokemon].classList.remove('grayScale')
        setTimeout(()=> this.apagarPokemon(pokemon), 350)
    }

    apagarPokemon(pokemon){
        this.pokemonList[pokemon].classList.add('grayScale')
    }

    agregarEventosClick(){
        this.pokemonList.pikachu.addEventListener('click', this.elegirPokemon)
        this.pokemonList.squirtle.addEventListener('click', this.elegirPokemon)
        this.pokemonList.bulbasaur.addEventListener('click', this.elegirPokemon)
        this.pokemonList.charmander.addEventListener('click', this.elegirPokemon)
    }

    eliminarEventosClick(){
        this.pokemonList.pikachu.removeEventListener('click', this.elegirPokemon)
        this.pokemonList.squirtle.removeEventListener('click', this.elegirPokemon)
        this.pokemonList.bulbasaur.removeEventListener('click', this.elegirPokemon)
        this.pokemonList.charmander.removeEventListener('click', this.elegirPokemon)
    }

    elegirPokemon(ev){
        const nombrePokemon = ev.target.dataset.pokemon
        const numeroPokemon = this.transformarPokemonANumero(nombrePokemon)
        this.iluminarPokemon(nombrePokemon)

        if (numeroPokemon === this.secuencia[this.subnivel]){

            this.puntuacion += this.multiplicador
            txtPuntuacionActual.innerHTML = this.puntuacion

            this.subnivel++

            if (this.subnivel === this.nivel){
                this.nivel++

                txtNivelActual.innerHTML = this.nivel

                this.eliminarEventosClick()
                if(this.nivel === (this.nivelPersonalizado + 1)){
                    //Gano
                    this.maximaPuntuacion(this.puntuacion)
                    this.ganoElJuego()
                }else{
                    setTimeout(this.siguienteNivel, 2000)
                }
            }
        } else {
            //perdio
            this.maximaPuntuacion(this.puntuacion)
            this.perdioElJuego()
        }
    }

    ganoElJuego(){
        txtNivelActual.innerHTML = ""
        swal('Sim\u00F3n dice', 'Felicitaciones, ganaste el juego', 'success')
        .then(()=>{
            txtNivelActual.innerHTML = ''
            txtPuntuacionActual.innerHTML = ''
            this.inicializar()
        })
    }

    perdioElJuego(){
        
        swal('Sim\u00F3n dice', 'Lo lamentamos, perdiste :(', 'error')
        .then(()=>{
            txtNivelActual.innerHTML = ''
            txtPuntuacionActual.innerHTML = ''
            this.eliminarEventosClick()
            this.inicializar()
        })
    }

    maximaPuntuacion(puntaje){
        if(mejorPuntuacion === 0){
        mejorPuntuacion = puntaje
        }else if(puntaje > mejorPuntuacion){
        mejorPuntuacion = puntaje    
        }
        txtPuntuacionMaxima.innerHTML = mejorPuntuacion
    }

}


function empezarJuego() {
    let nivelPersonalizado = parseInt(document.getElementById('nivel-personalizado').value)
        if(nivelPersonalizado > 0){
            pikachu.focus()
     window.juego = new Juego(nivelPersonalizado)
        }else{
            swal('Sim\u00F3n dice', 'Ingresa un valor mayor a 0', 'error')
        }
       
 }

 