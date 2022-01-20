document.addEventListener('DOMContentLoaded', ()=> {

    startingGrid(20,10)
    miniGrid(16)
    const grid = document.querySelector('.grid-container')
    let squares = Array.from(document.querySelectorAll('.cell'))
    const scoreDisplay = document.querySelector('#score')
    const startButton = document.getElementById('start-game')
    let nextRandom = 0
    let timerId
    let score = 0
    
    //This is dynamic and we will have to run to set the width before creating the tetrominos
    let cols = document.getElementById('row1').childElementCount

    //Drawing the Tetrominos
    const makeBackwardLTetromino = () =>{
        const lTetromino = [
            [1, 2, 1+cols, 1+2*cols],
            [cols, cols+1, cols+2, 2+cols*2],
            [1, 1+cols, 1+2*cols, 2*cols], 
            [0, cols, 1+cols, 2+cols]
        ]
        return lTetromino
    }
    const makeSevenTetromino = () =>{ 
        const sevenTetromino = [
            [0, 1, cols+1, 1+2*cols], 
            [2, cols, cols+1, cols+2], 
            [1, cols+1, 1+cols*2, 2+cols*2], 
            [cols*2, cols, cols+1, cols+2]
        ]
        return sevenTetromino
    }
    const makeSquareTetromino = () =>{
        const squareTetromino = [
            [0, 1, cols, cols+1], 
            [0, 1, cols, cols+1], 
            [0, 1, cols, cols+1], 
            [0, 1, cols, cols+1]
        ]
        return squareTetromino
    }
    
    const makeLineTetromino = () =>{
        const lineTetromino = [
            [1, cols+1, 2*cols+1, 3*cols+1], 
            [cols, cols+1, cols+2, cols+3], 
            [1, cols+1, 2*cols+1, 3*cols+1], 
            [cols, cols+1, cols+2, cols+3]
        ]
        return lineTetromino
    }

    const makeBackwardZeeTetromino = () =>{
        const backwardZTetromino = [
            [cols, cols+1, 1, 2], 
            [0, cols, cols+1, 2*cols+1], 
            [cols, cols+1, 1, 2], 
            [0, cols, cols+1, 2*cols+1]
        ]
        return backwardZTetromino
    }

    const makeZeeTetromino = () =>{
        const backwardZeeTetromino = [
            [0, 1, cols+1, cols+2], 
            [1, cols, cols+1, 2*cols], 
            [0, 1, cols+1, cols+2], 
            [1, cols, cols+1, 2*cols]
        ]
        return backwardZeeTetromino
    }

    const makeTeeTetromino = () =>{
        const teeTetromino = [
            [cols, 1, cols+1, cols+2], 
            [1, cols+1, 2*cols+1, cols+2], 
            [cols, 2*cols+1, cols+1, cols+2], 
            [1, cols+1, 2*cols+1, cols]
        ]
        return teeTetromino
    }

    //create array of all tetrominos
    let allTetriminos = [makeBackwardLTetromino(), makeSevenTetromino(), makeSquareTetromino(), makeLineTetromino(), makeBackwardZeeTetromino(), makeZeeTetromino(), makeTeeTetromino()]

    let currentPosition = 0
    let currentRotation = 0

    //Randomly select a Tetromino in its first rotation
    const randInt = n => Math.floor(Math.random()*n)
    let randomTetromino = randInt(allTetriminos.length)
    let currentTetrommino = allTetriminos[randomTetromino][currentRotation]

    //create draw function for the grid
    function draw(){
        currentTetrommino.forEach(el=> squares[el+currentPosition].classList.add('tetromino'))
    }


    //undraw the tetrimino
    function undrawTetromino(){
        currentTetrommino.forEach(el => {
            squares[currentPosition + el].classList.remove('tetromino')
        })
    }

    //move the tetromino down
    function moveDown() {
        undrawTetromino()
        let cols = document.getElementById('row1').childElementCount
        currentPosition += cols
        squares = Array.from(document.querySelectorAll('.cell'))
        draw()
        freeze()
    }

    //set time interval for tetrominos to move 
    //timerId = setInterval(moveDown, 1000)

    //assign functions to keyCodes
    function control(e) {
        if(e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

    //freeze function
    function freeze(){
        let cols = document.getElementById('row1').childElementCount
        squares = Array.from(document.querySelectorAll('.cell'))
        //console.log(currentPosition)
        //console.log(currentTetrommino)
        if(currentTetrommino.some(el => squares[currentPosition + el + cols].classList.contains('taken'))){
            currentTetrommino.forEach(el => squares[currentPosition + el].classList.add('taken'))
            
            //start a new tetromino falling
            randomTetromino = nextRandom
            nextRandom = randInt(allTetriminos.length)
            currentTetrommino = allTetriminos[randomTetromino][currentRotation]
            currentPosition = Math.floor(cols/2)
            draw()
            addScore()
            displayShape()
            gameOver()
        }
    }
    
    //move left if unless it is at edge
    function moveLeft() {
        undrawTetromino()
        const isAtLeftEdge = currentTetrommino.some(el => (currentPosition + el) % cols === 0)
        if(!isAtLeftEdge) currentPosition -=1
        if(currentTetrommino.some(el => squares[currentPosition + el].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }
    function moveRight() {
        undrawTetromino()
        const isAtRightEdge = currentTetrommino.some(el => (currentPosition + el) % cols === cols-1)
        if(!isAtRightEdge) currentPosition +=1
        if(currentTetrommino.some(el => squares[currentPosition + el].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }
    function rotate() {
        undrawTetromino()
        currentRotation ++ 
        if(currentRotation === currentTetrommino.length) {
            currentRotation = 0
        }
        currentTetrommino = allTetriminos[randomTetromino][currentRotation]
        draw()
    }
    
    //show the next tetromino
    const displaySquares = document.querySelectorAll('.mini-div')
    let displayIndex = 0
    let miniWidth = 4
    const upNextTetrominos = [
        [1, 2, 1+miniWidth, 1+2*miniWidth], 
        [0, 1, miniWidth+1, 1+2*miniWidth],
        [0, 1, miniWidth, miniWidth+1],
        [1, miniWidth+1, 2*miniWidth+1, 3*miniWidth+1],
        [miniWidth, miniWidth+1, 1, 2],
        [0, 1, miniWidth+1, miniWidth+2],
        [miniWidth, 1, miniWidth+1, miniWidth+2]
    ]

    function displayShape() {
        displaySquares.forEach(cell => cell.classList.remove('tetromino'))
        upNextTetrominos[nextRandom].forEach( el => displaySquares[displayIndex + el].classList.add('tetromino'))
    }

    //add start-button functionality 
    startButton.addEventListener('click', ()=> {
        squares = Array.from(document.querySelectorAll('.cell'))
        cols = document.getElementById('row1').childElementCount
        allTetriminos = [makeBackwardLTetromino(), makeSevenTetromino(), makeSquareTetromino(), makeLineTetromino(), makeBackwardZeeTetromino(), makeZeeTetromino(), makeTeeTetromino()]
        randomTetromino = randInt(allTetriminos.length)
        currentTetrommino = allTetriminos[randomTetromino][currentRotation]
        if(timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = randInt(allTetriminos.length)
            displayShape()
        }
    })

    //add the score
    function addScore(){

        let rows = Array.from(document.querySelectorAll('.row')).map(html => Array.from(html.querySelectorAll('.grid-cell')))
        let rowNodeList = Array.from(document.querySelectorAll('.row')).map(html => html.querySelectorAll('.grid-cell'))
        //let rowsNodeList = document.querySelectorAll('.row')
        //Checks all rows to see if all cells have a class list of taken. 
        //let isTaken = rows.map((row, i)=> row.every(cell => cell.classList.contains('taken')))

        rows.forEach((row, i) => {
            if(row.every(cell => cell.classList.contains('taken'))){
                score += cols
                scoreDisplay.innerHTML = score
                row.forEach(cell => {
                    cell.classList.remove('taken') 
                    cell.classList.remove('tetromino')
                })
                
                let removedRow = document.querySelectorAll('.row')[i]
                
                document.querySelectorAll('.row')[i].remove()
                grid.prepend(removedRow)
            }
            
        })
        
    }

    //game over function 
    function gameOver() {
        if(currentTetrommino.some(el => squares[currentPosition + el + cols].classList.contains('taken'))){
            //draw()
            clearInterval(timerId)
            //window.alert(`Game Over... \n Final score: ${score}`)
        }
        
    }
//End of the DOM Content Loaded    
})




// Logic to be used in game
function startingGrid(rows, columns){
    const gridContainer = document.querySelector('.grid-container')
    gridContainer.innerHTML = ''
    
    let rowCount = 0
    while(rowCount < rows){
        let newRow = document.createElement('div')
        newRow.className=`row`
        newRow.id = `row${rowCount+1}`
        
        let colCount = 0
        while (colCount < columns){
            let newCell = document.createElement('div')
            newCell.className = 'cell grid-cell'
            newRow.appendChild(newCell)
            colCount ++
        }
        gridContainer.appendChild(newRow)
        rowCount ++
    }
    let finalRow = document.createElement('div')
    finalRow.className='final-row'
    let finalCol = 0
    while(finalCol < columns){
        let newCell = document.createElement('div')
        newCell.className = 'cell taken'
        finalRow.appendChild(newCell)
        finalCol ++
    }
    gridContainer.appendChild(finalRow)
}

function customGrid(){
    
    let rows = document.getElementById('row-number').value
    let columns = document.getElementById('column-number').value
    if(rows < 10 || rows > 50){
        alert('Error: Please make sure your rows are set between 10 and 50')
    }
    else if (columns < 5 || columns > 50){
        alert('Error: Please make sure your rows are set between 5 and 50')
    }else {
        const gridContainer = document.querySelector('.grid-container')
        gridContainer.innerHTML = ''
        
        let rowCount = 0
        while(rowCount < rows){
            let newRow = document.createElement('div')
            newRow.className=`row`
            newRow.id = `row${rowCount+1}`
            
            let colCount = 0
            while (colCount < columns){
                let newCell = document.createElement('div')
                newCell.className = 'cell grid-cell'
                newRow.appendChild(newCell)
                colCount ++
            }
            gridContainer.appendChild(newRow)
            rowCount ++
        }
        let finalRow = document.createElement('div')
        finalRow.className='final-row'
        let finalCol = 0
        while(finalCol < columns){
            let newCell = document.createElement('div')
            newCell.className = 'cell taken'
            finalRow.appendChild(newCell)
            finalCol ++
        }
        gridContainer.appendChild(finalRow)
        squares = Array.from(document.querySelectorAll('.grid-cell'))
    }
}
const createGridButton = document.getElementById('create-grid')
createGridButton.addEventListener('click', customGrid, false)

// Logic to be used in game
function miniGrid(numberOfDivs){
    const parentDiv = document.querySelector('.grids')
    let miniGridContainer = document.createElement('div')
    miniGridContainer.className = 'mini-grid'

    let divCount = 0
    while(divCount < numberOfDivs){
        let newDiv = document.createElement('div')
        newDiv.className=`mini-div`

        miniGridContainer.appendChild(newDiv)
        divCount ++
    }
    parentDiv.appendChild(miniGridContainer)

}