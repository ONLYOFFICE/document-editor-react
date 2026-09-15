# Change Log

## [Unreleased]
- fix the editor not being reusable after unmounting the component, for example on a soft navigation
- the editor placeholder is now rendered inside a wrapper element, which is kept out of layout with display: contents

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
