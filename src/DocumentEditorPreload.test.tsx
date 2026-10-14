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
import { render } from "@testing-library/react";

import DocumentEditorPreload from "./DocumentEditorPreload";

const preloadIframe = (container: HTMLElement) =>
  container.querySelector<HTMLIFrameElement>("iframe[title='onlyoffice-preload']");

describe("DocumentEditorPreload", () => {
  test("renders a hidden iframe pointing to the preload page", () => {
    const { container } = render(
      <DocumentEditorPreload documentServerUrl="http://documentserver/" />
    );

    const iframe = preloadIframe(container);

    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute("src")).toBe(
      "http://documentserver/web-apps/apps/api/documents/preload.html"
    );
    expect(iframe!.style.display).toBe("none");
  });

  test("keeps the iframe out of the tab order and of the accessibility tree", () => {
    const { container } = render(
      <DocumentEditorPreload documentServerUrl="http://documentserver/" />
    );

    const iframe = preloadIframe(container)!;

    expect(iframe.getAttribute("tabindex")).toBe("-1");
    expect(iframe.getAttribute("aria-hidden")).toBe("true");
  });

  test("adds the missing trailing slash to the document server url", () => {
    const { container } = render(
      <DocumentEditorPreload documentServerUrl="http://documentserver" />
    );

    expect(preloadIframe(container)!.getAttribute("src")).toBe(
      "http://documentserver/web-apps/apps/api/documents/preload.html"
    );
  });

  test("removes the iframe on unmount", () => {
    const { container, unmount } = render(
      <DocumentEditorPreload documentServerUrl="http://documentserver/" />
    );

    unmount();

    expect(preloadIframe(container)).toBeNull();
  });
});
