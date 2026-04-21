function BlocoInfo({ rotulo, valor, className = '' }) {
  if (!valor) {
    return null;
  }

  return (
    <div className={`documentoCotacaoPdfInfoItem ${className}`.trim()}>
      <span>{rotulo}</span>
      <strong>{valor}</strong>
    </div>
  );
}

export function DocumentoCotacaoPdf({ documento }) {
  const {
    estilo,
    empresa,
    fornecedor,
    cotacao,
    itens,
    totais,
    observacoes
  } = documento;

  return (
    <div
      className="documentoCotacaoPdf"
      style={{
        '--documento-cotacao-cor-primaria': estilo.corPrimaria,
        '--documento-cotacao-cor-secundaria': estilo.corSecundaria,
        '--documento-cotacao-cor-destaque': estilo.corDestaque
      }}
    >
      <header className="documentoCotacaoPdfHero">
        <div className="documentoCotacaoPdfHeroDecoracao documentoCotacaoPdfHeroDecoracaoPrimaria" />
        <div className="documentoCotacaoPdfHeroDecoracao documentoCotacaoPdfHeroDecoracaoSecundaria" />

        <div className="documentoCotacaoPdfHeroConteudo">
          <div className="documentoCotacaoPdfEmpresa">
            {empresa.imagem ? (
              <img
                className="documentoCotacaoPdfLogo"
                src={empresa.imagem}
                alt={`Logo de ${empresa.nome}`}
              />
            ) : (
              <div className="documentoCotacaoPdfLogoPlaceholder">
                {empresa.iniciais}
              </div>
            )}

            <div className="documentoCotacaoPdfEmpresaConteudo">
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

          <div className="documentoCotacaoPdfHeroResumo">
            <span className="documentoCotacaoPdfTituloAuxiliar">Documento comercial</span>
            <h1>Cotação</h1>
            <div className="documentoCotacaoPdfBadges">
              <span>{cotacao.codigo}</span>
              <span>{cotacao.dataInclusao}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="documentoCotacaoPdfConteudo">
        <section className="documentoCotacaoPdfSecao documentoCotacaoPdfSecaoFornecedor">
          <div className="documentoCotacaoPdfSecaoCabecalho">
            <h2>Fornecedor</h2>
          </div>

          <div className="documentoCotacaoPdfGradeInfo documentoCotacaoPdfGradeInfoFornecedor">
            <BlocoInfo rotulo="Nome" valor={fornecedor.nome} />
            <BlocoInfo rotulo="CNPJ/CPF" valor={fornecedor.documento} />
            <BlocoInfo rotulo="Contato" valor={fornecedor.contato} />
            <BlocoInfo rotulo="E-mail" valor={fornecedor.email} />
            <BlocoInfo rotulo="Endereço" valor={fornecedor.endereco} className="documentoCotacaoPdfInfoItemIntegral" />
          </div>
        </section>

        <section className="documentoCotacaoPdfSecao documentoCotacaoPdfSecaoItens">
          <div className="documentoCotacaoPdfSecaoCabecalho">
            <h2>Itens</h2>
          </div>

          <div className="documentoCotacaoPdfTabelaWrapper">
            <table className="documentoCotacaoPdfTabela">
              <colgroup>
                <col className="documentoCotacaoPdfColunaItem" />
                <col className="documentoCotacaoPdfColunaFoto" />
                <col className="documentoCotacaoPdfColunaDescricao" />
                <col className="documentoCotacaoPdfColunaQuantidade" />
                <col className="documentoCotacaoPdfColunaValorUnitario" />
                <col className="documentoCotacaoPdfColunaTotal" />
              </colgroup>
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="documentoCotacaoPdfColunaFoto">Foto</th>
                  <th>Descrição</th>
                  <th>Qtd</th>
                  <th>Valor Unitário</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item) => (
                  <tr key={item.chave}>
                    <td><span className="documentoCotacaoPdfCodigoItem">{item.codigo}</span></td>
                    <td className="documentoCotacaoPdfCelulaFoto">
                      {item.imagem ? (
                        <img
                          className="documentoCotacaoPdfImagemItem"
                          src={item.imagem}
                          alt={item.descricao}
                        />
                      ) : (
                        <div className="documentoCotacaoPdfImagemItemPlaceholder" />
                      )}
                    </td>
                    <td>
                      <div className="documentoCotacaoPdfDescricaoItem">
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

          <div className="documentoCotacaoPdfResumoFinanceiro">
            <div className="documentoCotacaoPdfResumoCard documentoCotacaoPdfResumoCardDestaque">
              <span>Total</span>
              <strong>{totais.total}</strong>
            </div>
          </div>
        </section>

        <section className="documentoCotacaoPdfSecao documentoCotacaoPdfSecaoMetadados">
          <div className="documentoCotacaoPdfSecaoCabecalho">
            <h2>Resumo da Cotação</h2>
          </div>

          <div className="documentoCotacaoPdfGradeInfo documentoCotacaoPdfGradeInfoMetadados">
            <BlocoInfo rotulo="Validade" valor={cotacao.dataValidade} />
            <BlocoInfo rotulo="Comprador" valor={cotacao.comprador} />
            <BlocoInfo rotulo="Pagamento" valor={cotacao.prazoPagamento} />
          </div>
        </section>

        <section className="documentoCotacaoPdfSecao documentoCotacaoPdfSecaoObservacoes">
          <div className="documentoCotacaoPdfSecaoCabecalho">
            <h2>Observações</h2>
          </div>

          {observacoes.length > 0 ? (
            <div className="documentoCotacaoPdfListaObservacoes">
              {observacoes.map((observacao) => (
                <article key={observacao.chave} className="documentoCotacaoPdfObservacaoCard">
                  <strong>{observacao.titulo}</strong>
                  <p>{observacao.texto}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="documentoCotacaoPdfEstadoVazio">
              Nenhuma observacao adicional informada.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
