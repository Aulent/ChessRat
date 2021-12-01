//v2.0.0 2021-11-04
'use strict'

let langEN = 'EN', langRU = 'RU'
let curLang = langEN

const isMobileDevice = is_mobile_device()

// ------------------- V U E  (start) ------------------------

const root = {
  data() {
    return {
      vueCurrentUsername: '',
      vueCheckLichess: false,
      vueLichessOrgPlayerNames: '',
      vueCheckChessCom: false,
      vueChessComPlayerNames: '',
      vueAutoRefreshInterval: '',
      vueCheckDarkTheme: false,
      vueArLichessPlayers: [],
      vueArChessComPlayers: [],
      vueArLichessPlayersBuf: [],
      vueArChessComPlayersBuf: [],
    }
  },
  methods: {
    vueScoreLichess(playerName) { scoreLichess(playerName) },
    vueGroupAdd() { groupAdd() },
    vueGroupDel() { groupDel() },
    vueGroupRestore() { groupRestore() },
    vueGoUserMode() { goUserMode() },
    vueRefresh() { refresh() },
    vueOnClickCheckLichess() {
      setCheckLichess(!isCheckLichess()) //inversion checkbox
      refreshLichess()
    },
    vueOnClickCheckChessCom() {
      setCheckChessCom(!isCheckChessCom()) //inversion checkbox
      refreshChessCom()
    },
    vueRefreshLichess() { refreshLichess() },
    vueRefreshChessCom() { refreshChessCom() },
    vueOnchangeLichessPlayerNames() { onchangeLichessPlayerNames() },
    vueOnchangeChessComPlayerNames() { onchangeChessComPlayerNames() },
    vueGoSetMode() { goSetMode() },

    vueSortBulletLichess() { sortBulletLichess() },
    vueSortBlitzLichess() { sortBlitzLichess() },
    vueSortRapidLichess() { sortRapidLichess() },
    vueSortPuzzleLichess() { sortPuzzleLichess() },
    vueSortRushLichess() { sortRushLichess() },

    vueSortBulletChessCom() { sortBulletChessCom() },
    vueSortBlitzChessCom() { sortBlitzChessCom() },
    vueSortRapidChessCom() { sortRapidChessCom() },
    vueSortPuzzleChessCom() { sortPuzzleChessCom() },
    vueSortRushChessCom() { sortRushChessCom() },

    vueOnchangeAutoRefreshInterval() { onchangeAutoRefreshInterval() },
    vueOnClickSetTheme() { onClickSetTheme() },
    vueClearSettings() { clearSettings() },
    vueRestoreStartGroups() { restoreStartGroups() },
    vueGoMainModeFromSettings() { goMainModeFromSettings() },
    vueButtonChangeTables() {
      changeTablesOrder()
      setFirstChessComToStorage()
    },
    vueGoMainModeFromUser() { goMainModeFromUser() },

  },
}
const app = Vue.createApp(root)
app.component('vue-component-tips', {
  template: vueTemplateTips()
})
const vm = app.mount('#vue-mount')

// ------------------- V U E  (end) ------------------------

const urlHttpServiceLichess = 'https://lichess.org/api/user/'
const urlHttpServiceLichessStatus = 'https://lichess.org/api/users/status?ids='
const urlHttpServiceLichessScore = 'https://lichess.org/api/crosstable/'
const urlHttpServiceLichessStreamersOnline = 'https://lichess.org/streamer/live/'
const urlHttpServiceChessCom = 'https://api.chess.com/pub/player/'
const modeCORS = 'cors' //mode for fetch
const useAJAX = true //for exchange data between server & client
const DISCONNECTED_TEXT = '  (disconnected)'
const sortSymbolAtHead = '↑' //&#8593
// const onlineSymbolAtPlayer = '&#10004;' //check

// const onlineSymbolOnline = '&#9675;'	//not-filled circle
const onlineSymbolOnline = '&#10004;' //check

const onlineSymbolPlaying = '&#9679;'	//filled circle

// const onlineSymbolStreaming = '&#9679;'	//filled circle
// const onlineSymbolStreaming = '&#128250;' //📺
const onlineSymbolStreaming = '&#127908;' //microphone

const META_FIDE = '@FIDE@'
const META_STATUS_TEXT = '@STATUS-TEXT@'
const META_STATUS_SYMBOL = '@STATUS-SYMBOL@'
// const META_SCORE = '@SCORE-TEXT@'
const mapTimeControl = new Map([
  ['player', 0],
  ['bullet', 1],
  ['blitz', 2],
  ['rapid', 3],
  ['puzzle', 4],
  ['rush', 5]
])

const streamOnlineGroupName = '! streamers online'
const BOVGIT_playerName = 'bovgit'
const BOVGIT_description = 'Creator of this page :)'
const mapLichessPlayersDescription = new Map([
  [BOVGIT_playerName, BOVGIT_description],
  ['Thibault', 'Creator of Lichess.org'],
  ['DrNykterstein', 'World champion\n\nMagnus Carlsen, Norway, FIDE 2882, GM'],
  ['AvalonGamemaster', '? Maxime Vachier-Lagrave, France, GM'],
])
const mapChessComPlayersDescription = new Map([
  [BOVGIT_playerName, BOVGIT_description],
  ['Erik', 'Creator of Chess.com'],
  ['MagnusCarlsen', 'World champion'],
])
const startGroupObjs = [
  {
    name: '! FIDE top',
    // Azerichessss Sergey_Karjakin Colchonero64 Vladimirovich9000
    lichessPlayerNames: 'DrNykterstein Alireza2003 Bombegranate AnishGiri AvalonGamemaster',
    chessComPlayerNames: 'MagnusCarlsen Firouzja2003 ChefsHouse FabianoCaruana LevonAronian LachesisQ AnishGiri Grischuk gmwso LyonBeast'
  },
  {
    name: '! custom',
    lichessPlayerNames: 'Thibault Zhigalko_Sergei Benefactorr Chess-Network Crest64 Challenger_Spy ShahMatKanal Shuvalov Pandochka',
    // + BOVGIT_playerName,
    chessComPlayerNames: 'Erik Hikaru VladDobrov ChessQueen ChessNetwork ShahMatKanal'
  }
  // , {
  //   name: streamOnlineGroupName,
  //   lichessPlayerNames: 'streamersOnline', //must be begin value
  //   chessComPlayerNames: ''
  // }
]
const startGroupNum = startGroupObjs.length
let currentGroupName = startGroupObjs[0].name
const MAX_GROUPS_NUM = 10
const MAX_GROUPNAME_LEN = 30
let groupObjs, groupNames

//milliseconds for refresh table after 'await fetch'
// const lichessDelay = 500
// const chessComDelay = 1000

let isFirstChessCom = false
let lastSortSelectorLichess = '', lastSortSelectorChessCom = ''
let lastSortTimeControlLichess = '', lastSortTimeControlChessCom = ''
let username = '', regtype = ''
let intervalID, needRefresh

let inputNode1, inputNode2, tableNode1, tableNode2
inputNode1 = document.querySelector('#InputOrder1')
inputNode2 = document.querySelector('#InputOrder2')
tableNode1 = document.querySelector('#LichessTables')
tableNode2 = document.querySelector('#ChessComTables')

//MobileStyle
if (isMobileDevice) {
  document.querySelector('#bodyStyle').setAttribute("class", "mobileStyle")
  document.querySelector('#projectName').setAttribute("class", "projectName projectNameDifMobile")
  document.querySelector('#modalDialog').setAttribute("class", "modalDialogMobileStyle")
}

// ------------- On-Click ---------------

const modalDialog = document.getElementById('modalDialog');
document.getElementById('modalDialogHide').onclick = () => modalDialog.close()

document.querySelector('#group').onchange = () => onchangeSelectGroup()

document.querySelector('#langSelect').onchange = () => changeLang()

//login
document.querySelector('#buttonPostRegistration').onclick = () => postRegistration()
document.querySelector('#buttonPostLogin').onclick = () => postLogin()
document.querySelector('#buttonPostLogout').onclick = () => postLogout()

//hot keys
document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter'
    || event.keyCode === 13 //for mobile device
  ) {
    refresh()
  }
})

initGroupObjs()

getDataFromStorage()

addAllOptionsToElementGroup(currentGroupName)
setActiveInGroupElement(currentGroupName)

if (isFirstChessCom) {
  changeTablesOrder() //set first chess.com
}

setAutoRefresh()

setTheme()

replaceSomeHeads()
window.addEventListener("orientationchange", function () {
  replaceSomeHeads(window.orientation)
}, false)

needRefresh = true
processUrlParams()

if (needRefresh) {
  refresh()
}

/////////////////// show score: player vs opponents (Lichess) /////////////////////////

//click on rating cell
function scoreLichess(playerName) {
  const thisIsLichess = true
  const arPlayerNames = getArPlayerNames(thisIsLichess)
  getScoreAfterFetchFromLichess(arPlayerNames, playerName)
}

/////////////////// groups of players /////////////////////////

function initGroupObjs() {
  groupObjs = []
  for (let i = 0; i < startGroupNum; i++) {
    groupObjs.push('')
  }
  initStartGroups()
}

function initStartGroups() {
  for (let i = 0; i < startGroupNum; i++) {
    groupObjs[i] = JSON.parse(JSON.stringify(startGroupObjs[i]))
  }
  currentGroupName = groupObjs[0].name
  groupNames = getArGroupNames()
  setLichessOrgPlayerNames(groupObjs[0].lichessPlayerNames)
  setChessComPlayerNames(groupObjs[0].chessComPlayerNames)
}

function addAllOptionsToElementGroup(currentGroupName) {
  const groupElement = document.getElementById('group')
  for (let i = 0; i < groupNames.length; i++) {
    addOptionToSelectElement(groupElement, groupNames[i], currentGroupName)
  }
}

function addOptionToSelectElement(selectElement, optionValue, currentOptionValue) {
  const option = document.createElement("option")
  fillOptionForSelectElement(option, optionValue, currentOptionValue)
  selectElement.appendChild(option)
}

function fillOptionForSelectElement(option, optionValue, currentOptionValue) {
  option.value = optionValue
  option.innerHTML = '<strong><em>' + optionValue + '</em></strong>'
  if (option.value === currentOptionValue) {
    option.selected = true
  }
}

function fillStartGroups() {
  const groupElement = document.getElementById('group')
  for (let i = 0; i < startGroupNum; i++) {
    updateOptionForSelectElement(groupElement, i, groupNames[i], currentGroupName)
  }
}

function updateOptionForSelectElement(selectElement, selectIndex, optionValue, currentOptionValue) {
  const option = selectElement[selectIndex]
  fillOptionForSelectElement(option, optionValue, currentOptionValue)
}

function setActiveInGroupElement(groupName) {
  const groupElement = document.getElementById('group')
  const groupIndex = groupNames.indexOf(groupName, 0)
  updateOptionForSelectElement(groupElement, groupIndex, groupName, groupName)
}

// function clearWholeElementGroup() {
//   const groupElement = document.getElementById('group')
//   groupElement.options.length = 0
//   // for (let i = groupNames.length; i >= 0; i--) {
//   //   groupElement.options[i] = null
//   // }
// }

//after select of group there are:
//group.value, group.selectedIndex (0 ... N), group.options[selectedIndex].selected (true/false)
function onchangeSelectGroup() {
  const group = document.getElementById('group')
  let groupObj = groupObjs.find(item => item.name === group.value)
  if (groupObj) {
    currentGroupName = groupObj.name
    setLichessOrgPlayerNames(groupObj.lichessPlayerNames)
    setChessComPlayerNames(groupObj.chessComPlayerNames)
  }
  if (currentGroupName === streamOnlineGroupName) {
    getStreamersOnlineAfterFetchFromLichess() //Lichess: streamers online
  }
  refresh()
}

function updateGroupObj() {
  const groupObj = groupObjs.find(item => item.name === currentGroupName)
  groupObj.lichessPlayerNames = vm.vueLichessOrgPlayerNames
  groupObj.chessComPlayerNames = vm.vueChessComPlayerNames
}

