##Notas do rodapé

1- Foi entendido que o Express é a rota para essa aplicação em nodeJs, com o Express é possivel que apenas exportando
o mesmo com : "  const express = require('express');  ", ele conectará os controladores (projetos.js e autenticador.js) com todos os
arquivos que tiverem o express importado.

2- conectamos o app com o database no arquivo user.js, na pasta models, lá importamos o mongoose

3- usamos o router.#metodo para mexer na requisição, seja ela de POST, GET, DELETE ETC...

4- o JWT gera um token mas não garante que o usuário está autenticado (logado).

5- o AuthMiddleware cria esse observador de token, pra saber se o usuário está autenticado ou não.
