const startButton = document.getElementById('start-btn') //traemos el botton de empezar a JS
const nextButton = document.getElementById('next-btn') //traemos el boton de siguiente a JS
const questionContainerElement = document.getElementById('question-container') //traemos el div donde se va a mostrar la pregunta y las respuestas
const questionElement = document.getElementById('question') //traemos el div donde se muestra la pregunta
const answerButtonsElement = document.getElementById('answer-buttons') // traemos el div donde se muestran la respuestas
const result = document.getElementById('result')//traemos el div donde se muestra el resultado
const menuBtn = document.getElementById('menu-btn')

let currentQuestionIndex; //declaramos sin valor la variable que nos indicar'a por qu'e pregunta vamos en el quiz

let questions = []; //declaramos la variable question con array vacio que contendrá el objeto de la api

axios
    .get('https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple') //le decimos a axios que nos traiga la información de la api
    .then((res) => { //cuando nos traiga la información ..
        questions = res.data.results; // nos guardará en la variable cuestion el valor de data.results cuyo valor son las questions
    })
    .catch((err) => (console.error(err)));// si no, nos mostrará error




let allAnswers = [] //declaramos una variable allAnswer con un array vacio
let resultado = 0 //declaramos una variable resultado para almacenar los puntos obtenidos por acertar las respuestas
let media = 0
let max = 0

//empieza el juego
function startGame() { //declaramos la funcion de 'comenzar el juego'
    showResult() //llamamos a esta función para mostrar el resultado que vamos obteniendo
    startButton.classList.add('hide') //cuando comience el juego el boton de start se ocultar'a
    menuBtn.classList.add('hide')
    currentQuestionIndex = 0; //se inicializar dicha variable con valor 0
    questionContainerElement.classList.remove('hide') //se mostrar'a el div que contiene la pregunta y las respuestas.
    result.classList.add('hide')
    setNextQuestion() //se llamar'a a la funci'on configurar siguiente pregunta
    
}

function showQuestion(questionObject) { //se crea la funci'on 'mostrar pregunta con un parametro.
    allAnswers =[] //nos vacie el array de respuestas
    let correctAnswer = questionObject.correct_answer //declaramos una variable para darle el valor de la respuesta correcta

        allAnswers.push({text:correctAnswer,correct:true}); // Agrega la cadena en el array de todas las respuestas
        //console.log(questionObject.incorrect_answers);
        questionObject.incorrect_answers.forEach((answer) => { //recorremos con un bucle cada respuesta incorrecta
            allAnswers.push({text:answer,correct:false}) //pusheramos la respuesta a 
        });
        allAnswers.sort(function() { // Ordena los elementos de forma aleatoria
   return Math.random() - 0.5; //Ordena los elementos de forma aleatoria
});

    questionElement.innerHTML = questionObject.question; //al elemento pregunta se le inserta el texto de las preguntas del objeto
    allAnswers.forEach((answer) => { //se hace un bucle para mostrar todas las respuestas
        const button = document.createElement('button') // se crea un boton de respuesta por cada iteracion del blucle 
        button.innerHTML = answer.text; // y se inserta el texto de cada answer del objeto en el boton

        if(answer.correct) { // si la propierda correct de answer es true..
            button.dataset.correct = true; //se crear'a una propiedad al boton que ser'a igual a true
        }
        button.addEventListener('click', ()=>{ //creamos un evento para cuando pulsemos el boton de respuesta se active una funcion que ..
            if (button.dataset.correct) { //si la propiedad del boton es true..
                resultado++ //resultado incremente su valor en uno
                //console.log('resultado',resultado);
                
            }
            selectAnswer() //se llame a la funcion de seleccionar respuesta
        }) //cuando se haga click en el boton de respuesta, se llamar'a a la funcion de seleccionar respuesta
        answerButtonsElement.appendChild(button); // en el div de answer se agregar'an divs hijos por cada boton
    });
}

