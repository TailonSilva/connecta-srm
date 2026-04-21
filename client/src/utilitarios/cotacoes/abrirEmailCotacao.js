import {
  converterPrecoParaNumero,
  normalizarPreco
} from '../normalizarPreco';
import { formatarCodigoFornecedor, normalizarCodigoFornecedorNumerico } from '../codigoFornecedor';

// `abrirEmailCotacao` monta o assunto e o corpo do e-mail do orçamento e abre o Outlook Web com esses dados preenchidos.
export async function abrirEmailCotacao(contexto) {
  const dadosEmail = montarDadosEmailCotacao(contexto);
  const url = montarUrlOutlookWeb(dadosEmail);

  if (!url) {
    return {
      sucesso: false,
      mensagem: 'Nao foi possivel montar o link do e-mail da cotacao.'
    };
  }

  const janela = window.open(url, '_blank', 'noopener,noreferrer');

  if (!janela) {
    return {
      sucesso: false,
      mensagem: 'O navegador bloqueou a abertura do Outlook Web. Permita pop-ups para continuar.'
    };
  }

  return {
    sucesso: true
  };
}

// Esta funcao concentra o enriquecimento do orçamento em tags simples para que o template da empresa nao precise conhecer a estrutura interna do formulario.
function montarDadosEmailCotacao({
  formulario,
  cotacao,
  fornecedores,
  contatos,
  usuarios,
  compradores,
  empresa
}) {
  const fornecedor = fornecedores.find((item) => String(item.idFornecedor) === String(formulario.idFornecedor));
  const contato = contatos.find((item) => String(item.idContato) === String(formulario.idContato));
  const usuario = usuarios.find((item) => String(item.idUsuario) === String(formulario.idUsuario));
  const comprador = compradores.find((item) => String(item.idComprador) === String(formulario.idComprador));
  const totalCotacao = Array.isArray(formulario.itens)
    ? formulario.itens.reduce((acumulador, item) => acumulador + (converterPrecoParaNumero(item.valorTotal) || 0), 0)
    : 0;
  const codigoAlternativoFornecedor = montarCodigoAlternativoFornecedor(fornecedor);
  const tags = {
    empresa_nome: empresa?.nomeFantasia || empresa?.razaoSocial || '',
    fornecedor_codigo: montarCodigoFornecedorCadastro(fornecedor),
    fornecedor_codigo_principal: formatarCodigoFornecedor(fornecedor, empresa),
    fornecedor_codigo_alternativo: codigoAlternativoFornecedor,
    fornecedor_nome: fornecedor?.razaoSocial || '',
    fornecedor_fantasia: fornecedor?.nomeFantasia || '',
    fornecedor_cidade: fornecedor?.cidade || '',
    fornecedor_uf: fornecedor?.estado || '',
    cotacao_codigo: montarCodigoCotacao(cotacao?.idCotacao),
    cotacao_data: formatarDataEmail(formulario.dataInclusao),
    cotacao_validade: formatarDataEmail(formulario.dataValidade),
    cotacao_total: normalizarPreco(totalCotacao),
    cotacao_observacao: String(formulario?.observacao || '').trim(),
    cotacao_campos_extras: montarCamposExtrasEmailCotacao(formulario?.camposExtras),
    cotacao_itens: montarItensEmailCotacao(formulario.itens),
    comprador_nome: comprador?.nome || usuario?.nome || formulario.nomeUsuario || '',
    contato_nome: contato?.nome || ''
  };
  const assunto = aplicarTagsEmail(
    empresa?.assuntoEmailCotacao || 'Cotacao {cotacao_codigo} - {fornecedor_nome}',
    tags
  );
  const corpoBase = aplicarTagsEmail(
    empresa?.corpoEmailCotacao || '',
    tags
  );
  const assinatura = aplicarTagsEmail(
    empresa?.assinaturaEmailCotacao || '',
    tags
  );
  const partesCorpo = [corpoBase, assinatura].filter((parte) => String(parte || '').trim());
  const para = contato?.email || fornecedor?.email || '';

  return {
    para,
    assunto,
    corpo: partesCorpo.join('\n\n')
  };
}

