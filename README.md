React component for ONLYOFFICE Document Server

Install the project dependencies:
`yarn install`

Test component:
`yarn test`

Create package:
`yarn rollup && npm pack`

Example:
```
<DocumentEditor
  id="docxEditor"
  documentserverUrl="http://documentserver/"
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
    }
  }}
/>
```

Properties:

`id` - identifier of element

`documentserverUrl` - address ONLYOFFICE Document Server

`config` - generic configuration object for opening a file
