/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./context/FormContext.js":
/*!********************************!*\
  !*** ./context/FormContext.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   FormProvider: () => (/* binding */ FormProvider),\n/* harmony export */   useFormData: () => (/* binding */ useFormData)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst FormContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)();\nconst householdDescriptions = {\n    \"전체\": \"세대수에 상관없이 모든 아파트를 확인할 수 있어요.\",\n    \"100세대 이상\": \"100세대 이상은 기본적인 단지 형태를 갖춘 아파트예요.\",\n    \"300세대 이상\": \"300세대 이상 아파트는 관리 효율이 높고 거래가 활발해 실거주와 투자 모두에 적합해요.\",\n    \"500세대 이상\": \"500세대 이상은 커뮤니티 시설과 단지 자립도가 높아 실수요 선호도가 높아요.\",\n    \"1000세대 이상\": \"1,000세대 이상은 랜드마크 단지로 주목받기 쉬워 자산가치가 안정적이에요.\",\n    \"3000세대 이상\": \"3,000세대 이상은 지역 대표 대단지로 시세를 주도하는 중심 단지예요.\",\n    \"5000세대 이상\": \"5,000세대 이상은 희소한 초대형 단지로 브랜드 가치와 유동성이 뛰어나요.\"\n};\nconst yearDescriptions = {\n    \"전체\": \"입주 시점에 관계없이 모든 아파트를 확인할 수 있어요.\",\n    \"3년 이내\": \"3년 이내 아파트는 최신 설계와 마감재를 갖춘 신축 단지예요.\",\n    \"5년 이내\": \"5년 이내 아파트는 신축 프리미엄과 실입주 선호도가 모두 높은 구간이에요.\",\n    \"10년 이내\": \"10년 이내는 실거주 만족도와 관리상태가 균형 잡힌 준신축이에요.\",\n    \"15년 이내\": \"15년 이내 아파트는 상품성과 전세 수요가 안정적이라 실거주와 투자 모두에 적합해요.\",\n    \"25년 이상\": \"25년 이상은 리모델링이나 재건축 가능성이 생기기 시작하는 구간이에요.\",\n    \"30년 이상\": \"30년 이상은 재건축 기대감이 있는 노후 단지로 장기 투자 검토 대상이에요.\"\n};\nfunction FormProvider({ children }) {\n    const [formData, setFormData] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({\n        nickname: \"\",\n        income: \"\",\n        assets: \"\",\n        household: \"300세대 이상\",\n        year: \"25년 이상\",\n        householdDescription: householdDescriptions[\"300세대 이상\"],\n        yearDescription: yearDescriptions[\"25년 이상\"]\n    });\n    const updateFormData = (field, value)=>{\n        setFormData((prev)=>({\n                ...prev,\n                [field]: value,\n                ...field === \"household\" && {\n                    householdDescription: householdDescriptions[value]\n                },\n                ...field === \"year\" && {\n                    yearDescription: yearDescriptions[value]\n                }\n            }));\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(FormContext.Provider, {\n        value: {\n            formData,\n            updateFormData,\n            setFormData\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/Users/wan/Downloads/real-estate-clean/context/FormContext.js\",\n        lineNumber: 46,\n        columnNumber: 5\n    }, this);\n}\nfunction useFormData() {\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(FormContext);\n    if (!context) {\n        throw new Error(\"useFormData must be used within a FormProvider\");\n    }\n    return context;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb250ZXh0L0Zvcm1Db250ZXh0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBMkQ7QUFFM0QsTUFBTUcsNEJBQWNILG9EQUFhQTtBQUVqQyxNQUFNSSx3QkFBd0I7SUFDNUIsTUFBTTtJQUNOLFlBQVk7SUFDWixZQUFZO0lBQ1osWUFBWTtJQUNaLGFBQWE7SUFDYixhQUFhO0lBQ2IsYUFBYTtBQUNmO0FBRUEsTUFBTUMsbUJBQW1CO0lBQ3ZCLE1BQU07SUFDTixTQUFTO0lBQ1QsU0FBUztJQUNULFVBQVU7SUFDVixVQUFVO0lBQ1YsVUFBVTtJQUNWLFVBQVU7QUFDWjtBQUVPLFNBQVNDLGFBQWEsRUFBRUMsUUFBUSxFQUFFO0lBQ3ZDLE1BQU0sQ0FBQ0MsVUFBVUMsWUFBWSxHQUFHUCwrQ0FBUUEsQ0FBQztRQUN2Q1EsVUFBVTtRQUNWQyxRQUFRO1FBQ1JDLFFBQVE7UUFDUkMsV0FBVztRQUNYQyxNQUFNO1FBQ05DLHNCQUFzQlgscUJBQXFCLENBQUMsV0FBVztRQUN2RFksaUJBQWlCWCxnQkFBZ0IsQ0FBQyxTQUFTO0lBQzdDO0lBRUEsTUFBTVksaUJBQWlCLENBQUNDLE9BQU9DO1FBQzdCVixZQUFZVyxDQUFBQSxPQUFTO2dCQUNuQixHQUFHQSxJQUFJO2dCQUNQLENBQUNGLE1BQU0sRUFBRUM7Z0JBQ1QsR0FBSUQsVUFBVSxlQUFlO29CQUFFSCxzQkFBc0JYLHFCQUFxQixDQUFDZSxNQUFNO2dCQUFDLENBQUM7Z0JBQ25GLEdBQUlELFVBQVUsVUFBVTtvQkFBRUYsaUJBQWlCWCxnQkFBZ0IsQ0FBQ2MsTUFBTTtnQkFBQyxDQUFDO1lBQ3RFO0lBQ0Y7SUFFQSxxQkFDRSw4REFBQ2hCLFlBQVlrQixRQUFRO1FBQUNGLE9BQU87WUFBRVg7WUFBVVM7WUFBZ0JSO1FBQVk7a0JBQ2xFRjs7Ozs7O0FBR1A7QUFFTyxTQUFTZTtJQUNkLE1BQU1DLFVBQVV0QixpREFBVUEsQ0FBQ0U7SUFDM0IsSUFBSSxDQUFDb0IsU0FBUztRQUNaLE1BQU0sSUFBSUMsTUFBTTtJQUNsQjtJQUNBLE9BQU9EO0FBQ1QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZWFsLWVzdGF0ZS1uZXh0anMvLi9jb250ZXh0L0Zvcm1Db250ZXh0LmpzPzRmMzAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcblxuY29uc3QgRm9ybUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KClcblxuY29uc3QgaG91c2Vob2xkRGVzY3JpcHRpb25zID0ge1xuICAn7KCE7LK0JzogJ+yEuOuMgOyImOyXkCDsg4HqtIDsl4bsnbQg66qo65OgIOyVhO2MjO2KuOulvCDtmZXsnbjtlaAg7IiYIOyeiOyWtOyalC4nLFxuICAnMTAw7IS464yAIOydtOyDgSc6ICcxMDDshLjrjIAg7J207IOB7J2AIOq4sOuzuOyggeyduCDri6jsp4Ag7ZiV7YOc66W8IOqwluy2mCDslYTtjIztirjsmIjsmpQuJyxcbiAgJzMwMOyEuOuMgCDsnbTsg4EnOiAnMzAw7IS464yAIOydtOyDgSDslYTtjIztirjripQg6rSA66asIO2aqOycqOydtCDrhpLqs6Ag6rGw656Y6rCAIO2ZnOuwnO2VtCDsi6TqsbDso7zsmYAg7Yis7J6QIOuqqOuRkOyXkCDsoIHtlantlbTsmpQuJyxcbiAgJzUwMOyEuOuMgCDsnbTsg4EnOiAnNTAw7IS464yAIOydtOyDgeydgCDsu6TrrqTri4jti7Ag7Iuc7ISk6rO8IOuLqOyngCDsnpDrpr3rj4TqsIAg64aS7JWEIOyLpOyImOyalCDshKDtmLjrj4TqsIAg64aS7JWE7JqULicsXG4gICcxMDAw7IS464yAIOydtOyDgSc6ICcxLDAwMOyEuOuMgCDsnbTsg4HsnYAg656c65Oc66eI7YGsIOuLqOyngOuhnCDso7zrqqnrsJvquLAg7Ims7JuMIOyekOyCsOqwgOy5mOqwgCDslYjsoJXsoIHsnbTsl5DsmpQuJyxcbiAgJzMwMDDshLjrjIAg7J207IOBJzogJzMsMDAw7IS464yAIOydtOyDgeydgCDsp4Dsl60g64yA7ZGcIOuMgOuLqOyngOuhnCDsi5zshLjrpbwg7KO864+E7ZWY64qUIOykkeyLrCDri6jsp4DsmIjsmpQuJyxcbiAgJzUwMDDshLjrjIAg7J207IOBJzogJzUsMDAw7IS464yAIOydtOyDgeydgCDtnazshoztlZwg7LSI64yA7ZiVIOuLqOyngOuhnCDruIzrnpzrk5wg6rCA7LmY7JmAIOycoOuPmeyEseydtCDrm7DslrTrgpjsmpQuJ1xufVxuXG5jb25zdCB5ZWFyRGVzY3JpcHRpb25zID0ge1xuICAn7KCE7LK0JzogJ+yeheyjvCDsi5zsoJDsl5Ag6rSA6rOE7JeG7J20IOuqqOuToCDslYTtjIztirjrpbwg7ZmV7J247ZWgIOyImCDsnojslrTsmpQuJyxcbiAgJzPrhYQg7J2064K0JzogJzPrhYQg7J2064K0IOyVhO2MjO2KuOuKlCDstZzsi6Ag7ISk6rOE7JmAIOuniOqwkOyerOulvCDqsJbstpgg7Iug7LaVIOuLqOyngOyYiOyalC4nLFxuICAnNeuFhCDsnbTrgrQnOiAnNeuFhCDsnbTrgrQg7JWE7YyM7Yq464qUIOyLoOy2lSDtlITrpqzrr7jsl4Tqs7wg7Iuk7J6F7KO8IOyEoO2YuOuPhOqwgCDrqqjrkZAg64aS7J2AIOq1rOqwhOydtOyXkOyalC4nLFxuICAnMTDrhYQg7J2064K0JzogJzEw64WEIOydtOuCtOuKlCDsi6TqsbDso7wg66eM7KGx64+E7JmAIOq0gOumrOyDge2DnOqwgCDqt6DtmJUg7J6h7Z6MIOykgOyLoOy2leydtOyXkOyalC4nLFxuICAnMTXrhYQg7J2064K0JzogJzE164WEIOydtOuCtCDslYTtjIztirjripQg7IOB7ZKI7ISx6rO8IOyghOyEuCDsiJjsmpTqsIAg7JWI7KCV7KCB7J206528IOyLpOqxsOyjvOyZgCDtiKzsnpAg66qo65GQ7JeQIOygge2Vqe2VtOyalC4nLFxuICAnMjXrhYQg7J207IOBJzogJzI164WEIOydtOyDgeydgCDrpqzrqqjrjbjrp4HsnbTrgpgg7J6s6rG07LaVIOqwgOuKpeyEseydtCDsg53quLDquLAg7Iuc7J6R7ZWY64qUIOq1rOqwhOydtOyXkOyalC4nLFxuICAnMzDrhYQg7J207IOBJzogJzMw64WEIOydtOyDgeydgCDsnqzqsbTstpUg6riw64yA6rCQ7J20IOyeiOuKlCDrhbjtm4Qg64uo7KeA66GcIOyepeq4sCDtiKzsnpAg6rKA7YagIOuMgOyDgeydtOyXkOyalC4nXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBGb3JtUHJvdmlkZXIoeyBjaGlsZHJlbiB9KSB7XG4gIGNvbnN0IFtmb3JtRGF0YSwgc2V0Rm9ybURhdGFdID0gdXNlU3RhdGUoe1xuICAgIG5pY2tuYW1lOiAnJyxcbiAgICBpbmNvbWU6ICcnLFxuICAgIGFzc2V0czogJycsXG4gICAgaG91c2Vob2xkOiAnMzAw7IS464yAIOydtOyDgScsXG4gICAgeWVhcjogJzI164WEIOydtOyDgScsXG4gICAgaG91c2Vob2xkRGVzY3JpcHRpb246IGhvdXNlaG9sZERlc2NyaXB0aW9uc1snMzAw7IS464yAIOydtOyDgSddLFxuICAgIHllYXJEZXNjcmlwdGlvbjogeWVhckRlc2NyaXB0aW9uc1snMjXrhYQg7J207IOBJ11cbiAgfSlcblxuICBjb25zdCB1cGRhdGVGb3JtRGF0YSA9IChmaWVsZCwgdmFsdWUpID0+IHtcbiAgICBzZXRGb3JtRGF0YShwcmV2ID0+ICh7XG4gICAgICAuLi5wcmV2LFxuICAgICAgW2ZpZWxkXTogdmFsdWUsXG4gICAgICAuLi4oZmllbGQgPT09ICdob3VzZWhvbGQnICYmIHsgaG91c2Vob2xkRGVzY3JpcHRpb246IGhvdXNlaG9sZERlc2NyaXB0aW9uc1t2YWx1ZV0gfSksXG4gICAgICAuLi4oZmllbGQgPT09ICd5ZWFyJyAmJiB7IHllYXJEZXNjcmlwdGlvbjogeWVhckRlc2NyaXB0aW9uc1t2YWx1ZV0gfSlcbiAgICB9KSlcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEZvcm1Db250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IGZvcm1EYXRhLCB1cGRhdGVGb3JtRGF0YSwgc2V0Rm9ybURhdGEgfX0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9Gb3JtQ29udGV4dC5Qcm92aWRlcj5cbiAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlRm9ybURhdGEoKSB7XG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEZvcm1Db250ZXh0KVxuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUZvcm1EYXRhIG11c3QgYmUgdXNlZCB3aXRoaW4gYSBGb3JtUHJvdmlkZXInKVxuICB9XG4gIHJldHVybiBjb250ZXh0XG59ICJdLCJuYW1lcyI6WyJjcmVhdGVDb250ZXh0IiwidXNlQ29udGV4dCIsInVzZVN0YXRlIiwiRm9ybUNvbnRleHQiLCJob3VzZWhvbGREZXNjcmlwdGlvbnMiLCJ5ZWFyRGVzY3JpcHRpb25zIiwiRm9ybVByb3ZpZGVyIiwiY2hpbGRyZW4iLCJmb3JtRGF0YSIsInNldEZvcm1EYXRhIiwibmlja25hbWUiLCJpbmNvbWUiLCJhc3NldHMiLCJob3VzZWhvbGQiLCJ5ZWFyIiwiaG91c2Vob2xkRGVzY3JpcHRpb24iLCJ5ZWFyRGVzY3JpcHRpb24iLCJ1cGRhdGVGb3JtRGF0YSIsImZpZWxkIiwidmFsdWUiLCJwcmV2IiwiUHJvdmlkZXIiLCJ1c2VGb3JtRGF0YSIsImNvbnRleHQiLCJFcnJvciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./context/FormContext.js\n");

