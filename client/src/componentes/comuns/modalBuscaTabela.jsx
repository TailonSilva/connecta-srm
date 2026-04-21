import { useEffect, useMemo, useRef, useState } from 'react';
import { Botao } from './botao';
import { CampoPesquisa } from './campoPesquisa';
import { GradePadrao } from './gradePadrao';
import { filtrarRegistrosAtivos } from '../../servicos/listas';

export function ModalBuscaTabela({
  aberto,
  titulo,
  placeholder,
  ariaLabelPesquisa,
  colunas,
  registros,
  obterTextoBusca,
  obterChaveRegistro,
  aoSelecionar,
  aoFechar,
  rotuloAcaoPrimaria = '',
  tituloAcaoPrimaria = '',
  iconeAcaoPrimaria = 'adicionar',
  aoAcionarPrimaria = null,
  classNameModal = 'modalContatoFornecedor modalBuscaFornecedorAtendimento',
  classNameTabela = 'tabelaContatosModal tabelaBuscaFornecedorAtendimento',
  filtrarInativos = true,
  mensagemVazio = 'Nenhum registro encontrado.'
}) {
  const [pesquisa, definirPesquisa] = useState('');
  const [indiceAtivo, definirIndiceAtivo] = useState(0);
  const referenciaPesquisa = useRef(null);

  const registrosDisponiveis = useMemo(
    () => filtrarRegistrosAtivos(registros, { incluirInativos: !filtrarInativos }),
    [filtrarInativos, registros]
  );

  const registrosFiltrados = useMemo(() => {
    const termo = String(pesquisa || '').trim().toLowerCase();

    return registrosDisponiveis.filter((registro) => {
      if (!termo) {
        return true;
      }

      return String(obterTextoBusca(registro) || '').toLowerCase().includes(termo);
    });
  }, [registrosDisponiveis, pesquisa, obterTextoBusca]);

  useEffect(() => {
    if (!aberto) {
      return;
    }

    definirPesquisa('');
    definirIndiceAtivo(0);
    const timeout = window.setTimeout(() => referenciaPesquisa.current?.focus(), 0);
    return () => window.clearTimeout(timeout);
  }, [aberto]);

  useEffect(() => {
    if (!registrosFiltrados.length) {
      definirIndiceAtivo(0);
      return;
    }

    if (indiceAtivo > registrosFiltrados.length - 1) {
      definirIndiceAtivo(registrosFiltrados.length - 1);
    }
  }, [registrosFiltrados, indiceAtivo]);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function tratarTecla(evento) {
      if (evento.key === 'Escape') {
        aoFechar();
        return;
      }

      if (evento.key === 'ArrowDown') {
        evento.preventDefault();

        if (!registrosFiltrados.length) {
          return;
        }

        definirIndiceAtivo((indiceAtual) => (
          indiceAtual >= registrosFiltrados.length - 1 ? 0 : indiceAtual + 1
        ));
        return;
      }

      if (evento.key === 'ArrowUp') {
        evento.preventDefault();

        if (!registrosFiltrados.length) {
          return;
        }

        definirIndiceAtivo((indiceAtual) => (
          indiceAtual <= 0 ? registrosFiltrados.length - 1 : indiceAtual - 1
        ));
        return;
      }

      if (evento.key === 'Enter') {
        if (!registrosFiltrados.length) {
          return;
        }

        evento.preventDefault();
        aoSelecionar(registrosFiltrados[indiceAtivo]);
      }
    }

    window.addEventListener('keydown', tratarTecla);

    return () => {
      window.removeEventListener('keydown', tratarTecla);
    };
  }, [aberto, aoFechar, aoSelecionar, indiceAtivo, registrosFiltrados]);

  if (!aberto) {
    return null;
  }

  return (
    <div className="camadaModalContato" role="presentation" onMouseDown={aoFechar}>
      <div
        className={classNameModal}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onMouseDown={(evento) => evento.stopPropagation()}
      >
        <div className="cabecalhoModalContato">
          <h3>{titulo}</h3>
          <div className="acoesFormularioContatoModal">
            {typeof aoAcionarPrimaria === 'function' && rotuloAcaoPrimaria ? (
              <Botao
                variante="primario"
                type="button"
                icone={iconeAcaoPrimaria}
                title={tituloAcaoPrimaria || rotuloAcaoPrimaria}
                aria-label={tituloAcaoPrimaria || rotuloAcaoPrimaria}
                onClick={aoAcionarPrimaria}
              >
                {rotuloAcaoPrimaria}
              </Botao>
            ) : null}
            <Botao variante="secundario" type="button" onClick={aoFechar}>
              Fechar
            </Botao>
          </div>
        </div>

        <div className="corpoModalContato corpoModalBuscaFornecedorAtendimento">
          <CampoPesquisa
            ref={referenciaPesquisa}
            valor={pesquisa}
            aoAlterar={definirPesquisa}
            placeholder={placeholder}
            ariaLabel={ariaLabelPesquisa}
          />

          <GradePadrao
            className="gradeContatosModal gradeBuscaFornecedorAtendimento"
            classNameTabela={classNameTabela}
            classNameMensagem="mensagemTabelaContatosModal"
            cabecalho={(
              <tr>
                {colunas.map((coluna) => (
                  <th key={coluna.key}>{coluna.label}</th>
                ))}
              </tr>
            )}
            temItens={registrosFiltrados.length > 0}
            mensagemVazia={mensagemVazio}
          >
            {registrosFiltrados.map((registro, indice) => (
              <tr
                key={obterChaveRegistro(registro)}
                className={indice === indiceAtivo ? 'linhaBuscaFornecedorAtiva' : ''}
                onMouseEnter={() => definirIndiceAtivo(indice)}
                onClick={() => aoSelecionar(registro)}
                onDoubleClick={() => aoSelecionar(registro)}
              >
                {colunas.map((coluna) => (
                  <td key={`${obterChaveRegistro(registro)}-${coluna.key}`}>
                    {coluna.render ? coluna.render(registro) : registro[coluna.key]}
                  </td>
                ))}
              </tr>
            ))}
          </GradePadrao>
        </div>
      </div>
    </div>
  );
}
