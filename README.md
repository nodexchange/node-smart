## User Authentication and dashboard With Passport and Express 4

## INSTALL
[sudo] npm install

## TO START:
1. mongod --dbpath /home/martinwojtala/Workspace/db/
2. node ./bin/www

## CURRENT ROUTES:
http://localhost:3000
http://localhost:3000/dashboard
http://localhost:3000/login

## DEBUG CALLS:
http://localhost:3000/debug/add?action=add&section=activity (add dummy activities to db)
http://localhost:3000/debug/log?action=add&section=activity
http://localhost:3000/debug/flush?action=add&section=activity

##[Windows]
install mongod (custom location):
https://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/

##Good terminal app:
conEmu:
C:\mongodb\bin\mongod.exe --dbpath c:\Users\martin\Workspace\mongodb
(make sure to create the folder first)

git bash:
C:/mongodb/bin/mongod.exe --dbpath c:/Users/martin/Workspace/mongodb
HP:
C:/Program\ Files/MongoDB/Server/3.2/bin/mongod.exe --dbpath C:/Users/thronesprince/Workspace/mongod

Then:
mongod --dbpath /home/martiQnwojtala/Software/DB
