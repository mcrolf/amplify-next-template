"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
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
      createdOn: new Date().getDate().toString(),

    });
  }

  return (
    <main>
      <h1>My recipes</h1>
      <button onClick={createRecipe}>+ new</button>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}> title:{recipe.title}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new recipe.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
    </main>
  );
}
