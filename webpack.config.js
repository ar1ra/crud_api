import path from "path";
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(import.meta.url);

export default {
  mode: "production",
  entry: "./src/index.ts",
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "..", "build"),
    chunkFormat: "module",
  },
  experiments: {
    outputModule: true,
  },
}