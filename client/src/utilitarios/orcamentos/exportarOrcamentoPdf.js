import {
  converterPrecoParaNumero,
  normalizarPreco
} from '../normalizarPreco';
import { exportarPdfDesktop } from '../../servicos/desktop';
import { gerarHtmlDocumentoCotacaoPdf } from './gerarHtmlDocumentoOrcamentoPdf';

const estiloPadraoDocumento = {
  corPrimaria: '#111827',
  corSecundaria: '#ef4444',
  corDestaque: '#f59e0b'
};

export async function exportarOrcamentoPdf(contexto) {
  const documento = montarDocumentoCotacaoPdf(contexto);
  const html = gerarHtmlDocumentoCotacaoPdf(documento);

  return exportarPdfDesktop({
    html,
    nomeArquivo: documento.nomeArquivo
  });
}

function montarDocumentoCotacaoPdf({
  formulario,
  orcamento,
  fornecedores,
  contatos,
  usuarios,
  vendedores,
  prazosPagamento,
  etapasOrcamento,
  produtos,
  empresa,
  camposPedido
}) {
  const cliente = fornecedores.find((item) => String(item.idCliente) === String(formulario.idCliente));
  const contato = contatos.find((item) => String(item.idContato) === String(formulario.idContato));
  const usuario = usuarios.find((item) => String(item.idUsuario) === String(formulario.idUsuario));
  const vendedor = vendedores.find((item) => String(item.idVendedor) === String(formulario.idVendedor));
  const prazoPagamento = prazosPagamento.find((item) => String(item.idPrazoPagamento) === String(formulario.idPrazoPagamento));
  const etapa = etapasOrcamento.find((item) => String(item.idEtapaOrcamento) === String(formulario.idEtapaOrcamento));
  const destaqueItem = normalizarDestaqueItemOrcamentoPdf(empresa?.destaqueItemOrcamentoPdf);
  const total = Array.isArray(formulario.itens)
    ? formulario.itens.reduce((acumulador, item) => acumulador + (converterPrecoParaNumero(item.valorTotal) || 0), 0)
    : 0;

  const observacoes = [
    criarObservacaoPrincipal(formulario.observacao),
    ...montarObservacoesCamposExtras(formulario.camposExtras),
    ...montarObservacoesPedido(camposPedido)
  ].filter(Boolean);

  return {
    nomeArquivo: montarNomeArquivoOrcamento(orcamento?.idOrcamento, cliente?.nomeFantasia || cliente?.razaoSocial),
    estilo: {
      corPrimaria: normalizarCorDocumento(empresa?.corPrimariaOrcamento, estiloPadraoDocumento.corPrimaria),
      corSecundaria: normalizarCorDocumento(empresa?.corSecundariaOrcamento, estiloPadraoDocumento.corSecundaria),
      corDestaque: normalizarCorDocumento(empresa?.corDestaqueOrcamento, estiloPadraoDocumento.corDestaque)
    },
    empresa: {
      nome: empresa?.nomeFantasia || empresa?.razaoSocial || 'Empresa',
      razaoSocial: empresa?.razaoSocial || '',
      documento: empresa?.cnpj || '',
      endereco: montarEndereco(empresa),
      contatos: [empresa?.telefone, empresa?.email].filter(Boolean),
      imagem: empresa?.imagem || '',
      iniciais: obterIniciais(empresa?.nomeFantasia || empresa?.razaoSocial || 'Empresa')
    },
    cliente: {
      nome: cliente?.nomeFantasia || cliente?.razaoSocial || 'Fornecedor nao informado',
      documento: cliente?.cnpj || '',
      contato: contato?.nome || '',
      telefone: contato?.telefone || contato?.whatsapp || cliente?.telefone || '',
      email: contato?.email || cliente?.email || '',
      endereco: montarEndereco(cliente)
    },
    orcamento: {
      codigo: orcamento?.idOrcamento ? `#${String(orcamento.idOrcamento).padStart(4, '0')}` : 'Previa',
      dataInclusao: formatarDataDocumento(formulario.dataInclusao),
      dataValidade: formatarDataDocumento(formulario.dataValidade),
      usuario: usuario?.nome || formulario.nomeUsuario || 'Nao informado',
      vendedor: vendedor?.nome || 'Nao informado',
      prazoPagamento: prazoPagamento?.descricaoFormatada || prazoPagamento?.descricao || 'Nao informado',
      etapa: etapa?.descricao || 'Nao informada'
    },
    itens: montarItensDocumento(formulario.itens, produtos, destaqueItem),
    totais: {
      subtotal: normalizarPreco(total),
      total: normalizarPreco(total)
    },
    observacoes
  };
}