function getArGroupNames() {
  return groupObjs.map(item => item.name)
}

function groupAdd() {
  let v, msg

  if (getArGroupNames().length === MAX_GROUPS_NUM) {
    // alert(`${MAX_GROUPS_NUM} groups have already been created.\n\nThis is maximum !`)
    const msg = isLangEn() ?
      `${MAX_GROUPS_NUM} groups have already been created.\n\nThis is maximum !` :
      `${MAX_GROUPS_NUM} групп уже создано.\n\nЭто максимум !`
    alert(msg)
    return
  }

  msg = isLangEn() ? `Input name of new group:` : `Введите имя новой группы:`
  const groupName = prompt(msg, '')
  if (groupName === null || groupName === '') {
    return
  }
  if (groupName.length > MAX_GROUPNAME_LEN) {
    // alert(`The name must not exceed ${MAX_GROUPNAME_LEN} symbols !`)
    msg = isLangEn() ?
      `The name must not exceed ${MAX_GROUPNAME_LEN} symbols !` :
      `Длина имени не должна превышать ${MAX_GROUPNAME_LEN} символов !`
    alert(msg)
    return
  }
  v = groupName.toUpperCase()
  const groupObj = groupObjs.find(item => item.name.toUpperCase() === v)
  if (groupObj !== undefined) {
    // alert(`Group "${groupName}" already exists.\n\nPlease enter an another name !`)
    msg = isLangEn() ?
      `Group "${groupName}" already exists.\n\nPlease enter an another name !` :
      `Группа "${groupName}" уже есть.\n\nПожалуйста, введите другое имя !`
    alert(msg)
    return
  }
  if (groupName.includes('!')) {
    // alert(`The name must not include symbol "!".`)
    msg = isLangEn() ? `The name must not include symbol "!".` : `Имя не должно содержать символ  "!".`
    alert(msg)
    return
  }

  //add new group
  groupObjs.push({
    name: groupName,
    lichessPlayerNames: vm.vueLichessOrgPlayerNames,
    chessComPlayerNames: vm.vueChessComPlayerNames
  })
  currentGroupName = groupName

  const groupElement = document.getElementById('group')
  addOptionToSelectElement(groupElement, currentGroupName, currentGroupName)

  setDataToStorage()
  // alert(`It's created group "${groupName}"\nwith the current lists of players.\n\nChange player lists !`)
  msg = isLangEn() ?
    `It's created group "${groupName}"\nwith the current lists of players.\n\nChange player lists !` :
    `Создана группа "${groupName}"\nс текущими списками игроков.\n\nВнесите свои изменения в списки созданной группы!`
  alert(msg)
}

//del current group
function groupDel() {

  let msg, groupName = currentGroupName

  const groupIndex = groupNames.indexOf(groupName, 0)
  if (isThisStartGroup(groupIndex)) {
    // alert(`Group "${groupName}" cannot be deleted !`)
    msg = isLangEn() ? `Group "${groupName}" cannot be deleted !` : `Группу "${groupName}" нельзя удалять !`
    alert(msg)
    return
  }

  // msg = `Delete group "${groupName}" ?`
  msg = isLangEn() ?
    `Delete group "${groupName}" ?` :
    `После удаления нельзя будет восстановить эту группу.\n\nУдалить группу "${groupName}" ?`
  if (!confirm(msg)) {
    return
  }

  const groupElement = document.getElementById('group')
  groupElement.options[groupIndex] = null
  groupElement.options[0].selected = true

  groupObjs = groupObjs.filter((item, index, array) => index !== groupIndex) //del group from groupObjs
  groupNames = getArGroupNames()
  currentGroupName = groupNames[0] //go to group Start

  // onchangeSelectGroup()
  setLichessOrgPlayerNames(groupObjs[0].lichessPlayerNames)
  setChessComPlayerNames(groupObjs[0].chessComPlayerNames)
  refresh()

  // alert(`Group "${groupName}" is deleted.\n\nCurrent group is "${currentGroupName}" !`)
  msg = isLangEn() ?
    `Group "${groupName}" is deleted.\n\nCurrent group is "${currentGroupName}".` :
    `Группа "${groupName}" удалена.\n\nТекущая группа теперь: "${currentGroupName}".`
  alert(msg)
}

//restore current group
function groupRestore() {

  let msg, groupName = currentGroupName

  const groupIndex = groupNames.indexOf(groupName, 0)
  if (!isThisStartGroup(groupIndex)) {
    // alert(`Group "${groupName}" cannot be restored !`)
    msg = isLangEn() ?
      `Group "${groupName}" cannot be restored because it is not start-group !` :
      `Группу "${groupName}" нельзя восстановить , так как она не является стартовой группой !`
    alert(msg)
    return
  }

  // msg = `Restore group "${groupName}" ?`
  msg = isLangEn() ?
    `Restore initial value of the group "${groupName}" ?` :
    `Восстановить начальный состав игроков группы "${groupName}" ?`
  if (!confirm(msg)) {
    return
  }

  groupObjs[groupIndex] = startGroupObjs[groupIndex]
  currentGroupName = groupObjs[groupIndex].name
  groupNames = getArGroupNames()

  // const groupElement = document.getElementById('group')
  // updateOptionForSelectElement(groupElement, groupIndex, currentGroupName, currentGroupName)
  setActiveInGroupElement(currentGroupName)

  setLichessOrgPlayerNames(startGroupObjs[groupIndex].lichessPlayerNames)
  setChessComPlayerNames(startGroupObjs[groupIndex].chessComPlayerNames)
  refresh()
  // alert(`Group "${groupName}" will be restored !`)
  msg = isLangEn() ?
    `Group "${groupName}" is restored !` :
    `Группа "${groupName}" восстановлена !`
  alert(msg)
}

function isThisStartGroup(groupIndex) {
  return (groupIndex > -1 && groupIndex < startGroupNum)
}

function clearUserOptionsForElementGroup() {
  const groupElement = document.getElementById('group')
  let opts = groupElement.options
  while (opts.length > startGroupNum) {
    opts[opts.length - 1] = null
  }
}

function clearGroupSettings() {
  initGroupObjs()
  addAllOptionsToElementGroup(currentGroupName)
  setLichessOrgPlayerNames(groupObjs[0].lichessPlayerNames)
  setChessComPlayerNames(groupObjs[0].chessComPlayerNames)
  clearUserOptionsForElementGroup()
}

/////////////////// exchange data with server (Login, Logout, Registration, ...) by AJAX /////////////////////////

//fetch 'post registration'
async function postRegistrationAjax() {

  const userPassData = getUserPassDataForPost()
  if (!userPassData) {
    return
  }
  outputOkMessage('User registration...')

  const response = await fetch('/registrationAJAX', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' },
    body: userPassData
  })

  if (response.ok) {
    const jsonObj = await response.json()
    out('jsonObj: ' + new Date())
    out(jsonObj)
    if (jsonObj['errorMsg']) {
      let v = jsonObj['errorMsg']['message']
      if (v) {
        outputErrorMessage(`Registration error: ${v}`)
      } else {
        v = jsonObj['errorMsg']
        if (v) {
          outputErrorMessage(`Reg.error: ${v}`)
        } else {
          outputErrorMessage(`Registration unknown error`)
        }
      }
      return
    }
    outputOkMessage('User registered.')

    const user = jsonObj.usernameAfterRegistration
    if (user) {
      alert('User <' + user + '> registered.') //delay
      postLoginAjax()
      return
    } else {
      outputErrorMessage('Impossible to login after registration (username is empty).')
    }
    return
  }
  outputErrorMessage('Error occured during registration.')
}

//fetch 'post login'
async function postLoginAjax() {

  const userPassData = getUserPassDataForPost()
  if (!userPassData) {
    return
  }
  outputOkMessage('User login...')

  const response = await fetch('/loginAJAX', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    },
    body: userPassData
  })

  if (response.ok) {
    const jsonObj = await response.json()
    out('jsonObj: ' + new Date())
    out(jsonObj)
    if (jsonObj['errorMsg']) {
      const v = jsonObj['errorMsg']['message']
      if (v) {
        outputErrorMessage(`Login error: ${v}`)
      } else {
        outputErrorMessage('Login unknown error')
      }
      return
    }
    outputOkMessage('User logged in.')

    let v, v1, v2, v3, v4, v5, v6, v7

    v = jsonObj.usernameAfterLogin
    if (v) {
      v1 = jsonObj.regtypeAfterLogin
      setUsernameAndRegtype(v, v1)
      localStorage.setItem('username', username)
      localStorage.setItem('regtype', regtype)

      //PlayerNamesAfterLogin, isDarkThemeAfterLogin, ...AfterLogin
      v1 = jsonObj.LichessOrgPlayerNamesAfterLogin
      if (v1) {
        setLichessOrgPlayerNames(v1)
        localStorage.setItem('LichessOrgPlayerNames', v1)
      }

      v2 = jsonObj.ChessComPlayerNamesAfterLogin
      if (v2) {
        setChessComPlayerNames(v2)
        localStorage.setItem('ChessComPlayerNames', v2)
      }

      v3 = false
      v = jsonObj.isDarkThemeAfterLogin
      if (v) {
        v3 = (v === '1' ? true : false)
        setCheckDarkTheme(v3)
        localStorage.setItem('DarkThemeChecked', v3 ? '1' : '0')
        setTheme()
      }

      v4 = false
      v = jsonObj.CheckLichessAfterLogin
      if (v) {
        v4 = (v === '1' ? true : false)
        setCheckLichess(v4)
        localStorage.setItem('LichessChecked', v4 ? '1' : '0')
      }

      v5 = false
      v = jsonObj.CheckChessComAfterLogin
      if (v) {
        v5 = (v === '1' ? true : false)
        setCheckChessCom(v5)
        localStorage.setItem('ChessComChecked', v5 ? '1' : '0')
      }

      v6 = false
      v = jsonObj.isFirstChessComAfterLogin
      if (v) {
        v6 = (v === '1' ? true : false)
        if (v6 !== isFirstChessCom) {
          isFirstChessCom = v6
          changeTablesOrder()
        }
        localStorage.setItem('isFirstChessCom', v6 ? '1' : '0')
      }

      v7 = jsonObj.autoRefreshIntervalAfterLogin
      if (v7) {
        setAutoRefreshInterval(v7)
        localStorage.setItem('AutoRefreshInterval', v7)
      }

      if (v1 || v2 || v3 || v4 || v5 || v6) {
        refresh()
      }
    }

    goMainModeFromUser()
    return
  }
  outputErrorMessage('Error occured during login.')
}

//fetch 'post logout'
async function postLogoutAjax() {
  outputOkMessage(`${username} logout...`)

  const response = await fetch('/logoutAJAX') //method GET - by default
  if (response.ok) {
    const jsonObj = await response.json()
    const msg = jsonObj.msg
    outputOkMessage(`${username} logged out. (${msg})`)

    setUsernameAndRegtype('', '')
    localStorage.setItem('username', '')
    localStorage.setItem('regtype', '')

    goMainModeFromUser()
    return
  }
  outputErrorMessage('Error occured during logout.')
}

function getUserPassDataForPost() {

  let v

  //check username
  v = document.querySelector('#username').value.trim()
  if (!v) {
    alert('Fill username !')
    return ''
  } else if (v.toLowerCase() === 'anonym') {
    alert('This username is unacceptable !')
    return ''
  } else if (v.indexOf(' ') >= 0) {
    alert('Username should not contain a space !')
    return ''
  }
  let user = v

  //check password
  v = document.querySelector('#password').value
  if (!v) {
    alert('Fill password !')
    return ''
  } else if (v.indexOf(' ') >= 0) {
    alert('Password should not contain a space !')
    return ''
  }
  let pass = v

  return 'username=' + encodeURIComponent(user) + '&password=' + encodeURIComponent(pass)
}

