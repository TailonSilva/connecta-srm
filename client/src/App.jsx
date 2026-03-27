import { useState } from 'react';
import { BarraLateral } from './componentes/layout/barraLateral';
import { PaginaClientes } from './paginas/clientes/paginaClientes';
import { PaginaPadrao } from './paginas/padrao/paginaPadrao';
import { PaginaProdutos } from './paginas/produtos/paginaProdutos';
import { paginasPainel } from './utilitarios/paginas';

function renderizarPagina(paginaSelecionada) {
  if (paginaSelecionada.id === 'clientes') {
    return <PaginaClientes />;
  }

  if (paginaSelecionada.id === 'produtos') {
    return <PaginaProdutos />;
  }

  return <PaginaPadrao pagina={paginaSelecionada} />;
}

export default function App() {
  const [paginaAtiva, definirPaginaAtiva] = useState(paginasPainel[0].id);

  const paginaSelecionada =
    paginasPainel.find((pagina) => pagina.id === paginaAtiva) || paginasPainel[0];

  return (
    <main className="aplicacao">
      <div className="estruturaPainel">
        <BarraLateral
          itens={paginasPainel}
          paginaAtiva={paginaAtiva}
          aoSelecionarPagina={definirPaginaAtiva}
        />

        <section className="areaConteudo">
          {renderizarPagina(paginaSelecionada)}
        </section>
      </div>
    </main>
  );
}
