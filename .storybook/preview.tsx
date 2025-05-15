import React from 'react';
import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, context) => {
      context.args.id = `${context.args.id}-${Date.now()}`;

      return (
        <div style={{ display: 'grid', height: "100%", minHeight: "400px" }}>
          <Story />
        </div>
      )
    },
  ],
};

export default preview;
