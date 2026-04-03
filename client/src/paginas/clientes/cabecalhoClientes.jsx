import { Botao } from '../../componentes/comuns/botao';
import { CampoPesquisa } from '../../componentes/comuns/campoPesquisa';
import '../../recursos/estilos/cabecalhoPagina.css';

export function CabecalhoClientes({
  pesquisa,
  aoAlterarPesquisa,
  aoAbrirFiltros,
  aoAbrirImportacao,
  aoNovoCliente,
  filtrosAtivos = false
}) {
  return (
    <header className="cabecalhoPagina">
      <div>
        <h1>Clientes</h1>
        <p>Gerencie o cadastro e a consulta dos clientes do CRM.</p>
      </div>

      <div className="acoesCabecalhoPagina">
        <CampoPesquisa
          valor={pesquisa}
          aoAlterar={aoAlterarPesquisa}
          placeholder="Pesquisar clientes"
          ariaLabel="Pesquisar clientes"
        />
        <Botao
          variante={filtrosAtivos ? 'primario' : 'secundario'}
          icone="filtro"
          somenteIcone
          title="Filtrar"
          aria-label="Filtrar"
          onClick={aoAbrirFiltros}
        />
        <Botao variante="secundario" icone="importar" somenteIcone title="Importar" aria-label="Importar" onClick={aoAbrirImportacao} />
        <Botao
          variante="primario"
          icone="adicionar"
          somenteIcone
          title="Novo cliente"
          aria-label="Novo cliente"
          onClick={aoNovoCliente}
        />
      </div>
    </header>
  );
}
