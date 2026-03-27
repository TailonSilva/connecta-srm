export function GradePadrao({
  cabecalho,
  children,
  carregando = false,
  mensagemErro = '',
  temItens = false,
  mensagemCarregando = 'Carregando registros...',
  mensagemVazia = 'Nenhum registro encontrado.'
}) {
  return (
    <section className="gradePadrao">
      {cabecalho}

      <div className="corpoGradePadrao">
        <div className="listaGradePadrao">
          {carregando ? (
            <p className="mensagemGradePadrao">{mensagemCarregando}</p>
          ) : null}

          {!carregando && mensagemErro ? (
            <p className="mensagemGradePadrao mensagemGradePadraoErro">{mensagemErro}</p>
          ) : null}

          {!carregando && !mensagemErro && !temItens ? (
            <p className="mensagemGradePadrao">{mensagemVazia}</p>
          ) : null}

          {!carregando && !mensagemErro && temItens ? children : null}
        </div>
      </div>
    </section>
  );
}
