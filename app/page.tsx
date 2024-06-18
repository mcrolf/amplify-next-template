"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [recipes, setRecipes] = useState<Array<Schema["Recipe"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  function listRecipes() {
    client.models.Recipe.observeQuery().subscribe({
      next: (data) => setRecipes([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
    listRecipes();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  function createRecipe(){
    client.models.Recipe.create({
      // id: randomly generated,
      title: window.prompt('Recipe title'),

    });
    console.log('hit create recipe');
  }

  function deleteTodo(id: string){
    client.models.Todo.delete({id})
  }

  function deleteRecipe(id : string){
    client.models.Recipe.delete({ id })
  }

  return (
    <Authenticator>
      {({signOut, user}) => (
        <main>
          <h3>{user?.signInDetails?.loginId}</h3>
          <h1>Welcome!</h1>
          <button onClick={createTodo}>+ new todo</button>
          <button onClick={createRecipe}> + new recipe</button>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} onClick={() => deleteTodo(todo.id)}> content:{todo.content}</li>
            ))}
          </ul>
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.id} onClick={() => deleteRecipe(recipe.id)}> title:{recipe.title} : {recipe.createdAt}</li>
            ))}
          </ul>
          <div>
            🥳 App successfully hosted. Try creating a new todo or recipe.
            <br />
            <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
              Review next steps of this tutorial.
            </a>
            <br/>
            <button onClick={signOut}>Sign Out</button>
          </div>
        </main>
      )}
    </Authenticator>
  );
}
