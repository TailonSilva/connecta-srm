import { useEffect, useMemo, useState } from 'react';
import { Botao } from '../comuns/botao';
import { CampoSelecaoMultiplaModal } from '../comuns/campoSelecaoMultiplaModal';
import { CampoImagemPadrao } from '../comuns/campoImagemPadrao';
import { buscarCep } from '../../servicos/empresa';
import { normalizarTelefone } from '../../utilitarios/normalizarTelefone';
import { normalizarValorEntradaFormulario } from '../../utilitarios/normalizarTextoFormulario';

const abasModalEmpresa = [
  { id: 'dadosGerais', label: 'Dados gerais' },
  { id: 'paginaInicial', label: 'Pagina inicial' },
  { id: 'endereco', label: 'Endereco' },
  { id: 'agenda', label: 'Agenda' },
  { id: 'cotacoesOrdensCompra', label: 'Cotacoes/Ordens de Compra' },
  { id: 'email', label: 'E-mail' }
];

const estadoInicialFormulario = {
  razaoSocial: '',
  nomeFantasia: '',
  slogan: '',
  tipo: 'Pessoa juridica',
  cnpj: '',
  inscricaoEstadual: '',
  email: '',
  telefone: '',
  horaInicioManha: '08:00',
  horaFimManha: '12:00',
  horaInicioTarde: '13:00',
  horaFimTarde: '18:00',
  trabalhaSabado: false,
  horaInicioSabado: '08:00',
  horaFimSabado: '12:00',
  exibirFunilPaginaInicial: true,
  diasValidadeCotacao: '7',
  diasEntregaOrdemCompra: '7',
  codigoPrincipalFornecedor: 'codigo',
  etapasFiltroPadraoCotacao: [],
  corPrimariaCotacao: '#111827',
  corSecundariaCotacao: '#ef4444',
  corDestaqueCotacao: '#f59e0b',
  destaqueItemCotacaoPdf: 'descricao',
  assuntoEmailCotacao: 'Cotacao {cotacao_codigo} - {fornecedor_nome}',
  corpoEmailCotacao: 'Olá {fornecedor_nome},\n\nSegue a cotacao {cotacao_codigo} com validade até {cotacao_validade}.\n\n{cotacao_itens}\n\nTotal da cotacao: {cotacao_total}\n\nFico à disposição para qualquer ajuste.\n\nAtenciosamente,',
  assinaturaEmailCotacao: '{comprador_nome}\n{empresa_nome}',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  imagem: ''
};