//send Lichess & Chess.com PlayerNames and other settings to server: AJAX
async function postSettingsAJAX() {
  let usernameLocal = username ? username : 'anonym'
  let data = {
    username: (isUserLogged() ? usernameLocal : ''),
    regtype: regtype,
    LichessOrgPlayerNames: getLichessOrgPlayerNames(),
    ChessComPlayerNames: getChessComPlayerNames(),
    AutoRefreshInterval: getAutoRefreshInterval(),
    CheckLichess: (isCheckLichess() ? '1' : '0'),
    CheckChessCom: (isCheckChessCom() ? '1' : '0'),
    isDarkTheme: (isCheckDarkTheme() ? '1' : '0'),
    isFirstChessCom: (isFirstChessCom ? '1' : '0')
  }
  try {
    const response = await fetch('/sendUserSettingsToServerAJAX', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(data)
    })
    if (response.ok) {
      const jsonObj = await response.json()
      out('jsonObj: ' + new Date())
      out(jsonObj)
      if (jsonObj['afterSendUserSettingsToServerAJAX']) {
        return //ok, send.
      }
      out('Error occured during afterSendUserSettingsToServerAJAX.')
      markUserAsDisconnected()
    } else {
      out('Error occured during sendUserSettingsToServerAJAX.')
    }
  } catch (err) {
    if (!isUserMarkedAsDisconnected()) {
      //alert('Network/Server error: ' + err.message)
      alert('Network/Server error')
    }
    // out('FetchError during sendUserSettingsToServerAJAX:')
    // out(err.message)
    markUserAsDisconnected()
  }
}

async function checkAndMarkUserAsDisconnectedAJAX() {
  let data = { username: username }
  const response = await fetch('/isUserLoggedAJAX', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(data)
  })
  if (response.ok) {
    const jsonObj = await response.json()
    out('isUserLoggedAJAX: jsonObj: ' + new Date())
    out(jsonObj)
    const v = jsonObj['isUserLoggedAJAX']
    if (v) {
      if (v === '0') {
        markUserAsDisconnected()
      }
      return
    }
    out('Error occured during afterIsUserLoggedAJAX.')
    return
  }
  out('Error occured during isUserLoggedAJAX.')
}

function outputErrorMessage(msg) {
  document.querySelector('#errorMessage').textContent = msg
  document.querySelector('#okMessage').textContent = ''
}

function outputOkMessage(msg) {
  document.querySelector('#errorMessage').textContent = ''
  document.querySelector('#okMessage').textContent = msg
}

function clearMessages() {
  document.querySelector('#errorMessage').textContent = ''
  document.querySelector('#okMessage').textContent = ''
}

/////////////////// exchange data with server (Login, Logout, Registration, ...) by reload page /////////////////////////

function processUrlParams() {
  const urlParams = new URLSearchParams(window.location.search)
  let v, v1, v2, v3, v4, v5, v6, v7, err

  v1 = urlParams.get('afterSendUserSettingsToServer')
  if (v1) {
    v = localStorage.getItem('username')
    v1 = localStorage.getItem('regtype')
    if (v) {
      setUsernameAndRegtype(v, v1)
    }
    return
  }

  //show errorMsgAfterRegistration
  err = urlParams.get('errorMsgAfterRegistration')
  if (err) {
    setUsernameAndRegtype('', '')
    alert('errorMsgAfterRegistration: ' + err)
    return
  }

  //usernameAfterRegistration
  const user = urlParams.get('usernameAfterRegistration')
  if (user) {
    const pass = urlParams.get('passwordAfterRegistration')
    if (pass) {
      alert('User <' + user + '> registered.') //delay
      postUserAction('/login', user, pass)
    }
    else {
      alert('Impossible to login after registration (password is empty).')
    }
    return
  }

  //show errorMsgAfterLogin
  err = urlParams.get('errorMsgAfterLogin')
  if (err) {
    alert('errorMsgAfterLogin: ' + err)
    return
  }

  //usernameAfterLogin, ...AfterLogin
  v = urlParams.get('usernameAfterLogin')
  if (v) {
    v1 = urlParams.get('regtypeAfterLogin')
    setUsernameAndRegtype(v, v1)
    localStorage.setItem('username', username)
    localStorage.setItem('regtype', regtype)

    //PlayerNamesAfterLogin, isDarkThemeAfterLogin, ...AfterLogin
    v1 = urlParams.get('LichessOrgPlayerNamesAfterLogin')
    if (v1) {
      setLichessOrgPlayerNames(v1)
      localStorage.setItem('LichessOrgPlayerNames', v1)
    }

    v2 = urlParams.get('ChessComPlayerNamesAfterLogin')
    if (v2) {
      setChessComPlayerNames(v2)
      localStorage.setItem('ChessComPlayerNames', v2)
    }

    v3 = false
    v = urlParams.get('isDarkThemeAfterLogin')
    if (v) {
      v3 = (v === '1' ? true : false)
      setCheckDarkTheme(v3)
      localStorage.setItem('DarkThemeChecked', v3 ? '1' : '0')
      setTheme()
    }

    v4 = false
    v = urlParams.get('CheckLichessAfterLogin')
    if (v) {
      v4 = (v === '1' ? true : false)
      setCheckLichess(v4)
      localStorage.setItem('LichessChecked', v4 ? '1' : '0')
    }

    v5 = false
    v = urlParams.get('CheckChessComAfterLogin')
    if (v) {
      v5 = (v === '1' ? true : false)
      setCheckChessCom(v5)
      localStorage.setItem('ChessComChecked', v5 ? '1' : '0')
    }

    v6 = false
    v = urlParams.get('isFirstChessComAfterLogin')
    if (v) {
      v6 = (v === '1' ? true : false)
      if (v6 !== isFirstChessCom) {
        isFirstChessCom = v6
        changeTablesOrder()
      }
      localStorage.setItem('isFirstChessCom', v6 ? '1' : '0')
    }

    v7 = urlParams.get('autoRefreshIntervalAfterLogin')
    if (v7) {
      setAutoRefreshInterval(v7)
      localStorage.setItem('AutoRefreshInterval', v7)
    }

    if (v1 || v2 || v3 || v4 || v5 || v6) {
      refresh()
      needRefresh = false
    }
    return
  }

  //usernameAfterLogout
  v = urlParams.get('usernameAfterLogout')
  if (v) {
    setUsernameAndRegtype('', '')
    localStorage.setItem('username', '') //localSession finished
    localStorage.setItem('regtype', '')
    return
  }

  // //if username already was in localStorage and PageAlreadyWasVisitedAtSession, then suggest to login
  // v = localStorage.getItem('username')
  // if (v) {
  //   v1 = 'PageAlreadyWasVisitedAtThisBrowserTab'
  //   v2 = sessionStorage.getItem(v1)
  //   v2 ? goUserMode() : sessionStorage.setItem(v1, 1)
  //   return
  // }

  //if username already was in localStorage, then localSession continue !
  v = localStorage.getItem('username')
  v1 = localStorage.getItem('regtype')
  if (v) {
    setUsernameAndRegtype(v, v1) //as logged!

    v1 = 'PageAlreadyWasVisitedAtThisBrowserTab'
    v2 = sessionStorage.getItem(v1)
    if (!v2) {
      sessionStorage.setItem(v1, 1)
      useAJAX ? checkAndMarkUserAsDisconnectedAJAX() : postSettings()
    }
    return
  }
}

function postLogin() {
  useAJAX ? postLoginAjax() : postCheckAndAction('/login')
}

function postLogout() {
  useAJAX ? postLogoutAjax() : postUserAction('/logout', '1', '1')
}

function postRegistration() {
  useAJAX ? postRegistrationAjax() : postCheckAndAction('/registration')
}

function postCheckAndAction(action) {

  let v

  //check username
  v = document.querySelector('#username').value.trim()
  if (!v) {
    alert('Fill username !')
    return
  } else if (v.toLowerCase() === 'anonym') {
    alert('This username is unacceptable !')
    return
  } else if (v.indexOf(' ') >= 0) {
    alert('Username should not contain a space !')
    return
  }
  user = v

  //check password
  v = document.querySelector('#password').value.trim()
  if (!v) {
    alert('Fill password !')
    return
  } else if (v.indexOf(' ') >= 0) {
    alert('Password should not contain a space !')
    return
  }
  pass = v

  postUserAction(action, user, pass)
}

//emulate submit post-action for user: '/login' or '/logout' or '/registration'
function postUserAction(action, username, password) {
  let form = document.createElement('form')
  form.action = action
  form.method = 'POST'
  form.innerHTML = '<input name="username" value="' + username + '">'
    + '<input name="password" value="' + password + '">'
  document.body.append(form)
  form.submit()
  form.remove()
}

//send Lichess & Chess.com PlayerNames and other settings to server
function postSettings() {
  let usernameLocal = (username ? username : 'anonym')
  let form = document.createElement('form')
  form.action = '/sendUserSettingsToServer'
  form.method = 'POST'
  form.innerHTML = '<input name="username" value="' + usernameLocal + '">'
    + '<input name="regtype" value="' + regtype + '">'
    + '<input name="LichessOrgPlayerNames" value="' + getLichessOrgPlayerNames() + '">'
    + '<input name="ChessComPlayerNames" value="' + getChessComPlayerNames() + '">'
    + '<input name="CheckLichess" value="' + (isCheckLichess() ? '1' : '0') + '">'
    + '<input name="CheckChessCom" value="' + (isCheckChessCom() ? '1' : '0') + '">'
    + '<input name="AutoRefreshInterval" value="' + getAutoRefreshInterval() + '">'
    + '<input name="isDarkTheme" value="' + (isCheckDarkTheme() ? '1' : '0') + '">'
    + '<input name="isFirstChessCom" value="' + (isFirstChessCom ? '1' : '0') + '">'

  document.body.append(form)
  form.submit()
  form.remove()
}

/////////////////////////////////////////////////////////////////////////////

function setUsernameAndRegtype(user, type) {
  username = (user ? user : '')
  regtype = (type ? type : '')
  regtype = (regtype === 'userpass' ? '' : regtype)
  vm.vueCurrentUsername = username
}

function isUserLogged() {
  const v1 = vm.vueCurrentUsername
  return (username) && (v1.indexOf(DISCONNECTED_TEXT) === -1)
}

function markUserAsDisconnected() {
  vm.vueCurrentUsername = username + DISCONNECTED_TEXT
}

function isUserMarkedAsDisconnected() {
  const v = vm.vueCurrentUsername
  return (v.indexOf(DISCONNECTED_TEXT) >= 0)
}

/////////////////////////////////////////////////////////////////////////////

//trim() for PlayerNames
function onchangeLichessPlayerNames() {
  let v = getLichessOrgPlayerNames()
  v = (v === undefined ? '' : v)
  setLichessOrgPlayerNames(v)
  updateGroupObj()
}
function onchangeChessComPlayerNames() {
  let v = getChessComPlayerNames()
  v = (v === undefined ? '' : v)
  setChessComPlayerNames(v)
  updateGroupObj()
}
function onchangeAutoRefreshInterval() {
  let v = getAutoRefreshInterval()
  v = (v === undefined ? '' : v)
  setAutoRefreshInterval(v.trim())

  //временно закомментарено, пока недоступна кнопка 'User'
  // useAJAX ? postSettingsAJAX() : postSettings()
}

function onClickSetTheme() {
  setCheckDarkTheme(!isCheckDarkTheme()) //inversion checkbox
  setDataToStorage()
  setTheme()
}

//replace some heads for 'mobile portrait'
function replaceSomeHeads(windowOrientation) {
  return
  // let b, p, useLongWords = false
  // if (windowOrientation === undefined) {
  //   const mediaQuery = window.matchMedia('(orientation: landscape)')
  //   useLongWords = !isMobileDevice || mediaQuery.matches //PC or landscape
  // } else {
  //   useLongWords = (windowOrientation === 90 || windowOrientation === -90) //landscape
  // }

  // if (useLongWords) {
  //   //for PC or landscape
  //   b = 'bullet'
  //   p = 'puzzle'
  // } else {
  //   //for mobile portrait
  //   b = 'bull'
  //   p = 'puzl'
  // }

  // document.querySelector('.THeadbulletLichess').textContent = b
  // document.querySelector('.THeadpuzzleLichess').textContent = p
  // document.querySelector('.THeadbulletChessCom').textContent = b
  // document.querySelector('.THeadpuzzleChessCom').textContent = p
}

