const mongoose = require('../../database');

const bcrypt = require('bcryptjs');

const ProjetoSchema = new mongoose.Schema({
  title:{
    type: String,
    require: true,
  },
  description:{
    type: String,
    require: true,
  },
  user:{
    type: mongoose.Schema.Types.ObjectID, //Forma queo mongo grava nosso ID no DB
    ref: 'User',
    require: true,
  },
  tasks:[{
    type: mongoose.Schema.Types.ObjectID,
    ref: 'Task'
  }],
  createdAt: {
    type: Date, //definindo o tipo de data (nativo do js)
    default: Date.now, //Pegando a data atual em que foi criado o usuário
  },
});

const Projeto = mongoose.model('Projeto', ProjetoSchema);


module.exports = Projeto;
