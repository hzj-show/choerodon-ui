webpackJsonp([79],{2096:function(n,a,s){n.exports={basic:s(2456),static:s(2457)}},2456:function(n,a,s){n.exports={content:{"zh-CN":[["p","最简单的用法。"]],"en-US":[["p","The simplest usage."]]},meta:{order:0,title:{"zh-CN":"基本","en-US":"Basic"},filename:"components/anchor/demo/basic.md",id:"components-anchor-demo-basic"},toc:["ul",["li",["a",{className:"bisheng-toc-h2",href:"#zh-CN",title:"zh-CN"},"zh-CN"]],["li",["a",{className:"bisheng-toc-h2",href:"#en-US",title:"en-US"},"en-US"]]],highlightedCode:["pre",{lang:"jsx",highlighted:'<span class="token keyword">import</span> <span class="token punctuation">{</span> Anchor <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">\'choerodon-ui\'</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> <span class="token punctuation">{</span> Link <span class="token punctuation">}</span> <span class="token operator">=</span> Anchor<span class="token punctuation">;</span>\n\nReactDOM<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Anchor</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Link</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>#components-anchor-demo-basic<span class="token punctuation">"</span></span> <span class="token attr-name">title</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>Basic</span> <span class="token attr-name">demo"</span> <span class="token punctuation">/></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Link</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>#components-anchor-demo-fixed<span class="token punctuation">"</span></span> <span class="token attr-name">title</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>Fixed</span> <span class="token attr-name">demo"</span> <span class="token punctuation">/></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Link</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>#API<span class="token punctuation">"</span></span> <span class="token attr-name">title</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>API<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Link</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>#Anchor-Props<span class="token punctuation">"</span></span> <span class="token attr-name">title</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>Anchor</span> <span class="token attr-name">Props"</span> <span class="token punctuation">/></span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Link</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>#Link-Props<span class="token punctuation">"</span></span> <span class="token attr-name">title</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>Link</span> <span class="token attr-name">Props"</span> <span class="token punctuation">/></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Link</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Anchor</span><span class="token punctuation">></span></span><span class="token punctuation">,</span>\n  mountNode<span class="token punctuation">)</span><span class="token punctuation">;</span>'}],preview:function(){var n=s(0),a=(s(6),s(53)),t=a.Anchor.Link;return n.createElement(a.Anchor,null,n.createElement(t,{href:"#components-anchor-demo-basic",title:"Basic demo"}),n.createElement(t,{href:"#components-anchor-demo-fixed",title:"Fixed demo"}),n.createElement(t,{href:"#API",title:"API"},n.createElement(t,{href:"#Anchor-Props",title:"Anchor Props"}),n.createElement(t,{href:"#Link-Props",title:"Link Props"})))},style:"\n.code-box-demo .c7n-affix {\n  z-index: 11;\n}\n"}},2457:function(n,a,s){n.exports={content:{"zh-CN":[["p","不浮动，状态不随页面滚动变化。"]],"en-US":[["p","Do not change state when page is scrolling."]]},meta:{order:2,title:{"zh-CN":"静态位置","en-US":"Static Anchor"},filename:"components/anchor/demo/static.md",id:"components-anchor-demo-static"},toc:["ul",["li",["a",{className:"bisheng-toc-h2",href:"#zh-CN",title:"zh-CN"},"zh-CN"]],["li",["a",{className:"bisheng-toc-h2",href:"#en-US",title:"en-US"},"en-US"]]],highlightedCode:["pre",{lang:"jsx",highlighted:'<span class="token keyword">import</span> <span class="token punctuation">{</span> Anchor <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">\'choerodon-ui\'</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> <span class="token punctuation">{</span> Link <span class="token punctuation">}</span> <span class="token operator">=</span> Anchor<span class="token punctuation">;</span>\n\nReactDOM<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Anchor</span> <span class="token attr-name">affix</span><span class="token script language-javascript"><span class="token punctuation">=</span><span class="token punctuation">{</span><span class="token boolean">false</span><span class="token punctuation">}</span></span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Link</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>#components-anchor-demo-basic<span class="token punctuation">"</span></span> <span class="token attr-name">title</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>Basic</span> <span class="token attr-name">demo"</span> <span class="token punctuation">/></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Link</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>#components-anchor-demo-fixed<span class="token punctuation">"</span></span> <span class="token attr-name">title</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>Fixed</span> <span class="token attr-name">demo"</span> <span class="token punctuation">/></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Link</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>#API<span class="token punctuation">"</span></span> <span class="token attr-name">title</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>API<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Link</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>#Anchor-Props<span class="token punctuation">"</span></span> <span class="token attr-name">title</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>Anchor</span> <span class="token attr-name">Props"</span> <span class="token punctuation">/></span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Link</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>#Link-Props<span class="token punctuation">"</span></span> <span class="token attr-name">title</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>Link</span> <span class="token attr-name">Props"</span> <span class="token punctuation">/></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Link</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Anchor</span><span class="token punctuation">></span></span><span class="token punctuation">,</span>\n  mountNode<span class="token punctuation">)</span><span class="token punctuation">;</span>'}],preview:function(){var n=s(0),a=(s(6),s(53)),t=a.Anchor.Link;return n.createElement(a.Anchor,{affix:!1},n.createElement(t,{href:"#components-anchor-demo-basic",title:"Basic demo"}),n.createElement(t,{href:"#components-anchor-demo-fixed",title:"Fixed demo"}),n.createElement(t,{href:"#API",title:"API"},n.createElement(t,{href:"#Anchor-Props",title:"Anchor Props"}),n.createElement(t,{href:"#Link-Props",title:"Link Props"})))}}}});