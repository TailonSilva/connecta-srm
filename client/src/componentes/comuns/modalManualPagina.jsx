import { useEffect } from 'react';
import { Botao } from './botao';
import { Icone } from './icone';

export function ModalManualPagina({
  aberto,
  aoFechar,
  titulo,
  descricao,
  eyebrow,
  heroTitulo,
  heroDescricao,
  painelHeroi = [],
  cardsResumo = [],
  cardsFluxo = [],
  blocosTexto = [],
  secoesExtras = null,
  cardsRegras = []
}) {
  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function tratarTecla(evento) {
      if (evento.key === 'Escape') {
        aoFechar();
      }
    }

    window.addEventListener('keydown', tratarTecla);

    return () => {
      window.removeEventListener('keydown', tratarTecla);
    };
  }, [aberto, aoFechar]);

  if (!aberto) {
    return null;
  }

  return (
    <div className="camadaModalContato" role="presentation" onMouseDown={aoFechar}>
      <div
        className="modalContatoCliente modalManualPagina"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModalManualPagina"
        onMouseDown={(evento) => evento.stopPropagation()}
      >
        <div className="cabecalhoModalContato modalManualPaginaCabecalho">
          <div className="modalManualPaginaCabecalhoTitulo">
            <span className="modalManualPaginaSelo" aria-hidden="true">
              <Icone nome="manual" />
            </span>
            <div>
              <h3 id="tituloModalManualPagina">{titulo}</h3>
              <p>{descricao}</p>
            </div>
          </div>

          <div className="acoesFormularioContatoModal">
            <Botao
              variante="secundario"
              type="button"
              icone="fechar"
              somenteIcone
              title="Fechar manual"
              aria-label="Fechar manual"
              onClick={aoFechar}
            >
              Fechar manual
            </Botao>
          </div>
        </div>

        <div className="corpoModalContato modalManualPaginaCorpo">
          <section className="modalManualPaginaHero">
            <div className="modalManualPaginaHeroConteudo">
              <span className="modalManualPaginaEyebrow">{eyebrow}</span>
              <h4>{heroTitulo}</h4>
              <p>{heroDescricao}</p>
            </div>

            {painelHeroi.length > 0 ? (
              <div className="modalManualPaginaHeroPainel">
                {painelHeroi.map((item) => (
                  <div key={`${item.rotulo}-${item.valor}`}>
                    <strong>{item.valor}</strong>
                    <span>{item.rotulo}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          {cardsResumo.length > 0 ? (
            <section className="modalManualPaginaSecao">
              <div className="modalManualPaginaSecaoCabecalho">
                <span className="modalManualPaginaTag">Resumo</span>
                <h4>Panorama operacional da tela</h4>
              </div>

              <div className="modalManualPaginaGradeResumo">
                {cardsResumo.map((card) => (
                  <article key={card.titulo} className="modalManualPaginaCardResumo">
                    <span className="modalManualPaginaCardIcone" aria-hidden="true">
                      <Icone nome={card.icone} />
                    </span>
                    <strong>{card.titulo}</strong>
                    <p>{card.descricao}</p>
                    {card.detalhe ? <small>{card.detalhe}</small> : null}
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {cardsFluxo.length > 0 ? (
            <section className="modalManualPaginaSecao">
              <div className="modalManualPaginaSecaoCabecalho">
                <span className="modalManualPaginaTag">Fluxo</span>
                <h4>Como operar a pagina</h4>
              </div>

              <div className="modalManualPaginaGradeFluxo">
                {cardsFluxo.map((card) => (
                  <article key={card.titulo} className="modalManualPaginaCardFluxo">
                    <span className="modalManualPaginaCardIcone" aria-hidden="true">
                      <Icone nome={card.icone} />
                    </span>
                    <div>
                      <strong>{card.titulo}</strong>
                      <p>{card.descricao}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {blocosTexto.length > 0 ? (
            <section className="modalManualPaginaSecao modalManualPaginaSecaoDupla">
              {blocosTexto.map((bloco) => (
                <div key={bloco.titulo} className="modalManualPaginaPainelLista">
                  <div className="modalManualPaginaSecaoCabecalho">
                    <span className="modalManualPaginaTag">{bloco.tag}</span>
                    <h4>{bloco.titulo}</h4>
                  </div>

                  <ul className="modalManualPaginaListaTexto">
                    {bloco.itens.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ) : null}

          {secoesExtras}

          {cardsRegras.length > 0 ? (
            <section className="modalManualPaginaSecao">
              <div className="modalManualPaginaSecaoCabecalho">
                <span className="modalManualPaginaTag">Logica</span>
                <h4>Regras e comportamentos automaticos</h4>
              </div>

              <div className="modalManualPaginaGradeResumo">
                {cardsRegras.map((card) => (
                  <article key={card.titulo} className="modalManualPaginaCardResumo modalManualPaginaCardRegra">
                    <span className="modalManualPaginaCardIcone" aria-hidden="true">
                      <Icone nome={card.icone} />
                    </span>
                    <strong>{card.titulo}</strong>
                    <p>{card.descricao}</p>
                    {card.detalhe ? <small>{card.detalhe}</small> : null}
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}