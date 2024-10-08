console.log('CFO ver.0.0.0');
import { Observable } from "./js/Observable.js";
import { updateCSSVariable, getRootProperty } from "./js/cssvar.js";

const languageData = new Observable();
const isUndo = new Observable();
const continueBattle = new Observable();
const userData = new Observable();

const apputils = (function () {
  return {
    def: def
  }
  function def() {
    let isBattle = false;
    // user data
    let btc = 0;
    let eth = 0;
    let language;
    let activeMenu;
    userData.on('change', updateUserData);
    function updateUserData(value) {
      if (value) {
        getUserData();
        userData.off('change', updateUserData);
      }
    }
    function getUserData() {
      btc = userData.data.wallet.btc;
      eth = userData.data.wallet.eth;
      own_equipment = userData.data.ownitems;
      equip_data = userData.data.equipment;
      colnum = userData.data.dragdrop.colrow[0];
      rownum = userData.data.dragdrop.colrow[1];
      dragDrop_arr = userData.data.dragdrop.arr;
      dragDrop_arr_str = userData.data.dragdrop.str;
      dragDrop_pos = userData.data.dragdrop.pos;
      dragDrop_bgc = userData.data.dragdrop.bgc;
      dragDrop_opy = userData.data.dragdrop.opy;
      language = userData.data.language;
      activeMenu = userData.data.menu;

      // is battle ?
      languageData.on('change', (value) => {
        if (continueBattle.data) {
          continueBattleSetup(continueBattle.data);
        }
      });

      // update wallet
      update_btc_UI();
      update_eth_UI();

      // settings language
      fetch('lan/' + language + '.json')
        .then(response => response.json())
        .then(data => {
          languageData.data = data;
          // set the first login num of menu
          showmenu(activeMenu, data);

          document.querySelectorAll('.menu-btn-text')[0].textContent = data.footer.menuBtnText["0"];
          document.querySelectorAll('.menu-btn-text')[1].textContent = data.footer.menuBtnText["1"];
          document.querySelectorAll('.menu-btn-text')[2].textContent = data.footer.menuBtnText["2"];
          document.querySelectorAll('.menu-btn-text')[3].textContent = data.footer.menuBtnText["3"];
          document.querySelectorAll('.menu-btn-text')[4].textContent = data.footer.menuBtnText["4"];

          document.querySelectorAll('.item-options .item-all-btn')[0].textContent = data.item.options["0"];
          document.querySelectorAll('.item-options .item-all-btn')[1].textContent = data.item.options["1"];
          document.querySelectorAll('.item-options .item-all-btn')[2].textContent = data.item.options["2"];
          document.querySelectorAll('.item-options .item-all-btn')[3].textContent = data.item.options["3"];

          document.querySelectorAll('.equip .color-0')[0].textContent = data.item.equip.helmet;
          document.querySelectorAll('.equip .color-0')[1].textContent = data.item.equip.jacket;
          document.querySelectorAll('.equip .color-0')[2].textContent = data.item.equip.leftWeapon;
          document.querySelectorAll('.equip .color-0')[3].textContent = data.item.equip.rightWeapon;
          document.querySelectorAll('.equip .color-0')[4].textContent = data.item.equip.legStrap;
          document.querySelectorAll('.equip .color-0')[5].textContent = data.item.equip.boots;

          document.querySelectorAll('.encyclopedia .item-all-btn')[0].textContent = data.item.encyclopedia.helmet;
          document.querySelectorAll('.encyclopedia .item-all-btn')[1].textContent = data.item.encyclopedia.jacket;
          document.querySelectorAll('.encyclopedia .item-all-btn')[2].textContent = data.item.encyclopedia.weapon;
          document.querySelectorAll('.encyclopedia .item-all-btn')[3].textContent = data.item.encyclopedia.legStrap;
          document.querySelectorAll('.encyclopedia .item-all-btn')[4].textContent = data.item.encyclopedia.boots;

          document.querySelectorAll('.e-helmet .item-all-btn')[0].textContent = data.item.equipment.helmet["0"];
          document.querySelectorAll('.e-helmet .item-all-btn')[1].textContent = data.item.equipment.helmet["1"];

          document.querySelectorAll('.e-jacket .item-all-btn')[0].textContent = data.item.equipment.jacket["0"];

          document.querySelectorAll('.e-weapon .item-all-btn')[0].textContent = data.item.equipment.weapon["0"];
          document.querySelectorAll('.e-weapon .item-all-btn')[1].textContent = data.item.equipment.weapon["1"];
          document.querySelectorAll('.e-weapon .item-all-btn')[2].textContent = data.item.equipment.weapon["2"];
          document.querySelectorAll('.e-weapon .item-all-btn')[3].textContent = data.item.equipment.weapon["3"];
          document.querySelectorAll('.e-weapon .item-all-btn')[4].textContent = data.item.equipment.weapon["4"];

          document.querySelectorAll('.e-legstrap .item-all-btn')[0].textContent = data.item.equipment.legstrap["0"];
          document.querySelectorAll('.e-legstrap .item-all-btn')[1].textContent = data.item.equipment.legstrap["1"];

          document.querySelectorAll('.e-boots .item-all-btn')[0].textContent = data.item.equipment.boots["0"];

          document.getElementById('message').setAttribute('placeholder', data.lobby.enterMessage);
          document.getElementById('submit').textContent = data.lobby.submit;

          document.querySelector('.settings-username .f-10').textContent = data.settings.username;
          document.querySelector('.lan-now').textContent = data.settings.language.now;
          document.querySelector('.lan-zh').textContent = data.settings.language.options.zh;
          document.querySelector('.lan-en').textContent = data.settings.language.options.en;
          document.querySelector('.lan-jp').textContent = data.settings.language.options.jp;
          document.querySelector('.logout').textContent = data.settings.logout;

          document.querySelectorAll('.battle-weapon-name')[0].textContent = data.item.equip.helmet;
          document.querySelectorAll('.battle-weapon-name')[1].textContent = data.item.equip.jacket;
          document.querySelectorAll('.battle-weapon-name')[2].textContent = data.item.equip.leftWeapon;
          document.querySelectorAll('.battle-weapon-name')[3].textContent = data.item.equip.rightWeapon;
          document.querySelectorAll('.battle-weapon-name')[4].textContent = data.item.equip.legStrap;
          document.querySelectorAll('.battle-weapon-name')[5].textContent = data.item.equip.boots;

          document.querySelector('.battle-exit').innerHTML = data.battle.exit + '&#60;';
          document.querySelector('.reroll div').innerHTML = '&#62; ' + data.battle.reroll;
          update_rolltimes_btn();
          document.querySelector('.battle-me-info div').innerHTML = data.battle.loading;

          showEncyclopediaINFO(data);

          equipItemAbility(data);

          updateOwnItemsUI(data);
          update_State_UI();
          updateDragBox();

          document.querySelector('.nav-username .f-10.en-set').textContent = data.nav.username;

          initStoreItem(data);
          menuAction();
          const systemInfo =
            `Platform: ${navigator.platform}
User Agent: ${navigator.userAgent}
Memory: ${navigator.deviceMemory ? navigator.deviceMemory + ' GB' : 'Not available'}
Screen Resolution: ${window.screen.width} x ${window.screen.height}
Online Status: ${navigator.onLine ? 'Online' : 'Offline'}`;
          document.getElementById('system-info').textContent = systemInfo;
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });
    }
    function saveUserData() {
      userData.data = {
        wallet: {
          btc: btc,
          eth: eth
        },
        ownitems: own_equipment,
        equipment: equip_data,
        dragdrop: {
          colrow: [colnum, rownum],
          arr: dragDrop_arr,
          str: dragDrop_arr_str,
          pos: dragDrop_pos,
          bgc: dragDrop_bgc,
          opy: dragDrop_opy
        },
        language: language,
        menu: activeMenu
      }
    }

    document.querySelector('.lan-now').addEventListener('click', (e) => {
      if (document.querySelector('.lan-triangle').textContent !== '▼') {
        document.querySelector('.lan-triangle').textContent = '▼';
        document.querySelector('.lan-options').style.display = 'flex';
      } else {
        document.querySelector('.lan-triangle').textContent = '▲';
        document.querySelector('.lan-options').style.display = '';
      }
    });
    document.querySelector('.lan-zh').addEventListener('click', () => {
      language = 'zh';
      saveUserData();
      document.querySelector('.lan-triangle').textContent = '▲';
      document.querySelector('.lan-options').style.display = '';
      location.reload();
    });
    document.querySelector('.lan-en').addEventListener('click', () => {
      language = 'en';
      saveUserData();
      document.querySelector('.lan-triangle').textContent = '▲';
      document.querySelector('.lan-options').style.display = '';
      location.reload();
    });
    document.querySelector('.lan-jp').addEventListener('click', () => {
      language = 'jp';
      saveUserData();
      document.querySelector('.lan-triangle').textContent = '▲';
      document.querySelector('.lan-options').style.display = '';
      location.reload();
    });
    function update_btc_UI() {
      const btc_data = document.querySelector('.nav-wallet-btc-data');
      btc_data.textContent = btc;
    }
    function update_eth_UI() {
      const eth_data = document.querySelector('.nav-wallet-eth-data');
      eth_data.textContent = eth;
    }

    // events
    function menuAction() {
      evt.click('.menu-btn', 0, () => {
        showmenu(0);
        activeMenu = 0;
        saveUserData();
        centerMapScroll();
        isBattle ? background_setup_loop.start() : background_setup_loop.stop();
      })
      evt.click('.menu-btn', 1, () => {
        activeMenu = 1;
        saveUserData();
        if (document.querySelector('.item').style.display === 'flex') {
          showmenu(1);
          display('.e-helmet', 0, '');
          display('.e-jacket', 0, '');
          display('.e-weapon', 0, '');
          display('.e-legstrap', 0, '');
          display('.e-boots', 0, '');
          display('.e-info', 0, '');
        } else {
          display('.battle', 0, '');
          display('.map', 0, '');
          display('.item', 0, 'flex');
          display('.stat', 0, '');
          display('.lobby', 0, '');
          display('.settings', 0, '');

          document.querySelectorAll('.menu-btn')[0].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[1].querySelector('svg').setAttribute('fill', 'var(--color-high-light)');
          document.querySelectorAll('.menu-btn')[2].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[3].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[4].querySelector('svg').setAttribute('fill', '#9ce0ff70');
          document.querySelectorAll('.menu-btn-text')[0].style.color = '';
          document.querySelectorAll('.menu-btn-text')[1].style.color = 'var(--color-high-light)';
          document.querySelectorAll('.menu-btn-text')[2].style.color = '';
          document.querySelectorAll('.menu-btn-text')[3].style.color = '';
          document.querySelectorAll('.menu-btn-text')[4].style.color = '';

          textShadow('.menu-btn', 0, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 1, '1px 1px 5px #bec4e1, 1px 1px 5px #4ec4e1');
          textShadow('.menu-btn', 2, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 3, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 4, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');

          textContent('.nav-guide', 0, languageData.data.nav.guide.item);
        }
      })
      evt.click('.menu-btn', 2, () => {
        showmenu(2);
        activeMenu = 2;
        saveUserData();
      })
      evt.click('.menu-btn', 3, () => {
        showmenu(3);
        activeMenu = 3;
        saveUserData();
        document.querySelector('.lobby-hint').style.display = '';
      })
      evt.click('.menu-btn', 4, () => {
        showmenu(4);
        activeMenu = 4;
        saveUserData();
      })
    }

    evt.click('.item-options .item-all-btn', 0, (e) => {
      if (!isBattle) {
        display('.item-all-btn', 0, 'none');
        display('.item-all-btn', 1, 'none');
        display('.item-all-btn', 2, 'none');
        display('.item-all-btn', 3, 'none');
        display('.equip', 0, 'flex');
      } else {
        e.target.textContent = languageData.data.item.options.cannotEquip;
        e.target.style.color = '#c24347';
        setTimeout(() => {
          e.target.innerHTML = `${languageData.data.item.options["0"]}`;
          e.target.style.color = '';
        }, 1000);
      }
    })
    evt.click('.item-options .item-all-btn', 1, () => {
      display('.item-all-btn', 0, 'none');
      display('.item-all-btn', 1, 'none');
      display('.item-all-btn', 2, 'none');
      display('.item-all-btn', 3, 'none');
      display('.encyclopedia', 0, 'flex');

      textContent('.nav-guide', 0, languageData.data.nav.guide.itemsEncyclopedia);
    })
    evt.click('.back-btn', 0, () => {
      showmenu(1);
      activeMenu = 1;
      saveUserData();
    })
    evt.click('.item-options .item-all-btn', 2, () => {
      display('.item-all-btn', 0, 'none');
      display('.item-all-btn', 1, 'none');
      display('.item-all-btn', 2, 'none');
      display('.item-all-btn', 3, 'none');
      display('.store', 0, 'flex');

      textContent('.nav-guide', 0, languageData.data.nav.guide.store);
    })
    let equip_nums = document.querySelectorAll('.equip .item-all-btn').length;
    let item_nums = 4 + equip_nums;
    // e-helmet
    evt.click('.item-all-btn', 0 + item_nums, () => {
      display('.encyclopedia', 0, '');
      display('.e-helmet', 0, 'flex');

      textContent('.nav-guide', 0, languageData.data.nav.guide.helmet);
    })
    evt.click('.back-btn', 1, () => {
      display('.e-helmet', 0, '');
      display('.encyclopedia', 0, 'flex');

      textContent('.nav-guide', 0, languageData.data.nav.guide.itemsEncyclopedia);
    })
    // e-jacket
    evt.click('.item-all-btn', 1 + item_nums, () => {
      display('.encyclopedia', 0, '');
      display('.e-jacket', 0, 'flex');

      textContent('.nav-guide', 0, languageData.data.nav.guide.jacket);
    })
    evt.click('.back-btn', 2, () => {
      display('.e-jacket', 0, '');
      display('.encyclopedia', 0, 'flex');

      textContent('.nav-guide', 0, languageData.data.nav.guide.itemsEncyclopedia);
    })
    // e-weapon
    evt.click('.item-all-btn', 2 + item_nums, () => {
      display('.encyclopedia', 0, '');
      display('.e-weapon', 0, 'flex');

      textContent('.nav-guide', 0, languageData.data.nav.guide.weapon);
    })
    evt.click('.back-btn', 3, () => {
      display('.e-weapon', 0, '');
      display('.encyclopedia', 0, 'flex');

      textContent('.nav-guide', 0, languageData.data.nav.guide.itemsEncyclopedia);
    })
    // e-legstrap
    evt.click('.item-all-btn', 3 + item_nums, () => {
      display('.encyclopedia', 0, '');
      display('.e-legstrap', 0, 'flex');

      textContent('.nav-guide', 0, languageData.data.nav.guide.legStrap);
    })
    evt.click('.back-btn', 4, () => {
      display('.e-legstrap', 0, '');
      display('.encyclopedia', 0, 'flex');

      textContent('.nav-guide', 0, languageData.data.nav.guide.itemsEncyclopedia);
    })
    // e-boots
    evt.click('.item-all-btn', 4 + item_nums, () => {
      display('.encyclopedia', 0, '');
      display('.e-boots', 0, 'flex');

      textContent('.nav-guide', 0, languageData.data.nav.guide.boots);
    })
    evt.click('.back-btn', 5, () => {
      display('.e-boots', 0, '');
      display('.encyclopedia', 0, 'flex');

      textContent('.nav-guide', 0, languageData.data.nav.guide.itemsEncyclopedia);
    })
    evt.click('.equip .open', 0, () => {
      if (document.querySelector('.dropbase').style.visibility === '') {
        document.querySelector('.dropbase').style.visibility = 'visible';
        document.querySelector('.dragIn-arr-title').style.visibility = 'visible';
        document.querySelector('.dragIn-arr').style.visibility = 'visible';
        document.querySelector('.dropbase-close').style.visibility = 'visible';
      } else {
        document.querySelector('.dropbase').style.visibility = '';
        document.querySelector('.dragIn-arr-title').style.visibility = '';
        document.querySelector('.dragIn-arr').style.visibility = '';
        document.querySelector('.dropbase-close').style.visibility = '';
      }
    })
    evt.click('.dragIn-arr-close div', 0, () => {
      if (document.querySelector('.dropbase').style.visibility === '') {
        document.querySelector('.dropbase').style.visibility = 'visible';
        document.querySelector('.dragIn-arr-title').style.visibility = 'visible';
        document.querySelector('.dragIn-arr').style.visibility = 'visible';
        document.querySelector('.dropbase-close').style.visibility = 'visible';
      } else {
        document.querySelector('.dropbase').style.visibility = '';
        document.querySelector('.dragIn-arr-title').style.visibility = '';
        document.querySelector('.dragIn-arr').style.visibility = '';
        document.querySelector('.dropbase-close').style.visibility = '';
      }
    })
    evt.click('.dropbase-close', 0, () => {
      document.querySelector('.dropbase').style.visibility = '';
      document.querySelector('.dragIn-arr-title').style.visibility = '';
      document.querySelector('.dragIn-arr').style.visibility = '';
      document.querySelector('.dropbase-close').style.visibility = '';
    });
    evt.click('.legstrap-box-close', 0, () => {
      document.querySelector('.legstrap-container').style.display = '';
    })

    function showEncyclopediaINFO(languageData) {
      let encyclopedia_nums = document.querySelectorAll('.encyclopedia .item-all-btn').length;
      let helmet_nums = document.querySelectorAll('.e-helmet .item-all-btn').length;
      let jacket_nums = document.querySelectorAll('.e-jacket .item-all-btn').length;
      let weapon_nums = document.querySelectorAll('.e-weapon .item-all-btn').length;
      let legstrap_nums = document.querySelectorAll('.e-legstrap .item-all-btn').length;
      let for_helmet_nums = item_nums + encyclopedia_nums;
      let for_jacket_nums = item_nums + encyclopedia_nums + helmet_nums;
      let for_weapon_nums = item_nums + encyclopedia_nums + helmet_nums + jacket_nums;
      let for_legstrap_nums = item_nums + encyclopedia_nums + helmet_nums + jacket_nums + weapon_nums;
      let for_boots_nums = item_nums + encyclopedia_nums + helmet_nums + jacket_nums + weapon_nums + legstrap_nums;

      // helmet info
      e_info_show(0 + for_helmet_nums, 0, '.e-helmet', languageData.item.equipment.helmet["0"], `「${languageData.item.equipment.helmet["0"]}」`);
      e_info_show(1 + for_helmet_nums, 0, '.e-helmet', languageData.item.equipment.helmet["1"], `「${languageData.item.equipment.helmet["1"]}」`);
      // jacket info
      e_info_show(0 + for_jacket_nums, 1, '.e-jacket', languageData.item.equipment.jacket["0"], `「${languageData.item.equipment.jacket["0"]}」`);
      // weapon info
      e_info_show(0 + for_weapon_nums, 2, '.e-weapon', languageData.item.equipment.weapon["0"], `「${languageData.item.equipment.weapon["0"]}」`);
      e_info_show(1 + for_weapon_nums, 2, '.e-weapon', languageData.item.equipment.weapon["1"], `「${languageData.item.equipment.weapon["1"]}」`);
      e_info_show(2 + for_weapon_nums, 2, '.e-weapon', languageData.item.equipment.weapon["2"], `「${languageData.item.equipment.weapon["2"]}」`);
      e_info_show(3 + for_weapon_nums, 2, '.e-weapon', languageData.item.equipment.weapon["3"], `「${languageData.item.equipment.weapon["3"]}」`);
      e_info_show(4 + for_weapon_nums, 2, '.e-weapon', languageData.item.equipment.weapon["4"], `「${languageData.item.equipment.weapon["4"]}」`);
      // legstrap info
      e_info_show(0 + for_legstrap_nums, 3, '.e-legstrap', languageData.item.equipment.legstrap["0"], `「${languageData.item.equipment.legstrap["0"]}」`);
      e_info_show(1 + for_legstrap_nums, 3, '.e-legstrap', languageData.item.equipment.legstrap["1"], `「${languageData.item.equipment.legstrap["1"]}」`);
      // boots info
      e_info_show(0 + for_boots_nums, 4, '.e-boots', languageData.item.equipment.boots["0"], `「${languageData.item.equipment.boots["0"]}」`);

      function e_info_show(n, n2, closegroup, infotype, guide) {
        evt.click('.item-all-btn', n, () => {
          display(closegroup, 0, '');
          display('.e-info', 0, 'flex');

          document.querySelector('.e-info-back').id = n2

          innerHTML('.e-info-type', 0, infotype);

          textContent('.nav-guide', 0, guide);
        })
        evt.click('.e-info-back', 0, () => {
          display('.e-info', 0, '');
          switch (document.querySelector('.e-info-back').id) {
            case '0':
              display('.e-helmet', 0, 'flex');

              textContent('.nav-guide', 0, languageData.data?.nav.guide.helmet);
              break;
            case '1':
              display('.e-jacket', 0, 'flex');

              textContent('.nav-guide', 0, languageData.data?.nav.guide.jacket);
              break;
            case '2':
              display('.e-weapon', 0, 'flex');

              textContent('.nav-guide', 0, languageData.data?.nav.guide.weapon);
              break;
            case '3':
              display('.e-legstrap', 0, 'flex');

              textContent('.nav-guide', 0, languageData.data?.nav.guide.legStrap);
              break;
            case '4':
              display('.e-boots', 0, 'flex');

              textContent('.nav-guide', 0, languageData.data?.nav.guide.boots);
              break;

            default:
            // Tab to edit
          }
        })
      }
    }

    stat_btn('.s-helmet');
    stat_btn('.s-jacket');
    stat_btn('.s-weapon-r');
    stat_btn('.s-weapon-l');
    stat_btn('.s-legstrap');
    stat_btn('.s-boots');

    function stat_btn(element) {
      evt.touchstart(element, 0, () => {
        opacity(element, 0, '0.7');
      })
      evt.touchend(element, 0, () => {
        opacity(element, 0, '');
      })
    }

    let enemies_id = -1;
    let enemies_items = [{
      helmet: ['2%DEF', '1%DEF', '2%DEF', '3%DEF', '1%DEF', '1%DEF'],
      lweapon: ['1%DMG', '2%DMG', '3%DMG', '2%DMG', '2%DMG', '1%DMG']
    }, {
      helmet: ['1%DEF', '2%DEF', '0%DEF', '1%DEF', '2%DEF', '0%DEF'],
      rweapon: ['3%DMG', '5%DMG', '3%DMG', '3%DMG', '3%DMG', '3%DMG']
    }, {
      jacket: ['1%DEF', '1%DEF', '0%DEF', '1%DEF', '0%DEF', '0%DEF']
    }, {
      helmet: ['1%DEF', '0%DEF', '1%DEF', '0%DEF', '1%DEF', '0%DEF'],
      lweapon: ['2%DMG', '1%DMG', '2%DMG', '1%DMG', '2%DMG', '1%DMG'],
      rweapon: ['3%DMG', '1%DMG', '3%DMG', '1%DMG', '3%DMG', '1%DMG']
    }];
    centerMapScroll();
    document.body.addEventListener('click', (e) => {
      if (checkArrsExclude(battle_arr_data, ['N/A', '0%DMG', '0%DEF', '0%RD'], 4)) {
        document.querySelector('.force-start-btn')?.remove();
      }
    });
    evt.click('.map-info', 0, (e) => {
      if (e.target === document.querySelector('.map-info')) {
        display('.map-info', 0, '');
      }
    });
    for (var i = 0; i < document.querySelectorAll('.map-enemies').length; i++) {
      // enemies
      evt.click('.map-enemies', i, (e) => {
        contextmenuutils.init(document.querySelector('.map'), (b, c) => {
          ToMouse(c);
          c.style.zIndex = '2';
        })
        let randomEnemiesNum = Math.floor(getRandomNumber(0, languageData.data.enemies.name.length));
        enemies_id = randomEnemiesNum;
        contextmenuutils.addItem(languageData.data.enemies.name[randomEnemiesNum], (c) => {
          c.style.color = 'var(--color-high-light)';
          c.style.textShadow = '1px 1px 5px #1e588d, 1px 1px 5px #1e588d';
          c.style.background = "var(--color-high-light-darkness)";
        })
        contextmenuutils.addItem(languageData.data.map.enemies.contextmenu["0"], (c) => {
          defaultset(c);
          battleSetup(c);
        })
        contextmenuutils.addItem(languageData.data.map.enemies.contextmenu["1"], (c) => {
          defaultset(c);
          c.addEventListener('click', () => {
            display('.map-info', 0, 'flex');
            document.querySelector('.map-info-title').innerHTML = languageData.data.enemies.name[randomEnemiesNum] + '<br>' + languageData.data.enemies.info[randomEnemiesNum] + '<br><br>' + '\'' + languageData.data.map.enemies.info.chipCode + '：<br>\'' + JSON.stringify(enemies_items[enemies_id], null, 2).toUpperCase().replace(/],/g, '],<br><br>').replace(/:/g, ' >>>').replace('{', '').replace('}', '<br><br>>> ' + languageData.data.map.enemies.info.loading) + '<div class="barcode"></div>';
          })
        })
        function defaultset(c) {
          c.addEventListener("click", () => {
            contextmenuutils.remove();
          });
        }
        function ToMouse(c) {
          c.style.left = (e.pageX) + "px";
          c.style.top = (e.pageY) + "px";
        }
      })
    }

    function battleSetup(c) {
      c.addEventListener('click', () => {
        isBattle = true;
        showmenu(0);
        activeMenu = 0;
        saveUserData();

        set_get_dmg_default();
        enemyRoll();
        ability_ui_update();
        update_ui_e_hp();
        background_setup_loop.start();
        saveContinueBattle();
        update_battleLegstrap();
      })
    }
    const background_setup_loop = loop(() => {
      if (document.querySelector('.battle').style.display === '') {
        background_setup_loop.stop();
      } else {
        document.querySelector('.p5Canvas').classList.add('inout');
        cellSize = Math.floor(Math.random() * 10) + 10;
        wireLength = Math.floor(Math.random() * 15) + 15;
        recreate();
        setTimeout(() => {
          document.querySelector('.p5Canvas').classList.remove('inout');
        }, 3000);
      }
    }, 5000);

    function saveContinueBattle() {
      continueBattle.data = {
        enemyId: enemies_id,
        getDmg: get_dmg,
        getDmgStatus: get_dmg_status,
        getDefStatus: get_def_status,
        getRdStatus: get_rd_status,
        eGetDmg: e_get_dmg,
        eGetDmgStatus: e_get_dmg_status,
        eGetDefStatus: e_get_def_status,
        eGetRdStatus: e_get_rd_status,
        rollTimes: rolltimes,
        battleArrData: battle_arr_data
      }
    }

    function continueBattleSetup(data) {
      enemies_id = data.enemyId;
      isBattle = true;
      showmenu(0);

      set_get_dmg_default();
      enemyRoll();

      get_dmg = data.getDmg;
      get_dmg_status = data.getDmgStatus;
      get_def_status = data.getDefStatus;
      get_rd_status = data.getRdStatus;
      e_get_dmg = data.eGetDmg;
      e_get_dmg_status = data.eGetDmgStatus;
      e_get_def_status = data.eGetDefStatus;
      e_get_rd_status = data.eGetRdStatus;
      rolltimes = data.rollTimes;
      battle_arr_data = data.battleArrData;

      update_rolltimes_btn();
      update_ui_e_box_all();
      dmg_ui_update();
      ability_ui_update();
      update_ui_e_hp();
      background_setup_loop.start();
      update_battleLegstrap();
    }

    function dmg_ui_update() {
      for (var i = 0; i < 6; i++) {
        innerHTML('.player-dmg', i, `<div style="background:#1e588d;">${get_def_status[i].replace('N/A', '').replace('%DEF', ' ⛨')} ${get_rd_status[i].replace('N/A', '').replace('%RD', ' ✙')}</div><div style="color: #c24347; text-shadow: 1px 1px 5px #000, 1px 1px 5px #000; font-size: 15px;background: linear-gradient(to right, #551913, #c24347, #551913);">${get_dmg[i]} <sub>%</sub><sub style="color: #f7d967;font-size: 8px">〚${get_dmg_status[i].replace('N/A', '⛶').replace('%DMG', '🩸')}〛</sub></div>`);
        if (get_dmg[i] === -1) {
          opacity('.battle-me-box', i, '0.3');
        } else {
          opacity('.battle-me-box', i, '');
        }
      }
    }
    function ability_ui_update() {
      ability_set('.battle-helmet', 0);
      ability_set('.battle-jacket', 1);
      ability_set('.battle-weapon-l', 2);
      ability_set('.battle-weapon-r', 3);
      //ability_set('.battle-legstrap', 4);
      textContent('.battle-legstrap', 0, battle_arr_data[4].replace('N/A', `${colnum} ✕ ${rownum}`).replace('0', `${colnum} ✕ ${rownum}`));
      ability_set('.battle-boots', 5);
      function ability_set(t, n) {
        textContent(t, 0, battle_arr_data[n].replace('N/A', '⛶').replace('%DMG', ' 🩸').replace('%DEF', ' ⛨').replace('%RD', ' ✙'));
      }
    }
    function update_ui_e_box_all() {
      switch (enemies_id) {
        case 0:
          update_ui_e_box(0, 0);
          update_ui_e_box(1, 2);
          break;
        case 1:
          update_ui_e_box(0, 0);
          update_ui_e_box(1, 3);
          break;
        case 2:
          update_ui_e_box(0, 1);
          break;
        case 3:
          update_ui_e_box(0, 0);
          update_ui_e_box(1, 2);
          update_ui_e_box(2, 3);
          break;

        default:
        // Tab to edit
      }
    }
    function update_ui_e_box(n, n1) {
      innerHTML('.battle-enemy-box', n, `<div style="font-size: 10px;background: #1e588d;display:flex;justify-content:center;width:100%;">${e_get_def_status[n1].replace('N/A', '').replace('%DEF', ' ⛨')}${e_get_rd_status[n1].replace('N/A', '').replace('%RD', ' ✙')}</div><div style="color: #c24347;text-shadow: 1px 1px 5px #000, 1px 1px 5px #000;background: linear-gradient(to right, #551913, #c24347aa, #551913);"><sup>${n1 === 0 ? languageData.data.item.equip.helmet : n1 === 1 ? languageData.data.item.equip.jacket : n1 === 2 ? languageData.data.item.equip.leftWeapon : n1 === 3 ? languageData.data.item.equip.rightWeapon : n1 === 4 ? languageData.data.item.equip.legStrap : n1 === 5 ? languageData.data.item.equip.boots : ''}</sup> ${e_get_dmg[n1]}<sub>%</sub><sub style="font-size: 10px;color: #f7d967;">〚${e_get_dmg_status[n1] === 'N/A' ? '⛶' : e_get_dmg_status[n1] + ' 🩸'}〛</sub></div>`);
    }
    function update_ui_e_hp() {
      if (e_get_dmg[0] > e_get_dmg[1]) {
        document.querySelector('.enemy-ui-hp-base').style.width = `${(10 - e_get_dmg[0]) * 10 * 0.25}%`;
        setTimeout(() => {
          document.querySelector('.enemy-ui-hp').style.width = `${(10 - e_get_dmg[0]) * 10}%`;
        }, 500);
      } else {
        document.querySelector('.enemy-ui-hp-base').style.width = `${(10 - e_get_dmg[1]) * 10 * 0.25}%`;
        setTimeout(() => {
          document.querySelector('.enemy-ui-hp').style.width = `${(10 - e_get_dmg[1]) * 10}%`;
        }, 500);
      }
    }
    function reset_val_reroll() {
      battle_arr_data = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
      //ability_ui_update();
      get_def_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
      get_rd_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
      e_get_dmg_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
      //dmg_ui_update();
    }
    //StartBattle
    evt.touchstart('.roll', 0, () => {
      document.querySelector('.roll').style.color = '#3db3d0';
    })
    evt.touchend('.roll', 0, () => {
      document.querySelector('.roll').style.color = '';
    })
    let item_data = {
      helmet: ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'],
      jacket: ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'],
      lweapon: ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'],
      rweapon: ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'],
      legstrap: ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'],
      boots: ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'],
    };
    let currentEquipName = {
      helmet: '',
      jacket: '',
      lweapon: '',
      rweapon: '',
      legstrap: '',
      boots: ''
    };
    let equip_data = [0, -1, -1, 1, -1, -1];
    let battle_arr_data = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
    let rolltimes = 2;
    let checkreroll_input = false;
    document.querySelector('.reroll input').addEventListener('input', (e) => {
      reroll_inputevent(e);
      if (e.target.value >= 9) {
        document.querySelector('.reroll').style.color = '#c24347';
      } else {
        document.querySelector('.reroll').style.color = '';
      }
      if (e.target.value > 4 && e.target.value <= 6) {
        checkreroll_input = true;
      }
    });
    function reroll_inputevent(e) {
      document.querySelector('.reroll').style.opacity = e.target.value / 10 + 0.5;
    }
    document.querySelector('.reroll input').addEventListener('change', (e) => {
      const rerollthumbloop = loop(() => {
        if (e.target.value !== 0 && e.target.value < 9) {
          e.target.value -= 0.1;
          reroll_inputevent(e);
          document.querySelector('.reroll').style.color = '';
        }
        if (e.target.value <= 0) {
          rerollthumbloop.stop();
          checkreroll_input = false;
        } else if (e.target.value >= 9 && !checkreroll_input) {
          rerollthumbloop.stop();
          setTimeout(() => {
            e.target.value = 0;
            reroll_inputevent(e);
            document.querySelector('.reroll').style.color = '';
          }, 200);
        } else if (e.target.value >= 9 && checkreroll_input) {
          rerollthumbloop.stop();
          reroll();
          setTimeout(() => {
            e.target.value = 0;
            reroll_inputevent(e);
            document.querySelector('.reroll').style.color = '';
            checkreroll_input = false;
            document.querySelector('.reroll').style.opacity = 1;
            document.querySelector('.reroll div').textContent = '拆除中..';
            document.querySelector('.reroll input').style.display = 'none';
            setTimeout(() => {
              document.querySelector('.reroll div').textContent = '拆除成功';
              ability_ui_update();
              dmg_ui_update();
              update_ui_e_box_all();
              setTimeout(() => {
                document.querySelector('.reroll').style.opacity = '';
                document.querySelector('.reroll div').innerHTML = '&#62; ' + languageData.data.battle.reroll;
                document.querySelector('.reroll input').style.display = '';
              }, 1000)
            }, 1000);
          }, 200);
        }
      }, 1);
      rerollthumbloop.start();
    })
    function update_rolltimes_btn() {
      switch (rolltimes) {
        case 2:
          textContent('.roll', 0, languageData.data.battle.loadChip["0"]);
          break;
        case 1:
          textContent('.roll', 0, languageData.data.battle.loadChip["1"]);
          break;
        case 0:
          textContent('.roll', 0, languageData.data.battle.start);
          break;
        default:
      }
    }
    evt.click('.reroll', 0, () => {
      // reroll();
    });
    function reroll() {
      // if (rolltimes < 2) {
      //   reset_val_reroll();
      //   if (document.querySelector('.force-start-btn')) {
      //     document.querySelector('.force-start-btn').remove();
      //   }
      //   rolltimes = 2;
      // }
      // update_rolltimes_btn();
      isUndo.data = true;
      continueBattle.on('change', update);
      function update(value) {
        setTimeout(() => {
          continueBattleSetup(continueBattle.data);
        }, 1500);
        continueBattle.off('change', update);
      }
    }
    evt.click('.roll', 0, () => {
      if (checkArrsExclude(battle_arr_data, ['N/A', '0%DMG', '0%DEF', '0%RD'], 4)) {
        StartRoll();
      } else {
        document.querySelector('.roll').style.color = '#c24347';
        textContent('.roll', 0, languageData.data.battle.noLoad);
        setTimeout(() => {
          document.querySelector('.roll').style.color = '';
          update_rolltimes_btn();
        }, 1000);
        if (!document.querySelector('.force-start-btn')) {
          createDIV('force-start-btn', languageData.data.battle.skip, document.querySelector('.roll-container'), (b) => {
            document.querySelector('.roll-container').insertBefore(b, document.querySelector('.roll'));
            b.addEventListener('click', () => {
              StartRoll();
              b.remove();
            })
          })
        }
      }
      function StartRoll() {
        if (rolltimes > 0) {
          let random_helmet_ability = get_dmg[0] === -1 ? 'N/A' : item_data.helmet[Math.floor(getRandomNumber(0, 6))];
          let random_jacket_ability = get_dmg[1] === -1 ? 'N/A' : item_data.jacket[Math.floor(getRandomNumber(0, 6))];
          let random_lweapon_ability = get_dmg[2] === -1 ? 'N/A' : item_data.lweapon[Math.floor(getRandomNumber(0, 6))];
          let random_rweapon_ability = get_dmg[3] === -1 ? 'N/A' : item_data.rweapon[Math.floor(getRandomNumber(0, 6))];
          let random_legstrap_ability = get_dmg[4] === -1 ? 'N/A' : item_data.legstrap[Math.floor(getRandomNumber(0, 6))];
          let random_boots_ability = get_dmg[5] === -1 ? 'N/A' : item_data.boots[Math.floor(getRandomNumber(0, 6))];
          battle_arr_data = [random_helmet_ability, random_jacket_ability, random_lweapon_ability, random_rweapon_ability, random_legstrap_ability, random_boots_ability];
          ability_ui_update();
          rolltimes--;
          saveContinueBattle();
        } else {
          rolltimes = 2;
          display('.roll', 0, 'none');
          display('.reroll', 0, 'none');
          display('.battle-exit', 0, 'none');
          battle_arr_data = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
          ability_ui_update();
          if (document.querySelectorAll('.battle-me-box')[hctrl_p_to_e]) {
            document.querySelectorAll('.battle-me-box')[hctrl_p_to_e].style.background = '#fff5';
          }
          hctrl_p_to_e = -1;

          for (var i = 0; i < 6; i++) {
            GetDMG(i);
            e_GetDMG(i);
          }
          function GetDMG(n) {
            let cal_def_dmg = parseIntOrDefault(get_dmg_status[n], 0) - parseIntOrDefault(get_def_status[n], 0);
            if (get_dmg_status[n] !== 'N/A') {
              if (cal_def_dmg > 0) {
                get_dmg[n] += cal_def_dmg;
                dmg_ui_update();
              }
            }
            setTimeout(() => {
              if (get_dmg[n] >= 0) {
                get_dmg[n] = (get_dmg[n] - parseIntOrDefault(get_rd_status[n], 0)) >= 0 ? get_dmg[n] - parseIntOrDefault(get_rd_status[n], 0) : 0;
                get_rd_status[n] = 'N/A';
                dmg_ui_update();
              }
            }, 1000);
          }
          function e_GetDMG(n) {
            let cal_def_dmg = parseIntOrDefault(e_get_dmg_status[n], 0) - parseIntOrDefault(e_get_def_status[n], 0);
            if (e_get_dmg_status[n] !== 'N/A') {
              if (cal_def_dmg > 0) {
                e_get_dmg[n] += cal_def_dmg;
                update_ui_e_box_all();
                if (document.getElementById('asciiArt' + enemies_id)) {
                  document.getElementById('asciiArt' + enemies_id).style.color = 'red';
                  document.getElementById('asciiArt' + enemies_id).style.marginLeft = getRandomNumber(0, 50) + 'px';
                  document.getElementById('asciiArt' + enemies_id).style.marginTop = getRandomNumber(0, 50) + 'px';
                }
                setTimeout(() => {
                  if (document.getElementById('asciiArt' + enemies_id)) {
                    document.getElementById('asciiArt' + enemies_id).style.marginLeft = getRandomNumber(-20, -50) + 'px';
                    document.getElementById('asciiArt' + enemies_id).style.marginTop = getRandomNumber(-20, -50) + 'px';
                  }
                  setTimeout(() => {
                    if (document.getElementById('asciiArt' + enemies_id)) {
                      document.getElementById('asciiArt' + enemies_id).style.marginLeft = getRandomNumber(0, 10) + 'px';
                      document.getElementById('asciiArt' + enemies_id).style.marginTop = getRandomNumber(0, 10) + 'px';
                    }
                  }, 200);
                }, 200);
                setTimeout(() => {
                  if (document.getElementById('asciiArt' + enemies_id)) {
                    document.getElementById('asciiArt' + enemies_id).style.color = '#0000';
                    document.getElementById('asciiArt' + enemies_id).style.marginLeft = '';
                  }
                }, 500);
              }
            }
            setTimeout(() => {
              if (e_get_dmg[n] >= 0) {
                e_get_dmg[n] = (e_get_dmg[n] - parseIntOrDefault(e_get_rd_status[n], 0)) >= 0 ? e_get_dmg[n] - parseIntOrDefault(e_get_rd_status[n], 0) : 0;
                e_get_rd_status[n] = 'N/A';
                update_ui_e_box_all();
              }
            }, 1000);
          }
          for (var i = 2; i < 6; i++) {
            if (get_dmg[i] >= 10) {
              get_dmg[i] = -1;
            }
            if (e_get_dmg[i] >= 10) {
              e_get_dmg[i] = -1;
            }
          }
          get_dmg_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
          get_def_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
          e_get_dmg_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
          e_get_def_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
          dmg_ui_update();
          update_ui_e_box_all();
          setTimeout(() => {
            if (enemies_id !== -1) {
              enemyRoll();
              saveContinueBattle();
              update_ui_e_hp();
              display('.roll', 0, '');
              display('.reroll', 0, '');
              display('.battle-exit', 0, '');
            }
          }, 1500);

          // GAME OVER
          if (get_dmg[0] >= get_bear_dmg
            || get_dmg[1] >= get_bear_dmg
            || get_dmg[0] === -1 && get_dmg[1] === -1 && get_dmg[2] === -1 && get_dmg[3] === -1 && get_dmg[4] === -1 && get_dmg[5] === -1) {
            innerHTML('.gameover-border', 0, '<div style="color: #c24347;">DEFEAT</div>');
            innerHTML('.gameover-info', 0, `<div style="color: #c24347;font-family: SdglitchdemoRegular-YzROj, CyberwarRegular-7BX0E;">REPAIR COSTS: ${get_dmg.reduce((accumulator, currentValue) => accumulator + (currentValue !== -1 ? currentValue : 0), 0) * -3} BTC.</div>`);
            btc -= get_dmg.reduce((accumulator, currentValue) => accumulator + (currentValue !== -1 ? currentValue : 0), 0) * 3;
            update_btc_UI();
            saveUserData();

            gameover();
            display('.gameover', 0, 'flex');
          }
          if (e_get_dmg[0] >= e_get_bear_dmg || e_get_dmg[1] >= e_get_bear_dmg) {
            var reward = Math.floor(getRandomNumber(e_get_dmg.reduce((accumulator, currentValue) => accumulator + (currentValue !== -1 ? currentValue : 0), 0), e_get_dmg.reduce((accumulator, currentValue) => accumulator + (currentValue !== -1 ? currentValue : 0), 0) * 5));
            innerHTML('.gameover-border', 0, '<div style="color: #f7d967;">VICTORY</div>');
            innerHTML('.gameover-info', 0, `<div style="color: #f7d967;">AUTOMATIC REPAIRS FREE OF CHARGE.<br>REWARD: ${reward}</div>`);
            btc += reward;
            update_btc_UI();
            saveUserData();

            gameover();
            display('.gameover', 0, 'flex');
          }
        }
        update_rolltimes_btn();
      }
    });
    function gameover() {
      display('.roll', 0, '');
      display('.reroll', 0, '');
      display('.battle-exit', 0, '');
      isBattle = false;
      showmenu(0);
      activeMenu = 0;
      saveUserData();
      if (document.getElementById(`asciiArt${enemies_id}`)) {
        document.getElementById(`asciiArt${enemies_id}`).remove();
      }
      enemies_id = -1;
      set_get_dmg_default();
      get_dmg_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
      get_def_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
      get_rd_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
      e_get_dmg = [0, 0, 0, 0, 0, 0]
      e_get_dmg_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
      e_get_def_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
      e_get_rd_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
      document.querySelector('.force-start-btn')?.remove();
      continueBattle.data = null;
    }
    evt.click('.battle-exit', 0, () => {
      display('.gameover', 0, 'flex');
      innerHTML('.gameover-border', 0, '<div style="color: #c24347;">ESCAPE</div>');
      innerHTML('.gameover-info', 0, `<div style="color: #c24347;font-family: SdglitchdemoRegular-YzROj, CyberwarRegular-7BX0E;">YOU HAVE FLED THE BATTLEFIELD. <br>PUNISHMENT: ${get_dmg.reduce((accumulator, currentValue) => accumulator + (currentValue !== -1 ? currentValue : 0), 0) * -5} BTC.</div>`);
      btc -= get_dmg.reduce((accumulator, currentValue) => accumulator + (currentValue !== -1 ? currentValue : 0), 0) * 5;
      update_btc_UI();
      gameover();
      rolltimes = 2;
      update_rolltimes_btn();
      battle_arr_data = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
      ability_ui_update();
      continueBattle.data = null;
    });

    function parseIntOrDefault(value, defaultValue) {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    function save_equipdata(n, n1) {
      equip_data[n] = n1;
      equipItemAbility(languageData.data);
      dmg_ui_update();
      saveUserData();
    }
    function setItemData(t, n, n1, n2, n3, n4, n5) {
      t[0] = n;
      t[1] = n1;
      t[2] = n2;
      t[3] = n3;
      t[4] = n4;
      t[5] = n5;
    }
    evt.click('.gameover', 0, (e) => {
      if (e.target === document.querySelector('.gameover')) {
        display('.gameover', 0, '');
      }
    });
    let get_bear_dmg = 10;
    let get_dmg_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
    let get_def_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
    let get_dmg = [0, 0, 0, 0, 0, 0];
    let set_get_dmg_default = () => { get_dmg = [checkArr(item_data.helmet, 'N/A') ? -1 : 0, checkArr(item_data.jacket, 'N/A') ? -1 : 0, checkArr(item_data.lweapon, 'N/A') ? -1 : 0, checkArr(item_data.rweapon, 'N/A') ? -1 : 0, checkArr(item_data.legstrap, 'N/A') ? -1 : 0, checkArr(item_data.boots, 'N/A') ? -1 : 0] };
    let get_rd_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
    let e_get_bear_dmg = 10;
    let e_get_dmg_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
    let e_get_def_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
    let e_get_dmg = [0, 0, 0, 0, 0, 0];
    let e_get_rd_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
    function enemyRoll() {
      switch (enemies_id) {
        case 0:
          document.querySelector('.enemy-ui-hp-base').style.background = '#3db3d0';
          innerHTML('.battle-enemy', 0, `<div class="battle-enemies-name" style="font-size: 16px;color: #3db3d0;">${languageData.data.enemies.name[enemies_id]}</div><div class="battle-enemy-box" style="margin-top: 50px;margin-left: 35px;"></div><pre id="asciiArt${enemies_id}" style="height: 200px;display:flex;justify-content:center;align-items:center;font-family: monospace;white-space: pre;line-height: 1;font-size: 6px;color: #3db3d0;opacity: 0.5;transition: all 500ms ease-in;"></pre><div class="battle-enemy-box" style="margin-top: 20px;margin-left: 70px;"></div>`);
          evt.click('.battle-enemy-box', 0, () => {
            if (hctrl_p_to_e !== -1 && battle_arr_data[hctrl_p_to_e].includes('DMG') && e_get_dmg[0] !== -1) {
              e_get_dmg_status[0] = parseIntOrDefault(battle_arr_data[hctrl_p_to_e], 0) + parseIntOrDefault(e_get_dmg_status[0], 0);
              battle_arr_data[hctrl_p_to_e] = 'N/A';
              ability_ui_update();
              update_ui_e_box(0, 0);
              document.querySelectorAll('.battle-me-box')[hctrl_p_to_e].style.background = '#fff5';
              hctrl_p_to_e = -1;
            }
          });
          evt.click('.battle-enemy-box', 1, () => {
            if (hctrl_p_to_e !== -1 && battle_arr_data[hctrl_p_to_e].includes('DMG') && e_get_dmg[2] !== -1) {
              e_get_dmg_status[2] = parseIntOrDefault(battle_arr_data[hctrl_p_to_e], 0) + parseIntOrDefault(e_get_dmg_status[2], 0);
              battle_arr_data[hctrl_p_to_e] = 'N/A';
              ability_ui_update();
              update_ui_e_box(1, 2);
              document.querySelectorAll('.battle-me-box')[hctrl_p_to_e].style.background = '#fff5';
              hctrl_p_to_e = -1;
            }
          });
          //document.querySelector('.battle-enemy').style.background = 'center / contain no-repeat url(img/monster/blueslime/blue_slime.png)';
          asciiutils.convertToAscii('img/monster/slime/blue_slime.png', 70, 40, enemies_id);
          e_get_dmg = [e_get_dmg[0], -1, e_get_dmg[2], -1, -1, -1];
          let enemy_item_ability = [enemies_items[0].helmet[Math.floor(getRandomNumber(0, 6))], enemies_items[0].lweapon[Math.floor(getRandomNumber(0, 6))]];
          let helmet_chose_enemy = findRandomNonNegativeOneIndex(e_get_dmg);
          let lweapon_chose_player = findRandomNonNegativeOneIndex(get_dmg);
          e_get_def_status[helmet_chose_enemy] = enemy_item_ability[0];
          get_dmg_status[lweapon_chose_player] = e_get_dmg[2] !== -1 ? enemy_item_ability[1] : 'N/A';
          dmg_ui_update();
          textContent('.battle-enemy-box', 0, e_get_def_status[0]);
          textContent('.battle-enemy-box', 1, e_get_def_status[2]);

          if (e_get_dmg[2] === -1) {
            opacity('.battle-enemy-box', 1, '0.3');
          }
          update_ui_e_box(0, 0);
          update_ui_e_box(1, 2);
          break;
        case 1:
          document.querySelector('.enemy-ui-hp-base').style.background = '#f7d967';
          innerHTML('.battle-enemy', 0, `<div class="battle-enemies-name" style="font-size: 16px;color: #f7d967;">${languageData.data.enemies.name[enemies_id]}</div><div class="battle-enemy-box" style="margin-top: 50px;margin-left: 35px;"></div><pre id="asciiArt${enemies_id}" style="height: 200px;display:flex;justify-content:center;align-items:center;font-family: monospace;white-space: pre;line-height: 1;font-size: 5px;color: #f7d967;opacity: 0.5;transition: all 500ms ease-in;"></pre><div class="battle-enemy-box" style="margin-left: 70px;"></div>`);
          evt.click('.battle-enemy-box', 0, () => {
            if (hctrl_p_to_e !== -1 && battle_arr_data[hctrl_p_to_e].includes('DMG') && e_get_dmg[0] !== -1) {
              e_get_dmg_status[0] = parseIntOrDefault(battle_arr_data[hctrl_p_to_e], 0) + parseIntOrDefault(e_get_dmg_status[0], 0);
              battle_arr_data[hctrl_p_to_e] = 'N/A';
              ability_ui_update();
              update_ui_e_box(0, 0);
              document.querySelectorAll('.battle-me-box')[hctrl_p_to_e].style.background = '#fff5';
              hctrl_p_to_e = -1;
            }
          });
          evt.click('.battle-enemy-box', 1, () => {
            if (hctrl_p_to_e !== -1 && battle_arr_data[hctrl_p_to_e].includes('DMG') && e_get_dmg[3] !== -1) {
              e_get_dmg_status[3] = parseIntOrDefault(battle_arr_data[hctrl_p_to_e], 0) + parseIntOrDefault(e_get_dmg_status[3], 0);
              battle_arr_data[hctrl_p_to_e] = 'N/A';
              ability_ui_update();
              update_ui_e_box(1, 3);
              document.querySelectorAll('.battle-me-box')[hctrl_p_to_e].style.background = '#fff5';
              hctrl_p_to_e = -1;
            }
          });
          asciiutils.convertToAscii('img/monster/iguana/desert_iguana.png', 120, 60, enemies_id);
          e_get_dmg = [e_get_dmg[0], -1, -1, e_get_dmg[3], -1, -1];
          e_get_def_status[findRandomNonNegativeOneIndex(e_get_dmg)] = enemies_items[1].helmet[Math.floor(getRandomNumber(0, 6))];
          get_dmg_status[findRandomNonNegativeOneIndex(get_dmg)] = e_get_dmg[3] !== -1 ? enemies_items[1].rweapon[Math.floor(getRandomNumber(0, 6))] : 'N/A';
          dmg_ui_update();
          textContent('.battle-enemy-box', 0, e_get_def_status[0]);
          textContent('.battle-enemy-box', 1, e_get_def_status[3]);

          if (e_get_dmg[3] === -1) {
            opacity('.battle-enemy-box', 1, '0.3')
          }
          update_ui_e_box(0, 0);
          update_ui_e_box(1, 3);
          break;
        case 2:
          document.querySelector('.enemy-ui-hp-base').style.background = '#4b7e3f';
          innerHTML('.battle-enemy', 0, `<div class="battle-enemies-name" style="font-size: 16px;color: #4b7e3f;">${languageData.data.enemies.name[enemies_id]}</div><div class="battle-enemy-box" style="margin-top: 50px;margin-left: 35px;"></div><pre id="asciiArt${enemies_id}" style="height: 200px;display:flex;justify-content:center;align-items:center;font-family: monospace;white-space: pre;line-height: 1;font-size: 4px;color: #f7d967;opacity: 0.5;transition: all 500ms ease-in;"></pre>`);
          evt.click('.battle-enemy-box', 0, () => {
            if (hctrl_p_to_e !== -1 && battle_arr_data[hctrl_p_to_e].includes('DMG') && e_get_dmg[1] !== -1) {
              e_get_dmg_status[1] = parseIntOrDefault(battle_arr_data[hctrl_p_to_e], 0) + parseIntOrDefault(e_get_dmg_status[1], 0);
              battle_arr_data[hctrl_p_to_e] = 'N/A';
              ability_ui_update();
              update_ui_e_box(0, 1);
              document.querySelectorAll('.battle-me-box')[hctrl_p_to_e].style.background = '#fff5';
              hctrl_p_to_e = -1;
            }
          });
          asciiutils.convertToAscii('img/monster/iguana/normal_iguana.png', 120, 50, enemies_id);
          e_get_dmg = [-1, e_get_dmg[1], -1, -1, -1, -1];
          e_get_def_status[findRandomNonNegativeOneIndex(e_get_dmg)] = enemies_items[2].jacket[Math.floor(getRandomNumber(0, 6))];
          dmg_ui_update();
          textContent('.battle-enemy-box', 0, e_get_def_status[1]);

          if (e_get_dmg[1] === -1) {
            opacity('.battle-enemy-box', 0, '0.3')
          }
          update_ui_e_box(0, 1);
          break;
        case 3:
          document.querySelector('.enemy-ui-hp-base').style.background = '#b74e6a';
          innerHTML('.battle-enemy', 0, `<div class="battle-enemies-name" style="font-size: 16px;color: #b74e6a;">${languageData.data.enemies.name[enemies_id]}</div><div class="battle-enemy-box" style="margin-top: 50px;margin-left: 35px;"></div><pre id="asciiArt${enemies_id}" style="height: 200px;display:flex;justify-content:center;align-items:center;font-family: monospace;white-space: pre;line-height: 1;font-size: 12px;color: #b74e6a;opacity: 0.5;transition: all 500ms ease-in;"></pre><div class="battle-enemy-box" style="margin-bottom: 70px;margin-left: 70px;"></div><div class="battle-enemy-box" style="margin-top: -120px;margin-right: 250px;"></div>`);
          evt.click('.battle-enemy-box', 0, () => {
            if (hctrl_p_to_e !== -1 && battle_arr_data[hctrl_p_to_e].includes('DMG') && e_get_dmg[0] !== -1) {
              e_get_dmg_status[0] = parseIntOrDefault(battle_arr_data[hctrl_p_to_e], 0) + parseIntOrDefault(e_get_dmg_status[0], 0);
              battle_arr_data[hctrl_p_to_e] = 'N/A';
              ability_ui_update();
              update_ui_e_box(0, 0);
              document.querySelectorAll('.battle-me-box')[hctrl_p_to_e].style.background = '#fff5';
              hctrl_p_to_e = -1;
            }
          });
          evt.click('.battle-enemy-box', 1, () => {
            if (hctrl_p_to_e !== -1 && battle_arr_data[hctrl_p_to_e].includes('DMG') && e_get_dmg[2] !== -1) {
              e_get_dmg_status[2] = parseIntOrDefault(battle_arr_data[hctrl_p_to_e], 0) + parseIntOrDefault(e_get_dmg_status[2], 0);
              battle_arr_data[hctrl_p_to_e] = 'N/A';
              ability_ui_update();
              update_ui_e_box(1, 2);
              document.querySelectorAll('.battle-me-box')[hctrl_p_to_e].style.background = '#fff5';
              hctrl_p_to_e = -1;
            }
          });
          evt.click('.battle-enemy-box', 2, () => {
            if (hctrl_p_to_e !== -1 && battle_arr_data[hctrl_p_to_e].includes('DMG') && e_get_dmg[3] !== -1) {
              e_get_dmg_status[3] = parseIntOrDefault(battle_arr_data[hctrl_p_to_e], 0) + parseIntOrDefault(e_get_dmg_status[3], 0);
              battle_arr_data[hctrl_p_to_e] = 'N/A';
              ability_ui_update();
              update_ui_e_box(2, 3);
              document.querySelectorAll('.battle-me-box')[hctrl_p_to_e].style.background = '#fff5';
              hctrl_p_to_e = -1;
            }
          });
          asciiutils.convertToAscii('img/monster/slime/red_slime.png', 35, 25, enemies_id);
          e_get_dmg = [e_get_dmg[0], -1, e_get_dmg[2], e_get_dmg[3], -1, -1];
          e_get_def_status[findRandomNonNegativeOneIndex(e_get_dmg)] = enemies_items[3].helmet[Math.floor(getRandomNumber(0, 6))];
          get_dmg_status[findRandomNonNegativeOneIndex(get_dmg)] = e_get_dmg[2] !== -1 ? enemies_items[3].lweapon[Math.floor(getRandomNumber(0, 6))] : 'N/A';
          let keep_findRandomNonNegativeOneIndex_index = findRandomNonNegativeOneIndex(get_dmg);
          if (get_dmg_status[keep_findRandomNonNegativeOneIndex_index] === 'N/A') {
            get_dmg_status[keep_findRandomNonNegativeOneIndex_index] = e_get_dmg[3] !== -1 ? enemies_items[3].rweapon[Math.floor(getRandomNumber(0, 6))] : 'N/A';
          } else {
            get_dmg_status[keep_findRandomNonNegativeOneIndex_index] = e_get_dmg[3] !== -1 ? parseInt(get_dmg_status[keep_findRandomNonNegativeOneIndex_index]) + parseInt(enemies_items[3].rweapon[Math.floor(getRandomNumber(0, 6))]) + '%DMG' : get_dmg_status[keep_findRandomNonNegativeOneIndex_index];
          }

          dmg_ui_update();
          textContent('.battle-enemy-box', 0, e_get_def_status[0]);
          textContent('.battle-enemy-box', 1, e_get_def_status[2]);
          textContent('.battle-enemy-box', 2, e_get_def_status[3]);

          if (e_get_dmg[2] === -1) {
            opacity('.battle-enemy-box', 1, '0.3')
          }
          if (e_get_dmg[3] === -1) {
            opacity('.battle-enemy-box', 2, '0.3')
          }
          update_ui_e_box(0, 0);
          update_ui_e_box(1, 2);
          update_ui_e_box(2, 3);
          break;
        default:
      }
    }
    let hctrl_p_to_e = -1;
    let get_hctrl = -1;
    evt.click('.battle-me-box', 0, () => {
      setHCtrlPTE(0);
    })
    evt.click('.battle-me-box', 1, () => {
      setHCtrlPTE(1);
    })
    evt.click('.battle-me-box', 2, () => {
      setHCtrlPTE(2);
    })
    evt.click('.battle-me-box', 3, () => {
      setHCtrlPTE(3);
    })
    evt.click('.battle-me-box', 4, () => {
      setHCtrlPTE(4);
      if (document.querySelector('.legstrap-container').style.display === '' && get_hctrl === -1) {
        document.querySelector('.legstrap-container').style.display = 'flex';
      } else {
        document.querySelector('.legstrap-container').style.display = '';
      }
    })
    evt.click('.battle-me-box', 5, () => {
      setHCtrlPTE(5);
    })
    function setHCtrlPTE(c) {
      if (battle_arr_data[c] !== 'N/A' || get_dmg[c] !== -1) {
        if (hctrl_p_to_e === -1) {
          hctrl_p_to_e = c;
          setcolor(c);
          document.querySelector('.battle-me-info div').innerHTML =
            c === 0 ? currentEquipName.helmet : c === 1 ? currentEquipName.jacket : c === 2 ? currentEquipName.lweapon : c === 3 ? currentEquipName.rweapon : c === 4 ? currentEquipName.legstrap : c === 5 ? currentEquipName.boots : null;
          document.querySelector('.battle-me-info div').innerHTML += '<br><br>';
          document.querySelector('.battle-me-info div').innerHTML += languageData.data.map.enemies.info.chipCode;
          document.querySelector('.battle-me-info div').innerHTML +=
            '<div style="font-size: 12px;width:100%;height: fit-content;">' + (c === 0 ? item_data.helmet : c === 1 ? item_data.jacket : c === 2 ? item_data.lweapon : c === 3 ? item_data.rweapon : c === 4 ? item_data.legstrap : c === 5 ? item_data.boots : null) + '</div>';
          get_hctrl = -1;
        } else {
          setTimeout(() => {
            hctrl_p_to_e = -1;
          }, 200);
          document.querySelector('.battle-me-info div').innerHTML = languageData.data.battle.loading;
          setcolor(c, '#fff5');
          get_hctrl = c;
        }
        for (var i = 0; i < 6; i++) {
          if (c !== i) {
            setcolor(i, '#fff5');
          }
        }
      }

      function setcolor(n, c = '#fffc') {
        document.querySelectorAll('.battle-me-box')[n].style.background = c;
      }

      if (get_hctrl !== -1 && hctrl_p_to_e !== -1 && battle_arr_data[hctrl_p_to_e].includes('DEF') && get_dmg[get_hctrl] !== -1) {
        get_def_status[get_hctrl] = `${parseIntOrDefault(battle_arr_data[hctrl_p_to_e], 0) + parseIntOrDefault(get_def_status[get_hctrl], 0)}%DEF`;
        battle_arr_data[hctrl_p_to_e] = 'N/A';
        ability_ui_update();
        dmg_ui_update();
      }
      if (get_hctrl !== -1 && hctrl_p_to_e !== -1 && battle_arr_data[hctrl_p_to_e].includes('RD') && get_dmg[get_hctrl] !== -1) {
        get_rd_status[get_hctrl] = parseIntOrDefault(get_rd_status[get_hctrl], 0) + parseIntOrDefault(battle_arr_data[hctrl_p_to_e], 0) + '%RD';
        battle_arr_data[hctrl_p_to_e] = 'N/A';
        ability_ui_update();
        dmg_ui_update();
      }
    }
    evt.click('.battle', 0, (e) => {
      if (e.target.parentElement && e.target.parentElement.className !== 'battle-me-box') {
        hctrl_p_to_e = -1;
        document.querySelector('.battle-me-info div').innerHTML = languageData.data.battle.loading;
        document.querySelectorAll('.battle-me-box').forEach(element => {
          element.style.background = '#fff5';
        });
      }
    });
    let itemStruct = {
      ability: {
        helmet: [
          ['0%DEF', '1%DEF', '1%DEF', '1%DEF', '1%DEF', '1%DEF'], // 初級普通頭盔
          ['2%DEF', '1%DEF', '1%DEF', '1%DEF', '2%DEF', '2%DEF'], // 克羅爾ㄧ型鋼盔
        ],
        jacket: [
          ['1%DEF', '2%DEF', '1%DEF', '1%DEF', '0%DEF', '0%DEF'], // 初級普通戰甲
        ],
        weapon: [
          ['1%DEF', '2%DEF', '1%DEF', '1%DEF', '1%RD', '1%DEF'], // 方圓十字盾
          ['1%DMG', '1%DMG', '1%DMG', '1%DMG', '0%DMG', '1%DMG'], // 輕便水果刀
          ['3%DMG', '2%DMG', '1%DMG', '1%DMG', '2%DMG', '3%DMG'], // 中式文武菜刀
          ['1%DMG', '0%DMG', '1%DMG', '5%DMG', '0%DMG', '1%DMG'], // 低伏電擊棒
          ['2%DMG', '2%DMG', '2%DMG', '2%DMG', '2%DMG', '2%DMG'], // 輕便手榴彈
        ],
        boots: [
          ['0%DEF', '1%DEF', '0%DEF', '1%DEF', '2%DEF', '1%DEF'], // 初級普通戰靴
        ],
        default: ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A']
      },
      cost: {
        helmet: [500, 2100],
        jacket: [500],
        weapon: [1700, 500, 3280, 2550, 700],
        legstrap: [75, 200],
        boots: [500],
        thigh_bag_space: 20000
      }
    }
    function equipItemAbility(languageData) {
      // helmet
      switch (equip_data[0]) {
        case 0:
          setItemData(item_data.helmet, ...itemStruct.ability.helmet[0]);
          currentEquipName.helmet = languageData.item.equipment.helmet["0"];
          break;
        case 1:
          setItemData(item_data.helmet, ...itemStruct.ability.helmet[1]);
          currentEquipName.helmet = languageData.item.equipment.helmet["1"];
          break;

        default:
          setItemData(item_data.helmet, ...itemStruct.ability.default);
          currentEquipName.helmet = '';
      }
      // jacket
      switch (equip_data[1]) {
        case 0:
          setItemData(item_data.jacket, ...itemStruct.ability.jacket[0]);
          currentEquipName.jacket = languageData.item.equipment.jacket["0"];
          break;

        default:
          setItemData(item_data.jacket, ...itemStruct.ability.default);
          currentEquipName.jacket = '';
      }
      // lweapon
      switch (equip_data[2]) {
        case 0:
          setItemData(item_data.lweapon, ...itemStruct.ability.weapon[0]);
          currentEquipName.lweapon = languageData.item.equipment.weapon["0"];
          break;
        case 1:
          setItemData(item_data.lweapon, ...itemStruct.ability.weapon[1]);
          currentEquipName.lweapon = languageData.item.equipment.weapon["1"];
          break;
        case 2:
          setItemData(item_data.lweapon, ...itemStruct.ability.weapon[2]);
          currentEquipName.lweapon = languageData.item.equipment.weapon["2"];
          break;
        case 3:
          setItemData(item_data.lweapon, ...itemStruct.ability.weapon[3]);
          currentEquipName.lweapon = languageData.item.equipment.weapon["3"];
          break;
        case 4:
          setItemData(item_data.lweapon, ...itemStruct.ability.weapon[4]);
          currentEquipName.lweapon = languageData.item.equipment.weapon["4"];
          break;

        default:
          setItemData(item_data.lweapon, ...itemStruct.ability.default);
          currentEquipName.lweapon = '';
      }
      // rweapon
      switch (equip_data[3]) {
        case 0:
          setItemData(item_data.rweapon, ...itemStruct.ability.weapon[0])
          currentEquipName.rweapon = languageData.item.equipment.weapon["0"];
          break;
        case 1:
          setItemData(item_data.rweapon, ...itemStruct.ability.weapon[1])
          currentEquipName.rweapon = languageData.item.equipment.weapon["1"];
          break;
        case 2:
          setItemData(item_data.rweapon, ...itemStruct.ability.weapon[2]);
          currentEquipName.rweapon = languageData.item.equipment.weapon["2"];
          break;
        case 3:
          setItemData(item_data.rweapon, ...itemStruct.ability.weapon[3]);
          currentEquipName.rweapon = languageData.item.equipment.weapon["3"];
          break;
        case 4:
          setItemData(item_data.rweapon, ...itemStruct.ability.weapon[4]);
          currentEquipName.rweapon = languageData.item.equipment.weapon["4"];
          break;

        default:
          // Tab to edit
          setItemData(item_data.rweapon, ...itemStruct.ability.default);
          currentEquipName.rweapon = '';
      }
      // legstrap
      switch (equip_data[4]) {
        case 0:
          setItemData(item_data.legstrap, '0', '0', '0', '0', '0', '0');
          //currentEquipName.legstrap = languageData.item.equipment.legstrap["0"];
          currentEquipName.legstrap = `${colnum} ✕ ${rownum}`;
          break;

        default:
          setItemData(item_data.legstrap, ...itemStruct.ability.default);
          currentEquipName.legstrap = '';
      }
      // boots
      switch (equip_data[5]) {
        case 0:
          setItemData(item_data.boots, ...itemStruct.ability.boots[0]);
          currentEquipName.boots = languageData.item.equipment.boots["0"];
          break;

        default:
          setItemData(item_data.boots, ...itemStruct.ability.default);
          currentEquipName.boots = '';
      }
    }

    let own_equipment = {
      helmet: [],
      jacket: [],
      lweapon: [],
      rweapon: [],
      legstrap: [],
      boots: [],
    };

    // get new items use this
    function saveOwnEquipment(t, item_id) {
      t.push(item_id);
      updateOwnItemsUI(languageData.data);
    }

    function updateOwnItemsUI(languageData) {
      document.querySelectorAll('.equip .color-0').forEach(element => {
        element.querySelectorAll('.item-all-btn').forEach(element => {
          element.remove();
        });
      });
      if (document.getElementById('draggable-0')) {
        document.getElementById('draggable-0').remove();
      }
      if (document.getElementById('draggable-1')) {
        document.getElementById('draggable-1').remove();
      }
      for (var i = 0; i < uniq(own_equipment.helmet).length; i++) {
        switch (uniq(own_equipment.helmet)[i]) {
          case 0:
            createDIV('item-all-btn', languageData.item.equipment.helmet["0"] + ' 𐄂 ' + countOccurrences(own_equipment.helmet, 0), document.querySelectorAll('.equip .color-0')[0], (b) => {
              itemOption(b, 0, own_equipment.helmet[i]);
            });
            break;
          case 1:
            createDIV('item-all-btn', languageData.item.equipment.helmet["1"] + ' 𐄂 ' + countOccurrences(own_equipment.helmet, 1), document.querySelectorAll('.equip .color-0')[0], (b) => {
              itemOption(b, 0, own_equipment.helmet[i]);
            });
            break;

          default:
          // Tab to edit
        }
      }
      for (var i = 0; i < uniq(own_equipment.jacket).length; i++) {
        switch (uniq(own_equipment.jacket)[i]) {
          case 0:
            createDIV('item-all-btn', languageData.item.equipment.jacket["0"] + ' 𐄂 ' + countOccurrences(own_equipment.jacket, 0), document.querySelectorAll('.equip .color-0')[1], (b) => {
              itemOption(b, 1, own_equipment.jacket[i]);
            });
            break;

          default:
          // Tab to edit
        }
      }
      for (var i = 0; i < uniq(own_equipment.lweapon).length; i++) {
        switch (uniq(own_equipment.lweapon)[i]) {
          case 0:
            createDIV('item-all-btn', languageData.item.equipment.weapon["0"] + ' 𐄂 ' + countOccurrences(own_equipment.lweapon, 0), document.querySelectorAll('.equip .color-0')[2], (b) => {
              itemOption(b, 2, own_equipment.lweapon[i]);
            });
            break;
          case 1:
            createDIV('item-all-btn', languageData.item.equipment.weapon["1"] + ' 𐄂 ' + countOccurrences(own_equipment.lweapon, 1), document.querySelectorAll('.equip .color-0')[2], (b) => {
              itemOption(b, 2, own_equipment.lweapon[i]);
            });
            break;
          case 2:
            createDIV('item-all-btn', languageData.item.equipment.weapon["2"] + ' 𐄂 ' + countOccurrences(own_equipment.lweapon, 2), document.querySelectorAll('.equip .color-0')[2], (b) => {
              itemOption(b, 2, own_equipment.lweapon[i]);
            });
            break;
          case 3:
            createDIV('item-all-btn', languageData.item.equipment.weapon["3"] + ' 𐄂 ' + countOccurrences(own_equipment.lweapon, 3), document.querySelectorAll('.equip .color-0')[2], (b) => {
              itemOption(b, 2, own_equipment.lweapon[i]);
            });
            break;
          case 4:
            createDIV('item-all-btn', languageData.item.equipment.weapon["4"] + ' 𐄂 ' + countOccurrences(own_equipment.lweapon, 4), document.querySelectorAll('.equip .color-0')[2], (b) => {
              itemOption(b, 2, own_equipment.lweapon[i]);
            });
            break;

          default:
          // Tab to edit
        }
      }
      for (var i = 0; i < uniq(own_equipment.rweapon).length; i++) {
        switch (uniq(own_equipment.rweapon)[i]) {
          case 0:
            createDIV('item-all-btn', languageData.item.equipment.weapon["0"] + ' 𐄂 ' + countOccurrences(own_equipment.rweapon, 0), document.querySelectorAll('.equip .color-0')[3], (b) => {
              itemOption(b, 3, own_equipment.rweapon[i]);
            });
            break;
          case 1:
            createDIV('item-all-btn', languageData.item.equipment.weapon["1"] + ' 𐄂 ' + countOccurrences(own_equipment.rweapon, 1), document.querySelectorAll('.equip .color-0')[3], (b) => {
              itemOption(b, 3, own_equipment.rweapon[i]);
            });
            break;
          case 2:
            createDIV('item-all-btn', languageData.item.equipment.weapon["2"] + ' 𐄂 ' + countOccurrences(own_equipment.rweapon, 2), document.querySelectorAll('.equip .color-0')[3], (b) => {
              itemOption(b, 3, own_equipment.rweapon[i]);
            });
            break;
          case 3:
            createDIV('item-all-btn', languageData.item.equipment.weapon["3"] + ' 𐄂 ' + countOccurrences(own_equipment.rweapon, 3), document.querySelectorAll('.equip .color-0')[3], (b) => {
              itemOption(b, 3, own_equipment.rweapon[i]);
            });
            break;
          case 4:
            createDIV('item-all-btn', languageData.item.equipment.weapon["4"] + ' 𐄂 ' + countOccurrences(own_equipment.rweapon, 4), document.querySelectorAll('.equip .color-0')[3], (b) => {
              itemOption(b, 3, own_equipment.rweapon[i]);
            });
            break;

          default:
          // Tab to edit
        }
      }
      for (var i = 0; i < uniq(own_equipment.legstrap).length; i++) {
        switch (uniq(own_equipment.legstrap)[i]) {
          case 0:
            // createDIV('item-all-btn', languageData.item.equipment.legstrap["0"], document.querySelectorAll('.equip .color-0')[4], (b) => {
            //   itemOption(b, 4, own_equipment.legstrap[i]);
            // });
            createDraggable('draggable-0', 1, 2, languageData.item.equipment.legstrap["0"]);
            break;
          case 1:
            // createDIV('item-all-btn', languageData.item.equipment.legstrap["1"], document.querySelectorAll('.equip .color-0')[4], (b) => {
            //   itemOption(b, 4, own_equipment.legstrap[i]);
            // });
            createDraggable('draggable-1', 1, 1, languageData.item.equipment.legstrap["1"]);
            break;

          default:
          // Tab to edit
        }
      }
      for (var i = 0; i < uniq(own_equipment.boots).length; i++) {
        switch (uniq(own_equipment.boots)[i]) {
          case 0:
            createDIV('item-all-btn', languageData.item.equipment.boots["0"] + ' 𐄂 ' + countOccurrences(own_equipment.boots, 0), document.querySelectorAll('.equip .color-0')[5], (b) => {
              itemOption(b, 5, own_equipment.boots[i]);
            });
            break;

          default:
          // Tab to edit
        }
      }
      setTimeout(() => {
        document.querySelectorAll('.draggable1-1').forEach(element => {
          draggableObj(element, 1, 1);
        });
        document.querySelectorAll('.draggable1-2').forEach(element => {
          draggableObj(element, 1, 2);
        });
      }, 500);
    }
    function itemOption(b, n, item_id) {
      update_equip_color(b, n, item_id);
      b.addEventListener('click', (e) => {
        if (isBattle)
          return;
        contextmenuutils.init(document.body, (b2, c) => {
          ToMouse(c);
        })
        if (equip_data[n] === item_id) {
          contextmenuutils.addItem(languageData.data.item.equip.contextmenu["0"], (c) => {
            defaultset(c);
            c.addEventListener("click", () => {
              save_equipdata(n, -1);
              set_get_dmg_default();
              update_equip_color(b, n, item_id);
              update_State_UI();
            })
          })
        } else {
          contextmenuutils.addItem(languageData.data.item.equip.contextmenu["1"], (c) => {
            defaultset(c);
            c.addEventListener("click", () => {
              save_equipdata(n, item_id);
              set_get_dmg_default();
              update_equip_color(b, n, item_id);
              update_State_UI();
            })
          })
          refundItem();
        }
        function defaultset(c) {
          c.addEventListener("click", () => {
            contextmenuutils.remove();
          });
        }

        function ToMouse(c) {
          c.style.left = (e.pageX) + "px";
          c.style.top = (e.pageY) + "px";
        }

        function refundItem() {
          if (!((n === 0 && item_id === 0 && countOccurrences(own_equipment.helmet, 0) <= 1) || (n === 3 && item_id === 1 && countOccurrences(own_equipment.rweapon, 1) <= 1))) {
            let refund = 0;
            switch (n) {
              case 0:
                switch (item_id) {
                  case 0:
                    refund = itemStruct.cost.helmet[0] * 0.3;
                    break;
                  case 1:
                    refund = itemStruct.cost.helmet[1] * 0.3;
                    break;

                  default:
                    break;
                }
                break;
              case 1:
                switch (item_id) {
                  case 0:
                    refund = itemStruct.cost.jacket[0] * 0.3;
                    break;

                  default:
                    break;
                }
                break;
              case 2:
                switch (item_id) {
                  case 0:
                    refund = itemStruct.cost.weapon[0] * 0.3;
                    break;
                  case 1:
                    refund = itemStruct.cost.weapon[1] * 0.3;
                    break;
                  case 2:
                    refund = itemStruct.cost.weapon[2] * 0.3;
                    break;
                  case 3:
                    refund = itemStruct.cost.weapon[3] * 0.3;
                    break;
                  case 4:
                    refund = itemStruct.cost.weapon[4] * 0.3;
                    break;

                  default:
                    break;
                }
                break;
              case 3:
                switch (item_id) {
                  case 0:
                    refund = itemStruct.cost.weapon[0] * 0.3;
                    break;
                  case 1:
                    refund = itemStruct.cost.weapon[1] * 0.3;
                    break;
                  case 2:
                    refund = itemStruct.cost.weapon[2] * 0.3;
                    break;
                  case 3:
                    refund = itemStruct.cost.weapon[3] * 0.3;
                    break;
                  case 4:
                    refund = itemStruct.cost.weapon[4] * 0.3;
                    break;

                  default:
                    break;
                }
                break;
              case 5:
                switch (item_id) {
                  case 0:
                    refund = itemStruct.cost.boots[0] * 0.3;
                    break;

                  default:
                    break;
                }
                break;

              default:
                break;
            }
            contextmenuutils.addItem(languageData.data.item.equip.contextmenu["2"] + ` ${refund} BTC`, (c) => {
              c.style.fontFamily = 'CyberwarRegular-7BX0E';
              defaultset(c);
              c.addEventListener("click", () => {
                switch (n) {
                  case 0:
                    own_equipment.helmet.splice(own_equipment.helmet.indexOf(item_id), 1);
                    btc += refund;
                    break;
                  case 1:
                    own_equipment.jacket.splice(own_equipment.jacket.indexOf(item_id), 1);
                    btc += refund;
                    break;
                  case 2:
                    own_equipment.lweapon.splice(own_equipment.lweapon.indexOf(item_id), 1);
                    btc += refund;
                    break;
                  case 3:
                    own_equipment.rweapon.splice(own_equipment.rweapon.indexOf(item_id), 1);
                    btc += refund;
                    break;
                  case 5:
                    own_equipment.boots.splice(own_equipment.boots.indexOf(item_id), 1);
                    btc += refund;
                    break;

                  default:
                    break;
                }
                updateOwnItemsUI(languageData.data);
                update_btc_UI();
                saveUserData();
              })
            })
          }
        }
      })
    }
    function update_equip_color(b, n, item_id) {
      if (equip_data[n] === item_id) {
        for (var i = 0; i < document.querySelectorAll('.equip .color-0')[n].querySelectorAll('.item-all-btn').length; i++) {
          document.querySelectorAll('.equip .color-0')[n].querySelectorAll('.item-all-btn')[i].style.color = '';
        }
        b.style.color = '#f7d967';
      } else {
        b.style.color = '';
      }
    }
    function update_dragDrop_arr_str() {
      dragDrop_arr_str = [''];
      for (let i = 0; i < dragDrop_arr.length; i++) {
        if (document.getElementById(`draggable-${dragDrop_arr[i]}`) !== null) {
          dragDrop_arr_str.push(document.getElementById(`draggable-${dragDrop_arr[i]}`).getAttribute('data-content') + 'x' + countOccurrences(own_equipment.legstrap, parseNumberFromString(`draggable-${dragDrop_arr[i]}`.replace('-', ''))));
        }
      }
      DragIn_Element.innerHTML = dragDrop_arr_str.filter(item => item !== "").join(", ");
    }
    function update_battleLegstrap() {
      document.querySelector('.legstrap-box').innerHTML = '';
      if (dragDrop_arr.filter(item => item !== -1).length === 0) {
        save_equipdata(4, -1);
      } else {
        save_equipdata(4, 0);
      }
      if (document.getElementById('draggable-0') && own_equipment.legstrap && !own_equipment.legstrap.includes(0)) {
        dragDrop_arr = dragDrop_arr.filter(item => item !== 0); console.log(dragDrop_arr);
        update_dragDrop_arr_str();
        dragDrop_bgc = ['#a005', dragDrop_bgc[1]];
        dragDrop_opy = ['0.5', dragDrop_opy[1]];
        dragDrop_pos = [[0, 0], [dragDrop_pos[1][0], dragDrop_pos[1][1]]];
        saveUserData();
        document.getElementById('draggable-0').remove();
      }
      if (document.getElementById('draggable-1') && own_equipment.legstrap && !own_equipment.legstrap.includes(1)) {
        dragDrop_arr = dragDrop_arr.filter(item => item !== 1); console.log(dragDrop_arr);
        update_dragDrop_arr_str();
        saveUserData();
        dragDrop_bgc = [dragDrop_bgc[0], '#a005'];
        dragDrop_opy = [dragDrop_opy[0], '0.5'];
        dragDrop_pos = [[dragDrop_pos[0][0], dragDrop_pos[0][1]], [0, 0]];
        document.getElementById('draggable-1').remove();
      }
      for (let i = 0; i < dragDrop_arr.length; i++) {
        switch (dragDrop_arr[i]) {
          case 0:
            document.querySelector('.legstrap-box').innerHTML += '<div id="draggable-0--battle"></div>';
            setTimeout(() => {
              document.getElementById('draggable-0--battle').addEventListener('mousedown', (e) => {
                contextmenuutils.init(document.body, (b, c) => {
                  ToMouse(c);
                })
                contextmenuutils.addItem(languageData.data.item.equipment.legstrap["0"] + '1%', (c) => {
                  c.style.color = '#f7d967';
                  c.style.textShadow = '1px 1px 5px #1e588d, 1px 1px 5px #1e588d';
                  c.style.background = "var(--color-high-light-darkness)";
                })
                contextmenuutils.addItem(languageData.data.battle.quantity + ':' + countOccurrences(own_equipment.legstrap, 0), (c) => {
                  c.style.color = 'var(--color-high-light)';
                  c.style.textShadow = '1px 1px 5px #1e588d, 1px 1px 5px #1e588d';
                  c.style.background = "var(--color-high-light-darkness)";
                })
                for (let i = 0; i < get_dmg.length; i++) {
                  if (get_dmg[i] !== -1 && get_dmg[i] > 0) {
                    switch (i) {
                      case 0:
                        contextmenuutils.addItem('>>' + languageData.data.item.equip.helmet, (c) => {
                          defaultset(c, () => {
                            let index = own_equipment.legstrap.indexOf(0);
                            if (index !== -1 && get_dmg[i] > 0) {
                              get_dmg[i] -= 1;
                              dmg_ui_update();
                              saveContinueBattle();
                              own_equipment.legstrap.splice(index, 1);
                              saveUserData();
                              update_battleLegstrap();
                            }
                          });
                        })
                        break;
                      case 1:
                        contextmenuutils.addItem('>>' + languageData.data.item.equip.jacket, (c) => {
                          defaultset(c, () => {
                            let index = own_equipment.legstrap.indexOf(0);
                            if (index !== -1 && get_dmg[i] > 0) {
                              get_dmg[i] -= 1;
                              dmg_ui_update();
                              saveContinueBattle();
                              own_equipment.legstrap.splice(index, 1);
                              saveUserData();
                              update_battleLegstrap();
                            }
                          });
                        })
                        break;
                      case 2:
                        contextmenuutils.addItem('>>' + languageData.data.item.equip.leftWeapon, (c) => {
                          defaultset(c, () => {
                            let index = own_equipment.legstrap.indexOf(0);
                            if (index !== -1 && get_dmg[i] > 0) {
                              get_dmg[i] -= 1;
                              dmg_ui_update();
                              saveContinueBattle();
                              own_equipment.legstrap.splice(index, 1);
                              saveUserData();
                              update_battleLegstrap();
                            }
                          });
                        })
                        break;
                      case 3:
                        contextmenuutils.addItem('>>' + languageData.data.item.equip.rightWeapon, (c) => {
                          defaultset(c, () => {
                            let index = own_equipment.legstrap.indexOf(0);
                            if (index !== -1 && get_dmg[i] > 0) {
                              get_dmg[i] -= 1;
                              dmg_ui_update();
                              saveContinueBattle();
                              own_equipment.legstrap.splice(index, 1);
                              saveUserData();
                              update_battleLegstrap();
                            }
                          });
                        })
                        break;
                      case 4:
                        contextmenuutils.addItem('>>' + languageData.data.item.equip.legStrap, (c) => {
                          defaultset(c, () => {
                            let index = own_equipment.legstrap.indexOf(0);
                            if (index !== -1 && get_dmg[i] > 0) {
                              get_dmg[i] -= 1;
                              dmg_ui_update();
                              saveContinueBattle();
                              own_equipment.legstrap.splice(index, 1);
                              saveUserData();
                              update_battleLegstrap();
                            }
                          });
                        })
                        break;
                      case 5:
                        contextmenuutils.addItem('>>' + languageData.data.item.equip.boots, (c) => {
                          defaultset(c, () => {
                            let index = own_equipment.legstrap.indexOf(0);
                            if (index !== -1 && get_dmg[i] > 0) {
                              get_dmg[i] -= 1;
                              dmg_ui_update();
                              saveContinueBattle();
                              own_equipment.legstrap.splice(index, 1);
                              saveUserData();
                              update_battleLegstrap();
                            }
                          });
                        })
                        break;

                      default:
                        break;
                    }
                  }
                }
                function defaultset(c, callback) {
                  c.addEventListener("click", () => {
                    if (get_dmg[4] !== -1) {
                      callback();
                      update_dragDrop_arr_str();
                    }
                    contextmenuutils.remove();
                  });
                }
                function ToMouse(c) {
                  c.style.left = (e.pageX) + "px";
                  c.style.top = (e.pageY) + "px";
                }
              });
            }, 1);
            break;
          case 1:
            document.querySelector('.legstrap-box').innerHTML += '<div id="draggable-1--battle"></div>';
            setTimeout(() => {
              document.getElementById('draggable-1--battle').addEventListener('mousedown', (e) => {
                contextmenuutils.init(document.body, (b, c) => {
                  ToMouse(c);
                })
                contextmenuutils.addItem(languageData.data.item.equipment.legstrap["1"] + '2%', (c) => {
                  c.style.color = '#f7d967';
                  c.style.textShadow = '1px 1px 5px #1e588d, 1px 1px 5px #1e588d';
                  c.style.background = "var(--color-high-light-darkness)";
                })
                contextmenuutils.addItem(languageData.data.battle.quantity + ':' + countOccurrences(own_equipment.legstrap, 1), (c) => {
                  c.style.color = 'var(--color-high-light)';
                  c.style.textShadow = '1px 1px 5px #1e588d, 1px 1px 5px #1e588d';
                  c.style.background = "var(--color-high-light-darkness)";
                })
                for (let i = 0; i < get_dmg.length; i++) {
                  if (get_dmg[i] !== -1 && get_dmg[i] > 0) {
                    switch (i) {
                      case 0:
                        contextmenuutils.addItem('>>' + languageData.data.item.equip.helmet, (c) => {
                          defaultset(c, () => {
                            let index = own_equipment.legstrap.indexOf(1);
                            if (index !== -1 && get_dmg[i] > 0) {
                              (get_dmg[i] - 2) >= 0 ? get_dmg[i] -= 2 : get_dmg[i] = 0;
                              dmg_ui_update();
                              saveContinueBattle();
                              own_equipment.legstrap.splice(index, 1);
                              saveUserData();
                              update_battleLegstrap();
                            }
                          });
                        })
                        break;
                      case 1:
                        contextmenuutils.addItem('>>' + languageData.data.item.equip.jacket, (c) => {
                          defaultset(c, () => {
                            let index = own_equipment.legstrap.indexOf(1);
                            if (index !== -1 && get_dmg[i] > 0) {
                              (get_dmg[i] - 2) >= 0 ? get_dmg[i] -= 2 : get_dmg[i] = 0;
                              dmg_ui_update();
                              saveContinueBattle();
                              own_equipment.legstrap.splice(index, 1);
                              saveUserData();
                              update_battleLegstrap();
                            }
                          });
                        })
                        break;
                      case 2:
                        contextmenuutils.addItem('>>' + languageData.data.item.equip.leftWeapon, (c) => {
                          defaultset(c, () => {
                            let index = own_equipment.legstrap.indexOf(1);
                            if (index !== -1 && get_dmg[i] > 0) {
                              (get_dmg[i] - 2) >= 0 ? get_dmg[i] -= 2 : get_dmg[i] = 0;
                              dmg_ui_update();
                              saveContinueBattle();
                              own_equipment.legstrap.splice(index, 1);
                              saveUserData();
                              update_battleLegstrap();
                            }
                          });
                        })
                        break;
                      case 3:
                        contextmenuutils.addItem('>>' + languageData.data.item.equip.rightWeapon, (c) => {
                          defaultset(c, () => {
                            let index = own_equipment.legstrap.indexOf(1);
                            if (index !== -1 && get_dmg[i] > 0) {
                              (get_dmg[i] - 2) >= 0 ? get_dmg[i] -= 2 : get_dmg[i] = 0;
                              dmg_ui_update();
                              saveContinueBattle();
                              own_equipment.legstrap.splice(index, 1);
                              saveUserData();
                              update_battleLegstrap();
                            }
                          });
                        })
                        break;
                      case 4:
                        contextmenuutils.addItem('>>' + languageData.data.item.equip.legStrap, (c) => {
                          defaultset(c, () => {
                            let index = own_equipment.legstrap.indexOf(1);
                            if (index !== -1 && get_dmg[i] > 0) {
                              (get_dmg[i] - 2) >= 0 ? get_dmg[i] -= 2 : get_dmg[i] = 0;
                              dmg_ui_update();
                              saveContinueBattle();
                              own_equipment.legstrap.splice(index, 1);
                              saveUserData();
                              update_battleLegstrap();
                            }
                          });
                        })
                        break;
                      case 5:
                        contextmenuutils.addItem('>>' + languageData.data.item.equip.boots, (c) => {
                          defaultset(c, () => {
                            let index = own_equipment.legstrap.indexOf(1);
                            if (index !== -1 && get_dmg[i] > 0) {
                              (get_dmg[i] - 2) >= 0 ? get_dmg[i] -= 2 : get_dmg[i] = 0;
                              dmg_ui_update();
                              saveContinueBattle();
                              own_equipment.legstrap.splice(index, 1);
                              saveUserData();
                              update_battleLegstrap();
                            }
                          });
                        })
                        break;

                      default:
                        break;
                    }
                  }
                }
                function defaultset(c, callback) {
                  c.addEventListener("click", () => {
                    if (get_dmg[4] !== -1) {
                      callback();
                      update_dragDrop_arr_str();
                    }
                    contextmenuutils.remove();
                  });
                }
                function ToMouse(c) {
                  c.style.left = (e.pageX) + "px";
                  c.style.top = (e.pageY) + "px";
                }
              });
            }, 1);
            break;

          default:
            break;
        }
      }
    }

    function update_State_UI() {
      switch (equip_data[0]) {
        case 0:
          updateCSSVariable('css/root.css', '--state-helmet-bg', getRootProperty('--items-helmet-0'));
          break;

        default:
          updateCSSVariable('css/root.css', '--state-helmet-bg', 'none');
          break;
      }
      switch (equip_data[1]) {
        case 0:

          break;

        default:
          break;
      }
      switch (equip_data[2]) {
        case 0:
          updateCSSVariable('css/root.css', '--state-weapon-l-bg', getRootProperty('--items-weapon-0'));
          break;
        case 1:
          updateCSSVariable('css/root.css', '--state-weapon-l-bg', getRootProperty('--items-weapon-1'));
          break;

        default:
          updateCSSVariable('css/root.css', '--state-weapon-l-bg', 'none');
          break;
      }
      switch (equip_data[3]) {
        case 0:
          updateCSSVariable('css/root.css', '--state-weapon-r-bg', getRootProperty('--items-weapon-0'));
          break;
        case 1:
          updateCSSVariable('css/root.css', '--state-weapon-r-bg', getRootProperty('--items-weapon-1'));
          break;

        default:
          updateCSSVariable('css/root.css', '--state-weapon-r-bg', 'none');
          break;
      }
      switch (equip_data[4]) {
        case 0:

          break;

        default:
          break;
      }
      switch (equip_data[5]) {
        case 0:

          break;

        default:
          break;
      }
      createRadarChart({
        parentElement: document.querySelector('.stat'),
        labels: [`承受損傷值 ${getMaxBearDMG() * 10}`, `恢復 ${getCheck('RD') * 10}`, `裝備數量 ${getEquip()}`, `防禦 ${getCheck('DEF') * 10}`, '魔法 0', `攻擊 ${getCheck('DMG') * 10}`],
        data: [getMaxBearDMG(), getCheck('RD'), getEquip(), getCheck('DEF'), 0, getCheck('DMG')],
        radius: 100,
        mainColor: '#bcfff930',
        dataColor: '#bcfff9',
        dataFill: '#bcfff999'
      });
      function getMaxBearDMG() {
        return get_bear_dmg / 10;
      }
      function getCheck(check) {
        function maxNumberBeforeField(arr) {
          return arr
            .filter(item => item.includes(check))
            .reduce((max, item) => {
              const match = item.match(/^(\d+)/);
              if (match) {
                const number = parseFloat(match[1]);
                return number > max ? number : max;
              }
              return max;
            }, 0);
        }
        return (maxNumberBeforeField(item_data.helmet) +
          maxNumberBeforeField(item_data.jacket) +
          maxNumberBeforeField(item_data.lweapon) +
          maxNumberBeforeField(item_data.rweapon) +
          maxNumberBeforeField(item_data.boots)) / 10;
      }
      function getEquip() {
        function countNonNegativeValues(arr) {
          return arr.filter(value => value >= 0).length;
        }
        return equip_data[4] >= 0 ? countNonNegativeValues(equip_data) - 1 : countNonNegativeValues(equip_data);
      }
    }

    initEnemy();
    update();

    function showmenu(n, _languageData = languageData.data) {
      document.querySelector('.dropbase').style.visibility = '';
      document.querySelector('.dragIn-arr-title').style.visibility = '';
      document.querySelector('.dragIn-arr').style.visibility = '';
      switch (n) {
        case 0:
          if (!isBattle) {
            display('.battle', 0, '');
            display('.map', 0, 'flex');
            display('.item', 0, '');
            display('.stat', 0, '');
            display('.lobby', 0, '');
            display('.settings', 0, '');

            document.querySelectorAll('.menu-btn')[0].querySelector('svg').setAttribute('fill', 'var(--color-high-light)');
            document.querySelectorAll('.menu-btn')[1].querySelector('svg').setAttribute('fill', '#9ce0ff48');
            document.querySelectorAll('.menu-btn')[2].querySelector('svg').setAttribute('fill', '#9ce0ff48');
            document.querySelectorAll('.menu-btn')[3].querySelector('svg').setAttribute('fill', '#9ce0ff48');
            document.querySelectorAll('.menu-btn')[4].querySelector('svg').setAttribute('fill', '#9ce0ff48');
            document.querySelectorAll('.menu-btn-text')[0].style.color = 'var(--color-high-light)';
            document.querySelectorAll('.menu-btn-text')[1].style.color = '';
            document.querySelectorAll('.menu-btn-text')[2].style.color = '';
            document.querySelectorAll('.menu-btn-text')[3].style.color = '';
            document.querySelectorAll('.menu-btn-text')[4].style.color = '';

            textShadow('.menu-btn', 0, '1px 1px 5px #bec4e1, 1px 1px 5px #4ec4e1');
            textShadow('.menu-btn', 1, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
            textShadow('.menu-btn', 2, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
            textShadow('.menu-btn', 3, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
            textShadow('.menu-btn', 4, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');

            textContent('.nav-guide', 0, _languageData.nav.guide.map);
          } else {
            display('.battle', 0, 'flex');
            display('.map', 0, '');
            display('.item', 0, '');
            display('.stat', 0, '');
            display('.lobby', 0, '');
            display('.settings', 0, '');

            document.querySelectorAll('.menu-btn')[0].querySelector('svg').setAttribute('fill', 'var(--color-high-light)');
            document.querySelectorAll('.menu-btn')[1].querySelector('svg').setAttribute('fill', '#9ce0ff48');
            document.querySelectorAll('.menu-btn')[2].querySelector('svg').setAttribute('fill', '#9ce0ff48');
            document.querySelectorAll('.menu-btn')[3].querySelector('svg').setAttribute('fill', '#9ce0ff48');
            document.querySelectorAll('.menu-btn')[4].querySelector('svg').setAttribute('fill', '#9ce0ff48');
            document.querySelectorAll('.menu-btn-text')[0].style.color = 'var(--color-high-light)';
            document.querySelectorAll('.menu-btn-text')[1].style.color = '';
            document.querySelectorAll('.menu-btn-text')[2].style.color = '';
            document.querySelectorAll('.menu-btn-text')[3].style.color = '';
            document.querySelectorAll('.menu-btn-text')[4].style.color = '';

            textShadow('.menu-btn', 0, '1px 1px 5px #bec4e1, 1px 1px 5px #4ec4e1');
            textShadow('.menu-btn', 1, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
            textShadow('.menu-btn', 2, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
            textShadow('.menu-btn', 3, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
            textShadow('.menu-btn', 4, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');

            textContent('.nav-guide', 0, _languageData.nav.guide.battle);
          }
          break;
        case 1:
          display('.battle', 0, '');
          display('.map', 0, '');
          display('.item', 0, 'flex');
          display('.stat', 0, '');
          display('.lobby', 0, '');
          display('.settings', 0, '');

          document.querySelectorAll('.menu-btn')[0].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[1].querySelector('svg').setAttribute('fill', 'var(--color-high-light)');
          document.querySelectorAll('.menu-btn')[2].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[3].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[4].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn-text')[0].style.color = '';
          document.querySelectorAll('.menu-btn-text')[1].style.color = 'var(--color-high-light)';
          document.querySelectorAll('.menu-btn-text')[2].style.color = '';
          document.querySelectorAll('.menu-btn-text')[3].style.color = '';
          document.querySelectorAll('.menu-btn-text')[4].style.color = '';

          textShadow('.menu-btn', 0, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 1, '1px 1px 5px #bec4e1, 1px 1px 5px #4ec4e1');
          textShadow('.menu-btn', 2, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 3, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 4, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');

          display('.item-all-btn', 0, '');
          display('.item-all-btn', 1, '');
          display('.item-all-btn', 2, '');
          display('.item-all-btn', 3, '');
          display('.equip', 0, '');
          display('.encyclopedia', 0, '');
          display('.store', 0, '');

          textContent('.nav-guide', 0, _languageData.nav.guide.item);
          break;
        case 2:
          display('.battle', 0, '');
          display('.map', 0, '');
          display('.item', 0, '');
          display('.stat', 0, 'flex');
          display('.lobby', 0, '');
          display('.settings', 0, '');

          document.querySelectorAll('.menu-btn')[0].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[1].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[2].querySelector('svg').setAttribute('fill', 'var(--color-high-light)');
          document.querySelectorAll('.menu-btn')[3].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[4].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn-text')[0].style.color = '';
          document.querySelectorAll('.menu-btn-text')[1].style.color = '';
          document.querySelectorAll('.menu-btn-text')[2].style.color = 'var(--color-high-light)';
          document.querySelectorAll('.menu-btn-text')[3].style.color = '';
          document.querySelectorAll('.menu-btn-text')[4].style.color = '';

          textShadow('.menu-btn', 0, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 1, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 2, '1px 1px 5px #bec4e1, 1px 1px 5px #4ec4e1');
          textShadow('.menu-btn', 3, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 4, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');

          textContent('.nav-guide', 0, _languageData.nav.guide.state);
          break;
        case 3:
          display('.battle', 0, '');
          display('.map', 0, '');
          display('.item', 0, '');
          display('.stat', 0, '');
          display('.lobby', 0, 'flex');
          display('.settings', 0, '');

          document.querySelectorAll('.menu-btn')[0].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[1].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[2].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[3].querySelector('svg').setAttribute('fill', 'var(--color-high-light)');
          document.querySelectorAll('.menu-btn')[4].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn-text')[0].style.color = '';
          document.querySelectorAll('.menu-btn-text')[1].style.color = '';
          document.querySelectorAll('.menu-btn-text')[2].style.color = '';
          document.querySelectorAll('.menu-btn-text')[3].style.color = 'var(--color-high-light)';
          document.querySelectorAll('.menu-btn-text')[4].style.color = '';

          textShadow('.menu-btn', 0, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 1, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 2, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 3, '1px 1px 5px #bec4e1, 1px 1px 5px #4ec4e1');
          textShadow('.menu-btn', 4, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');

          textContent('.nav-guide', 0, _languageData.nav.guide.lobby);
          break;
        case 4:
          display('.battle', 0, '');
          display('.map', 0, '');
          display('.item', 0, '');
          display('.stat', 0, '');
          display('.lobby', 0, '');
          display('.settings', 0, 'flex');

          document.querySelectorAll('.menu-btn')[0].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[1].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[2].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[3].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[4].querySelector('svg').setAttribute('fill', 'var(--color-high-light)');
          document.querySelectorAll('.menu-btn-text')[0].style.color = '';
          document.querySelectorAll('.menu-btn-text')[1].style.color = '';
          document.querySelectorAll('.menu-btn-text')[2].style.color = '';
          document.querySelectorAll('.menu-btn-text')[3].style.color = '';
          document.querySelectorAll('.menu-btn-text')[4].style.color = 'var(--color-high-light)';

          textShadow('.menu-btn', 0, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 1, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 2, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 3, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 4, '1px 1px 5px #bec4e1, 1px 1px 5px #4ec4e1');

          textContent('.nav-guide', 0, _languageData.nav.guide.settings);
          break;
        default:
          break;
      }
    }
    // DragDropInit
    const dropzone = document.querySelector('.dropzone');
    let colnum = 0;
    let rownum = 0;
    let dragDrop_arr = [];
    let dragDrop_arr_str = [];
    let dragDrop_pos = [[0, 0], [0, 0]];
    let dragDrop_bgc = ['#a005', '#a005'];
    let dragDrop_opy = [1, 1];
    const DragIn_Element = document.querySelector('.dragIn-arr');

    function updateDragBox() {
      dropzone.innerHTML = '';
      updateCSSVariable('css/root.css', '--col-num', `${colnum}`);
      updateCSSVariable('css/root.css', '--row-num', `${rownum}`);
      for (let i = 0; i < rownum * colnum; i++) {
        dropzone.innerHTML += '<div></div>';
      }
    }

    function createDraggable(draggableID, rW, rH, dataContent) {
      const draggable = document.createElement('div');
      draggable.className = `draggable${rW}-${rH}`;
      draggable.id = draggableID;
      draggable.setAttribute('data-content', dataContent);
      document.querySelector('.dropbase').appendChild(draggable);
      draggable.style.left = dragDrop_pos[parseNumberFromString(draggableID.replace('-', ''))][0] + 'px';
      draggable.style.top = dragDrop_pos[parseNumberFromString(draggableID.replace('-', ''))][1] + 'px';
      draggable.style.backgroundColor = dragDrop_bgc[parseNumberFromString(draggableID.replace('-', ''))];
      draggable.style.opacity = dragDrop_opy[parseNumberFromString(draggableID.replace('-', ''))];
      DragIn_Element.innerHTML = dragDrop_arr_str.filter(item => item !== "").join(", ");
      //console.log(draggableID);
    }

    function draggableObj(draggable, rW, rH) {
      const draggables = document.querySelectorAll('.draggable1-1, .draggable1-2, .draggable1-3, .draggable2-1, .draggable2-2, .draggable3-1');
      const dropbase = document.querySelector('.dropbase');
      const dropzone = document.querySelector('.dropzone');
      let offsetX, offsetY, initialX, initialY;
      let ismousedown = false;

      draggable.addEventListener('touchstart', (e) => {
        if (isBattle)
          return;
        draggables.forEach(element => {
          element.style.zIndex = 1;
        });
        e.target.style.zIndex = 3;
        e.target.style.opacity = '';
        e.target.style.backgroundColor = 'transparent';
        const touch = e.touches[0];
        initialX = draggable.offsetLeft;
        initialY = draggable.offsetTop;
        offsetX = touch.clientX - initialX;
        offsetY = touch.clientY - initialY;
        dragDrop_arr = dragDrop_arr.filter(item => item !== parseNumberFromString(e.target.id.replace('-', '')));
        dragDrop_arr_str = dragDrop_arr_str.filter(item => item !== e.target.getAttribute('data-content') + 'x' + countOccurrences(own_equipment.legstrap, parseNumberFromString(e.target.id.replace('-', ''))));
        console.log(dragDrop_arr);
        DragIn_Element.innerHTML = dragDrop_arr_str.filter(item => item !== "").join(", ");
      });
      draggable.addEventListener('mousedown', (e) => {
        if (isBattle)
          return;
        ismousedown = true;
        draggables.forEach(element => {
          element.style.zIndex = 1;
        });
        e.target.style.zIndex = 3;
        e.target.style.opacity = '';
        e.target.style.backgroundColor = 'transparent';
        initialX = draggable.offsetLeft;
        initialY = draggable.offsetTop;
        offsetX = e.clientX - initialX;
        offsetY = e.clientY - initialY;
        dragDrop_arr = dragDrop_arr.filter(item => item !== parseNumberFromString(e.target.id.replace('-', '')));
        dragDrop_arr_str = dragDrop_arr_str.filter(item => item !== e.target.getAttribute('data-content') + 'x' + countOccurrences(own_equipment.legstrap, parseNumberFromString(e.target.id.replace('-', ''))));
        console.log(dragDrop_arr);
        DragIn_Element.innerHTML = dragDrop_arr_str.filter(item => item !== "").join(", ");
      });

      draggable.addEventListener('touchmove', (e) => {
        if (isBattle)
          return;
        e.preventDefault();
        const touch = e.touches[0];
        let newX = touch.clientX - offsetX;
        let newY = touch.clientY - offsetY;
        const objectWidth = parseInt(getComputedStyle(e.target).getPropertyValue('width'));
        const objectHeight = parseInt(getComputedStyle(e.target).getPropertyValue('height'));
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        // 保證物件在視窗範圍內
        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX + objectWidth > windowWidth - 20) {
          newX = windowWidth - 20 - objectWidth;
        }
        if (newY + objectHeight > windowHeight - 20) {
          newY = windowHeight - 20 - objectHeight;
        }
        draggable.style.left = `${newX}px`;
        draggable.style.top = `${newY}px`;
        // 检查是否有包含 dropzone 里面 div 小格子的中心点的八个偏移点
        const dropzone = document.querySelector('.dropzone');
        const dropzoneCells = dropzone.children;

        for (const cell of dropzoneCells) {
          const cellRect = cell.getBoundingClientRect();
          const cellCenterX = cellRect.left + cellRect.width / 2;
          const cellCenterY = cellRect.top + cellRect.height / 2;

          // 偏移量
          const offset = 5;

          // 八个偏移点
          const points = [
            { x: cellCenterX, y: cellCenterY - offset }, // 上
            { x: cellCenterX, y: cellCenterY + offset }, // 下
            { x: cellCenterX - offset, y: cellCenterY }, // 左
            { x: cellCenterX + offset, y: cellCenterY }, // 右
            { x: cellCenterX - offset, y: cellCenterY - offset }, // 左上
            { x: cellCenterX + offset, y: cellCenterY - offset }, // 右上
            { x: cellCenterX - offset, y: cellCenterY + offset }, // 左下
            { x: cellCenterX + offset, y: cellCenterY + offset } // 右下
          ];

          let isCovered = false;

          for (const point of points) {
            if (
              point.x >= newX &&
              point.x <= newX + objectWidth &&
              point.y >= newY &&
              point.y <= newY + objectHeight
            ) {
              isCovered = true;
              break;
            }
          }

          if (isCovered) {
            cell.style.backgroundColor = '#0a05';
            const draggableRect = draggable.getBoundingClientRect();
            const dropbaseRect = dropbase.getBoundingClientRect();
            const dropzoneRect = dropzone.getBoundingClientRect();

            const cellWidth = (dropzoneRect.width - (30 + ((colnum - 4) * 10))) / colnum;
            const cellHeight = (dropzoneRect.height - (30 + ((rownum - 4) * 10))) / rownum;
            const requiredWidth = rW;
            const requiredHeight = rH;

            const dropzoneCol = Math.floor((draggableRect.left - dropbaseRect.left) / (cellWidth - 3));
            const dropzoneRow = Math.floor((draggableRect.top - dropbaseRect.top) / (cellHeight + 3));
            const targetLeft = dropzoneCol * (cellWidth + 10);
            const targetTop = dropzoneRow * (cellHeight + 10);
            draggables.forEach((other) => {
              if (other !== draggable) {
                const otherRect = other.getBoundingClientRect();
                if (
                  targetLeft < otherRect.left + otherRect.width &&
                  targetLeft + draggableRect.width > otherRect.left &&
                  targetTop < otherRect.top + otherRect.height &&
                  targetTop + draggableRect.height > otherRect.top
                ) {
                  cell.style.backgroundColor = '#a005';
                }
              }
            });
          } else {
            cell.style.backgroundColor = ''; // 还原背景颜色
          }
        }
      });
      draggable.addEventListener('mousemove', (e) => {
        if (!ismousedown || isBattle)
          return;
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        const objectWidth = parseInt(getComputedStyle(e.target).getPropertyValue('width'));
        const objectHeight = parseInt(getComputedStyle(e.target).getPropertyValue('height'));
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        // 保證物件在視窗範圍內
        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX + objectWidth > windowWidth - 20) {
          newX = windowWidth - 20 - objectWidth;
        }
        if (newY + objectHeight > windowHeight - 20) {
          newY = windowHeight - 20 - objectHeight;
        }
        draggable.style.left = `${newX}px`;
        draggable.style.top = `${newY}px`;
        // 检查是否有包含 dropzone 里面 div 小格子的中心点的八个偏移点
        const dropzone = document.querySelector('.dropzone');
        const dropzoneCells = dropzone.children;

        for (const cell of dropzoneCells) {
          const cellRect = cell.getBoundingClientRect();
          const cellCenterX = cellRect.left + cellRect.width / 2;
          const cellCenterY = cellRect.top + cellRect.height / 2;

          // 偏移量
          const offset = 5;

          // 八个偏移点
          const points = [
            { x: cellCenterX, y: cellCenterY - offset }, // 上
            { x: cellCenterX, y: cellCenterY + offset }, // 下
            { x: cellCenterX - offset, y: cellCenterY }, // 左
            { x: cellCenterX + offset, y: cellCenterY }, // 右
            { x: cellCenterX - offset, y: cellCenterY - offset }, // 左上
            { x: cellCenterX + offset, y: cellCenterY - offset }, // 右上
            { x: cellCenterX - offset, y: cellCenterY + offset }, // 左下
            { x: cellCenterX + offset, y: cellCenterY + offset } // 右下
          ];

          let isCovered = false;

          for (const point of points) {
            if (
              point.x >= newX &&
              point.x <= newX + objectWidth &&
              point.y >= newY &&
              point.y <= newY + objectHeight
            ) {
              isCovered = true;
              break;
            }
          }

          if (isCovered) {
            cell.style.backgroundColor = '#0a05';
            const draggableRect = draggable.getBoundingClientRect();
            const dropbaseRect = dropbase.getBoundingClientRect();
            const dropzoneRect = dropzone.getBoundingClientRect();

            const cellWidth = (dropzoneRect.width - (30 + ((colnum - 4) * 10))) / colnum;
            const cellHeight = (dropzoneRect.height - (30 + ((rownum - 4) * 10))) / rownum;
            const requiredWidth = rW;
            const requiredHeight = rH;

            const dropzoneCol = Math.floor((draggableRect.left - dropbaseRect.left) / (cellWidth - 3));
            const dropzoneRow = Math.floor((draggableRect.top - dropbaseRect.top) / (cellHeight + 3));
            const targetLeft = dropzoneCol * (cellWidth + 10);
            const targetTop = dropzoneRow * (cellHeight + 10);
            draggables.forEach((other) => {
              if (other !== draggable) {
                const otherRect = other.getBoundingClientRect();
                if (
                  targetLeft < otherRect.left + otherRect.width &&
                  targetLeft + draggableRect.width > otherRect.left &&
                  targetTop < otherRect.top + otherRect.height &&
                  targetTop + draggableRect.height > otherRect.top
                ) {
                  cell.style.backgroundColor = '#a005';
                }
              }
            });
          } else {
            cell.style.backgroundColor = ''; // 还原背景颜色
          }
        }
      });

      draggable.addEventListener('touchend', (e) => {
        if (isBattle)
          return;
        // 检查是否有包含 dropzone 里面 div 小格子的中心点
        const dropzone = document.querySelector('.dropzone');
        const dropzoneCells = dropzone.children;

        for (const cell of dropzoneCells) {
          cell.style.backgroundColor = ''; // 还原背景颜色
        }
        const draggableRect = draggable.getBoundingClientRect();
        const dropbaseRect = dropbase.getBoundingClientRect();
        const dropzoneRect = dropzone.getBoundingClientRect();

        const cellWidth = (dropzoneRect.width - (30 + ((colnum - 4) * 10))) / colnum;
        const cellHeight = (dropzoneRect.height - (30 + ((rownum - 4) * 10))) / rownum;
        const requiredWidth = rW;
        const requiredHeight = rH;

        const dropzoneCol = Math.floor((draggableRect.left - dropbaseRect.left) / (cellWidth - 3));
        const dropzoneRow = Math.floor((draggableRect.top - dropbaseRect.top) / (cellHeight + 3));

        const targetLeft = dropzoneCol * (cellWidth + 10);
        const targetTop = dropzoneRow * (cellHeight + 10);
        dragDrop_pos[parseNumberFromString(e.target.id.replace('-', ''))][0] = targetLeft;
        dragDrop_pos[parseNumberFromString(e.target.id.replace('-', ''))][1] = targetTop;

        // 檢查是否與其他物件重疊
        let isOverlap = false;
        draggables.forEach((other) => {
          if (other !== draggable) {
            const otherRect = other.getBoundingClientRect();
            if (
              targetLeft < otherRect.left + otherRect.width &&
              targetLeft + draggableRect.width > otherRect.left &&
              targetTop < otherRect.top + otherRect.height &&
              targetTop + draggableRect.height > otherRect.top
            ) {
              isOverlap = true;
            }
          }
        });

        if (
          dropzoneCol + requiredWidth <= colnum &&
          dropzoneRow + requiredHeight <= rownum &&
          !isOverlap
        ) {
          draggable.style.left = `${targetLeft}px`;
          draggable.style.top = `${targetTop}px`;
          if (!dragDrop_arr.includes(e.target.id) && own_equipment.legstrap.includes(parseNumberFromString(e.target.id.replace('-', '')))) {
            dragDrop_arr.push(parseNumberFromString(e.target.id.replace('-', '')));
            dragDrop_arr_str.push(e.target.getAttribute('data-content') + 'x' + countOccurrences(own_equipment.legstrap, parseNumberFromString(e.target.id.replace('-', ''))));
            update_battleLegstrap();
          }
          e.target.style.zIndex = 1;
          e.target.style.opacity = 1;
          e.target.style.backgroundColor = 'transparent';
          dragDrop_bgc[parseNumberFromString(e.target.id.replace('-', ''))] = e.target.style.backgroundColor;
          dragDrop_opy[parseNumberFromString(e.target.id.replace('-', ''))] = e.target.style.opacity;
          saveUserData();
          console.log(dragDrop_arr);
          DragIn_Element.innerHTML = dragDrop_arr_str.filter(item => item !== "").join(", ");
        } else if (dropzoneCol + requiredWidth <= colnum && dropzoneRow + requiredHeight <= rownum) {
          // 優先尋找放下位置附近的格子
          const nearbyPositions = [];
          for (let rowOffset = 0; rowOffset < rownum; rowOffset++) {
            for (let colOffset = 0; colOffset < colnum; colOffset++) {
              const row = dropzoneRow + rowOffset;
              const col = dropzoneCol + colOffset;
              if (row >= 0 && row <= rownum - requiredHeight && col >= 0 && col <= colnum - requiredWidth) {
                nearbyPositions.push({
                  row,
                  col,
                  distance: Math.sqrt(
                    Math.pow(row - dropzoneRow, 2) + Math.pow(col - dropzoneCol, 2)
                  ),
                });
              }
            }
          }

          // 根據距離排序位置
          nearbyPositions.sort((a, b) => a.distance - b.distance);

          let foundSpot = false;
          for (let pos of nearbyPositions) {
            let spotAvailable = true;
            draggables.forEach((other) => {
              if (other !== draggable) {
                const otherRect = other.getBoundingClientRect();
                const checkLeft = pos.col * (cellWidth + 10);
                const checkTop = pos.row * (cellHeight + 10);
                if (
                  checkLeft < otherRect.left + otherRect.width &&
                  checkLeft + draggableRect.width > otherRect.left &&
                  checkTop < otherRect.top + otherRect.height &&
                  checkTop + draggableRect.height > otherRect.top
                ) {
                  spotAvailable = false;
                }
              }
            });
            if (spotAvailable) {
              draggable.style.left = `${pos.col * (cellWidth + 10)}px`;
              draggable.style.top = `${pos.row * (cellHeight + 10)}px`;
              foundSpot = true;
              if (!dragDrop_arr.includes(e.target.id) && own_equipment.legstrap.includes(parseNumberFromString(e.target.id.replace('-', '')))) {
                dragDrop_arr.push(parseNumberFromString(e.target.id.replace('-', '')));
                dragDrop_arr_str.push(e.target.getAttribute('data-content') + 'x' + countOccurrences(own_equipment.legstrap, parseNumberFromString(e.target.id.replace('-', ''))));
                update_battleLegstrap();
              }
              e.target.style.zIndex = 1;
              e.target.style.opacity = 1;
              e.target.style.backgroundColor = 'transparent';
              dragDrop_bgc[parseNumberFromString(e.target.id.replace('-', ''))] = e.target.style.backgroundColor;
              dragDrop_opy[parseNumberFromString(e.target.id.replace('-', ''))] = e.target.style.opacity;
              saveUserData();
              console.log(dragDrop_arr);
              DragIn_Element.innerHTML = dragDrop_arr_str.filter(item => item !== "").join(", ");
              break;
            }
          }

          if (!foundSpot) {
            // 如果附近找不到合適的位置，則從整個網格中尋找
            for (let row = 0; row <= rownum - requiredHeight; row++) {
              for (let col = 0; col <= colnum - requiredWidth; col++) {
                let spotAvailable = true;
                draggables.forEach((other) => {
                  if (other !== draggable) {
                    const otherRect = other.getBoundingClientRect();
                    const checkLeft = col * (cellWidth + 10);
                    const checkTop = row * (cellHeight + 10);
                    if (
                      checkLeft < otherRect.left + otherRect.width &&
                      checkLeft + draggableRect.width > otherRect.left &&
                      checkTop < otherRect.top + otherRect.height &&
                      checkTop + draggableRect.height > otherRect.top
                    ) {
                      spotAvailable = false;
                    }
                  }
                });
                if (spotAvailable) {
                  draggable.style.left = `${col * (cellWidth + 10)}px`;
                  draggable.style.top = `${row * (cellHeight + 10)}px`;
                  if (!dragDrop_arr.includes(e.target.id) && own_equipment.legstrap.includes(parseNumberFromString(e.target.id.replace('-', '')))) {
                    dragDrop_arr.push(parseNumberFromString(e.target.id.replace('-', '')));
                    dragDrop_arr_str.push(e.target.getAttribute('data-content') + 'x' + countOccurrences(own_equipment.legstrap, parseNumberFromString(e.target.id.replace('-', ''))));
                    update_battleLegstrap();
                  }
                  e.target.style.zIndex = 1;
                  e.target.style.opacity = 1;
                  e.target.style.backgroundColor = 'transparent';
                  dragDrop_bgc[parseNumberFromString(e.target.id.replace('-', ''))] = e.target.style.backgroundColor;
                  dragDrop_opy[parseNumberFromString(e.target.id.replace('-', ''))] = e.target.style.opacity;
                  saveUserData();
                  console.log(dragDrop_arr);
                  DragIn_Element.innerHTML = dragDrop_arr_str.filter(item => item !== "").join(", ");
                  return;
                } else {
                  dragDrop_arr = dragDrop_arr.filter(item => item !== parseNumberFromString(e.target.id.replace('-', '')));
                  dragDrop_arr_str = dragDrop_arr_str.filter(item => item !== e.target.getAttribute('data-content') + 'x' + countOccurrences(own_equipment.legstrap, parseNumberFromString(e.target.id.replace('-', ''))));
                  e.target.style.zIndex = '';
                  e.target.style.opacity = '';
                  e.target.style.backgroundColor = '';
                  dragDrop_bgc[parseNumberFromString(e.target.id.replace('-', ''))] = e.target.style.backgroundColor;
                  dragDrop_opy[parseNumberFromString(e.target.id.replace('-', ''))] = e.target.style.opacity;
                  saveUserData();
                  console.log(dragDrop_arr);
                  DragIn_Element.innerHTML = dragDrop_arr_str.filter(item => item !== "").join(", ");
                  update_battleLegstrap();
                  return;
                }
              }
            }
          }
        } else {
          dragDrop_arr = dragDrop_arr.filter(item => item !== parseNumberFromString(e.target.id.replace('-', '')));
          dragDrop_arr_str = dragDrop_arr_str.filter(item => item !== e.target.getAttribute('data-content') + 'x' + countOccurrences(own_equipment.legstrap, parseNumberFromString(e.target.id.replace('-', ''))));
          e.target.style.zIndex = '';
          e.target.style.opacity = 0.8;
          e.target.style.backgroundColor = '#f003';
          dragDrop_bgc[parseNumberFromString(e.target.id.replace('-', ''))] = e.target.style.backgroundColor;
          dragDrop_opy[parseNumberFromString(e.target.id.replace('-', ''))] = e.target.style.opacity;
          saveUserData();
          console.log(dragDrop_arr);
          DragIn_Element.innerHTML = dragDrop_arr_str.filter(item => item !== "").join(", ");
          update_battleLegstrap();
        }
      });
      document.body.addEventListener('mouseup', () => {
        ismousedown = false;
      });
      draggable.addEventListener('mouseup', (e) => {
        if (!ismousedown || isBattle)
          return;
        // 检查是否有包含 dropzone 里面 div 小格子的中心点
        const dropzone = document.querySelector('.dropzone');
        const dropzoneCells = dropzone.children;

        for (const cell of dropzoneCells) {
          cell.style.backgroundColor = ''; // 还原背景颜色
        }
        const draggableRect = draggable.getBoundingClientRect();
        const dropbaseRect = dropbase.getBoundingClientRect();
        const dropzoneRect = dropzone.getBoundingClientRect();

        const cellWidth = (dropzoneRect.width - (30 + ((colnum - 4) * 10))) / colnum;
        const cellHeight = (dropzoneRect.height - (30 + ((rownum - 4) * 10))) / rownum;
        const requiredWidth = rW;
        const requiredHeight = rH;

        const dropzoneCol = Math.floor((draggableRect.left - dropbaseRect.left) / (cellWidth - 3));
        const dropzoneRow = Math.floor((draggableRect.top - dropbaseRect.top) / (cellHeight + 3));

        const targetLeft = dropzoneCol * (cellWidth + 10);
        const targetTop = dropzoneRow * (cellHeight + 10);
        dragDrop_pos[parseNumberFromString(e.target.id.replace('-', ''))][0] = targetLeft;
        dragDrop_pos[parseNumberFromString(e.target.id.replace('-', ''))][1] = targetTop;

        // 檢查是否與其他物件重疊
        let isOverlap = false;
        draggables.forEach((other) => {
          if (other !== draggable) {
            const otherRect = other.getBoundingClientRect();
            if (
              targetLeft < otherRect.left + otherRect.width &&
              targetLeft + draggableRect.width > otherRect.left &&
              targetTop < otherRect.top + otherRect.height &&
              targetTop + draggableRect.height > otherRect.top
            ) {
              isOverlap = true;
            }
          }
        });

        if (
          dropzoneCol + requiredWidth <= colnum &&
          dropzoneRow + requiredHeight <= rownum &&
          !isOverlap
        ) {
          draggable.style.left = `${targetLeft}px`;
          draggable.style.top = `${targetTop}px`;
          if (!dragDrop_arr.includes(e.target.id) && own_equipment.legstrap.includes(parseNumberFromString(e.target.id.replace('-', '')))) {
            dragDrop_arr.push(parseNumberFromString(e.target.id.replace('-', '')));
            dragDrop_arr_str.push(e.target.getAttribute('data-content') + 'x' + countOccurrences(own_equipment.legstrap, parseNumberFromString(e.target.id.replace('-', ''))));
            update_battleLegstrap();
          }
          e.target.style.zIndex = 1;
          e.target.style.opacity = 1;
          e.target.style.backgroundColor = 'transparent';
          dragDrop_bgc[parseNumberFromString(e.target.id.replace('-', ''))] = e.target.style.backgroundColor;
          dragDrop_opy[parseNumberFromString(e.target.id.replace('-', ''))] = e.target.style.opacity;
          saveUserData();
          console.log(dragDrop_arr);
          DragIn_Element.innerHTML = dragDrop_arr_str.filter(item => item !== "").join(", ");
        } else if (dropzoneCol + requiredWidth <= colnum && dropzoneRow + requiredHeight <= rownum) {
          // 優先尋找放下位置附近的格子
          const nearbyPositions = [];
          for (let rowOffset = 0; rowOffset < rownum; rowOffset++) {
            for (let colOffset = 0; colOffset < colnum; colOffset++) {
              const row = dropzoneRow + rowOffset;
              const col = dropzoneCol + colOffset;
              if (row >= 0 && row <= rownum - requiredHeight && col >= 0 && col <= colnum - requiredWidth) {
                nearbyPositions.push({
                  row,
                  col,
                  distance: Math.sqrt(
                    Math.pow(row - dropzoneRow, 2) + Math.pow(col - dropzoneCol, 2)
                  ),
                });
              }
            }
          }

          // 根據距離排序位置
          nearbyPositions.sort((a, b) => a.distance - b.distance);

          let foundSpot = false;
          for (let pos of nearbyPositions) {
            let spotAvailable = true;
            draggables.forEach((other) => {
              if (other !== draggable) {
                const otherRect = other.getBoundingClientRect();
                const checkLeft = pos.col * (cellWidth + 10);
                const checkTop = pos.row * (cellHeight + 10);
                if (
                  checkLeft < otherRect.left + otherRect.width &&
                  checkLeft + draggableRect.width > otherRect.left &&
                  checkTop < otherRect.top + otherRect.height &&
                  checkTop + draggableRect.height > otherRect.top
                ) {
                  spotAvailable = false;
                }
              }
            });
            if (spotAvailable) {
              draggable.style.left = `${pos.col * (cellWidth + 10)}px`;
              draggable.style.top = `${pos.row * (cellHeight + 10)}px`;
              foundSpot = true;
              if (!dragDrop_arr.includes(e.target.id) && own_equipment.legstrap.includes(parseNumberFromString(e.target.id.replace('-', '')))) {
                dragDrop_arr.push(parseNumberFromString(e.target.id.replace('-', '')));
                dragDrop_arr_str.push(e.target.getAttribute('data-content') + 'x' + countOccurrences(own_equipment.legstrap, parseNumberFromString(e.target.id.replace('-', ''))));
                update_battleLegstrap();
              }
              e.target.style.zIndex = 1;
              e.target.style.opacity = 1;
              e.target.style.backgroundColor = 'transparent';
              dragDrop_bgc[parseNumberFromString(e.target.id.replace('-', ''))] = e.target.style.backgroundColor;
              dragDrop_opy[parseNumberFromString(e.target.id.replace('-', ''))] = e.target.style.opacity;
              saveUserData();
              console.log(dragDrop_arr);
              DragIn_Element.innerHTML = dragDrop_arr_str.filter(item => item !== "").join(", ");
              break;
            }
          }

          if (!foundSpot) {
            // 如果附近找不到合適的位置，則從整個網格中尋找
            for (let row = 0; row <= rownum - requiredHeight; row++) {
              for (let col = 0; col <= colnum - requiredWidth; col++) {
                let spotAvailable = true;
                draggables.forEach((other) => {
                  if (other !== draggable) {
                    const otherRect = other.getBoundingClientRect();
                    const checkLeft = col * (cellWidth + 10);
                    const checkTop = row * (cellHeight + 10);
                    if (
                      checkLeft < otherRect.left + otherRect.width &&
                      checkLeft + draggableRect.width > otherRect.left &&
                      checkTop < otherRect.top + otherRect.height &&
                      checkTop + draggableRect.height > otherRect.top
                    ) {
                      spotAvailable = false;
                    }
                  }
                });
                if (spotAvailable) {
                  draggable.style.left = `${col * (cellWidth + 10)}px`;
                  draggable.style.top = `${row * (cellHeight + 10)}px`;
                  if (!dragDrop_arr.includes(e.target.id) && own_equipment.legstrap.includes(parseNumberFromString(e.target.id.replace('-', '')))) {
                    dragDrop_arr.push(parseNumberFromString(e.target.id.replace('-', '')));
                    dragDrop_arr_str.push(e.target.getAttribute('data-content') + 'x' + countOccurrences(own_equipment.legstrap, parseNumberFromString(e.target.id.replace('-', ''))));
                    update_battleLegstrap();
                  }
                  e.target.style.zIndex = 1;
                  e.target.style.opacity = 1;
                  e.target.style.backgroundColor = 'transparent';
                  dragDrop_bgc[parseNumberFromString(e.target.id.replace('-', ''))] = e.target.style.backgroundColor;
                  dragDrop_opy[parseNumberFromString(e.target.id.replace('-', ''))] = e.target.style.opacity;
                  saveUserData();
                  console.log(dragDrop_arr);
                  DragIn_Element.innerHTML = dragDrop_arr_str.filter(item => item !== "").join(", ");
                  return;
                } else {
                  dragDrop_arr = dragDrop_arr.filter(item => item !== parseNumberFromString(e.target.id.replace('-', '')));
                  dragDrop_arr_str = dragDrop_arr_str.filter(item => item !== e.target.getAttribute('data-content') + 'x' + countOccurrences(own_equipment.legstrap, parseNumberFromString(e.target.id.replace('-', ''))));
                  e.target.style.zIndex = '';
                  e.target.style.opacity = '';
                  e.target.style.backgroundColor = '';
                  dragDrop_bgc[parseNumberFromString(e.target.id.replace('-', ''))] = e.target.style.backgroundColor;
                  dragDrop_opy[parseNumberFromString(e.target.id.replace('-', ''))] = e.target.style.opacity;
                  saveUserData();
                  console.log(dragDrop_arr);
                  DragIn_Element.innerHTML = dragDrop_arr_str.filter(item => item !== "").join(", ");
                  update_battleLegstrap();
                  return;
                }
              }
            }
          }
        } else {
          dragDrop_arr = dragDrop_arr.filter(item => item !== parseNumberFromString(e.target.id.replace('-', '')));
          dragDrop_arr_str = dragDrop_arr_str.filter(item => item !== e.target.getAttribute('data-content') + 'x' + countOccurrences(own_equipment.legstrap, parseNumberFromString(e.target.id.replace('-', ''))));
          e.target.style.zIndex = '';
          e.target.style.opacity = 0.8;
          e.target.style.backgroundColor = '#f003';
          dragDrop_bgc[parseNumberFromString(e.target.id.replace('-', ''))] = e.target.style.backgroundColor;
          dragDrop_opy[parseNumberFromString(e.target.id.replace('-', ''))] = e.target.style.opacity;
          saveUserData();
          console.log(dragDrop_arr);
          DragIn_Element.innerHTML = dragDrop_arr_str.filter(item => item !== "").join(", ");
          update_battleLegstrap();
        }
      });
    }
    function createStoreItem(groupId, title, imgID, buyInner, callback) {
      const storeItem = document.querySelectorAll('.store-item')[groupId];

      const newDiv = document.createElement('div');

      newDiv.innerHTML = `
        <div class="store-item-title">${title}</div>
        <div class="store-item-img" id="${imgID}"></div>
        <div class="buy">${buyInner}</div>
      `;

      storeItem.appendChild(newDiv);

      newDiv.querySelector('.buy').addEventListener('click', (e) => {
        callback(e.target);
      });
    }
    function storeItemInfo(cost, storeInfoImg, languageData, callback) {
      document.querySelector('.store-info').style.display = 'flex';
      document.querySelector('.store-info').addEventListener('click', (e) => {
        if (e.target !== document.querySelector('.store-info>div') && e.target !== document.querySelector('.store-info>div>.store-info-img')) {
          document.querySelector('.store-info').style.display = '';
        }
      });
      let calculate = btc - cost;
      document.querySelector('.store-info>div').innerHTML = `<div class="store-info-img polygon-all" id="${storeInfoImg}"></div>${btc} BTC<br> -&emsp;&emsp;${cost}<br> = [${calculate}]BTC<div class="confirm">${languageData.item.store[2]}</div>`;
      document.querySelector('.store-info>div>.confirm').addEventListener('click', () => {
        callback(cost);
        document.querySelector('.store-info').style.display = '';
      });
    }
    function initStoreItem(languageData) {
      document.querySelectorAll('.store-topic>div')[0].textContent = languageData.item.store[7];
      document.querySelectorAll('.store-topic>div')[1].textContent = languageData.item.store[8];
      document.querySelectorAll('.store-topic>div')[2].textContent = languageData.item.store[9];
      createStoreItem(1, languageData.item.equipment.legstrap["0"] + '<br>' + languageData.item.store[0] + '1%' + languageData.item.store[1], 'store-0', itemStruct.cost.legstrap[0] + ' BTC' + languageData.item.store[2], buy => {
        if (btc >= itemStruct.cost.legstrap[0]) {
          storeItemInfo(itemStruct.cost.legstrap[0], 'store-info-0', languageData, cost => {
            btc -= cost;
            document.querySelector('.nav-wallet-btc-data').textContent = btc;
            saveOwnEquipment(own_equipment.legstrap, 0);
            update_dragDrop_arr_str();
            saveUserData();
          });
        } else {
          if (buy.innerHTML === itemStruct.cost.legstrap[0] + ' BTC' + languageData.item.store[2]) {
            setTimeout(() => {
              buy.innerHTML = languageData.item.store[3];
              setTimeout(() => {
                buy.innerHTML = itemStruct.cost.legstrap[0] + ' BTC' + languageData.item.store[2];
              }, 1000);
            }, 100);
          }
        }
      });
      createStoreItem(1, languageData.item.equipment.legstrap["1"] + '<br>' + languageData.item.store[0] + '2%' + languageData.item.store[1], 'store-1', itemStruct.cost.legstrap[1] + ' BTC' + languageData.item.store[2], buy => {
        if (btc >= itemStruct.cost.legstrap[1]) {
          storeItemInfo(itemStruct.cost.legstrap[1], 'store-info-1', languageData, cost => {
            btc -= cost;
            document.querySelector('.nav-wallet-btc-data').textContent = btc;
            saveOwnEquipment(own_equipment.legstrap, 1);
            update_dragDrop_arr_str();
            saveUserData();
          });
        } else {
          if (buy.innerHTML === itemStruct.cost.legstrap[1] + ' BTC' + languageData.item.store[2]) {
            setTimeout(() => {
              buy.innerHTML = languageData.item.store[3];
              setTimeout(() => {
                buy.innerHTML = itemStruct.cost.legstrap[1] + ' BTC' + languageData.item.store[2];
              }, 1000);
            }, 100);
          }
        }
      });
      createStoreItem(0, languageData.item.equipment.weapon["0"] + `(${languageData.item.store[5]})` + '<br>' + languageData.item.store[4] + ' >>>' + itemStruct.ability.weapon[0], 'store-2', itemStruct.cost.weapon[0] + ' BTC' + languageData.item.store[2], buy => {
        if (btc >= itemStruct.cost.weapon[0]) {
          storeItemInfo(itemStruct.cost.weapon[0], 'store-info-2', languageData, cost => {
            btc -= cost;
            document.querySelector('.nav-wallet-btc-data').textContent = btc;
            saveOwnEquipment(own_equipment.lweapon, 0);
            saveUserData();
          });
        } else {
          if (buy.innerHTML === itemStruct.cost.weapon[0] + ' BTC' + languageData.item.store[2]) {
            setTimeout(() => {
              buy.innerHTML = languageData.item.store[3];
              setTimeout(() => {
                buy.innerHTML = itemStruct.cost.weapon[0] + ' BTC' + languageData.item.store[2];
              }, 1000);
            }, 100);
          }
        }
      });
      createStoreItem(0, languageData.item.equipment.weapon["0"] + `(${languageData.item.store[6]})` + '<br>' + languageData.item.store[4] + ' >>>' + itemStruct.ability.weapon[0], 'store-2', itemStruct.cost.weapon[0] + ' BTC' + languageData.item.store[2], buy => {
        if (btc >= itemStruct.cost.weapon[0]) {
          storeItemInfo(itemStruct.cost.weapon[0], 'store-info-2', languageData, cost => {
            btc -= cost;
            document.querySelector('.nav-wallet-btc-data').textContent = btc;
            saveOwnEquipment(own_equipment.rweapon, 0);
            saveUserData();
          });
        } else {
          if (buy.innerHTML === itemStruct.cost.weapon[0] + ' BTC' + languageData.item.store[2]) {
            setTimeout(() => {
              buy.innerHTML = languageData.item.store[3];
              setTimeout(() => {
                buy.innerHTML = itemStruct.cost.weapon[0] + ' BTC' + languageData.item.store[2];
              }, 1000);
            }, 100);
          }
        }
      });
      createStoreItem(0, languageData.item.equipment.weapon["1"] + `(${languageData.item.store[5]})` + '<br>' + languageData.item.store[4] + ' >>>' + itemStruct.ability.weapon[1], 'store-3', itemStruct.cost.weapon[1] + ' BTC' + languageData.item.store[2], buy => {
        if (btc >= itemStruct.cost.weapon[1]) {
          storeItemInfo(itemStruct.cost.weapon[1], 'store-info-3', languageData, cost => {
            btc -= cost;
            document.querySelector('.nav-wallet-btc-data').textContent = btc;
            saveOwnEquipment(own_equipment.lweapon, 1);
            saveUserData();
          });
        } else {
          if (buy.innerHTML === itemStruct.cost.weapon[1] + ' BTC' + languageData.item.store[2]) {
            setTimeout(() => {
              buy.innerHTML = languageData.item.store[3];
              setTimeout(() => {
                buy.innerHTML = itemStruct.cost.weapon[1] + ' BTC' + languageData.item.store[2];
              }, 1000);
            }, 100);
          }
        }
      });
      createStoreItem(0, languageData.item.equipment.weapon["1"] + `(${languageData.item.store[6]})` + '<br>' + languageData.item.store[4] + ' >>>' + itemStruct.ability.weapon[1], 'store-3', itemStruct.cost.weapon[1] + ' BTC' + languageData.item.store[2], buy => {
        if (btc >= itemStruct.cost.weapon[1]) {
          storeItemInfo(itemStruct.cost.weapon[1], 'store-info-3', languageData, cost => {
            btc -= cost;
            document.querySelector('.nav-wallet-btc-data').textContent = btc;
            saveOwnEquipment(own_equipment.rweapon, 1);
            saveUserData();
          });
        } else {
          if (buy.innerHTML === itemStruct.cost.weapon[1] + ' BTC' + languageData.item.store[2]) {
            setTimeout(() => {
              buy.innerHTML = languageData.item.store[3];
              setTimeout(() => {
                buy.innerHTML = itemStruct.cost.weapon[1] + ' BTC' + languageData.item.store[2];
              }, 1000);
            }, 100);
          }
        }
      });
      createStoreItem(2, languageData.item.store[10] + '<br>' + `⇪ ${(colnum > 4 ? 5 : colnum + 1)} ✕ ${(rownum > 4 ? 5 + '<br>( ' + languageData.item.store[11] + ' ) ' : rownum + 1)}`, 'store-4', itemStruct.cost.thigh_bag_space + ' BTC' + languageData.item.store[2], buy => {
        if (btc >= itemStruct.cost.thigh_bag_space && colnum <= 4 && rownum <= 4) {
          storeItemInfo(itemStruct.cost.thigh_bag_space, 'store-info-4', languageData, cost => {
            btc -= cost;
            document.querySelector('.nav-wallet-btc-data').textContent = btc;
            colnum += 1;
            rownum += 1;
            updateDragBox();
            saveUserData();
          });
        } else if (colnum > 4 && rownum > 4) {
          if (buy.innerHTML === itemStruct.cost.thigh_bag_space + ' BTC' + languageData.item.store[2]) {
            setTimeout(() => {
              buy.innerHTML = languageData.item.store[10] + languageData.item.store[11];
              setTimeout(() => {
                buy.innerHTML = itemStruct.cost.thigh_bag_space + ' BTC' + languageData.item.store[2];
              }, 1000);
            }, 100);
          }
        } else {
          if (buy.innerHTML === itemStruct.cost.thigh_bag_space + ' BTC' + languageData.item.store[2]) {
            setTimeout(() => {
              buy.innerHTML = languageData.item.store[3];
              setTimeout(() => {
                buy.innerHTML = itemStruct.cost.thigh_bag_space + ' BTC' + languageData.item.store[2];
              }, 1000);
            }, 100);
          }
        }
      });
    }
    // store nav update
    store_nav();
    function store_nav() {
      const currentTimestamp = Date.now();
      const date = new Date(currentTimestamp);
      const dayOfWeek = date.getDay();
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDayOfMonth = new Date(year, month, 1);
      const firstDayOfWeek = firstDayOfMonth.getDay();
      const weekOfMonth = Math.ceil((date.getDate() + firstDayOfWeek) / 7);
      switch (dayOfWeek) {
        case 0:
          document.querySelector('.store-nav').style.setProperty('--store-nav-bg', `url(../img/store/store_nav_${Math.floor(getRandomNumber(weekOfMonth + dayOfWeek, 19))}.jpg)`);
          break;
        case 1:
          document.querySelector('.store-nav').style.setProperty('--store-nav-bg', `url(../img/store/store_nav_11.jpg)`);
          break;
        case 2:
          document.querySelector('.store-nav').style.setProperty('--store-nav-bg', `url(../img/store/store_nav_2.jpg)`);
          break;
        case 3:
          document.querySelector('.store-nav').style.setProperty('--store-nav-bg', `url(../img/store/store_nav_15.jpg)`);
          break;
        case 4:
          document.querySelector('.store-nav').style.setProperty('--store-nav-bg', `url(../img/store/store_nav_4.jpg)`);
          break;
        case 5:
          document.querySelector('.store-nav').style.setProperty('--store-nav-bg', `url(../img/store/store_nav_16.jpg)`);
          break;
        case 6:
          document.querySelector('.store-nav').style.setProperty('--store-nav-bg', `url(../img/store/store_nav_${Math.floor(getRandomNumber(weekOfMonth + dayOfWeek, 19))}.jpg)`);
          break;

        default:
          break;
      }
    }
  }

  function createDIV(classname, textContent, parent, func) {
    const div = document.createElement('DIV');
    div.className = classname;
    div.textContent = textContent;
    parent.appendChild(div);
    func(div);
  }
  function createRadarChart({ parentElement = document.body, labels = ['A', 'B', 'C', 'D', 'E', 'F'], data = [5, 4, 3, 2, 4, 5], radius = 50, mainColor = '#ddd', dataColor = '#00f', dataFill = '#00f2' }) {
    document.querySelector('.radar-chart-container')?.remove();
    document.querySelector('.radar-chart-open')?.remove();
    const container = document.createElement('div');
    container.className = 'radar-chart-container';
    container.onclick = () => {
      container.style.display = 'none';
    };
    parentElement.appendChild(container);
    const div = document.createElement('div');
    div.className = 'radar-chart-area';
    div.style.width = radius * 4 + 'px';
    div.style.height = radius * 4 + 'px';
    div.style.scale = window.innerWidth / window.innerHeight > 1 ? window.innerWidth > window.innerHeight ? window.innerHeight / window.innerWidth < 1 ? 0.7 : window.innerHeight / window.innerWidth : 1 : window.innerWidth / window.innerHeight < 0.5 ? 0.6 : window.innerWidth / window.innerHeight;
    window.addEventListener('resize', () => {
      div.style.scale = window.innerWidth / window.innerHeight > 1 ? window.innerWidth > window.innerHeight ? window.innerHeight / window.innerWidth < 1 ? 0.7 : window.innerHeight / window.innerWidth : 1 : window.innerWidth / window.innerHeight < 0.5 ? 0.6 : window.innerWidth / window.innerHeight;
    });
    container.appendChild(div);
    const canvas = document.createElement('canvas');
    canvas.width = parseInt(div.style.width);
    canvas.height = parseInt(div.style.height);
    div.appendChild(canvas);
    const close = document.createElement('div');
    close.className = 'close-btn';
    close.innerHTML = '&times;';
    container.appendChild(close);
    const open = document.createElement('div');
    open.className = 'radar-chart-open';
    open.textContent = 'ⓘ';
    open.onclick = () => {
      if (container.style.display === 'flex') {
        container.style.display = 'none';
      } else {
        container.style.display = 'flex';
      }
    };
    parentElement.appendChild(open);

    const ctx = canvas.getContext('2d');
    const angle = Math.PI * 2 / data.length;

    ctx.translate(canvas.width / 2, canvas.height / 2);

    for (let r = 1; r <= 5; r++) {
      ctx.beginPath();
      for (let i = 0; i < data.length; i++) {
        const x = radius * (r / 5) * Math.cos(angle * i);
        const y = radius * (r / 5) * Math.sin(angle * i);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = mainColor;
      ctx.stroke();
    }

    ctx.beginPath();
    data.forEach((value, index) => {
      const x = radius * (value / 5) * Math.cos(angle * index);
      const y = radius * (value / 5) * Math.sin(angle * index);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = dataColor;
    ctx.stroke();
    ctx.fillStyle = dataFill; ctx.font = 'bold 10px Arial';
    ctx.fill();

    labels.forEach((label, index) => {
      let x = 0;
      let y = 0;
      switch (index) {
        case 1:
        case 2:
        case 4:
        case 5:
          x = (radius + label.length * 10) * Math.cos(angle * index);
          y = (radius + label.length * 10) * Math.sin(angle * index);
          ctx.fillText(label, x, y);
          break;
        case 0:
          x = (radius + 10) * Math.cos(angle * index);
          y = (radius + 10) * Math.sin(angle * index);
          ctx.fillText(label, x, y);
          break;
        case 3:
          x = (radius + 20 + label.length * 10) * Math.cos(angle * index);
          y = (radius + 20 + label.length * 10) * Math.sin(angle * index);
          ctx.fillText(label, x, y);
          break;

        default:
          break;
      }
    });
  }
  function checkArr(arr, tar) {
    // 使用 every() 方法來檢查每個元素是否都是 tar
    return arr.every(element => element === tar);
  }
  function checkArrsExclude(arr, tar, excludeIndex) {
    // 使用 every() 方法來檢查每個元素是否都是 tar，並且排除特定的索引
    return arr.every((element, index) => {
      // 檢查是否為要排除的索引，如果是則返回 true (即不排除)
      if (index === excludeIndex) {
        return true;
      }
      // 否則檢查是否都是 tar
      return tar.includes(element);
    });
  }
  function findRandomNonNegativeOne(arr) {
    const filteredArr = arr.filter(num => num !== -1);
    if (filteredArr.length === 0) {
      return null; // 如果沒有非 -1 的數，返回 null 或其他值
    }
    const randomIndex = Math.floor(Math.random() * filteredArr.length);
    return filteredArr[randomIndex];
  }
  function findRandomNonNegativeOneIndex(arr) {
    // 過濾出所有不是 -1 的數的索引
    const indices = arr
      .map((num, index) => (num !== -1 ? index : -1))
      .filter(index => index !== -1);

    // 如果沒有非 -1 的數，返回 -1 或其他表示沒有找到的值
    if (indices.length === 0) {
      return -1;
    }

    // 隨機選取一個索引
    const randomIndex = Math.floor(Math.random() * indices.length);
    return indices[randomIndex];
  }
  function display(element, n, style) {
    document.querySelectorAll(element)[n].style.display = style;
  }
  function textShadow(element, n, style) {
    document.querySelectorAll(element)[n].style.textShadow = style;
  }
  function textContent(element, n, t) {
    document.querySelectorAll(element)[n].textContent = t;
  }
  function innerHTML(element, n, t) {
    document.querySelectorAll(element)[n].innerHTML = t;
  }
  function opacity(element, n, style) {
    document.querySelectorAll(element)[n].style.opacity = style;
  }

  function centerMapScroll() {
    let map_element = document.querySelector('.map');
    let mapb_element = document.querySelector('.map-b');
    map_element.scrollTop = 0;
    map_element.scrollLeft = 0;
    mapb_element.scrollTop = 0;
    mapb_element.scrollLeft = 0;
    map_element.scrollTop = (map_element.scrollHeight - map_element.clientHeight) / 2 - 40;
    mapb_element.scrollLeft = (mapb_element.scrollWidth - mapb_element.clientWidth) / 2;
  }

  function initEnemy() {
    for (var i = 0; i < document.querySelectorAll('.map-enemies').length; i++) {
      document.querySelectorAll('.map-enemies')[i].style.display = 'flex';
      document.querySelectorAll('.map-enemies')[i].style.marginLeft = storageutils.get('enemies-m-left' + i, `${getRandomNumber(-100, 100)}px`);
      document.querySelectorAll('.map-enemies')[i].style.marginTop = storageutils.get('enemies-m-top' + i, `${getRandomNumber(-100, 100)}px`);
    }
  }
  function findEnemy() {
    for (var i = 0; i < document.querySelectorAll('.map-enemies').length; i++) {
      document.querySelectorAll('.map-enemies')[i].style.display = 'flex';
      document.querySelectorAll('.map-enemies')[i].style.marginLeft = `${getRandomNumber(-100, 100)}px`;
      document.querySelectorAll('.map-enemies')[i].style.marginTop = `${getRandomNumber(-100, 100)}px`;
    }
    storageutils.set('enemies-m-left' + i, document.querySelectorAll('.map-enemies')[i]?.style.marginLeft);
    storageutils.set('enemies-m-top' + i, document.querySelectorAll('.map-enemies')[i]?.style.marginTop);
  }
  function isOnTheHour() {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    return minutes === 0 && seconds === 0;
  }
  function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
  function countOccurrences(array, targetValue) {
    let count = 0;
    array.forEach(element => {
      if (element === targetValue) {
        count++;
      }
    });
    return count;
  }
  function uniq(array) {
    return [...new Set(array)];
  }
  function parseNumberFromString(str) {
    const matches = str.match(/[-\d.]+/g);

    if (matches && matches.length > 0) {
      const number = parseFloat(matches[0]);
      return isNaN(number) ? NaN : number;
    } else {
      return NaN;
    }
  }
  function update() {
    setTimeout(() => {
      if (isOnTheHour()) {
        findEnemy();
      }
      update();
    }, 1000)
  }
  function loop(callback, interval) {
    let timerId = null;
    return {
      start: () => {
        if (!timerId) {
          timerId = setInterval(callback, interval);
          //console.log('Loop started');
        }
      },
      stop: () => {
        if (timerId) {
          clearInterval(timerId);
          timerId = null;
          //console.log('Loop stopped');
        }
      }
    };
  }
}())

const evt = (function () {
  return {
    click: click,
    touchstart: touchstart,
    touchend: touchend,
  }
  function click(element, n, func) {
    document.querySelectorAll(element)[n].addEventListener('click', (e) => {
      func(e)
    })
  }
  function touchstart(element, n, func) {
    document.querySelectorAll(element)[n].addEventListener('touchstart', () => {
      func()
    })
  }
  function touchend(element, n, func) {
    document.querySelectorAll(element)[n].addEventListener('touchend', () => {
      func()
    })
  }
}())

apputils.def();

const asciiutils = (function () {
  return {
    convertToAscii: convertToAscii,
  }
  function convertToAscii(src, width, height, enemyID) {
    let originalAsciiArt = [];
    const chars = ' .:-=+*%@#';

    const img = new Image();
    img.crossOrigin = "anonymous"; // 处理跨域图片
    img.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height).data;
      originalAsciiArt = [];

      for (let i = 0; i < height; i++) {
        let row = [];
        for (let j = 0; j < width; j++) {
          const index = (i * width + j) * 4;
          const r = imageData[index];
          const g = imageData[index + 1];
          const b = imageData[index + 2];
          const avg = (r + g + b) / 3;
          row.push(avg);
        }
        originalAsciiArt.push(row);
      }

      updateAsciiArt(originalAsciiArt); // 调用更新 ASCII 艺术的函数
      setInterval(() => updateAsciiArt(originalAsciiArt), 100); // 每100毫秒更新一次
    };

    img.src = src;

    function getAsciiChar(value) {
      return chars[Math.floor((value / 255) * (chars.length - 1))];
    }

    function updateAsciiArt(originalAsciiArt) {
      let asciiArt = '';
      for (let i = 0; i < originalAsciiArt.length; i++) {
        for (let j = 0; j < originalAsciiArt[i].length; j++) {
          const brightness = originalAsciiArt[i][j];
          // 引入少量随机性
          const randomBrightness = brightness + (Math.random() * 20 - 10); // 亮度值上下浮动10
          asciiArt += getAsciiChar(Math.max(0, Math.min(255, randomBrightness))); // 保证值在0到255之间
        }
        asciiArt += '\n';
      }
      if (document.getElementById('asciiArt' + enemyID)) {
        document.getElementById('asciiArt' + enemyID).textContent = asciiArt;
      }
    }
  }
}())

const scrollmousedrag = (function () {
  return {
    idrag: idrag
  };
  function idrag(id) {
    const scrollContainer = document.getElementById(id);

    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;

    scrollContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX - scrollContainer.getBoundingClientRect().left;
      startY = e.clientY - scrollContainer.getBoundingClientRect().top;
      scrollLeft = scrollContainer.scrollLeft;
      scrollTop = scrollContainer.scrollTop;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - scrollContainer.getBoundingClientRect().left - startX;
      const deltaY = e.clientY - scrollContainer.getBoundingClientRect().top - startY;
      scrollContainer.scrollLeft = scrollLeft - deltaX;
      scrollContainer.scrollTop = scrollTop - deltaY;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    /*scrollContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX - scrollContainer.getBoundingClientRect().left;
      startY = e.touches[0].clientY - scrollContainer.getBoundingClientRect().top;
      scrollLeft = scrollContainer.scrollLeft;
      scrollTop = scrollContainer.scrollTop;
    });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const deltaX = e.touches[0].clientX - scrollContainer.getBoundingClientRect().left - startX;
      const deltaY = e.touches[0].clientY - scrollContainer.getBoundingClientRect().top - startY;
      scrollContainer.scrollLeft = scrollLeft - deltaX;
      scrollContainer.scrollTop = scrollTop - deltaY;
    });

    document.addEventListener('touchend', () => {
      isDragging = false;
    });*/
  }
}())
scrollmousedrag.idrag('idrag-map');
scrollmousedrag.idrag('idrag-battle');

export { languageData, isUndo, continueBattle, userData };