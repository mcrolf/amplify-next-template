import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a.model({
    content: a.string(), 
  }).authorization((allow) => [allow.publicApiKey()]),

  User: a.model({
    id: a.id(),
    username: a.string(),
    firstname: a.string().required(),
    email: a.email().required(),
    birthday: a.date(),
    myRecipes: a.hasMany('Recipe', 'author'), //author is user id.
    savedRecipes: a.id().array(), //array of recipe id from other authors.
    following: a.id().array(), //can be user id or store id.
    eventsAttended: a.id().array(), //array of event id.
    //achievements: a.hasMany('Achievement', 'user'),
    //transactions: a.hasMany('Transaction', 'user'),
    //settings: a.hasOne('Settings', 'user'),
    //notifications: a.hasMany('Notification', 'user')
  }).authorization((allow) => [allow.publicApiKey()]),

  Recipe: a.model({
    id: a.id(). required(),
    userId: a.id(), //reference field
    author: a.belongsTo('User', 'userId'),
    title: a.string(),
    createdOn: a.datetime(),
    drinkType: a.string(),
    coffee: a.string().array(), //beans go here.
    drinkAdditions: a.string().array(),
    waterTemp: a.string(),
    brewRatio: a.string().array(), //max 2, in:out.
    extractionTime: a.string(),
    extraNotes: a.string(),
    //ratings: a.hasMany('Rating', 'recipe'), //recipe is recipe id.
  }).authorization((allow) => [allow.publicApiKey()]),

  Store: a.model({
    id: a.id().required(),
    name: a.string().required(),
    address: a.string(),
    location: a.customType({
      lat: a.float(),
      long: a.float()
    }),
    events: a.hasMany('Event', 'author'), //author is store id.
    followers: a.id().array(), //array of user id.
    //inventory: a.hasOne('Inventory', 'store'), //store is store id.
    ecommerceAPI: a.string(),
    transactions: a.id().array(), //array of transactions id where this.id = transaction.storeid.
    ein: a.string(), //business ein
    paymentVerified: a.boolean(),
    admins: a.id().array(), //array of user id.
  }).authorization((allow) => [allow.publicApiKey()]),

  Event: a.model({
    id: a.id().required(),
    storeId: a.id(), //reference field
    author: a.belongsTo('Store', 'storeId'),
    title: a.string(),
    address: a.string(),
    location: a.customType({
      lat: a.float(),
      long: a.float(),
    }),
    startTime: a.datetime(),
    endTime: a.datetime(),
  }).authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
