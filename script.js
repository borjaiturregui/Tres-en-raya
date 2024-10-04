const tablero = document.getElementById('tablero');
const mensaje = document.getElementById('mensaje');
const reiniciar = document.getElementById('reiniciar');
const ganadas = document.getElementById('ganadas');
const perdidas = document.getElementById('perdidas');
const empates = document.getElementById('empates');

let celdas = [];
let juegoActivo = true;
let estadisticas = { ganadas: 0, perdidas: 0, empates: 0 };
const jugador = 'X';
const simboloIA = 'O';

// Tabla de puntuaciones
const puntuaciones = Array(9).fill(0); // Inicializa puntuaciones para cada movimiento

const combinacionesGanadoras = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

const iniciarJuego = () => {
    celdas = Array(9).fill(null);
    juegoActivo = true;
    mensaje.textContent = '';
    tablero.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        const celda = document.createElement('div');
        celda.classList.add('celda');
        celda.dataset.index = i;
        celda.addEventListener('click', manejarClick);
        tablero.appendChild(celda);
    }
};

const manejarClick = (e) => {
    const index = e.target.dataset.index;

    if (celdas[index] || !juegoActivo) {
        return;
    }

    celdas[index] = jugador;
    e.target.textContent = jugador;

    if (verificarGanador(jugador)) {
        mensaje.textContent = `¡${jugador} gana!`;
        juegoActivo = false;
        estadisticas.ganadas++;
        ganadas.textContent = estadisticas.ganadas;
        destacarGanador(combinacionesGanadoras);
        return;
    }

    if (celdas.every(celda => celda)) {
        mensaje.textContent = '¡Es un empate!';
        juegoActivo = false;
        estadisticas.empates++;
        empates.textContent = estadisticas.empates;
        return;
    }

    jugarIA();
};

const jugarIA = () => {
    // Primero, verifica si la IA puede ganar o necesita bloquear
    for (let i = 0; i < 9; i++) {
        if (!celdas[i]) {
            celdas[i] = simboloIA;
            if (verificarGanador(simboloIA)) {
                realizarMovimiento(i);
                return;
            }
            celdas[i] = null; // Deshacer
        }
    }

    for (let i = 0; i < 9; i++) {
        if (!celdas[i]) {
            celdas[i] = jugador;
            if (verificarGanador(jugador)) {
                realizarMovimiento(i);
                return;
            }
            celdas[i] = null; // Deshacer
        }
    }

    // Si no hay ganadores o bloqueos, selecciona el mejor movimiento
    let mejorMovimiento;
    let mejorPuntaje = -Infinity;

    for (let i = 0; i < 9; i++) {
        if (!celdas[i]) {
            celdas[i] = simboloIA;
            const puntaje = evaluar(celdas);
            celdas[i] = null; // Deshacer
            const puntuacionMovimiento = puntuaciones[i] + puntaje;

            if (puntuacionMovimiento > mejorPuntaje) {
                mejorPuntaje = puntuacionMovimiento;
                mejorMovimiento = i;
            }
        }
    }

    realizarMovimiento(mejorMovimiento);
};

const realizarMovimiento = (index) => {
    celdas[index] = simboloIA;
    tablero.children[index].textContent = simboloIA;

    if (verificarGanador(simboloIA)) {
        mensaje.textContent = '¡O gana!';
        juegoActivo = false;
        estadisticas.perdidas++;
        perdidas.textContent = estadisticas.perdidas;
        actualizarPuntuaciones(index, true); // Actualizar puntuaciones en caso de ganar
        destacarGanador(combinacionesGanadoras);
        return;
    }

    if (celdas.every(celda => celda)) {
        mensaje.textContent = '¡Es un empate!';
        juegoActivo = false;
        estadisticas.empates++;
        empates.textContent = estadisticas.empates;
        return;
    }

    // Ajustar puntuaciones de movimiento
    actualizarPuntuaciones(index, false); // Actualizar puntuaciones en caso de no ganar
};

const evaluar = (celdas) => {
    for (let combinacion of combinacionesGanadoras) {
        const [a, b, c] = combinacion;
        if (celdas[a] === celdas[b] && celdas[b] === celdas[c]) {
            return celdas[a] === 'X' ? 1 : -1;
        }
    }
    return 0;
};

const verificarGanador = (simbolo) => {
    return combinacionesGanadoras.some(combinacion => {
        const [a, b, c] = combinacion;
        return celdas[a] === simbolo && celdas[a] === celdas[b] && celdas[a] === celdas[c];
    });
};

const destacarGanador = (combinaciones) => {
    combinaciones.forEach(combinacion => {
        const [a, b, c] = combinacion;
        if (celdas[a] && celdas[a] === celdas[b] && celdas[a] === celdas[c]) {
            tablero.children[a].classList.add('ganadora');
            tablero.children[b].classList.add('ganadora');
            tablero.children[c].classList.add('ganadora');
        }
    });
};

// Actualiza las puntuaciones según el resultado
const actualizarPuntuaciones = (index, gano) => {
    if (gano) {
        puntuaciones[index] += 1; // Aumentar si ganó
    } else {
        puntuaciones[index] -= 1; // Disminuir si perdió
    }
};

reiniciar.addEventListener('click', iniciarJuego);
iniciarJuego();