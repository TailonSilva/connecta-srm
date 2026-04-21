import { PaginaAgenda } from '../../paginas/paginaAgenda';
import { PaginaAtendimentos } from '../../paginas/paginaAtendimentos';
import { PaginaFornecedores } from '../../paginas/paginaFornecedores';
import { PaginaConfiguracoes } from '../../paginas/paginaConfiguracoes';
import { PaginaInicio } from '../../paginas/paginaInicio';
import { PaginaCotacoes } from '../../paginas/paginaCotacoes';
import { PaginaPadrao } from '../../paginas/paginaPadrao';
import { PaginaOrdensCompra } from '../../paginas/paginaOrdensCompra';
import { PaginaProdutos } from '../../paginas/paginaProdutos';

// Renderiza o conteudo central do painel com base no `id` da pagina atualmente selecionada.
export function ConteudoPainel({ paginaSelecionada, usuarioLogado }) {
  if (paginaSelecionada.id === 'inicio') {
    return <PaginaInicio usuarioLogado={usuarioLogado} />;
  }

  if (paginaSelecionada.id === 'fornecedores') {
    return <PaginaFornecedores usuarioLogado={usuarioLogado} />;
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

  if (paginaSelecionada.id === 'cotacoes') {
    return <PaginaCotacoes usuarioLogado={usuarioLogado} />;
  }

  if (paginaSelecionada.id === 'ordensCompra') {
    return <PaginaOrdensCompra usuarioLogado={usuarioLogado} />;
  }

  if (paginaSelecionada.id === 'configuracoes') {
    return <PaginaConfiguracoes usuarioLogado={usuarioLogado} />;
  }

  return <PaginaPadrao pagina={paginaSelecionada} />;
}