function sortBulletLichess() {
  const thisIsLichess = true
  const timeControl = 'bullet'
  sortTable(thisIsLichess, timeControl)
}
function sortBlitzLichess() {
  const thisIsLichess = true
  const timeControl = 'blitz'
  sortTable(thisIsLichess, timeControl)
}
function sortRapidLichess() {
  const thisIsLichess = true
  const timeControl = 'rapid'
  sortTable(thisIsLichess, timeControl)
}
function sortPuzzleLichess() {
  const thisIsLichess = true
  const timeControl = 'puzzle'
  sortTable(thisIsLichess, timeControl)
}
function sortRushLichess() {
  const thisIsLichess = true
  const timeControl = 'rush'
  sortTable(thisIsLichess, timeControl)
}

function sortBulletChessCom() {
  const thisIsLichess = false
  const timeControl = 'bullet'
  sortTable(thisIsLichess, timeControl)
}
function sortBlitzChessCom() {
  const thisIsLichess = false
  const timeControl = 'blitz'
  sortTable(thisIsLichess, timeControl)
}
function sortRapidChessCom() {
  const thisIsLichess = false
  const timeControl = 'rapid'
  sortTable(thisIsLichess, timeControl)
}
function sortPuzzleChessCom() {
  const thisIsLichess = false
  const timeControl = 'puzzle'
  sortTable(thisIsLichess, timeControl)
}
function sortRushChessCom() {
  const thisIsLichess = false
  const timeControl = 'rush'
  sortTable(thisIsLichess, timeControl)
}

//sort columns ('bullet', 'blitz', 'rapid', 'puzzle', 'rush') in Table
function sortTable(thisIsLichess, timeControl) {

  if (timeControl === '') {
    return
  }

  let tableRef = getChessTableRef(thisIsLichess)
  let r, rowCount = tableRef.rows.length
  let c, cellcount, cells
  let s, n, selector, lastSymbol

  if (rowCount === 0) {
    return
  }

  let a = new Array(rowCount)

  //fill array from table
  for (r = 0; r < rowCount; r++) {
    cells = tableRef.rows[r].cells
    cellcount = cells.length
    a[r] = new Array(cellcount)
    for (c = 0; c < cellcount; c++) {
      if (c === 0) {
        s = thisIsLichess ? vm.vueArLichessPlayers[r].playerName : vm.vueArChessComPlayers[r].playerName
      } else {
        s = cells[c].textContent
      }

      s = s.trim() //cell value

      //playerHTML
      if (c === 0) {
        a[r][c] = s
      }

      //bullet, blitz, rapid, puzzle, rush ---> to number
      else {
        n = 0
        if (s !== '') {
          n = parseInt(s, 10)
          if (isNaN(n) || !(Number.isInteger(n))) {
            n = 0
          }
        }
        a[r][c] = n
      }
    }
  }

  //sort array in column <timeControl>
  a.sort(function (x, y) {
    let i = mapTimeControl.get(timeControl) //i=1: bullet, i=2: blitz, ...
    // return x[i] - y[i] //asc
    return y[i] - x[i] //desc
  })

  //delete sortSymbolAtHead from previous sorted column
  delSortSymbolAtHeadFromPreviousSortedColumn(thisIsLichess)

  // <th class='THeadbulletLichess'>Bullet</th>
  // <th class='THeadbulletChessCom'>Bullet</th>
  selector = '.THead' + timeControl + (thisIsLichess ? 'Lichess' : 'ChessCom')

  //to place sortSymbolAtHead after head of sorted column
  s = document.querySelector(selector).textContent
  lastSymbol = s.slice(-1)
  if (lastSymbol !== sortSymbolAtHead) {
    document.querySelector(selector).textContent += sortSymbolAtHead
  }

  //set lastSortSelector
  if (thisIsLichess) {
    lastSortSelectorLichess = selector
    lastSortTimeControlLichess = timeControl
  } else {
    lastSortSelectorChessCom = selector
    lastSortTimeControlChessCom = timeControl
  }

  const arTmp = []
  let r1, playerHTML
  for (r = 0; r < rowCount; r++) {
    for (r1 = 0; r1 < rowCount; r1++) {
      playerHTML = thisIsLichess ? vm.vueArLichessPlayers[r1].playerName : vm.vueArChessComPlayers[r1].playerName
      if (a[r][0] === playerHTML) {
        arTmp.push(thisIsLichess ? vm.vueArLichessPlayers[r1] : vm.vueArChessComPlayers[r1])
        break
      }
    }
  }
  for (r = 0; r < rowCount; r++) {
    if (thisIsLichess) {
      vm.vueArLichessPlayers[r] = arTmp[r]
    } else {
      vm.vueArChessComPlayers[r] = arTmp[r]
    }
  }
}

//delete sortSymbolAtHead from previous sorted column
function delSortSymbolAtHeadFromPreviousSortedColumn(thisIsLichess) {
  let selectorPrev = thisIsLichess ? lastSortSelectorLichess : lastSortSelectorChessCom
  if (selectorPrev !== '') {
    let s = document.querySelector(selectorPrev).textContent
    let lastSymbol = s.slice(-1)
    if (lastSymbol === sortSymbolAtHead) {
      document.querySelector(selectorPrev).textContent = s.slice(0, -1)
    }
  }
}

function clearLastSort(thisIsLichess) {
  delSortSymbolAtHeadFromPreviousSortedColumn(thisIsLichess)
  if (thisIsLichess) {
    lastSortSelectorLichess = ''
    lastSortTimeControlLichess = ''
  } else {
    lastSortSelectorChessCom = ''
    lastSortTimeControlChessCom = ''
  }
}

/////////////////////////////////////////////////////////////////////////////

//refresh all tables
function refresh() {

  let thisIsLichess = true
  clearLastSort(thisIsLichess)
  refreshOneTable(thisIsLichess)
  // if (lastSortTimeControlLichess !== '') {
  //   setTimeout(function () { sortTable(thisIsLichess, lastSortTimeControlLichess) }, lichessDelay) //execute in N ms
  // }

  thisIsLichess = false
  clearLastSort(thisIsLichess)
  refreshOneTable(thisIsLichess)
  // if (lastSortTimeControlChessCom !== '') {
  //   setTimeout(function () { sortTable(fthisIsLichess, lastSortTimeControlChessCom) }, chessComDelay) //execute in N ms
  // }

  setDataToStorage()
  // setAutoRefresh()
}

function refreshLichess() {
  const thisIsLichess = true
  refreshOne(thisIsLichess)
}

function refreshChessCom() {
  const thisIsLichess = false
  refreshOne(thisIsLichess)
}

function refreshOne(thisIsLichess) {
  clearLastSort(thisIsLichess)
  refreshOneTable(thisIsLichess)
  setDataToStorage()
}

function refreshOneTable(thisIsLichess) {
  // replaceSomeHeads()

  // const selectorTable = thisIsLichess ? '.TableLichessRatings' : '.TableChessComRatings'
  const selectorTable = thisIsLichess ? '#LichessTables' : '.TableChessComRatings'

  const elem = document.querySelector(selectorTable)
  if (isCheckOfTable(thisIsLichess)) {
    if (elem.style.display !== 'block') {
      elem.style.display = 'block' //table is visible
    }
    fillTableFromServer(thisIsLichess)
  } else {
    if (elem.style.display !== 'none') {
      elem.style.display = 'none' //table is non-visible
    }
  }
}

function getChessTableRef(thisIsLichess) {
  const tableName = thisIsLichess ? '.TBodyLichess' : '.TBodyChessCom'
  const tableRef = document.querySelector(tableName)
  return tableRef
}

function getArPlayerNames(thisIsLichess) {
  let playerNames = getPlayerNames(thisIsLichess)
  let arPlayerNames = playerNames.split(' ') //get array of Players names
  arPlayerNames = arPlayerNames.filter(item => item !== '') //leave not-empty values

  return arPlayerNames
}

async function fillTableFromServer(thisIsLichess) {
  let arPlayerNames = getArPlayerNames(thisIsLichess)
  if (arPlayerNames.length === 0) {
    return
  }

  outMsgWait(thisIsLichess, true)
  // try {

  if (thisIsLichess) {
    vm.vueArLichessPlayersBuf.length = 0
    await getDataFromLichess(arPlayerNames)
  } else {
    vm.vueArChessComPlayersBuf.length = 0
    vm.vueArChessComPlayersBuf = vm.vueArChessComPlayersBuf.map((item, index) => {
      const playerHTML = '', playerName = '', bullet = '', blitz = '', rapid = '', puzzle = '', rush = ''
      vm.vueArChessComPlayersBuf[index] = { playerHTML, playerName, bullet, blitz, rapid, puzzle, rush }
    })
    await getDataFromChessCom(arPlayerNames)
  }

  // const milliSeconds = thisIsLichess ? lichessDelay : chessComDelay
  // setTimeout(function () { showTableContent(thisIsLichess, arPlayerNames) }, milliSeconds) //execute in N ms
  showTableContent(thisIsLichess, arPlayerNames)

  // } catch (err) {
  //   out(`error: ${err}`)
  // }
  outMsgWait(thisIsLichess, false)
}

//show table (it's random order sometimes after refresh by ajax)
function showTableContent(thisIsLichess, arPlayerNames) {

  if (arPlayerNames.length === 0) {
    return
  }

  const rowCount = thisIsLichess ? vm.vueArLichessPlayersBuf.length : vm.vueArChessComPlayersBuf.length
  const arTmp = []
  for (let step = 0; step < arPlayerNames.length; step++) {
    const playerName = arPlayerNames[step]
    if (playerName !== '') {
      for (let r1 = 0; r1 < rowCount; r1++) {
        const vuePlayerName = thisIsLichess ? vm.vueArLichessPlayersBuf[r1].playerName : vm.vueArChessComPlayersBuf[r1].playerName
        if (playerName === vuePlayerName) {
          arTmp.push(thisIsLichess ? vm.vueArLichessPlayersBuf[r1] : vm.vueArChessComPlayersBuf[r1])
          break
        }
      }
    }
  }

  if (thisIsLichess) {
    vm.vueArLichessPlayers = [...arTmp]
  } else {
    vm.vueArChessComPlayers = [...arTmp]
  }
}

async function getDataFromLichess(arPlayerNames) {
  // await getProfileAfterFetchFromLichess(arPlayerNames) //N queries for N players
  await getProfilesAfterFetchFromLichess(arPlayerNames) //one query for many players
  await getStatusAfterFetchFromLichess(arPlayerNames)
  await getDynamicsAfterFetchFromLichess(arPlayerNames)

  clearMetaText(arPlayerNames)
}

//clear not-used META_texts for players
function clearMetaText(arPlayerNames) {
  arPlayerNames.forEach((item, index) => {
    let playerHTML = vm.vueArLichessPlayersBuf[index].playerHTML.replace(META_STATUS_TEXT, '')
    playerHTML = playerHTML.replace(META_STATUS_SYMBOL, '')
    // playerHTML = playerHTML.replace(META_SCORE, '')
    vm.vueArLichessPlayersBuf[index].playerHTML = playerHTML
  })
}

