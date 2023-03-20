const startButton = document.getElementById('start-btn') //traemos el botton de empezar a JS
// const nextButton = document.getElementById('next-btn') //traemos el boton de siguiente a JS
const questionContainerElement = document.getElementById('question-container') //traemos el div donde se va a mostrar la pregunta y las respuestas
const questionElement = document.getElementById('question') //traemos el div donde se muestra la pregunta
const answerButtonsElement = document.getElementById('answer-buttons') // traemos el div donde se muestran la respuestas
const result = document.getElementById('result')//traemos el div donde se muestra el resultado
const menuBtn = document.getElementById('menu-btn')
const progressBar = document.getElementById('progress-bar')
const canvas = document.getElementById('canvas')

const numberOfQuestions = 5
const API_URL = `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=21&difficulty=easy&type=multiple`

let currentQuestionIndex; //declaramos sin valor la variable que nos indicar'a por qu'e pregunta vamos en el quiz
let questions = []; //declaramos la variable question con array vacio que contendrá el objeto de la api
let allAnswers = [] //declaramos una variable allAnswer con un array vacio
let resultado = 0 //declaramos una variable resultado para almacenar los puntos obtenidos por acertar las respuestas
let media = 0
let max = 0
let x = []
let y = []

async function retrieveDataFromAPI() {
    await axios.get(API_URL).then(res => questions = res.data.results).catch(err => console.error(err))
}

function startGame() { //declaramos la funcion de 'comenzar el juego'
    retrieveDataFromAPI()
 
    plotGraph(x, y)
    canvas.classList.add('hide')
    showResult() //llamamos a esta función para mostrar el resultado que vamos obteniendo
    startButton.classList.add('hide') //cuando comience el juego el boton de start se ocultar'a
    menuBtn.classList.add('hide')
    currentQuestionIndex = 0; //se inicializar dicha variable con valor 0
    progressBar.style.width = `${(currentQuestionIndex / numberOfQuestions) * 100}%`
    questionContainerElement.classList.remove('hide') //se mostrar'a el div que contiene la pregunta y las respuestas.
    result.classList.add('hide')
    setNextQuestion() //se llamar'a a la funci'on configurar siguiente pregunta
    
}

function showQuestion(questionObject) { //se crea la funci'on 'mostrar pregunta con un parametro.

    timer()  

    allAnswers =[] //nos vacie el array de respuestas
    let correctAnswer = questionObject.correct_answer //declaramos una variable para darle el valor de la respuesta correcta

    allAnswers.push({text:correctAnswer,correct:true}); // Agrega la cadena en el array de todas las respuestas
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
        // nextButton.classList.remove('hide'); //aparecer'a la siguiente pregunta
        
        currentQuestionIndex++; //en la que el indice que recorre las preguntas sumar'a un valor
        progressBar.style.width = `${(currentQuestionIndex / numberOfQuestions) * 100}%`
        setTimeout(setNextQuestion, 1000)
    } else {
        startButton.innerText = 'Restart';// o se entender'a que hemos llegado al final por lo que al boton de comenzar le metemos un nuevo texto de Restart
        startButton.classList.remove('hide');// y dicho boton se mostrar'a
        currentQuestionIndex++;
        progressBar.style.width = `${(currentQuestionIndex / numberOfQuestions) * 100}%`
        
        upLoadToLocal()
        calculateStats()

        resultado = 0

        result.classList.remove('hide')
        menuBtn.classList.remove('hide');
        
    }
}

function resetState() { //creamos la funcion resetear el estado en la que ..
    // nextButton.classList.add('hide'); //ocultamos el boton de siguiente
    while (answerButtonsElement.firstChild) {// y mientras haya respuestas escritas..
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
    canvas.classList.remove('hide')
    startButton.innerHTML = 'Start'
    plotGraph(x, y)
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
    // Create x-axis indices, remember to re-initialize array
    x = []
    for (let i = 0; i < arrayFromLocal.length; i++) {
        x.push(i + 1)
    }
    // Create y-values
    y = arrayFromLocal
}

function plotGraph(xValues, yValues) {
    // var xValues = [50,60,70,80,90,100,110,120,130,140,150];
    // var yValues = [7,8,8,9,9,9,10,11,14,14,15];

    new Chart("myChart", {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
            fill: false,
            lineTension: 0,
            //backgroundColor: "rgba(20,150,255,1.0)",
            borderColor: "rgba(0,0,255,1.0)",
            data: yValues,
            fill: true
            }]
        },
        options: {
            legend: {display: false},
            title: {
                display: true,
                text: "Evolución de tu media de aciertos"
            },
            // scales: {
            // yAxes: [{ticks: {min: 6, max:16}}],
            // }
        }
    });
}

function timer() {
    let countDownDate = new Date("Jan 5, 2024 15:37:25").getTime();
    let x = setInterval(function() {
    let now = new Date().getTime();
    let distance = countDownDate - now;
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("demo").innerHTML = days + "d " + hours + "h "
    + minutes + "m " + seconds + "s ";
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("demo").innerHTML = "EXPIRED";
    }
    }, 1000);
}

menuBtn.addEventListener('click', goHome)
startButton.addEventListener('click', startGame) //cuando hagamos click en el boton start, llamaremos a la funci'on startGame
// nextButton.addEventListener('click', () => { //al clickar el boton de siguiente se crear'a una funci'on 
//     currentQuestionIndex++; //en la que el indice que recorre las preguntas sumar'a un valor
//     setNextQuestion();//y se llamar'a a la funci'on 'poner en marcha la siguiente pregunta.

// });


// plotGraph(x, y)
retrieveDataFromAPI()