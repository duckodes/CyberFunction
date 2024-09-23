import { userData, continueBattle, isUndo, languageData } from "../main.js";
import { updateCSSVariable, getCSSVariable } from "./cssvar.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, query, limitToFirst, limitToLast, push, onChildAdded, onChildChanged, onChildRemoved, set, child, remove, get, onDisconnect, serverTimestamp, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD1HnXKHrNIsSGJo7KaooVtZYbowuHR8uo",
    authDomain: "source-c3817.firebaseapp.com",
    databaseURL: "https://source-c3817-default-rtdb.firebaseio.com",
    projectId: "source-c3817",
    storageBucket: "source-c3817.appspot.com",
    messagingSenderId: "262948457201",
    appId: "1:262948457201:web:bae1b685432d4bed84b750"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getDatabase();

// ref
const lobbyRef = ref(db, 'lobby');
const limitlobbyRef = query(lobbyRef, limitToLast(10));

// element
const sign_container = document.querySelector('.sign-container');
const account = document.querySelector('.account');
const password = document.querySelector('.password');
const sign_switcher = document.querySelector('.sign-switcher');
const sign_action = document.querySelector('.sign-action');
const sign_google = document.querySelector('.sign-google');
const canvas = document.querySelector('.canvas');
const lobby = document.querySelector('.lobby');
const messages = document.getElementById("messages");
const message = document.getElementById("message");
const submit = document.getElementById("submit");
const logout = document.querySelector('.logout');
const username_update = document.querySelector('.username-update');
const settings_username_input = document.querySelector('.settings-username input[type=text]');
const nav_username = document.querySelector('.nav-username');

// var
let sign_status = false;

// set language
auth.useDeviceLanguage();

// google auth
const userSignInGoogle = async () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)

            UpdateProfile(auth.currentUser.email.replace(/@.*?(?=@|$)/g, ''));
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
}

// event
sign_google.addEventListener("click", userSignInGoogle);
sign_action.addEventListener("click", () => {
    sign_status ? createUser() : signIn();
});
sign_switcher.addEventListener("click", () => {
    if (!sign_status) {
        sign_switcher.textContent = 'Login';
        sign_action.textContent = 'Create';
        sign_status = true;
    } else {
        sign_switcher.textContent = 'Register';
        sign_action.textContent = 'Login';
        sign_status = false;
    }
});
message.addEventListener("focus", () => {
    message.setAttribute('placeholder', languageData.data.lobby.enterMessage);
    message.style.setProperty('--message-placeholder-color', '');
    message.style.setProperty('--message-placeholder-opacity', '0.5');
});
submit.addEventListener("click", () => {
    sendMessage();
});
document.body.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        if (document.querySelector('.sign-action')) {
            sign_status ? createUser() : signIn();
        } else if (lobby.style.display === 'flex') {
            sendMessage();
        }
    }
});
settings_username_input.addEventListener("input", () => {
    if (auth.currentUser.displayName !== settings_username_input.value) {
        username_update.style.display = 'flex';
    } else {
        username_update.style.display = '';
    }
});
username_update.addEventListener("click", () => {
    UpdateProfile(settings_username_input.value);
    username_update.style.display = '';
});
logout.addEventListener("click", () => {
    signOutUser();
});

// show user profile data
const parameterID = getParameterByName('pid', location.href);
if (parameterID !== null && parameterID !== '') {
    showProfile(parameterID);
    history.pushState({}, '', '/');
}
function showProfile(userID) {
    get(ref(db, `public/${userID}`)).then((snapshot) => {
        if (snapshot.exists()) {
            document.querySelector('.profile-id').onclick = () => {
                document.querySelector('.profile-id').innerHTML = '';
                document.querySelector('.profile-id').style.display = '';
            };
            document.querySelector('.profile-id').innerHTML += `
              <div>${snapshot.val().profile.username}</div>
              <div>BTC: ${snapshot.val().wallet.btc}</div>
              <div>ETH: ${snapshot.val().wallet.eth}</div>
              <div>${typeof (snapshot.val().status) === "string" ? "<span style='color: green;'>●</span>" + snapshot.val().status : "<span style='color: red;'>●</span>" + ToAMPMYMD(snapshot.val().status)}</div>
              <div class="close-btn">&times;</div>`;
            document.querySelector('.profile-id').style.display = 'flex';
        }
    }).catch((error) => {
        console.error(error);
    });
}