//one query for many players
async function getProfilesAfterFetchFromLichess(arPlayerNames) {

  const playerNamesByComma = arPlayerNames.join(',')
  const response = await fetch('https://lichess.org/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    body: playerNamesByComma
  })
  if (!response.ok) {
    out(`status error: ${response.status} ${response.statusText} - getProfilesAfterFetchFromLichess`)
    return
  }

  const beginDate = getBeginOfYesterday()

  const arJsonObj = await response.json() //array with non-guaranted order
  arPlayerNames.forEach((playerName, index) => {
    const playerNameUpper = playerName.toUpperCase()
    const jsonObj = arJsonObj.find(item => item.username.toUpperCase() === playerNameUpper)
    if (!jsonObj) {
      //player not found
      out(`${playerName} - lichess, response.json error`) //: ${response.status}`)
      vm.vueArLichessPlayersBuf.push({
        // playerHTML: '<em>? ' + playerName + '</em>',
        playerHTML: '<em>' + playerName + '</em>',
        playerName, bullet: '', blitz: '', rapid: '', puzzle: '', rush: ''
      })
    } else {
      // const isOnline = getJsonValue1(playerName, jsonObj, 'online')
      //const onlineSymbol = isOnline ? onlineSymbolAtPlayer + ' ' : ''
      let v

      //playerTitle: title of player (GM, IM, FM, ...)
      let playerTitle = getJsonValue1(playerName, jsonObj, 'title')
      playerTitle = (playerTitle === undefined) ? '' : playerTitle + ' '

      //playerHint
      let playerHint = ''
      let playerMyDesccription = mapLichessPlayersDescription.get(playerName)
      if (playerMyDesccription) {
        playerHint = playerMyDesccription + '\n\n'
      }

      const firstName = getJsonValue2(playerName, jsonObj, 'profile', 'firstName')
      const lastName = getJsonValue2(playerName, jsonObj, 'profile', 'lastName')
      const location = getJsonValue2(playerName, jsonObj, 'profile', 'location')
      const fideRating = getJsonValue2(playerName, jsonObj, 'profile', 'fideRating')
      const bio = getJsonValue2(playerName, jsonObj, 'profile', 'bio')
      const links = getJsonValue2(playerName, jsonObj, 'profile', 'links')

      let createdAt = '' //registration date
      v = getJsonValue1(playerName, jsonObj, 'createdAt')
      if (v) { createdAt = (new Date(v)).getFullYear() }

      let lastOnline = '' //date&time of last login (milliseconds)
      v = getJsonValue1(playerName, jsonObj, 'seenAt')
      let classLastOnline = 'lastOnline'
      if (v) {
        lastOnline = getDateHHMM(v)
        if (new Date(v) < beginDate) {
          classLastOnline = 'lastOnlineBeforeToday'
        }
      }
      const firstPart = (firstName ? firstName + ' ' : '')
        + (lastName ? lastName : '')
        + (location ? ((firstName || lastName) ? ', ' : '') + location : '')
        + (fideRating ? ', FIDE ' + fideRating : '')
        + (playerTitle && !playerMyDesccription ? ', ' + playerTitle : '')
      playerHint += firstPart
        + (firstPart ? '\n' : '')
        + (createdAt ? 'reg. ' + createdAt : '')
        + (lastOnline ? '\nlast online ' + lastOnline : '')
        + '\n' + META_STATUS_TEXT
        // + (bio ? '\n' + bio.replaceAll('"', '\'') : '') // (") - called error
        + (bio ? '\n' + myReplaceAll(bio, '"', "'") : '') // (") - called error
        + (links ? '\n' + links : '')

      //playerHTML (href !)
      // const playerURL = getJsonValue1(playerName, jsonObj, 'url')
      const playerURL = 'https://lichess.org/@/' + playerName
      let playerHTML = '<a href="' + playerURL + '" target="_blank" title="' + playerHint + '">'
        + META_STATUS_SYMBOL // onlineSymbol
        + '<span class="playerTitle">' + playerTitle + ' </span>'
        + '<strong>' + playerName + '</strong></a>'
        + (lastOnline ? '<br><span class="' + classLastOnline + '">' + lastOnline + '</span>' : '')

      const bullet = getJsonValue3(playerName, jsonObj, 'perfs', 'bullet', 'rating')
      const blitz = getJsonValue3(playerName, jsonObj, 'perfs', 'blitz', 'rating')
      const rapid = getJsonValue3(playerName, jsonObj, 'perfs', 'rapid', 'rating')
      const puzzle = getJsonValue3(playerName, jsonObj, 'perfs', 'puzzle', 'rating')
      const rush = getJsonValue3(playerName, jsonObj, 'perfs', 'storm', 'score') //rush (max)

      vm.vueArLichessPlayersBuf.push({ playerHTML, playerName, bullet, blitz, rapid, puzzle, rush })
    }
  })
}

async function getStreamersOnlineAfterFetchFromLichess() {

  // let results = await getFetchStreamersOnlineFromLichess()
  // if (results[0] !== null) {
  //   let arPlayerNames = results[0].map(item => item.name)
  //   const playerNamesBySpace = arPlayerNames.join(' ')
  //   setLichessOrgPlayerNames(playerNamesBySpace)
  //   onchangeLichessPlayerNames()
  // }

  try {
    const response = await fetch(urlHttpServiceLichessStreamersOnline, { mode: modeCORS })
    if (response.ok) {
      const arJsonObj = await response.json()
      if (arJsonObj) {
        let arPlayerNames = arJsonObj.map(item => item.name)
        const playerNamesBySpace = arPlayerNames.join(' ')
        setLichessOrgPlayerNames(playerNamesBySpace)
        onchangeLichessPlayerNames()
      }
    }
  } catch (e) {
    out(`getStreamersOnlineAfterFetchFromLichess(), error: ${e}`)
  }
}

async function getFetchStreamersOnlineFromLichess() {
  // let jobs = []
  // const url = `${urlHttpServiceLichessStreamersOnline}`
  // let job = fetch(url, { mode: modeCORS }).then(
  //   successResponse => {
  //     if (successResponse.status != 200) { return null }
  //     else { return successResponse.json() }
  //   },
  //   failResponse => { return null }
  // )
  // jobs.push(job)
  // let results = await Promise.all(jobs)
  // return results
}


async function getStatusAfterFetchFromLichess(arPlayerNames) {
  let statusResults = await getFetchStatusFromLichess(arPlayerNames)
  statusResults[0].forEach((jsonObj) => {
    const playerName = jsonObj.name
    arPlayerNames.forEach((item, index) => {
      if (playerName.toUpperCase() === item.toUpperCase()) {
        const patron = getJsonValue1(playerName, jsonObj, 'patron')
        const online = getJsonValue1(playerName, jsonObj, 'online')
        const playing = getJsonValue1(playerName, jsonObj, 'playing')
        const streaming = getJsonValue1(playerName, jsonObj, 'streaming')

        //META_STATUS_TEXT
        let s = patron ? 'Patron. ' : ''

        const e = isLangEn()
        const stNow = e ? 'Now' : 'Сейчас'
        const stPlaying = e ? 'playing' : 'играет'
        const stStreaming = e ? 'streaming' : 'стримит'
        const stOnline = e ? 'online' : 'онлайн'

        // s += online || streaming || playing ? 'Now: ' : ''
        // s += playing ? 'playing, ' : ''
        // s += streaming ? 'streaming, ' : ''
        // s += online && !streaming && !playing ? 'online, ' : ''
        s += online || streaming || playing ? (stNow + ' ') : ''
        s += playing ? (stPlaying + ', ') : ''
        s += streaming ? (stStreaming + ', ') : ''
        s += online && !streaming && !playing ? (stOnline + ', ') : ''

        s = s.trim()
        if (s[s.length - 1] === ',') {
          s = s.slice(0, s.length - 1) + '.' //del last symbol (comma)
        }
        let status = s ? s + '\n' : ''
        let playerHTML = vm.vueArLichessPlayersBuf[index].playerHTML.replace(META_STATUS_TEXT, status)

        //META_STATUS_SYMBOL
        s = ''
        if (streaming) {
          s = '<span class="statusStreaming">' + onlineSymbolStreaming + '</span>'
        }
        if (playing) {
          s += '<span class="statusPlaying">' + onlineSymbolPlaying + '</span>'
        }
        if (online && !streaming && !playing) {
          s = '<span class="statusOnline">' + onlineSymbolOnline + '</span>'
        }
        playerHTML = playerHTML.replace(META_STATUS_SYMBOL, s)

        vm.vueArLichessPlayersBuf[index].playerHTML = playerHTML
      }
    })
  })
}

async function getFetchStatusFromLichess(arPlayerNames) {
  let jobs = []
  const playerNamesByComma = arPlayerNames.join(',')
  const url = `${urlHttpServiceLichessStatus}${playerNamesByComma}`
  let job = fetch(url, { mode: modeCORS }).then(
    successResponse => {
      if (successResponse.status != 200) { return null }
      else { return successResponse.json() }
    },
    failResponse => { return null }
  )
  jobs.push(job)
  let results = await Promise.all(jobs)
  return results
}

async function getDynamicsAfterFetchFromLichess(arPlayerNames) {
  let dynamicsResults = await getFetchDynamicsFromLichess(arPlayerNames)
  dynamicsResults.forEach((jsonObjs, index) => {
    // let playerName = arPlayerNames[index]
    if (!jsonObjs || jsonObjs.length === 0) {
      return
    }
    for (let tableCol of ['bullet', 'blitz', 'rapid', 'puzzle']) {
      const isGames = (tableCol === 'bullet') || (tableCol === 'blitz') || (tableCol === 'rapid')
      const key1 = (isGames ? 'games' : 'puzzles')
      const key2 = (isGames ? tableCol : 'score')
      const key3 = 'rp'
      const jsonObj = jsonObjs.find((item) => {
        return item[key1] && item[key1][key2] && item[key1][key2][key3]
          ? true : false
      })
      if (jsonObj) {
        const ratingAfter = jsonObj[key1][key2][key3].after
        const ratingBefore = jsonObj[key1][key2][key3].before
        if (ratingAfter && ratingBefore) {
          const diff = ratingAfter - ratingBefore
          if (diff !== 0) {
            const classRatingPlus = isMobileDevice ? 'mobileRatingPlus' : 'ratingPlus'
            const classRating = diff > 0 ? classRatingPlus : 'ratingMinus'
            let diffTag = (diff > 0 ? '+' : '') + `${diff}`
            diffTag = diff > 0 ? '<sup>' + diffTag + '</sup>' : '<sub>' + diffTag + '</sub>'
            diffTag = `<span class="${classRating}">${diffTag}</span>`
            const row = vm.vueArLichessPlayersBuf[index]
            row[tableCol] = `${row[tableCol]}${diffTag}`
            vm.vueArLichessPlayersBuf[index] = row
          }
        }
      }
    }
  })
}

async function getFetchDynamicsFromLichess(arPlayerNames) {
  let jobs = []
  // let milliSeconds = 150
  // let delta = 0
  for (let playerName of arPlayerNames) {
    const url = `${urlHttpServiceLichess}${playerName}/activity`

    // milliSeconds += ++delta
    // out(milliSeconds)
    // await new Promise((resolve, reject) => setTimeout(resolve, milliSeconds))

    let job = fetch(url, { mode: modeCORS }).then(
      successResponse => {
        if (successResponse.status != 200) { return null }
        else {
          return successResponse.json()
        }
      },
      failResponse => { return null }
    )
    jobs.push(job)
  }
  let results = await Promise.all(jobs)
  return results
}

