# @onlyoffice/document-editor-react

This repo contains the ONLYOFFICE Docs React component which integrates [ONLYOFFICE Document Server](https://github.com/ONLYOFFICE/DocumentServer) into [React](https://react.dev/) projects.

**Please note**: Before working with this component, you need to install ONLYOFFICE Docs. To do so, you can use [Docker](https://github.com/onlyoffice/Docker-DocumentServer) (recommended).

## Prerequisites

This procedure requires [Node.js (and npm)](https://nodejs.org/en).

## Creating the demo React application with ONLYOFFICE Docs editor

This procedure creates a [basic React application](https://github.com/facebook/create-react-app) and installs an ONLYOFFICE Docs editor in it.

1. Create a new React project named *onlyoffice-react-demo* using the *Create React App* package:
```
npx create-react-app onlyoffice-react-demo
```

2. Go to the newly created directory:
```
cd onlyoffice-react-demo
```

3. Install ONLYOFFICE Docs React component from **npm** and save it to the *package.json* file with *--save*:
```
npm install --save @onlyoffice/document-editor-react
```

4. Open the *./src/App.js* file in the *onlyoffice-react-demo* project and replace its contents with the following code:

```
import React, { useRef } from 'react';
import { DocumentEditor } from "@onlyoffice/document-editor-react";

var onDocumentReady = function (event) {
    console.log("Document is loaded");
};

var onLoadComponentError = function (errorCode, errorDescription) {
    switch(errorCode) {
        case -1: // Unknown error loading component
            console.log(errorDescription);
            break;

        case -2: // Error load DocsAPI from http://documentserver/
            console.log(errorDescription);
            break;

        case -3: // DocsAPI is not defined
            console.log(errorDescription);
            break;
    }
};

export default function App() {
    return (
        <>
            <DocumentEditor
                id="docxEditor"
                documentServerUrl="http://documentserver/"
                config={{
                    "document": {
                        "fileType": "docx",
                        "key": "Khirz6zTPdfd7",
                        "title": "Example Document Title.docx",
                        "url": "https://example.com/url-to-example-document.docx"
                    },
                    "documentType": "word",
                    "editorConfig": {
                        "callbackUrl": "https://example.com/url-to-callback.ashx"
                    },
                    "events": {
                        "onDocumentReady": onDocumentReady
                    }
                }}
                onLoadComponentError={onLoadComponentError}
            />
        </>
    );
}
```
Replace the following lines with your own data:
* **"http://documentserver/"** - replace with the URL of your server;
* **"https://example.com/url-to-example-document.docx"** - replace with the URL to your file;
* **"https://example.com/url-to-callback.ashx"** - replace with your callback URL (this is required for the saving functionality to work).

This JavaScript file will create the *App* component containing the ONLYOFFICE Docs editor configured with basic features.

5. Test the application using the Node.js development server:
* To start the development server, navigate to the *onlyoffice-react-demo* directory and run:
```
npm run start
```
* To stop the development server, select on the command line or command prompt and press *Ctrl+C*.

## Deploying the demo React application

The easiest way to deploy the application to a production environment is to install [serve](https://github.com/vercel/serve) and create a static server:
1. Install the *serve* package globally:
```
npm install -g serve
```

2. Serve your static site on the 3000 port:
```
serve -s build
```
Another port can be adjusted using the *-l* or *--listen* flags:
```
serve -s build -l 4000
```

3. To serve the project folder, go to it and run the *serve* command:
```
cd onlyoffice-react-demo
serve
```

Now you can deploy the application to the created server:
1. Navigate to the *onlyoffice-react-demo* directory and run:
```
npm run build
```
The *build* directory will be created with a production build of your app.

2. Copy the contents of the *onlyoffice-react-demo/build* directory to the root directory of the web server (to the *onlyoffice-react-demo* folder).

The application will be deployed on the web server (*http://localhost:3000* by default).

## API
### Props
| Name | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| `id` | string | null | yes | Component unique identifier. |
| `documentServerUrl` | string | null | yes | Address of ONLYOFFICE Document Server. |
| `shardkey` | string \| boolean | true | no | The string or boolean parameter required to request load balancing during collaborative editing: all users editing the same document are served by the same server. [Shard key](https://api.onlyoffice.com/docs/docs-api/get-started/how-it-works/#shard-key)|
| `config` | object | null | yes | Generic configuration object for opening a file with token. [Config API](https://api.onlyoffice.com/docs/docs-api/usage-api/config/) |
| `onLoadComponentError` | (errorCode: number, errorDescription: string) => void | null | no | The function called when an error occurs while loading a component |

## Storybook

Change the address of the document server in the *config/default.json* file:
```
"documentServerUrl": "http://documentserver/"
```

### Build Storybook:
```
npm run build-storybook
```
### Start Storybook:
```
npm run storybook
```

## Development

### Clone project from the GitHub repository:
```
git clone https://github.com/ONLYOFFICE/document-editor-react
```
### Install the project dependencies:
```
npm install
```
### Test the component:
```
npm run test
```
### Build the project:
```
npm run rollup
```
### Create the package:
```
npm pack
```

## Feedback and support

In case you have any issues, questions, or suggestions for the ONLYOFFICE Document Server React component, please refer to the [Issues](https://github.com/ONLYOFFICE/document-editor-react/issues) section.

Official project website: [www.onlyoffice.com](https://www.onlyoffice.com/). 

Support forum: [forum.onlyoffice.com](https://forum.onlyoffice.com/).
