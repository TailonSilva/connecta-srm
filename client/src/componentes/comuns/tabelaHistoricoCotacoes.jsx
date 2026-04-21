import { GradePadrao } from './gradePadrao';
import { normalizarPreco } from '../../utilitarios/normalizarPreco';

export function TabelaHistoricoCotacoes({
  carregando = false,
  mensagemErro = '',
  cotacoes = [],
  contextoSalvo = true,
  mensagemSemContexto = 'Os cotacoes ficarao disponiveis apos carregar os registros.',
  mensagemVazia = 'Nenhum cotacao encontrado para o periodo informado.'
}) {
  return (
    <GradePadrao
      className="gradeContatosModal modalHistoricoCotacoesGrade"
      classNameTabela="tabelaContatosModal tabelaHistoricoCotacoes"
      classNameMensagem="mensagemTabelaContatosModal"
      cabecalho={(
        <tr>
          <th className="colunaHistoricoCotacaoData">Inclusao</th>
          <th className="colunaHistoricoCotacaoData">Fechamento</th>
          <th className="colunaHistoricoCotacaoCodigo">Codigo</th>
          <th className="colunaHistoricoCotacaoFornecedor">Fornecedor</th>
          <th className="colunaHistoricoCotacaoContato">Contato</th>
          <th className="colunaHistoricoCotacaoEtapa">Etapa</th>
          <th className="colunaHistoricoCotacaoComprador">Comprador</th>
          <th className="colunaHistoricoCotacaoTotal">Total</th>
        </tr>
      )}
      carregando={carregando}
      mensagemErro={mensagemErro}
      temItens={contextoSalvo && cotacoes.length > 0}
      mensagemCarregando="Carreganda cotacaos..."
      mensagemVazia={contextoSalvo ? mensagemVazia : mensagemSemContexto}
    >
      {cotacoes.map((cotacao) => (
        <tr key={cotacao.idCotacao}>
          <td className="colunaHistoricoCotacaoData">{formatarDataTabela(cotacao.dataInclusao, 'Nao informada')}</td>
          <td className="colunaHistoricoCotacaoData">{formatarDataTabela(cotacao.dataFechamento, '')}</td>
          <td className="colunaHistoricoCotacaoCodigo">{`#${String(cotacao.idCotacao).padStart(4, '0')}`}</td>
          <td className="colunaHistoricoCotacaoFornecedor">{cotacao.nomeFornecedor || 'Nao informado'}</td>
          <td className="colunaHistoricoCotacaoContato">{cotacao.nomeContato || ''}</td>
          <td className="colunaHistoricoCotacaoEtapa">{cotacao.nomeEtapaCotacao || 'Sem etapa'}</td>
          <td className="colunaHistoricoCotacaoComprador">{cotacao.nomeComprador || 'Nao informado'}</td>
          <td className="colunaHistoricoCotacaoTotal">{normalizarPreco(cotacao.totalCotacao || 0)}</td>
        </tr>
      ))}
    </GradePadrao>
  );
}

function formatarDataTabela(valor, fallback = '') {
  if (!valor) {
    return fallback;
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${valor}T00:00:00`));
}