// O template usa tags textuais para permitir configuracao livre pela empresa sem exigir construtor visual.
function aplicarTagsEmail(template, tags) {
  const mapaTagsNormalizadas = Object.entries(tags).reduce((resultado, [chave, valor]) => {
    resultado[String(chave || '').trim().toLowerCase()] = String(valor || '').trim();
    return resultado;
  }, {});

  return String(template || '').trim().replace(/\{([^}]+)\}/g, (trechoOriginal, chaveBruta) => {
    const chaveNormalizada = String(chaveBruta || '').trim().toLowerCase();

    if (!Object.prototype.hasOwnProperty.call(mapaTagsNormalizadas, chaveNormalizada)) {
      return trechoOriginal;
    }

    return mapaTagsNormalizadas[chaveNormalizada];
  });
}

// A listagem de itens vira um bloco de texto estruturado para funcionar bem no corpo do Outlook Web sem depender de HTML rico.
function montarItensEmailCotacao(itens) {
  const listaItens = Array.isArray(itens) ? itens : [];

  if (listaItens.length === 0) {
    return 'Nenhum item informado.';
  }

  return [
    'Itens da cotacao:',
    ...listaItens.map((item, indice) => {
      const referencia = String(item?.referenciaProdutoSnapshot || '').trim();
      const descricao = String(item?.descricaoProdutoSnapshot || '').trim() || 'Produto sem descricao';
      const identificacao = [referencia, descricao].filter(Boolean).join(' - ');
      const quantidade = String(item?.quantidade || '').trim() || '0';
      const valorUnitario = normalizarPreco(item?.valorUnitario || 0);
      const valorTotal = normalizarPreco(item?.valorTotal || 0);

      return `${indice + 1}. ${identificacao} - Qtd: ${quantidade} | Valor unitario: ${valorUnitario} | Total: ${valorTotal}`;
    })
  ].join('\n');
}

// Os campos extras viram um bloco opcional para o template decidir se quer ou nao expor observacoes complementares da cotacao.
function montarCamposExtrasEmailCotacao(camposExtras) {
  const listaCampos = Array.isArray(camposExtras) ? camposExtras : [];
  const camposPreenchidos = listaCampos
    .map((campo) => ({
      titulo: String(campo?.titulo || '').trim(),
      valor: String(campo?.valor || '').trim()
    }))
    .filter((campo) => campo.titulo && campo.valor);

  if (camposPreenchidos.length === 0) {
    return '';
  }

  return [
    'Campos adicionais da cotacao:',
    ...camposPreenchidos.map((campo) => `${campo.titulo}: ${campo.valor}`)
  ].join('\n');
}


// O deeplink do Outlook Web permite abrir uma nova composicao ja com destinatario, assunto e corpo prontos.
function montarUrlOutlookWeb({ para, assunto, corpo }) {
  const parametros = [];
  const destinatario = String(para || '').trim();
  const assuntoNormalizado = String(assunto || '').trim();
  const corpoNormalizado = String(corpo || '').trim();

  if (destinatario) {
    parametros.push(`to=${encodeURIComponent(destinatario)}`);
  }

  parametros.push(`subject=${encodeURIComponent(assuntoNormalizado)}`);
  parametros.push(`body=${encodeURIComponent(corpoNormalizado)}`);

  return `https://outlook.office.com/mail/deeplink/compose?${parametros.join('&')}`;
}

// O código do orçamento segue o padrao visual do projeto para manter consistencia entre grid, PDF e e-mail.
function montarCodigoCotacao(idCotacao) {
  if (!idCotacao) {
    return 'Previa';
  }

  return `#${String(idCotacao).padStart(4, '0')}`;
}

// O código do produto segue o mesmo formato curto já usado no restante do fluxo comercial.
// O codigo de cadastro exposto na tag segue o id interno do fornecedor, sem depender da configuracao de codigo principal da empresa.
function montarCodigoFornecedorCadastro(fornecedor) {
  if (!fornecedor?.idFornecedor) {
    return '';
  }

  return `#${String(fornecedor.idFornecedor).padStart(4, '0')}`;
}

// O codigo alternativo ganha formato de codigo visual apenas quando existir valor cadastrado para o fornecedor.
function montarCodigoAlternativoFornecedor(fornecedor) {
  const codigoAlternativo = normalizarCodigoFornecedorNumerico(fornecedor?.codigoAlternativo);

  if (!codigoAlternativo) {
    return '';
  }

  return `#${String(codigoAlternativo).padStart(4, '0')}`;
}

// A data vai em formato brasileiro para manter a leitura comercial coerente com o restante do sistema.
function formatarDataEmail(valor) {
  if (!valor) {
    return '';
  }

  const data = new Date(`${valor}T00:00:00`);

  if (Number.isNaN(data.getTime())) {
    return String(valor);
  }

  return new Intl.DateTimeFormat('pt-BR').format(data);
}
