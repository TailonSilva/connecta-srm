import { BotaoAcaoGrade } from './botaoAcaoGrade';

export function AcoesRegistro({
  rotuloConsulta = 'Consultar registro',
  rotuloEdicao = 'Editar registro',
  rotuloInativacao = 'Inativar registro'
}) {
  return (
    <div className="acoesRegistro">
      <BotaoAcaoGrade icone="consultar" titulo={rotuloConsulta} />
      <BotaoAcaoGrade icone="editar" titulo={rotuloEdicao} />
      <BotaoAcaoGrade icone="inativar" titulo={rotuloInativacao} />
    </div>
  );
}
