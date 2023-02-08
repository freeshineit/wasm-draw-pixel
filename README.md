# Wasm Draw pixel

## Use

```bash
# install
yarn install

# development
yarn run dev

# production
yarn run build

# https://github.com/http-party/http-server
# version >= 14
cd dist && http-server -p 8080

```

![demo](./demo.png)
## Catalogue

```bash
.
├── LICENSE
├── README.md
├── app            # FE
│   ├── image       
│   ├── utils.ts  
│   └── index.ts
├── package.json
├── public        # static files
│   └── index.html
├── wasm  
│   ├── pkg       # wasm-pack compiled product
│   ├── src
│   └── target    # rust target
├── webpack.config.js
└── yarn.lock
```