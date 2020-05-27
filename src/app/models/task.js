const mongoose = require('../../database');

const bcrypt = require('bcryptjs');

const TaskSchema = new mongoose.Schema({
  title:{
    type: String,
    require: true,
  },
  projeto:{
    type: mongoose.Schema.Types.ObjectID,
    ref: 'Projeto',
    require: true,
  },
  assignedTo:{
    type: mongoose.Schema.Types.ObjectID, //Forma queo mongo grava nosso ID no DB
    ref: 'User',
    require: true,
  },
  completed:{
    type: Boolean,
    require: true,
    default: false,
  },
  createdAt: {
    type: Date, //definindo o tipo de data (nativo do js)
    default: Date.now, //Pegando a data atual em que foi criado o usuário
  },
});

const Task = mongoose.model('Task', TaskSchema);


module.exports = Task;
