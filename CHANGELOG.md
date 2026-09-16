# Change Log

## [Unreleased]
- added DocumentEditorPreload component for caching the editor static assets before a document is opened (ONLYOFFICE Docs 9.0 and later)
- deprecated the legacy flat props (document_fileType, document_title, documentType, editorConfig_lang, height, type, width and all events_* callbacks) in favor of the config object
- fix the editor not being reusable after unmounting the component, for example on a soft navigation
- the editor placeholder is now rendered inside a wrapper element, which is kept out of layout with display: contents
- the editor is built from the current config when it changes while api.js is still loading
- fix an editor being left behind when the component is unmounted while api.js is still loading

## 2.2.0
- added @onlyoffice/doceditor-types for document editor type definitions

## 2.1.1
- fix IConfig (fields pointerMode and slidePlayerBackground is not required)

## 2.1.0
- update IConfig for Document Server v8.3 and v9.0

## 2.0.0
- added support React 19
- updated IConfig

## 1.6.0
- added shardkey property

## 1.5.1
- IConfig->document is not required

## 1.5.0
- added props events_onRequestUsers
- fix re-rendering of component after init editors

## 1.4.1
- improved load api.js
- updated IConfig
- bump dependencies

## 1.3.0
- extended IConfig

## 1.2.0
- added component property onLoadComponentError()

## 1.1.0
- added IConfig

## 1.0.0
- Initial release
