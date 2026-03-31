import { ModalCadastroConfiguracao } from './modalCadastroConfiguracao';

export function ModalMarcas({
  aberto,
  registros,
  somenteConsulta = false,
  fecharAoSalvar = false,
  aoFechar,
  aoSalvar,
  aoInativar,
  aoSelecionarMarca
}) {
  async function tratarSalvarConcluido(registroSalvo) {
    if (typeof aoSelecionarMarca === 'function' && registroSalvo?.idMarca) {
      await aoSelecionarMarca(registroSalvo);
    }

    if (fecharAoSalvar) {
      aoFechar();
    }
  }

  return (
    <ModalCadastroConfiguracao
      aberto={aberto}
      titulo="Marcas"
      rotuloIncluir="Incluir marca"
      registros={registros}
      chavePrimaria="idMarca"
      exibirConsulta={false}
      somenteConsulta={somenteConsulta}
      colunas={[
        { key: 'descricao', label: 'Descricao' }
      ]}
      camposFormulario={[
        { name: 'descricao', label: 'Descricao', required: true },
        { name: 'status', label: 'Registro ativo', type: 'checkbox', defaultValue: true }
      ]}
      aoFechar={aoFechar}
      aoSalvar={aoSalvar}
      aoSalvarConcluido={tratarSalvarConcluido}
      aoInativar={aoInativar}
    />
  );
}
