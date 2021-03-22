> React app to develop your search interface to be used with Datafari

## Contents

- [About Datafari UI](#about-datafari-ui)
- [Getting started](#getting-started-)
- [Creating a search experience](#creating-a-search-experience)
- [FAQ](#faq-)
- [Contribute](#contribute-)
- [License](#license-)

---

## About Datafari UI

A **[React](https://reactjs.org)** app bottstraped using **[create react app](https://github.com/facebook/create-react-app)** and using
**[MaterialUI](https://material-ui.com/)** that allows you to quickly implement search experiences to couple with **[Datafari](https://www.datafari.com/)**.

### Features

- **By Datafari, for Datafari** - Maintained by [France Labs](https://www.francelabs.com/), the team behind [Datafari](https://www.datafari.com/).
- **Speedy Implementation** - Build a complete search experience with a few lines of code.
- **Customizable** - Tune the components, markup, styles, and behaviors to your liking.

<img src="readme/images/screenshot.png" width="800">

## Getting started

Before trying to modify anything, you can try building the React application and deploy it wherever you want to have
you first own UI for Datafari.

To do so you will need to perform some steps:

1. Install an instance of Datafari on a server or VM of yours
2. Install [nodejs](https://nodejs.org/en/) (together with its packet manager npm) to build the React app.
3. Clone the [datafariui repository](https://github.com/francelabs/DatafariUI) and configure the React app to work with your environment
4. Build the React app
5. Deploy the React app on a web server

### Install an instance of Datafari

You will first need to install an instance of the last version of Datafari using the [documentation](https://datafari.atlassian.net/wiki/spaces/DATAFARI/overview).

### Install nodejs on the machine you plan to build the React app on

You can build the project on any machine (your local machine, a VM, anything) but you will need nodejs to run the build.
Install it from your OS package manager or follow the instructions on the [nodejs](https://nodejs.org/en/) website.

### Clone the datafariui repository and configure the app for you environment

Clone the [datafariui repository](https://github.com/francelabs/DatafariUI)

```sh
git clone https://github.com/francelabs/DatafariUI.git
```

We will suppose that our datafari instance is deployed at myhost.test.com and uses the default deployment parameters used when following the documentation.
We will suppose that we want to deploy datafariui at myuihost.test.com/datafariui.

Open the file `src/index.js` and change the line declaring the datafariBaseURL to match the base URL of your Datafari instance
(it should end in /Datafari if you have followed the documentation for the installation):

```js
window.datafariBaseURL = new URL('https://myhost.test.com/Datafari');
```

In the file `.env.production` change the PUBLIC_URL variable to match the path you will use to access Datafari UI on the server you will deploy it to.
By default, it is set to /datafariui which means the UI is accessed through a URL like this: `https://myuihost.test.com/datafariui`.
If you want to use another path, you must change this variable. It can be set to `/` it you deploy the app at the root of a domain.
In our exemple, we do not need to change it:

```
PUBLIC_URL=/datafariui
```

### Build the React App

You can now build the application, to do so first install all the dependencies and then build the app by running the following commands:

```sh
npm install
# Wait for the install process to download all the dependencies and then
npm run build
```

### Deploy the React app on a web server

Once the process is finished, you can take the content of the build directory and copy it to the root folder of a web server you want to deploy your Datafari UI to.
Any URL that does not correspond to an existing file should be redirected to the index.html file.
A possible Directory configuration when using Apache2 as the web server is the following (considering that we copied the content of the build directory of the project to the
folder /opt/datafari/www of our server):

```apache
<Directory "/opt/datafari/www">
  Require all granted
  Options -MultiViews
  RewriteEngine On
  RewriteBase "/datafariui/"
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteRule "^" "index.html" [QSA,L]
</Directory>
```

Note that the rewrite rule is set to serve the directory under `/datafariui`. If you want to serve the UI under another path, change all instances of `/datafariui/` by the same
path you set in the PUBLIC_URL variable earlier.

You then also need to setup a virtual host or an Alias directive to serve the directory. Please refer to the Apache2 documentation for that.
If you are using another web server or have difficulties configuring it, search the documentation about deploying React applications created with create react app

For reference, here is an excerpt of the configuration we use for testing to give you an idea, but it is not guarenteed to work as is for you:

```apache
<VirtualHost *:80>
  ServerName myuihost.test.com
  Redirect / https://myuihost.test.com/
  CustomLog /dev/null common
  Header set X-Frame-Options SAMEORIGIN
</VirtualHost>

<VirtualHost *:443>
  ServerName myuihost.test.com
  ServerAdmin postmaster@myuihost.test.com
  Header set X-Frame-Options SAMEORIGIN

  RedirectMatch ^/$ /datafriui

  Alias /datafariui /opt/datafari/www/
  <Directory "/opt/datafari/www">
    Require all granted
    Options -MultiViews
    RewriteEngine On
    RewriteBase "/datafariui/"
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule "^" "index.html" [QSA,L]
  </Directory>

  SSLEngine on
  SSLCertificateFile /opt/ssl-keystore/apache/mycert.crt
  SSLCertificateKeyFile /opt/ssl-keystore/apache/mycert.key

  CustomLog /var/apache/logs/customLogApache.log common
  ErrorLog /var/apache/logs/errorApache.log

</VirtualHost>
```

Once all of this is done, you should be able to use the default UI proposed by DatafariUI at https://myuihost.test.com/datafariui

## Creating a search experience

DatafariUI comes with a default interface that you are free to update and modify as you need.
You can update only the theme (colors, font), logos and parameters of certain components or dive deeper and add new components or change the look and feel of existing ones.
This section will give you information about how to do this.

### Modifying the themes and logos

DatafariUI relies on the [MaterialUI](https://material-ui.com/) library for the development of its components as well as the theming.
Therefore you can easily change the font, the accent colors or any other color or spacing property quite easily from only one file: `src/App.js`.
WIthin this file you will find at the begining the definition of the default theme:

```jsx
const defaultTheme = createMuiTheme({
  overrides: {
    MuiFilledInput: {
      root: {
        backgroundColor: '#fafafa',
      },
    },
  },
  typography: {
    fontFamily: 'montserrat, Helvetica, Arial, sans-serif',
  },
  palette: {
    primary: {
      light: '#ffffff',
      main: '#ffffff',
      dark: '#fafafa',
    },
    secondary: {
      light: '#99cc33',
      main: '#679439',
      dark: '#648542',
    },
  },
});
```

The primary palette is used for most of the background colors whereas the secondary main color is the accent color (the green by default) you will find in various places of the interface
(including links). A lighter and darker version are defined for use where necessary.

The typography section also defines the font used in the interface.

The overrides section at the top allows to modify the default background color used in input fields for the default theme because it didn't suited us.

Feel free to have a look at the [MaterialUI documentation](https://material-ui.com/customization/theming/) about theming for more details on what can be changed here.

### Changing components parameters or adding elements

DatafariUI tries to take advantage of the components based approach proposed by React, making it easier to add / remove elements from the interface.
We will provide a quick rundown of the project structure for you to have a better understanding of where things are. Then we will provide you
with more information about the key things you will probably want to customize.

### Project structure

The project structure is pretty simple.

If you are not familiar with React, the hooks (`src/Hooks`) are sets of helper functions that provide a functionality that can be easiely reused in several places of the app.
The contexts (`src/Contexts`) are sets of variables that can be accessed throughout the application.
This is very simple way of seeing and understanding things, there is more to it and I encourage you to read more about them if you want to modify the existing ones / create your owns.
We will not modify or even use those in this section. Menus are defined as components, so you might want to modify them here is you want to change menu items.

Singular components are defined in the `src/Components` folder.
They take advanteage of the tools provided in hooks (`src/Hooks`) and variables provided in the contexts (`src/Contexts`) to provide simple reusable components.
They are made to be used in any places of the UI.

The `src/Pages` folders gather all the different interfaces defined in DatafariUI. It regroups all pages as well as all the modals you can see in teh interface.
They use the Components and place them on the page to form usable interfaces.
This is where most of your customization will happen.

### Facets

The central interface in DatafariUI is the search page, which is defined in `src/Pages/Search/Search.js`.
This is where you will define which facet are added to the side panel for exemple.
Query and Field facet are both defined as Components and can be used simple, you will find some exemple in the `src/Pages/Search/Search.js` file.

### Search results display

The display of results is managed by the components defined in the `src/Components/ResultsList` folder.
The `ResultEntry` component defines how a single result is displayed while the `ResultList` component defines how
the list of entries is displayed. You can modify those to change which properties of the results are shown or the way results are displayed to suits your preferences.

### Logo

The logo displayed in the top left corner is an SVG file that must be changed in the app before building it.
The file to change is `src/Icons/top_left_logo.svg`.

## License 📗

[Apache-2.0](https://github.com/elastic/search-ui/blob/master/LICENSE.txt) © [France Labs](https://www.francelabs.com/)
