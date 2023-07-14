# Node.js Sticky Notes API

Sample RESTful API built on top of Node.js and TypeScript to create and manage sticky notes.

This application demonstrates the usage of Node.js and TypeScript to build maintainable software, combining modern architecture, libraries, and tools commonly used in everyday development.

# Technologies

The API is built using the following technologies and libraries:

- [TypeScript](https://www.typescriptlang.org/) - Syntactic superset of JavaScript which adds static typing.
- [Express.js](https://expressjs.com/) - Node.js web framework.
- [PostgreSQL](https://www.postgresql.org/) - Relational database to store sticky notes.
- [Sequelize](https://sequelize.org/) - Node.js and TypeScript ORM.
- [TSOA](https://tsoa-community.github.io/docs/) - to generate Swagger documentation that following OpenAPI standards.
- [Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express) - module that allows serving auto-generated Swagger API docs.
- [Nodemon](https://www.npmjs.com/package/nodemon) - Tool to run Node.js applications in development mode.
- [ESLint](https://eslint.org/) - Tool to analyze and fix problems and syntax in JavaScript and TypeScript applications.
- [ts-node](https://www.npmjs.com/package/ts-node) - TypeScript execution and REPL for node.js, with source map and native ESM support.
- [bcrypt](https://www.npmjs.com/package/bcrypt?activeTab=readme) - Library to help you hash passwords.
- [dotenv](https://www.npmjs.com/package/dotenv) - zero-dependency module that loads environment variables from a `.env` file.
- [Helmet.js](https://helmetjs.github.io/) - Helmet helps secure Express apps by setting HTTP response headers.
- [joi](https://joi.dev/) - Schema description language and data validator for JavaScript.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - Package that generates JSON web tokens in JavaScript.
- [cors](https://www.npmjs.com/package/cors) - Node.js CORS middleware.

# API Design

The API sends and receives API resources via API endpoints. Each API resource is represented by a class. Data is stored in a PostgreSQL database instance using Sequelize.

There are 5 endpoints exposed to manage sticky notes:

- A `[POST] /api/notes` route to save new sticky notes in the database.
- A `[PATCH] /api/notes/{id}` route to update sticky notes.
- A `[DELETE] /api/notes/{id}` route to remove sticky notes.
- A `[GET] /api/notes` route to query sticky notes.
- A `[GET] /api/notes/{id}` route to retrieve sticky notes by their IDs.

These routes are protected and you need to generate a JSON Web Token to access them. You can generate tokens using the route `[POST] /api/login`. To include JSON Web Tokens in HTTP requests, use the `Authorization` header. The header value should be formatted like this: `Bearer json_web_token_here`.

You can seed a default user to the database by running `npm run seed` in the `src` folder. You need to create a `.env` file and configure it as follows to correctly connect to the database and run the API:

```
PORT=3000
DATABASE_HOST=localhost
DATABASE_USER=postgres
DATABASE_PASSWORD=pa$$word123
DATABASE_NAME=sticky_notes_node
JWT_PRIVATE_KEY=very_long_and_random_key_to_prevent_security_issues
```

You can use the `.env.example` file as reference. You may need to change the file `src/db/config/db-config.json` to match the configuration you have in your `.env` file due to how the Sequelize CLI works.

The list route implements a sorting and pagination pattern that I usually apply in both my personal and professional applications. This pattern is highly flexible, allowing API callers to specify a page and number of items to return in a request. It is also possible to use any valid model field for sorting. In the client-side app, I use the pattern to sort sticky notes by creation date.

# How to Run the Application

To run the application, open the `src` folder using the terminal or command prompt and run the following commands:

```
npm install
npm run seed
npm run develop
```

This will synchronize database data and start the application. Navigate to `http://localhost:3000/swagger/` to see the Swagger documentation.

You can create a production build by running `npm run build`. This command creates a `dist` folder with production-ready code.

If you add more API routes to this application, you will need to update the Swagger specification file. Run `npm run swagger-spec` to update it.

![Swagger View](https://github.com/evgomes/node-notes-api/main/images/swagger-view.png)