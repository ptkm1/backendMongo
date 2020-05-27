const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Projeto = require('../models/projetos');
const Task = require('../models/task');



const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req,res) =>{
  try{

    const projetos = await Projeto.find().populate('user');


    return res.send({ projetos })
  }catch(err){
    return res.status(400).send({ error: 'erro no carregamento do projeto'})
  }
})

router.get('/:projetoId', async (req,res) => {
  try{

    const { title , description, tasks } = req.body;


    const projeto = await Projeto.findById(req.params.projetoId).populate(['user','tasks']);


    return res.send({ projeto })
  }catch(err){
    return res.status(400).send({ error: 'erro no carregamento do projeto'})
  }
})


//Cria o projeto
router.post('/', async (req, res) =>{
  try{
    const { title, description, tasks} = req.body; //Recuperando o TASKS junto com as outras 2 propriedades da requisição
    const projeto = await Projeto.create({ title,description, user: req.userId}); //Criando o projeto sem a TASK, apenas as 2 props e o userId

    await Promise.all(tasks.map(async task => { //Usando o promise all pra fazer um map no array de "tarefas" recuperado acima na requisição
      const projetoTask = new Task({ ...task, projeto: projeto._id}); //dentro do array, criamos a var projetoTask, usamos o rest
                                                                      //para pegar as tasks armazenadas no array, e armazenamos tbm o id do projeto

      await projetoTask.save() //Salvando a variável

      projeto.tasks.push(projetoTask); //Usando o push para armazenar a variavel projetoTask na variavel projeto
    }));

    await projeto.save(); //salvando a alteração feita no map array acima


    return res.send({ projeto }); //Retornando para o usuário a variável projeto já modificada

  }catch(err){
    console.log(err)
    return res.status(400).send({ error: "Erro ao criar projeto"})
  }
})


//Update
router.put('/:projetoId', async (req, res)=>{
  try{
    const { title, description, tasks } = req.body;

      const projeto = await Projeto.findByIdAndUpdate(req.params.projetoId,
        {title, description}, { new: true }); // o New: true, faz com que o mongoo se retorne o valor atualizado.

      projeto.tasks = [];
      await Task.remove({ projeto: projeto._id});

    await Promise.all(tasks.map(async task => {
      const projetoTask = new Task({ ...task, projeto: projeto._id});
      await projetoTask.save();

      projeto.tasks.push(projetoTask); 
    }));

    await projeto.save(); //salvando a alteração feita no map array acima


    return res.send({ projeto }); //Retornando para o usuário a variável projeto já modificada

  }catch(err){
    console.log(err)
    return res.status(400).send({ error: "Erro ao dar Update no projeto"})
  }
})

//Delete
router.delete('/:projetoId', async (req, res)=>{
  try{

   await Projeto.findByIdAndRemove(req.params.projetoId);


    return res.send()
  }catch(err){
    return res.status(400).send({ error: 'Não foi possivel deletar o projeto, tente de novo!'})
  }
})


module.exports = app => app.use('/projetos', router);
