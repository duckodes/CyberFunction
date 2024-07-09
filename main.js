console.log('CFO ver.0.0.0');
var language_data;
var apputils = (function () {
  return {
    def: def,
    lan: setLanguage
  }

  var isBattle = false;
  function def() {
    // set the first login num of menu
    showmenu(JSON.parse(storageutils.get('menunum', JSON.stringify(4))));

    // settings language
    fetch('lan/' + storageutils.get('apputils_lan', 'zh') + '.json')
      .then(response => response.json())
      .then(data => {
        language_data = data;
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

        document.getElementById('message').setAttribute('placeholder', language_data.lobby.enterMessage);
        document.getElementById('submit').textContent = language_data.lobby.submit;

        document.querySelector('.settings-username .f-10').textContent = data.settings.username;
        document.querySelector('.lan-now').textContent = data.settings.language.now;
        document.querySelector('.lan-zh').textContent = data.settings.language.options.zh;
        document.querySelector('.lan-en').textContent = data.settings.language.options.en;
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

        showEncyclopediaINFO(data);

        showItems(data);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });

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
      setLanguage('zh');
      document.querySelector('.lan-triangle').textContent = '▲';
      document.querySelector('.lan-options').style.display = '';
      location.reload();
    });
    document.querySelector('.lan-en').addEventListener('click', () => {
      setLanguage('en');
      document.querySelector('.lan-triangle').textContent = '▲';
      document.querySelector('.lan-options').style.display = '';
      location.reload();
    });

    // events
    evt.click('.menu-btn', 0, () => {
      showmenu(0);
      centerMapScroll();
      isBattle ? background_setup_loop.start() : background_setup_loop.stop();
    })
    evt.click('.menu-btn', 1, () => {
      showmenu(1);
      display('.e-helmet', 0, '');
      display('.e-jacket', 0, '');
      display('.e-weapon', 0, '');
      display('.e-legstrap', 0, '');
      display('.e-boots', 0, '');
      display('.e-info', 0, '');
    })
    evt.click('.menu-btn', 2, () => {
      showmenu(2);
    })
    evt.click('.menu-btn', 3, () => {
      showmenu(3);
      document.querySelector('.lobby-hint').style.display = '';
    })
    evt.click('.menu-btn', 4, () => {
      showmenu(4);
    })
    evt.click('.item-options .item-all-btn', 0, (e) => {
      if (!isBattle) {
        display('.item-all-btn', 0, 'none');
        display('.item-all-btn', 1, 'none');
        display('.item-all-btn', 2, 'none');
        display('.item-all-btn', 3, 'none');
        display('.equip', 0, 'flex');
      } else {
        e.target.textContent = language_data.item.options.cannotEquip;
        e.target.style.color = '#c24347';
        setTimeout(() => {
          e.target.innerHTML = `${language_data.item.options["0"]}`;
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

      textContent('.nav-guide', 0, '「物品百科 ITEMS ENCYCLOPEDIA」');
    })
    evt.click('.back-btn', 0, () => {
      showmenu(1);
    })
    let equip_nums = document.querySelectorAll('.equip .item-all-btn').length;
    let item_nums = 4 + equip_nums;
    // e-helmet
    evt.click('.item-all-btn', 0 + item_nums, () => {
      display('.encyclopedia', 0, '');
      display('.e-helmet', 0, 'flex');

      textContent('.nav-guide', 0, '「頭盔 HELMET」');
    })
    evt.click('.back-btn', 1, () => {
      display('.e-helmet', 0, '');
      display('.encyclopedia', 0, 'flex');

      textContent('.nav-guide', 0, '「物品百科 ITEMS ENCYCLOPEDIA」');
    })
    // e-jacket
    evt.click('.item-all-btn', 1 + item_nums, () => {
      display('.encyclopedia', 0, '');
      display('.e-jacket', 0, 'flex');

      textContent('.nav-guide', 0, '「上衣 JACKET」');
    })
    evt.click('.back-btn', 2, () => {
      display('.e-jacket', 0, '');
      display('.encyclopedia', 0, 'flex');

      textContent('.nav-guide', 0, '「物品百科 ITEMS ENCYCLOPEDIA」');
    })
    // e-weapon
    evt.click('.item-all-btn', 2 + item_nums, () => {
      display('.encyclopedia', 0, '');
      display('.e-weapon', 0, 'flex');

      textContent('.nav-guide', 0, '「武器 WEAPON」');
    })
    evt.click('.back-btn', 3, () => {
      display('.e-weapon', 0, '');
      display('.encyclopedia', 0, 'flex');

      textContent('.nav-guide', 0, '「物品百科 ITEMS ENCYCLOPEDIA」');
    })
    // e-legstrap
    evt.click('.item-all-btn', 3 + item_nums, () => {
      display('.encyclopedia', 0, '');
      display('.e-legstrap', 0, 'flex');

      textContent('.nav-guide', 0, '「腿掛 LEG STRAP」');
    })
    evt.click('.back-btn', 4, () => {
      display('.e-legstrap', 0, '');
      display('.encyclopedia', 0, 'flex');

      textContent('.nav-guide', 0, '「物品百科 ITEMS ENCYCLOPEDIA」');
    })
    // e-boots
    evt.click('.item-all-btn', 4 + item_nums, () => {
      display('.encyclopedia', 0, '');
      display('.e-boots', 0, 'flex');

      textContent('.nav-guide', 0, '「靴子 BOOTS」');
    })
    evt.click('.back-btn', 5, () => {
      display('.e-boots', 0, '');
      display('.encyclopedia', 0, 'flex');

      textContent('.nav-guide', 0, '「物品百科 ITEMS ENCYCLOPEDIA」');
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

              textContent('.nav-guide', 0, '「頭盔 HELMET」');
              break;
            case '1':
              display('.e-jacket', 0, 'flex');

              textContent('.nav-guide', 0, '「上衣 JACKET」');
              break;
            case '2':
              display('.e-weapon', 0, 'flex');

              textContent('.nav-guide', 0, '「武器 WEAPON」');
              break;
            case '3':
              display('.e-legstrap', 0, 'flex');

              textContent('.nav-guide', 0, '「腿掛 LEG STRAP」');
              break;
            case '4':
              display('.e-boots', 0, 'flex');

              textContent('.nav-guide', 0, '「靴子 BOOTS」');
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

    setTimeout(() => {
      for (var i = 0; i < document.querySelectorAll('.item-all-btn').length; i++) {
        item_btn(i);
      }
    }, 1);

    function item_btn(n) {
      evt.touchstart('.item-all-btn', n, () => {
        boxShadow('.item-all-btn', n, '3px 3px 2px #1e588d, -3px -3px 2px #1e588d');
      })
      evt.touchend('.item-all-btn', n, () => {
        boxShadow('.item-all-btn', n, '1px 1px 2px #1e588d, -1px -1px 2px #1e588d');
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
    document.body.addEventListener('click', (e) => { });
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
          c.style.border = '2px solid #3db3d050';
          c.style.borderRadius = '2px';
          c.style.fontSize = '12px';
          c.style.background = 'linear-gradient(to bottom, #3db3d045, #191325)';
          c.style.zIndex = '2';
        })
        let randomEnemiesNum = Math.floor(getRandomNumber(0, language_data.enemies.name.length));
        enemies_id = randomEnemiesNum;
        contextmenuutils.addItem(language_data.enemies.name[randomEnemiesNum], (c) => {
          c.style.background = "#3db3d050";
          c.style.color = '#3db3d0';
          c.style.textShadow = '1px 1px 5px #1e588d, 1px 1px 5px #1e588d';
        })
        contextmenuutils.addItem(language_data.map.enemies.contextmenu["0"], (c) => {
          defaultset(c);
          battleSetup(c);
        })
        contextmenuutils.addItem(language_data.map.enemies.contextmenu["1"], (c) => {
          defaultset(c);
          c.addEventListener('click', () => {
            display('.map-info', 0, 'flex');
            document.querySelector('.map-info-title').innerHTML = language_data.enemies.name[randomEnemiesNum] + '<br>' + language_data.enemies.info[randomEnemiesNum] + '<br><br>' + '\'' + language_data.map.enemies.info.chipCode + '：<br>\'' + JSON.stringify(enemies_items[enemies_id], null, 2).toUpperCase().replace(/],/g, '],<br><br>').replace(/:/g, ' >>>').replace('{', '').replace('}', '<br><br>>> SYSTEM LOAD..');
          })
        })
        function defaultset(c) {
          c.style.color = '#3db3d0';
          c.style.textShadow = '1px 1px 5px #1e588d, 1px 1px 5px #1e588d';
          c.addEventListener("click", () => {
            contextmenuutils.remove();
          });
          c.addEventListener("touchstart", () => {
            c.style.background = "#3db3d050";
          });
          c.addEventListener("touchend", () => {
            c.style.background = "";
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

        enemyRoll();
        ability_ui_update();
        update_ui_e_hp();
        background_setup_loop.start();
      })
    }
    const background_setup_loop = loop(() => {
      if (document.querySelector('.battle').style.display === '') {
        background_setup_loop.stop();
      } else {
        document.querySelector('.p5Canvas').classList.add('inout');
        cellSize = Math.floor(Math.random() * 10) + 10;
        wireLength = Math.floor(Math.random() * 15) + 15;
        console.log(cellSize + ':' + wireLength);
        recreate();
        setTimeout(() => {
          document.querySelector('.p5Canvas').classList.remove('inout');
        }, 3000);
      }
    }, 5000);

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
      ability_set('.battle-legstrap', 4);
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
      innerHTML('.battle-enemy-box', n, `<div style="font-size: 10px;background: #1e588d;display:flex;justify-content:center;width:100%;">${e_get_def_status[n1].replace('N/A', '').replace('%DEF', ' ⛨')}${e_get_rd_status[n1].replace('N/A', '').replace('%RD', ' ✙')}</div><div style="color: #c24347;text-shadow: 1px 1px 5px #000, 1px 1px 5px #000;background: linear-gradient(to right, #551913, #c24347aa, #551913);"><sup>${n1 === 0 ? language_data.item.equip.helmet : n1 === 1 ? language_data.item.equip.jacket : n1 === 2 ? language_data.item.equip.leftWeapon : n1 === 3 ? language_data.item.equip.rightWeapon : n1 === 4 ? language_data.item.equip.legStrap : n1 === 5 ? language_data.item.equip.boots : ''}</sup> ${e_get_dmg[n1]}<sub>%</sub><sub style="font-size: 10px;color: #f7d967;">〚${e_get_dmg_status[n1] === 'N/A' ? '⛶' : e_get_dmg_status[n1] + ' 🩸'}〛</sub></div>`);
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
    let equip_data = JSON.parse(storageutils.get('equip_data', JSON.stringify([0, -1, -1, 1, -1, -1])));
    equipItem();
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
                document.querySelector('.reroll div').innerHTML = '&#62; ' + language_data.battle.reroll;
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
          textContent('.roll', 0, language_data.battle.loadChip["0"]);
          break;
        case 1:
          textContent('.roll', 0, language_data.battle.loadChip["1"]);
          break;
        case 0:
          textContent('.roll', 0, language_data.battle.start);
          break;
        default:
      }
    }
    evt.click('.reroll', 0, () => {
      // reroll();
    });
    function reroll() {
      if (rolltimes < 2) {
        reset_val_reroll();
        if (document.querySelector('.force-start-btn')) {
          document.querySelector('.force-start-btn').remove();
        }
        rolltimes = 2;
      }
      update_rolltimes_btn();
    }
    evt.click('.roll', 0, () => {
      if (checkArr(battle_arr_data, 'N/A')) {
        StartRoll();
      } else {
        document.querySelector('.roll').style.color = '#c24347';
        textContent('.roll', 0, language_data.battle.noLoad);
        setTimeout(() => {
          document.querySelector('.roll').style.color = '';
          update_rolltimes_btn();
        }, 1000);
        if (!document.querySelector('.force-start-btn')) {
          createDIV('force-start-btn', language_data.battle.skip, document.querySelector('.roll-container'), (b) => {
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
          if (document.querySelector('.force-start-btn')) {
            document.querySelector('.force-start-btn').remove();
          }
          rolltimes--;
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
                document.getElementById('asciiArt' + enemies_id).style.color = 'red';
                document.getElementById('asciiArt' + enemies_id).style.marginLeft = getRandomNumber(0, 50) + 'px';
                document.getElementById('asciiArt' + enemies_id).style.marginTop = getRandomNumber(0, 50) + 'px';
                setTimeout(() => {
                  document.getElementById('asciiArt' + enemies_id).style.marginLeft = getRandomNumber(-20, -50) + 'px';
                  document.getElementById('asciiArt' + enemies_id).style.marginTop = getRandomNumber(-20, -50) + 'px';
                  setTimeout(() => {
                    document.getElementById('asciiArt' + enemies_id).style.marginLeft = getRandomNumber(0, 10) + 'px';
                    document.getElementById('asciiArt' + enemies_id).style.marginTop = getRandomNumber(0, 10) + 'px';
                  }, 200);
                }, 200);
                setTimeout(() => {
                  document.getElementById('asciiArt' + enemies_id).style.color = '#0000';
                  document.getElementById('asciiArt' + enemies_id).style.marginLeft = '';
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
            enemyRoll();
            update_ui_e_hp();
            display('.roll', 0, '');
            display('.reroll', 0, '');
            display('.battle-exit', 0, '');
          }, 1500);

          // GAME OVER
          if (get_dmg[0] >= 10
            || get_dmg[1] >= 10
            || get_dmg[0] === -1 && get_dmg[1] === -1 && get_dmg[2] === -1 && get_dmg[3] === -1 && get_dmg[4] === -1 && get_dmg[5] === -1) {
            innerHTML('.gameover-border', 0, '<div style="color: #c24347;">DEFEAT</div>');
            innerHTML('.gameover-info', 0, `<div style="color: #c24347;font-family: SdglitchdemoRegular-YzROj, CyberwarRegular-7BX0E;">REPAIR COSTS: ${get_dmg.reduce((accumulator, currentValue) => accumulator + (currentValue !== -1 ? currentValue : 0), 0) * -3} BTC.</div>`);
            gameover();
            display('.gameover', 0, 'flex');
          }
          if (e_get_dmg[0] >= 10 || e_get_dmg[1] >= 10) {
            innerHTML('.gameover-border', 0, '<div style="color: #f7d967;">VICTORY</div>');
            innerHTML('.gameover-info', 0, `<div style="color: #f7d967;">AUTOMATIC REPAIRS FREE OF CHARGE.<br>REWARD:</div>`);
            gameover();
            display('.gameover', 0, 'flex');
          }
        }
        update_rolltimes_btn();
      }
    });
    function gameover() {
      isBattle = false;
      showmenu(0);
      enemies_id = -1;
      get_dmg = [checkArr(item_data.helmet, 'N/A') ? -1 : 0, checkArr(item_data.jacket, 'N/A') ? -1 : 0, checkArr(item_data.lweapon, 'N/A') ? -1 : 0, checkArr(item_data.rweapon, 'N/A') ? -1 : 0, checkArr(item_data.legstrap, 'N/A') ? -1 : 0, checkArr(item_data.boots, 'N/A') ? -1 : 0];
      get_dmg_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
      get_def_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
      get_rd_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
      e_get_dmg = [0, 0, 0, 0, 0, 0]
      e_get_dmg_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
      e_get_def_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
      e_get_rd_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
      if (document.querySelector('.force-start-btn')) {
        document.querySelector('.force-start-btn').remove();
      }
    }
    evt.click('.battle-exit', 0, () => {
      display('.gameover', 0, 'flex');
      innerHTML('.gameover-border', 0, '<div style="color: #c24347;">ESCAPE</div>');
      innerHTML('.gameover-info', 0, `<div style="color: #c24347;font-family: SdglitchdemoRegular-YzROj, CyberwarRegular-7BX0E;">YOU HAVE FLED THE BATTLEFIELD. <br>PUNISHMENT: ${get_dmg.reduce((accumulator, currentValue) => accumulator + (currentValue !== -1 ? currentValue : 0), 0) * -5} BTC.</div>`);
      gameover();
      rolltimes = 2;
      update_rolltimes_btn();
      battle_arr_data = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
      ability_ui_update();
    });

    function parseIntOrDefault(value, defaultValue) {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    function save_equipdata(n, n1) {
      equip_data[n] = n1;
      storageutils.set('equip_data', JSON.stringify(equip_data));
      equipItem();
      get_dmg = [checkArr(item_data.helmet, 'N/A') ? -1 : 0, checkArr(item_data.jacket, 'N/A') ? -1 : 0, checkArr(item_data.lweapon, 'N/A') ? -1 : 0, checkArr(item_data.rweapon, 'N/A') ? -1 : 0, checkArr(item_data.legstrap, 'N/A') ? -1 : 0, checkArr(item_data.boots, 'N/A') ? -1 : 0];
      dmg_ui_update();
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
    let get_dmg_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
    let get_def_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
    let get_dmg = [checkArr(item_data.helmet, 'N/A') ? -1 : 0, checkArr(item_data.jacket, 'N/A') ? -1 : 0, checkArr(item_data.lweapon, 'N/A') ? -1 : 0, checkArr(item_data.rweapon, 'N/A') ? -1 : 0, checkArr(item_data.legstrap, 'N/A') ? -1 : 0, checkArr(item_data.boots, 'N/A') ? -1 : 0];
    let get_rd_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
    let e_get_dmg_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
    let e_get_def_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
    let e_get_dmg = [0, 0, 0, 0, 0, 0];
    let e_get_rd_status = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
    function enemyRoll() {
      switch (enemies_id) {
        case 0:
          document.querySelector('.enemy-ui-hp-base').style.background = '#3db3d0';
          innerHTML('.battle-enemy', 0, `<div class="battle-enemies-name" style="font-size: 16px;color: #3db3d0;">${language_data.enemies.name[enemies_id]}</div><div class="battle-enemy-box" style="margin-top: 50px;margin-left: 35px;"></div><pre id="asciiArt${enemies_id}" style="height: 200px;display:flex;justify-content:center;align-items:center;font-family: monospace;white-space: pre;line-height: 1;font-size: 6px;color: #3db3d0;opacity: 0.5;transition: all 500ms ease-in;"></pre><div class="battle-enemy-box" style="margin-top: 20px;margin-left: 70px;"></div>`);
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

          console.log(e_get_dmg_status);
          console.log(e_get_def_status);
          console.log(e_get_dmg);
          break;
        case 1:
          document.querySelector('.enemy-ui-hp-base').style.background = '#f7d967';
          innerHTML('.battle-enemy', 0, `<div class="battle-enemies-name" style="font-size: 16px;color: #f7d967;">${language_data.enemies.name[enemies_id]}</div><div class="battle-enemy-box" style="margin-top: 50px;margin-left: 35px;"></div><pre id="asciiArt${enemies_id}" style="height: 200px;display:flex;justify-content:center;align-items:center;font-family: monospace;white-space: pre;line-height: 1;font-size: 5px;color: #f7d967;opacity: 0.5;transition: all 500ms ease-in;"></pre><div class="battle-enemy-box" style="margin-left: 70px;"></div>`);
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

          console.log(e_get_dmg_status);
          console.log(e_get_def_status);
          console.log(e_get_dmg);
          break;
        case 2:
          document.querySelector('.enemy-ui-hp-base').style.background = '#4b7e3f';
          innerHTML('.battle-enemy', 0, `<div class="battle-enemies-name" style="font-size: 16px;color: #4b7e3f;">${language_data.enemies.name[enemies_id]}</div><div class="battle-enemy-box" style="margin-top: 50px;margin-left: 35px;"></div><pre id="asciiArt${enemies_id}" style="height: 200px;display:flex;justify-content:center;align-items:center;font-family: monospace;white-space: pre;line-height: 1;font-size: 4px;color: #f7d967;opacity: 0.5;transition: all 500ms ease-in;"></pre>`);
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

          console.log(e_get_dmg_status);
          console.log(e_get_def_status);
          console.log(e_get_dmg);
          break;
        case 3:
          document.querySelector('.enemy-ui-hp-base').style.background = '#b74e6a';
          innerHTML('.battle-enemy', 0, `<div class="battle-enemies-name" style="font-size: 16px;color: #b74e6a;">${language_data.enemies.name[enemies_id]}</div><div class="battle-enemy-box" style="margin-top: 50px;margin-left: 35px;"></div><pre id="asciiArt${enemies_id}" style="height: 200px;display:flex;justify-content:center;align-items:center;font-family: monospace;white-space: pre;line-height: 1;font-size: 12px;color: #b74e6a;opacity: 0.5;transition: all 500ms ease-in;"></pre><div class="battle-enemy-box" style="margin-bottom: 70px;margin-left: 70px;"></div><div class="battle-enemy-box" style="margin-top: -120px;margin-right: 250px;"></div>`);
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

          console.log(e_get_dmg_status);
          console.log(e_get_def_status);
          console.log(e_get_dmg);
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
    })
    evt.click('.battle-me-box', 5, () => {
      setHCtrlPTE(5);
    })
    function setHCtrlPTE(c) {
      if (battle_arr_data[c] !== 'N/A' || get_dmg[c] !== -1) {
        if (hctrl_p_to_e === -1) {
          hctrl_p_to_e = c;
          setcolor(c);
          get_hctrl = -1;
        } else {
          setTimeout(() => {
            hctrl_p_to_e = -1;
          }, 200);
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
    function equipItem() {
      // helmet
      switch (JSON.parse(storageutils.get('equip_data', JSON.stringify(equip_data)))[0]) {
        case -1:
          setItemData(item_data.helmet, 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A');
          break;
        case 0:
          setItemData(item_data.helmet, '1%DEF', '1%RD', '1%DEF', '1%RD', '1%DEF', '1%RD');
          break;

        default:
        // Tab to edit
      }
      // jacket
      switch (JSON.parse(storageutils.get('equip_data', JSON.stringify(equip_data)))[1]) {
        case -1:
          setItemData(item_data.jacket, 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A');
          break;

        default:
        // Tab to edit
      }
      // lweapon
      switch (JSON.parse(storageutils.get('equip_data', JSON.stringify(equip_data)))[2]) {
        case -1:
          setItemData(item_data.lweapon, 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A');
          break;

        default:
        // Tab to edit
      }
      // rweapon
      switch (JSON.parse(storageutils.get('equip_data', JSON.stringify(equip_data)))[3]) {
        case -1:
          setItemData(item_data.rweapon, 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A');
          break;
        case 1:
          setItemData(item_data.rweapon, '1%DMG', '1%DMG', '1%DMG', '1%DMG', '1%DMG', '1%DMG')
          break;

        default:
        // Tab to edit
      }
      // legstrap
      switch (JSON.parse(storageutils.get('equip_data', JSON.stringify(equip_data)))[4]) {
        case -1:
          setItemData(item_data.legstrap, 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A');
          break;
        default:
        // Tab to edit
      }
      // boots
      switch (JSON.parse(storageutils.get('equip_data', JSON.stringify(equip_data)))[5]) {
        case -1:
          setItemData(item_data.boots, 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A');
          break;

        default:
        // Tab to edit
      }
    }

    let own_equipment =
      JSON.parse(storageutils.get('own_equipment', JSON.stringify({
        helmet: [0],
        jacket: [],
        lweapon: [],
        rweapon: [1],
        legstrap: [],
        boots: [],
      })));
    // get new award use this
    function save_ownEquipment(t, item_id) {
      t.push(item_id);
      storageutils.set('own_equipment', JSON.stringify(own_equipment));
    }

    function showItems(languageData) {
      for (var i = 0; i < own_equipment.helmet.length; i++) {
        switch (own_equipment.helmet[i]) {
          case 0:
            createDIV('item-all-btn', languageData.item.equipment.helmet["0"], document.querySelectorAll('.equip .color-0')[0], (b) => {
              itemOption(b, 0, own_equipment.helmet[i]);
            });
            break;

          default:
          // Tab to edit
        }
      }
      for (var i = 0; i < own_equipment.jacket.length; i++) {
        switch (own_equipment.jacket[i]) {
          case 0:
            createDIV('item-all-btn', languageData.item.equipment.jacket["0"], document.querySelectorAll('.equip .color-0')[1], (b) => {
              itemOption(b, 1, own_equipment.jacket[i]);
            });
            break;

          default:
          // Tab to edit
        }
      }
      for (var i = 0; i < own_equipment.lweapon.length; i++) {
        switch (own_equipment.lweapon[i]) {
          case 0:
            createDIV('item-all-btn', languageData.item.equipment.weapon["0"], document.querySelectorAll('.equip .color-0')[2], (b) => {
              itemOption(b, 2, own_equipment.lweapon[i]);
            });
            break;
          case 1:
            createDIV('item-all-btn', languageData.item.equipment.weapon["1"], document.querySelectorAll('.equip .color-0')[2], (b) => {
              itemOption(b, 2, own_equipment.lweapon[i]);
            });
            break;
          case 2:
            createDIV('item-all-btn', languageData.item.equipment.weapon["2"], document.querySelectorAll('.equip .color-0')[2], (b) => {
              itemOption(b, 2, own_equipment.lweapon[i]);
            });
            break;
          case 3:
            createDIV('item-all-btn', languageData.item.equipment.weapon["3"], document.querySelectorAll('.equip .color-0')[2], (b) => {
              itemOption(b, 2, own_equipment.lweapon[i]);
            });
            break;
          case 4:
            createDIV('item-all-btn', languageData.item.equipment.weapon["4"], document.querySelectorAll('.equip .color-0')[2], (b) => {
              itemOption(b, 2, own_equipment.lweapon[i]);
            });
            break;

          default:
          // Tab to edit
        }
      }
      for (var i = 0; i < own_equipment.rweapon.length; i++) {
        switch (own_equipment.rweapon[i]) {
          case 0:
            createDIV('item-all-btn', languageData.item.equipment.weapon["0"], document.querySelectorAll('.equip .color-0')[3], (b) => {
              itemOption(b, 3, own_equipment.rweapon[i]);
            });
            break;
          case 1:
            createDIV('item-all-btn', languageData.item.equipment.weapon["1"], document.querySelectorAll('.equip .color-0')[3], (b) => {
              itemOption(b, 3, own_equipment.rweapon[i]);
            });
            break;
          case 2:
            createDIV('item-all-btn', languageData.item.equipment.weapon["2"], document.querySelectorAll('.equip .color-0')[3], (b) => {
              itemOption(b, 3, own_equipment.rweapon[i]);
            });
            break;
          case 3:
            createDIV('item-all-btn', languageData.item.equipment.weapon["3"], document.querySelectorAll('.equip .color-0')[3], (b) => {
              itemOption(b, 3, own_equipment.rweapon[i]);
            });
            break;
          case 4:
            createDIV('item-all-btn', languageData.item.equipment.weapon["4"], document.querySelectorAll('.equip .color-0')[3], (b) => {
              itemOption(b, 3, own_equipment.rweapon[i]);
            });
            break;

          default:
          // Tab to edit
        }
      }
      for (var i = 0; i < own_equipment.legstrap.length; i++) {
        switch (own_equipment.legstrap[i]) {
          case 0:
            createDIV('item-all-btn', languageData.item.equipment.legstrap["0"], document.querySelectorAll('.equip .color-0')[4], (b) => {
              itemOption(b, 4, own_equipment.legstrap[i]);
            });
            break;
          case 1:
            createDIV('item-all-btn', languageData.item.equipment.legstrap["1"], document.querySelectorAll('.equip .color-0')[4], (b) => {
              itemOption(b, 4, own_equipment.legstrap[i]);
            });
            break;

          default:
          // Tab to edit
        }
      }
      for (var i = 0; i < own_equipment.boots.length; i++) {
        switch (own_equipment.boots[i]) {
          case 0:
            createDIV('item-all-btn', languageData.item.equipment.boots["0"], document.querySelectorAll('.equip .color-0')[5], (b) => {
              itemOption(b, 5, own_equipment.boots[i]);
            });
            break;

          default:
          // Tab to edit
        }
      }
    }
    function itemOption(b, n, item_id) {
      function getElementIndex(element) {
        let index = 0;
        while ((element = element.previousElementSibling) != null) {
          index++;
        }
        return index;
      }
      update_equip_color(b, n, item_id);
      b.addEventListener('click', (e) => {
        contextmenuutils.init(document.body, (b2, c) => {
          ToMouse(c);
          c.style.border = '2px solid #3db3d050';
          c.style.borderRadius = '2px';
          c.style.fontSize = '12px';
          c.style.background = 'linear-gradient(to bottom, #3db3d045, #191325)';
        })
        if (equip_data[n] === item_id) {
          contextmenuutils.addItem('卸除', (c) => {
            defaultset(c);
            c.addEventListener("click", () => {
              save_equipdata(n, -1);
              update_equip_color(b, n, item_id);
            })
          })
        } else {
          contextmenuutils.addItem('裝備', (c) => {
            defaultset(c);
            c.addEventListener("click", () => {
              save_equipdata(n, item_id);
              update_equip_color(b, n, item_id);
            })
          })
        }
        function defaultset(c) {
          c.style.color = '#3db3d0';
          c.style.textShadow = '1px 1px 5px #1e588d, 1px 1px 5px #1e588d';
          c.addEventListener("click", () => {
            contextmenuutils.remove();
          });
          c.addEventListener("touchstart", () => {
            c.style.background = "#3db3d050";
          });
          c.addEventListener("touchend", () => {
            c.style.background = "";
          });
        }

        function ToMouse(c) {
          c.style.left = (e.pageX) + "px";
          c.style.top = (e.pageY) + "px";
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

    initEnemy();
    update();
  }

  function showmenu(n) {
    storageutils.set('menunum', JSON.stringify(n));
    switch (n) {
      case 0:
        if (!isBattle) {
          display('.battle', 0, '');
          display('.map', 0, 'flex');
          display('.item', 0, '');
          display('.stat', 0, '');
          display('.lobby', 0, '');
          display('.settings', 0, '');

          document.querySelectorAll('.menu-btn')[0].querySelector('svg').setAttribute('fill', '#7ea4c1');
          document.querySelectorAll('.menu-btn')[1].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[2].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[3].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[4].querySelector('svg').setAttribute('fill', '#9ce0ff70');

          textShadow('.menu-btn', 0, '1px 1px 5px #bec4e1, 1px 1px 5px #4ec4e1');
          textShadow('.menu-btn', 1, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 2, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 3, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 4, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');

          textContent('.nav-guide', 0, '「地圖 MAP」');
        } else {
          display('.battle', 0, 'flex');
          display('.map', 0, '');
          display('.item', 0, '');
          display('.stat', 0, '');
          display('.lobby', 0, '');
          display('.settings', 0, '');

          document.querySelectorAll('.menu-btn')[0].querySelector('svg').setAttribute('fill', '#7ea4c1');
          document.querySelectorAll('.menu-btn')[1].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[2].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[3].querySelector('svg').setAttribute('fill', '#9ce0ff48');
          document.querySelectorAll('.menu-btn')[4].querySelector('svg').setAttribute('fill', '#9ce0ff70');

          textShadow('.menu-btn', 0, '1px 1px 5px #bec4e1, 1px 1px 5px #4ec4e1');
          textShadow('.menu-btn', 1, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 2, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 3, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
          textShadow('.menu-btn', 4, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');

          textContent('.nav-guide', 0, '「戰鬥 BATTLE」');
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
        document.querySelectorAll('.menu-btn')[1].querySelector('svg').setAttribute('fill', '#7ea4c1');
        document.querySelectorAll('.menu-btn')[2].querySelector('svg').setAttribute('fill', '#9ce0ff48');
        document.querySelectorAll('.menu-btn')[3].querySelector('svg').setAttribute('fill', '#9ce0ff48');
        document.querySelectorAll('.menu-btn')[4].querySelector('svg').setAttribute('fill', '#9ce0ff70');

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

        textContent('.nav-guide', 0, '「物品 ITEM」');
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
        document.querySelectorAll('.menu-btn')[2].querySelector('svg').setAttribute('fill', '#7ea4c1');
        document.querySelectorAll('.menu-btn')[3].querySelector('svg').setAttribute('fill', '#9ce0ff48');
        document.querySelectorAll('.menu-btn')[4].querySelector('svg').setAttribute('fill', '#9ce0ff70');

        textShadow('.menu-btn', 0, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
        textShadow('.menu-btn', 1, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
        textShadow('.menu-btn', 2, '1px 1px 5px #bec4e1, 1px 1px 5px #4ec4e1');
        textShadow('.menu-btn', 3, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
        textShadow('.menu-btn', 4, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');

        textContent('.nav-guide', 0, '「狀態 STATE」');
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
        document.querySelectorAll('.menu-btn')[3].querySelector('svg').setAttribute('fill', '#7ea4c1');
        document.querySelectorAll('.menu-btn')[4].querySelector('svg').setAttribute('fill', '#9ce0ff70');

        textShadow('.menu-btn', 0, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
        textShadow('.menu-btn', 1, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
        textShadow('.menu-btn', 2, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
        textShadow('.menu-btn', 3, '1px 1px 5px #bec4e1, 1px 1px 5px #4ec4e1');
        textShadow('.menu-btn', 4, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');

        textContent('.nav-guide', 0, '「大廳 Lobby」');
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
        document.querySelectorAll('.menu-btn')[4].querySelector('svg').setAttribute('fill', '#8fb5d2');

        textShadow('.menu-btn', 0, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
        textShadow('.menu-btn', 1, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
        textShadow('.menu-btn', 2, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
        textShadow('.menu-btn', 3, '1px 1px 5px #3db3d0, 1px 1px 5px #c24347');
        textShadow('.menu-btn', 4, '1px 1px 5px #bec4e1, 1px 1px 5px #4ec4e1');

        textContent('.nav-guide', 0, '「設定 Settings」');
        break;
      default:
        break;
    }
  }
  function createDIV(classname, textContent, parent, func) {
    const div = document.createElement('DIV');
    div.className = classname;
    div.textContent = textContent;
    parent.appendChild(div);
    func(div);
  }
  function checkArr(arr, tar) {
    // 使用 every() 方法來檢查每個元素是否都是 tar
    return arr.every(element => element === tar);
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
  function boxShadow(element, n, style) {
    document.querySelectorAll(element)[n].style.boxShadow = style;
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
    storageutils.set('enemies-m-left' + i, document.querySelectorAll('.map-enemies')[i].style.marginLeft);
    storageutils.set('enemies-m-top' + i, document.querySelectorAll('.map-enemies')[i].style.marginTop);
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
          console.log('Loop started');
        }
      },
      stop: () => {
        if (timerId) {
          clearInterval(timerId);
          timerId = null;
          console.log('Loop stopped');
        }
      }
    };
  }
  function setLanguage(lan) {
    switch (lan) {
      case 'zh':
        storageutils.set('apputils_lan', 'zh');
        break;
      case 'en':
        storageutils.set('apputils_lan', 'en');
        break;

      default:
        break;
    }
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
function cls() {
  localStorage.clear();
}

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