async function getScoreAfterFetchFromLichess(arPlayerNames, myName) {
  const index = arPlayerNames.indexOf(myName)
  if (index === -1) {
    return //non-possible, but ...
  }

  const thisIsLichess = true
  outMsgWait(thisIsLichess, true)

  const isFirefox = isBrowserFirefox()
  let isError = false
  let allScore = ''
  const maxNameLength = Math.max.apply(null, arPlayerNames.map(w => w.length))
  // let milliSeconds = 80
  // let delta = 1
  for (let opponentName of arPlayerNames) {
    if (opponentName !== myName) {
      const url = `${urlHttpServiceLichessScore}${myName}/${opponentName}`

      // milliSeconds += ++delta
      // out(milliSeconds)
      // await new Promise((resolve, reject) => setTimeout(resolve, milliSeconds))

      try {
        const response = await fetch(url)
        if (response.ok) {

          // milliSeconds += ++delta
          // await new Promise((resolve, reject) => setTimeout(resolve, milliSeconds))

          const jsonObj = await response.json()
          //{ error: "Too many requests. Try again later." }
          if (jsonObj && !jsonObj['error']) {
            //{"users":{"bovgit":16.5,"maia1":12.5},"nbGames":29}
            let myGetName = '', myScore = 0, oppoName = '', oppoScore = 0
            const users = jsonObj.users
            for (let username in users) {
              if (username.toUpperCase() === myName.toUpperCase()) {
                myGetName = username
                myScore = users[username]
              } else {
                oppoName = username
                oppoScore = users[username]
              }
            }

            const diff = myScore - oppoScore
            let diffTag = (diff > 0 ? '+' : '') + `${diff}`
            if (diff !== 0 && !isFirefox) {
              const classScore = diff > 0 ? 'scorePlus' : 'scoreMinus'
              diffTag = `<span class="${classScore}">${diffTag}</span>`
            }

            const delimiter = '_'
            const addSpaces = delimiter.repeat(maxNameLength - oppoName.length + 2)
            if (isFirefox) {
              allScore += `X - ${oppoName} ${addSpaces} ${myScore} : ${oppoScore} = ${diffTag}\n`
            } else {
              allScore += `${myGetName} - ${oppoName} ${addSpaces}   ${myScore} : ${oppoScore} = ${diffTag}\n`
            }
          }
        } else {
          isError = true
          out(`status error: ${response.status} ${response.statusText} - ${url}`)
        }
      } catch (err) {
        isError = true
        out(`error: ${err} - ${url}`)
      }
    }
  }
  outMsgWait(thisIsLichess, false)

  let head
  if (isLangEn()) {
    // // allScore += isError ? '\nCannot get some data from Lichess.\nTry again later (Too Many Requests).' : ''
    allScore += isError ? '\nLichess says: "Too many requests from your ip-address."\nTry again later.' : ''
    head = isFirefox ? `Score (X is ${myName} ):` : `Score between players:`
  } else {
    allScore += isError ? '\nLichess сообщает: "Слишком много запросов с вашего ip-адреса."\nПовторите запрос немного позже.' : ''
    head = isFirefox ? `Счет (X это ${myName}):` : `Счет между игроками:`
  }
  myAlert(allScore, head)
}

async function getDataFromChessCom(arPlayerNames) {
  let isProfile = true //get profile
  await getProfileOrStatisticsFromChessCom(arPlayerNames, isProfile)

  isProfile = false //get statistics
  await getProfileOrStatisticsFromChessCom(arPlayerNames, isProfile)
}

//isProfile: true - get Profile, false - get Statistics
async function getProfileOrStatisticsFromChessCom(arPlayerNames, isProfile) {
  let arPlayerNamesBuf = [...arPlayerNames]
  const beginLength = arPlayerNamesBuf.length
  if (beginLength === 0) {
    return
  }

  const modeWord = isProfile ? 'profile' : 'statistics'
  let milliSeconds = 200
  const N = 6
  for (let i = 0; i < N; i++) {
    let arPlayerNamesBufIndex = [...arPlayerNamesBuf]
    arPlayerNamesBufIndex = arPlayerNamesBufIndex.map(item => false)
    if (i > 0) {
      milliSeconds += 100 //increase delay
      out(`step ${i + 1} / ${N}, chess.com ${modeWord}, ${arPlayerNamesBuf.length} el. from ${beginLength}, delay ${milliSeconds}`)
      await new Promise((resolve, reject) => setTimeout(resolve, milliSeconds)) //delay
    }
    let isOKAll = true
    const afterUrl = isProfile ? '' : '/stats'
    const results = await getFetchResultsFromServer(false, arPlayerNamesBuf, afterUrl)
    results.forEach((jsonObj, index) => {
      const playerName = arPlayerNamesBuf[index]
      let isOK = false

      if (isProfile) {
        isOK = fillPlayerHTMLChessCom(jsonObj, playerName, arPlayerNames)
      } else {
        if (jsonObj !== null) {
          const mainIndex = arPlayerNames.indexOf(playerName)
          fillPlayerStatisticsChessCom(jsonObj, mainIndex, playerName)
          isOK = true
        }
      }

      if (isOK) {
        arPlayerNamesBufIndex[index] = true //del element if it's OK
      } else {
        isOKAll = false
        out(`not read ${modeWord}: ${playerName}, chess.com`)
      }
    })
    if (isOKAll) {
      break
    }
    arPlayerNamesBuf = arPlayerNamesBuf.filter((item, index) => !arPlayerNamesBufIndex[index])
  }
}

async function getFetchResultsFromServer(thisIsLichess, arPlayerNames, afterUrl = '') {

  //LICHESS
  //    https://lichess.org/api#section/Introduction/Endpoint
  //    All requests are rate limited using various strategies, to ensure the API remains responsive for everyone.
  //    Only make one request at a time.
  //    If you receive an HTTP response with a 429 status, please wait a full minute before resuming API usage.
  //CHESS.COM
  //    HTTP Responses
  //    200 = "enjoy your JSON"
  //    301 = if the URL you requested is bad, but we know where it should be; your client should remember and correct this to use the new URL in future requests
  //    304 = if your client supports "ETag/If-None-Match" or "Last-Modified/If-Modified-Since" caching headers and the data have not changed since the last request
  //    404 = we try to tell you if the URL is malformed or the data requested is just not available (e.g., a username for a user that does not exist)
  //    410 = we know for certain that no data will ever be available at the URL you requested; your client should not request this URL again
  //    429 = we are refusing to interpret your request due to rate limits; see "Rate Limiting" above

  let jobs = []
  for (let name of arPlayerNames) {
    if (name !== '') {
      const url = thisIsLichess ? urlHttpServiceLichess : urlHttpServiceChessCom
      let job = fetch(`${url}${name}${afterUrl}`, { mode: modeCORS }).then(
        successResponse => {
          if (successResponse.status != 200) { return null }
          else { return successResponse.json() }
        },
        failResponse => { return null }
      )
      jobs.push(job)
    }
  }
  let results = await Promise.all(jobs)
  return results
}

function fillPlayerHTMLChessCom(jsonObj, playerName, arPlayerNames) {
  let isOK = false
  let playerURL = '', onlineSymbol = '', playerTitle = '', playerHTML = '', createdAt = '', lastOnline = '', playerHint = ''
  const beginDate = getBeginOfYesterday()

  //my own description ! ('Creator of ...')
  let v = mapChessComPlayersDescription.get(playerName)
  if (v) {
    playerHint = v + '\n\n'
  }

  playerURL = getJsonValue1(playerName, jsonObj, 'url')

  if (playerURL === '' || playerURL === undefined || playerURL === null) {
    playerHTML = '<em>' + playerName + '</em>' //player not found
  }
  else {
    //title (GM, IM, FM, ...)
    v = getJsonValue1(playerName, jsonObj, 'title')
    playerTitle = (v === undefined) ? '' : v + ' '

    const name = getJsonValue1(playerName, jsonObj, 'name') //'firstName lastName'
    const location = getJsonValue1(playerName, jsonObj, 'location')

    v = getJsonValue1(playerName, jsonObj, 'joined') //registration date
    if (v) { createdAt = (new Date(v * 1000)).getFullYear() }

    v = getJsonValue1(playerName, jsonObj, 'last_online') //date&time of last login (seconds instead of milliseconds !)
    let classLastOnline = 'lastOnline'
    if (v) {
      lastOnline = getDateHHMM(v * 1000)
      if (new Date(v * 1000) < beginDate) {
        classLastOnline = 'lastOnlineBeforeToday'
      }
    }

    playerHint += (name ? name : '')
      + (location ? ', ' + location : '')
    playerHint += META_FIDE
      + (playerTitle ? ', ' + playerTitle : '')
    playerHint += (playerHint && playerHint !== META_FIDE ? '\n' : '')
      + 'reg. ' + createdAt
      + '\nlast online ' + lastOnline
    playerHTML = '<a href="' + playerURL + '" target="_blank" title="' + playerHint + '">'
      + onlineSymbol
      + '<span class="playerTitle">' + playerTitle + ' </span>'
      + '<strong>' + playerName + '</strong></a>'
      + (lastOnline ? '<br><span class="' + classLastOnline + '">' + lastOnline + '</span>' : '')
    isOK = true
  }
  const bullet = '', blitz = '', rapid = '', puzzle = '', rush = ''
  // vm.vueArChessComPlayersBuf.push({ playerHTML, playerName, bullet, blitz, rapid, puzzle, rush })
  arPlayerNames.forEach((item, index) => { //for double names
    if (item === playerName) {
      vm.vueArChessComPlayersBuf[index] = { playerHTML, playerName, bullet, blitz, rapid, puzzle, rush }
    }
  })
  return isOK
}

function fillPlayerStatisticsChessCom(jsonObj, index, playerName) {
  const fideRating = getJsonValue1(playerName, jsonObj, 'fide')
  const fideRatingString = fideRating ? `, FIDE ${fideRating}` : ''

  const playerHTML = vm.vueArChessComPlayersBuf[index].playerHTML.replace(META_FIDE, fideRatingString)

  const bullet = getJsonValue3(playerName, jsonObj, 'chess_bullet', 'last', 'rating')
  const blitz = getJsonValue3(playerName, jsonObj, 'chess_blitz', 'last', 'rating')
  const rapid = getJsonValue3(playerName, jsonObj, 'chess_rapid', 'last', 'rating')
  const puzzle = getJsonValue3(playerName, jsonObj, 'tactics', 'highest', 'rating')
  const rush = getJsonValue3(playerName, jsonObj, 'puzzle_rush', 'best', 'score') //rush (max)
  vm.vueArChessComPlayersBuf[index] = { playerHTML, playerName, bullet, blitz, rapid, puzzle, rush }
}

function getJsonValue1(playerName, jsonObj, field1) {
  let value = ''
  try {
    value = jsonObj[field1]
  }
  catch (err) {
    //   out('Error in getJsonValue1(): playerName=' + playerName + ' ' + field1 + ': ' + err)
  }
  return value
}

function getJsonValue2(playerName, jsonObj, field1, field2) {
  let value = ''
  try {
    value = jsonObj[field1][field2]
  }
  catch (err) {
    //   out('Error in getJsonValue2(): playerName=' + playerName + ' ' + field1 + '.' + field2 + ': ' + err)
  }
  return value
}

function getJsonValue3(playerName, jsonObj, field1, field2, field3) {
  let value = ''
  try {
    value = jsonObj[field1][field2][field3]
  }
  catch (err) {
    //   out('Error in getJsonValue3(): playerName=' + playerName + ' ' + field1 + '.' + field2 + '.' + field3 + ': ' + err)
  }
  return value
}

///////////////////////////////////////////////////////////

function goUserMode() {

  clearMessages()

  setElementNonVisible('main')
  // setElementNonVisible('#buttonUser')
  setElementVisible('.sectionLoginArea')

  let regtypeLocal = localStorage.getItem('regtype')
  regtypeLocal = regtypeLocal ? regtypeLocal : ''
  if (regtype === 'github' || regtype === 'google' || regtype === 'lichess'
    || regtypeLocal === 'github' || regtypeLocal === 'google' || regtypeLocal === 'lichess') {
    document.getElementById('username').value = ''
    document.getElementById('password').value = ''
  } else {
    const v = localStorage.getItem('username')
    document.getElementById('username').value = v ? v : ''
  }

  if (isUserLogged()) {
    document.getElementById('username').setAttribute("disabled", true)
    document.getElementById('password').setAttribute("disabled", true)
    setElementVisible('#buttonPostLogout')
    setElementNonVisible('#buttonPostLogin')
    setElementNonVisible('#buttonPostRegistration')
    // setElementNonVisible('.referToGithub')
    // setElementNonVisible('.referToGoogle')
    setElementNonVisible('.referToLichess')
  } else {
    document.getElementById('username').removeAttribute("disabled")
    document.getElementById('password').removeAttribute("disabled")
    setElementNonVisible('#buttonPostLogout')
    setElementVisible('#buttonPostLogin')
    setElementVisible('#buttonPostRegistration')
    // setElementVisible('.referToGithub')
    // setElementVisible('.referToGoogle')
    setElementVisible('.referToLichess')
  }
}

