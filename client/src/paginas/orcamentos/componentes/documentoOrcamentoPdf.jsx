function BlocoInfo({ rotulo, valor, className = '' }) {
  if (!valor) {
    return null;
  }

  return (
    <div className={`documentoOrcamentoPdfInfoItem ${className}`.trim()}>
      <span>{rotulo}</span>
      <strong>{valor}</strong>
    </div>
  );
}

export function DocumentoOrcamentoPdf({ documento }) {
  const {
    estilo,
    empresa,
    cliente,
    orcamento,
    itens,
    totais,
    observacoes
  } = documento;

  return (
    <div
      className="documentoOrcamentoPdf"
      style={{
        '--documento-orcamento-cor-primaria': estilo.corPrimaria,
        '--documento-orcamento-cor-secundaria': estilo.corSecundaria,
        '--documento-orcamento-cor-destaque': estilo.corDestaque
      }}
    >
      <header className="documentoOrcamentoPdfHero">
        <div className="documentoOrcamentoPdfHeroDecoracao documentoOrcamentoPdfHeroDecoracaoPrimaria" />
        <div className="documentoOrcamentoPdfHeroDecoracao documentoOrcamentoPdfHeroDecoracaoSecundaria" />

        <div className="documentoOrcamentoPdfHeroConteudo">
          <div className="documentoOrcamentoPdfEmpresa">
            {empresa.imagem ? (
              <img
                className="documentoOrcamentoPdfLogo"
                src={empresa.imagem}
                alt={`Logo de ${empresa.nome}`}
              />
            ) : (
              <div className="documentoOrcamentoPdfLogoPlaceholder">
                {empresa.iniciais}
              </div>
            )}

            <div className="documentoOrcamentoPdfEmpresaConteudo">
              <strong>{empresa.nome}</strong>
              {empresa.razaoSocial && empresa.razaoSocial !== empresa.nome ? (
                <span>{empresa.razaoSocial}</span>
              ) : null}
              {empresa.documento ? <span>{empresa.documento}</span> : null}
              {empresa.contatos.length > 0 ? (
                <span>{empresa.contatos.join(' | ')}</span>
              ) : null}
              {empresa.endereco ? <span>{empresa.endereco}</span> : null}
            </div>
          </div>

          <div className="documentoOrcamentoPdfHeroResumo">
            <span className="documentoOrcamentoPdfTituloAuxiliar">Documento comercial</span>
            <h1>Orçamento</h1>
            <div className="documentoOrcamentoPdfBadges">
              <span>{orcamento.codigo}</span>
              <span>{orcamento.dataInclusao}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="documentoOrcamentoPdfConteudo">
        <section className="documentoOrcamentoPdfSecao documentoOrcamentoPdfSecaoCliente">
          <div className="documentoOrcamentoPdfSecaoCabecalho">
            <h2>Cliente</h2>
          </div>

          <div className="documentoOrcamentoPdfGradeInfo documentoOrcamentoPdfGradeInfoCliente">
            <BlocoInfo rotulo="Nome" valor={cliente.nome} />
            <BlocoInfo rotulo="CNPJ/CPF" valor={cliente.documento} />
            <BlocoInfo rotulo="Contato" valor={cliente.contato} />
            <BlocoInfo rotulo="E-mail" valor={cliente.email} />
            <BlocoInfo rotulo="Endereço" valor={cliente.endereco} className="documentoOrcamentoPdfInfoItemIntegral" />
          </div>
        </section>

        <section className="documentoOrcamentoPdfSecao documentoOrcamentoPdfSecaoItens">
          <div className="documentoOrcamentoPdfSecaoCabecalho">
            <h2>Itens</h2>
          </div>

          <div className="documentoOrcamentoPdfTabelaWrapper">
            <table className="documentoOrcamentoPdfTabela">
              <colgroup>
                <col className="documentoOrcamentoPdfColunaItem" />
                <col className="documentoOrcamentoPdfColunaFoto" />
                <col className="documentoOrcamentoPdfColunaDescricao" />
                <col className="documentoOrcamentoPdfColunaQuantidade" />
                <col className="documentoOrcamentoPdfColunaValorUnitario" />
                <col className="documentoOrcamentoPdfColunaTotal" />
              </colgroup>
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="documentoOrcamentoPdfColunaFoto">Foto</th>
                  <th>Descrição</th>
                  <th>Qtd</th>
                  <th>Valor Unitário</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item) => (
                  <tr key={item.chave}>
                    <td><span className="documentoOrcamentoPdfCodigoItem">{item.codigo}</span></td>
                    <td className="documentoOrcamentoPdfCelulaFoto">
                      {item.imagem ? (
                        <img
                          className="documentoOrcamentoPdfImagemItem"
                          src={item.imagem}
                          alt={item.descricao}
                        />
                      ) : (
                        <div className="documentoOrcamentoPdfImagemItemPlaceholder" />
                      )}
                    </td>
                    <td>
                      <div className="documentoOrcamentoPdfDescricaoItem">
                        <strong>{item.descricao}</strong>
                        {item.detalhe ? <span>{item.detalhe}</span> : null}
                        {item.observacao ? <small>{item.observacao}</small> : null}
                      </div>
                    </td>
                    <td>{item.quantidade}</td>
                    <td>{item.valorUnitario}</td>
                    <td>{item.valorTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="documentoOrcamentoPdfResumoFinanceiro">
            <div className="documentoOrcamentoPdfResumoCard documentoOrcamentoPdfResumoCardDestaque">
              <span>Total</span>
              <strong>{totais.total}</strong>
            </div>
          </div>
        </section>

        <section className="documentoOrcamentoPdfSecao documentoOrcamentoPdfSecaoMetadados">
          <div className="documentoOrcamentoPdfSecaoCabecalho">
            <h2>Resumo do Orçamento</h2>
          </div>

          <div className="documentoOrcamentoPdfGradeInfo documentoOrcamentoPdfGradeInfoMetadados">
            <BlocoInfo rotulo="Validade" valor={orcamento.dataValidade} />
            <BlocoInfo rotulo="Vendedor" valor={orcamento.vendedor} />
            <BlocoInfo rotulo="Pagamento" valor={orcamento.prazoPagamento} />
          </div>
        </section>

        <section className="documentoOrcamentoPdfSecao documentoOrcamentoPdfSecaoObservacoes">
          <div className="documentoOrcamentoPdfSecaoCabecalho">
            <h2>Observações</h2>
          </div>

          {observacoes.length > 0 ? (
            <div className="documentoOrcamentoPdfListaObservacoes">
              {observacoes.map((observacao) => (
                <article key={observacao.chave} className="documentoOrcamentoPdfObservacaoCard">
                  <strong>{observacao.titulo}</strong>
                  <p>{observacao.texto}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="documentoOrcamentoPdfEstadoVazio">
              Nenhuma observacao adicional informada.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}