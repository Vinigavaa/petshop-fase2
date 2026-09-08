/* ==========================================================================
   Pagina de agendamento.
   - valida o formulario de cliente, pet e servico;
   - limita o calendario aos proximos 60 dias e recusa domingo;
   - monta a lista de horarios conforme o dia escolhido;
   - calcula o valor estimado e exibe o resumo do agendamento.
   ========================================================================== */

/** Tabela de precos por servico e porte do pet. */
const PRECOS = {
  banho: { pequeno: 55, medio: 75, grande: 95 },
  tosa: { pequeno: 65, medio: 85, grande: 105 },
  "banho-tosa": { pequeno: 99, medio: 119, grande: 139 }
};

/** Acrescimo da tele-busca por porte. */
const ACRESCIMO_TELEBUSCA = { pequeno: 25, medio: 30, grande: 35 };

const NOMES_SERVICO = {
  banho: "Banho",
  tosa: "Tosa",
  "banho-tosa": "Banho e tosa"
};

const NOMES_PORTE = {
  pequeno: "pequeno porte (ate 10 kg)",
  medio: "medio porte (11 a 25 kg)",
  grande: "grande porte (acima de 25 kg)"
};

/** Horarios disponiveis: 0 = domingo (fechado), 6 = sabado (meio periodo). */
function horariosDoDia(diaDaSemana) {
  if (diaDaSemana === 0) {
    return [];
  }

  const ultimaHora = diaDaSemana === 6 ? 13 : 18;
  const horarios = [];

  for (let hora = 8; hora <= ultimaHora; hora += 1) {
    horarios.push(`${String(hora).padStart(2, "0")}:00`);
  }

  return horarios;
}

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Converte "2026-09-12" em data local, evitando o deslocamento de fuso. */
function dataLocal(texto) {
  const [ano, mes, dia] = texto.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}

function formatarData(texto) {
  return dataLocal(texto).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function paraTextoDeData(data) {
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("#form-agendamento");

  if (!formulario) {
    return;
  }

  const campoData = formulario.querySelector("#data");
  const campoHora = formulario.querySelector("#hora");
  const avisoData = formulario.querySelector("[data-aviso-data]");
  const resumoValor = document.querySelector("[data-valor-estimado]");
  const detalheValor = document.querySelector("[data-detalhe-valor]");
  const painelResumo = document.querySelector("#resumo-agendamento");
  const corpoResumo = document.querySelector("[data-corpo-resumo]");

  // Calendario limitado a partir de hoje ate 60 dias a frente.
  const hoje = new Date();
  const limite = new Date();
  limite.setDate(limite.getDate() + 60);
  campoData.min = paraTextoDeData(hoje);
  campoData.max = paraTextoDeData(limite);

  function porteSelecionado() {
    return formulario.querySelector("input[name='porte']:checked")?.value ?? null;
  }

  function servicoSelecionado() {
    return formulario.querySelector("#servico").value || null;
  }

  function temTeleBusca() {
    return formulario.querySelector("input[name='atendimento']:checked")?.value === "tele-busca";
  }

  /** Recalcula e mostra o valor estimado do atendimento. */
  function atualizarValor() {
    const servico = servicoSelecionado();
    const porte = porteSelecionado();

    if (!servico || !porte) {
      resumoValor.textContent = "Selecione o servico e o porte do pet.";
      detalheValor.textContent = "";
      return 0;
    }

    const base = PRECOS[servico][porte];
    const extra = temTeleBusca() ? ACRESCIMO_TELEBUSCA[porte] : 0;
    const total = base + extra;

    resumoValor.textContent = formatarMoeda(total);
    detalheValor.textContent = extra
      ? `${NOMES_SERVICO[servico]} ${formatarMoeda(base)} + tele-busca ${formatarMoeda(extra)}.`
      : `${NOMES_SERVICO[servico]} para ${NOMES_PORTE[porte]}, entrega do pet na loja.`;

    return total;
  }

  /** Preenche os horarios possiveis para a data escolhida. */
  function atualizarHorarios() {
    const valor = campoData.value;
    campoHora.innerHTML = "";

    if (!valor) {
      campoHora.disabled = true;
      campoHora.innerHTML = '<option value="">Escolha primeiro a data</option>';
      avisoData.textContent = "";
      return;
    }

    const data = dataLocal(valor);
    const horarios = horariosDoDia(data.getDay());

    if (horarios.length === 0) {
      campoHora.disabled = true;
      campoHora.innerHTML = '<option value="">Sem atendimento neste dia</option>';
      campoData.setCustomValidity("Nao atendemos aos domingos.");
      avisoData.textContent = "Nao atendemos aos domingos. Escolha outro dia.";
      return;
    }

    campoData.setCustomValidity("");
    avisoData.textContent =
      data.getDay() === 6
        ? "Aos sabados atendemos das 8h as 14h."
        : "De segunda a sexta atendemos das 8h as 19h.";

    campoHora.disabled = false;
    campoHora.innerHTML = '<option value="">Selecione o horario</option>';

    horarios.forEach((horario) => {
      const opcao = document.createElement("option");
      opcao.value = horario;
      opcao.textContent = horario;
      campoHora.appendChild(opcao);
    });
  }

  /** Mostra o resumo do pedido depois do envio validado. */
  function mostrarResumo(total) {
    const dados = new FormData(formulario);
    const protocolo = `PC-${Date.now().toString().slice(-6)}`;
    const atendimento =
      dados.get("atendimento") === "tele-busca"
        ? "Tele-busca (buscamos e devolvemos o pet)"
        : "Entrega do pet na loja";

    const linhas = [
      ["Protocolo", protocolo],
      ["Tutor", dados.get("nome")],
      ["CPF", dados.get("cpf")],
      ["Contato", `${dados.get("telefone")} | ${dados.get("email")}`],
      ["Pet", `${dados.get("pet")} (${dados.get("raca")}, ${dados.get("idade")} ano(s))`],
      ["Porte", NOMES_PORTE[dados.get("porte")]],
      ["Servico", NOMES_SERVICO[dados.get("servico")]],
      ["Atendimento", atendimento],
      ["Data e hora", `${formatarData(dados.get("data"))} as ${dados.get("hora")}`],
      ["Valor estimado", formatarMoeda(total)]
    ];

    corpoResumo.innerHTML = "";

    linhas.forEach(([rotulo, valor]) => {
      const item = document.createElement("li");
      item.className = "list-group-item d-flex justify-content-between gap-3";
      item.innerHTML = `<span class="fw-semibold">${rotulo}</span><span class="text-end">${valor}</span>`;
      corpoResumo.appendChild(item);
    });

    painelResumo.classList.remove("d-none");
    painelResumo.focus();
  }

  formulario.addEventListener("change", (evento) => {
    if (evento.target === campoData) {
      atualizarHorarios();
    }

    atualizarValor();
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    // O horario nao e recalculado aqui: refazer a lista apagaria a escolha do usuario.
    const total = atualizarValor();

    if (!formulario.checkValidity()) {
      formulario.classList.add("was-validated");
      formulario.querySelector(":invalid")?.focus();
      return;
    }

    formulario.classList.add("was-validated");
    mostrarResumo(total);
  });

  formulario.addEventListener("reset", () => {
    window.setTimeout(() => {
      formulario.classList.remove("was-validated");
      painelResumo.classList.add("d-none");
      atualizarHorarios();
      atualizarValor();
    }, 0);
  });

  atualizarHorarios();
  atualizarValor();
});
