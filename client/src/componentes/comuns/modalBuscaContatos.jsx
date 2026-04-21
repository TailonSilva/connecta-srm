import { useEffect, useMemo, useState } from 'react';
import { incluirContato } from '../../servicos/fornecedores';
import { ModalContatoFornecedor as ModalContatoFornecedor } from '../modulos/fornecedores-modalContatoFornecedor';
import { ModalBuscaTabela } from './modalBuscaTabela';

const estadoInicialContato = {
  nome: '',
  cargo: '',
  email: '',
  telefone: '',
  whatsapp: '',
  status: true,
  principal: false
};

export function ModalBuscaContatos({
  aberto,
  idFornecedor = '',
  contatos = [],
  placeholder = 'Pesquisar contatos',
  ariaLabelPesquisa = 'Pesquisar contatos',
  aoCriarContato = null,
  aoSelecionar,
  aoFechar
}) {
  const [contatosCriadosLocalmente, definirContatosCriadosLocalmente] = useState([]);
  const [modalContatoAberto, definirModalContatoAberto] = useState(false);
  const [formularioContato, definirFormularioContato] = useState(estadoInicialContato);
  const contatosLocais = useMemo(
    () => combinarContatosUnicos(contatos, contatosCriadosLocalmente),
    [contatos, contatosCriadosLocalmente]
  );

  useEffect(() => {
    definirContatosCriadosLocalmente([]);
  }, [idFornecedor]);

  function abrirModalNovoContato() {
    if (!idFornecedor) {
      return;
    }

    definirFormularioContato(estadoInicialContato);
    definirModalContatoAberto(true);
  }

  function fecharModalNovoContato() {
    definirFormularioContato(estadoInicialContato);
    definirModalContatoAberto(false);
  }

  function alterarCampoContato(evento) {
    const { name, value, type, checked } = evento.target;

    definirFormularioContato((estadoAtual) => ({
      ...estadoAtual,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  async function salvarNovoContato() {
    if (!String(formularioContato.nome || '').trim()) {
      return;
    }

    const contatoCriado = await incluirContato({
      ...formularioContato,
      idFornecedor: Number(idFornecedor),
      status: formularioContato.status ? 1 : 0,
      principal: formularioContato.principal ? 1 : 0
    });

    const contatoNormalizado = {
      ...formularioContato,
      ...contatoCriado,
      idContato: contatoCriado?.idContato || contatoCriado?.id || null,
      idFornecedor: Number(idFornecedor),
      status: contatoCriado?.status ?? (formularioContato.status ? 1 : 0),
      principal: contatoCriado?.principal ?? (formularioContato.principal ? 1 : 0)
    };

    definirContatosCriadosLocalmente((estadoAtual) => {
      const listaAtual = Array.isArray(estadoAtual) ? estadoAtual : [];
      return combinarContatosUnicos(listaAtual, [contatoNormalizado]);
    });

    if (typeof aoCriarContato === 'function') {
      aoCriarContato(contatoNormalizado);
    }

    fecharModalNovoContato();

    if (contatoNormalizado?.idContato) {
      aoSelecionar(contatoNormalizado);
    }
  }

  return (
    <>
      <ModalBuscaTabela
        aberto={aberto}
        titulo="Buscar contato"
        placeholder={placeholder}
        ariaLabelPesquisa={ariaLabelPesquisa}
        colunas={[
          { key: 'nome', label: 'Contato', render: (contato) => contato.nome || '-' },
          { key: 'cargo', label: 'Cargo', render: (contato) => contato.cargo || '-' },
          { key: 'email', label: 'E-mail', render: (contato) => contato.email || '-' },
          {
            key: 'telefone',
            label: 'Telefone',
            render: (contato) => contato.whatsapp || contato.telefone || '-'
          }
        ]}
        registros={contatosLocais}
        obterTextoBusca={(contato) => [
          contato.nome,
          contato.cargo,
          contato.email,
          contato.telefone,
          contato.whatsapp
        ].join(' ')}
        obterChaveRegistro={(contato) => contato.idContato}
        aoSelecionar={aoSelecionar}
        aoFechar={aoFechar}
        rotuloAcaoPrimaria={idFornecedor ? 'Adicionar' : ''}
        tituloAcaoPrimaria="Adicionar contato"
        aoAcionarPrimaria={idFornecedor ? abrirModalNovoContato : null}
        mensagemVazio="Nenhum contato encontrado."
      />

      <ModalContatoFornecedor
        aberto={modalContatoAberto}
        modo="novo"
        formulario={formularioContato}
        aoAlterarCampo={alterarCampoContato}
        aoFechar={fecharModalNovoContato}
        aoSalvar={salvarNovoContato}
      />
    </>
  );
}

function combinarContatosUnicos(contatosBase, contatosExtras) {
  const mapa = new Map();

  [...(Array.isArray(contatosBase) ? contatosBase : []), ...(Array.isArray(contatosExtras) ? contatosExtras : [])]
    .forEach((contato) => {
      const idContato = contato?.idContato || contato?.id;

      if (!idContato) {
        return;
      }

      mapa.set(String(idContato), {
        ...contato,
        idContato
      });
    });

  return Array.from(mapa.values());
}
