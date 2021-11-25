(()=>{"use strict";const e={data:()=>({vueCurrentUsername:"",vueCheckLichess:!1,vueLichessOrgPlayerNames:"",vueCheckChessCom:!1,vueChessComPlayerNames:"",vueAutoRefreshInterval:"",vueCheckDarkTheme:!1,vueArLichessPlayers:[],vueArChessComPlayers:[],vueArLichessPlayersBuf:[],vueArChessComPlayersBuf:[]}),methods:{vueGroupAdd(){!function(){let e;if(10===q().length)return void alert("10 groups have already been created.\n\nThis is maximum !");const r=prompt("Input name of new group:","");null!==r&&""!==r&&(r.length>30?alert("The name must not exceed 30 symbols !"):(e=r.toUpperCase(),void 0===p.find((t=>t.name.toUpperCase()===e))?r.includes("!")?alert('The name must not include symbol "!".'):(p.push({name:r,lichessPlayerNames:t.vueLichessOrgPlayerNames,chessComPlayerNames:t.vueChessComPlayerNames}),P=r,E(document.getElementById("group"),P,P),me(),alert(`It's created group "${r}" with the current lists of players.\n\nChange player lists !`)):alert(`Group "${r}" already exists.\n\nPlease enter an another name !`)))}()},vueGroupDel(){!function(){let e=P;const t=y.indexOf(e,0);if(j(t))return void alert(`Group "${e}" cannot be deleted !`);if(!confirm(`Delete group "${e}" ?`))return;const r=document.getElementById("group");r.options[t]=null,r.options[0].selected=!0,p=p.filter(((e,r,s)=>r!==t)),y=q(),P=y[0],de(p[0].lichessPlayerNames),ye(p[0].chessComPlayerNames),V(),alert(`Group "${e}" is deleted.\n\nCurrent group is "${P}" !`)}()},vueGroupRestore(){!function(){let e=P;const t=y.indexOf(e,0);j(t)?confirm(`Restore group "${e}" ?`)&&(p[t]=f[t],P=p[t].name,y=q(),x(P),de(f[t].lichessPlayerNames),ye(f[t].chessComPlayerNames),V(),alert(`Group "${e}" will be restored !`)):alert(`Group "${e}" cannot be restored !`)}()},vueScoreLichess(e){!function(e){!async function(e,t){if(-1===e.indexOf(t))return;Ne(true,!0);let r=!1,s="";const n=Math.max.apply(null,e.map((e=>e.length)));for(let a of e)if(a!==t){const e=`${o}${t}/${a}`;try{const o=await fetch(e);if(o.ok){const e=await o.json();if(e&&!e.error){let r="",o=0,a="",l=0;const i=e.users;for(let e in i)e.toUpperCase()===t.toUpperCase()?(r=e,o=i[e]):(a=e,l=i[e]);s+=`${r} - ${a} ${"_".repeat(n-a.length+2)}   ${o} : ${l}\n`}}else r=!0,console.log(`status error: ${o.status} ${o.statusText} - ${e}`)}catch(t){r=!0,console.log(`error: ${t} - ${e}`)}}s+=r?"\nCannot get some data from Lichess.\nTry again later.":"",Ne(true,!1),alert(s)}(te(!0),e)}(e)},vueGoUserMode(){!function(){document.querySelector("#errorMessage").textContent="",document.querySelector("#okMessage").textContent="",ue("main"),ce(".sectionLoginArea");let e=localStorage.getItem("regtype");if(e=e||"","github"===B||"google"===B||"lichess"===B||"github"===e||"google"===e||"lichess"===e)document.getElementById("username").value="",document.getElementById("password").value="";else{const e=localStorage.getItem("username");document.getElementById("username").value=e||""}!function(){const e=t.vueCurrentUsername;return O&&-1===e.indexOf(a)}()?(document.getElementById("username").removeAttribute("disabled"),document.getElementById("password").removeAttribute("disabled"),ue("#buttonPostLogout"),ce("#buttonPostLogin"),ce("#buttonPostRegistration"),ce(".referToLichess")):(document.getElementById("username").setAttribute("disabled",!0),document.getElementById("password").setAttribute("disabled",!0),ce("#buttonPostLogout"),ue("#buttonPostLogin"),ue("#buttonPostRegistration"),ue(".referToLichess"))}()},vueRefresh(){V()},vueOnClickCheckLichess(){Le(!Ae()),W()},vueOnClickCheckChessCom(){Ie(!Pe()),Q()},vueRefreshLichess(){W()},vueRefreshChessCom(){Q()},vueOnchangeLichessPlayerNames(){!function(){let e=fe();e=void 0===e?"":e,de(e),D()}()},vueOnchangeChessComPlayerNames(){!function(){let e=pe();e=void 0===e?"":e,ye(e),D()}()},vueGoSetMode(){ue("main"),ce(".sectionSettingsArea")},vueSortBulletLichess(){X(!0,"bullet")},vueSortBlitzLichess(){X(!0,"blitz")},vueSortRapidLichess(){X(!0,"rapid")},vueSortPuzzleLichess(){X(!0,"puzzle")},vueSortRushLichess(){X(!0,"rush")},vueSortBulletChessCom(){X(!1,"bullet")},vueSortBlitzChessCom(){X(!1,"blitz")},vueSortRapidChessCom(){X(!1,"rapid")},vueSortPuzzleChessCom(){X(!1,"puzzle")},vueSortRushChessCom(){X(!1,"rush")},vueOnchangeAutoRefreshInterval(){!function(){let e=Ce();e=void 0===e?"":e,ve(e.trim())}()},vueOnClickSetTheme(){be(!Se()),me(),ke()},vueClearSettings(){confirm("All settings will be cleared.\n\nAre you sure ?")&&(localStorage.clear(),ve(""),be(!1),M(),z(P),de(p[0].lichessPlayerNames),ye(p[0].chessComPlayerNames),function(){let e=document.getElementById("group").options;for(;e.length>d;)e[e.length-1]=null}(),I&&(I=!1,he()),V(),ge(),ke(),alert("All settings are cleared."))},vueRestoreStartGroups(){confirm("All Start-groups will be restored.\n\nAre you sure ?")&&($(),function(){const e=document.getElementById("group");for(let t=0;t<d;t++)U(e,t,y[t],P)}(),V(),alert("All Start-groups are restored."),ie())},vueGoMainModeFromSettings(){ie()},vueButtonChangeTables(){he(),function(){I=!I;const e=I?"1":"";localStorage.setItem("isFirstChessCom",e)}()},vueGoMainModeFromUser(){le()}}},t=Vue.createApp(e).mount("#vue-mount"),r=!!new RegExp("ipad|iphone|android|pocket|palm|windows ce|windowsce|cellphone|opera mobi|ipod|small|sharp|sonyericsson|symbian|opera mini|nokia|htc_|samsung|motorola|smartphone|blackberry|playstation portable|tablet browser|webOS|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk","i").test(navigator.userAgent),s="https://lichess.org/api/user/",o="https://lichess.org/api/crosstable/",n="cors",a="  (disconnected)",l="@FIDE@",i="@STATUS-TEXT@",c="@STATUS-SYMBOL@",u=new Map([["player",0],["bullet",1],["blitz",2],["rapid",3],["puzzle",4],["rush",5]]),m="Creator of this page :)",g=new Map([["Thibault","Creator of Lichess.org"],["DrNykterstein","World champion\n\nMagnus Carlsen, Norway, GM"]]),h=new Map([["Erik","Creator of Chess.com"],["Hikaru"],["ChessQueen"],["ChessNetwork"],["ShahMatKanal"]]),f=[{name:"! FIDE top",lichessPlayerNames:"DrNykterstein Alireza2003 Bombegranate AnishGiri AvalonGamemaster Azerichessss Sergey_Karjakin Colchonero64 Vladimirovich9000",chessComPlayerNames:"MagnusCarlsen Firouzja2003 ChefsHouse FabianoCaruana LevonAronian LachesisQ AnishGiri Grischuk gmwso LyonBeast"},{name:"! custom",lichessPlayerNames:"Thibault Zhigalko_Sergei Chess-Network Crest64 Challenger_Spy ShahMatKanal Shuvalov Pandochka bovgit",chessComPlayerNames:function(e){let t="";for(let r of e.keys())t+=" "+r;return t.trim()}(h)}],d=f.length;let p,y,C,v,S,b,A,L,P=f[0].name,I=!1,w="",k="",N="",T="",O="",B="";function M(){p=[];for(let e=0;e<d;e++)p.push("");$()}function $(){for(let e=0;e<d;e++)p[e]=JSON.parse(JSON.stringify(f[e]));P=p[0].name,y=q(),de(p[0].lichessPlayerNames),ye(p[0].chessComPlayerNames)}function z(e){const t=document.getElementById("group");for(let r=0;r<y.length;r++)E(t,y[r],e)}function E(e,t,r){const s=document.createElement("option");R(s,t,r),e.appendChild(s)}function R(e,t,r){e.value=t,e.innerHTML="<strong><em>"+t+"</em></strong>",e.value===r&&(e.selected=!0)}function U(e,t,r,s){R(e[t],r,s)}function x(e){U(document.getElementById("group"),y.indexOf(e,0),e,e)}function D(){const e=p.find((e=>e.name===P));e.lichessPlayerNames=t.vueLichessOrgPlayerNames,e.chessComPlayerNames=t.vueChessComPlayerNames}function q(){return p.map((e=>e.name))}function j(e){return e>-1&&e<d}async function F(){const e=G();if(!e)return;J("User login...");const t=await fetch("/loginAJAX",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=utf-8"},body:e});if(t.ok){const e=await t.json();if(console.log("jsonObj: "+new Date),console.log(e),e.errorMsg){const t=e.errorMsg.message;return void H(t?`Login error: ${t}`:"Login unknown error")}let r,s,o,n,a,l,i,c;return J("User logged in."),r=e.usernameAfterLogin,r&&(s=e.regtypeAfterLogin,_(r,s),localStorage.setItem("username",O),localStorage.setItem("regtype",B),s=e.LichessOrgPlayerNamesAfterLogin,s&&(de(s),localStorage.setItem("LichessOrgPlayerNames",s)),o=e.ChessComPlayerNamesAfterLogin,o&&(ye(o),localStorage.setItem("ChessComPlayerNames",o)),n=!1,r=e.isDarkThemeAfterLogin,r&&(n="1"===r,be(n),localStorage.setItem("DarkThemeChecked",n?"1":"0"),ke()),a=!1,r=e.CheckLichessAfterLogin,r&&(a="1"===r,Le(a),localStorage.setItem("LichessChecked",a?"1":"0")),l=!1,r=e.CheckChessComAfterLogin,r&&(l="1"===r,Ie(l),localStorage.setItem("ChessComChecked",l?"1":"0")),i=!1,r=e.isFirstChessComAfterLogin,r&&(i="1"===r,i!==I&&(I=i,he()),localStorage.setItem("isFirstChessCom",i?"1":"0")),c=e.autoRefreshIntervalAfterLogin,c&&(ve(c),localStorage.setItem("AutoRefreshInterval",c)),(s||o||n||a||l||i)&&V()),void le()}H("Error occured during login.")}function G(){let e;if(e=document.querySelector("#username").value.trim(),!e)return alert("Fill username !"),"";if("anonym"===e.toLowerCase())return alert("This username is unacceptable !"),"";if(e.indexOf(" ")>=0)return alert("Username should not contain a space !"),"";let t=e;if(e=document.querySelector("#password").value,!e)return alert("Fill password !"),"";if(e.indexOf(" ")>=0)return alert("Password should not contain a space !"),"";let r=e;return"username="+encodeURIComponent(t)+"&password="+encodeURIComponent(r)}function H(e){document.querySelector("#errorMessage").textContent=e,document.querySelector("#okMessage").textContent=""}function J(e){document.querySelector("#errorMessage").textContent="",document.querySelector("#okMessage").textContent=e}function _(e,r){O=e||"",B=r||"",B="userpass"===B?"":B,t.vueCurrentUsername=O}function X(e,r){if(""===r)return;let s,o,n,a,l,i,c,m,g=function(e){const t=e?".TBodyLichess":".TBodyChessCom";return document.querySelector(t)}(e),h=g.rows.length;if(0===h)return;let f=new Array(h);for(s=0;s<h;s++)for(a=g.rows[s].cells,n=a.length,f[s]=new Array(n),o=0;o<n;o++)l=0===o?e?t.vueArLichessPlayers[s].playerName:t.vueArChessComPlayers[s].playerName:a[o].textContent,l=l.trim(),0===o?f[s][o]=l:(i=0,""!==l&&(i=parseInt(l,10),!isNaN(i)&&Number.isInteger(i)||(i=0)),f[s][o]=i);f.sort((function(e,t){let s=u.get(r);return t[s]-e[s]})),K(e),c=".THead"+r+(e?"Lichess":"ChessCom"),l=document.querySelector(c).textContent,m=l.slice(-1),"↑"!==m&&(document.querySelector(c).textContent+="↑"),e?(w=c,N=r):(k=c,T=r);const d=[];let p,y;for(s=0;s<h;s++)for(p=0;p<h;p++)if(y=e?t.vueArLichessPlayers[p].playerName:t.vueArChessComPlayers[p].playerName,f[s][0]===y){d.push(e?t.vueArLichessPlayers[p]:t.vueArChessComPlayers[p]);break}for(s=0;s<h;s++)e?t.vueArLichessPlayers[s]=d[s]:t.vueArChessComPlayers[s]=d[s]}function K(e){let t=e?w:k;if(""!==t){let e=document.querySelector(t).textContent;"↑"===e.slice(-1)&&(document.querySelector(t).textContent=e.slice(0,-1))}}function Y(e){K(e),e?(w="",N=""):(k="",T="")}function V(){let e=!0;Y(e),ee(e),e=!1,Y(e),ee(e),me()}function W(){Z(!0)}function Q(){Z(!1)}function Z(e){Y(e),ee(e),me()}function ee(e){const o=e?".TableLichess":".TableChessCom",a=document.querySelector(o);!function(e){return e?Ae():Pe()}(e)?"none"!==a.style.display&&(a.style.display="none"):("block"!==a.style.display&&(a.style.display="block"),async function(e){let o=te(e);0!==o.length&&(Ne(e,!0),e?(t.vueArLichessPlayersBuf.length=0,await async function(e){await async function(e){const r=e.join(","),s=await fetch("https://lichess.org/api/users",{method:"POST",headers:{"Content-Type":"text/plain; charset=utf-8"},body:r});if(!s.ok)return void console.log(`status error: ${s.status} ${s.statusText} - getProfilesAfterFetchFromLichess`);const o=Te(),n=await s.json();e.forEach(((e,r)=>{const s=e.toUpperCase(),a=n.find((e=>e.username.toUpperCase()===s));if(a){let r,s=oe(0,a,"title");s=void 0===s?"":s+" ";let n="",l=g.get(e);l?n=l+"\n\n":we(e)&&(n=m+"\n\n");const c=ne(0,a,"profile","firstName"),u=ne(0,a,"profile","lastName"),h=ne(0,a,"profile","location"),f=ne(0,a,"profile","fideRating"),d=ne(0,a,"profile","bio"),p=ne(0,a,"profile","links");let y="";r=oe(0,a,"createdAt"),r&&(y=new Date(r).getFullYear());let C="";r=oe(0,a,"seenAt");let v="lastOnline";r&&(C=se(r),new Date(r)<o&&(v="lastOnlineBeforeToday"));const S=(c?c+" ":"")+(u||"")+(h?(c||u?", ":"")+h:"")+(f?", FIDE "+f:"")+(s&&!l?", "+s:"");n+=S+(S?"\n":"")+(y?"reg. "+y:"")+(C?"\nlast online "+C:"")+"\n"+i+(d?"\n"+d.replaceAll('"',"'"):"")+(p?"\n"+p:"");let b='<a href="https://lichess.org/@/'+e+'" target="_blank" title="'+n+'">@STATUS-SYMBOL@<span class="playerTitle">'+s+" </span><strong>"+e+"</strong></a>"+(C?'<br><span class="'+v+'">'+C+"</span>":"");const A=ae(0,a,"perfs","bullet","rating"),L=ae(0,a,"perfs","blitz","rating"),P=ae(0,a,"perfs","rapid","rating"),I=ae(0,a,"perfs","puzzle","rating"),w=ae(0,a,"perfs","storm","score");t.vueArLichessPlayersBuf.push({playerHTML:b,playerName:e,bullet:A,blitz:L,rapid:P,puzzle:I,rush:w})}else console.log(`${e} - lichess, response.json error`),t.vueArLichessPlayersBuf.push({playerHTML:"<em>"+e+"</em>",playerName:e,bullet:"",blitz:"",rapid:"",puzzle:"",rush:""})}))}(e),await async function(e){(await async function(e){let t=[];const r=e.join(",");let s=fetch(`https://lichess.org/api/users/status?ids=${r}`,{mode:n}).then((e=>200!=e.status?null:e.json()),(e=>null));return t.push(s),await Promise.all(t)}(e))[0].forEach((r=>{const s=r.name;e.forEach(((e,o)=>{if(s.toUpperCase()===e.toUpperCase()){const e=oe(0,r,"patron"),s=oe(0,r,"online"),n=oe(0,r,"playing"),a=oe(0,r,"streaming");let l=e?"Patron. ":"";l+=s||a||n?"Now: ":"",l+=n?"playing, ":"",l+=a?"streaming, ":"",l+=!s||a||n?"":"online, ",l=l.trim(),","===l[l.length-1]&&(l=l.slice(0,l.length-1)+".");let u=l?l+"\n":"",m=t.vueArLichessPlayersBuf[o].playerHTML.replace(i,u);l="",a&&(l='<span class="statusStreaming">&#127908;</span>'),n&&(l+='<span class="statusPlaying">&#9679;</span>'),!s||a||n||(l='<span class="statusOnline">&#10004;</span>'),m=m.replace(c,l),t.vueArLichessPlayersBuf[o].playerHTML=m}}))}))}(e),await async function(e){(await async function(e){let t=[];for(let r of e){let e=fetch(`${s}${r}/activity`,{mode:n}).then((e=>200!=e.status?null:e.json()),(e=>null));t.push(e)}return await Promise.all(t)}(e)).forEach(((e,s)=>{if(e&&0!==e.length)for(let o of["bullet","blitz","rapid","puzzle"]){const n="bullet"===o||"blitz"===o||"rapid"===o,a=n?"games":"puzzles",l=n?o:"score",i="rp",c=e.find((e=>!!(e[a]&&e[a][l]&&e[a][l][i])));if(c){const e=c[a][l][i].after,n=c[a][l][i].before;if(e&&n){const a=e-n;if(0!==a){const e=r?"mobileRatingPlus":"ratingPlus";let n=(a>0?"+":"")+`${a}`;n=a>0?"<sup>"+n+"</sup>":"<sub>"+n+"</sub>",n=`<span class="${a>0?e:"ratingMinus"}">${n}</span>`;const l=t.vueArLichessPlayersBuf[s];l[o]=`${l[o]}${n}`,t.vueArLichessPlayersBuf[s]=l}}}}}))}(e),function(e){e.forEach(((e,r)=>{let s=t.vueArLichessPlayersBuf[r].playerHTML.replace(i,"");s=s.replace(c,""),s=s.replace("@SCORE-TEXT@",""),t.vueArLichessPlayersBuf[r].playerHTML=s}))}(e)}(o)):(t.vueArChessComPlayersBuf.length=0,await async function(e){await async function(e){const r=Te();(await re(!1,e)).forEach(((s,o)=>{const n=e[o];let a="",i="",c="",u="",g="",f="",d=h.get(n);if(d?f=d+"\n\n":we(n)&&(f=m+"\n\n"),a=oe(0,s,"url"),""===a||void 0===a)c="<em>"+n+"</em>";else{d=oe(0,s,"title"),i=void 0===d?"":d+" ";const e=oe(0,s,"name"),t=oe(0,s,"location");d=oe(0,s,"joined"),d&&(u=new Date(1e3*d).getFullYear()),d=oe(0,s,"last_online");let o="lastOnline";d&&(g=se(1e3*d),new Date(1e3*d)<r&&(o="lastOnlineBeforeToday")),f+=(e||"")+(t?", "+t:""),f+=l+(i?", "+i:""),f+=(f&&f!==l?"\n":"")+"reg. "+u+"\nlast online "+g,c='<a href="'+a+'" target="_blank" title="'+f+'"><span class="playerTitle">'+i+" </span><strong>"+n+"</strong></a>"+(g?'<br><span class="'+o+'">'+g+"</span>":"")}t.vueArChessComPlayersBuf.push({playerHTML:c,playerName:n,bullet:"",blitz:"",rapid:"",puzzle:"",rush:""})}))}(e),await async function(e){(await re(!1,e,"/stats")).forEach(((r,s)=>{const o=e[s],n=oe(0,r,"fide"),a=n?`, FIDE ${n}`:"",i=t.vueArChessComPlayersBuf[s].playerHTML.replace(l,a),c=ae(0,r,"chess_bullet","last","rating"),u=ae(0,r,"chess_blitz","last","rating"),m=ae(0,r,"chess_rapid","last","rating"),g=ae(0,r,"tactics","highest","rating"),h=ae(0,r,"puzzle_rush","best","score");t.vueArChessComPlayersBuf[s]={playerHTML:i,playerName:o,bullet:c,blitz:u,rapid:m,puzzle:g,rush:h}}))}(e)}(o)),function(e,r){if(0===r.length)return;const s=e?t.vueArLichessPlayersBuf.length:t.vueArChessComPlayersBuf.length,o=[];for(let n=0;n<r.length;n++){const a=r[n];if(""!==a)for(let r=0;r<s;r++)if(a===(e?t.vueArLichessPlayersBuf[r].playerName:t.vueArChessComPlayersBuf[r].playerName)){o.push(e?t.vueArLichessPlayersBuf[r]:t.vueArChessComPlayersBuf[r]);break}}e?t.vueArLichessPlayers=[...o]:t.vueArChessComPlayers=[...o]}(e,o),Ne(e,!1))}(e))}function te(e){let t=function(e){return e?fe():pe()}(e),r=t.split(" ");return r=r.filter((e=>""!==e)),r}async function re(e,t,r=""){let o=[];for(let a of t)if(""!==a){let t=fetch(`${e?s:"https://api.chess.com/pub/player/"}${a}${r}`,{mode:n}).then((e=>200!=e.status?null:e.json()),(e=>null));o.push(t)}return await Promise.all(o)}function se(e){let t=new Date(e).toLocaleString();return t=t.slice(0,-3),t}function oe(e,t,r){let s="";try{s=t[r]}catch(e){}return s}function ne(e,t,r,s){let o="";try{o=t[r][s]}catch(e){}return o}function ae(e,t,r,s,o){let n="";try{n=t[r][s][o]}catch(e){}return n}function le(){ue(".sectionLoginArea"),ce("main")}function ie(){let e=Ce();if(""!==e){let t=parseInt(e,10);if(isNaN(t)||!(Number.isInteger(t)&&t>=0&&t<=9999))return void alert("Interval must be between 0 and 9999 !");e=t.toString(10)}ve(e),localStorage.setItem("AutoRefreshInterval",e),ge(),ue(".sectionSettingsArea"),ce("main")}function ce(e){document.querySelector(e).style.display="block"}function ue(e){document.querySelector(e).style.display="none"}function me(){let e,t,r;localStorage.setItem("groupObjs",JSON.stringify(p)),localStorage.setItem("currentGroupName",P),e=fe(),r=localStorage.getItem("LichessOrgPlayerNames"),r=null===r?"":r,t=e.trim()!==r.trim(),localStorage.setItem("LichessOrgPlayerNames",e),e=pe(),r=localStorage.getItem("ChessComPlayerNames"),r=null===r?"":r,t=t||e.trim()!==r.trim(),localStorage.setItem("ChessComPlayerNames",e),e=Ae()?"1":"0",t=t||e!==localStorage.getItem("LichessChecked"),localStorage.setItem("LichessChecked",e),e=Pe()?"1":"0",t=t||e!==localStorage.getItem("ChessComChecked"),localStorage.setItem("ChessComChecked",e),e=Se()?"1":"0",t=t||e!==localStorage.getItem("DarkThemeChecked"),localStorage.setItem("DarkThemeChecked",e)}function ge(){clearInterval(C);let e=Ce();if(""!==e){let t=parseInt(e,10);0!==t&&(C=setInterval(V,60*t*1e3))}else C=void 0}function he(){let e;b.parentNode.insertBefore(b,S),e=S,S=b,b=e,L.parentNode.insertBefore(L,A),e=A,A=L,L=e}function fe(){return t.vueLichessOrgPlayerNames.trim()}function de(e){t.vueLichessOrgPlayerNames=e.trim()}function pe(){return t.vueChessComPlayerNames.trim()}function ye(e){t.vueChessComPlayerNames=e.trim()}function Ce(){return t.vueAutoRefreshInterval.trim()}function ve(e){t.vueAutoRefreshInterval=e?e.trim():""}function Se(){return t.vueCheckDarkTheme}function be(e){t.vueCheckDarkTheme=e}function Ae(){return t.vueCheckLichess}function Le(e){t.vueCheckLichess=e}function Pe(){return t.vueCheckChessCom}function Ie(e){t.vueCheckChessCom=e}function we(e){return e.toUpperCase()==="bovgit".toUpperCase()}function ke(){const e=Se(),t="black",r="white";e?(document.body.style.backgroundColor=t,document.body.style.color=r):(document.body.style.backgroundColor=r,document.body.style.color=t);const s=e?"1":"0";localStorage.setItem("DarkThemeChecked",s)}function Ne(e,t){const r="white",s="#ffe4b5";e&&Ae()&&(document.querySelector("#elemTextLichessOrgPlayerNames").style.backgroundColor=t?s:r),!e&&Pe()&&(document.querySelector("#elemTextChessComPlayerNames").style.backgroundColor=t?s:r)}function Te(){const e=new Date-864e5;return new Date(e).setHours(0,0,0,0)}S=document.querySelector("#InputOrder1"),b=document.querySelector("#InputOrder2"),A=document.querySelector("#TableOrder1"),L=document.querySelector("#TableOrder2"),r&&(document.querySelector("#bodyStyle").setAttribute("class","mobileStyle"),document.querySelector(".projectName").setAttribute("class","projectName projectNameDifMobile")),document.querySelector("#group").onchange=()=>function(){const e=document.getElementById("group");let t=p.find((t=>t.name===e.value));t&&(P=t.name,de(t.lichessPlayerNames),ye(t.chessComPlayerNames)),V()}(),document.querySelector("#buttonPostRegistration").onclick=()=>{!async function(){const e=G();if(!e)return;J("User registration...");const t=await fetch("/registrationAJAX",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=utf-8"},body:e});if(t.ok){const e=await t.json();if(console.log("jsonObj: "+new Date),console.log(e),e.errorMsg){let t=e.errorMsg.message;return void(t?H(`Registration error: ${t}`):(t=e.errorMsg,H(t?`Reg.error: ${t}`:"Registration unknown error")))}J("User registered.");const r=e.usernameAfterRegistration;return r?(alert("User <"+r+"> registered."),void F()):void H("Impossible to login after registration (username is empty).")}H("Error occured during registration.")}()},document.querySelector("#buttonPostLogin").onclick=()=>{F()},document.querySelector("#buttonPostLogout").onclick=()=>{!async function(){J(`${O} logout...`);const e=await fetch("/logoutAJAX");if(e.ok){const t=(await e.json()).msg;return J(`${O} logged out. (${t})`),_("",""),localStorage.setItem("username",""),localStorage.setItem("regtype",""),void le()}H("Error occured during logout.")}()},document.addEventListener("keydown",(function(e){"Enter"!==e.key&&13!==e.keyCode||V()})),M(),function(){let e;e=localStorage.getItem("currentGroupName"),e||(e=P),""!==e&&(P=e),e=localStorage.getItem("groupObjs"),e&&""!==e&&"undefined"!==e?(p=JSON.parse(e),y=q(),e=localStorage.getItem("LichessOrgPlayerNames"),de(e),e=localStorage.getItem("ChessComPlayerNames"),ye(e)):(e=localStorage.getItem("LichessOrgPlayerNames"),e||(e=f[0].lichessPlayerNames),""!==e&&de(e),e=localStorage.getItem("ChessComPlayerNames"),e||(e=f[0].chessComPlayerNames),""!==e&&ye(e)),e=localStorage.getItem("LichessChecked"),e=null===e?"1":e,Le("1"===e),e=localStorage.getItem("ChessComChecked"),e=null===e?"1":e,Ie("1"===e),e=localStorage.getItem("isFirstChessCom"),I="1"===e,e=localStorage.getItem("AutoRefreshInterval"),ve(e),e=localStorage.getItem("DarkThemeChecked"),be("1"===e)}(),z(P),x(P),I&&he(),ge(),ke(),window.addEventListener("orientationchange",(function(){window.orientation}),!1),v=!0,function(){const e=new URLSearchParams(window.location.search);let r,s,o,n,l,i,c,u,m;if(s=e.get("afterSendUserSettingsToServer"),s)return r=localStorage.getItem("username"),s=localStorage.getItem("regtype"),void(r&&_(r,s));if(m=e.get("errorMsgAfterRegistration"),m)return _("",""),void alert("errorMsgAfterRegistration: "+m);const g=e.get("usernameAfterRegistration");if(g){const t=e.get("passwordAfterRegistration");t?(alert("User <"+g+"> registered."),function(e,t,r){let s=document.createElement("form");s.action=e,s.method="POST",s.innerHTML='<input name="username" value="'+t+'"><input name="password" value="'+r+'">',document.body.append(s),s.submit(),s.remove()}("/login",g,t)):alert("Impossible to login after registration (password is empty).")}else{if(m=e.get("errorMsgAfterLogin"),!m)return r=e.get("usernameAfterLogin"),r?(s=e.get("regtypeAfterLogin"),_(r,s),localStorage.setItem("username",O),localStorage.setItem("regtype",B),s=e.get("LichessOrgPlayerNamesAfterLogin"),s&&(de(s),localStorage.setItem("LichessOrgPlayerNames",s)),o=e.get("ChessComPlayerNamesAfterLogin"),o&&(ye(o),localStorage.setItem("ChessComPlayerNames",o)),n=!1,r=e.get("isDarkThemeAfterLogin"),r&&(n="1"===r,be(n),localStorage.setItem("DarkThemeChecked",n?"1":"0"),ke()),l=!1,r=e.get("CheckLichessAfterLogin"),r&&(l="1"===r,Le(l),localStorage.setItem("LichessChecked",l?"1":"0")),i=!1,r=e.get("CheckChessComAfterLogin"),r&&(i="1"===r,Ie(i),localStorage.setItem("ChessComChecked",i?"1":"0")),c=!1,r=e.get("isFirstChessComAfterLogin"),r&&(c="1"===r,c!==I&&(I=c,he()),localStorage.setItem("isFirstChessCom",c?"1":"0")),u=e.get("autoRefreshIntervalAfterLogin"),u&&(ve(u),localStorage.setItem("AutoRefreshInterval",u)),void((s||o||n||l||i||c)&&(V(),v=!1))):(r=e.get("usernameAfterLogout"),r?(_("",""),localStorage.setItem("username",""),void localStorage.setItem("regtype","")):(r=localStorage.getItem("username"),s=localStorage.getItem("regtype"),void(r&&(_(r,s),s="PageAlreadyWasVisitedAtThisBrowserTab",o=sessionStorage.getItem(s),o||(sessionStorage.setItem(s,1),async function(){let e={username:O};const r=await fetch("/isUserLoggedAJAX",{method:"POST",headers:{"Content-Type":"application/json; charset=utf-8"},body:JSON.stringify(e)});if(r.ok){const e=await r.json();console.log("isUserLoggedAJAX: jsonObj: "+new Date),console.log(e);const s=e.isUserLoggedAJAX;return s?void("0"===s&&(t.vueCurrentUsername=O+a)):void console.log("Error occured during afterIsUserLoggedAJAX.")}console.log("Error occured during isUserLoggedAJAX.")}())))));alert("errorMsgAfterLogin: "+m)}}(),v&&V()})();