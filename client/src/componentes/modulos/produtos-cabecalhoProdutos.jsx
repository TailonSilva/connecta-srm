import { Botao } from '../comuns/botao';
import { CampoPesquisa } from '../comuns/campoPesquisa';
import '../../recursos/estilos/cabecalhoPagina.css';

export function CabecalhoProdutos({
  pesquisa,
  aoAlterarPesquisa,
  aoAbrirFiltros,
  aoAbrirConfiguracaoGrid,
  aoAbrirImportacao,
  aoNovoProduto,
  filtrosAtivos = false,
  somenteConsulta = false,
  configuracaoGridBloqueada = false
}) {
  return (
    <header className="cabecalhoPagina">
      <div>
        <h1>Produtos</h1>
        <p>Gerencie o catalogo e a consulta dos produtos do SRM.</p>
      </div>

      <div className="acoesCabecalhoPagina">
        <CampoPesquisa
          valor={pesquisa}
          aoAlterar={aoAlterarPesquisa}
          placeholder="Pesquisar produtos"
          ariaLabel="Pesquisar produtos"
        />
        <Botao
          variante={filtrosAtivos ? 'primario' : 'secundario'}
          icone="filtro"
          somenteIcone
          title="Filtrar"
          aria-label="Filtrar"
          onClick={aoAbrirFiltros}
        />
        <Botao
          variante="secundario"
          icone="configuracoes"
          somenteIcone
          title="Configurar grid"
          aria-label="Configurar grid"
          onClick={aoAbrirConfiguracaoGrid}
          disabled={configuracaoGridBloqueada}
        />
        <Botao
          variante="secundario"
          icone="importar"
          somenteIcone
          title="Importar"
          aria-label="Importar"
          onClick={aoAbrirImportacao}
          disabled={somenteConsulta}
        />
        <Botao
          variante="primario"
          icone="adicionar"
          somenteIcone
          title="Novo produto"
          aria-label="Novo produto"
          disabled={somenteConsulta}
          onClick={aoNovoProduto}
        />
      </div>
    </header>
  );
}

