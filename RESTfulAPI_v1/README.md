# Build a RESTful API using hapi.js and MongoDB

## RESTful API that:

- handles basic CRUD for an item (projects in this case)
- uses MongoDB to store and retrieve those projects
- validates the input and returns meaningful errors
- works with JSON data
- uses proper HTTP verbs (GET, POST, PATCH, DELETE)

## User Story

1. Register new project. Registration requires title, tpm_id, and sow_id.
2. Unique ID will be assigned with UUID generation for each new project
3. Retrieve project by uuid
4. Update project by uuid
5. Delete project by uuid

## Getting started
Node v6.8.1+ used to take advantage of ES6 features.
MongoDB server required and running on your localhost.

MongoDB s an open-source document database and leading NoSQL database. MongoDB is written in C++. It's focus is  cross-platform, document oriented database that provides, high performance, high availability, and easy scalability. MongoDB works on concept of collection and document.

 ''' git clone https://github.com/bcamacho/hapi-rest-mongo.git '''
 ''' cd RESTfulAPI '''
 ''' npm install '''  

 hapi.js is our http server. boom is used for http friendly errors. joi is used for the input validation. Both packages are from the hapi ecosystem. To access our db we use mongojs and uuid to generate the ids for our objects.

# Booting up a MongoDB Server
Let's boot up a MongoDB server instance. Download the right MongoDB version from MongoDB, open a new shell or command line and ensure the mongod command is in the shell or command line path. Now let's create a database directory (in our case under /data).

Install MongoDB server
https://www.mongodb.com/download-center?jmp=nav#community
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

Run the server with 2048MB RAM with dedicated dbase path to port 27017

''' ulimit -n 2048 && mongod --dbpath /Users/brandy/Development/hapiJs/RESTfulAPI_v1/database --port 27017 '''

# Begin using MongoDB.

To help you start using MongoDB, MongoDB provides Getting Started Guides in various driver editions.
https://docs.mongodb.com/manual/#getting-started
Before deploying MongoDB in a production environment, consider the Production Notes document.
https://docs.mongodb.com/manual/administration/production-notes/
Later, to stop MongoDB, press Control+C in the terminal where the mongod instance is running.

# CURL Commands

## Get all projects
curl -X "GET" "http://localhost:3000/v1/projects"

## Post new project
curl -X "POST" "http://localhost:3000/v1/projects" \
     -H "Content-Type: application/json" \
     -d "{\"title\":\"{TITLE}\",\"tpm_id\":\"{TPM_ID}\",\"sow_id\":\"{SOW_ID}\"}"

## Get projects by ID
curl -X "GET" "http://localhost:3000/v1/projects/{PROJECT_ID}}"

## Update project by id
curl -X "PATCH" "http://localhost:3000/v1/projects/{PROJECT_ID}}" \
     -H "Content-Type: application/json" \
     -d "{\"title\":\"{TITLE}\",\"tpm_id\":\"{TPM_ID}\",\"sow_id\":\"{SOW_ID}\"}"

## Delete project by ID
curl -X "DELETE" "http://localhost:3000/v1/projects/{PROJECT_ID}}" \
    -H "Content-Type: application/json" \
    -d "{}"