export function ModalEmpresa({
  aberto,
  empresa,
  etapasCotacao = [],
  modo = 'edicao',
  aoFechar,
  aoSalvar
}) {
  const [formulario, definirFormulario] = useState(estadoInicialFormulario);
  const [abaAtiva, definirAbaAtiva] = useState(abasModalEmpresa[0].id);
  const [salvando, definirSalvando] = useState(false);
  const [mensagemErro, definirMensagemErro] = useState('');
  const [buscandoCep, definirBuscandoCep] = useState(false);
  const somenteLeitura = modo === 'consulta';
  const tipoPessoaFisica = formulario.tipo === 'Pessoa fisica';
  const rotuloDocumento = tipoPessoaFisica ? 'CPF' : 'CNPJ';
  const etapasCotacaoAtivasOrdenadas = useMemo(
    () => [...etapasCotacao]
      .filter((etapa) => etapa.status !== 0)
      .sort((etapaA, etapaB) => {
        const ordemA = Number(etapaA?.ordem || etapaA?.idEtapaCotacao || 0);
        const ordemB = Number(etapaB?.ordem || etapaB?.idEtapaCotacao || 0);

        if (ordemA !== ordemB) {
          return ordemA - ordemB;
        }

        return Number(etapaA?.idEtapaCotacao || 0) - Number(etapaB?.idEtapaCotacao || 0);
      }),
    [etapasCotacao]
  );

  useEffect(() => {
    if (!aberto) {
      return;
    }

    definirFormulario(criarFormularioEmpresa(empresa));
    definirAbaAtiva(abasModalEmpresa[0].id);
    definirSalvando(false);
    definirMensagemErro('');
    definirBuscandoCep(false);
  }, [aberto]);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function tratarTecla(evento) {
      if (evento.key === 'Escape' && !salvando) {
        aoFechar();
      }
    }

    window.addEventListener('keydown', tratarTecla);

    return () => {
      window.removeEventListener('keydown', tratarTecla);
    };
  }, [aberto, aoFechar, salvando]);

  if (!aberto) {
    return null;
  }

  async function submeterFormulario(evento) {
    evento.preventDefault();

    if (somenteLeitura) {
      return;
    }

    const camposObrigatorios = [
      ['razaoSocial', 'Informe a razao social.'],
      ['nomeFantasia', 'Informe o nome fantasia.'],
      ['tipo', 'Informe o tipo da empresa.'],
      ['cnpj', `Informe o ${rotuloDocumento}.`]
    ];

    const mensagemValidacao = camposObrigatorios.find(([campo]) => {
      const valor = formulario[campo];
      return valor === '' || valor === null || valor === undefined;
    });

    if (mensagemValidacao) {
      definirMensagemErro(mensagemValidacao[1]);
      return;
    }

    if (
      formulario.horaInicioManha &&
      formulario.horaFimManha &&
      formulario.horaFimManha <= formulario.horaInicioManha
    ) {
      definirMensagemErro('O fim do expediente da manha deve ser maior que o inicio.');
      return;
    }

    if (
      formulario.horaInicioTarde &&
      formulario.horaFimTarde &&
      formulario.horaFimTarde <= formulario.horaInicioTarde
    ) {
      definirMensagemErro('O fim do expediente da tarde deve ser maior que o inicio.');
      return;
    }

    if (
      formulario.horaFimManha &&
      formulario.horaInicioTarde &&
      formulario.horaInicioTarde <= formulario.horaFimManha
    ) {
      definirMensagemErro('O inicio da tarde deve ser maior que o fim da manha.');
      return;
    }

    if (formulario.trabalhaSabado) {
      if (!formulario.horaInicioSabado || !formulario.horaFimSabado) {
        definirMensagemErro('Informe o horario de expediente do sabado.');
        return;
      }

      if (formulario.horaFimSabado <= formulario.horaInicioSabado) {
        definirMensagemErro('O fim do expediente de sabado deve ser maior que o inicio.');
        return;
      }
    }

    definirSalvando(true);
    definirMensagemErro('');

    try {
      await aoSalvar(formulario);
    } catch (erro) {
      definirMensagemErro(erro.message || 'Nao foi possivel salvar a empresa.');
      definirSalvando(false);
    }
  }

  function alterarCampo(evento) {
    const { name, value, type, checked } = evento.target;
    const valorNormalizado = normalizarValorEntradaFormulario(evento);

    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      [name]: type === 'checkbox'
        ? checked
        : name === 'telefone'
          ? normalizarTelefone(valorNormalizado)
          : valorNormalizado
    }));
  }

  async function buscarDadosCep() {
    if (somenteLeitura) {
      return;
    }

    definirBuscandoCep(true);
    definirMensagemErro('');

    try {
      const dadosCep = await buscarCep(formulario.cep);

      definirFormulario((estadoAtual) => ({
        ...estadoAtual,
        cep: dadosCep.cep || estadoAtual.cep,
        logradouro: dadosCep.logradouro || estadoAtual.logradouro,
        complemento: dadosCep.complemento || estadoAtual.complemento,
        bairro: dadosCep.bairro || estadoAtual.bairro,
        cidade: dadosCep.localidade || estadoAtual.cidade,
        estado: dadosCep.uf || estadoAtual.estado
      }));
    } catch (erro) {
      definirMensagemErro(erro.message || 'Nao foi possivel consultar o CEP.');
      definirAbaAtiva('endereco');
    } finally {
      definirBuscandoCep(false);
    }
  }

  function fecharAoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget && !salvando) {
      aoFechar();
    }
  }

  return (
    <div className="camadaModal" role="presentation" onMouseDown={fecharAoClicarNoFundo}>
      <form
        className="modalFornecedor"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModalEmpresa"
        onMouseDown={(evento) => evento.stopPropagation()}
        onSubmit={submeterFormulario}
      >
        <header className="cabecalhoModalFornecedor">
          <h2 id="tituloModalEmpresa">
            {empresa ? 'Cadastro da empresa' : 'Incluir empresa'}
          </h2>

          <div className="acoesCabecalhoModalFornecedor">
            <Botao
              variante="secundario"
              type="button"
              icone="fechar"
              somenteIcone
              title="Fechar"
              aria-label="Fechar"
              onClick={aoFechar}
              disabled={salvando}
            >
              Fechar
            </Botao>
            {!somenteLeitura ? (
              <Botao
                variante="primario"
                type="submit"
                icone="confirmar"
                somenteIcone
                title={salvando ? 'Salvando...' : 'Salvar'}
                aria-label={salvando ? 'Salvando...' : 'Salvar'}
                disabled={salvando}
              >
                {salvando ? 'Salvando...' : 'Salvar'}
              </Botao>
            ) : null}
          </div>
        </header>

        <div className="abasModalFornecedor" role="tablist" aria-label="Secoes do cadastro da empresa">
          {abasModalEmpresa.map((aba) => (
            <button
              key={aba.id}
              type="button"
              role="tab"
              className={`abaModalFornecedor ${abaAtiva === aba.id ? 'ativa' : ''}`}
              aria-selected={abaAtiva === aba.id}
              onClick={() => definirAbaAtiva(aba.id)}
            >
              {aba.label}
            </button>
          ))}
        </div>

        <div className="corpoModalFornecedor">
          {abaAtiva === 'dadosGerais' ? (
            <section className="painelDadosGeraisFornecedor">
              <CampoImagemPadrao
                valor={formulario.imagem}
                alt={`Imagem de ${formulario.nomeFantasia || formulario.razaoSocial || 'empresa'}`}
                iniciais={obterIniciaisEmpresa(formulario)}
                disabled={somenteLeitura}
                onChange={(imagem) => definirFormulario((estadoAtual) => ({
                  ...estadoAtual,
                  imagem: imagem || estadoAtual.imagem
                }))}
              />

              <div className="gradeCamposModalFornecedor">
                <CampoFormulario label="Razao social" name="razaoSocial" value={formulario.razaoSocial} onChange={alterarCampo} disabled={somenteLeitura} required />
                <CampoFormulario label="Nome fantasia" name="nomeFantasia" value={formulario.nomeFantasia} onChange={alterarCampo} disabled={somenteLeitura} required />
                <CampoFormulario label="Slogan" name="slogan" value={formulario.slogan} onChange={alterarCampo} disabled={somenteLeitura} />
                <CampoSelect label="Tipo" name="tipo" value={formulario.tipo} onChange={alterarCampo} options={[{ valor: 'Pessoa fisica', label: 'Pessoa fisica' }, { valor: 'Pessoa juridica', label: 'Pessoa juridica' }]} disabled={somenteLeitura} required />
                <CampoFormulario label={rotuloDocumento} name="cnpj" value={formulario.cnpj} onChange={alterarCampo} disabled={somenteLeitura} required />
                <CampoFormulario label="Inscricao estadual" name="inscricaoEstadual" value={formulario.inscricaoEstadual} onChange={alterarCampo} disabled={somenteLeitura} />
                <CampoFormulario label="E-mail" name="email" type="email" value={formulario.email} onChange={alterarCampo} disabled={somenteLeitura} />
                <CampoFormulario label="Telefone" name="telefone" value={formulario.telefone} onChange={alterarCampo} disabled={somenteLeitura} />
              </div>
            </section>
          ) : null}

          {abaAtiva === 'paginaInicial' ? (
            <section className="gradeCamposModalFornecedor">
              <div className="campoFormularioIntegral painelOpcaoEmpresaPaginaInicial">
                <label className="campoCheckboxFormulario" htmlFor="exibirFunilPaginaInicialEmpresa">
                  <input
                    id="exibirFunilPaginaInicialEmpresa"
                    type="checkbox"
                    name="exibirFunilPaginaInicial"
                    checked={formulario.exibirFunilPaginaInicial}
                    onChange={alterarCampo}
                    disabled={somenteLeitura}
                  />
                  <span>Exibir funil de ordensCompra na pagina inicial</span>
                </label>
                <p className="descricaoOpcaoEmpresaPaginaInicial">
                  Quando habilitado, a pagina inicial mostra as etapas de cotacao marcadas para funil,
                  com quantidade de cotacoes e valor total em cada etapa.
                </p>
              </div>
            </section>
          ) : null}

          {abaAtiva === 'endereco' ? (
            <section className="gradeCamposModalFornecedor">
              <CampoFormularioComAcao label="CEP" name="cep" value={formulario.cep} onChange={alterarCampo} aoAcionar={buscarDadosCep} carregando={buscandoCep} rotuloAcao="Buscar CEP" disabled={somenteLeitura} />
              <CampoFormulario label="Logradouro" name="logradouro" value={formulario.logradouro} onChange={alterarCampo} disabled={somenteLeitura} />
              <CampoFormulario label="Numero" name="numero" value={formulario.numero} onChange={alterarCampo} disabled={somenteLeitura} />
              <CampoFormulario label="Complemento" name="complemento" value={formulario.complemento} onChange={alterarCampo} disabled={somenteLeitura} />
              <CampoFormulario label="Bairro" name="bairro" value={formulario.bairro} onChange={alterarCampo} disabled={somenteLeitura} />
              <CampoFormulario label="Cidade" name="cidade" value={formulario.cidade} onChange={alterarCampo} disabled={somenteLeitura} />
              <CampoFormulario label="Estado" name="estado" value={formulario.estado} onChange={alterarCampo} disabled={somenteLeitura} maxLength={2} />
            </section>
          ) : null}

          {abaAtiva === 'agenda' ? (
            <section className="gradeCamposModalFornecedor">
              <CampoFormulario label="Inicio da manha" name="horaInicioManha" type="time" value={formulario.horaInicioManha} onChange={alterarCampo} disabled={somenteLeitura} />
              <CampoFormulario label="Fim da manha" name="horaFimManha" type="time" value={formulario.horaFimManha} onChange={alterarCampo} disabled={somenteLeitura} />
              <CampoFormulario label="Inicio da tarde" name="horaInicioTarde" type="time" value={formulario.horaInicioTarde} onChange={alterarCampo} disabled={somenteLeitura} />
              <CampoFormulario label="Fim da tarde" name="horaFimTarde" type="time" value={formulario.horaFimTarde} onChange={alterarCampo} disabled={somenteLeitura} />
              <CampoCheckbox
                label="Trabalha aos sabados"
                name="trabalhaSabado"
                checked={formulario.trabalhaSabado}
                onChange={alterarCampo}
                disabled={somenteLeitura}
              />
              {formulario.trabalhaSabado ? (
                <>
                  <CampoFormulario label="Inicio do sabado" name="horaInicioSabado" type="time" value={formulario.horaInicioSabado} onChange={alterarCampo} disabled={somenteLeitura} />
                  <CampoFormulario label="Fim do sabado" name="horaFimSabado" type="time" value={formulario.horaFimSabado} onChange={alterarCampo} disabled={somenteLeitura} />
                </>
              ) : null}
            </section>
          ) : null}

          {abaAtiva === 'cotacoesOrdensCompra' ? (
            <section className="gradeCamposModalFornecedor">
              <CampoFormulario label="Validade padrao da cotacao (dias)" name="diasValidadeCotacao" type="number" min="0" value={formulario.diasValidadeCotacao} onChange={alterarCampo} disabled={somenteLeitura} />
              <CampoFormulario label="Prazo padrao de entrega da ordem de compra (dias)" name="diasEntregaOrdemCompra" type="number" min="0" value={formulario.diasEntregaOrdemCompra} onChange={alterarCampo} disabled={somenteLeitura} />
              <CampoSelect
                label="Codigo principal do fornecedor"
                name="codigoPrincipalFornecedor"
                value={formulario.codigoPrincipalFornecedor}
                onChange={alterarCampo}
                options={[
                  { valor: 'codigo', label: 'Codigo padrao' },
                  { valor: 'codigoAlternativo', label: 'Codigo alternativo' }
                ]}
                disabled={somenteLeitura}
              />
              <CampoSelect
                label="Primeiro plano dos itens"
                name="destaqueItemCotacaoPdf"
                value={formulario.destaqueItemCotacaoPdf}
                onChange={alterarCampo}
                options={[
                  { valor: 'descricao', label: 'Descricao em primeiro plano' },
                  { valor: 'referencia', label: 'Referencia em primeiro plano' }
                ]}
                disabled={somenteLeitura}
              />
              <CampoSelecaoMultiplaModal
                className="campoFormularioIntegral"
                label="Filtro padrao de status da cotacao"
                titulo="Status padrao da cotacao"
                itens={etapasCotacaoAtivasOrdenadas.map((etapa) => ({
                  valor: String(etapa.idEtapaCotacao),
                  label: etapa.descricao
                }))}
                valoresSelecionados={formulario.etapasFiltroPadraoCotacao}
                placeholder="Todos"
                disabled={somenteLeitura}
                aoAlterar={(valores) => definirFormulario((estadoAtual) => ({
                  ...estadoAtual,
                  etapasFiltroPadraoCotacao: valores
                }))}
              />
            </section>
          ) : null}

          {abaAtiva === 'email' ? (
            <section className="gradeCamposModalFornecedor">
              <CampoFormulario
                className="campoFormularioIntegral"
                label="Assunto do e-mail da cotacao"
                name="assuntoEmailCotacao"
                value={formulario.assuntoEmailCotacao}
                onChange={alterarCampo}
                disabled={somenteLeitura}
              />
              <CampoTextoLongo
                className="campoFormularioIntegral"
                label="Corpo do e-mail da cotacao"
                name="corpoEmailCotacao"
                value={formulario.corpoEmailCotacao}
                onChange={alterarCampo}
                disabled={somenteLeitura}
                rows={8}
              />
              <CampoTextoLongo
                className="campoFormularioIntegral"
                label="Assinatura do e-mail da cotacao"
                name="assinaturaEmailCotacao"
                value={formulario.assinaturaEmailCotacao}
                onChange={alterarCampo}
                disabled={somenteLeitura}
                rows={4}
              />

              <div className="campoFormularioIntegral painelOpcaoEmpresaPaginaInicial">
                <strong>Tags disponiveis</strong>
                <p className="descricaoOpcaoEmpresaPaginaInicial">
                  Use estas tags para montar o texto dinamicamente: <code>{'{empresa_nome}'}</code>, <code>{'{fornecedor_codigo}'}</code>, <code>{'{fornecedor_codigo_principal}'}</code>, <code>{'{fornecedor_codigo_alternativo}'}</code>, <code>{'{fornecedor_nome}'}</code>, <code>{'{fornecedor_fantasia}'}</code>, <code>{'{fornecedor_cidade}'}</code>, <code>{'{fornecedor_uf}'}</code>, <code>{'{cotacao_codigo}'}</code>, <code>{'{cotacao_data}'}</code>, <code>{'{cotacao_validade}'}</code>, <code>{'{cotacao_total}'}</code>, <code>{'{cotacao_observacao}'}</code>, <code>{'{cotacao_campos_extras}'}</code>, <code>{'{cotacao_itens}'}</code>, <code>{'{comprador_nome}'}</code> e <code>{'{contato_nome}'}</code>.
                </p>
                <p className="descricaoOpcaoEmpresaPaginaInicial">
                  A tag <code>{'{cotacao_itens}'}</code> ja traz cada item com referencia, descricao, quantidade, valor unitario e valor total em linhas separadas.
                </p>
                <p className="descricaoOpcaoEmpresaPaginaInicial">
                  A tag <code>{'{cotacao_observacao}'}</code> traz a observacao principal da cotacao, e <code>{'{cotacao_campos_extras}'}</code> monta um bloco com todos os campos personalizados preenchidos.
                </p>
              </div>
            </section>
          ) : null}
        </div>

        {mensagemErro ? <p className="mensagemErroFormulario">{mensagemErro}</p> : null}
      </form>
    </div>
  );
}

