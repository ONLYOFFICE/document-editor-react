import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import filesize from "rollup-plugin-filesize";

const pkg = require("./package.json");

const globals = {
  react: "React",
  "react-dom": "ReactDOM",
};

export default [
  {
    input: "src/index.ts",
    output: [
      // {
      //   file: pkg.main,
      //   format: "cjs",
      //   //sourcemap: false,
      //   globals,
      // },
      {
        file: pkg.module,
        format: "esm",
        //sourcemap: false,
        globals,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        preferBuiltins: true,
      }),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      terser(),
      filesize(),
    ],
    //external: [...Object.keys(pkg.peerDependencies || {})],
  },
  {
    input: "dist/esm/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
  },
];
