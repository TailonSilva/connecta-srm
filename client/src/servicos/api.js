const urlApi = 'http://127.0.0.1:3001/api';

export async function requisitarApi(caminho, configuracao) {
  const resposta = await fetch(`${urlApi}${caminho}`, configuracao);
  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.mensagem || 'Falha ao processar a requisicao.');
  }

  return dados;
}
