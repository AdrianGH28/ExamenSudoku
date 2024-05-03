
document.addEventListener("DOMContentLoaded", function () {

    const btnResolver = document.getElementById("btn-Resolver");
    btnResolver.addEventListener('click', resolverSudoku );
    const btnReiniciar = document.getElementById("btn-Reiniciar");
    btnReiniciar.addEventListener('click', reiniciarSudoku);


    const tablaSudoku = document.getElementById("tabla-Sudoku");
    mCuadricula = 9;
    
    for (let fila = 0; fila < mCuadricula; fila++) {
        const nuevafila = document.createElement("tr");
    
        for (let col = 0; col < mCuadricula; col++) {
            const celda = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.className = "celda";
            input.id = `celda-${fila}-${col}`;


            input.addEventListener('input', function(event){
                Entrada(event , fila, col);
            });

            celda.appendChild(input);
            nuevafila.appendChild(celda);
        }
        tablaSudoku.append(nuevafila);
    }
});


function verConflicto(tablero, fila, col, num) {
    const mCuadricula = 9
    //verificamos la fila y la columna 
    for(let i = 0; i < mCuadricula; i++){
        if(tablero[fila][i] === num || tablero [i] [col] === num){
            return false;
        }
    }
 
    const filaInicio =Math.floor(fila / 3 )* 3;
    const colInicio = Math.floor(col / 3)*3;

    for(let i = filaInicio; i< filaInicio + 3 ; i++){

        for(let j = colInicio; j < colInicio + 3 ; j++){
            if(tablero [i][j] === num){
                return false;
            }
        }
    }
    return true;
}

async function resolverSudoku() {
    const mCuadricula = 9;
    const lSudoku = [];

    for (let fila = 0; fila < mCuadricula; fila++) {
        lSudoku[fila] = [];

        for (let col = 0; col < mCuadricula; col++) {
            const celdaid = `celda-${fila}-${col}`;
            const cValor = document.getElementById(celdaid).value;
            lSudoku[fila][col] = cValor !== "" ? parseInt(cValor) : 0
        }
    }


    for (let fila = 0; fila < mCuadricula; fila++) {

        for (let col = 0; col < mCuadricula; col++) {
            const celdaid = `celda-${fila}-${col}`;
            const celda = document.getElementById(celdaid);

            if (lSudoku[fila][col] !== 0) {
                celda.classList.add("entradaUsuario");
            }
        }
    }

    if(Sudoku(lSudoku)){
        for(let fila = 0; fila < mCuadricula; fila ++){
            for(let col = 0 ; col < mCuadricula; col++){
                const celdaid = `celda-${fila}-${col}`;
                const celda = document.getElementById(celdaid);

                if(!celda.classList.contains("entradaUsuario")){
                    celda.value = lSudoku[fila][col];
                    celda.classList.add("resolverEfecto");
                    await efectoretraso(20);
                }
            }
        }
    } else{
        Swal.fire({
            icon: "warning",
            title: "Este juego no tiene solución",
            showConfirmButton: false,
            timer : 2500
          })
        celda.value = "";
        return;
    }
}

function reiniciarSudoku(){
    for(let fila = 0; fila < mCuadricula ; fila++){
        for(let col = 0; col < mCuadricula; col++){
            const celdaid = `celda-${fila}-${col}`;
            const celda = document.getElementById(celdaid);
            celda.value="";
            celda.classList.remove("Resolver", "efecto", "entradaUsuario");
        }
    }
}

function Sudoku(tablero){
    const mCuadricula = 9

    for(let fila = 0; fila < mCuadricula ; fila++){
        for(let col = 0 ; col < mCuadricula ; col++){
            if(tablero[fila][col] ===0){
                for(let num = 1; num <= 9 ; num ++){
                    if(verConflicto(tablero,fila,col,num)){
                        tablero[fila][col] = num;

 
                        if(Sudoku (tablero)){
                            return true;
                        }

                        tablero[fila][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true
}


function efectoretraso(ms){
    return new Promise(Sudoku => setTimeout(Sudoku , ms))
}


function Entrada(event, fila, col){
    const celdaid = `celda-${fila}-${col}`;
    const celda = document.getElementById(celdaid);
    const valor = celda.value;

    if(!/^[1-9]$/.test(valor)){

        Swal.fire({
            icon: "warning",
            title: "El numero ["+ valor +"] no es valido, ingresa un valor del 1-9",
            showConfirmButton: false,
            timer : 2500
          })
        celda.value = "";
        return;
    }

    const numIngresado = parseInt(valor);

    for(let i = 0; i < 9 ; i++){
        if(i !== col && document.getElementById(`celda-${fila}-${i}`).value == numIngresado){
            Swal.fire({
                icon: "warning",
                title: "El numero ["+ numIngresado +"], ya existe en la fila.",
                showConfirmButton: false,
                timer : 2500
              })
            celda.value = "";
            return;
        }
        
        if(i !== fila && document.getElementById(`celda-${i}-${col}`).value == numIngresado){
            Swal.fire({
                icon: "warning",
                title: "El numero ["+ numIngresado +"], ya existe en la columna.",
                showConfirmButton: false,
                timer : 2500
              })
            celda.value = "";
            return;
        }
    }
    const subFilaInicio = Math.floor(fila / 3) * 3;
    const subColInicio = Math.floor(col / 3) * 3;

    for(let i = subFilaInicio; i < subFilaInicio + 3; i++){
        for(let j = subColInicio; j < subColInicio +3; j++){ 
            if(i !== fila && j !== col && document.getElementById(`celda-${i}-${j}`).value == numIngresado){ 
    
                Swal.fire({
                    icon: "warning",
                    title: "El numero ["+ numIngresado +"], ya existe en la misma subcuadricula 3x3.",
                    showConfirmButton: false,
                    timer : 2500
                  })
                celda.value = "";
                return;
    
            }
        }
    }
    
}

