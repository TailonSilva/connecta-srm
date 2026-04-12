import { PaginaAgenda } from '../../paginas/agenda/paginaAgenda';
import { PaginaAtendimentos } from '../../paginas/atendimentos/paginaAtendimentos';
import { PaginaClientes } from '../../paginas/clientes/paginaClientes';
import { PaginaConfiguracoes } from '../../paginas/configuracoes/paginaConfiguracoes';
import { PaginaInicio } from '../../paginas/inicio/paginaInicio';
import { PaginaOrcamentos } from '../../paginas/orcamentos/paginaOrcamentos';
import { PaginaPadrao } from '../../paginas/padrao/paginaPadrao';
import { PaginaPedidos } from '../../paginas/pedidos/paginaPedidos';
import { PaginaProdutos } from '../../paginas/produtos/paginaProdutos';

// Renderiza o conteudo central do painel com base no `id` da pagina atualmente selecionada.
export function ConteudoPainel({ paginaSelecionada, usuarioLogado }) {
  if (paginaSelecionada.id === 'inicio') {
    return <PaginaInicio usuarioLogado={usuarioLogado} />;
  }

  if (paginaSelecionada.id === 'clientes') {
    return <PaginaClientes usuarioLogado={usuarioLogado} />;
  }

  if (paginaSelecionada.id === 'agenda') {
    return <PaginaAgenda usuarioLogado={usuarioLogado} />;
  }

  if (paginaSelecionada.id === 'atendimentos') {
    return <PaginaAtendimentos usuarioLogado={usuarioLogado} />;
  }

  if (paginaSelecionada.id === 'produtos') {
    return <PaginaProdutos usuarioLogado={usuarioLogado} />;
  }

  if (paginaSelecionada.id === 'orcamentos') {
    return <PaginaOrcamentos usuarioLogado={usuarioLogado} />;
  }

  if (paginaSelecionada.id === 'pedidos') {
    return <PaginaPedidos usuarioLogado={usuarioLogado} />;
  }

  if (paginaSelecionada.id === 'configuracoes') {
    return <PaginaConfiguracoes usuarioLogado={usuarioLogado} />;
  }

  return <PaginaPadrao pagina={paginaSelecionada} />;
}
