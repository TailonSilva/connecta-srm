import { useEffect, useState } from 'react';
import { Botao } from '../comuns/botao';
import '../../recursos/estilos/barraLateral.css';
import { listarEmpresas } from '../../servicos/empresa';
import { BotaoMenu } from './botaoMenu';

function IconeMenu({ tipo }) {
  const icones = {
    inicio: (
      <path d="M4 11.5 12 5l8 6.5V20h-5.5v-5h-5v5H4z" />
    ),
    agenda: (
      <path d="M7 3.5V6m10-2.5V6M5.5 8.5h13M6.5 5h11A1.5 1.5 0 0 1 19 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5v-11A1.5 1.5 0 0 1 6.5 5Zm1.5 6h3v3H8Z" />
    ),
    atendimentos: (
      <path d="M7 5.5h10A1.5 1.5 0 0 1 18.5 7v12L15 16.5H7A1.5 1.5 0 0 1 5.5 15V7A1.5 1.5 0 0 1 7 5.5Zm2.5 3h5m-5 3h6m-6 3h3" />
    ),
    clientes: (
      <path d="M12 12.5a4.25 4.25 0 1 0-4.25-4.25A4.25 4.25 0 0 0 12 12.5Zm0 2c-4.7 0-8.5 2.35-8.5 5.25V21h17v-1.25c0-2.9-3.8-5.25-8.5-5.25Z" />
    ),
    produtos: (
      <path d="M4.5 7.5 12 4l7.5 3.5L12 11 4.5 7.5Zm0 3.5L11 14v6L4.5 17Zm15 0V17L13 20v-6Z" />
    ),
    cotacoes: (
      <path d="M6.5 4h8l4 4v10.5A1.5 1.5 0 0 1 17 20h-10A1.5 1.5 0 0 1 5.5 18.5v-13A1.5 1.5 0 0 1 7 4Zm7.5 1.5V9h3.5M8 12h8m-8 3h8" />
    ),
    pedidos: (
      <path d="M7 5h10l1.5 4.5-2 8.5H7.5L5.5 9.5Zm2 15a1.5 1.5 0 1 0 0 .01Zm7 0a1.5 1.5 0 1 0 0 .01ZM8.5 8.5h7" />
    ),
    configuracoes: (
      <path d="m12 4 1.32 2.18 2.48.57-.84 2.4 1.69 1.9-1.69 1.9.84 2.4-2.48.57L12 20l-1.32-2.18-2.48-.57.84-2.4-1.69-1.9 1.69-1.9-.84-2.4 2.48-.57Z M12 9a3 3 0 1 0 3 3 3 3 0 0 0-3-3Z" />
    )
  };
  const aliases = {
    cotacao: 'cotacoes',
    orcamento: 'cotacoes',
    orcamentos: 'cotacoes',
    pedido: 'pedidos',
    ordemCompra: 'pedidos',
    ordensCompra: 'pedidos'
  };
  const icone = icones[tipo] || icones[aliases[tipo]];

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icone}
    </svg>
  );
}

export function BarraLateral({
  itens,
  paginaAtiva,
  usuarioLogado,
  aoSelecionarPagina,
  aoSair
}) {
  const [empresa, definirEmpresa] = useState(null);

  useEffect(() => {
    carregarEmpresa();

    function tratarEmpresaAtualizada() {
      carregarEmpresa();
    }

    window.addEventListener('empresa-atualizada', tratarEmpresaAtualizada);

    return () => {
      window.removeEventListener('empresa-atualizada', tratarEmpresaAtualizada);
    };
  }, []);

  async function carregarEmpresa() {
    try {
      const empresas = await listarEmpresas();
      definirEmpresa(empresas[0] || null);
    } catch (_erro) {
      definirEmpresa(null);
    }
  }

  return (
    <aside className="barraLateral">
      <div className="marcaLateral">
        <div className="logoLateral" aria-hidden="true">
          {empresa?.imagem ? (
            <img
              className="logoLateralImagem"
              src={empresa.imagem}
              alt={empresa.nomeFantasia || empresa.razaoSocial || 'Empresa'}
            />
          ) : (
            <span className="logoLateralSimbolo" />
          )}
        </div>
        <div className="textoMarcaLateral">
          <strong>{empresa?.nomeFantasia || empresa?.razaoSocial || 'Nome da Empresa'}</strong>
          <p>{empresa?.slogan || 'Gestao simples para vendas inteligentes'}</p>
        </div>
      </div>

      <nav className="navegacaoLateral" aria-label="Menu principal">
        {itens.map((item) => (
          <BotaoMenu
            key={item.id}
            ativo={paginaAtiva === item.id}
            onClick={() => aoSelecionarPagina(item.id)}
          >
            <IconeMenu tipo={item.icone} />
            <span>{item.rotulo}</span>
          </BotaoMenu>
        ))}
      </nav>

      <div className="rodapeLateral">
        <div className="usuarioLateral">
          <div className="fotoUsuario" aria-hidden="true">
            {usuarioLogado?.imagem ? (
              <img
                className="fotoUsuarioImagem"
                src={usuarioLogado.imagem}
                alt={usuarioLogado.nome || 'Usuario'}
              />
            ) : (
              <span />
            )}
          </div>

          <div className="dadosUsuario">
            <strong>{usuarioLogado?.nome || 'Usuario'}</strong>
            <p>{usuarioLogado?.tipo || 'Sem perfil'}</p>
          </div>
        </div>

        <Botao variante="complementar" className="barraLateralBotaoSair" icone="sair" onClick={aoSair}>
          Sair
        </Botao>
      </div>
    </aside>
  );
}
