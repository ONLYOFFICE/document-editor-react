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
import { act, render, waitFor } from "@testing-library/react";

import type { Config } from "@onlyoffice/doceditor-types";

import DocumentEditor from "./DocumentEditor";

const config: Config = {
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
};

const withKey = (key: string): Config => ({
  ...config,
  document: { ...config.document!, key },
});

let openedKeys: string[];

const mockDocsAPI = () => {
  window.DocsAPI = {
    DocEditor: (id: string, editorConfig: Config) => {
      openedKeys.push(editorConfig.document!.key!);

      const target = document.getElementById(id)!;
      const iframe = document.createElement("iframe");
      iframe.setAttribute("name", "frameEditor");
      target.parentNode!.replaceChild(iframe, target);

      return {
        destroyEditor: () => {
          const placeholder = document.createElement("div");
          placeholder.setAttribute("id", id);
          iframe.parentNode?.replaceChild(placeholder, iframe);
        },
      } as any;
    },
  };
};

const editor = () => window.DocEditor?.instances["docxEditor"];

describe("DocumentEditor", () => {
  beforeEach(() => {
    openedKeys = [];
    mockDocsAPI();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    window.DocsAPI = undefined;
    window.DocEditor = undefined;
  });

  test("renders the DocumentEditor component", () => {
    render(
      <DocumentEditor
        id="docxEditor"
        documentServerUrl="http://documentserver/"
        config={config}
      />
    );
  });

  test("renders the placeholder inside a wrapper it owns", () => {
    const { container } = render(
      <DocumentEditor
        id="docxEditor"
        documentServerUrl="http://documentserver/"
        config={config}
      />
    );

    const wrapper = container.firstElementChild as HTMLElement;

    expect(wrapper.id).toBe("");
    expect(wrapper.style.display).toBe("contents");
  });

  test("unmounts without removing a node it does not own", async () => {
    const { unmount } = render(
      <DocumentEditor
        id="docxEditor"
        documentServerUrl="http://documentserver/"
        config={config}
      />
    );

    await waitFor(() => expect(editor()).toBeDefined());

    expect(() => unmount()).not.toThrow();
    expect(editor()).toBeUndefined();
  });

  test("can be mounted again after being unmounted", async () => {
    const first = render(
      <DocumentEditor
        id="docxEditor"
        documentServerUrl="http://documentserver/"
        config={config}
      />
    );

    await waitFor(() => expect(editor()).toBeDefined());
    await act(async () => { first.unmount(); });

    const second = render(
      <DocumentEditor
        id="docxEditor"
        documentServerUrl="http://documentserver/"
        config={config}
      />
    );

    await waitFor(() => expect(editor()).toBeDefined());
    expect(second.baseElement.querySelector("iframe[name='frameEditor']")).not.toBeNull();

    await act(async () => { second.unmount(); });
  });

  test("recreates the editor when the config changes", async () => {
    const { rerender, baseElement } = render(
      <DocumentEditor
        id="docxEditor"
        documentServerUrl="http://documentserver/"
        config={config}
      />
    );

    await waitFor(() => expect(editor()).toBeDefined());
    const first = editor();

    await act(async () => {
      rerender(
        <DocumentEditor
          id="docxEditor"
          documentServerUrl="http://documentserver/"
          config={withKey("aNewKey")}
        />
      );
    });

    expect(editor()).toBeDefined();
    expect(editor()).not.toBe(first);
    expect(openedKeys).toEqual(["Khirz6zTPdfd7", "aNewKey"]);
    expect(baseElement.querySelectorAll("iframe[name='frameEditor']")).toHaveLength(1);
  });
});
