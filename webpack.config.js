const path = require("path");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";
  const distPath = path.resolve(__dirname, isProd ? "docs" : "dist");
  return {
    devServer: {
      contentBase: distPath,
      compress: isProd,
      port: 8000
    },
    entry: "./app/index.ts",
    output: {
      path: distPath,
      filename: "index.js",
      webassemblyModuleFilename: "index.wasm"
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: ["style-loader", "css-loader", "sass-loader"]
        },
        {
          test: /\.(ts|js)?$/,
          use: "ts-loader",
          exclude: /node_modules/
        },
        {
          test: /\.(png|jpg|gif|jpeg)$/,
          loader: "url-loader"
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [{ from: "./public", to: distPath }]
      }),
      // We point our WasmPackPlugin to the location of the
      // the crates `Cargo.toml` file. Never the root file.
      new WasmPackPlugin({
        crateDirectory: path.join(__dirname, "wasm"),
        outDir: path.join(__dirname, "wasm/pkg")
        // extraArgs: ""
      })
    ],
    watch: argv.mode !== "production",
    resolve: {
      // A little overkill for our tutorial but useful.
      extensions: [".ts", ".tsx", ".js", ".jsx", ".mts", ".mjs"]
    }
  };
};
