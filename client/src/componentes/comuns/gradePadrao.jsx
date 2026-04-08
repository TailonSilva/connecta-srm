import { MensagemErroPopup } from './mensagemErroPopup';

export function GradePadrao({
  className = '',
  classNameCorpo = '',
  classNameTabela = '',
  classNameCabecalho = '',
  classNameMensagem = '',
  modo = 'tabela',
  totalColunasLayout = 1,
  cabecalho,
  colGroup = null,
  children,
  carregando = false,
  mensagemErro = '',
  temItens = false,
  mensagemCarregando = 'Carregando registros...',
  mensagemVazia = 'Nenhum registro encontrado.'
}) {
  const classeGrade = ['gradePadrao', className].filter(Boolean).join(' ');
  const classeCorpo = ['corpoGradePadrao', classNameCorpo].filter(Boolean).join(' ');
  const classeTabela = ['tabelaGradePadrao', classNameTabela].filter(Boolean).join(' ');
  const classeCabecalho = ['cabecaTabelaGradePadrao', classNameCabecalho].filter(Boolean).join(' ');
  const classeMensagem = ['mensagemGradePadrao', classNameMensagem].filter(Boolean).join(' ');
  const classeMensagemErro = [classeMensagem, 'mensagemGradePadraoErro'].filter(Boolean).join(' ');
  const estiloLayout = modo === 'layout'
    ? { '--grade-padrao-total-colunas': totalColunasLayout }
    : undefined;

  if (modo === 'layout') {
    return (
      <>
        <MensagemErroPopup mensagem={!carregando ? mensagemErro : ''} />
        <section className={classeGrade}>
          <div className={classeCorpo}>
            <div className={['layoutGradePadrao', classNameTabela].filter(Boolean).join(' ')} style={estiloLayout}>
              {cabecalho ? (
                <div className={['cabecaLayoutGradePadrao', classNameCabecalho].filter(Boolean).join(' ')}>
                  {cabecalho}
                </div>
              ) : null}

              <div className="corpoLayoutGradePadrao">
                {carregando ? (
                  <p className={classeMensagem}>{mensagemCarregando}</p>
                ) : null}

                {!carregando && mensagemErro ? (
                  <p className={classeMensagemErro}>{mensagemErro}</p>
                ) : null}

                {!carregando && !mensagemErro && !temItens ? (
                  <p className={classeMensagem}>{mensagemVazia}</p>
                ) : null}

                {!carregando && !mensagemErro && temItens ? children : null}
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <MensagemErroPopup mensagem={!carregando ? mensagemErro : ''} />
      <section className={classeGrade}>
        <div className={classeCorpo}>
          <table className={classeTabela}>
            {colGroup}

            <thead className={classeCabecalho}>
              {cabecalho}
            </thead>

            <tbody className="corpoTabelaGradePadrao">
              {carregando ? (
                <tr>
                  <td className={classeMensagem} colSpan={99}>{mensagemCarregando}</td>
                </tr>
              ) : null}

              {!carregando && mensagemErro ? (
                <tr>
                  <td className={classeMensagemErro} colSpan={99}>
                    {mensagemErro}
                  </td>
                </tr>
              ) : null}

              {!carregando && !mensagemErro && !temItens ? (
                <tr>
                  <td className={classeMensagem} colSpan={99}>{mensagemVazia}</td>
                </tr>
              ) : null}

              {!carregando && !mensagemErro && temItens ? children : null}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