function montarItensDocumento(itens, produtos, destaqueItem) {
  return (Array.isArray(itens) ? itens : []).map((item, indice) => {
    const produto = produtos.find((registro) => String(registro.idProduto) === String(item.idProduto));
    const unidade = produto?.nomeUnidade || produto?.nomeUnidadeMedida || produto?.unidade || '';
    const referencia = String(produto?.referencia || '').trim();
    const descricao = produto?.descricao || `Produto #${String(item.idProduto || '').padStart(4, '0')}`;
    const detalheBase = unidade || '';
    const imagem = String(item?.imagem || produto?.imagem || '').trim();
    const principal = destaqueItem === 'referencia' && referencia
      ? referencia
      : descricao;
    const secundario = destaqueItem === 'referencia'
      ? [descricao, detalheBase].filter(Boolean).join(' | ')
      : [referencia, detalheBase].filter(Boolean).join(' | ');

    return {
      chave: `${item.idProduto || 'item'}-${indice}`,
      codigo: String(indice + 1).padStart(2, '0'),
      imagem,
      descricao: principal,
      detalhe: secundario,
      quantidade: unidade ? `${item.quantidade} ${unidade}` : String(item.quantidade || ''),
      valorUnitario: normalizarPreco(item.valorUnitario || 0),
      valorTotal: normalizarPreco(item.valorTotal || 0),
      observacao: String(item.observacao || '').trim()
    };
  });
}

function montarObservacoesCamposExtras(camposExtras) {
  return (Array.isArray(camposExtras) ? camposExtras : [])
    .filter((campo) => String(campo?.valor || '').trim())
    .map((campo) => ({
      chave: `campo-orcamento-${campo.idCampoOrcamento}`,
      titulo: campo.titulo || 'Observacao complementar',
      texto: String(campo.valor || '').trim()
    }));
}

function montarObservacoesPedido(camposPedido) {
  return (Array.isArray(camposPedido) ? camposPedido : [])
    .filter((campo) => campo?.status !== 0 && String(campo?.descricaoPadrao || '').trim())
    .map((campo) => ({
      chave: `campo-pedido-${campo.idCampoPedido}`,
      titulo: campo.titulo || 'Observacao padrao da ordem de compra',
      texto: String(campo.descricaoPadrao || '').trim()
    }));
}

function criarObservacaoPrincipal(observacao) {
  const texto = String(observacao || '').trim();

  if (!texto) {
    return null;
  }

  return {
    chave: 'observacao-principal',
    titulo: 'Observacao da cotacao',
    texto
  };
}

function montarEndereco(registro) {
  return [
    [registro?.logradouro, registro?.numero].filter(Boolean).join(', '),
    registro?.complemento,
    [registro?.bairro, registro?.cidade, registro?.estado].filter(Boolean).join(' - '),
    registro?.cep
  ]
    .filter(Boolean)
    .join(' | ');
}

function formatarDataDocumento(valor) {
  if (!valor) {
    return 'Nao informada';
  }

  const data = new Date(`${valor}T00:00:00`);

  if (Number.isNaN(data.getTime())) {
    return valor;
  }

  return new Intl.DateTimeFormat('pt-BR').format(data);
}

function montarNomeArquivoOrcamento(idOrcamento, nomeCliente) {
  const codigo = idOrcamento ? String(idOrcamento).padStart(4, '0') : 'previa';
  const nomeNormalizado = String(nomeCliente || 'Fornecedor')
    .replace(/[<>:"/\\|?*]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return `Cotacao ${codigo} - ${nomeNormalizado || 'Fornecedor'}.pdf`;
}

function obterIniciais(nome) {
  return String(nome || 'Empresa')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join('');
}

function normalizarCorDocumento(cor, fallback) {
  return /^#([0-9a-fA-F]{6})$/.test(String(cor || '').trim())
    ? String(cor).trim()
    : fallback;
}

function normalizarDestaqueItemOrcamentoPdf(valor) {
  return String(valor || '').trim() === 'referencia' ? 'referencia' : 'descricao';
}
