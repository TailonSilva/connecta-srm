import { Botao } from '../comuns/botao';
import { CampoPesquisa } from '../comuns/campoPesquisa';
import '../../recursos/estilos/cabecalhoPagina.css';

export function CabecalhoFornecedores({
  pesquisa,
  aoAlterarPesquisa,
  aoAbrirFiltros,
  aoAbrirConfiguracaoGrid,
  aoAbrirImportacao,
  aoNovoFornecedor,
  filtrosAtivos = false,
  configuracaoGridBloqueada = false
}) {
  return (
    <header className="cabecalhoPagina">
      <div>
        <h1>Fornecedores</h1>
        <p>Gerencie o cadastro e a consulta dos fornecedores do SRM.</p>
      </div>

      <div className="acoesCabecalhoPagina">
        <CampoPesquisa
          valor={pesquisa}
          aoAlterar={aoAlterarPesquisa}
          placeholder="Pesquisar fornecedores"
          ariaLabel="Pesquisar fornecedores"
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
        <Botao variante="secundario" icone="importar" somenteIcone title="Importar" aria-label="Importar" onClick={aoAbrirImportacao} />
        <Botao
          variante="primario"
          icone="adicionar"
          somenteIcone
          title="Novo fornecedor"
          aria-label="Novo fornecedor"
          onClick={aoNovoFornecedor}
        />
      </div>
    </header>
  );
}

