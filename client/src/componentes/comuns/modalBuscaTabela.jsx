import { useEffect, useMemo, useRef, useState } from 'react';
import { Botao } from './botao';
import { CampoPesquisa } from './campoPesquisa';

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
  classNameModal = 'modalContatoCliente modalBuscaClienteAtendimento',
  classNameTabela = 'tabelaContatosModal tabelaBuscaClienteAtendimento',
  mensagemVazio = 'Nenhum registro encontrado.'
}) {
  const [pesquisa, definirPesquisa] = useState('');
  const [indiceAtivo, definirIndiceAtivo] = useState(0);
  const referenciaPesquisa = useRef(null);

  const registrosFiltrados = useMemo(() => {
    const termo = String(pesquisa || '').trim().toLowerCase();

    return registros.filter((registro) => {
      if (!termo) {
        return true;
      }

      return String(obterTextoBusca(registro) || '').toLowerCase().includes(termo);
    });
  }, [registros, pesquisa, obterTextoBusca]);

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

        <div className="corpoModalContato corpoModalBuscaClienteAtendimento">
          <CampoPesquisa
            ref={referenciaPesquisa}
            valor={pesquisa}
            aoAlterar={definirPesquisa}
            placeholder={placeholder}
            ariaLabel={ariaLabelPesquisa}
          />

          <div className="gradeContatosModal gradeBuscaClienteAtendimento">
            <table className={classNameTabela}>
              <thead>
                <tr>
                  {colunas.map((coluna) => (
                    <th key={coluna.key}>{coluna.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {registrosFiltrados.length > 0 ? (
                  registrosFiltrados.map((registro, indice) => (
                    <tr
                      key={obterChaveRegistro(registro)}
                      className={indice === indiceAtivo ? 'linhaBuscaClienteAtiva' : ''}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={colunas.length} className="mensagemTabelaContatosModal">
                      {mensagemVazio}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