function goMainModeFromUser() {
  setElementNonVisible('.sectionLoginArea')
  setElementVisible('main')
  // setElementVisible('#buttonUser')
}

function goSetMode() {
  // setElementNonVisible('#buttonUser')
  setElementNonVisible('main')
  setElementVisible('.sectionSettingsArea')
}

function goMainModeFromSettings() {

  //AutoRefreshInterval is correct ?
  let s = getAutoRefreshInterval()
  if (s !== '') {
    let n = parseInt(s, 10)
    if (isNaN(n) || !(Number.isInteger(n) && n >= 0 && n <= 9999)) {
      alert('Interval must be between 0 and 9999 !')
      return
    }
    s = n.toString(10)
  }

  setAutoRefreshInterval(s) //yes, it's correct

  localStorage.setItem('AutoRefreshInterval', s)
  setAutoRefresh()

  setElementNonVisible('.sectionSettingsArea')
  setElementVisible('main')
  // setElementVisible('#buttonUser')
}

function setElementVisible(elem) {
  document.querySelector(elem).style.display = 'block'
}

function setElementNonVisible(elem) {
  document.querySelector(elem).style.display = 'none'
}

//////////////////////////////////////////////////////////

function getDataFromStorage() {
  let v

  //switch to saved lang
  v = localStorage.getItem('Lang')
  curLang = (!v || v === '' || v === langEN) ? langEN : langRU
  document.getElementById('langSelect').value = curLang
  changeLang()

  v = localStorage.getItem('currentGroupName')
  if (!v) {
    v = currentGroupName
  }
  if (v !== '') {
    currentGroupName = v
  }

  v = localStorage.getItem('groupObjs')
  if (v && (v !== '') && (v !== 'undefined')) {
    groupObjs = JSON.parse(v)
    groupNames = getArGroupNames()
    v = localStorage.getItem('LichessOrgPlayerNames')
    setLichessOrgPlayerNames(v)
    v = localStorage.getItem('ChessComPlayerNames')
    setChessComPlayerNames(v)

  } else {

    v = localStorage.getItem('LichessOrgPlayerNames')
    if (!v) {
      v = startGroupObjs[0].lichessPlayerNames
    }
    if (v !== '') {
      setLichessOrgPlayerNames(v)
    }

    v = localStorage.getItem('ChessComPlayerNames')
    if (!v) {
      v = startGroupObjs[0].chessComPlayerNames
    }
    if (v !== '') {
      setChessComPlayerNames(v)
    }
  }

  v = localStorage.getItem('LichessChecked')
  v = v === null ? '1' : v
  setCheckLichess(v === '1' ? true : false)

  v = localStorage.getItem('ChessComChecked')
  v = v === null ? '1' : v
  setCheckChessCom(v === '1' ? true : false)

  v = localStorage.getItem('isFirstChessCom')
  isFirstChessCom = (v === '1' ? true : false)

  v = localStorage.getItem('AutoRefreshInterval')
  setAutoRefreshInterval(v)

  v = localStorage.getItem('DarkThemeChecked')
  setCheckDarkTheme(v === '1' ? true : false)
}

function setDataToStorage() {
  let v, isDiff, vs

  localStorage.setItem('groupObjs', JSON.stringify(groupObjs))
  localStorage.setItem('currentGroupName', currentGroupName)

  v = getLichessOrgPlayerNames()
  vs = localStorage.getItem('LichessOrgPlayerNames')
  vs = (vs === null ? "" : vs)
  isDiff = (v.trim() !== vs.trim())
  localStorage.setItem('LichessOrgPlayerNames', v)

  v = getChessComPlayerNames()
  vs = localStorage.getItem('ChessComPlayerNames')
  vs = (vs === null ? "" : vs)
  isDiff = isDiff || (v.trim() !== vs.trim())
  localStorage.setItem('ChessComPlayerNames', v)

  v = isCheckLichess() ? '1' : '0'
  isDiff = isDiff || (v !== localStorage.getItem('LichessChecked'))
  localStorage.setItem('LichessChecked', v)

  v = isCheckChessCom() ? '1' : '0'
  isDiff = isDiff || (v !== localStorage.getItem('ChessComChecked'))
  localStorage.setItem('ChessComChecked', v)

  v = isCheckDarkTheme() ? '1' : '0'
  isDiff = isDiff || (v !== localStorage.getItem('DarkThemeChecked'))
  localStorage.setItem('DarkThemeChecked', v)

  if (isDiff /*&& isUserLogged()*/) {
    //временно закомментарено, пока недоступна кнопка 'User'
    // useAJAX ? postSettingsAJAX() : postSettings()
  }
}

function setFirstChessComToStorage() {
  isFirstChessCom = !isFirstChessCom
  const v = (isFirstChessCom ? '1' : '')
  localStorage.setItem('isFirstChessCom', v)
  //временно закомментарено, пока недоступна кнопка 'User'
  // useAJAX ? postSettingsAJAX() : postSettings()
}

function clearSettings() {
  let msg
  msg = isLangEn() ? 'All settings will be cleared.\n\nAre you sure ?' :
    'Все настройки будут сброшены.\n\nВы уверены ?'
  if (!confirm(msg)) {
    return
  }

  localStorage.clear()

  setAutoRefreshInterval('')
  setCheckDarkTheme(false)

  //leave first fixed groups (FIDE Top, ...)
  clearGroupSettings()

  if (isFirstChessCom) {
    isFirstChessCom = false
    changeTablesOrder()
  }

  refresh()
  setAutoRefresh()
  setTheme()

  msg = isLangEn() ? 'All settings are cleared.' : 'Все настройки сброшены.'
  alert(msg)

  curLang = langEN
  document.getElementById('langSelect').value = curLang
  changeLang()
}

function restoreStartGroups() {
  let msg

  msg = isLangEn() ? 'All Start-groups will be restored.\n\nAre you sure ?' :
    'Во всех стартовых группах\nбудут восстановлены начальные значения.\n\nВы уверены ?'
  if (!confirm(msg)) {
    return
  }

  initStartGroups()
  fillStartGroups()

  refresh()

  msg = isLangEn() ? 'All Start-groups are restored.' : 'Все стартовые группы восстановлены.'
  alert(msg)
  goMainModeFromSettings()
}

///////////////////////////////////////////////////////////

function setAutoRefresh() {
  clearInterval(intervalID)
  let s = getAutoRefreshInterval()

  if (s !== '') {
    let n = parseInt(s, 10)
    if (n !== 0) {
      let milliSeconds = n * 60 * 1000
      intervalID = setInterval(refresh, milliSeconds)
    }
  } else {
    intervalID = undefined
  }
}

function changeTablesOrder() {
  let t

  inputNode2.parentNode.insertBefore(inputNode2, inputNode1)
  t = inputNode1
  inputNode1 = inputNode2
  inputNode2 = t

  tableNode2.parentNode.insertBefore(tableNode2, tableNode1)
  t = tableNode1
  tableNode1 = tableNode2
  tableNode2 = t
}

///////////////// Getters & Setters //////////////////////////////////////////

function getLichessOrgPlayerNames() {
  // return document.getElementById('elemTextLichessOrgPlayerNames').value.trim()
  return vm.vueLichessOrgPlayerNames.trim()
}

function setLichessOrgPlayerNames(v) {
  // document.getElementById('elemTextLichessOrgPlayerNames').value = v.trim()
  vm.vueLichessOrgPlayerNames = v.trim()
}

function getChessComPlayerNames() {
  // return document.getElementById('elemTextChessComPlayerNames').value.trim()
  return vm.vueChessComPlayerNames.trim()
}

function setChessComPlayerNames(v) {
  // document.getElementById('elemTextChessComPlayerNames').value = v.trim()
  vm.vueChessComPlayerNames = v.trim()
}

function getPlayerNames(thisIsLichess) {
  return thisIsLichess ? getLichessOrgPlayerNames() : getChessComPlayerNames()
}

function getAutoRefreshInterval() {
  // return document.getElementById('elemTextLichessOrgPlayerNames').value.trim()
  return vm.vueAutoRefreshInterval.trim()
}

function setAutoRefreshInterval(v) {
  // document.getElementById('elemTextLichessOrgPlayerNames').value = v.trim()
  vm.vueAutoRefreshInterval = v ? v.trim() : ''
}

function isCheckDarkTheme() {
  //return document.getElementById('elemCheckDarkTheme').checked
  return vm.vueCheckDarkTheme
}

function setCheckDarkTheme(booleanValue) {
  // document.getElementById('elemCheckDarkTheme').checked = booleanValue
  vm.vueCheckDarkTheme = booleanValue
}

function isCheckLichess() {
  // return document.getElementById('elemCheckLichess').checked
  return vm.vueCheckLichess
}

function setCheckLichess(booleanValue) {
  // document.getElementById('elemCheckLichess').checked = booleanValue
  vm.vueCheckLichess = booleanValue
}

function isCheckChessCom() {
  // return document.getElementById('elemCheckChessCom').checked
  return vm.vueCheckChessCom
}

function setCheckChessCom(booleanValue) {
  // document.getElementById('elemCheckChessCom').checked = booleanValue
  vm.vueCheckChessCom = booleanValue
}

function isCheckOfTable(thisIsLichess) {
  return thisIsLichess ? isCheckLichess() : isCheckChessCom()
}

function getDefaultPlayersFromMap(mapPlayers) {
  let s = ''
  for (let key of mapPlayers.keys()) {
    s += ' ' + key
  }
  return s.trim()
}

///////////////////////////////////////////////////////////

function setTheme() {
  const isDarkTheme = isCheckDarkTheme()

  const black = 'black'
  const white = 'white'
  if (isDarkTheme) {
    document.body.style.backgroundColor = black
    document.body.style.color = white
  } else {
    document.body.style.backgroundColor = white
    document.body.style.color = black
  }

  const v = isDarkTheme ? '1' : '0'
  localStorage.setItem('DarkThemeChecked', v)

  // goMainModeFromSettings()
}

function is_mobile_device() {
  const s = 'ipad|iphone|android|pocket|palm|windows ce|windowsce|cellphone|opera mobi|'
    + 'ipod|small|sharp|sonyericsson|symbian|opera mini|nokia|htc_|samsung|motorola|smartphone|'
    + 'blackberry|playstation portable|tablet browser|webOS|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk'
  const devices = new RegExp(s, "i")
  return devices.test(navigator.userAgent) ? true : false
}

function outMsgWait(thisIsLichess, showWait) {
  const defColor = 'white'
  const waitColor = '#ffe4b5' //light-yellow (or as "background-color: moccasin ;")
  const symbolWaitID = thisIsLichess ? '#LichessWait' : '#ChessComWait'

  let buttonRefreshValueDef, buttonRefreshValueWait

  let el, elr
  if (thisIsLichess && isCheckLichess()) {
    // document.querySelector('#elemTextLichessOrgPlayerNames').style.backgroundColor = (showWait ? waitColor : defColor)
    el = document.querySelector('#elemTextLichessOrgPlayerNames')
    elr = document.querySelector('#buttonLichessRefresh')
    buttonRefreshValueDef = "↺ ♞"
    buttonRefreshValueWait = "⌛ ♞"
  }
  if (!thisIsLichess && isCheckChessCom()) {
    // document.querySelector('#elemTextChessComPlayerNames').style.backgroundColor = (showWait ? waitColor : defColor)
    el = document.querySelector('#elemTextChessComPlayerNames')
    elr = document.querySelector('#buttonChessComRefresh')
    buttonRefreshValueDef = "↺ ♟"
    buttonRefreshValueWait = "⌛ ♟"
  }
  if (el) {
    if (showWait) {
      // document.querySelector(symbolWaitID).setAttribute("class", "showBlock")
      el.style.backgroundColor = waitColor
      el.setAttribute("class", "inputText waitAnimation")
      elr.value = buttonRefreshValueWait
    } else {
      el.style.backgroundColor = defColor
      el.setAttribute("class", "inputText waitAnimation2")
      // // el.setAttribute("class", "inputText")
      // document.querySelector(symbolWaitID).setAttribute("class", "hiddenBlock")
      elr.value = buttonRefreshValueDef
    }
    document.querySelector('#msgHintEdit').setAttribute("class", "msgHint msgHintWaitAnimation")
    document.querySelector('#msgHintScore').setAttribute("class", "msgHint msgHintWaitAnimation")
  }
}

