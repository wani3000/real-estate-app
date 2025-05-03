self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "pages": {
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/apartment/[id]": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/apartment/[id].js"
    ],
    "/filter": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/filter.js"
    ],
    "/income": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/income.js"
    ],
    "/loading": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/loading.js"
    ],
    "/result": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/result.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];