//this file contains all of the knowledge required for telling graphql
//exactly what your application's data looks like; including what properties
//each object has and exactly how each object is related to each other.

//the schema is what tells Graphql exactly what our data looks like

const graphql = require("graphql");
const axios = require("axios");
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull
} = graphql;

const CompanyType = new GraphQLObjectType({
	name: "Company",
	fields: () => ({
		id: {
			type: GraphQLString
		},
		name: {
			type: GraphQLString
		},
		description: {
			type: GraphQLString
		},
		users: {
			type: new GraphQLList(UserType),
			resolve(parentValue, args) {
				return axios
					.get(`http://localhost:3000/companies/${parentValue.id}/users`)
					.then(res => res.data);
			}
		}
	})
});

const UserType = new GraphQLObjectType({
	//the two required options of a graphql schema are name and fields: fields
	//is an object
	name: "User",
	fields: () => ({
		id: {
			type: GraphQLString
		},
		firstName: {
			type: GraphQLString
		},
		age: {
			type: GraphQLInt
		},
		company: {
			type: CompanyType,
			resolve(parentValue, args) {
				//console.log(parentValue, args);
				return axios
					.get(`http://localhost:3000/companies/${parentValue.companyId}`)
					.then(res => res.data);
			}
		}
	})
});

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLString } },
			resolve(parentValue, args) {
				//you can get data from any server here
				return axios
					.get(`http://localhost:3000/users/${args.id}`)
					.then(response => response.data);
			}
		},
		company: {
			type: CompanyType,
			args: { id: { type: GraphQLString } },
			resolve(parentValue, args) {
				return axios
					.get(`http://localhost:3000/companies/${args.id}`)
					.then(resp => resp.data);
			}
		}
	}
});

//defining our root mutation
const mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addUser: {
			type: UserType,
			args: {
				firstName: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
				companyId: { type: GraphQLString }
			},
			resolve(parentValue, { firstName, age }) {
				return axios
					.post(`http://localhost:3000/users`, { firstName, age })
					.then(res => res.data);
			}
		},
		deleteUser: {
			type: UserType,
			args: { id: { type: new GraphQLNonNull(GraphQLString) } },
			resolve(parentValue, { id }) {
				return axios
					.delete(`http://localhost:3000/users/${id}`)
					.then(res => res.data);
			}
		},
		editUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				firstName: { type: GraphQLString },
				age: { type: GraphQLInt },
				companyId: { type: GraphQLString }
			},
			resolve(parentValue, args) {
				return axios
					.patch(`http://localhost:3000/users/${args.id}`, args)
					.then(res => res.data);
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation
});
