/*
* (c) Copyright Ascensio System SIA 2026
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import React from "react";

export type DocumentEditorPreloadProps = {
  documentServerUrl: string;
};

const DocumentEditorPreload = (props: DocumentEditorPreloadProps) => {
  const { documentServerUrl } = props;

  let url = documentServerUrl;
  if (!url.endsWith("/")) url += "/";

  return (
    <iframe
      src={`${url}web-apps/apps/api/documents/preload.html`}
      title="onlyoffice-preload"
      tabIndex={-1}
      aria-hidden="true"
      style={{ display: "none" }}
    />
  );
};

export default DocumentEditorPreload;
