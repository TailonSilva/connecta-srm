import { useEffect, useRef, useState } from 'react';
import '../../recursos/estilos/funilCotacoes.css';
import { FunilCotacoesCabecalho } from './funilCotacoesCabecalho';
import { FunilCotacoesGrafico } from './funilCotacoesGrafico';
import { FunilCotacoesCardDetalhe } from './funilCotacoesCardDetalhe';
import { MensagemErroPopup } from './mensagemErroPopup';

export function FunilCotacoes({ etapas = [], carregando = false, mensagemErro = '' }) {
  const totalCotacoes = etapas.reduce((total, etapa) => total + (Number(etapa.quantidadeCotacoes) || 0), 0);
  const totalValor = etapas.reduce((total, etapa) => total + (Number(etapa.valorTotal) || 0), 0);
  const [idEtapaSelecionada, definirIdEtapaSelecionada] = useState(etapas[0]?.idEtapaCotacao || null);
  const referenciaCardDetalhe = useRef(null);
  const [alturaMaximaGrafico, definirAlturaMaximaGrafico] = useState(null);

  useEffect(() => {
    if (!etapas.length) {
      definirIdEtapaSelecionada(null);
      return;
    }

    const etapaSelecionadaExiste = etapas.some((etapa) => etapa.idEtapaCotacao === idEtapaSelecionada);

    if (!etapaSelecionadaExiste) {
      definirIdEtapaSelecionada(etapas[0].idEtapaCotacao);
    }
  }, [etapas, idEtapaSelecionada]);

  useEffect(() => {
    const elementoCard = referenciaCardDetalhe.current;

    if (!elementoCard) {
      definirAlturaMaximaGrafico(null);
      return undefined;
    }

    const atualizarAltura = () => {
      definirAlturaMaximaGrafico(elementoCard.offsetHeight || null);
    };

    atualizarAltura();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', atualizarAltura);

      return () => {
        window.removeEventListener('resize', atualizarAltura);
      };
    }

    const observer = new ResizeObserver(() => {
      atualizarAltura();
    });

    observer.observe(elementoCard);
    window.addEventListener('resize', atualizarAltura);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', atualizarAltura);
    };
  }, [idEtapaSelecionada, etapas.length]);

  const etapaSelecionada = etapas.find((etapa) => etapa.idEtapaCotacao === idEtapaSelecionada) || etapas[0] || null;
  const indiceSelecionado = etapaSelecionada
    ? etapas.findIndex((etapa) => etapa.idEtapaCotacao === etapaSelecionada.idEtapaCotacao)
    : 0;
  const participacaoValor = totalValor > 0 && etapaSelecionada
    ? Math.round((Number(etapaSelecionada.valorTotal || 0) / totalValor) * 100)
    : 0;
  const ticketMedio = etapaSelecionada?.quantidadeCotacoes
    ? Number(etapaSelecionada.valorTotal || 0) / Number(etapaSelecionada.quantidadeCotacoes || 1)
    : 0;

  if (carregando) {
    return (
      <section className="funilCotacoesPainel funilCotacoesPainelCarregando" aria-label="Funil de ordensCompra">
        <header className="funilCotacoesCabecalho">
          <div>
            <span className="funilCotacoesCabecalhoRotulo">Funil de ordensCompra</span>
            <h2>Carregando funil...</h2>
          </div>
        </header>
      </section>
    );
  }

  if (mensagemErro) {
    return (
      <>
        <MensagemErroPopup mensagem={mensagemErro} />
        <section className="funilCotacoesPainel" aria-label="Funil de ordensCompra">
          <header className="funilCotacoesCabecalho">
            <div>
              <span className="funilCotacoesCabecalhoRotulo">Funil de ordensCompra</span>
              <h2>Visao Por Etapa Do Cotacao</h2>
            </div>
          </header>
          <p className="funilCotacoesMensagem">{mensagemErro}</p>
        </section>
      </>
    );
  }

  if (etapas.length === 0) {
    return (
      <section className="funilCotacoesPainel" aria-label="Funil de ordensCompra">
        <header className="funilCotacoesCabecalho">
          <div>
            <span className="funilCotacoesCabecalhoRotulo">Funil de ordensCompra</span>
            <h2>Visao Por Etapa Do Cotacao</h2>
          </div>
        </header>
        <p className="funilCotacoesMensagem">
          Nenhuma etapa de cotacao marcada para funil foi encontrada.
        </p>
      </section>
    );
  }

  return (
    <section className="funilCotacoesPainel" aria-label="Funil de ordensCompra">
      <FunilCotacoesCabecalho
        totalCotacoes={totalCotacoes}
        totalValor={totalValor}
      />

      <div className="funilCotacoesLayout">
        <FunilCotacoesGrafico
          etapas={etapas}
          totalValor={totalValor}
          idEtapaSelecionada={etapaSelecionada?.idEtapaCotacao}
          aoSelecionarEtapa={definirIdEtapaSelecionada}
          alturaMaxima={alturaMaximaGrafico}
        />

        {etapaSelecionada ? (
          <FunilCotacoesCardDetalhe
            key={etapaSelecionada.idEtapaCotacao}
            referencia={referenciaCardDetalhe}
            etapaSelecionada={etapaSelecionada}
            indiceSelecionado={indiceSelecionado}
            participacaoValor={participacaoValor}
            ticketMedio={ticketMedio}
          />
        ) : null}
      </div>
    </section>
  );
}
