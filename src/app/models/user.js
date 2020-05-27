const mongoose = require('../../database');

const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:{
    type: String,
    require: true,
  },
  email: {
    type: String, //tipo do objeto recebido no input
    unique: true, //Caso alguem tente registrar um email que ja é cadastrado no banco, retornar erro
    required: true,  //Tornando obrigatório
    lowercase: true,  //Texto em caixa baixa, sem capslock
  },
  password: {
    type: String,
    required: true, //Tornando obrigatório
    select: false, //Quando buscar o usuário nao venha uma senha no array
  },
  passwordResetToken:{
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: String,
    select: false,
  },
  createdAt: {
    type: Date, //definindo o tipo de data (nativo do js)
    default: Date.now, //Pegando a data atual em que foi criado o usuário
  },
});

UserSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
})

const User = mongoose.model('User', UserSchema);


module.exports = User;
