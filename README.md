# Kirin Project
A demonstration project. It represent a BBS with some social functionality, like an activity stream. It's not aimed to run as an application, but to show coding skills.

It's also a playground to play with React 16.3 new Context API (through react-contextual package), and Node's HTTP2 implementation.

## Requirements
Node >= 10.0.  
PostGreSQL === 9.4 (We target gandi's simplehosting)

## Target
Last 2 browser.

## Installation

```npm i```  
npm install may require --unsafe-perm=true parameters to install sharp (image manipulation library) and bcrypt.

```npm run buildDB```  
To build a sample database, mostly for development.

```npm run build:dev``` or ```npm run build:prod```  
Finally build the app.

## NPM's scripts

```npm start```  
Start the app in production environment.

```npm run dev```  
Start the in development environment.

```npm run build:watch```  
Run rollup watcher during development.
## Thoughts on some used packages  
                                      
```pino``` is used as a log engine, it's fare more efficient than a more classical ```winston```.
                                      
The same idea apply to ```sharp```, an image processing module, chosen instead of an image magick module due to its performance.
                                      
Performance IS NOT a feature =)

## Folder's content
```
.
|-- /config  
|   Contains configuration files
|-- /locales
|   Contains translation files.
|-- /public
|   Contains compiled front-end assets.
|-- /src
    |-- /server
    |   An express server application.
        |-- /controllers
        |   Contains Express's route handler.
        |-- /enums
        |   Java's Enum like implementation. 
        |   The idea is to save Integer in DB, but keep readable code.
        |-- /factories
        |   Sometimes factories.
        |-- /helpers
        |   Contains helper methods.
        |-- /middlewares
        |   Containes middlewares and / or middleware's configurations.
        |-- /models
        |   Models are implemented with Sequelize.JS.
        |-- /routers
        |   Contains Express's routers.
        |-- /services
        |   Contains business logic related code..
        |-- /views
        |   Compiled react views for SSR.
    |-- /www
    |   A react client application.
        |-- /app
        |-- Containes SPA related files
        |-- /components
        |-- /css
        |-- /layouts
        |-- /pages
        |   The actual page contenent.
        |-- /utils
        |-- /home.jsx
        |   the homepage entry point.
        |-- /main.jsx
        |   The SPA entry point.
```