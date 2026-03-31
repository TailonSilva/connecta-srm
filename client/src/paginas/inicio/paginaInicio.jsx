import { useEffect, useState } from 'react';
import { CorpoPagina } from '../../componentes/layout/corpoPagina';
import { Icone } from '../../componentes/comuns/icone';
import { listarClientes } from '../../servicos/clientes';
import { listarProdutos } from '../../servicos/produtos';

export function PaginaInicio() {
  const [totalClientes, definirTotalClientes] = useState(0);
  const [totalProdutos, definirTotalProdutos] = useState(0);
  const [carregando, definirCarregando] = useState(true);
  const [mensagemErro, definirMensagemErro] = useState('');

  useEffect(() => {
    let cancelado = false;

    async function carregarIndicadores() {
      definirCarregando(true);
      definirMensagemErro('');

      try {
        const [clientes, produtos] = await Promise.all([
          listarClientes(),
          listarProdutos()
        ]);

        if (cancelado) {
          return;
        }

        definirTotalClientes(Array.isArray(clientes) ? clientes.length : 0);
        definirTotalProdutos(Array.isArray(produtos) ? produtos.length : 0);
      } catch (_erro) {
        if (!cancelado) {
          definirMensagemErro('Nao foi possivel carregar os indicadores da pagina inicial.');
        }
      } finally {
        if (!cancelado) {
          definirCarregando(false);
        }
      }
    }

    carregarIndicadores();

    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <>
      <header className="cabecalhoPagina">
        <div>
          <h1>Painel inicial</h1>
          <p>Visao rapida dos indicadores principais do CRM.</p>
        </div>
      </header>

      <CorpoPagina>
        <div className="gradeInicio">
          <section className="cartaoIndicadorInicio" aria-label="Total de clientes cadastrados">
            <div className="cabecalhoIndicadorInicio">
              <span className="iconeIndicadorInicio" aria-hidden="true">
                <Icone nome="contato" />
              </span>
              <div>
                <span className="rotuloIndicadorInicio">Clientes cadastrados</span>
                <strong className="valorIndicadorInicio">
                  {carregando ? '...' : totalClientes.toLocaleString('pt-BR')}
                </strong>
              </div>
            </div>

            <p className="descricaoIndicadorInicio">
              {mensagemErro || 'Quantidade total de clientes registrados no sistema.'}
            </p>
          </section>

          <section className="cartaoIndicadorInicio" aria-label="Total de produtos cadastrados">
            <div className="cabecalhoIndicadorInicio">
              <span className="iconeIndicadorInicio" aria-hidden="true">
                <Icone nome="caixa" />
              </span>
              <div>
                <span className="rotuloIndicadorInicio">Produtos cadastrados</span>
                <strong className="valorIndicadorInicio">
                  {carregando ? '...' : totalProdutos.toLocaleString('pt-BR')}
                </strong>
              </div>
            </div>

            <p className="descricaoIndicadorInicio">
              {mensagemErro || 'Quantidade total de produtos registrados no sistema.'}
            </p>
          </section>
        </div>
      </CorpoPagina>
    </>
  );
}
