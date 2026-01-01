(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,5766,e=>{"use strict";let t,r;var a,s=e.i(71645);let o={data:""},i=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,n=/\n+/g,d=(e,t)=>{let r="",a="",s="";for(let o in e){let i=e[o];"@"==o[0]?"i"==o[1]?r=o+" "+i+";":a+="f"==o[1]?d(i,o):o+"{"+d(i,"k"==o[1]?"":t)+"}":"object"==typeof i?a+=d(i,t?t.replace(/([^,])+/g,e=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):o):null!=i&&(o=/^--/.test(o)?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=d.p?d.p(o,i):o+":"+i+";")}return r+(t&&s?t+"{"+s+"}":s)+a},c={},p=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+p(e[r]);return t}return e};function u(e){let t,r,a=this||{},s=e.call?e(a.p):e;return((e,t,r,a,s)=>{var o;let u=p(e),m=c[u]||(c[u]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(u));if(!c[m]){let t=u!==e?e:(e=>{let t,r,a=[{}];for(;t=i.exec(e.replace(l,""));)t[4]?a.shift():t[3]?(r=t[3].replace(n," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(n," ").trim();return a[0]})(e);c[m]=d(s?{["@keyframes "+m]:t}:t,r?"":"."+m)}let f=r&&c.g?c.g:null;return r&&(c.g=c[m]),o=c[m],f?t.data=t.data.replace(f,o):-1===t.data.indexOf(o)&&(t.data=a?o+t.data:t.data+o),m})(s.unshift?s.raw?(t=[].slice.call(arguments,1),r=a.p,s.reduce((e,a,s)=>{let o=t[s];if(o&&o.call){let e=o(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;o=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+a+(null==o?"":o)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||o})(a.target),a.g,a.o,a.k)}u.bind({g:1});let m,f,g,x=u.bind({k:1});function h(e,t){let r=this||{};return function(){let a=arguments;function s(o,i){let l=Object.assign({},o),n=l.className||s.className;r.p=Object.assign({theme:f&&f()},l),r.o=/ *go\d+/.test(n),l.className=u.apply(r,a)+(n?" "+n:""),t&&(l.ref=i);let d=e;return e[0]&&(d=l.as||e,delete l.as),g&&d[0]&&g(l),m(d,l)}return t?t(s):s}}var b=(e,t)=>"function"==typeof e?e(t):e,y=(t=0,()=>(++t).toString()),w="default",v=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return v(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let o=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+o}))}}},j=[],N={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},k={},$=(e,t=w)=>{k[t]=v(k[t]||N,e),j.forEach(([e,r])=>{e===t&&r(k[t])})},A=e=>Object.keys(k).forEach(t=>$(e,t)),C=(e=w)=>t=>{$(t,e)},E=e=>(t,r)=>{let a,s=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||y()}))(t,e,r);return C(s.toasterId||(a=s.id,Object.keys(k).find(e=>k[e].toasts.some(e=>e.id===a))))({type:2,toast:s}),s.id},_=(e,t)=>E("blank")(e,t);_.error=E("error"),_.success=E("success"),_.loading=E("loading"),_.custom=E("custom"),_.dismiss=(e,t)=>{let r={type:3,toastId:e};t?C(t)(r):A(r)},_.dismissAll=e=>_.dismiss(void 0,e),_.remove=(e,t)=>{let r={type:4,toastId:e};t?C(t)(r):A(r)},_.removeAll=e=>_.remove(void 0,e),_.promise=(e,t,r)=>{let a=_.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?b(t.success,e):void 0;return s?_.success(s,{id:a,...r,...null==r?void 0:r.success}):_.dismiss(a),e}).catch(e=>{let s=t.error?b(t.error,e):void 0;s?_.error(s,{id:a,...r,...null==r?void 0:r.error}):_.dismiss(a)}),e};var z=x`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,S=x`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,O=x`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,P=h("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${z} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${S} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${O} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,I=x`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,L=h("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${I} 1s linear infinite;
`,q=x`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,T=x`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,D=h("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${q} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${T} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,F=h("div")`
  position: absolute;
`,M=h("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,R=x`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,B=h("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${R} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,K=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return void 0!==t?"string"==typeof t?s.createElement(B,null,t):t:"blank"===r?null:s.createElement(M,null,s.createElement(L,{...a}),"loading"!==r&&s.createElement(F,null,"error"===r?s.createElement(P,{...a}):s.createElement(D,{...a})))},U=h("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,H=h("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;s.memo(({toast:e,position:t,style:a,children:o})=>{let i=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[s,o]=(()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r})()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${x(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${x(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},l=s.createElement(K,{toast:e}),n=s.createElement(H,{...e.ariaProps},b(e.message,e));return s.createElement(U,{className:e.className,style:{...i,...a,...e.style}},"function"==typeof o?o({icon:l,message:n}):s.createElement(s.Fragment,null,l,n))}),a=s.createElement,d.p=void 0,m=a,f=void 0,g=void 0,u`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,e.s(["toast",()=>_],5766)},72331,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(18566),s=e.i(21675),o=e.i(9165),i=e.i(22016),l=e.i(5766);function n(){let{theme:e}=(0,s.useTheme)(),n=(0,a.useRouter)(),d="dark"===e,[c,p]=(0,r.useState)({username:"",email:"",password:"",password_confirm:"",secret_key:""}),[u,m]=(0,r.useState)(!1),[f,g]=(0,r.useState)(""),x=async e=>{if(e.preventDefault(),g(""),c.password!==c.password_confirm)return void g("Passwords do not match");m(!0);try{await o.authAPI.registerAdmin(c),l.toast.success("Admin account created! Please login."),n.push("/admin/login")}catch(e){e.response?.status===403?g("Invalid secret key. Authorization required."):g(e.response?.data?.detail||e.response?.data?.message||"Registration failed"),m(!1)}};return(0,t.jsx)("div",{className:"min-h-screen flex items-center justify-center px-4",style:{backgroundColor:d?"#0f172a":"#f8fafc"},children:(0,t.jsxs)("div",{className:"w-full max-w-md",children:[(0,t.jsxs)("div",{className:"text-center mb-8",children:[(0,t.jsx)("div",{className:"w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25",children:(0,t.jsx)("svg",{className:"w-8 h-8 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 4v16m8-8H4"})})}),(0,t.jsx)("h1",{className:`text-2xl font-bold ${d?"text-white":"text-gray-900"}`,children:"Admin Registration"}),(0,t.jsx)("p",{className:`text-sm mt-1 ${d?"text-slate-400":"text-gray-500"}`,children:"Create a new administrator account"})]}),(0,t.jsxs)("div",{className:`rounded-2xl border p-8 ${d?"bg-slate-800/50 border-slate-700":"bg-white border-gray-100"} shadow-xl`,children:[f&&(0,t.jsx)("div",{className:"mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20",children:(0,t.jsxs)("p",{className:"text-sm text-red-500 flex items-center gap-2",children:[(0,t.jsx)("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})}),f]})}),(0,t.jsxs)("form",{onSubmit:x,className:"space-y-4",children:[(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:`block text-sm font-medium mb-1.5 ${d?"text-slate-300":"text-gray-700"}`,children:"Username"}),(0,t.jsx)("input",{type:"text",value:c.username,onChange:e=>p({...c,username:e.target.value}),required:!0,className:`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${d?"bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500":"bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-500"} focus:outline-none focus:ring-2 focus:ring-purple-500/20`,placeholder:"jdoe"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:`block text-sm font-medium mb-1.5 ${d?"text-slate-300":"text-gray-700"}`,children:"Secret Key"}),(0,t.jsx)("input",{type:"password",value:c.secret_key,onChange:e=>p({...c,secret_key:e.target.value}),required:!0,className:`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${d?"bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500":"bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-500"} focus:outline-none focus:ring-2 focus:ring-purple-500/20`,placeholder:"••••••"})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:`block text-sm font-medium mb-1.5 ${d?"text-slate-300":"text-gray-700"}`,children:"Email Address"}),(0,t.jsx)("input",{type:"email",value:c.email,onChange:e=>p({...c,email:e.target.value}),required:!0,className:`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${d?"bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500":"bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-500"} focus:outline-none focus:ring-2 focus:ring-purple-500/20`,placeholder:"name@example.com"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:`block text-sm font-medium mb-1.5 ${d?"text-slate-300":"text-gray-700"}`,children:"Password"}),(0,t.jsx)("input",{type:"password",value:c.password,onChange:e=>p({...c,password:e.target.value}),required:!0,className:`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${d?"bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500":"bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-500"} focus:outline-none focus:ring-2 focus:ring-purple-500/20`,placeholder:"Create a password"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:`block text-sm font-medium mb-1.5 ${d?"text-slate-300":"text-gray-700"}`,children:"Confirm Password"}),(0,t.jsx)("input",{type:"password",value:c.password_confirm,onChange:e=>p({...c,password_confirm:e.target.value}),required:!0,className:`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${d?"bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500":"bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-500"} focus:outline-none focus:ring-2 focus:ring-purple-500/20`,placeholder:"Confirm password"})]}),(0,t.jsx)("button",{type:"submit",disabled:u,className:"w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed",children:u?"Creating Account...":"Create Admin Account"})]}),(0,t.jsx)("div",{className:"text-center mt-6",children:(0,t.jsx)(i.default,{href:"/admin/login",className:`text-sm ${d?"text-slate-400 hover:text-white":"text-gray-500 hover:text-gray-900"} transition-colors`,children:"Already have an account? Sign in"})})]})]})})}e.s(["default",()=>n])}]);