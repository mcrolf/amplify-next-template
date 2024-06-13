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
    // id is auto generated.
    username: a.string(),
    firstname: a.string().required(),
    email: a.email().required(),
    birthday: a.date(),
    myRecipes: a.hasMany('Recipe', 'userId'), //author is user id.
    savedRecipes: a.id().array(), //array of recipe id from other authors.
    following: a.id().array(), //can be user id or store id.
    eventsAttended: a.id().array(), //array of event id.
    achievements: a.hasMany('Achievement', 'userId'),
    transactions: a.hasMany('Transaction', 'userId'),
    settings: a.hasOne('Settings', 'userId'), //user is userId.
    notifications: a.hasMany('Notification', 'userId'),
  }).authorization((allow) => [allow.publicApiKey()]),

  DrinkType: a.enum([
    'Espresso',
    'Double_Espresso',
    'Red_Eye', 
    'Black_Eye', 
    'Americano', 
    'Long_Black', 
    'Macchiato',
    'Cortado',
    'Breve',
    'Cappuccino',
    'Flat_White',
    'Cafe_Latte',
    'Mocha',
    'Vienna',
    'Affogato',
    'Black_Coffee',
    'Iced_Coffee',
  ]),

  BrewMethod: a.enum([
    'Espresso',
    'Drip',
    'Pour_Over',
    'Cold_Brew',
    'AeroPress',
    'French_Press',
    'Turkish',
    'Percolator',
    'Moka_Pot',
    'Instant',
  ]),

  Recipe: a.model({
    // id is auto generated
    userId: a.id(), //reference field for author.
    author: a.belongsTo('User', 'userId'),
    title: a.string(),
    createdOn: a.datetime(),
    drinkType: a.ref('DrinkType'), //ref enum
    brewMethod: a.ref('BrewMethod'), //ref enum
    coffee: a.id().array(), //bean id goes here.
    drinkAdditions: a.string().array(),
    waterTemp: a.string(),
    brewRatio: a.string().array(), //max 2, in:out.
    extractionTime: a.string(),
    extraNotes: a.string(),
    //ratings: a.hasMany('Rating', 'recipe'), //recipe is recipe id.
  }).authorization((allow) => [allow.publicApiKey()]),

  Store: a.model({
    // id is auto generated.
    name: a.string().required(),
    address: a.string(),
    location: a.customType({
      lat: a.float(),
      long: a.float()
    }),
    events: a.hasMany('Event', 'storeId'), //store id reference.
    followers: a.id().array(), //array of user id.
    //inventory: a.hasOne('Inventory', 'store'), //store is store id.
    ecommerceAPI: a.string(),
    transactions: a.id().array(), //array of transactions id where this.id = transaction.storeId.
    ein: a.string(), //business ein
    paymentVerified: a.boolean(),
    admins: a.id().array(), //array of user id.
  }).authorization((allow) => [allow.publicApiKey()]),

  Event: a.model({
    // id is auto generated.
    storeId: a.id(), //reference field for author.
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

  Bean: a.model({
    //id is auto generated.
    name: a.string(),
    sku: a.string(),
    flavorProfile: a.string(), //FlavorProfile
    origin: a.string().array(), //could be multiple
    process: a.string().array(), //could be multiple
  }).authorization((allow) => [allow.publicApiKey()]),

  Settings: a.model({
    //id is auto generated.
    userId: a.id(), //reference field
    user: a.belongsTo('User', 'userId'),
    pushNotify: a.boolean(),
    events: a.boolean(),
    inventoryUpdates: a.boolean(),
    achievements: a.boolean(),
    following: a.boolean(),
  }).authorization((allow) => [allow.publicApiKey()]),

  Notification: a.model({
    //id is auto gen.
    userId: a.id(), //reference field.
    user: a.belongsTo('User', 'userId'),
    message: a.string(),
  }).authorization((allow) => [allow.publicApiKey()]),

  Achievement: a.model({
    //id is auto gen.
    userId: a.id(), //reference field.
    user: a.belongsTo('User', 'userId'),
    description: a.string(),
  }).authorization((allow) => [allow.publicApiKey()]),

  Transaction: a.model({
    //id is auto gen.
    userId: a.id(), //reference field.
    user: a.belongsTo('User', 'userId'),
    storeId: a.id(), //id of store transaction was made at.
    description: a.string(),
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
