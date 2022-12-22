## Assignment: Graphql

### Tasks:
1. (0.2) Add logic to the restful endpoints (users, posts, profiles, member-types folders in ./src/routes).
   1. npm run test - 100%
2. Add logic to the graphql endpoint (graphql folder in ./src/routes).  
Constraints and logic for gql queries should be done based on restful implementation.  
For each subtask provide an example of POST body in the PR. If the properties of the entity are not specified, then return the id of it.
   
   * (0.2) Get gql requests:  
   1. Get users, profiles, posts, memberTypes.
   2. Get user, profile, post, memberType by id.
   3. Get users with their posts, profiles, memberTypes.
   4. Get user by id with its posts, profile, memberType.
   5. Get users with their subscribers and subscribers for subscribers (for each user entity add their id and profile).
   6. Get user by id with its subscribers and subscribers for subscribers (for each user entity add their id and posts).
   7. Get user by id with those it is following.
   8. Get posts with their users.
   9. Get memberTypes with their profiles.  
   * (0.15) Create gql requests:   
   10. Create user.
   11. Create profile.
   12. Create post.
   13. Create user and profile. If the profile cannot be created then the user should not be saved.
   14. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.
   * (0.15) Update gql requests:
   15. Update user.
   16. Update profile.
   17. Update post.
   18. Add subscriber, delete subscriber and get id of updated user.
   19. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.

1. (0.2) Solve n+1 graphql problem with [dataloader](https://www.npmjs.com/package/dataloader) package in all places where it should be used.  
   1. List where the dataloader was used with links to lines of code.
2. (0.1) Limit the complexity of the graphql queries by their depth with [graphql-depth-limit](https://www.npmjs.com/package/graphql-depth-limit) package.  
   1. Show where the rule was used with link to line of code.
   2. Specify a POST body of gql query that ends with an error due to the operation of the rule.

### Description:  
All dependencies to complete this task are already installed.  
You are free to install new dependencies as long as you use them.  
App template was made with fastify, but you don't need to know much about fastify to get the tasks done.  
All templates for restful endpoints are placed just fill in the logic for each of them.  
Use the "db" property of the "fastify" object as database access methods ("db" is an instance of the DB class => ./src/utils/DB/DB.ts).  
Body, params have fixed structure for each restful endpoint due to jsonSchema (schema.ts files near index.ts).    

### Description for the 1 task:
Relations between entities:
* user(profileId) => profile(userId)
* profile(memberTypeId) => memberType(profileIds[])
* user(postIds[]) => post(userId)
* user(userSubscribedToIds[]) => user(subscribedToUserIds[])

As you can see, the connections are two-way by referencing id.  
E.g. if you are creating a profile, then you change related user's "profileId" field to be equal to the profile id.  
So that you can get user id from the profile (in userId field) and profile id from the user (in profileId field).

The presence of relations in the entities complicates the work with crud operations. E.g:
* If profile was deleted => change user's "profileId" field on null; remove profile id from memberType's "profileIds" array.
* If post was deleted => remove post id from user's "postIds".
* If user was deleted => delete user's profile; delete user's posts; remove user id references from other users (userSubscribedToIds[], subscribedToUserIds[]).

If operation cannot be performed, then throw an [http error](https://github.com/fastify/fastify-sensible#fastifyhttperrors) from http handler .  
The correctness of the selected error is not checked in the tests, but try to do it right.  
If operation is completed, then return an entity or array of entities from http handler (fastify will stringify object/array and will send it).  

To determine that all your restful logic works correctly => run the script "npm run test".  
But be careful because these tests are integration (E.g. to test "delete" logic => it creates the entity via a "create" endpoint).  

### Description for the 2 task:  
You are free to create your own gql environment: (or stick to the [default code-first](https://github.dev/graphql/graphql-js/blob/ffa18e9de0ae630d7e5f264f72c94d497c70016b/src/__tests__/starWarsSchema.ts))  
* choose schema-first or code-first.
* choose gql server, framework, adapter ([typegraphql](https://typegraphql.com/), [mercurius](https://mercurius.dev/#/), etc). 

### Description for the 3 task:
If you have chosen a non-default gql environment, then the connection of some functionality may differ, be sure to report this in the PR.  

### Description for the 4 task:  
If you have chosen a non-default gql environment, then the connection of some functionality may differ, be sure to report this in the PR.  
Limit the complexity of the graphql queries by their depth with "graphql-depth-limit" package.  
E.g. User can refer to other users via properties "subscribedToUser", "userSubscribedTo" and users within them can also have "subscribedToUser", "userSubscribedTo" and so on.  
Your task is to add a new rule (created by "graphql-depth-limit") in [validation](https://graphql.org/graphql-js/validation/) to limit such nesting to 8 levels max.
