import { useState } from 'react';
import { BarraLateral } from './componentes/layout/barraLateral';
import { CabecalhoPagina } from './componentes/layout/cabecalhoPagina';
import { NavegacaoPaginas } from './componentes/layout/navegacaoPaginas';
import { PainelPrincipal } from './paginas/painelPrincipal';
import { paginasPainel } from './utilitarios/paginas';

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
          <CabecalhoPagina
            titulo={paginaSelecionada.titulo}
            descricao={paginaSelecionada.descricao}
          />

          <NavegacaoPaginas
            itens={paginasPainel}
            paginaAtiva={paginaAtiva}
            aoSelecionarPagina={definirPaginaAtiva}
          />

          <PainelPrincipal pagina={paginaSelecionada} />
        </section>
      </div>
    </main>
  );
}