// //delete seconds from date: "14.11.2021, 11:25:17" --> "14.11.2021, 11:25"
// function getDateHHMM(milliseconds) {
//   let lastOnline = (new Date(milliseconds)).toLocaleString() //14.11.2021, 11:25:17
//   // lastOnline = lastOnline.replace(',', '') //del comma
//   lastOnline = lastOnline.slice(0, -3) //14.11.2021, 11:25 //del seconds
//   return lastOnline
// }

//getTodayHHMM: delete seconds from date & add 'today': "14.11.2021, 11:25:17" --> "today 11:25"
function getDateHHMM(milliseconds) {

  let d = (new Date())
  const beginOfToday = (new Date(d)).setHours(0, 0, 0, 0) //time 0:00:00,000

  d = d - 1000 * 60 * 60 * 24 //1 day before current
  const beginOfYesterday = (new Date(d)).setHours(0, 0, 0, 0) //time 0:00:00,000

  const dp = (new Date(milliseconds))
  let lastOnline = dp.toLocaleString() //14.11.2021, 11:25:17
  lastOnline = lastOnline.slice(0, -3) //14.11.2021, 11:25 //del seconds
  if (dp >= beginOfToday) {
    lastOnline = (isLangEn() ? 'today' : 'сегодня') + lastOnline.slice(10, 17) //today, 11:25
  } else if (dp >= beginOfYesterday) {
    lastOnline = (isLangEn() ? 'yesterday' : 'вчера') + lastOnline.slice(10, 17) //yesterday, 11:25
  }
  return lastOnline
}

function getBeginOfToday() {
  const d = (new Date())
  return (new Date(d)).setHours(0, 0, 0, 0) //time 0:00:00,000
}

function getBeginOfYesterday() {
  const d = (new Date()) - 1000 * 60 * 60 * 24 //1 day before current
  return (new Date(d)).setHours(0, 0, 0, 0) //time 0:00:00,000
}

function out(msg) {
  const dt = (new Date()).toLocaleString()
  console.log(`${dt} - ${msg}`)

  // if (isMobileDevice) {
  //   alert(msg) //for debug
  // }
}

//on mobile device in native alert() is too large head of msg
function myAlert(msg = '', head = '') {

  //Firefox not support Dialog: 'Dialog.showModal is not a function'
  if (isBrowserFirefox()) {
    const myMsg = (head ? head + '\n\n' : '') + msg
    alert(myMsg)
    return
  }

  const modalDialogHead = document.getElementById('modalDialogHead')
  modalDialogHead.innerHTML = myReplaceAll(head, '\n', '<br>')

  const modalDialogText = document.getElementById('modalDialogText')
  modalDialogText.innerHTML = myReplaceAll(msg, '\n', '<br>')

  modalDialog.showModal()
}

function isBrowserFirefox() {
  const userAgent = navigator.userAgent.toLowerCase()
  return (userAgent.indexOf("firefox") > -1)
}

function myReplaceAll(s, s1, s2) {
  return s.replace(new RegExp(s1, 'g'), s2)
}

//////////////////////// L A N G U A G E ///////////////////////////////////////////////////

function setCurLang() {
  const elem = document.getElementById('langSelect')
  const sel = elem.selectedIndex
  curLang = (sel === -1 || elem.options[sel].text === langEN) ? langEN : langRU
}

function isLangEn() {
  return (curLang === langEN)
}

function isLangRu() {
  return (curLang === langRU)
}

function changeLang() {
  let el, v
  setCurLang()
  localStorage.setItem('Lang', curLang)

  const e = !isLangRu()

  document.querySelector('#projectName').textContent = e ? 'Rating, score: ↺ ♞♟' : 'Рейтинг, счет: ↺ ♞♟'
  document.querySelector('#projectName').title = e ? 'Refresh all tables' : 'Обновить все таблицы'

  //Groups
  document.querySelector('#GroupText').textContent = e ? 'Group: ' : 'Группа: '
  document.querySelector('#buttonGroupAdd').title = e ? 'Add group' : 'Добавить группу'
  document.querySelector('#buttonGroupRestore').title = e ? 'Restore group' : 'Восстановить группу'
  document.querySelector('#buttonGroupDel').title = e ? 'Delete group' : 'Удалить группу'

  //Input text
  document.querySelector('#elemCheckLichess').title =
    e ? 'Make visible or unvisible Lichess table' : 'Сделать видимой или невидимой таблицу Lichess'
  document.querySelector('#buttonLichessRefresh').title = e ? 'Refresh Lichess table' : 'Обновить таблицу Lichess'
  el = document.querySelector('#elemTextLichessOrgPlayerNames')
  el.title = el.placeholder = e ? 'Enter names of players on Lichess, separated by spaces' :
    'Введите имена игроков Lichess, разделенные пробелами'

  document.querySelector('#elemCheckChessCom').title =
    e ? 'Make visible or unvisible Chess.com table' : 'Сделать видимой или невидимой таблицу Chess.com'
  document.querySelector('#buttonChessComRefresh').title = e ? 'Refresh Chess.com table' : 'Обновить таблицу Chess.com'
  el = document.querySelector('#elemTextChessComPlayerNames')
  el.title = el.placeholder = e ? 'Enter names of players on Chess.com, separated by spaces' :
    'Введите имена игроков Chess.com, разделенные пробелами'

  document.querySelector('#msgHintEdit').textContent =
    e ? 'You can edit player lists !' : 'Вы можете редактировать списки игроков !'
  document.querySelector('#msgHintScore').textContent =
    e ? 'Click on the rating to see the score !' : 'Кликните по рейтингу для просмотра счета !'

  //Table
  document.querySelector('.THeadbulletLichess').textContent = e ? 'bullet' : 'пуля'
  document.querySelector('.THeadblitzLichess').textContent = e ? 'blitz' : 'блиц'
  document.querySelector('.THeadrapidLichess').textContent = e ? 'rapid' : 'рапид'
  document.querySelector('.THeadpuzzleLichess').textContent = e ? 'puzzle' : 'задачи'
  document.querySelector('.THeadrushLichess').textContent = e ? 'storm' : 'штурм'

  document.querySelector('.THeadbulletChessCom').textContent = e ? 'bullet' : 'пуля'
  document.querySelector('.THeadblitzChessCom').textContent = e ? 'blitz' : 'блиц'
  document.querySelector('.THeadrapidChessCom').textContent = e ? 'rapid' : 'рапид'
  document.querySelector('.THeadpuzzleChessCom').textContent = e ? 'puzzle' : 'задачи'
  document.querySelector('.THeadrushChessCom').textContent = e ? 'rush' : 'штурм'

  //Settings
  document.querySelector('#buttonSettings').value = e ? 'Settings' : 'Настройки'
  document.querySelector('#buttonSettings').title = e ? 'Settings' : 'Настройки и подсказки'
  document.querySelector('#buttonChangeTables').title = e ? 'Change tables order' : 'Поменять порядок таблиц'

  document.querySelector('#legendSettings').textContent = e ? 'Settings' : 'Настройки'
  document.querySelector('#AutoRefresh').textContent =
    e ? 'AutoRefresh Interval in minutes (0 - no AutoRefresh): ' :
      'Интервал автообновления в минутах (0 - нет автообновления): '
  document.querySelector('#DarkThemeText').textContent = e ? ' Dark theme ' : ' Темная тема'

  el = document.querySelector('#buttonClearSettings')
  el.value = el.title = e ? 'Clear all settings, non-start groups' :
    'Очистить все настройки, не-стартовые группы'

  el = document.querySelector('#buttonRestoreStartGroups')
  el.value = el.title = e ? 'Restore all start-groups' : 'Восстановить все стартовые группы'

  el = document.querySelector('#buttonReturnToMainFromSettings')
  el.value = el.title = e ? 'Return' : 'Возврат'

  //tips
  document.querySelector('#tipsEN').setAttribute("class", e ? 'showBlock' : 'hiddenBlock')
  document.querySelector('#tipsRU').setAttribute("class", e ? 'hiddenBlock' : 'showBlock')

  //e-mail
  document.querySelector('#hrefEMail').textContent = e ? '(e-mail)' : '(эл.почта)'
  document.querySelector('#hrefVideo').textContent = ' ' + (e ? '(Video-Help)' : '(Видео-Демо)')
}

// EN / RU templates for 'Tips'
function vueTemplateTips() {
  return `
    <fieldset id="tipsEN" class="showBlock">
    <legend><em><strong>Tips</strong></em></legend>
    <ul>
      <li><span class="click">Click</span> on the <span class="dotted">button "Player ratings/score"</span>
        to refresh all tables
      </li>
      <li><span class="click">Click</span> on the <span class="dotted">heading "♞ Lichess"</span> to refresh the
        Lichess table and sort by player list</li>
      <li><span class="click">Click</span> on the <span class="dotted">heading "♟ Chess.com"</span> to refresh the
        Chess.com table and sort by player list</li>
      <li><span class="click">Click</span> on <span class="dotted">any other heading</span> to sort by rating
      </li>
      <li><span class="click">Click</span> on the <span class="dotted">"↑↓" button</span> to change the order of
        tables</li>
      <li>For Lichess there are several types of <span class="dotted">player status</span> to the left of his
        name in table:
        <ul>
          <li><span class="statusOnline">&#10004;</span> - online</li>
          <li><span class="statusPlaying">&#9679;</span> - playing</li>
          <li><span class="statusStreaming">&#127908;</span> - streaming</li>
        </ul>
      </li>
      <li>
        If you <span class="click">hover the mouse over </span><span class="dotted">the player in table</span>,
        a pop-up window will appear with an <span class="dotted">information about player</span>
      </li>
      <li>
      <span class="colorGreen">Green</span> and <span class="colorRed">red</span> values in the rating table - are a change in the <span class="dotted">rating of the last
          game day</span> in comparison with the <span class="dotted">rating of the previous game day</span>.
      </li>
    </ul>
    </fieldset>

    <fieldset id="tipsRU" class="hiddenBlock">
    <legend><em><strong>Подсказки</strong></em></legend>
    <ul>
      <li><span class="click">Кликните</span> на <span class="dotted">кнопке "Рейтинги / счет игрока" </span>
        для обновления всех таблиц</li>
      <li><span class="click">Кликните</span> на <span class="dotted">заголовке "♞ Lichess" </span>
        для обновления таблицы Lichess и упорядочивания ее по списку игроков</li>
      <li><span class="click">Кликните</span> на <span class="dotted">заголовке "♟ Chess.com" </span>
        для обновления таблицы Chess.com и упорядочивания ее по списку игроков</li>
      <li><span class="click">Кликните</span> на <span class="dotted">другие заголовки </span>
        для упорядочивания таблицы по соответствующему рейтингу</li>
      <li><span class="click">Кликните</span> на <span class="dotted">кнопке "↑↓"</span>, чтобы поменять порядок таблиц</li>
      <li>Для Lichess отображаются несколько типов <span class="dotted">статусов игрока</span> слева от его имени в таблице:
        <ul>
          <li><span class="statusOnline">&#10004;</span> - онлайн</li>
          <li><span class="statusPlaying">&#9679;</span> - сейчас играет</li>
          <li><span class="statusStreaming">&#127908;</span> - сейчас стримит</li>
        </ul>
      </li>
      <li>
        <span class="click">При наведении</span> курсора мыши над <span class="dotted">именем игрока в таблице</span>,
        появится подсказка с <span class="dotted">информацией об игроке из его профиля</span>
      </li>
      <li>
      <span class="colorGreen">Зеленые</span> и <span class="colorRed">красные</span> значения в таблице рейтингов - это изменение <span class="dotted">
          рейтинга последнего игрового дня</span> в сравнении с <span class="dotted">рейтингом предыдущего игрового дня</span>.
      </li>
    </ul>
    </fieldset>
`
}
