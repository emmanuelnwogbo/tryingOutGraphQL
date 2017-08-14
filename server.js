const express = require("express");
const expressGraphQL = require("express-graphql");
const schema = require("./schema/schema");

const app = express();

app.use(
	"/graphql",
	expressGraphQL({
		schema,
		graphiql: true
	})
);

//<==== I started the express server below without graphql
//that explains that graphql is just one part of our express
//server; it's just a descrete part of the express server
//we can use express like we'd normally use it while also use
//including Graphql.====>
app.listen(4000, () => {
	console.log("Listening");
});
