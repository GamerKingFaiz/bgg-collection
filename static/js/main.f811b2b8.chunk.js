(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{47:function(e,t,a){e.exports=a(79)},52:function(e,t,a){},53:function(e,t,a){},54:function(e,t,a){},67:function(e,t){},69:function(e,t){},79:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a.n(n),i=a(45),o=a.n(i),l=(a(52),a(27)),u=(a(53),"https://web-production-de84.up.railway.app"),s="".concat(u,"/https://boardgamegeek.com/xmlapi2/thing?stats=1&id="),c="".concat(u,"/https://api.geekdo.com/xmlapi2/collection?own=1&stats=1&excludesubtype=boardgameexpansion&username="),m=(a(54),a(6)),d=function(e){var t=e.recursiveFetchAndWait,a=e.setGameList;return r.a.createElement("div",{className:"search"},r.a.createElement("input",{type:"text",placeholder:"Enter BGG Username",name:"username",id:"searchBox",onKeyPress:function(e){"Enter"===e.key&&(m.a.event({category:"Collection Request",action:"Enter key pressed"}),a([]),t(c+e.target.value))}}),r.a.createElement("button",{type:"button",onClick:function(e){m.a.event({category:"Collection Request",action:"Clicked Submit"}),a([]),t(c+document.querySelector("#searchBox").value)}},"Submit"))},h=function(e){e.forEach(function(e){"Not Ranked"===e.statistics[0].ratings[0].ranks[0].rank[0].$.value?e.statistics[0].ratings[0].ranks[0].rank[0].$.value="N/A":e.statistics[0].ratings[0].ranks[0].rank[0].$.value=Number(e.statistics[0].ratings[0].ranks[0].rank[0].$.value),e.minplayers[0].$.value=Number(e.minplayers[0].$.value),isNaN(e.minplayers[0].$.value)&&(e.stats[0].$.minplayers="--"),e.maxplayers[0].$.value=Number(e.maxplayers[0].$.value),isNaN(e.maxplayers[0].$.value)&&(e.maxplayers[0].$.value="--"),e.maxplaytime[0].$.value=Number(e.maxplaytime[0].$.value),isNaN(e.maxplaytime[0].$.value)&&(e.maxplaytime[0].$.value="--"),void 0===e.yearpublished[0].$.value&&(e.yearpublished[0].$.value=["--"])})},v=[{Header:"Rank",accessor:"statistics[0].ratings[0].ranks[0].rank[0].$.value",maxWidth:75,sortMethod:function(e,t){return(e=null===e||void 0===e||"N/A"===e?1/0:e)>(t=null===t||void 0===t||"N/A"===t?1/0:t)?1:e<t?-1:0}},{Header:"",accessor:"thumbnail[0]",maxWidth:75,sortable:!1,Cell:function(e){return r.a.createElement("img",{src:e.value,width:"64",alt:"thumbnail",className:"thumbnail"})}},{Header:"Title",accessor:"name[0].$.value",minWidth:150,maxWidth:450,filterable:!0,style:{whiteSpace:"unset"},Cell:function(e){return r.a.createElement("div",{className:"title"},r.a.createElement("a",{href:"https://boardgamegeek.com/boardgame/"+e.original.$.id,target:"_blank",rel:"noopener noreferrer"},e.value)," ",r.a.createElement("span",{className:"yearPublished"},"(",e.original.yearpublished[0].$.value,")"))}},{Header:"Avg Rating",accessor:"statistics[0].ratings[0].average[0].$.value",defaultSortDesc:!0,maxWidth:100,Cell:function(e){return r.a.createElement("div",{className:"ratingContainer"},r.a.createElement("div",{className:"averageRating",style:{backgroundColor:Math.round(10*e.value)/10>=9?"#249563":Math.round(10*e.value)/10>=8?"#2fc482":Math.round(10*e.value)/10>=7?"#1d8acd":Math.round(10*e.value)/10>=5?"#5369a2":Math.round(10*e.value)/10>=3?"#df4751":"#db303b"}},Math.round(10*e.value)/10))}},{Header:"Min Players",accessor:"minplayers[0].$.value",maxWidth:100,sortMethod:function(e,t){return(e=null===e||void 0===e||"--"===e?1/0:e)>(t=null===t||void 0===t||"--"===t?1/0:t)?1:e<t?-1:0}},{Header:"Max Players",accessor:"maxplayers[0].$.value",defaultSortDesc:!0,maxWidth:100,sortMethod:function(e,t){return(e=null===e||void 0===e||"--"===e?-1/0:e)>(t=null===t||void 0===t||"--"===t?-1/0:t)?1:e<t?-1:0}},{Header:"Play Time",accessor:"maxplaytime[0].$.value",defaultSortDesc:!0,maxWidth:100,sortMethod:function(e,t){return(e=null===e||void 0===e||"--"===e?-1/0:e)>(t=null===t||void 0===t||"--"===t?-1/0:t)?1:e<t?-1:0},Cell:function(e){return r.a.createElement("span",null,e.value," Min")}},{Header:"Weight",accessor:"statistics[0].ratings[0].averageweight[0].$.value",maxWidth:100,Cell:function(e){return r.a.createElement("strong",null,r.a.createElement("span",{style:{color:Math.round(100*e.value)/100>=5?"#ff6b26":Math.round(100*e.value)/100>=4?"#ff6b26":Math.round(100*e.value)/100>=3?"#ff6b26":(Math.round(100*e.value),"#5bda98")}},Math.round(100*e.value)/100)," / 5")}}],f=a(26),p=a.n(f),g=a(46);a(78);m.a.initialize("UA-139517114-1"),m.a.pageview(window.location.pathname+window.location.search);var y=function(){var e=Object(n.useState)([]),t=Object(l.a)(e,2),a=t[0],i=t[1],o=Object(n.useState)(!1),u=Object(l.a)(o,2),f=u[0],y=u[1],b=Object(n.useState)(void 0),w=Object(l.a)(b,2),x=w[0],E=w[1],$=Object(n.useCallback)(function(e){y(!0),fetch(e).then(function(t){if(200===t.status)return t.text();202===t.status?setTimeout(function(){return $(e)},5e3):console.log("error: ",t.status)}).then(function(e){var t,a=[],n=[];if(p.a.parseString(e,function(e,r){if("0"!==r.items.$.totalitems&&(t=Number(r.items.$.totalitems),r.items.item.forEach(function(e){a.push(e.$.objectid)})),t>1200)for(;a.length;)n.push(a.splice(0,1200))}),t>0&&t<=1200)return fetch(s+a.join()).then(function(e){return e.text()}).then(function(e){return p.a.parseString(e,function(e,t){h(t.items.item),i(function(e){return e.concat(t.items.item)}),y(!1)})});n.forEach(function(e){fetch(s+e.join()).then(function(e){return e.text()}).then(function(e){return p.a.parseString(e,function(e,t){h(t.items.item),i(function(e){return e.concat(t.items.item)})})})}),y(!1)})},[]);return Object(n.useEffect)(function(){!function(){var e=document.querySelectorAll("div.rt-th > input"),t=!0,a=!1,n=void 0;try{for(var r,i=e[Symbol.iterator]();!(t=(r=i.next()).done);t=!0)r.value.placeholder="Search..."}catch(o){a=!0,n=o}finally{try{t||null==i.return||i.return()}finally{if(a)throw n}}}();var e=new URL(document.location).searchParams,t=e.get("username"),a=e.get("rows");null!==a&&E(Number(a)),null!==t&&(m.a.event({category:"Collection Request",action:"URL Param entered"}),$(c+t))},[$]),r.a.createElement("div",{className:"container"},r.a.createElement("h1",null,r.a.createElement("a",{className:"h1Link",href:"."},"Better BGG Collection")),r.a.createElement("p",{className:"description"},"Enter your BoardGameGeek username below to pull up your collection!"),r.a.createElement(d,{recursiveFetchAndWait:$,setGameList:i}),r.a.createElement("p",{className:"tipText"},"Tip: Hold shift when sorting to multi-sort!"),r.a.createElement(g.a,{data:a,columns:v,defaultSorted:[{id:"statistics[0].ratings[0].ranks[0].rank[0].$.value",desc:!1}],showPaginationTop:!0,minRows:5,pageSizeOptions:[5,10,20,25,50,100,300,500,1e3,2e3,5e3,1e4],defaultPageSize:300,pageSize:x,loading:f,noDataText:"No games found or you haven't entered your username yet",className:"-highlight",defaultFilterMethod:function(e,t){var a=e.pivotId||e.id;return void 0===t[a]||String(t[a]).toLowerCase().includes(e.value.toLowerCase())}}),r.a.createElement("div",{id:"footer"},r.a.createElement("p",null,"Page created with ",r.a.createElement("span",{role:"img","aria-label":"Red Heart"},"\u2764\ufe0f"))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(y,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[47,1,2]]]);
//# sourceMappingURL=main.f811b2b8.chunk.js.map