function CampoFormulario({ label, name, type = 'text', className = '', ...props }) {
  return (
    <div className={`campoFormulario ${className}`.trim()}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} className="entradaFormulario" {...props} />
    </div>
  );
}

function CampoTextoLongo({ label, name, className = '', rows = 4, ...props }) {
  return (
    <div className={`campoFormulario ${className}`.trim()}>
      <label htmlFor={name}>{label}</label>
      <textarea id={name} name={name} className="entradaFormulario entradaFormularioTextoCurto" rows={rows} {...props} />
    </div>
  );
}

function CampoFormularioComAcao({
  label,
  name,
  aoAcionar,
  carregando,
  rotuloAcao,
  disabled = false,
  ...props
}) {
  return (
    <div className="campoFormulario">
      <label htmlFor={name}>{label}</label>
      <div className="campoComAcao">
        <input id={name} name={name} type="text" className="entradaFormulario" disabled={disabled} {...props} />
        <Botao variante="secundario" icone="pesquisa" type="button" className="botaoCampoAcao" onClick={aoAcionar} disabled={carregando || disabled}>
          {carregando ? 'Buscando...' : rotuloAcao}
        </Botao>
      </div>
    </div>
  );
}

function CampoSelect({ label, name, options, ...props }) {
  return (
    <div className="campoFormulario">
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} className="entradaFormulario" {...props}>
        <option value="">Selecione</option>
        {options.map((option) => (
          <option key={option.valor} value={option.valor}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CampoCheckbox({ label, name, ...props }) {
  return (
    <div className="campoCheckboxFormulario">
      <input id={name} name={name} type="checkbox" {...props} />
      <label htmlFor={name}>{label}</label>
    </div>
  );
}

function criarFormularioEmpresa(empresa) {
  if (!empresa) {
    return {
      ...estadoInicialFormulario
    };
  }

  return {
    razaoSocial: empresa.razaoSocial || '',
    nomeFantasia: empresa.nomeFantasia || '',
    slogan: empresa.slogan || '',
    tipo: empresa.tipo || 'Pessoa juridica',
    cnpj: empresa.cnpj || '',
    inscricaoEstadual: empresa.inscricaoEstadual || '',
    email: empresa.email || '',
    telefone: empresa.telefone || '',
    horaInicioManha: empresa.horaInicioManha || '08:00',
    horaFimManha: empresa.horaFimManha || '12:00',
    horaInicioTarde: empresa.horaInicioTarde || '13:00',
    horaFimTarde: empresa.horaFimTarde || '18:00',
    trabalhaSabado: Boolean(empresa.trabalhaSabado),
    horaInicioSabado: empresa.horaInicioSabado || '08:00',
    horaFimSabado: empresa.horaFimSabado || '12:00',
    exibirFunilPaginaInicial: empresa.exibirFunilPaginaInicial === undefined
      ? true
      : Boolean(empresa.exibirFunilPaginaInicial),
    diasValidadeCotacao: String(empresa.diasValidadeCotacao ?? 7),
    diasEntregaOrdemCompra: String(empresa.diasEntregaOrdemCompra ?? 7),
    codigoPrincipalFornecedor: normalizarCodigoPrincipalFornecedor(empresa.codigoPrincipalFornecedor),
    etapasFiltroPadraoCotacao: normalizarListaEmpresa(empresa.etapasFiltroPadraoCotacao),
    corPrimariaCotacao: empresa.corPrimariaCotacao || '#111827',
    corSecundariaCotacao: empresa.corSecundariaCotacao || '#ef4444',
    corDestaqueCotacao: empresa.corDestaqueCotacao || '#f59e0b',
    destaqueItemCotacaoPdf: normalizarDestaqueItemCotacaoPdf(empresa.destaqueItemCotacaoPdf),
    assuntoEmailCotacao: empresa.assuntoEmailCotacao || estadoInicialFormulario.assuntoEmailCotacao,
    corpoEmailCotacao: empresa.corpoEmailCotacao || estadoInicialFormulario.corpoEmailCotacao,
    assinaturaEmailCotacao: empresa.assinaturaEmailCotacao || estadoInicialFormulario.assinaturaEmailCotacao,
    logradouro: empresa.logradouro || '',
    numero: empresa.numero || '',
    complemento: empresa.complemento || '',
    bairro: empresa.bairro || '',
    cidade: empresa.cidade || '',
    estado: empresa.estado || '',
    cep: empresa.cep || '',
    imagem: empresa.imagem || ''
  };
}

function normalizarDestaqueItemCotacaoPdf(valor) {
  return String(valor || '').trim() === 'referencia' ? 'referencia' : 'descricao';
}

function normalizarCodigoPrincipalFornecedor(valor) {
  return String(valor || '').trim() === 'codigoAlternativo' ? 'codigoAlternativo' : 'codigo';
}

function normalizarListaEmpresa(valor) {
  if (Array.isArray(valor)) {
    return valor.map(String);
  }

  if (!valor) {
    return [];
  }

  try {
    const lista = JSON.parse(valor);
    return Array.isArray(lista) ? lista.map(String) : [];
  } catch (_erro) {
    return String(valor)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

function obterIniciaisEmpresa(empresa) {
  const nomeBase = empresa.nomeFantasia || empresa.razaoSocial || 'Empresa';

  return nomeBase
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join('');
}

