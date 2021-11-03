# Groupomania, project 7 for Openclassrooms by Adrien Auxent

With boiler-plate inspired by : https://dev.to/juliest88/how-to-build-rest-api-with-nodejs-express-and-mysql-31jk

Front end of project can be found at : https://github.com/dridritwo/auxent-adrien-groupomania-front

### Getting Started

``` sh

## Import mysql database using Command line 

#Navigate to project source

#connect to mysql
mysql -u [db_username] -p[db_password]

#create the database using this command in mysql
source src/db/create-db.sql

Coppy .env-example and create your own .env file and add your mysql username, mysql password and db name

ex :
DB_HOST=localhost
DB_USER=db_username
DB_PASS=db_password
DB_DATABASE=groupomania
PORT=3000
SECRET_JWT=YOUR_SECRET

# Install dependencies
npm install

# Run the server locally
npm start

# Run the server locally in dev mode
npm run dev
```

**Enjoy :)**
