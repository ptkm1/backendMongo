const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')

module.exports = (req, res, next) => { //Exportando o autenticador de usuário para ser usado na aplicação
  const authCabecalho = req.headers.authorization;

  if(!authCabecalho)
  return res.status(401).send({ error: 'token nao informado' });


  const parts = authCabecalho.split(' '); //cortando o texto no meio, dividindo em 2 partes, do contrario retornaria bearer e o token colados

  if(!parts.length === 2)
  return res.status(401).send({ error: "token error" });

  const [ scheme, token ] = parts; //dividindo em 2 partes o esquema de token, primeiro em scheme precisa retornar Bearer, dps o token

  if (!/^Bearer$/i.test(scheme)) //USANDO REGEX
  return res.status(401).send({ error: 'token mal formatado' });

  jwt.verify(token, authConfig.segredo, (err, decoded) =>{
    if(err) return res.status(401).send({ error: 'token invalido'});

    req.userId = decoded.id; //Aplicando o ID do usuário na variavel userID
    return next();
  })
}
