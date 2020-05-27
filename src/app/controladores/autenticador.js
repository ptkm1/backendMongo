const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');


const User = require('../models/user');
const authConfig = require('../../config/auth');
const router = express.Router();


//Gerar o token para levar o usuário ao dashboard após logar
function gerarToken(params = {}){
  return jwt.sign(params, authConfig.segredo, {
    expiresIn: 86400, // expira em 1 dia (86400 é 1 dia)
  });
}

router.get('/prjt', async(req, res) =>{
  try{

    const projetos = {title: "Novo projeto", description: "Descrição nrewqova",};


    return res.send({ projetos })
  }catch(err){
    return res.status(400).send({ error: 'erro no carregamento do projeto'})
  }
})


router.post('/cadastro', async (req, res) =>{
  const { email } = req.body; // req da requisição, body do corpo do json enviado.

  try{

    if(await User.findOne({ email })){
      return res.status(400).send({ error: 'Email já cadastrado!'})
    }

    const user = await User.create(req.body);

    user.password = undefined;

    return res.send({ user,
      token: gerarToken({ id: user.id }),
     });
  }catch(err) {
    return res.status(400).send({error: 'Falha no registro'});
  }
});

router.post('/authenticate', async (req, res)=> {
  const {email, password} = req.body;

  const user = await User.findOne({ email }).select('+password');


  if(!user)
    return res.status(400).send({ error: 'usuário não existe' });


  if(!await bcrypt.compare(password, user.password))
  return res.status(400).send({ error: 'senha inválida'});

  user.password = undefined;



  res.send({ user,
    token: gerarToken({ id: user.id}),
   });



})


router.post('/forgot_password', async (req, res) =>{
  const { email } = req.body;

  try{

    const user = await User.findOne({ email })

    if(!user)
      return res.status(400).send({ error: 'user não encontrado '})

      const token = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await User.findByIdAndUpdate(user.id, {
        '$set':{
          passwordResetToken: token,
          passwordResetExpires: now,
        }
      })

      mailer.sendMail({
        to: email,
        from: 'patrick@rocketseat.com.br',
        template: 'auth/forgot_password',
        context: {token},
      },(erro)=>{
        console.log(erro)
        if(erro)
         return res.status(400).send({  erro: 'nao foi possivel enviar email de recuperação' })


        return res.send();
      })

  }catch(err){
    res.status(400).send({error: 'Falha , tente novamente'})
  }

})


router.post('/reset_password', async (req,res)=>{
  const {email, token, password} = req.body;

  try{
    const user = await User.findOne({ email })
    .select('+passwordResetToken passwordResetExpires');

    if(!user)
    return res.status(400).send({ error: 'Usuário não encontrado'})

    if(token !== user.passwordResetToken)
    return res.status(400).send({ error: 'Token inválido'})


    const now = new Date()

    if(now > user.passwordResetExpires)
    return res.status(400).send({ error: 'Tempo de token expirado, gere um novo'})

    user.password = password;

    await user.save();

    res.send();

  }catch(err){
    res.status(400).send({ error: 'Infelizmente não foi possivel resetar a senha, tente novamente'})
  }
})


module.exports = app => app.use('/auth', router);