// check if login
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        // check single device
        set(ref(db, `public/${uid}/device`), generateDeviceId());
        onValue(ref(db, `public/${uid}/device`), (snap) => {
            if (snap.val() !== generateDeviceId()) {
                confirmLoop(languageData.data.singledevice, () => {
                    signOut(auth).then(() => {
                        location.reload();
                    }).catch((error) => {
                        console.log(error);
                    });
                });
            }
        });

        // Update user connection
        set(ref(db, `public/${uid}/status`), 'online');
        onDisconnect(ref(db, `public/${uid}/status`)).set(serverTimestamp());

        // setup
        JsBarcode("#barcode", uid, {
            format: "CODE128",
            fontSize: 12,
            font: "Arial",
            lineColor: "#bcfff999",
            background: 'transparent',
            width: 1,
            height: 40,
            displayValue: true
        });
        new QRCode(document.getElementById('qrcode'), {
            text: truncateAfterLastSlash(location.href) + '?pid=' + uid,
            width: 128,
            height: 128,
            colorDark: '#bcfff999',
            colorLight: 'transparent',
        });

        sign_container.remove();
        canvas.style.display = 'block';

        settings_username_input.value = user.displayName;
        nav_username.innerHTML = `${user.displayName}<br><div class="f-10 en-set"></div>`;

        // user private data
        const authRef = ref(db, `auth/${uid}`);
        get(authRef).then((snapshot) => {
            if (snapshot.exists()) {
                userData.data = snapshot.val().data;
            } else {
                //set default user data
                set(authRef, {
                    data: {
                        wallet: {
                            btc: 0,
                            eth: 0,
                        },
                        ownitems: {
                            helmet: [0],
                            jacket: [-1],
                            lweapon: [-1],
                            rweapon: [1],
                            legstrap: [-1],
                            boots: [-1]
                        },
                        equipment: [0, -1, -1, 1, -1, -1],
                        dragdrop: {
                            colrow: [1, 1],
                            arr: [-1],
                            str: [''],
                            pos: [[0, 0], [0, 0]],
                            bgc: ['#a005', '#a005'],
                            opy: ['0.5', '0.5']
                        },
                        language: 'zh',
                        menu: 4
                    }
                });
                get(authRef).then(snapshot => {
                    snapshot ? userData.data = snapshot.val().data : null;
                }).catch((error) => {
                    console.error(error);
                });
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
        userData.on('change', value => {
            checkToken(user);
            set(authRef, {
                data: value
            });

            // user public data
            set(ref(db, `public/${uid}/wallet`), {
                btc: value.wallet.btc,
                eth: value.wallet.eth
            });

            // Update user connection
            get(ref(db, `public/${uid}`)).then(snapshot => {
                if (snapshot.val().status !== 'online') {
                    set(ref(db, `public/${uid}/status`), 'online');
                    onDisconnect(ref(db, `public/${uid}/status`)).set(serverTimestamp());
                }
            }).catch((error) => {
                console.error(error);
            });
        });
        languageData.on('change', updateMessage);

        // is battle ?
        const battleRef = ref(db, `battle/${uid}`);
        get(battleRef).then((snapshot) => {
            if (snapshot.exists()) {
                continueBattle.data = snapshot.val().data;
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
        continueBattle.on('change', value => {
            set(battleRef, {
                data: value
            });
        });
        isUndo.on('change', value => {
            get(battleRef).then((snapshot) => {
                if (snapshot.exists()) {
                    continueBattle.data = snapshot.val().data;
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
        });

        // console.log(user);
    } else {
        // User is signed out
    }
});

// use login function
function signIn() {
    signInWithEmailAndPassword(auth, account.value, password.value)
        .then((userCredential) => {
            const user = userCredential.user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
        });
}
function createUser() {
    createUserWithEmailAndPassword(auth, account.value, password.value)
        .then((userCredential) => {
            UpdateProfile(userCredential.user.email.replace(/@.*?(?=@|$)/g, ''));
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
        });
}
function signOutUser() {
    set(ref(db, `public/${auth.currentUser.uid}/status`), serverTimestamp());
    signOut(auth).then(() => {
        location.reload();
    }).catch((error) => {
        console.log(error);
    });
}
function UpdateProfile(displayName) {
    updateProfile(auth.currentUser, {
        displayName: displayName
    }).then(() => {
        // Profile updated!
        // user public data
        set(ref(db, `public/${auth.currentUser.uid}/profile`), {
            username: auth.currentUser.displayName,
        });

        settings_username_input.value = auth.currentUser.displayName;
        nav_username.innerHTML = `${auth.currentUser.displayName}<br><div class="f-10 en-set">${languageData.data?.nav.username}</div>`;
        console.log('Profile updated!');

        // ...
    }).catch((error) => {
        // An error occurred
        // ...
        console.log(error);
    });
}

// use message function
function updateMessage() {
    // Listen on child List
    onChildAdded(limitlobbyRef, (snapshot) => {
        const data = snapshot.val();
        if (lobby.style.display !== 'flex') {
            document.querySelector('.lobby-hint').style.display = 'flex';
        }

        if (data.uid !== auth.currentUser.uid) {
            messages.innerHTML += `
          <div id='${snapshot.key}'>
            <div class="msg-id">${data.who}</div>
            <div class="msg-row">
              <div class="msg-msg"></div>
              <div class="msg-report">⚠︎</div>
            </div>
            <div class="msg-time">${ToAMPMYMD(data.time)}</div>
          </div>`;
        } else {
            messages.innerHTML += `
          <div id='${snapshot.key}'>
            <div class="msg-id">*${data.who}</div>
            <div class="msg-row">
              <div class="msg-msg"></div>
              <div class="msg-del">␐</div>
            </div>
            <div class="msg-time">${ToAMPMYMD(data.time)}</div>
          </div>`;
        }
        updateCSSVariable('css/root.css', '--' + snapshot.key, data.uid);
        document.querySelectorAll(`.msg-id`).forEach(element => {
            element.addEventListener('click', (e) => {
                contextmenuutils.init(document.querySelector('.lobby'), (b, c) => {
                    ToMouse(c);
                })
                contextmenuutils.addItem(languageData.data.footer.menuBtnText["2"], (c) => {
                    defaultset(c);
                })
                function defaultset(c) {
                    c.addEventListener('click', () => {
                        checkToken(auth.currentUser);
                        showProfile(getCSSVariable('css/root.css', '--' + element.parentElement.id));
                        contextmenuutils.remove();
                    });
                }
                function ToMouse(c) {
                    c.style.left = (e.pageX) + 'px';
                    c.style.top = (e.pageY) + 'px';
                }
            });
        });
        document.querySelector(`#${snapshot.key} .msg-row .msg-msg`).textContent = data.message;
        document.querySelector(`#${snapshot.key} .msg-row .msg-msg`).style.color = data.color;
        document.querySelectorAll(".msg-del").forEach(element => {
            element.addEventListener("click", () => {
                remove(child(lobbyRef, element.parentElement.parentElement.id));
            });
        });
        document.querySelectorAll('.msg-report').forEach(element => {
            element.addEventListener("click", () => {
                if (window.confirm(languageData.data.lobby.report)) {
                    get(ref(db, `lobby/${element.parentElement.parentElement.id}`)).then((snapshot) => {
                        set(ref(db, `report/${snapshot.key}`), snapshot.val());
                    })
                }
            });
        });
    });
    onChildRemoved(limitlobbyRef, (snapshot) => {
        document.getElementById(snapshot.key).innerHTML = `<svg id="barcode${snapshot.key}"></svg>`;
        JsBarcode("#barcode" + snapshot.key, '>>> SYSTEM DELETE ' + snapshot.key, {
            format: "CODE128",
            fontSize: document.getElementById(snapshot.key).parentElement.clientWidth / 30,
            font: "Arial",
            lineColor: "#bcfff999",
            background: 'transparent',
            width: document.getElementById(snapshot.key).parentElement.clientWidth / 500,
            height: 20,
            displayValue: true
        });
        remove(child(lobbyRef, snapshot.key));
        setTimeout(() => {
            document.getElementById(snapshot.key).remove();
        }, 2000);
    });
}
function setMessageData(value) {
    set(push(lobbyRef), {
        time: Date.now(),
        uid: auth.currentUser.uid,
        who: auth.currentUser.displayName,
        message: value
    });
}
function sendMessage() {
    message.blur();
    checkMessage(message.value).then(value => {
        if (value) {
            setMessageData(value);
            message.value = '';
            lobby.scrollTo({
                top: lobby.scrollHeight,
                behavior: 'smooth'
            });
        }
    }).catch(error => {
        message.value = '';
        message.style.setProperty('--message-placeholder-opacity', '1');
        console.log(error);
        message.setAttribute('placeholder', error);
    });
}
function checkMessage(value) {
    return new Promise((resolve, reject) => {
        if (auth.currentUser.uid === null) {
            reject(languageData.data.lobby.checkMessage["0"]);
            message.style.setProperty('--message-placeholder-color', '#f7d967');
        } else if (/^\s+$/.test(value)) {
            reject(languageData.data.lobby.checkMessage["1"]);
            message.style.setProperty('--message-placeholder-color', '#f00');
        } else if (value.trim() === "") {
            reject(languageData.data.lobby.checkMessage["2"]);
            message.style.setProperty('--message-placeholder-color', '#f00');
        } else {
            resolve(value);
        }
    });
}

// use other function
function ToAMPMYMD(timestamp) {
    const date = new Date(timestamp);

    const year = date.getFullYear() !== new Date().getFullYear() ? `${date.getFullYear()}/` : '';
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    let hours = date.getHours();
    let minutes = date.getMinutes();

    const period = hours >= 12 ? hours < 13 ? languageData.data.lobby.time["<13"] : hours < 16 ? languageData.data.lobby.time["<16"] : hours < 18 ? languageData.data.lobby.time["<18"] : languageData.data.lobby.time[">=18"] : hours < 5 ? languageData.data.lobby.time["<5"] : hours < 8 ? languageData.data.lobby.time["<8"] : languageData.data.lobby.time["<12"];

    hours = hours % 12;
    hours = hours ? hours : 12;

    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${year}${month}/${day} ${period} ${hours}:${minutes}`;
}
function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
function truncateAfterLastSlash(url) {
    const lastIndex = url.lastIndexOf('/');
    if (lastIndex === -1) {
        return url;
    }
    return url.slice(0, lastIndex + 1);
}
function generateDeviceId() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language || navigator.userLanguage;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const domain = window.location.hostname;

    let baseString = userAgent + platform + language + screenResolution + domain;

    const hash = function (str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; // Convert to 32-bit integer
        }
        return hash;
    };

    const deviceId = hash(baseString).toString(16);

    return deviceId;
}
function confirmLoop(confirmText, callback) {
    if (window.confirm(confirmText)) {
        callback();
    } else {
        confirmLoop(confirmText, callback);
    }
}
function checkToken(user) {
    user.getIdToken().then(void 0).catch(e => {
        confirmLoop(languageData.data.beforeunload, signOutUser());
    });
}