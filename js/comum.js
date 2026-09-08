/* ==========================================================================
   Funcoes usadas em todas as paginas do site.
   - marca o link da pagina atual no menu;
   - mostra o ano corrente no rodape;
   - informa, pelo relogio do visitante, se a loja esta aberta agora.
   ========================================================================== */

/** Horario de funcionamento por dia da semana (0 = domingo). */
const HORARIOS = {
  0: null,
  1: { abre: 8, fecha: 19 },
  2: { abre: 8, fecha: 19 },
  3: { abre: 8, fecha: 19 },
  4: { abre: 8, fecha: 19 },
  5: { abre: 8, fecha: 19 },
  6: { abre: 8, fecha: 14 }
};

/** Destaca no menu o link correspondente a pagina aberta. */
function marcarLinkAtivo() {
  const paginaAtual = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.getAttribute("href") === paginaAtual) {
      link.classList.add("ativo");
      link.setAttribute("aria-current", "page");
    }
  });
}

/** Preenche o ano corrente nos elementos marcados com data-ano. */
function preencherAno() {
  const ano = String(new Date().getFullYear());
  document.querySelectorAll("[data-ano]").forEach((elemento) => {
    elemento.textContent = ano;
  });
}

/** Calcula a situacao da loja em uma data e hora. */
function situacaoDaLoja(agora) {
  const expediente = HORARIOS[agora.getDay()];

  if (!expediente) {
    return { aberto: false, mensagem: "Fechado hoje. Abrimos segunda-feira as 8h." };
  }

  const hora = agora.getHours() + agora.getMinutes() / 60;

  if (hora < expediente.abre) {
    return { aberto: false, mensagem: `Fechado agora. Abrimos hoje as ${expediente.abre}h.` };
  }

  if (hora >= expediente.fecha) {
    return { aberto: false, mensagem: "Fechado agora. Voltamos no proximo dia util." };
  }

  return { aberto: true, mensagem: `Aberto agora. Atendemos ate as ${expediente.fecha}h.` };
}

/** Atualiza a barra superior com a hora do visitante e a situacao da loja. */
function atualizarBarraInfo() {
  const alvoRelogio = document.querySelector("[data-relogio]");
  const alvoStatus = document.querySelector("[data-status-loja]");

  if (!alvoRelogio && !alvoStatus) {
    return;
  }

  const agora = new Date();

  if (alvoRelogio) {
    alvoRelogio.textContent = agora.toLocaleString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  if (alvoStatus) {
    const situacao = situacaoDaLoja(agora);
    alvoStatus.textContent = situacao.mensagem;
    alvoStatus.classList.toggle("status-aberto", situacao.aberto);
    alvoStatus.classList.toggle("status-fechado", !situacao.aberto);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  marcarLinkAtivo();
  preencherAno();
  atualizarBarraInfo();
  // Funcao temporal: mantem o relogio e a situacao da loja sempre atualizados.
  window.setInterval(atualizarBarraInfo, 30000);
});
