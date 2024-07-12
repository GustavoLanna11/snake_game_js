//Declarando a variável
const canvas = document.querySelector("canvas")
//Declarando contexto (2d) para o canvas
const ctx = canvas.getContext("2d")

//puxando menu e score
const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const menuWin = document.querySelector(".menu-screen2")
const buttonPlay = document.querySelector(".btn-play")
const buttonPlay2 = document.querySelector(".btn-play2")
//declaração do audio
const audio = new Audio("assets/audio.mp3")

//tamanho dos elementos (comida e cobra)
const size = 30

//a cobra será um array com coordenadas de cada parte da cobra
const initialPosition = { x: 270, y: 240}
let snake = [initialPosition]

//contabilizando pontos
const incrementScore = () => {
    score.innerText = +score.innerText + 10
}

//função para randomizar o surgimento de comidas (multiplo de 30)
function randomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
    const number = randomNumber (0, canvas.width - size)
    return Math.round(number / 30) * 30
}

//cor aleatória para a comdida
const randomColor = () => {
    const red = randomNumber (0, 255)
    const green = randomNumber (0, 255)
    const blue = randomNumber (0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

 
//comidinhas
const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

//armazena a direção de movimento da cobra
let direction, loopId

//função que pega os valores do array e mostra na tela
const drawSnake = () => {
    ctx.fillStyle = "#ddd"

    snake.forEach((position, index) => 
    {
        //se chegou no último elemento, pintaremos o retângulo, if para verificar isso
        if(index == snake.length - 1){
            ctx.fillStyle = "red"
        }
        ctx.fillRect(position.x, position.y, size, size)
    })
}

//função para mover a cobrinha (sempre a partir da cabeça da cobra)
const moveSnake = () => {
    if(!direction) return

    //puxando o valor do retângulo colorido
    const head = snake[snake.length - 1]

    if(direction == "right"){
        snake.push({ x: head.x + size, y: head.y })
    }

    if(direction == "left"){
        snake.push({ x: head.x - size, y: head.y })
    }

    if(direction == "down"){
        snake.push({ x: head.x, y: head.y + size})
    }

    if(direction == "up"){
        snake.push({ x: head.x, y: head.y - size})
    }


    //remove o primeiro elemento do array
    snake.shift()
}

//função para desenhar a comida
const drawFood = () => {

    const { x, y, color} = food
    ctx.shadowColor = color
    ctx.shadowBlur = 14
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

//grid para visual do campo
const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    //criação das linhas
    for(let i = 30; i < canvas.width; i += 30){
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

//função para ver se a cobrinha comeu a comida
const checkEat = () => {
    //se a posição da head for igual a da comida, a cobrinha comeu
    const head = snake[snake.length - 1]

    if(head.x == food.x && head.y == food.y){
        incrementScore()
        snake.push(head)
        audio.play()

        let x = randomPosition()
        let y = randomPosition()

        while (snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

const checkWin = () => {
    if(score.innerText > 200){
        win()
    }
}

const win = () =>{
    direction = undefined
    menuWin.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(2px)"
}


//verificar colisões e gameover
const checkCollision = () => {
    const head =  snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    //pega o valor depois da cabeça
    const neckIndex = snake.length - 2
    //colisão com parede
    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    //colisão com corpo
    const selfCollision = snake.find((position, index)=>{
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if(wallCollision || selfCollision) {
        gameOver()
    }
}

//função gameOver
const gameOver = () =>{
    direction = undefined
    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(2px)"
}

//loop para mover a cobrinha
const gameLoop = () => {
    //Limpa o loop antes de executar novamente, previnindo 2 loops ao mesmo tempo
    clearInterval(loopId)

    //limpa a tela
    ctx.clearRect(0, 0, 600, 600)
    //cria as linhas
    drawGrid()
    //desenhando a comida
    drawFood()
    //puxa a movimentação
    moveSnake()
    //executa
    drawSnake()
    //checa se comeu
    checkEat()
    //checa a vitória
    checkWin()
    //checa colisão
    checkCollision()
    
   

    loopId = setTimeout(() => {
        gameLoop()
    }, 110)
}

//executa o loop
gameLoop()

//evento de teclado para identificar a ativação das teclas de movimento
document.addEventListener("keydown", ({key}) => {
    //verifica a direção para evitar a cobrinha de andar por cima de si mesma
    if (key == "ArrowRight" && direction != "left"){
        direction = "right"
    }

    if (key == "ArrowLeft" && direction != "right"){
        direction = "left"
    }

    if (key == "ArrowDown" && direction != "up"){
        direction = "down"
    }

    if (key == "ArrowUp" && direction != "down"){
        direction = "up"
    }
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [{ x: 270, y: 240}]
})

buttonPlay2.addEventListener("click", () => {
    score.innerText = "00"
    menuWin.style.display = "none"
    canvas.style.filter = "none"

    snake = [{ x: 270, y: 240}]
})