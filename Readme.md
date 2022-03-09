## Docker Images are in the following Repositories:
cbanerjee/edureka-nodejs-admin-app

cbanerjee/edureka-nodejs-customer-app

cbanerjee/edureka-nodejs-nginx-module

## After pulling the docker repos (using docker pull <repo>) please run the following commands
### Go to the directory nginx-proxy
cd ./ngnix-proxy
#### run the docker-compose command
# docker-compose up

### Runtime Details
Access the customer facing module from http://localhost or http://localhost:3000/
Access the admin module from http://localhost:3100/

the chatbox can be opened in a separate window through http://localhost:3300/

Sports Page data is fetched dynamically from newsapi server for the country INDIA

MongoDB connections are made to mongodb cloud server using my credentials, the details are in /config/mongodb.js in both ./admin and ./customerfacing folders.
