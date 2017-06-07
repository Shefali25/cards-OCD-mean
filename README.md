## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

```bash
$ npm install -g bower
```

To install the dependencies, run this in the application folder from the command-line:

```bash
$ npm install
```

## Running Your Application

Run your application using npm:

```bash
$ npm start
```

Your application should run on port 3000 with the *development* environment configuration, so in your browser just go to [http://localhost:3000](http://localhost:3000)


## Running your application with Gulp

The MEAN.JS project integrates Gulp as build tools and task automation.

We have wrapped Gulp tasks with npm scripts so that regardless of the build tool running the project is transparent to you.

To use Gulp directly, you need to first install it globally:

```bash
$ npm install gulp -g
```

Then start the development environment with:

```bash
$ gulp
```

It is also possible to run any Gulp tasks using npm's run command and therefore use locally installed version of gulp, for example: `npm run gulp eslint`
