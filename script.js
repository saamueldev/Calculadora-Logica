var res = [];
var last = "";
var resultado = ""
var par = 0
var finalRes = [];
//Id's: letra, op, aberto, fechado, calc


function insert(btn) {
    
    switch (btn.id) {

        case ("letra"):

            if (last === "letra" || last === "fechado" || last === "verdadeiro" || last === "falso") {
                return null;
            }

            break;

        case ("verdadeiro"):

            if (last === "letra" || last === "fechado" || last === "verdadeiro" || last === "falso") {
                return null;
            }

            break;

        case ("falso"):

            if (last === "letra" || last === "fechado" || last === "verdadeiro" || last === "falso") {
                return null;
            }

            break;

        case ("aberto"):

            if (last === "fechado" || last === "letra" || last === "verdadeiro" || last === "falso") {
                return null;
            }

            break;
        
        case ("fechado"):
            
            if (last === "op" || last === "aberto") {
                return null;
            }

            break;

        case ("op"):

            if (last !== "letra" && last !== "fechado" && last !== "verdadeiro" && last !== "falso") {
                return null;
            }

            break;

        case ("negacao"):
            if (last !== "op" && last !== "aberto" && last !== "") {
                return null;
            }
    }


    res.push(btn.id);

    last = res[res.length - 1];

    console.log(res)

    console.log(last)

    if (btn.id === "aberto") {
        par++;
    }
    else if (btn.id === "fechado") {
        par--;
    }

    if(btn.id === "verdadeiro") {
        document.getElementById('resultado').innerHTML = resultado + `<span class="verdadeiro">1</span>`;
    }
    else if(btn.id === "falso") {
        document.getElementById('resultado').innerHTML = resultado + `<span class="falso">0</span>`;
    }
    else {
        document.getElementById('resultado').innerHTML = resultado + btn.innerText;
    }

    resultado = document.getElementById('resultado').innerHTML;



}

function clean() {
    document.getElementById('resultado').innerHTML = "";
    resultado = ""
    res = [];
    last = ""
}

function back() {

    if (res.length != 0) {

        const container = document.getElementById('resultado');

        // Pega todos os filhos (incluindo spans)
        const children = container.childNodes;
        if(children.length === 0) return;

        const lasts = children[children.length - 1];

        if(lasts.nodeType === 3) { // nó de texto
            if(lasts.textContent.length > 1) {
                lasts.textContent = lasts.textContent.slice(0, -1);
            } else {
                container.removeChild(lasts);
            }
        } else {
            container.removeChild(lasts); // remove o span inteiro
        }

        res.pop();
        last = res[res.length - 1];
    }

    else {
        console.log("Tem nada man");
    }

    resultado = document.getElementById('resultado').innerHTML;
}

function calcular() {
    res = [];
    finalRes = [];
    var resultados = document.getElementById('resultado').innerText; // pega texto sem HTML
    if(resultados) {
        try {
            table_maker(resultados)
            par = 0;
        } catch(e) {
            console.log(par + " = número de parênteses abertos - fechados")

            console.log("Esta expressão possui apenas " + num_var(resultados) + " variáveis diferentes");

            console.log(big_solver('1∧0'));      // "0"
            console.log(big_solver('1v0'));      // "1"
            console.log(big_solver('¬0'));       // "1"
            console.log(big_solver('(1∧0)v1'));  // "1"
            console.log(big_solver(resultados))

            document.getElementById('resultado').innerHTML = "Erro";
            if (par !== 0) {
            document.getElementById('resultado').innerHTML = "Erro, expressão possui número errado de parênteses";
        }
            par = 0;
        }
    } else {
        document.getElementById('resultado').innerHTML = "Nada";
        par = 0;
    }
}

// -------------------------- Tratamento das expressões -------------------------- 

function num_var(exp) { //Recebe a string expressão e retorna o número de variáveis da expressão

    var letters = exp.match(/[A-Z]/g)

    var vars = [...new Set(letters)]

    var qty_var = vars.length;

    return qty_var;
}

function table_maker(exp) {
    console.log("Executando table maker...")

    var letters = exp.match(/[A-Z]/g) || [];
    var vars = [...new Set(letters)].sort();
    var qty_var = vars.length;
    var lines = 2 ** qty_var;

    finalRes = [];

    let html = "<table border='1' style='margin-top:10px; border-collapse:collapse; text-align:center;'>";
    
    // Cabeçalho
    html += "<tr>";
    vars.forEach(v => html += `<th>${v}</th>`);
    html += `<th>${exp}</th></tr>`;

    for (var i = lines - 1; i >= 0 ; i--) {
        var bits = i.toString(2).padStart(qty_var, "0").split("");
        var newExp = exp;
        vars.forEach((v, ind) => {
            newExp = newExp.replaceAll(v, bits[ind]);
        });

        var solution = big_solver(newExp);
        finalRes.push(solution);

        // Linha da tabela
        html += "<tr>";
        bits.forEach(b => html += `<td>${b === "1" ? "V" : "F"}</td>`);
        html += `<td>${solution === "1" ? "V" : "F"}</td>`;
        html += "</tr>";
    }

    html += "</table>";

    // --- Classificação ---
    let classificacao = "";
    if (finalRes.every(r => r === "1")) {
        classificacao = "é uma <span style='color:green'>Tautologia</span>";
    } else if (finalRes.every(r => r === "0")) {
        classificacao = "é uma <span style='color:red'>Contradição</span>";
    } else {
        classificacao = "é uma <span style='color:orange'>Contingência</span>";
    }

    // Mostrar expressão + classificação
    document.getElementById("classificacao").innerHTML = `${exp} ${classificacao}`;
    // Mostrar tabela
    document.getElementById("tabela-verdade").innerHTML = html;

    console.log("Table maker executado!");
    console.log(finalRes);
}

function little_solver(exp) {
  exp = exp.replace(/\s+/g, '');

  // NOT (¬)
  while (/¬[01]/.test(exp)) {
    exp = exp.replace(/¬([01])/, (_, p) => p === "0" ? "1" : "0");
  }
  // AND (∧)
  while (/[01]∧[01]/.test(exp)) {
    exp = exp.replace(/([01])∧([01])/, (_, p, q) => (p === "1" && q === "1") ? "1" : "0");
  }
  // XOR (⊻)
  while (/[01]⊻[01]/.test(exp)) {
    exp = exp.replace(/([01])⊻([01])/, (_, p, q) => (p !== q ? "1" : "0"));
  }
  // OR (v)
  while (/[01]v[01]/.test(exp)) {
    exp = exp.replace(/([01])v([01])/, (_, p, q) => (p === "1" || q === "1") ? "1" : "0");
  }
  // IMPLICA (→)
  while (/[01]→[01]/.test(exp)) {
    exp = exp.replace(/([01])→([01])/, (_, p, q) => (p === "1" && q === "0") ? "0" : "1");
  }
  // BICONDICIONAL (↔)
  while (/[01]↔[01]/.test(exp)) {
    exp = exp.replace(/([01])↔([01])/, (_, p, q) => (p === q ? "1" : "0"));
  }

  return exp;
}



function big_solver(exp) {
  // pega QUALQUER coisa dentro de parênteses (já estamos com 0/1 e operadores)
  const parenRegex = /\(([^()]+)\)/;
  while (parenRegex.test(exp)) {
    exp = exp.replace(parenRegex, (_, inner) => little_solver(inner));
  }
  return little_solver(exp);
}

// MODO NOTURNO
const switchElement = document.querySelector('.switch_input');
const bodyElement = document.body;

switchElement.addEventListener('change', () => {
    bodyElement.classList.toggle('dark-mode');
});