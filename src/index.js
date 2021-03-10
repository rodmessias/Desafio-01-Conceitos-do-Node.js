const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if (!user) {
    return response.status(404).json({ error: 'Usuário não existe!'});
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExists = users.some(
    (users) => users.username === username
  );

  if (userAlreadyExists) {
    return response.status(400).json({ error: 'Este usuário já existe!' })
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.status(201).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;

  const { user } = request;

  const todo = {
    id: uuidv4(),
    done: false,
    title,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo);

  return response.status(201).json(todo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;

  const { id } = request.params;

  const { user } = request;

  const todoAlreadyExists = user.todos.some(
    (todo) => todo.id === id
  );

  if (!todoAlreadyExists) {
    return response.status(404).json({ error: 'Este TODO não existe!' })
  }

  const indexTodo = user.todos.findIndex(
    (todo) => todo.id === id
  );

  user.todos[indexTodo].title = title;
  user.todos[indexTodo].deadline = deadline;

  return response.status(201).json(user.todos[indexTodo]);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;

  const { user } = request;

  const todoAlreadyExists = user.todos.some(
    (todo) => todo.id === id
  );

  if (!todoAlreadyExists) {
    return response.status(404).json({ error: 'Este TODO não existe!' })
  }

  const indexTodo = user.todos.findIndex(
    (todo) => todo.id === id
  );

  user.todos[indexTodo].done = true;

  return response.status(201).json(user.todos[indexTodo]);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;

  const { user } = request;

  const todoAlreadyExists = user.todos.some(
    (todo) => todo.id === id
  );

  if (!todoAlreadyExists) {
    return response.status(404).json({ error: 'Este TODO não existe!' })
  }

  const indexTodo = user.todos.findIndex(
    (todo) => todo.id === id
  );

  user.todos.splice(user.todos[indexTodo], 1);

  return response.status(204).send();
});

module.exports = app;