import React from "react";
import { render } from "@testing-library/react";

import DocumentEditor from "./DocumentEditor";

describe("DocumentEditor", () => {
  test("renders the DocumentEditor component", () => {
    render(
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
    );
  });
});
