const API = "http://localhost:8080/transacoes";

// ==========================
// USUÁRIO
// ==========================
let usuario = localStorage.getItem("usuario");

// protege páginas privadas
if (
    !window.location.pathname.includes("login.html")
    &&
    !usuario
) {
    window.location.href = "/login.html";
}

console.log("Usuário:", usuario);

// ==========================
// INIT
// ==========================
document.addEventListener("DOMContentLoaded", () => {

    // botão adicionar
    const btnAdicionar = document.getElementById("btnAdicionar");

    if (btnAdicionar) {
        btnAdicionar.addEventListener("click", adicionar);
    }

    // botão login
    const btnLogin = document.getElementById("btnLogin");

    if (btnLogin) {
        btnLogin.addEventListener("click", login);
    }

    // botão cadastro
    const btnCadastro =
            document.getElementById("btnCadastro");

        if (btnCadastro) {
            btnCadastro.addEventListener(
                "click",
                cadastrar
            );
        }

    carregar();
});

// ==========================
// CARREGAR
// ==========================
async function carregar() {

    // evita rodar na tela login
    const lista = document.getElementById("lista");

    if (!lista) return;

    try {
        const resposta = await fetch(`${API}?usuario=${usuario}`);
        const dados = await resposta.json();

        renderLista(dados);

        atualizarSaldo();

        carregarGrafico();

    } catch (erro) {
        console.error("Erro ao carregar:", erro);
    }
}

// ==========================
// RENDER LISTA
// ==========================
function renderLista(dados) {

    const lista = document.getElementById("lista");

    if (!lista) return;

    lista.innerHTML = "";

    dados.forEach(t => {

        const item = document.createElement("li");

        const classe =
            t.tipo === "RECEITA"
                ? "receita"
                : "despesa";

        item.innerHTML = `
            <span>${t.descricao}</span>
            <span class="${classe}">
                R$ ${t.valor}
            </span>
        `;

        lista.appendChild(item);
    });
}

// ==========================
// ADICIONAR
// ==========================
async function adicionar() {

    try {

        const descricao =
            document.getElementById("descricao").value;

        const valor =
            document.getElementById("valor").value;

        const tipo =
            document.getElementById("tipo").value;

        await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                descricao,
                valor,
                tipo,
                usuario
            })
        });

        carregar();

    } catch (erro) {

        console.error("Erro ao adicionar:", erro);
    }
}

// ==========================
// SALDO
// ==========================
async function atualizarSaldo() {

    try {

        const saldoElemento =
            document.getElementById("saldo");

        if (!saldoElemento) return;

        const resposta =
            await fetch(`${API}/saldo?usuario=${usuario}`);

        const saldo = await resposta.json();

        saldoElemento.innerText =
            saldo.toFixed(2);

    } catch (erro) {

        console.error("Erro ao saldo:", erro);
    }
}

// ==========================
// GRÁFICO
// ==========================
let grafico;

async function carregarGrafico() {

    try {

        const ctx =
            document.getElementById("grafico");

        if (!ctx) return;

        const res =
            await fetch(`${API}/resumo?usuario=${usuario}`);

        const dados = await res.json();

        if (grafico) {
            grafico.destroy();
        }

        const receitas = dados.receitas || 0;
        const despesas = dados.despesas || 0;

        const saldo =
            Math.max(receitas - despesas, 0);

        grafico = new Chart(ctx, {

            type: "doughnut",

            data: {
                labels: ["Saldo", "Despesas"],

                datasets: [{
                    data: [saldo, despesas],

                    backgroundColor: [
                        "#22c55e",
                        "#ef4444"
                    ],

                    borderWidth: 0,
                    cutout: "75%"
                }]
            }
        });

    } catch (erro) {

        console.error("Erro no gráfico:", erro);
    }
}

// ==========================
// LOGIN
// ==========================
async function login() {

    try {

        const username =
            document.getElementById("username").value;

        const senha =
            document.getElementById("senha").value;

        const res = await fetch(
            "http://localhost:8080/usuarios/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    senha
                })
            }
        );

        if (!res.ok) {
            throw new Error("Login falhou");
        }

        const user = await res.json();

        localStorage.setItem(
            "usuario",
            user.username
        );

        alert("Login realizado!");

        window.location.href = "/";

    } catch (erro) {

        console.error("Erro login:", erro);

        alert("Usuário ou senha inválidos");
    }
}


// ==========================
// CADASTRO
// ==========================
async function cadastrar() {

    try {

        const username =
            document.getElementById(
                "usernameCadastro"
            ).value;

        const senha =
            document.getElementById(
                "senhaCadastro"
            ).value;

        const res = await fetch(
            "http://localhost:8080/usuarios/registrar",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    senha
                })
            }
        );

        if (!res.ok) {
            throw new Error("Erro cadastro");
        }

        alert("Conta criada!");

        window.location.href =
            "/login.html";

    } catch (erro) {

        console.error(
            "Erro cadastro:",
            erro
        );

        alert("Usuário já existe");
    }
}