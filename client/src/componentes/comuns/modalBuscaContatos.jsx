import { ModalBuscaTabela } from './modalBuscaTabela';

export function ModalBuscaContatos({
  aberto,
  contatos = [],
  placeholder = 'Pesquisar contatos',
  ariaLabelPesquisa = 'Pesquisar contatos',
  aoSelecionar,
  aoFechar
}) {
  return (
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
      registros={contatos}
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
      mensagemVazio="Nenhum contato encontrado."
    />
  );
}