function setStatusClass(element) { // se declara una funcion con el nombre 'confifurar status de clase' y con un elemento de parametro
    if(element.dataset.correct) { //si la nueva propiedad creada es verdader..
        element.classList.add('correct') //se le apicar'a la clase correct el estilo creado en css para la propiedad 'correct'
       
    } else {
        element.classList.add('wrong') //se le apicar'a la clase wrong // el estilo creado en css para la propiedad 'wrong' 
    }
    showResult() //y llamar a la función mostrar resultado
}

function setNextQuestion() { // funcion para mostrar nueva pregunta
    resetState() // llama a la funcion resetState
    showQuestion(questions[currentQuestionIndex]) //llama a la funcion mostrar la pregunta correspondiente, segun el indice vaya recorriendo el array questions
}

function selectAnswer() { //creamos la funcion seleccionar respuesta, sin parametro
    Array.from(answerButtonsElement.children).forEach((button) => { //recorremos los botones de respuesta 
        setStatusClass(button); //en cada iteracion llamamos a la funcion para darle el status de clase al bot'on, por ello lo usamos como parametro
    });
    if (questions.length > currentQuestionIndex + 1) { //si la pregunta en la que estamos no es la ultima..
        nextButton.classList.remove('hide'); //aparecer'a la siguiente pregunta
    } else {

        startButton.innerText = 'Restart';// o se entender'a que hemos llegado al final por lo que al boton de comenzar le metemos un nuevo texto de Restart
        upLoadToLocal()
        calculateStats()

        resultado = 0

        result.classList.remove('hide')
        startButton.classList.remove('hide');// y dicho boton se mostrar'a
        menuBtn.classList.remove('hide');
        
    }
}

function resetState() { //creamos la funcion resetear el estado en la que ..
    nextButton.classList.add('hide'); //ocultamos el boton de siguiente
    while (answerButtonsElement.firstChild) {// y mientras haya respuestas escritas..
        //console.log('entras',answerButtonsElement.firstChild);
        
        answerButtonsElement.removeChild(answerButtonsElement.firstChild); // se borraran
    }
}


function showResult() { //se crea la función mostrar resultado
    result.innerHTML = `Su puntuacion es ${resultado}<br>Su puntuacion media es ${media}<br>Su puntuacion maxima es ${max}`//en la que se inserta un texto en el div y el resultado obtenido
}

function goHome() {
questionContainerElement.classList.add('hide')
result.classList.add('hide')
menuBtn.classList.add('hide')
startButton.innerHTML = 'Start'
}


function upLoadToLocal() {
    let arrayFromLocal = JSON.parse(localStorage.getItem('resultsHistory')) || []; //accedemos al array guardado en LS, y si no existe nos devuelve uno vacio.    
    arrayFromLocal.push(resultado) //a dicho array le anadimos el valor del ultimo resultado    
    localStorage.setItem('resultsHistory', JSON.stringify(arrayFromLocal))  // volvemos a guardar el array en LS bajo su clave correspondiente ('resultsHistory')
}


function calculateStats() {
    let arrayFromLocal = JSON.parse(localStorage.getItem('resultsHistory')) || []; //accedemos al array guardado en LS, y si no existe nos devuelve uno vacio.
    media = arrayFromLocal.reduce((prev, curr) => prev + curr) / arrayFromLocal.length
    max = Math.max(...arrayFromLocal)
}  



menuBtn.addEventListener('click', goHome)
startButton.addEventListener('click', startGame) //cuando hagamos click en el boton start, llamaremos a la funci'on startGame
nextButton.addEventListener('click', () => { //al clickar el boton de siguiente se crear'a una funci'on 
    currentQuestionIndex++; //en la que el indice que recorre las preguntas sumar'a un valor
    setNextQuestion();//y se llamar'a a la funci'on 'poner en marcha la siguiente pregunta.

});