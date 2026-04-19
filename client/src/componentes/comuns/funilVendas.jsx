import { useEffect, useRef, useState } from 'react';
import '../../recursos/estilos/funilVendas.css';
import { FunilVendasCabecalho } from './funilVendasCabecalho';
import { FunilVendasGrafico } from './funilVendasGrafico';
import { FunilVendasCardDetalhe } from './funilVendasCardDetalhe';
import { MensagemErroPopup } from './mensagemErroPopup';

export function FunilVendas({ etapas = [], carregando = false, mensagemErro = '' }) {
  const totalOrcamentos = etapas.reduce((total, etapa) => total + (Number(etapa.quantidadeOrcamentos) || 0), 0);
  const totalValor = etapas.reduce((total, etapa) => total + (Number(etapa.valorTotal) || 0), 0);
  const [idEtapaSelecionada, definirIdEtapaSelecionada] = useState(etapas[0]?.idEtapaOrcamento || null);
  const referenciaCardDetalhe = useRef(null);
  const [alturaMaximaGrafico, definirAlturaMaximaGrafico] = useState(null);

  useEffect(() => {
    if (!etapas.length) {
      definirIdEtapaSelecionada(null);
      return;
    }

    const etapaSelecionadaExiste = etapas.some((etapa) => etapa.idEtapaOrcamento === idEtapaSelecionada);

    if (!etapaSelecionadaExiste) {
      definirIdEtapaSelecionada(etapas[0].idEtapaOrcamento);
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

  const etapaSelecionada = etapas.find((etapa) => etapa.idEtapaOrcamento === idEtapaSelecionada) || etapas[0] || null;
  const indiceSelecionado = etapaSelecionada
    ? etapas.findIndex((etapa) => etapa.idEtapaOrcamento === etapaSelecionada.idEtapaOrcamento)
    : 0;
  const participacaoValor = totalValor > 0 && etapaSelecionada
    ? Math.round((Number(etapaSelecionada.valorTotal || 0) / totalValor) * 100)
    : 0;
  const ticketMedio = etapaSelecionada?.quantidadeOrcamentos
    ? Number(etapaSelecionada.valorTotal || 0) / Number(etapaSelecionada.quantidadeOrcamentos || 1)
    : 0;

  if (carregando) {
    return (
      <section className="funilVendasPainel funilVendasPainelCarregando" aria-label="Funil de vendas">
        <header className="funilVendasCabecalho">
          <div>
            <span className="funilVendasCabecalhoRotulo">Funil de vendas</span>
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
        <section className="funilVendasPainel" aria-label="Funil de vendas">
          <header className="funilVendasCabecalho">
            <div>
              <span className="funilVendasCabecalhoRotulo">Funil de vendas</span>
              <h2>Visao Por Etapa Do Cotacao</h2>
            </div>
          </header>
          <p className="funilVendasMensagem">{mensagemErro}</p>
        </section>
      </>
    );
  }

  if (etapas.length === 0) {
    return (
      <section className="funilVendasPainel" aria-label="Funil de vendas">
        <header className="funilVendasCabecalho">
          <div>
            <span className="funilVendasCabecalhoRotulo">Funil de vendas</span>
            <h2>Visao Por Etapa Do Cotacao</h2>
          </div>
        </header>
        <p className="funilVendasMensagem">
          Nenhuma etapa de orcamento marcada para funil foi encontrada.
        </p>
      </section>
    );
  }

  return (
    <section className="funilVendasPainel" aria-label="Funil de vendas">
      <FunilVendasCabecalho
        totalOrcamentos={totalOrcamentos}
        totalValor={totalValor}
      />

      <div className="funilVendasLayout">
        <FunilVendasGrafico
          etapas={etapas}
          totalValor={totalValor}
          idEtapaSelecionada={etapaSelecionada?.idEtapaOrcamento}
          aoSelecionarEtapa={definirIdEtapaSelecionada}
          alturaMaxima={alturaMaximaGrafico}
        />

        {etapaSelecionada ? (
          <FunilVendasCardDetalhe
            key={etapaSelecionada.idEtapaOrcamento}
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
