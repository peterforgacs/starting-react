## Getting started with javascript build tools

I wanted to learn and test React so as my first attempt i've tried to install a full react development environment.

This did not went well, i had no idea how webpack is using babel to convert my react code. So i have started to explore each element first as an introduction to modern javascript build systems.

## The core of the problem

Javascript is a continously evolving language that allways has to be compatible with previous versions. Some of the newer features are really cool but you can't really use them unless you polyfill aka. make them work on older browsers.

As a next level some frameworks invent their own file types like React and TypeScript that assumes that you have a build system specifically intended to "compile" those files.

Additionally modern standards require you to bundle your assets so instead of serving 10 javascript files you only serve one giant file to the client.

The idea basically is to parse your projects files, polyfill them and turn them into regular javascript, bundlem them up and server from a webserver to a client with any browser. 

## Babel

I've started with babel since it seems the most crucial.   
Its main job is to polyfill code.

### Babel-cli

Using babel cli is not the standard way of using babel in a project but i think it gives more intuition about whats happening.

Babel-cli is actually giving a command line interface to the **babel-core** package that does most of the work.

```sh
mkdir babel
cd babel
npm init -y
npm install npx -g
```

I've created a test file called app.js:

```js
class Widget {
	constructor(elem, name){
	  this.$elem = elem;
	  this.name  = name;
	} 
} 
```

Im using **npx** package to run from the node_modules folder without having to type ./node_modules/bin/babel.

You have to specify what things you want to polyfill. This is done trough babel presets:

```sh
npm install babel-preset-es2015
```

Now i can transform my app.js to compiled.js and babel will polyfill the es2015 parts.

```sh
npx babel app.js --outfile compiled.js presets=es2015
```

This creates a new file:

```js
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Widget = function Widget(elem, name) {
  _classCallCheck(this, Widget);

  this.$elem = elem;
  this.name = name;
};
```

### Deciding what gets polyfilled

There are two ways to set what babel does.
* **plugins** - Define a polyfillable element or some action like uglify.
* **presets** - Defines a group of plugins.

Getting preconfigured presets seems the way to go. 

### .babelrc

Instead of adding to the command line as an option i can create a JSON file called .babelrc that lets me specify what presets and plugins i want to use with babel.

```js
{
	"presets": ["es2015"]
}
```

This way i can simply call: 

```sh
npx babel app.js --outfile compiled.js
```

And the same file gets generated.

Additionaly i can also set:

* Which files and directories are affected.  
* How to output the new files.  
* Wether or not automatically watch files.

## Webpack

Webpack is all about creating a single file from multiple files.  
The main idea is that you specify an entry point probably a javascript file and webpack traverses the dependencies of that file and build a graph out of it.    

When the graph is done it gets created in a new file.

```sh
npm install webpack
```

If we have a file called app.js.

```javascript
console.log('hello world!');
```

And i run

```sh
npx webpack app.js bounlde.js
```

This creates a bundle.js that contains the contents of app.js and if it had any dependencies those aswell.

I can add a module to the boundling so specific set of actions are performed on the file before actually being added to the bundled file.

## Using webpack with Babel trough babel-loader

This is **how you can connect babels polyfill functionality with webpack's boundling**.

```sh
npm install babel-core babel-preset-es2015 babel-loader webpack
```

* babel core - The thing that does the polyfilling
* babel-preset-2015 - The rules we want to polyfill
* babel-load - Middleware for webpack
* webpack - Bundler

I create a .babelrc file to specify babels preset.

```sh
echo ' {"presets": ["es2015"]} ' > .babelrc  
```

Now i can add the babel loader as a module to my webpack command.

```sh
npx webpack app.js bundle.js --module-bind js="babel-loader"
```

This creates a bound.js file that contains the babel polyfilled version of my code from app.js.

## webpack.config.js

In the previous command we used " --module-bind js="babel-loader"" to add a loader to a specific file type. The loader basically means some action before the bundling happens.

Instead of using command line parameters we can (and should) use the webpack.config.js file to set up the parameters.

```js
var webpack = require('webpack'),
path = require('path');

module.exports = {
entry: {
	main: './src/app.js'
},
output: {
	path: path.join(__dirname, 'dist'),
	filename: 'bundle.js'
},
module: {
	loaders: [{
		test: /.es6.js$/,
		loader: 'babel-loader',
		exclude: /node-modules/,
		query: {
		 presets: ['es2015']
		}
	}]
}
};
```

In this file we define an entrypoint where the graph creation will start.

Also define a module that matches all js files es6.js?$ and pushes a babel command on them with the preset es2015 set.

We can add additional modules for css or jsx for React.

Now if we run simply webpack the same thing happens as previously.

## Using React with Babel and Webpack

With react we have 2 options.  
Use regular js files and manually call the React methods.  
Use the jsx format which acts as sugar and compile it to regular javascript.

If we want to use jsx format we need to compile it with babel and then bundle it to the rest of the files.

The only difference is that we have install babels react preset and add it to the query in the webpack.config.js file.

Make sure to install both **react** and **react-dom** package!

## Better workflow with webpack

Bundling your files over and over with webpack is not an ideal experience. There are two packages that are pretty simple to use but worth the hassle of setting up in my limited experience.

### webpack-dev-server

```sh
npm install webpack-dev-server --save-dev
npx webpack-dev-server
```

This fires up an express server in your current directory, serving all the files and also calls rebundles on a file change.  

One important thing is that webpack-dev-server does not write to the disk instead servers it's own version of the bundled file from memory.  

So if you have your bundled file in a different directory then the root of the webpack-dev-server webserver you have to add a **publicPath** property to you webpack.config.js.

```js
output: {
	path: path.join(__dirname, 'dist'),
	filename: './bundle.js',
	publicPath: "/dist/"
}
```

Also if you want to update the bundled file you still have to run regular webpack.

You can enable hot reloading of the browser and better output with:

```sh
npx webpack-dev-server --progress --color --hot
```

### webpack-dashboard

```sh
npm install webpack-dashboard --save-dev
npx webpack-dashboard
```

In order for it to work you need to add this to webpack.config.js:

```js
plugins: [
    new DashboardPlugin()
]
```

This fires up a good looking terminal dashboard that makes it easier to monitor if you have a syntax error or something that breaks the build.

The webpack-dev-server must run before the dashboard so i've created a script in package.json for it.

```js
 "start": "npx webpack-dev-server --progress --colors --hot& webpack-dashboard"
```

Now if i run npm start the automatic bundling starts, hot reloads in any changes.