/* ==========================================================================
   Pagina de produtos: filtro por categoria e busca por nome, feitos no
   navegador, sem recarregar a pagina.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const cartoes = Array.from(document.querySelectorAll("[data-produto]"));
  const botoes = Array.from(document.querySelectorAll("[data-filtro]"));
  const campoBusca = document.querySelector("#busca-produto");
  const contador = document.querySelector("[data-contador]");
  const semResultado = document.querySelector("[data-sem-resultado]");

  if (cartoes.length === 0) {
    return;
  }

  let categoriaAtual = "todas";

  function aplicarFiltros() {
    const termo = (campoBusca?.value ?? "").trim().toLowerCase();
    let visiveis = 0;

    cartoes.forEach((cartao) => {
      const categoria = cartao.dataset.categoria;
      const nome = cartao.dataset.nome.toLowerCase();
      const combinaCategoria = categoriaAtual === "todas" || categoria === categoriaAtual;
      const combinaTermo = termo.length === 0 || nome.includes(termo);
      const mostrar = combinaCategoria && combinaTermo;

      cartao.classList.toggle("d-none", !mostrar);

      if (mostrar) {
        visiveis += 1;
      }
    });

    if (contador) {
      contador.textContent =
        visiveis === 1 ? "1 produto encontrado." : `${visiveis} produtos encontrados.`;
    }

    if (semResultado) {
      semResultado.classList.toggle("d-none", visiveis > 0);
    }
  }

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      categoriaAtual = botao.dataset.filtro;

      botoes.forEach((outro) => {
        const ativo = outro === botao;
        outro.classList.toggle("active", ativo);
        outro.setAttribute("aria-pressed", String(ativo));
      });

      aplicarFiltros();
    });
  });

  campoBusca?.addEventListener("input", aplicarFiltros);

  aplicarFiltros();
});
