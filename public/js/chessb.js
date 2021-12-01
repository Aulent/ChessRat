(()=>{"use strict";let e="EN",t="RU",s=e;const n=!!new RegExp("ipad|iphone|android|pocket|palm|windows ce|windowsce|cellphone|opera mobi|ipod|small|sharp|sonyericsson|symbian|opera mini|nokia|htc_|samsung|motorola|smartphone|blackberry|playstation portable|tablet browser|webOS|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk","i").test(navigator.userAgent),o={data:()=>({vueCurrentUsername:"",vueCheckLichess:!1,vueLichessOrgPlayerNames:"",vueCheckChessCom:!1,vueChessComPlayerNames:"",vueAutoRefreshInterval:"",vueCheckDarkTheme:!1,vueArLichessPlayers:[],vueArChessComPlayers:[],vueArLichessPlayersBuf:[],vueArChessComPlayersBuf:[]}),methods:{vueScoreLichess(e){!function(e){!async function(e,t){if(-1===e.indexOf(t))return;Oe(true,!0);const s=Ue();let n=!1,o="";const r=Math.max.apply(null,e.map((e=>e.length)));for(let a of e)if(a!==t){const e=`${i}${t}/${a}`;try{const a=await fetch(e);if(a.ok){const e=await a.json();if(e&&!e.error){let n="",a=0,l="",i=0;const c=e.users;for(let e in c)e.toUpperCase()===t.toUpperCase()?(n=e,a=c[e]):(l=e,i=c[e]);const u=a-i;let m=(u>0?"+":"")+`${u}`;0===u||s||(m=`<span class="${u>0?"scorePlus":"scoreMinus"}">${m}</span>`);const d="_".repeat(r-l.length+2);o+=s?`X - ${l} ${d} ${a} : ${i} = ${m}\n`:`${n} - ${l} ${d}   ${a} : ${i} = ${m}\n`}}else n=!0,He(`status error: ${a.status} ${a.statusText} - ${e}`)}catch(t){n=!0,He(`error: ${t} - ${e}`)}}let a;Oe(true,!1),je()?(o+=n?'\nLichess says: "Too many requests from your ip-address."\nTry again later.':"",a=s?`Score (X is ${t} ):`:"Score between players:"):(o+=n?'\nLichess сообщает: "Слишком много запросов с вашего ip-адреса."\nПовторите запрос немного позже.':"",a=s?`Счет (X это ${t}):`:"Счет между игроками:"),function(e="",t=""){Ue()?alert((t?t+"\n\n":"")+e):(document.getElementById("modalDialogHead").innerHTML=Ge(t,"\n","<br>"),document.getElementById("modalDialogText").innerHTML=Ge(e,"\n","<br>"),D.showModal())}(o,a)}(ce(!0),e)}(e)},vueGroupAdd(){!function(){let e,t;if(V().length===L){const e=je()?"10 groups have already been created.\n\nThis is maximum !":"10 групп уже создано.\n\nЭто максимум !";return void alert(e)}t=je()?"Input name of new group:":"Введите имя новой группы:";const s=prompt(t,"");if(null!==s&&""!==s){if(s.length>A)return t=je()?"The name must not exceed 30 symbols !":"Длина имени не должна превышать 30 символов !",void alert(t);if(e=s.toUpperCase(),void 0!==P.find((t=>t.name.toUpperCase()===e)))return t=je()?`Group "${s}" already exists.\n\nPlease enter an another name !`:`Группа "${s}" уже есть.\n\nПожалуйста, введите другое имя !`,void alert(t);if(s.includes("!"))return t=je()?'The name must not include symbol "!".':'Имя не должно содержать символ  "!".',void alert(t);P.push({name:s,lichessPlayerNames:a.vueLichessOrgPlayerNames,chessComPlayerNames:a.vueChessComPlayerNames}),b=s,j(document.getElementById("group"),b,b),be(),t=je()?`It's created group "${s}"\nwith the current lists of players.\n\nChange player lists !`:`Создана группа "${s}"\nс текущими списками игроков.\n\nВнесите свои изменения в списки созданной группы!`,alert(t)}}()},vueGroupDel(){!function(){let e,t=b;const s=k.indexOf(t,0);if(W(s))return e=je()?`Group "${t}" cannot be deleted !`:`Группу "${t}" нельзя удалять !`,void alert(e);if(e=je()?`Delete group "${t}" ?`:`Удалить группу "${t}" ?`,!confirm(e))return;const n=document.getElementById("group");n.options[s]=null,n.options[0].selected=!0,P=P.filter(((e,t,n)=>t!==s)),k=V(),b=k[0],ke(P[0].lichessPlayerNames),we(P[0].chessComPlayerNames),oe(),e=je()?`Group "${t}" is deleted.\n\nCurrent group is "${b}" !`:`Группа "${t}" удалена.\n\nТекущая группа теперь: "${b}" !`,alert(e)}()},vueGroupRestore(){!function(){let e,t=b;const s=k.indexOf(t,0);if(!W(s))return e=je()?`Group "${t}" cannot be restored because it is not start-group !`:`Группу "${t}" нельзя восстановить , так как она не является стартовой группой !`,void alert(e);e=je()?`Restore initial value of the group "${t}" ?`:`Восстановить начальное значение группы "${t}" ?`,confirm(e)&&(P[s]=S[s],b=P[s].name,k=V(),X(b),ke(S[s].lichessPlayerNames),we(S[s].chessComPlayerNames),oe(),e=je()?`Group "${t}" is restored !`:`Группа "${t}" восстановлена !`,alert(e))}()},vueGoUserMode(){!function(){document.querySelector("#errorMessage").textContent="",document.querySelector("#okMessage").textContent="",ve("main"),Se(".sectionLoginArea");let e=localStorage.getItem("regtype");if(e=e||"","github"===z||"google"===z||"lichess"===z||"github"===e||"google"===e||"lichess"===e)document.getElementById("username").value="",document.getElementById("password").value="";else{const e=localStorage.getItem("username");document.getElementById("username").value=e||""}!function(){const e=a.vueCurrentUsername;return O&&-1===e.indexOf(u)}()?(document.getElementById("username").removeAttribute("disabled"),document.getElementById("password").removeAttribute("disabled"),ve("#buttonPostLogout"),Se("#buttonPostLogin"),Se("#buttonPostRegistration"),Se(".referToLichess")):(document.getElementById("username").setAttribute("disabled",!0),document.getElementById("password").setAttribute("disabled",!0),Se("#buttonPostLogout"),ve("#buttonPostLogin"),ve("#buttonPostRegistration"),ve(".referToLichess"))}()},vueRefresh(){oe()},vueOnClickCheckLichess(){xe(!Be()),re()},vueOnClickCheckChessCom(){Me(!Re()),ae()},vueRefreshLichess(){re()},vueRefreshChessCom(){ae()},vueOnchangeLichessPlayerNames(){!function(){let e=Pe();e=void 0===e?"":e,ke(e),_()}()},vueOnchangeChessComPlayerNames(){!function(){let e=Ie();e=void 0===e?"":e,we(e),_()}()},vueGoSetMode(){ve("main"),Se(".sectionSettingsArea")},vueSortBulletLichess(){te(!0,"bullet")},vueSortBlitzLichess(){te(!0,"blitz")},vueSortRapidLichess(){te(!0,"rapid")},vueSortPuzzleLichess(){te(!0,"puzzle")},vueSortRushLichess(){te(!0,"rush")},vueSortBulletChessCom(){te(!1,"bullet")},vueSortBlitzChessCom(){te(!1,"blitz")},vueSortRapidChessCom(){te(!1,"rapid")},vueSortPuzzleChessCom(){te(!1,"puzzle")},vueSortRushChessCom(){te(!1,"rush")},vueOnchangeAutoRefreshInterval(){!function(){let e=Ne();e=void 0===e?"":e,Te(e.trim())}()},vueOnClickSetTheme(){$e(!qe()),be(),Ee()},vueClearSettings(){!function(){let t;t=je()?"All settings will be cleared.\n\nAre you sure ?":"Все настройки будут сброшены.\n\nВы уверены ?",confirm(t)&&(localStorage.clear(),Te(""),$e(!1),H(),G(b),ke(P[0].lichessPlayerNames),we(P[0].chessComPlayerNames),function(){let e=document.getElementById("group").options;for(;e.length>v;)e[e.length-1]=null}(),B&&(B=!1,Ae()),oe(),Le(),Ee(),t=je()?"All settings are cleared.":"Все настройки сброшены.",alert(t),s=e,document.getElementById("langSelect").value=s,Fe())}()},vueRestoreStartGroups(){!function(){let e;e=je()?"All Start-groups will be restored.\n\nAre you sure ?":"Во всех стартовых группах\nбудут восстановлены начальные значения.\n\nВы уверены ?",confirm(e)&&(U(),function(){const e=document.getElementById("group");for(let t=0;t<v;t++)J(e,t,k[t],b)}(),oe(),e=je()?"All Start-groups are restored.":"Все стартовые группы восстановлены.",alert(e),Ce())}()},vueGoMainModeFromSettings(){Ce()},vueButtonChangeTables(){Ae(),function(){B=!B;const e=B?"1":"";localStorage.setItem("isFirstChessCom",e)}()},vueGoMainModeFromUser(){ye()}}},r=Vue.createApp(o);r.component("vue-component-tips",{template:'\n    <fieldset id="tipsEN" class="showBlock">\n    <legend><em><strong>Tips</strong></em></legend>\n    <ul>\n      <li><span class="click">Click</span> on the <span class="dotted">text "Player ratings/score"</span>\n        to refresh all tables\n      </li>\n      <li><span class="click">Click</span> on the <span class="dotted">heading "♞ Lichess"</span> to refresh the\n        Lichess table and sort by player list</li>\n      <li><span class="click">Click</span> on the <span class="dotted">heading "♟ Chess.com"</span> to refresh the\n        Chess.com table and sort by player list</li>\n      <li><span class="click">Click</span> on <span class="dotted">any other heading</span> to sort by rating\n      </li>\n      <li><span class="click">Click</span> on the <span class="dotted">"↑↓" button</span> to change the order of\n        tables</li>\n      <li>For Lichess there are several types of <span class="dotted">player status</span> to the left of his\n        name in table:\n        <ul>\n          <li><span class="statusOnline">&#10004;</span> - online</li>\n          <li><span class="statusPlaying">&#9679;</span> - playing</li>\n          <li><span class="statusStreaming">&#127908;</span> - streaming</li>\n        </ul>\n      </li>\n      <li>\n        If you <span class="click">hover the mouse over </span><span class="dotted">the player in table</span>,\n        a pop-up window will appear with an <span class="dotted">information about player</span>\n      </li>\n      <li>\n      <span class="colorGreen">Green</span> and <span class="colorRed">red</span> values in the rating table - are a change in the <span class="dotted">rating of the last\n          game day</span> in comparison with the <span class="dotted">rating of the previous game day</span>.\n      </li>\n    </ul>\n    </fieldset>\n\n    <fieldset id="tipsRU" class="hiddenBlock">\n    <legend><em><strong>Подсказки</strong></em></legend>\n    <ul>\n      <li><span class="click">Кликните</span> на <span class="dotted">тексте "Рейтинги / счет игрока" </span>\n        для обновления всех таблиц</li>\n      <li><span class="click">Кликните</span> на <span class="dotted">заголовке "♞ Lichess" </span>\n        для обновления таблицы Lichess и упорядочивания ее по списку игроков</li>\n      <li><span class="click">Кликните</span> на <span class="dotted">заголовке "♟ Chess.com" </span>\n        для обновления таблицы Chess.com и упорядочивания ее по списку игроков</li>\n      <li><span class="click">Кликните</span> на <span class="dotted">на других заголовках </span>\n        для упорядочивания таблицы по соответствующему рейтингу</li>\n      <li><span class="click">Кликните</span> на <span class="dotted">кнопке "↑↓"</span>, чтобы поменять порядок таблиц</li>\n      <li>Для Lichess отображаются несколько типов <span class="dotted">статусов игрока</span> слева от его имени в таблице:\n        <ul>\n          <li><span class="statusOnline">&#10004;</span> - онлайн</li>\n          <li><span class="statusPlaying">&#9679;</span> - сейчас играет</li>\n          <li><span class="statusStreaming">&#127908;</span> - сейчас стримит</li>\n        </ul>\n      </li>\n      <li>\n        <span class="click">При наведении</span> курсора мыши над <span class="dotted">именем игрока в таблице</span>,\n        появится подсказка с <span class="dotted">информацией об игроке из его профиля</span>\n      </li>\n      <li>\n      <span class="colorGreen">Зеленые</span> и <span class="colorRed">красные</span> значения в таблице рейтингов - это изменение <span class="dotted">\n          рейтинга последнего игрового дня</span> в сравнении с <span class="dotted">рейтингом предыдущего игрового дня</span>.\n      </li>\n    </ul>\n    </fieldset>\n'});const a=r.mount("#vue-mount"),l="https://lichess.org/api/user/",i="https://lichess.org/api/crosstable/",c="cors",u="  (disconnected)",m="@FIDE@",d="@STATUS-TEXT@",h="@STATUS-SYMBOL@",g=new Map([["player",0],["bullet",1],["blitz",2],["rapid",3],["puzzle",4],["rush",5]]),p="bovgit",f="Creator of this page :)",y=new Map([[p,f],["Thibault","Creator of Lichess.org"],["DrNykterstein","World champion\n\nMagnus Carlsen, Norway, FIDE 2882, GM"],["AvalonGamemaster","? Maxime Vachier-Lagrave, France, GM"]]),C=new Map([[p,f],["Erik","Creator of Chess.com"],["MagnusCarlsen","World champion"]]),S=[{name:"! FIDE top",lichessPlayerNames:"DrNykterstein Alireza2003 Bombegranate AnishGiri AvalonGamemaster",chessComPlayerNames:"MagnusCarlsen Firouzja2003 ChefsHouse FabianoCaruana LevonAronian LachesisQ AnishGiri Grischuk gmwso LyonBeast"},{name:"! custom",lichessPlayerNames:"Thibault Zhigalko_Sergei Benefactorr Chess-Network Crest64 Challenger_Spy ShahMatKanal Shuvalov Pandochka",chessComPlayerNames:"Erik Hikaru VladDobrov ChessQueen ChessNetwork ShahMatKanal"}],v=S.length;let b=S[0].name;const L=10,A=30;let P,k,I,w,N,T,q,$,B=!1,x="",R="",M="",E="",O="",z="";N=document.querySelector("#InputOrder1"),T=document.querySelector("#InputOrder2"),q=document.querySelector("#LichessTables"),$=document.querySelector("#ChessComTables"),n&&(document.querySelector("#bodyStyle").setAttribute("class","mobileStyle"),document.querySelector("#projectName").setAttribute("class","projectName projectNameDifMobile"),document.querySelector("#modalDialog").setAttribute("class","modalDialogMobileStyle"));const D=document.getElementById("modalDialog");function H(){P=[];for(let e=0;e<v;e++)P.push("");U()}function U(){for(let e=0;e<v;e++)P[e]=JSON.parse(JSON.stringify(S[e]));b=P[0].name,k=V(),ke(P[0].lichessPlayerNames),we(P[0].chessComPlayerNames)}function G(e){const t=document.getElementById("group");for(let s=0;s<k.length;s++)j(t,k[s],e)}function j(e,t,s){const n=document.createElement("option");F(n,t,s),e.appendChild(n)}function F(e,t,s){e.value=t,e.innerHTML="<strong><em>"+t+"</em></strong>",e.value===s&&(e.selected=!0)}function J(e,t,s,n){F(e[t],s,n)}function X(e){J(document.getElementById("group"),k.indexOf(e,0),e,e)}function _(){const e=P.find((e=>e.name===b));e.lichessPlayerNames=a.vueLichessOrgPlayerNames,e.chessComPlayerNames=a.vueChessComPlayerNames}function V(){return P.map((e=>e.name))}function W(e){return e>-1&&e<v}async function Y(){const e=K();if(!e)return;Z("User login...");const t=await fetch("/loginAJAX",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=utf-8"},body:e});if(t.ok){const e=await t.json();if(He("jsonObj: "+new Date),He(e),e.errorMsg){const t=e.errorMsg.message;return void Q(t?`Login error: ${t}`:"Login unknown error")}let s,n,o,r,a,l,i,c;return Z("User logged in."),s=e.usernameAfterLogin,s&&(n=e.regtypeAfterLogin,ee(s,n),localStorage.setItem("username",O),localStorage.setItem("regtype",z),n=e.LichessOrgPlayerNamesAfterLogin,n&&(ke(n),localStorage.setItem("LichessOrgPlayerNames",n)),o=e.ChessComPlayerNamesAfterLogin,o&&(we(o),localStorage.setItem("ChessComPlayerNames",o)),r=!1,s=e.isDarkThemeAfterLogin,s&&(r="1"===s,$e(r),localStorage.setItem("DarkThemeChecked",r?"1":"0"),Ee()),a=!1,s=e.CheckLichessAfterLogin,s&&(a="1"===s,xe(a),localStorage.setItem("LichessChecked",a?"1":"0")),l=!1,s=e.CheckChessComAfterLogin,s&&(l="1"===s,Me(l),localStorage.setItem("ChessComChecked",l?"1":"0")),i=!1,s=e.isFirstChessComAfterLogin,s&&(i="1"===s,i!==B&&(B=i,Ae()),localStorage.setItem("isFirstChessCom",i?"1":"0")),c=e.autoRefreshIntervalAfterLogin,c&&(Te(c),localStorage.setItem("AutoRefreshInterval",c)),(n||o||r||a||l||i)&&oe()),void ye()}Q("Error occured during login.")}function K(){let e;if(e=document.querySelector("#username").value.trim(),!e)return alert("Fill username !"),"";if("anonym"===e.toLowerCase())return alert("This username is unacceptable !"),"";if(e.indexOf(" ")>=0)return alert("Username should not contain a space !"),"";let t=e;if(e=document.querySelector("#password").value,!e)return alert("Fill password !"),"";if(e.indexOf(" ")>=0)return alert("Password should not contain a space !"),"";let s=e;return"username="+encodeURIComponent(t)+"&password="+encodeURIComponent(s)}function Q(e){document.querySelector("#errorMessage").textContent=e,document.querySelector("#okMessage").textContent=""}function Z(e){document.querySelector("#errorMessage").textContent="",document.querySelector("#okMessage").textContent=e}function ee(e,t){O=e||"",z=t||"",z="userpass"===z?"":z,a.vueCurrentUsername=O}function te(e,t){if(""===t)return;let s,n,o,r,l,i,c,u,m=function(e){const t=e?".TBodyLichess":".TBodyChessCom";return document.querySelector(t)}(e),d=m.rows.length;if(0===d)return;let h=new Array(d);for(s=0;s<d;s++)for(r=m.rows[s].cells,o=r.length,h[s]=new Array(o),n=0;n<o;n++)l=0===n?e?a.vueArLichessPlayers[s].playerName:a.vueArChessComPlayers[s].playerName:r[n].textContent,l=l.trim(),0===n?h[s][n]=l:(i=0,""!==l&&(i=parseInt(l,10),!isNaN(i)&&Number.isInteger(i)||(i=0)),h[s][n]=i);h.sort((function(e,s){let n=g.get(t);return s[n]-e[n]})),se(e),c=".THead"+t+(e?"Lichess":"ChessCom"),l=document.querySelector(c).textContent,u=l.slice(-1),"↑"!==u&&(document.querySelector(c).textContent+="↑"),e?(x=c,M=t):(R=c,E=t);const p=[];let f,y;for(s=0;s<d;s++)for(f=0;f<d;f++)if(y=e?a.vueArLichessPlayers[f].playerName:a.vueArChessComPlayers[f].playerName,h[s][0]===y){p.push(e?a.vueArLichessPlayers[f]:a.vueArChessComPlayers[f]);break}for(s=0;s<d;s++)e?a.vueArLichessPlayers[s]=p[s]:a.vueArChessComPlayers[s]=p[s]}function se(e){let t=e?x:R;if(""!==t){let e=document.querySelector(t).textContent;"↑"===e.slice(-1)&&(document.querySelector(t).textContent=e.slice(0,-1))}}function ne(e){se(e),e?(x="",M=""):(R="",E="")}function oe(){let e=!0;ne(e),ie(e),e=!1,ne(e),ie(e),be()}function re(){le(!0)}function ae(){le(!1)}function le(e){ne(e),ie(e),be()}function ie(e){const t=e?"#LichessTables":".TableChessComRatings",s=document.querySelector(t);!function(e){return e?Be():Re()}(e)?"none"!==s.style.display&&(s.style.display="none"):("block"!==s.style.display&&(s.style.display="block"),async function(e){let t=ce(e);0!==t.length&&(Oe(e,!0),e?(a.vueArLichessPlayersBuf.length=0,await async function(e){await async function(e){const t=e.join(","),s=await fetch("https://lichess.org/api/users",{method:"POST",headers:{"Content-Type":"text/plain; charset=utf-8"},body:t});if(!s.ok)return void He(`status error: ${s.status} ${s.statusText} - getProfilesAfterFetchFromLichess`);const n=De(),o=await s.json();e.forEach(((e,t)=>{const s=e.toUpperCase(),r=o.find((e=>e.username.toUpperCase()===s));if(r){let t,s=ge(0,r,"title");s=void 0===s?"":s+" ";let o="",l=y.get(e);l&&(o=l+"\n\n");const i=pe(0,r,"profile","firstName"),c=pe(0,r,"profile","lastName"),u=pe(0,r,"profile","location"),m=pe(0,r,"profile","fideRating"),h=pe(0,r,"profile","bio"),g=pe(0,r,"profile","links");let p="";t=ge(0,r,"createdAt"),t&&(p=new Date(t).getFullYear());let f="";t=ge(0,r,"seenAt");let C="lastOnline";t&&(f=ze(t),new Date(t)<n&&(C="lastOnlineBeforeToday"));const S=(i?i+" ":"")+(c||"")+(u?(i||c?", ":"")+u:"")+(m?", FIDE "+m:"")+(s&&!l?", "+s:"");o+=S+(S?"\n":"")+(p?"reg. "+p:"")+(f?"\nlast online "+f:"")+"\n"+d+(h?"\n"+Ge(h,'"',"'"):"")+(g?"\n"+g:"");let v='<a href="https://lichess.org/@/'+e+'" target="_blank" title="'+o+'">@STATUS-SYMBOL@<span class="playerTitle">'+s+" </span><strong>"+e+"</strong></a>"+(f?'<br><span class="'+C+'">'+f+"</span>":"");const b=fe(0,r,"perfs","bullet","rating"),L=fe(0,r,"perfs","blitz","rating"),A=fe(0,r,"perfs","rapid","rating"),P=fe(0,r,"perfs","puzzle","rating"),k=fe(0,r,"perfs","storm","score");a.vueArLichessPlayersBuf.push({playerHTML:v,playerName:e,bullet:b,blitz:L,rapid:A,puzzle:P,rush:k})}else He(`${e} - lichess, response.json error`),a.vueArLichessPlayersBuf.push({playerHTML:"<em>"+e+"</em>",playerName:e,bullet:"",blitz:"",rapid:"",puzzle:"",rush:""})}))}(e),await async function(e){(await async function(e){let t=[];const s=e.join(",");let n=fetch(`https://lichess.org/api/users/status?ids=${s}`,{mode:c}).then((e=>200!=e.status?null:e.json()),(e=>null));return t.push(n),await Promise.all(t)}(e))[0].forEach((t=>{const s=t.name;e.forEach(((e,n)=>{if(s.toUpperCase()===e.toUpperCase()){const e=ge(0,t,"patron"),s=ge(0,t,"online"),o=ge(0,t,"playing"),r=ge(0,t,"streaming");let l=e?"Patron. ":"";const i=je(),c=i?"Now":"Сейчас",u=i?"playing":"играет",m=i?"streaming":"стримит",g=i?"online":"онлайн";l+=s||r||o?c+" ":"",l+=o?u+", ":"",l+=r?m+", ":"",l+=!s||r||o?"":g+", ",l=l.trim(),","===l[l.length-1]&&(l=l.slice(0,l.length-1)+".");let p=l?l+"\n":"",f=a.vueArLichessPlayersBuf[n].playerHTML.replace(d,p);l="",r&&(l='<span class="statusStreaming">&#127908;</span>'),o&&(l+='<span class="statusPlaying">&#9679;</span>'),!s||r||o||(l='<span class="statusOnline">&#10004;</span>'),f=f.replace(h,l),a.vueArLichessPlayersBuf[n].playerHTML=f}}))}))}(e),await async function(e){(await async function(e){let t=[];for(let s of e){let e=fetch(`${l}${s}/activity`,{mode:c}).then((e=>200!=e.status?null:e.json()),(e=>null));t.push(e)}return await Promise.all(t)}(e)).forEach(((e,t)=>{if(e&&0!==e.length)for(let s of["bullet","blitz","rapid","puzzle"]){const o="bullet"===s||"blitz"===s||"rapid"===s,r=o?"games":"puzzles",l=o?s:"score",i="rp",c=e.find((e=>!!(e[r]&&e[r][l]&&e[r][l][i])));if(c){const e=c[r][l][i].after,o=c[r][l][i].before;if(e&&o){const r=e-o;if(0!==r){const e=n?"mobileRatingPlus":"ratingPlus";let o=(r>0?"+":"")+`${r}`;o=r>0?"<sup>"+o+"</sup>":"<sub>"+o+"</sub>",o=`<span class="${r>0?e:"ratingMinus"}">${o}</span>`;const l=a.vueArLichessPlayersBuf[t];l[s]=`${l[s]}${o}`,a.vueArLichessPlayersBuf[t]=l}}}}}))}(e),function(e){e.forEach(((e,t)=>{let s=a.vueArLichessPlayersBuf[t].playerHTML.replace(d,"");s=s.replace(h,""),a.vueArLichessPlayersBuf[t].playerHTML=s}))}(e)}(t)):(a.vueArChessComPlayersBuf.length=0,a.vueArChessComPlayersBuf=a.vueArChessComPlayersBuf.map(((e,t)=>{a.vueArChessComPlayersBuf[t]={playerHTML:"",playerName:"",bullet:"",blitz:"",rapid:"",puzzle:"",rush:""}})),await async function(e){let t=!0;await ue(e,t),t=!1,await ue(e,t)}(t)),function(e,t){if(0===t.length)return;const s=e?a.vueArLichessPlayersBuf.length:a.vueArChessComPlayersBuf.length,n=[];for(let o=0;o<t.length;o++){const r=t[o];if(""!==r)for(let t=0;t<s;t++)if(r===(e?a.vueArLichessPlayersBuf[t].playerName:a.vueArChessComPlayersBuf[t].playerName)){n.push(e?a.vueArLichessPlayersBuf[t]:a.vueArChessComPlayersBuf[t]);break}}e?a.vueArLichessPlayers=[...n]:a.vueArChessComPlayers=[...n]}(e,t),Oe(e,!1))}(e))}function ce(e){let t=function(e){return e?Pe():Ie()}(e),s=t.split(" ");return s=s.filter((e=>""!==e)),s}async function ue(e,t){let s=[...e];const n=s.length;if(0===n)return;const o=t?"profile":"statistics";let r=200;for(let a=0;a<6;a++){let l=[...s];l=l.map((e=>!1)),a>0&&(r+=100,He(`step ${a+1} / 6, chess.com ${o}, ${s.length} el. from ${n}, delay ${r}`),await new Promise(((e,t)=>setTimeout(e,r))));let i=!0;const c=t?"":"/stats";if((await me(!1,s,c)).forEach(((n,r)=>{const a=s[r];let c=!1;t?c=de(n,a,e):null!==n&&(he(n,e.indexOf(a),a),c=!0),c?l[r]=!0:(i=!1,He(`not read ${o}: ${a}, chess.com`))})),i)break;s=s.filter(((e,t)=>!l[t]))}}async function me(e,t,s=""){let n=[];for(let o of t)if(""!==o){let t=fetch(`${e?l:"https://api.chess.com/pub/player/"}${o}${s}`,{mode:c}).then((e=>200!=e.status?null:e.json()),(e=>null));n.push(t)}return await Promise.all(n)}function de(e,t,s){let n=!1,o="",r="",l="",i="",c="",u="";const d=De();let h=C.get(t);if(h&&(u=h+"\n\n"),o=ge(0,e,"url"),""===o||null==o)l="<em>"+t+"</em>";else{h=ge(0,e,"title"),r=void 0===h?"":h+" ";const s=ge(0,e,"name"),a=ge(0,e,"location");h=ge(0,e,"joined"),h&&(i=new Date(1e3*h).getFullYear()),h=ge(0,e,"last_online");let g="lastOnline";h&&(c=ze(1e3*h),new Date(1e3*h)<d&&(g="lastOnlineBeforeToday")),u+=(s||"")+(a?", "+a:""),u+=m+(r?", "+r:""),u+=(u&&u!==m?"\n":"")+"reg. "+i+"\nlast online "+c,l='<a href="'+o+'" target="_blank" title="'+u+'"><span class="playerTitle">'+r+" </span><strong>"+t+"</strong></a>"+(c?'<br><span class="'+g+'">'+c+"</span>":""),n=!0}return s.forEach(((e,s)=>{e===t&&(a.vueArChessComPlayersBuf[s]={playerHTML:l,playerName:t,bullet:"",blitz:"",rapid:"",puzzle:"",rush:""})})),n}function he(e,t,s){const n=ge(0,e,"fide"),o=n?`, FIDE ${n}`:"",r=a.vueArChessComPlayersBuf[t].playerHTML.replace(m,o),l=fe(0,e,"chess_bullet","last","rating"),i=fe(0,e,"chess_blitz","last","rating"),c=fe(0,e,"chess_rapid","last","rating"),u=fe(0,e,"tactics","highest","rating"),d=fe(0,e,"puzzle_rush","best","score");a.vueArChessComPlayersBuf[t]={playerHTML:r,playerName:s,bullet:l,blitz:i,rapid:c,puzzle:u,rush:d}}function ge(e,t,s){let n="";try{n=t[s]}catch(e){}return n}function pe(e,t,s,n){let o="";try{o=t[s][n]}catch(e){}return o}function fe(e,t,s,n,o){let r="";try{r=t[s][n][o]}catch(e){}return r}function ye(){ve(".sectionLoginArea"),Se("main")}function Ce(){let e=Ne();if(""!==e){let t=parseInt(e,10);if(isNaN(t)||!(Number.isInteger(t)&&t>=0&&t<=9999))return void alert("Interval must be between 0 and 9999 !");e=t.toString(10)}Te(e),localStorage.setItem("AutoRefreshInterval",e),Le(),ve(".sectionSettingsArea"),Se("main")}function Se(e){document.querySelector(e).style.display="block"}function ve(e){document.querySelector(e).style.display="none"}function be(){let e,t,s;localStorage.setItem("groupObjs",JSON.stringify(P)),localStorage.setItem("currentGroupName",b),e=Pe(),s=localStorage.getItem("LichessOrgPlayerNames"),s=null===s?"":s,t=e.trim()!==s.trim(),localStorage.setItem("LichessOrgPlayerNames",e),e=Ie(),s=localStorage.getItem("ChessComPlayerNames"),s=null===s?"":s,t=t||e.trim()!==s.trim(),localStorage.setItem("ChessComPlayerNames",e),e=Be()?"1":"0",t=t||e!==localStorage.getItem("LichessChecked"),localStorage.setItem("LichessChecked",e),e=Re()?"1":"0",t=t||e!==localStorage.getItem("ChessComChecked"),localStorage.setItem("ChessComChecked",e),e=qe()?"1":"0",t=t||e!==localStorage.getItem("DarkThemeChecked"),localStorage.setItem("DarkThemeChecked",e)}function Le(){clearInterval(I);let e=Ne();if(""!==e){let t=parseInt(e,10);0!==t&&(I=setInterval(oe,60*t*1e3))}else I=void 0}function Ae(){let e;T.parentNode.insertBefore(T,N),e=N,N=T,T=e,$.parentNode.insertBefore($,q),e=q,q=$,$=e}function Pe(){return a.vueLichessOrgPlayerNames.trim()}function ke(e){a.vueLichessOrgPlayerNames=e.trim()}function Ie(){return a.vueChessComPlayerNames.trim()}function we(e){a.vueChessComPlayerNames=e.trim()}function Ne(){return a.vueAutoRefreshInterval.trim()}function Te(e){a.vueAutoRefreshInterval=e?e.trim():""}function qe(){return a.vueCheckDarkTheme}function $e(e){a.vueCheckDarkTheme=e}function Be(){return a.vueCheckLichess}function xe(e){a.vueCheckLichess=e}function Re(){return a.vueCheckChessCom}function Me(e){a.vueCheckChessCom=e}function Ee(){const e=qe(),t="black",s="white";e?(document.body.style.backgroundColor=t,document.body.style.color=s):(document.body.style.backgroundColor=s,document.body.style.color=t);const n=e?"1":"0";localStorage.setItem("DarkThemeChecked",n)}function Oe(e,t){let s,n,o,r;e&&Be()&&(o=document.querySelector("#elemTextLichessOrgPlayerNames"),r=document.querySelector("#buttonLichessRefresh"),s="↺ ♞",n="⌛ ♞"),!e&&Re()&&(o=document.querySelector("#elemTextChessComPlayerNames"),r=document.querySelector("#buttonChessComRefresh"),s="↺ ♟",n="⌛ ♟"),o&&(t?(o.style.backgroundColor="#ffe4b5",o.setAttribute("class","inputText waitAnimation"),r.value=n):(o.style.backgroundColor="white",o.setAttribute("class","inputText waitAnimation2"),r.value=s),document.querySelector("#msgHintEdit").setAttribute("class","msgHint msgHintWaitAnimation"),document.querySelector("#msgHintScore").setAttribute("class","msgHint msgHintWaitAnimation"))}function ze(e){let t=new Date;const s=new Date(t).setHours(0,0,0,0);t-=864e5;const n=new Date(t).setHours(0,0,0,0),o=new Date(e);let r=o.toLocaleString();return r=r.slice(0,-3),o>=s?r=(je()?"today":"сегодня")+r.slice(10,17):o>=n&&(r=(je()?"yesterday":"вчера")+r.slice(10,17)),r}function De(){const e=new Date-864e5;return new Date(e).setHours(0,0,0,0)}function He(e){const t=(new Date).toLocaleString();console.log(`${t} - ${e}`)}function Ue(){return navigator.userAgent.toLowerCase().indexOf("firefox")>-1}function Ge(e,t,s){return e.replace(new RegExp(t,"g"),s)}function je(){return s===e}function Fe(){let n;!function(){const n=document.getElementById("langSelect"),o=n.selectedIndex;s=-1===o||n.options[o].text===e?e:t}(),localStorage.setItem("Lang",s);const o=!(s===t);document.querySelector("#projectName").textContent=o?"Ratings / score (↺ ♞ ♟)":"Рейтинги / счет (↺ ♞ ♟)",document.querySelector("#projectName").title=o?"Refresh all tables":"Обновить все таблицы",document.querySelector("#GroupText").textContent=o?"Group: ":"Группа: ",document.querySelector("#buttonGroupAdd").title=o?"Add group":"Добавить группу",document.querySelector("#buttonGroupRestore").title=o?"Restore group":"Восстановить группу",document.querySelector("#buttonGroupDel").title=o?"Delete group":"Удалить группу",document.querySelector("#elemCheckLichess").title=o?"Make visible or unvisible Lichess table":"Сделать видимой или невидимой таблицу Lichess",document.querySelector("#buttonLichessRefresh").title=o?"Refresh Lichess table":"Обновить таблицу Lichess",n=document.querySelector("#elemTextLichessOrgPlayerNames"),n.title=n.placeholder=o?"Enter names of players on Lichess, separated by spaces":"Введите имена игроков Lichess, разделенные пробелами",document.querySelector("#elemCheckChessCom").title=o?"Make visible or unvisible Chess.com table":"Сделать видимой или невидимой таблицу Chess.com",document.querySelector("#buttonChessComRefresh").title=o?"Refresh Chess.com table":"Обновить таблицу Chess.com",n=document.querySelector("#elemTextChessComPlayerNames"),n.title=n.placeholder=o?"Enter names of players on Chess.com, separated by spaces":"Введите имена игроков Chess.com, разделенные пробелами",document.querySelector("#msgHintEdit").textContent=o?"You can edit player lists !":"Вы можете редактировать списки игроков !",document.querySelector("#msgHintScore").textContent=o?"Click on the rating to see the score !":"Кликните по рейтингу для просмотра счета !",document.querySelector(".THeadbulletLichess").textContent=o?"bullet":"пуля",document.querySelector(".THeadblitzLichess").textContent=o?"blitz":"блиц",document.querySelector(".THeadrapidLichess").textContent=o?"rapid":"рапид",document.querySelector(".THeadpuzzleLichess").textContent=o?"puzzle":"задачи",document.querySelector(".THeadrushLichess").textContent=o?"storm":"штурм",document.querySelector(".THeadbulletChessCom").textContent=o?"bullet":"пуля",document.querySelector(".THeadblitzChessCom").textContent=o?"blitz":"блиц",document.querySelector(".THeadrapidChessCom").textContent=o?"rapid":"рапид",document.querySelector(".THeadpuzzleChessCom").textContent=o?"puzzle":"задачи",document.querySelector(".THeadrushChessCom").textContent=o?"rush":"штурм",document.querySelector("#buttonSettings").value=o?"Settings":"Настройки",document.querySelector("#buttonSettings").title=o?"Settings":"Настройки и подсказки",document.querySelector("#buttonChangeTables").title=o?"Change tables order":"Поменять порядок таблиц",document.querySelector("#legendSettings").textContent=o?"Settings":"Настройки",document.querySelector("#AutoRefresh").textContent=o?"AutoRefresh Interval in minutes (0 - no AutoRefresh): ":"Интервал автообновления в минутах (0 - нет автообновления): ",document.querySelector("#DarkThemeText").textContent=o?" Dark theme ":" Темная тема",n=document.querySelector("#buttonClearSettings"),n.value=n.title=o?"Clear all settings, non-start groups":"Очистить все настройки, не-стартовые группы",n=document.querySelector("#buttonRestoreStartGroups"),n.value=n.title=o?"Restore all start-groups":"Восстановить все стартовые группы",n=document.querySelector("#buttonReturnToMainFromSettings"),n.value=n.title=o?"Return":"Возврат",document.querySelector("#tipsEN").setAttribute("class",o?"showBlock":"hiddenBlock"),document.querySelector("#tipsRU").setAttribute("class",o?"hiddenBlock":"showBlock"),document.querySelector("#hrefEMail").textContent=o?"(e-mail)":"(эл.почта)",document.querySelector("#hrefVideo").textContent=" "+(o?"(Video-Help)":"(Видео-Демо)")}document.getElementById("modalDialogHide").onclick=()=>D.close(),document.querySelector("#group").onchange=()=>function(){const e=document.getElementById("group");let t=P.find((t=>t.name===e.value));t&&(b=t.name,ke(t.lichessPlayerNames),we(t.chessComPlayerNames)),oe()}(),document.querySelector("#langSelect").onchange=()=>Fe(),document.querySelector("#buttonPostRegistration").onclick=()=>{!async function(){const e=K();if(!e)return;Z("User registration...");const t=await fetch("/registrationAJAX",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=utf-8"},body:e});if(t.ok){const e=await t.json();if(He("jsonObj: "+new Date),He(e),e.errorMsg){let t=e.errorMsg.message;return void(t?Q(`Registration error: ${t}`):(t=e.errorMsg,Q(t?`Reg.error: ${t}`:"Registration unknown error")))}Z("User registered.");const s=e.usernameAfterRegistration;return s?(alert("User <"+s+"> registered."),void Y()):void Q("Impossible to login after registration (username is empty).")}Q("Error occured during registration.")}()},document.querySelector("#buttonPostLogin").onclick=()=>{Y()},document.querySelector("#buttonPostLogout").onclick=()=>{!async function(){Z(`${O} logout...`);const e=await fetch("/logoutAJAX");if(e.ok){const t=(await e.json()).msg;return Z(`${O} logged out. (${t})`),ee("",""),localStorage.setItem("username",""),localStorage.setItem("regtype",""),void ye()}Q("Error occured during logout.")}()},document.addEventListener("keydown",(function(e){"Enter"!==e.key&&13!==e.keyCode||oe()})),H(),function(){let n;n=localStorage.getItem("Lang"),s=n&&""!==n&&n!==e?t:e,document.getElementById("langSelect").value=s,Fe(),n=localStorage.getItem("currentGroupName"),n||(n=b),""!==n&&(b=n),n=localStorage.getItem("groupObjs"),n&&""!==n&&"undefined"!==n?(P=JSON.parse(n),k=V(),n=localStorage.getItem("LichessOrgPlayerNames"),ke(n),n=localStorage.getItem("ChessComPlayerNames"),we(n)):(n=localStorage.getItem("LichessOrgPlayerNames"),n||(n=S[0].lichessPlayerNames),""!==n&&ke(n),n=localStorage.getItem("ChessComPlayerNames"),n||(n=S[0].chessComPlayerNames),""!==n&&we(n)),n=localStorage.getItem("LichessChecked"),n=null===n?"1":n,xe("1"===n),n=localStorage.getItem("ChessComChecked"),n=null===n?"1":n,Me("1"===n),n=localStorage.getItem("isFirstChessCom"),B="1"===n,n=localStorage.getItem("AutoRefreshInterval"),Te(n),n=localStorage.getItem("DarkThemeChecked"),$e("1"===n)}(),G(b),X(b),B&&Ae(),Le(),Ee(),window.addEventListener("orientationchange",(function(){window.orientation}),!1),w=!0,function(){const e=new URLSearchParams(window.location.search);let t,s,n,o,r,l,i,c,m;if(s=e.get("afterSendUserSettingsToServer"),s)return t=localStorage.getItem("username"),s=localStorage.getItem("regtype"),void(t&&ee(t,s));if(m=e.get("errorMsgAfterRegistration"),m)return ee("",""),void alert("errorMsgAfterRegistration: "+m);const d=e.get("usernameAfterRegistration");if(d){const t=e.get("passwordAfterRegistration");t?(alert("User <"+d+"> registered."),function(e,t,s){let n=document.createElement("form");n.action=e,n.method="POST",n.innerHTML='<input name="username" value="'+t+'"><input name="password" value="'+s+'">',document.body.append(n),n.submit(),n.remove()}("/login",d,t)):alert("Impossible to login after registration (password is empty).")}else{if(m=e.get("errorMsgAfterLogin"),!m)return t=e.get("usernameAfterLogin"),t?(s=e.get("regtypeAfterLogin"),ee(t,s),localStorage.setItem("username",O),localStorage.setItem("regtype",z),s=e.get("LichessOrgPlayerNamesAfterLogin"),s&&(ke(s),localStorage.setItem("LichessOrgPlayerNames",s)),n=e.get("ChessComPlayerNamesAfterLogin"),n&&(we(n),localStorage.setItem("ChessComPlayerNames",n)),o=!1,t=e.get("isDarkThemeAfterLogin"),t&&(o="1"===t,$e(o),localStorage.setItem("DarkThemeChecked",o?"1":"0"),Ee()),r=!1,t=e.get("CheckLichessAfterLogin"),t&&(r="1"===t,xe(r),localStorage.setItem("LichessChecked",r?"1":"0")),l=!1,t=e.get("CheckChessComAfterLogin"),t&&(l="1"===t,Me(l),localStorage.setItem("ChessComChecked",l?"1":"0")),i=!1,t=e.get("isFirstChessComAfterLogin"),t&&(i="1"===t,i!==B&&(B=i,Ae()),localStorage.setItem("isFirstChessCom",i?"1":"0")),c=e.get("autoRefreshIntervalAfterLogin"),c&&(Te(c),localStorage.setItem("AutoRefreshInterval",c)),void((s||n||o||r||l||i)&&(oe(),w=!1))):(t=e.get("usernameAfterLogout"),t?(ee("",""),localStorage.setItem("username",""),void localStorage.setItem("regtype","")):(t=localStorage.getItem("username"),s=localStorage.getItem("regtype"),void(t&&(ee(t,s),s="PageAlreadyWasVisitedAtThisBrowserTab",n=sessionStorage.getItem(s),n||(sessionStorage.setItem(s,1),async function(){let e={username:O};const t=await fetch("/isUserLoggedAJAX",{method:"POST",headers:{"Content-Type":"application/json; charset=utf-8"},body:JSON.stringify(e)});if(t.ok){const e=await t.json();He("isUserLoggedAJAX: jsonObj: "+new Date),He(e);const s=e.isUserLoggedAJAX;return s?void("0"===s&&(a.vueCurrentUsername=O+u)):void He("Error occured during afterIsUserLoggedAJAX.")}He("Error occured during isUserLoggedAJAX.")}())))));alert("errorMsgAfterLogin: "+m)}}(),w&&oe()})();