/***/ }),

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _context_FormContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../context/FormContext */ \"./context/FormContext.js\");\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    console.log(\"_app.js 렌더링: FormProvider 적용\");\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_context_FormContext__WEBPACK_IMPORTED_MODULE_2__.FormProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"/Users/wan/Downloads/real-estate-clean/pages/_app.js\",\n            lineNumber: 9,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/wan/Downloads/real-estate-clean/pages/_app.js\",\n        lineNumber: 8,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBOEI7QUFDdUI7QUFFckQsU0FBU0MsTUFBTSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNyQ0MsUUFBUUMsR0FBRyxDQUFDO0lBRVoscUJBQ0UsOERBQUNMLDhEQUFZQTtrQkFDWCw0RUFBQ0U7WUFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7OztBQUc5QjtBQUVBLGlFQUFlRixLQUFLQSxFQUFBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmVhbC1lc3RhdGUtbmV4dGpzLy4vcGFnZXMvX2FwcC5qcz9lMGFkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJ1xuaW1wb3J0IHsgRm9ybVByb3ZpZGVyIH0gZnJvbSAnLi4vY29udGV4dC9Gb3JtQ29udGV4dCdcblxuZnVuY3Rpb24gTXlBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9KSB7XG4gIGNvbnNvbGUubG9nKCdfYXBwLmpzIOugjOuNlOungTogRm9ybVByb3ZpZGVyIOyggeyaqScpXG4gIFxuICByZXR1cm4gKFxuICAgIDxGb3JtUHJvdmlkZXI+XG4gICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgPC9Gb3JtUHJvdmlkZXI+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTXlBcHBcbiJdLCJuYW1lcyI6WyJGb3JtUHJvdmlkZXIiLCJNeUFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsImNvbnNvbGUiLCJsb2ciXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.js"));
module.exports = __webpack_exports__;

})();