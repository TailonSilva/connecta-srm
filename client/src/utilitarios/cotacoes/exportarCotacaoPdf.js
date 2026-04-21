import {
  converterPrecoParaNumero,
  normalizarPreco
} from '../normalizarPreco';
import { exportarPdfDesktop } from '../../servicos/desktop';
import { gerarHtmlDocumentoCotacaoPdf } from './gerarHtmlDocumentoCotacaoPdf';

const estiloPadraoDocumento = {
  corPrimaria: '#111827',
  corSecundaria: '#ef4444',
  corDestaque: '#f59e0b'
};

export async function exportarCotacaoPdf(contexto) {
  const documento = montarDocumentoCotacaoPdf(contexto);
  const html = gerarHtmlDocumentoCotacaoPdf(documento);

  return exportarPdfDesktop({
    html,
    nomeArquivo: documento.nomeArquivo
  });
}

function montarDocumentoCotacaoPdf({
  formulario,
  cotacao,
  fornecedores,
  contatos,
  usuarios,
  compradores,
  prazosPagamento,
  etapasCotacao,
  produtos,
  empresa,
  camposOrdemCompra
}) {
  const fornecedor = fornecedores.find((item) => String(item.idFornecedor) === String(formulario.idFornecedor));
  const contato = contatos.find((item) => String(item.idContato) === String(formulario.idContato));
  const usuario = usuarios.find((item) => String(item.idUsuario) === String(formulario.idUsuario));
  const comprador = compradores.find((item) => String(item.idComprador) === String(formulario.idComprador));
  const prazoPagamento = prazosPagamento.find((item) => String(item.idPrazoPagamento) === String(formulario.idPrazoPagamento));
  const etapa = etapasCotacao.find((item) => String(item.idEtapaCotacao) === String(formulario.idEtapaCotacao));
  const destaqueItem = normalizarDestaqueItemCotacaoPdf(empresa?.destaqueItemCotacaoPdf);
  const total = Array.isArray(formulario.itens)
    ? formulario.itens.reduce((acumulador, item) => acumulador + (converterPrecoParaNumero(item.valorTotal) || 0), 0)
    : 0;

  const observacoes = [
    criarObservacaoPrincipal(formulario.observacao),
    ...montarObservacoesCamposExtras(formulario.camposExtras),
    ...montarObservacoesOrdemCompra(camposOrdemCompra)
  ].filter(Boolean);

  return {
    nomeArquivo: montarNomeArquivoCotacao(cotacao?.idCotacao, fornecedor?.nomeFantasia || fornecedor?.razaoSocial),
    estilo: {
      corPrimaria: normalizarCorDocumento(empresa?.corPrimariaCotacao, estiloPadraoDocumento.corPrimaria),
      corSecundaria: normalizarCorDocumento(empresa?.corSecundariaCotacao, estiloPadraoDocumento.corSecundaria),
      corDestaque: normalizarCorDocumento(empresa?.corDestaqueCotacao, estiloPadraoDocumento.corDestaque)
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
    fornecedor: {
      nome: fornecedor?.nomeFantasia || fornecedor?.razaoSocial || 'Fornecedor nao informado',
      documento: fornecedor?.cnpj || '',
      contato: contato?.nome || '',
      telefone: contato?.telefone || contato?.whatsapp || fornecedor?.telefone || '',
      email: contato?.email || fornecedor?.email || '',
      endereco: montarEndereco(fornecedor)
    },
    cotacao: {
      codigo: cotacao?.idCotacao ? `#${String(cotacao.idCotacao).padStart(4, '0')}` : 'Previa',
      dataInclusao: formatarDataDocumento(formulario.dataInclusao),
      dataValidade: formatarDataDocumento(formulario.dataValidade),
      usuario: usuario?.nome || formulario.nomeUsuario || 'Nao informado',
      comprador: comprador?.nome || 'Nao informado',
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
      chave: `campo-cotacao-${campo.idCampoCotacao}`,
      titulo: campo.titulo || 'Observacao complementar',
      texto: String(campo.valor || '').trim()
    }));
}

function montarObservacoesOrdemCompra(camposOrdemCompra) {
  return (Array.isArray(camposOrdemCompra) ? camposOrdemCompra : [])
    .filter((campo) => campo?.status !== 0 && String(campo?.descricaoPadrao || '').trim())
    .map((campo) => ({
      chave: `campo-ordemCompra-${campo.idCampoOrdemCompra}`,
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

function montarNomeArquivoCotacao(idCotacao, nomeFornecedor) {
  const codigo = idCotacao ? String(idCotacao).padStart(4, '0') : 'previa';
  const nomeNormalizado = String(nomeFornecedor || 'Fornecedor')
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

function normalizarDestaqueItemCotacaoPdf(valor) {
  return String(valor || '').trim() === 'referencia' ? 'referencia' : 'descricao';
}
