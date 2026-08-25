(function() {
    const MY = 'me', CT = 'contact', SYS = 'system';
    let myName = '我', ctName = 'Norton·Campbell', myAv = '', ctAv = '', msgs = [], nid = 1000, quoteMsg = null;
    const Q = id => document.getElementById(id);
    const ma = Q('ma'), mi = Q('mi'), snd = Q('snd'), qb = Q('qb'), qbt = Q('qbt'), qbx = Q('qbx'), st = Q('st'), sm = Q('sm'), sp = Q('sp'), bk = Q('bk'), cn = Q('cn'), mn = Q('mn'), ctn = Q('ctn'), rs = Q('rs'), rsv = Q('rsv'), at = Q('at'), ai = Q('ai'), aiv = Q('aiv'), air = Q('air'), et = Q('et'), ap = Q('ap'), mu = Q('mu'), ctu = Q('ctu');
    let rTimer = null, aTimer = null, rDelay = 3000, aMin = 10, statusTimer = null;
    let nextStatusUpdateTime = 0;
    let isQaReplying = false, qaQueue = [], currentQaTimer = null;
    let textCards = [], emojiCards = [], imageCards = [], statusCards = [], groups = [{ id: 'default', name: '未分组', color: '#90943f' }], chatStickers = [];
    let currentTab = 'text', currentGroupFilter = 'default';
    const contactStatusEl = Q('contactStatus');
    let currentStatusText = '在线';
    let isSending = false;
    let ignoreNextClick = false;
    const wp = Q('wp'), wbBack = Q('wbBack'), wbSearch = Q('wbSearch'), tabs = document.querySelectorAll('.tab'), cardList = Q('cardList'), groupBar = Q('groupBar'), wbImportText = Q('wbImportText'), wbUploadImg = Q('wbUploadImg'), wbExport = Q('wbExport'), wbImportJSON = Q('wbImportJSON'), importArea = Q('importArea'), importTextArea = Q('importTextArea'), confirmImport = Q('confirmImport'), cancelImport = Q('cancelImport'), imgUploadInput = Q('imgUploadInput'), jsonUploadInput = Q('jsonUploadInput');
    const tp = Q('tp'), themeBack = Q('themeBack'), bodyBgColor = Q('bodyBgColor'), mainBgColor = Q('mainBgColor'), headerBgColor = Q('headerBgColor'), btnBgColor = Q('btnBgColor'), inputBgColor = Q('inputBgColor'), myBubbleBgColor = Q('myBubbleBgColor'), contactBubbleBgColor = Q('contactBubbleBgColor'), accentColor = Q('accentColor'), fontSizeSlider = Q('fontSizeSlider'), fontSizeValue = Q('fontSizeValue'), applyThemeBtn = Q('applyThemeBtn'), resetThemeBtn = Q('resetThemeBtn');
    const hp = Q('hp'), hpBack = Q('hpBack'), historySearch = Q('historySearch'), historyDate = Q('historyDate'), jumpDateBtn = Q('jumpDateBtn'), clearDateFilter = Q('clearDateFilter'), exportHistoryBtn = Q('exportHistoryBtn'), importHistoryBtn = Q('importHistoryBtn'), historyJSONInput = Q('historyJSONInput'), historyList = Q('historyList');
    const clearAllHistoryBtn = Q('clearAllHistoryBtn');
    const kp = Q('kp'), kpBack = Q('kpBack'), keepAliveToggle = Q('keepAliveToggle'), nightModeToggle = Q('nightModeToggle');
    const defTheme = { bodyBg: '#939E66', mainBg: '#D4D7C2', headerBg: '#AAB185', btnBg: '#BEC5A3', inputBg: '#BEC5A3', myBubble: '#F1F1EB', contactBubble: '#F7F2EC', accent: '#586840', fontSize: 16 };
    const nightTheme = { bodyBg: '#2E2A27', mainBg: '#3E3935', headerBg: '#504842', btnBg: '#5E544C', inputBg: '#554D46', myBubble: '#585049', contactBubble: '#4D4640', accent: '#7D7165', fontSize: 16 };
    let isNight = localStorage.getItem('nightMode') === 'true';
    const imgBtn = Q('imgBtn'), chatImageInput = Q('chatImageInput');
    const stickerBtn = Q('stickerBtn'), stickerPanel = Q('stickerPanel'), stickerGrid = Q('stickerGrid'), addStickerBtn = Q('addStickerBtn'), stickerFileInput = Q('stickerFileInput');
    const rapidReplyBtn = Q('rapidReplyBtn');
    const mailboxBtn = Q('mailboxBtn'), mp = Q('mp'), mbBack = Q('mbBack');
    const sentTab = document.querySelector('.mailbox-tab[data-mtab="sent"]'), inboxTab = document.querySelector('.mailbox-tab[data-mtab="inbox"]');
    const writeLetterBtn = Q('writeLetterBtn'), letterEditArea = Q('letterEditArea'), letterContent = Q('letterContent'), sendLetterBtn = Q('sendLetterBtn'), cancelLetterBtn = Q('cancelLetterBtn'), letterList = Q('letterList');
    let letters = [], mailboxTab = 'sent';

    function downloadOrShare(blob, filename) {
        if (navigator.share) {
            try {
                const file = new File([blob], filename, { type: blob.type });
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    navigator.share({
                        files: [file],
                        title: filename
                    }).catch(e => {
                        if (e.name !== 'AbortError') fallbackDownload(blob, filename);
                    });
                    return;
                }
            } catch (err) {
                console.error('Share API error:', err);
            }
        }
        fallbackDownload(blob, filename);
    }
    
    function fallbackDownload(blob, filename) {
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    /* ---------- 自定义弹窗系统 ---------- */
    const customModalOverlay = Q('customModalOverlay');
    const customModalTitle = Q('customModalTitle');
    const customModalBody = Q('customModalBody');
    const customModalInputContainer = Q('customModalInputContainer');
    const customModalInput = Q('customModalInput');
    const customModalCancel = Q('customModalCancel');
    const customModalConfirm = Q('customModalConfirm');

    function customModal(opts) {
        customModalTitle.textContent = opts.title || '提示';
        customModalBody.textContent = opts.message || '';
        if (opts.input) {
            customModalInputContainer.style.display = 'block';
            customModalInput.value = opts.defaultValue || '';
        } else {
            customModalInputContainer.style.display = 'none';
        }
        customModalCancel.style.display = opts.showCancel === false ? 'none' : 'block';
        customModalCancel.textContent = opts.cancelText || '取消';
        customModalConfirm.textContent = opts.confirmText || '确定';
        
        customModalOverlay.style.display = 'flex';
        if (opts.input) setTimeout(() => customModalInput.focus(), 50);

        const cleanup = () => {
            customModalOverlay.style.display = 'none';
            customModalCancel.onclick = null;
            customModalConfirm.onclick = null;
        };

        customModalCancel.onclick = () => {
            cleanup();
            if (opts.onCancel) opts.onCancel();
        };

        customModalConfirm.onclick = () => {
            const val = opts.input ? customModalInput.value : true;
            cleanup();
            if (opts.onConfirm) opts.onConfirm(val);
        };
    }

    function customConfirm(message, onConfirm, title = '确认操作') {
        customModal({ title, message, showCancel: true, onConfirm });
    }

    function customAlert(message, onConfirm, title = '提示') {
        customModal({ title, message, showCancel: false, onConfirm });
    }

    function customPrompt(message, defaultValue, onConfirm, title = '输入信息') {
        customModal({ title, message, input: true, defaultValue, showCancel: true, onConfirm });
    }

    let rapidReplyActive = false, rapidReplyTimer = null;
    let dataLoaded = false;

    /* ---------- IndexedDB 模块与降级容错 ---------- */
    let db = null;
    let useLocalStorageFallback = false;

    function initDB() {
        return new Promise((resolve) => {
            if (!window.indexedDB) {
                console.warn('IndexedDB 不受支持，降级为 LocalStorage');
                useLocalStorageFallback = true;
                resolve(false);
                return;
            }
            try {
                const request = indexedDB.open('ChatAppDB', 2);
                request.onupgradeneeded = e => {
                    const dbInst = e.target.result;
                    if (!dbInst.objectStoreNames.contains('messages')) dbInst.createObjectStore('messages');
                    if (!dbInst.objectStoreNames.contains('letters')) dbInst.createObjectStore('letters');
                    if (!dbInst.objectStoreNames.contains('stickers')) dbInst.createObjectStore('stickers');
                    if (!dbInst.objectStoreNames.contains('image_cards')) dbInst.createObjectStore('image_cards');
                    if (!dbInst.objectStoreNames.contains('avatars')) dbInst.createObjectStore('avatars');
                };
                request.onsuccess = e => {
                    db = e.target.result;
                    useLocalStorageFallback = false;
                    resolve(true);
                };
                request.onerror = (err) => {
                    console.warn('IndexedDB 初始化失败或无权限，启用 LocalStorage 降级', err);
                    useLocalStorageFallback = true;
                    resolve(false);
                };
            } catch (err) {
                console.warn('IndexedDB 异常，启用 LocalStorage 降级', err);
                useLocalStorageFallback = true;
                resolve(false);
            }
        });
    }

    function dbPut(storeName, key, value) {
        return new Promise((resolve, reject) => {
            if (!db) return reject();
            try {
                const tx = db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                store.put(value, key);
                tx.oncomplete = resolve;
                tx.onerror = reject;
            } catch (e) {
                reject(e);
            }
        });
    }

    function dbGet(storeName, key) {
        return new Promise((resolve, reject) => {
            if (!db) return reject();
            try {
                const tx = db.transaction(storeName, 'readonly');
                const store = tx.objectStore(storeName);
                const req = store.get(key);
                req.onsuccess = () => resolve(req.result);
                req.onerror = reject;
            } catch (e) {
                reject(e);
            }
        });
    }

    function dbDelete(storeName, key) {
        return new Promise((resolve, reject) => {
            if (!db) return reject();
            try {
                const tx = db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                store.delete(key);
                tx.oncomplete = resolve;
                tx.onerror = reject;
            } catch (e) {
                reject(e);
            }
        });
    }

    async function saveToIndexedDB() {
        if (useLocalStorageFallback || !db) {
            try {
                localStorage.setItem('chatMessages_fb', JSON.stringify({ msgs, nid }));
                localStorage.setItem('letters_fb', JSON.stringify(letters));
                localStorage.setItem('chatStickers_fb', JSON.stringify(chatStickers));
                localStorage.setItem('imageCards_fb', JSON.stringify(imageCards));
                localStorage.setItem('avatars_fb', JSON.stringify({ myAv, ctAv }));
            } catch (e) {
                console.warn('LocalStorage 存储已满或异常:', e);
            }
            return;
        }
        try {
            await dbPut('messages', 'msgs', msgs).catch(()=>{});
            await dbPut('messages', 'nid', nid).catch(()=>{});
            await dbPut('letters', 'data', letters).catch(()=>{});
            await dbPut('stickers', 'data', chatStickers).catch(()=>{});
            await dbPut('image_cards', 'data', imageCards).catch(()=>{});
            await dbPut('avatars', 'data', { myAv, ctAv }).catch(()=>{});
        } catch (e) {
            try {
                localStorage.setItem('chatMessages_fb', JSON.stringify({ msgs, nid }));
                localStorage.setItem('letters_fb', JSON.stringify(letters));
                localStorage.setItem('chatStickers_fb', JSON.stringify(chatStickers));
                localStorage.setItem('imageCards_fb', JSON.stringify(imageCards));
                localStorage.setItem('avatars_fb', JSON.stringify({ myAv, ctAv }));
            } catch (err) {}
        }
    }

    async function loadFromIndexedDB() {
        if (useLocalStorageFallback || !db) {
            try {
                const savedFb = JSON.parse(localStorage.getItem('chatMessages_fb') || 'null');
                if (savedFb) {
                    if (savedFb.msgs !== undefined) msgs = savedFb.msgs;
                    if (savedFb.nid !== undefined) nid = savedFb.nid;
                }
                const lettersFb = JSON.parse(localStorage.getItem('letters_fb') || 'null');
                if (lettersFb) letters = lettersFb;
                const stickersFb = JSON.parse(localStorage.getItem('chatStickers_fb') || 'null');
                if (stickersFb) chatStickers = stickersFb;
                const imgCardsFb = JSON.parse(localStorage.getItem('imageCards_fb') || 'null');
                if (imgCardsFb) imageCards = imgCardsFb;
                const avatarsFb = JSON.parse(localStorage.getItem('avatars_fb') || 'null');
                if (avatarsFb) {
                    if (avatarsFb.myAv !== undefined) myAv = avatarsFb.myAv;
                    if (avatarsFb.ctAv !== undefined) ctAv = avatarsFb.ctAv;
                }
                return true;
            } catch (e) {
                return false;
            }
        }
        try {
            const m = await dbGet('messages', 'msgs').catch(() => null);
            const n = await dbGet('messages', 'nid').catch(() => null);
            const l = await dbGet('letters', 'data').catch(() => null);
            const s = await dbGet('stickers', 'data').catch(() => null);
            const ic = await dbGet('image_cards', 'data').catch(() => null);
            const av = await dbGet('avatars', 'data').catch(() => null);
            if (m !== undefined && m !== null) msgs = m;
            if (n !== undefined && n !== null) nid = n;
            if (l !== undefined && l !== null) letters = l;
            if (s !== undefined && s !== null) chatStickers = s;
            if (ic !== undefined && ic !== null) imageCards = ic;
            if (av !== undefined && av !== null) {
                if (av.myAv !== undefined) myAv = av.myAv;
                if (av.ctAv !== undefined) ctAv = av.ctAv;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    async function clearIndexedDB() {
        try {
            localStorage.removeItem('chatMessages_fb');
            localStorage.removeItem('letters_fb');
            localStorage.removeItem('chatStickers_fb');
            localStorage.removeItem('imageCards_fb');
            localStorage.removeItem('avatars_fb');
        } catch (e) {}
        if (!db) return;
        try {
            await dbDelete('messages', 'msgs').catch(()=>{});
            await dbDelete('messages', 'nid').catch(()=>{});
            await dbDelete('letters', 'data').catch(()=>{});
            await dbDelete('stickers', 'data').catch(()=>{});
            await dbDelete('image_cards', 'data').catch(()=>{});
            await dbDelete('avatars', 'data').catch(()=>{});
        } catch (e) {}
    }
    /* --------------------------- */

    function isAnyReplyActive() {
        return !!(rTimer || rapidReplyActive || isQaReplying || currentQaTimer);
    }

    function renderStatusUI() {
        if (!contactStatusEl) return;
        if (isAnyReplyActive()) {
            contactStatusEl.textContent = '对方正在输入...';
        } else {
            contactStatusEl.textContent = currentStatusText || '在线';
        }
    }

    function updateNightUI() { 
        const sunSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
        const moonSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
        nightModeToggle.innerHTML = isNight ? sunSvg : moonSvg; 
    }
    updateNightUI(); if (isNight) applyNight();

    function saveAllData() {
        if (!dataLoaded) return;
        try {
            // localStorage 中只保存轻量基础设置，不再存储 base64 头像
            localStorage.setItem('chatSettings', JSON.stringify({ myName, ctName, rDelay, aMin, atChecked: at.checked, etChecked: et.checked }));
            // wordCards 中排除 imageCards，防止 base64 图片撑爆 5MB localStorage
            localStorage.setItem('wordCards', JSON.stringify({ textCards, emojiCards, statusCards, groups }));
        } catch (e) {
            console.warn('LocalStorage 写入异常:', e);
        }
        // 大体积资源 (聊天记录、信件、表情包、图片字卡、自定义头像) 统一持久化至 IndexedDB
        saveToIndexedDB();
        if (kp && kp.classList.contains('show')) {
            updateStorageInfo();
        }
    }
    window.addEventListener('beforeunload', () => { if (dataLoaded) saveAllData(); });

    async function loadAllData() {
        await initDB();
        const indexSuccess = await loadFromIndexedDB();
        if (!indexSuccess || msgs.length === 0) {
            try {
                const chatMessages = JSON.parse(localStorage.getItem('chatMessages') || 'null');
                if (chatMessages) { msgs = chatMessages.msgs || []; nid = chatMessages.nid || 1000; }
                const savedLetters = JSON.parse(localStorage.getItem('letters') || 'null');
                if (savedLetters) letters = savedLetters;
                const savedStickers = JSON.parse(localStorage.getItem('chatStickers') || 'null');
                if (savedStickers) chatStickers = savedStickers;
                await saveToIndexedDB();
                localStorage.removeItem('chatMessages');
                localStorage.removeItem('letters');
                localStorage.removeItem('chatStickers');
            } catch (e) {}
        }
        try {
            const chatSettings = JSON.parse(localStorage.getItem('chatSettings') || 'null');
            if (chatSettings) {
                myName = chatSettings.myName || '我';
                ctName = chatSettings.ctName || 'Norton·Campbell';
                // 如果 IndexedDB 中没有读取到头像，且旧 settings 中存在头像，迁移并保存
                if (!myAv && chatSettings.myAv) myAv = chatSettings.myAv;
                if (!ctAv && chatSettings.ctAv) ctAv = chatSettings.ctAv;
                rDelay = chatSettings.rDelay || 3000;
                aMin = chatSettings.aMin || 10;
                at.checked = chatSettings.atChecked || false;
                et.checked = chatSettings.etChecked !== undefined ? chatSettings.etChecked : true;
                mn.value = myName;
                ctn.value = ctName;
                rs.value = rDelay / 100;
                ai.value = aMin;
                air.style.opacity = at.checked ? '1' : '.5';
                ai.disabled = !at.checked;
                updSlider();
                
                // 从 localStorage 中剥离 base64 头像数据，释放空间
                if (chatSettings.myAv !== undefined || chatSettings.ctAv !== undefined) {
                    delete chatSettings.myAv;
                    delete chatSettings.ctAv;
                    localStorage.setItem('chatSettings', JSON.stringify(chatSettings));
                }
            }
            const wordCards = JSON.parse(localStorage.getItem('wordCards') || 'null');
            if (wordCards) {
                textCards = wordCards.textCards || [];
                emojiCards = wordCards.emojiCards || [];
                // 如果 IndexedDB 中没有图片卡，而 localStorage 的 wordCards 中有旧数据，迁移至 imageCards
                if ((!imageCards || imageCards.length === 0) && wordCards.imageCards && wordCards.imageCards.length > 0) {
                    imageCards = wordCards.imageCards;
                }
                statusCards = wordCards.statusCards || [];
                groups = wordCards.groups || [{ id: 'default', name: '未分组', color: '#90943f' }];
                const defaultGroup = groups.find(g => g.id === 'default');
                if (defaultGroup && defaultGroup.name === 'name') defaultGroup.name = '未分组';
                if (!groups.some(g => g.id === 'default')) groups.unshift({ id: 'default', name: '未分组', color: '#90943f' });

                // 清理 localStorage 中的 imageCards，防止撑爆 5MB 上限
                if (wordCards.imageCards !== undefined) {
                    delete wordCards.imageCards;
                    localStorage.setItem('wordCards', JSON.stringify(wordCards));
                }
            }
            await saveToIndexedDB();
        } catch (e) {
            console.warn('数据初始化加载异常:', e);
        }
        dataLoaded = true;
    }

    loadAllData().then(() => {
        setInterval(saveAllData, 5000);
        updateContactStatus(true);
        checkScheduledReplies();
        updateStorageInfo();
        render(); updSlider(); applySet();
    });

    function compressImage(file, callback, maxWidth = 800, quality = 0.8) {
        if (!file) return;
        const isGif = file.type === 'image/gif' || (file.name && file.name.toLowerCase().endsWith('.gif'));
        const reader = new FileReader();
        reader.onload = function(e) {
            if (isGif) {
                callback(e.target.result);
                return;
            }
            const img = new Image();
            img.onload = function() {
                try {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    if (width > maxWidth || height > maxWidth) {
                        if (width > height) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        } else {
                            width = Math.round((width * maxWidth) / height);
                            height = maxWidth;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    const dataUrl = canvas.toDataURL('image/jpeg', quality);
                    callback(dataUrl);
                } catch (err) {
                    callback(e.target.result);
                }
            };
            img.onerror = function() {
                callback(e.target.result);
            };
            img.src = e.target.result;
        };
        reader.onerror = function() {
            if (typeof customAlert === 'function') customAlert('读取图片失败');
        };
        reader.readAsDataURL(file);
    }

    /* 状态与长定时器保护 */
    function updateContactStatus(forcePick = false) {
        if (statusCards && statusCards.length > 0) {
            if (forcePick || !statusCards.some(c => c.content === currentStatusText)) {
                const picked = statusCards[Math.floor(Math.random() * statusCards.length)].content;
                currentStatusText = picked;
            }
        } else {
            currentStatusText = '在线';
        }
        renderStatusUI();
        scheduleNextStatusUpdate();
    }

    function scheduleNextStatusUpdate() {
        clearTimeout(statusTimer);
        const nextDelay = Math.floor(Math.random() * 8 * 3600000) + 3600000;
        nextStatusUpdateTime = Date.now() + nextDelay;
        try {
            localStorage.setItem('nextStatusUpdateTime', String(nextStatusUpdateTime));
        } catch (e) {}
        statusTimer = setTimeout(() => updateContactStatus(true), nextDelay);
    }

    function checkContactStatusSchedule() {
        if (!nextStatusUpdateTime) {
            const saved = parseInt(localStorage.getItem('nextStatusUpdateTime') || '0', 10);
            if (saved) nextStatusUpdateTime = saved;
        }
        if (nextStatusUpdateTime && Date.now() >= nextStatusUpdateTime) {
            updateContactStatus(true);
        }
    }

    function getRandomReply() {
        let baseText = textCards.length ? textCards[Math.floor(Math.random()*textCards.length)].content : '';
        if (et.checked && emojiCards.length && Math.random() < 0.5) baseText += ' ' + emojiCards[Math.floor(Math.random()*emojiCards.length)].content;
        return baseText.trim();
    }

    function getRandomReplyMessage() {
        if (imageCards.length > 0 && Math.random() < 0.25) {
            const randomImage = imageCards[Math.floor(Math.random() * imageCards.length)].content;
            return { type: 'image', content: randomImage };
        } else {
            const text = getRandomReply();
            if (text) return { type: 'text', content: text };
            return null;
        }
    }

    function maybeAttachQuote(msgObj) {
        if (Math.random() < 0.3) {
            const recent = msgs.slice(-10);
            const textCandidates = recent.filter(m => (!m.msgType || m.msgType === 'text') && m.text);
            if (textCandidates.length > 0) {
                const picked = textCandidates[Math.floor(Math.random() * textCandidates.length)];
                msgObj.quoteId = picked.id;
                msgObj.quoteText = picked.text;
            }
        }
    }

    function stopTimers() { 
        if (rTimer) clearTimeout(rTimer); 
        if (aTimer) clearInterval(aTimer); 
        if (rapidReplyTimer) clearTimeout(rapidReplyTimer);
        if (currentQaTimer) clearTimeout(currentQaTimer);
        qaQueue = [];
        rTimer = aTimer = rapidReplyTimer = currentQaTimer = null; 
        rapidReplyActive = false;
        isQaReplying = false;
        renderStatusUI();
    }
    function startAuto() { if (aTimer) clearInterval(aTimer); aTimer = setInterval(() => { if (!at.checked) return; sendRapidReplies(); }, aMin * 60000); }

    function checkNextQueue() {
        if (rTimer || rapidReplyActive || isQaReplying) return;
        if (qaQueue.length > 0) {
            const nextQa = qaQueue.shift();
            processQaReply(nextQa);
        }
    }

    function processQaReply(qaItem) {
        if (!qaItem) return;
        isQaReplying = true;
        renderStatusUI();
        currentQaTimer = setTimeout(() => {
            currentQaTimer = null;
            isQaReplying = false;
            renderStatusUI();
            const picked = Math.random() < 0.5 ? qaItem.a : qaItem.b;
            let replyText = `我选择：${picked}`;
            if (et && et.checked && emojiCards.length && Math.random() < 0.5) {
                replyText += ' ' + emojiCards[Math.floor(Math.random() * emojiCards.length)].content;
            }
            const replyMsg = { 
                id: nid++, 
                senderId: CT, 
                text: replyText, 
                timestamp: Date.now(), 
                status: 'read',
                quoteId: qaItem.msg.id,
                quoteText: `问答: ${qaItem.q}`
            };
            msgs.push(replyMsg);
            render();
            saveAllData();
            checkNextQueue();
        }, rDelay);
    }

    function sendRapidReplies() {
        if (rapidReplyActive) { clearTimeout(rapidReplyTimer); rapidReplyActive = false; rapidReplyTimer = null; }
        rapidReplyActive = true;
        const rand = Math.random();
        const total = rand < 0.6 ? 1 : (rand < 0.9 ? 2 : 3);
        let count = 0;
        function sendNext() {
            if (count >= total || !rapidReplyActive) { 
                rapidReplyActive = false; 
                rapidReplyTimer = null;
                renderStatusUI();
                checkNextQueue();
                return; 
            }
            renderStatusUI();
            rapidReplyTimer = setTimeout(() => {
                rapidReplyTimer = null;
                const msgObj = getRandomReplyMessage();
                if (msgObj) {
                    const msg = { id: nid++, senderId: CT, text: msgObj.content, timestamp: Date.now(), status: 'read' };
                    if (msgObj.type === 'image') msg.msgType = 'image';
                    maybeAttachQuote(msg);
                    msgs.push(msg); render(); saveAllData();
                }
                count++;
                if (count < total && rapidReplyActive) {
                    sendNext();
                } else {
                    rapidReplyActive = false;
                    rapidReplyTimer = null;
                    renderStatusUI();
                    checkNextQueue();
                }
            }, rDelay);
        }
        sendNext();
    }

    function handleRapidReply(e) { if (e) e.preventDefault(); sendRapidReplies(); }
    rapidReplyBtn.addEventListener('click', handleRapidReply);

    function simReply() {
        if (rTimer) clearTimeout(rTimer);
        rTimer = setTimeout(() => {
            rTimer = null;
            renderStatusUI();
            const msgObj = getRandomReplyMessage();
            if (msgObj) {
                const msg = { id: nid++, senderId: CT, text: msgObj.content, timestamp: Date.now(), status:'read' };
                if (msgObj.type === 'image') msg.msgType = 'image';
                maybeAttachQuote(msg);
                msgs.push(msg); render(); saveAllData();
            }
            checkNextQueue();
        }, rDelay);
        renderStatusUI();
    }

    function updSlider() { let v = parseInt(rs.value); rsv.textContent = Math.floor(v/10)+'秒'; rDelay = v*100; let m = parseInt(ai.value); aiv.textContent = m+'分钟'; aMin = m }
    rs.oninput = updSlider; ai.oninput = updSlider; at.onchange = () => { ai.disabled = !at.checked; air.style.opacity = at.checked ? '1' : '.5' }
    function applySet() {
        myName = mn.value||'我'; ctName = ctn.value||'Norton·Campbell'; cn.textContent = ctName;
        stopTimers(); if (at.checked) startAuto();
        render(); sp.classList.remove('show'); saveAllData();
    }
    ap.onclick = applySet;

    function handleUpload(file, type) {
        if (!file) return;
        compressImage(file, (dataUrl) => {
            if (type === 'my') myAv = dataUrl;
            else ctAv = dataUrl;
            saveAllData();
            render();
        }, 240, 0.85);
    }
    document.querySelectorAll('.au').forEach(b => b.onclick = () => { let t = b.dataset.avatar, up = t==='my'?mu:ctu; up.click(); up.onchange = e => { if (e.target.files[0]) handleUpload(e.target.files[0], t); up.value = '' } });

    function init() { if (msgs.length === 0) { msgs = []; } }
    init();
    function find(id) { return msgs.find(m => m.id === id) }
    function esc(t) { let d = document.createElement('div'); d.textContent = t; return d.innerHTML }
    function highlight(id) { let r = document.querySelector(`.mr[data-mid="${id}"]`); if (!r) return; document.querySelectorAll('.mr.hl').forEach(e => e.classList.remove('hl')); r.classList.add('hl'); r.scrollIntoView({ behavior:'smooth', block:'center' }); setTimeout(() => r.classList.remove('hl'), 2000) }
    
    function avHtml(v) {
        if (v && v.startsWith('data:image')) {
            return `<img src="${v}" style="width:100%;height:100%;object-fit:cover">`;
        }
        if (!v || v === '🌿' || v === '我') {
            return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
        }
        return esc(v);
    }

    function render() {
        if (!msgs.length) { ma.innerHTML = ''; return }
        let h = '';
        msgs.forEach(m => {
            if (m.senderId === SYS) { h += `<div class="mr msg-system"><span>${esc(m.text)}</span></div>`; return; }
            let me = m.senderId === MY, row = me ? 'mr r' : 'mr l', av = me ? avHtml(myAv) : avHtml(ctAv);
            const pinSvg = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px;margin-right:3px"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
            let qText = m.quoteText || '';
            let qSafe = qText.length > 30 ? qText.slice(0, 30) + '…' : qText;
            let q = m.quoteId ? `<div class="qp" data-qid="${m.quoteId}"><span class="qt">${pinSvg}${esc(qSafe)}</span></div>` : '';
            let d = new Date(m.timestamp), time = `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
            let stt = me ? (m.status === 'read' ? '<span class="rs sdc">✓✓</span>' : '<span class="rs sc">✓</span>') : '<span style="opacity:.4">·</span>';
            const replySvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>`;
            const trashSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`;
            let act = `<div class="mactions"><button class="ab qa" data-id="${m.id}" title="引用">${replySvg}</button><button class="ab da" data-id="${m.id}" title="删除">${trashSvg}</button></div>`;
            let ft = `<div class="bf"><span class="mt">${time}</span>${stt}${act}</div>`;
            let bubbleContent;
            if (m.msgType === 'image') { bubbleContent = `<div class="mb img-bubble"><img src="${m.text}" alt="图片"></div>`; }
            else if (m.msgType === 'qa') {
                const qIconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
                bubbleContent = `<div class="qa-bubble" style="cursor:pointer" title="点击删除该问答">
                    <div class="qa-bubble-title">${qIconSvg} 二选一问答</div>
                    <div class="qa-bubble-q">${esc(m.text)}</div>
                    <div class="qa-opts">
                        <div class="qa-opt-item"><strong>A.</strong> ${esc(m.qaOptA || '')}</div>
                        <div class="qa-opt-item"><strong>B.</strong> ${esc(m.qaOptB || '')}</div>
                    </div>
                </div>`;
            }
            else { bubbleContent = `<div class="mb">${esc(m.text)}</div>`; }
            if (me) { h += `<div class="${row}" data-mid="${m.id}"><div class="bw">${q}${bubbleContent}${ft}</div><div class="av">${av}</div></div>`; }
            else { h += `<div class="${row}" data-mid="${m.id}"><div class="av">${av}</div><div class="bw">${q}${bubbleContent}${ft}</div></div>`; }
        });
        ma.innerHTML = h; ma.scrollTop = ma.scrollHeight;
    }

    function updQBar() { if (quoteMsg) { qb.style.display = 'flex'; qbt.textContent = `${quoteMsg.senderId===MY?myName:ctName}: ${(quoteMsg.msgType==='image'?'[图片]':quoteMsg.text).slice(0,40)}` } else qb.style.display = 'none' }

    /* 修复 ⑤: 防止发送空白消息及发送竞态 */
    function send(txt, q = null, msgType = 'text') {
        if (isSending) return;
        let content = txt;
        if (msgType === 'image') {
            if (!content) return;
        } else {
            if (typeof content !== 'string') return;
            content = content.trim();
            if (!content) return;
        }
        isSending = true;
        let msg = { id: nid++, senderId: MY, text: content, timestamp: Date.now(), status: 'unread', quoteId: q?.id, quoteText: q?.msgType === 'image' ? '[图片]' : q?.text, msgType };
        msgs.push(msg);
        setTimeout(() => { let un = msgs.filter(m => m.senderId === MY && m.status === 'unread'); if (un.length) { un[un.length - 1].status = 'read'; render(); saveAllData(); } }, 1800);
        quoteMsg = null;
        mi.value = '';
        mi.focus();
        setTimeout(() => { mi.value = ''; isSending = false; }, 50);
        updQBar(); render(); simReply(); saveAllData();
    }

    function del(id) {
        let i = msgs.findIndex(m => m.id === id);
        if (i === -1) return;
        msgs.forEach(m => { if (m.quoteId === id) { m.quoteId = null; m.quoteText = null } });
        msgs.splice(i, 1);
        if (quoteMsg && quoteMsg.id === id) quoteMsg = null;
        render(); updQBar(); saveAllData();
    }

    snd.onclick = () => {
        if (mi.value && mi.value.trim()) {
            send(mi.value, quoteMsg);
        }
    };
    mi.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (mi.value && mi.value.trim()) {
                send(mi.value, quoteMsg);
            }
        }
    });

    function handleMessageClick(e) {
        if (e.type === 'click' && ignoreNextClick) { ignoreNextClick = false; return; }
        if (e.type === 'touchend') { ignoreNextClick = true; }
        let prv = e.target.closest('.qp'); if (prv) { let qid = prv.dataset.qid; if (qid) find(parseInt(qid)) ? highlight(parseInt(qid)) : customAlert('原消息已被删除'); return }
        let qaBub = e.target.closest('.qa-bubble');
        if (qaBub) {
            let row = qaBub.closest('.mr');
            let mid = parseInt(row.dataset.mid);
            customConfirm('确定要删除这条二选一问答吗？', () => { del(mid); });
            return;
        }
        let bub = e.target.closest('.mb'); if (bub) { let row = bub.closest('.mr'), t = row.querySelector('.mactions'); document.querySelectorAll('.mactions').forEach(a => a.style.display = 'none'); if (t) t.style.display = 'flex' }
        else document.querySelectorAll('.mactions').forEach(a => a.style.display = 'none');
        let btn = e.target.closest('.ab'); if (btn) { let mid = parseInt(btn.dataset.id); if (btn.classList.contains('qa')) { let m = find(mid); if (m) { quoteMsg = m; updQBar(); mi.focus() } } else if (btn.classList.contains('da')) { customConfirm('确定删除此消息吗？', () => { del(mid); }); } document.querySelectorAll('.mactions').forEach(a => a.style.display = 'none') }
    }
    ma.addEventListener('click', handleMessageClick);
    ma.addEventListener('touchend', handleMessageClick);

    qbx.onclick = () => { quoteMsg = null; updQBar() };
    document.addEventListener('click', e => { if (!e.target.closest('.mb') && !e.target.closest('.ab')) document.querySelectorAll('.mactions').forEach(a => a.style.display = 'none') });
    st.onclick = e => { e.stopPropagation(); sm.classList.toggle('show') };
    sm.addEventListener('click', e => { 
        let it = e.target.closest('.si'); 
        if (it) { 
            let act = it.dataset.action; 
            sm.classList.remove('show');
            if (act === 'cs') { sp.classList.add('show'); updateStorageInfo(); } 
            else if (act === 'wb') { wp.classList.add('show'); renderWB(); } 
            else if (act === 'theme') { tp.classList.add('show'); } 
            else if (act === 'history') { hp.classList.add('show'); renderHist(); } 
            else if (act === 'keepalive') { kp.classList.add('show'); updateStorageInfo(); } 
        } 
        e.stopPropagation(); 
    });
    bk.onclick = () => sp.classList.remove('show');
    themeBack.onclick = () => tp.classList.remove('show');
    hpBack.onclick = () => hp.classList.remove('show');
    kpBack.onclick = () => kp.classList.remove('show');
    document.addEventListener('click', e => { if (!sm.contains(e.target) && e.target !== st) sm.classList.remove('show') });

    imgBtn.onclick = () => { chatImageInput.click(); };
    chatImageInput.onchange = e => {
        let files = e.target.files;
        if (!files.length) return;
        Array.from(files).forEach(f => {
            compressImage(f, (compressed) => { send(compressed, null, 'image'); });
        });
        chatImageInput.value = '';
    };

    function renderStickerPanel() {
        stickerGrid.innerHTML = '';
        chatStickers.forEach((stk, idx) => {
            let item = document.createElement('div'); item.className = 'sticker-item';
            const trashSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`;
            item.innerHTML = `<img src="${stk}"><div class="sticker-action-overlay"><button class="sticker-del-action-btn" data-index="${idx}">${trashSvg} 删除</button></div>`;
            
            let pressTimer = null;
            let isLongPress = false;
            let startX = 0, startY = 0;

            const startPress = (e) => {
                isLongPress = false;
                const touch = e.touches ? e.touches[0] : e;
                startX = touch.clientX;
                startY = touch.clientY;
                if (pressTimer) clearTimeout(pressTimer);
                pressTimer = setTimeout(() => {
                    isLongPress = true;
                    document.querySelectorAll('.sticker-item.show-action').forEach(el => el.classList.remove('show-action'));
                    item.classList.add('show-action');
                }, 400);
            };

            const cancelPress = () => {
                if (pressTimer) {
                    clearTimeout(pressTimer);
                    pressTimer = null;
                }
            };

            const movePress = (e) => {
                if (!pressTimer) return;
                const touch = e.touches ? e.touches[0] : e;
                if (Math.abs(touch.clientX - startX) > 8 || Math.abs(touch.clientY - startY) > 8) {
                    cancelPress();
                }
            };

            item.addEventListener('touchstart', startPress, { passive: true });
            item.addEventListener('touchmove', movePress, { passive: true });
            item.addEventListener('touchend', cancelPress);
            item.addEventListener('touchcancel', cancelPress);

            item.addEventListener('mousedown', startPress);
            item.addEventListener('mousemove', movePress);
            item.addEventListener('mouseup', cancelPress);
            item.addEventListener('mouseleave', cancelPress);

            item.addEventListener('click', (e) => {
                const delBtn = e.target.closest('.sticker-del-action-btn');
                if (delBtn) {
                    e.stopPropagation();
                    e.preventDefault();
                    const currentIdx = parseInt(delBtn.dataset.index);
                    if (!isNaN(currentIdx) && chatStickers[currentIdx]) {
                        customConfirm('确定要删除这张表情包吗？', () => {
                            chatStickers.splice(currentIdx, 1);
                            saveAllData();
                            renderStickerPanel();
                        });
                    }
                    return;
                }

                if (isLongPress) {
                    e.stopPropagation();
                    e.preventDefault();
                    isLongPress = false;
                    return;
                }

                if (item.classList.contains('show-action')) {
                    item.classList.remove('show-action');
                    e.stopPropagation();
                    return;
                }

                send(stk, null, 'image');
                stickerPanel.classList.remove('show');
            });

            stickerGrid.appendChild(item);
        });
    }
    stickerBtn.onclick = (e) => { e.stopPropagation(); stickerPanel.classList.toggle('show'); if (stickerPanel.classList.contains('show')) renderStickerPanel(); };
    addStickerBtn.onclick = () => { stickerFileInput.click(); };
    stickerFileInput.onchange = e => {
        let files = e.target.files;
        if (!files.length) return;
        Array.from(files).forEach(f => {
            compressImage(f, (compressed) => { chatStickers.push(compressed); saveAllData(); renderStickerPanel(); });
        });
        stickerFileInput.value = '';
    };
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.sticker-item')) {
            document.querySelectorAll('.sticker-item.show-action').forEach(el => el.classList.remove('show-action'));
        }
        if (!e.target.closest('.sticker-panel') && !e.target.closest('.sticker-btn')) {
            stickerPanel.classList.remove('show');
        }
    });

    const extToggleBtn = Q('extToggleBtn'), extPanel = Q('extPanel');
    const extCallBtn = Q('extCallBtn'), extImgBtn = Q('extImgBtn'), extQaBtn = Q('extQaBtn');
    const qaModal = Q('qaModal'), qaQuestion = Q('qaQuestion'), qaOptA = Q('qaOptA'), qaOptB = Q('qaOptB');
    const qaCancelBtn = Q('qaCancelBtn'), qaSubmitBtn = Q('qaSubmitBtn');

    extToggleBtn.onclick = (e) => {
        e.stopPropagation();
        stickerPanel.classList.remove('show');
        extPanel.classList.toggle('show');
        extToggleBtn.classList.toggle('active', extPanel.classList.contains('show'));
    };

    extCallBtn.onclick = () => {
        extPanel.classList.remove('show');
        extToggleBtn.classList.remove('active');
        callBtn.click();
    };

    extImgBtn.onclick = () => {
        extPanel.classList.remove('show');
        extToggleBtn.classList.remove('active');
        chatImageInput.click();
    };

    extQaBtn.onclick = () => {
        extPanel.classList.remove('show');
        extToggleBtn.classList.remove('active');
        qaQuestion.value = '';
        qaOptA.value = '';
        qaOptB.value = '';
        qaModal.style.display = 'flex';
    };

    qaCancelBtn.onclick = () => {
        qaModal.style.display = 'none';
    };

    qaSubmitBtn.onclick = () => {
        const q = qaQuestion.value.trim();
        const a = qaOptA.value.trim();
        const b = qaOptB.value.trim();
        if (!q) { customAlert('请输入问题描述'); return; }
        if (!a || !b) { customAlert('请完整填写两个选项'); return; }
        sendQa(q, a, b);
        qaModal.style.display = 'none';
    };

    function sendQa(q, a, b) {
        if (isSending) return;
        isSending = true;
        let msg = { id: nid++, senderId: MY, text: q, qaOptA: a, qaOptB: b, timestamp: Date.now(), status: 'unread', msgType: 'qa' };
        msgs.push(msg);
        setTimeout(() => {
            let un = msgs.filter(m => m.senderId === MY && m.status === 'unread');
            if (un.length) { un[un.length - 1].status = 'read'; render(); saveAllData(); }
        }, 1800);
        quoteMsg = null;
        updQBar(); render(); saveAllData();
        setTimeout(() => { isSending = false; }, 50);

        const qaItem = { msg, q, a, b };
        if (rTimer || rapidReplyActive || isQaReplying) {
            qaQueue.push(qaItem);
        } else {
            processQaReply(qaItem);
        }
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.ext-panel') && !e.target.closest('.ext-toggle-btn')) {
            extPanel.classList.remove('show');
            extToggleBtn.classList.remove('active');
        }
    });

    function deleteLetter(idx) { customConfirm('确定删除这封信吗？', () => { letters.splice(idx,1); saveAllData(); renderMailbox(); }); }
    function formatDate(ts) { const d = new Date(ts); return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`; }
    function renderMailbox() {
        const filtered = letters.filter(l=> mailboxTab==='sent' ? l.type==='sent' : l.type==='received');
        let html = '';
        const closeSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
        filtered.forEach((l,idx) => { const realIdx = letters.indexOf(l); const dateStr = formatDate(l.timestamp); const preview = l.content.split('\n')[0]?.substring(0,40) + '...'; let extra = ''; if (l.type==='sent' && !l.replied) { extra = `<div style="font-size:12px;color:#5A4E3E;">预计回信：${formatDate(l.replyDue)}</div>`; } else if (l.type==='received') { extra = `<div style="font-size:12px;color:#5A4E3E;">已收到回信</div>`; }
            html += `<div class="letter-preview" data-idx="${realIdx}"><div class="letter-info"><div class="meta"><span>${l.type==='sent'?'寄给 '+ctName:'来自 '+ctName}</span><span>${dateStr}</span></div><div class="preview">${preview}</div>${extra}</div><button class="letter-del-btn" data-delidx="${realIdx}">${closeSvg}</button></div>`; });
        letterList.innerHTML = html || '<div class="eh">暂无信件</div>';
        letterList.querySelectorAll('.letter-preview').forEach(el => { el.querySelector('.letter-info').onclick = () => { const idx = parseInt(el.dataset.idx); customAlert(letters[idx].content, null, '信件内容'); }; el.querySelector('.letter-del-btn').onclick = (e) => { e.stopPropagation(); const idx = parseInt(el.dataset.idx); deleteLetter(idx); }; });
    }
    function sendLetter() {
        const content = letterContent.value.trim();
        if (!content) return;
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}`;
        const fullContent = `To Norton·Campbell\n\n${content}\n\n${dateStr}  Collins·Turner`;
        const replyDelay = Math.floor(Math.random()*15)+10;
        const letter = { id: Date.now(), type: 'sent', content: fullContent, timestamp: now.getTime(), replyDue: now.getTime() + replyDelay * 3600000 };
        letters.push(letter);
        saveAllData();
        letterContent.value = ''; setTimeout(() => { letterContent.value = ''; }, 50);
        letterEditArea.style.display = 'none';
        mailboxTab = 'sent'; sentTab.classList.add('active'); inboxTab.classList.remove('active');
        renderMailbox();
    }
    function checkScheduledReplies() {
        try {
            const now = Date.now();
            let changed = false;
            letters.forEach(l => {
                if (l.type === 'sent' && !l.replied && l.replyDue <= now) {
                    const numSentences = Math.floor(Math.random() * 5) + 8;
                    const sentences = [];
                    if (textCards && textCards.length > 0) {
                        for (let i = 0; i < numSentences; i++) {
                            const randomCard = textCards[Math.floor(Math.random() * textCards.length)];
                            if (randomCard && randomCard.content) {
                                sentences.push(randomCard.content);
                            }
                        }
                    }
                    if (sentences.length === 0) {
                        sentences.push('收到你的来信了。展信佳。', '近来一切安好，见字如面。', '愿生活常伴温暖与喜悦。', '期待下次再与你通信。');
                    }
                    const replyDate = new Date();
                    const replyDateStr = `${replyDate.getFullYear()}-${(replyDate.getMonth()+1).toString().padStart(2,'0')}-${replyDate.getDate().toString().padStart(2,'0')}`;
                    const replyContent = `To Collins·Turner\n\n${sentences.join('\n')}\n\n${replyDateStr}  Norton·Campbell`;
                    letters.push({ id: Date.now() + Math.random(), type: 'received', content: replyContent, timestamp: replyDate.getTime(), replyTo: l.id });
                    l.replied = true;
                    changed = true;
                }
            });
            if (changed) saveAllData();
        } catch (err) {
            console.error('Error checking scheduled replies:', err);
        }
    }
    writeLetterBtn.onclick = () => { letterEditArea.style.display = 'block'; };
    cancelLetterBtn.onclick = () => { letterEditArea.style.display = 'none'; };
    sendLetterBtn.onclick = sendLetter;
    sentTab.onclick = () => { mailboxTab = 'sent'; sentTab.classList.add('active'); inboxTab.classList.remove('active'); renderMailbox(); };
    inboxTab.onclick = () => { mailboxTab = 'inbox'; inboxTab.classList.add('active'); sentTab.classList.remove('active'); renderMailbox(); };
    mailboxBtn.onclick = e => { e.stopPropagation(); mp.classList.toggle('show'); if (mp.classList.contains('show')) { checkScheduledReplies(); renderMailbox(); } };
    mbBack.onclick = () => mp.classList.remove('show');
    setInterval(checkScheduledReplies, 60000);

    /* 修复 ⑥: 兼容 APK WebView (file://) 及通用保活 */
    let keepAliveId = null;
    let wakeLockSentinel = null;

    async function requestWakeLock() {
        try {
            if ('wakeLock' in navigator && navigator.wakeLock.request) {
                wakeLockSentinel = await navigator.wakeLock.request('screen');
                wakeLockSentinel.addEventListener('release', () => {
                    wakeLockSentinel = null;
                });
            }
        } catch (e) {}
    }

    function releaseWakeLock() {
        if (wakeLockSentinel) {
            try {
                wakeLockSentinel.release();
            } catch (e) {}
            wakeLockSentinel = null;
        }
    }

    function startKeepAlive() {
        if (keepAliveId) return;
        requestWakeLock();
        const ping = () => {
            checkScheduledReplies();
            checkContactStatusSchedule();
            if (window.location.protocol.startsWith('http')) {
                fetch(window.location.href, { method: 'HEAD', cache: 'no-store' }).catch(() => {});
            }
        };
        ping();
        keepAliveId = setInterval(ping, 25000);
    }

    function stopKeepAlive() {
        if (keepAliveId) {
            clearInterval(keepAliveId);
            keepAliveId = null;
        }
        releaseWakeLock();
    }

    const savedKeep = localStorage.getItem('keepAlive') === 'true';
    keepAliveToggle.checked = savedKeep; if (savedKeep) startKeepAlive();
    keepAliveToggle.onchange = () => { 
        if (keepAliveToggle.checked) { 
            localStorage.setItem('keepAlive', 'true'); 
            startKeepAlive(); 
        } else { 
            localStorage.setItem('keepAlive', 'false'); 
            stopKeepAlive(); 
        } 
    };

    /* 修复 ⑩: 定时与生命周期监听 */
    setInterval(() => {
        checkScheduledReplies();
        checkContactStatusSchedule();
    }, 30000);

    window.addEventListener('focus', () => {
        checkScheduledReplies();
        checkContactStatusSchedule();
    });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            if (keepAliveToggle && keepAliveToggle.checked) {
                requestWakeLock();
            }
            checkScheduledReplies();
            checkContactStatusSchedule();
        }
    });

    function formatBytes(bytes, decimals = 1) {
        if (!bytes || bytes <= 0) return '0 B';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    async function updateStorageInfo() {
        const textElements = document.querySelectorAll('.storageStatusText, #storageStatusText');
        const bannerElements = document.querySelectorAll('.storageWarningBanner, #storageWarningBanner');
        const warnTextElements = document.querySelectorAll('.storageWarningText, #storageWarningText');
        if (!textElements.length) return;

        let displayUsage = '', displayQuota = '', percent = 0, isWarning = false;

        try {
            if (navigator.storage && navigator.storage.estimate) {
                const estimate = await navigator.storage.estimate();
                const usage = estimate.usage || 0;
                const quota = estimate.quota || 0;
                if (quota > 0) {
                    percent = Math.min(100, Math.round((usage / quota) * 1000) / 10);
                    displayUsage = formatBytes(usage);
                    displayQuota = formatBytes(quota);
                    isWarning = percent >= 90;
                }
            }
        } catch (e) {}

        if (!displayUsage) {
            let totalBytes = 0;
            try {
                for (let key in localStorage) {
                    if (localStorage.hasOwnProperty(key)) {
                        totalBytes += ((localStorage[key] || '').length + key.length) * 2;
                    }
                }
            } catch(e) {}
            const defaultQuota = 5 * 1024 * 1024;
            percent = Math.min(100, Math.round((totalBytes / defaultQuota) * 1000) / 10);
            displayUsage = formatBytes(totalBytes);
            displayQuota = formatBytes(defaultQuota);
            isWarning = percent >= 90;
        }

        const msgText = `存储占用：${displayUsage} / ${displayQuota} (${percent}%)`;
        textElements.forEach(el => el.textContent = msgText);
        bannerElements.forEach(banner => banner.style.display = isWarning ? 'flex' : 'none');
        warnTextElements.forEach(w => w.textContent = `存储空间接近上限 (${percent}%)，建议清理无用数据或导出备份`);
    }

    function applyNight() { setThemeInputs(nightTheme); applyTheme(); }
    nightModeToggle.onclick = () => { isNight = !isNight; localStorage.setItem('nightMode', isNight); updateNightUI(); if (isNight) applyNight(); else loadTheme(); };
    function syncHex(target) { const hexInput = document.querySelector(`.hex-input[data-target="${target.id}"]`); if (hexInput) hexInput.value = target.value }
    document.querySelectorAll('.hex-input').forEach(inp => { inp.addEventListener('input', function() { const target = document.getElementById(this.dataset.target); const val = this.value.trim(); if (/^#[0-9a-fA-F]{6}$/.test(val)) { target.value = val } }); inp.addEventListener('change', function() { const target = document.getElementById(this.dataset.target); if (!/^#[0-9a-fA-F]{6}$/.test(this.value.trim())) { this.value = target.value } }) });
    document.querySelectorAll('input[type="color"]').forEach(inp => { inp.addEventListener('input', function() { syncHex(this) }) });
    function setThemeInputs(theme) { bodyBgColor.value = theme.bodyBg; mainBgColor.value = theme.mainBg; headerBgColor.value = theme.headerBg; btnBgColor.value = theme.btnBg; inputBgColor.value = theme.inputBg; myBubbleBgColor.value = theme.myBubble; contactBubbleBgColor.value = theme.contactBubble; accentColor.value = theme.accent; fontSizeSlider.value = theme.fontSize; fontSizeValue.textContent = theme.fontSize + 'px'; document.querySelectorAll('.hex-input').forEach(inp => { const target = document.getElementById(inp.dataset.target); if (target) inp.value = target.value }); }
    function loadTheme() { if (isNight) { setThemeInputs(nightTheme); applyTheme(); return; } const saved = JSON.parse(localStorage.getItem('chatTheme') || '{}'); let theme = { bodyBg: saved.bodyBg || defTheme.bodyBg, mainBg: saved.mainBg || defTheme.mainBg, headerBg: saved.headerBg || defTheme.headerBg, btnBg: saved.btnBg || defTheme.btnBg, inputBg: saved.inputBg || defTheme.inputBg, myBubble: saved.myBubble || defTheme.myBubble, contactBubble: saved.contactBubble || defTheme.contactBubble, accent: saved.accent || defTheme.accent, fontSize: saved.fontSize || defTheme.fontSize }; if (saved.bodyBg?.toUpperCase() === '#6B6058' && saved.mainBg?.toUpperCase() === '#EFE9E3') { theme = { ...defTheme, fontSize: saved.fontSize || defTheme.fontSize }; } setThemeInputs(theme); applyTheme(); }
    function applyTheme() {
        let bodyBg = bodyBgColor.value, mainBg = mainBgColor.value, headerBg = headerBgColor.value, btnBg = btnBgColor.value, inputBg = inputBgColor.value, myBubble = myBubbleBgColor.value, contactBubble = contactBubbleBgColor.value, accent = accentColor.value, fontSize = parseInt(fontSizeSlider.value);
        if (isNight) { bodyBg = nightTheme.bodyBg; mainBg = nightTheme.mainBg; headerBg = nightTheme.headerBg; btnBg = nightTheme.btnBg; inputBg = nightTheme.inputBg; myBubble = nightTheme.myBubble; contactBubble = nightTheme.contactBubble; accent = nightTheme.accent; }
        fontSizeValue.textContent = fontSize + 'px';
        if (!isNight) localStorage.setItem('chatTheme', JSON.stringify({ bodyBg, mainBg, headerBg, btnBg, inputBg, myBubble, contactBubble, accent, fontSize }));
        let style = document.getElementById('dynamicTheme'); if (!style) { style = document.createElement('style'); style.id = 'dynamicTheme'; document.head.appendChild(style) }
        let txt = isNight ? '#E8E0D8' : '';
        let nightExtra = isNight ? `.sg,.sm,.search-box,.import-area,.card-item,.history-msg,.mi,.si:hover,.ab:hover{background:${nightTheme.contactBubble}!important}.sp,.wp,.tp,.hp,.kp,.mp{background:${mainBg}!important}.ir input[type=text],textarea,.hex-input,.date-row input[type=date]{background:#3E3935!important;border-color:${accent}!important;color:${txt}!important}.group-tag{background:${btnBg}70!important;color:${txt}cc!important}.tab{background:${btnBg}90!important;color:${txt}cc!important}.circle-btn,.btn,.call-btn,.img-btn,.sticker-btn,.rapid-reply-btn,.ext-toggle-btn,.ext-icon,.letter-del-btn,.group-export-btn,.group-toggle-btn{color:${txt}!important}.bb,.group-edit-btn{color:${txt}cc!important}.mr.hl{background:rgba(200,190,180,.15)!important}input[type=range]::-webkit-slider-track,input[type=range]::-moz-range-track{background:#555!important}.si,.sg,.card-item,.card-item.img-card{border-color:${accent}!important}.date-row input[type=date]{background:${nightTheme.contactBubble}!important}` : '';
        let txtFull = `${txt?`.c,.cn,.st,.si,.pt,.sl,.ir label,.mb,.mi,.tab,.btn,.group-tag,.card-content,.ab,.new-group-btn,.circle-btn,.call-btn,.img-btn,.sticker-btn,.rapid-reply-btn,.ext-toggle-btn,.ext-icon,.bb,.qbt,.message-time,.setting-label,.search-box,.color-row span,.history-msg .meta,.history-msg .preview,.bf,.tr label,.sr span,.font-slider span,.kp .sg div,.import-area div,.eh,.kp .sg div span,.storage-text,.sticker-panel .add-sticker-btn,.msg-system,.mailbox-tab,.group-export-btn,.group-toggle-btn{color:${txt}!important}.mi::placeholder,.search-box::placeholder,textarea::placeholder{color:${txt}99}.qp,.qt{color:${txt}cc!important}.eh{color:${txt}88!important}`:''}`;
        let avatarExtra = `.av{background:${mainBg}!important}.call-avatar{background:${mainBg}!important}`;
        let callExtra = `.call-header{background:${headerBg}!important}.call-window{background:${mainBg}!important}.call-minimized-bar{background:${headerBg}!important}`;
        let scrollbarExtra = `::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-thumb{background:${btnBg};border-radius:8px}::-webkit-scrollbar-track{background:transparent}`;
        style.textContent = `body{background:${bodyBg}!important}.c,.ma,.sp,.wp,.tp,.hp,.kp,.mp{background:${mainBg}!important}.h{background:${headerBg}!important}.ia{background:${inputBg}!important}.btn,.circle-btn,.au,.new-group-btn,.snd,.call-btn,.img-btn,.sticker-btn,.rapid-reply-btn,.ext-toggle-btn,.ext-icon,.ap,#applyThemeBtn,.group-export-btn,.group-toggle-btn{background:${btnBg}!important}.btn:hover,.circle-btn:hover,.au:hover,.new-group-btn:hover,.snd:hover,.call-btn:hover,.img-btn:hover,.sticker-btn:hover,.rapid-reply-btn:hover,.ext-toggle-btn:hover,.ext-icon:hover,.ap:hover,#applyThemeBtn:hover,.group-export-btn:hover,.group-toggle-btn:hover{filter:brightness(0.85)!important}.tab,.mailbox-tab{background:${btnBg}90}.tab.active,.mailbox-tab.active{background:${accent}!important}.group-tag{background:${btnBg}70}.mb{background:${contactBubble}!important}.r .mb{background:${myBubble}!important}${txtFull}${nightExtra}${avatarExtra}${callExtra}${scrollbarExtra}.c .cn,.c .st,.c .si,.c .pt,.c .sl,.c .ir label,.c .mb,.c .mi,.c .tab,.c .btn,.c .group-tag,.c .card-content,.c .ab,.c .new-group-btn,.c .circle-btn,.c .call-btn,.c .img-btn,.c .sticker-btn,.c .rapid-reply-btn,.c .ext-toggle-btn,.c .ext-icon,.c .bb,.c .qbt,.c .message-time,.c .setting-label,.c .search-box,.c .mailbox-tab,.c .group-export-btn,.c .group-toggle-btn{font-size:${fontSize}px!important}`
    }
    fontSizeSlider.oninput = () => { fontSizeValue.textContent = fontSizeSlider.value + 'px' };
    applyThemeBtn.onclick = () => { if (isNight) { isNight = false; localStorage.setItem('nightMode', 'false'); updateNightUI(); } applyTheme(); tp.classList.remove('show') };
    resetThemeBtn.onclick = () => { setThemeInputs(defTheme); applyTheme() };
    loadTheme();

    /* 通话功能 */
    let inCall = false, callStartTime = null, callTimerId = null, callMinimized = false, incomingWaiting = false, isDialing = false, dialTimer = null;
    const callBtn = Q('callBtn'), callWindow = Q('callWindow'), callHeader = Q('callHeader'), callMin = Q('callMin'), callAvatar = Q('callAvatar'), callTimer = Q('callTimer'), callTitle = Q('callTitle'), callBody = Q('callBody'), callHangup = Q('callHangup'), incActions = Q('incActions'), incAccept = Q('incAccept'), incHangup = Q('incHangup'), cmiBar = Q('cmiBar'), cmiTime = Q('cmiTime'), callRestore = Q('callRestore');

    function formatTime(sec) {
        let h = Math.floor(sec / 3600);
        let m = Math.floor((sec % 3600) / 60);
        let s = sec % 60;
        return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    }
    function updateCallUI() { if (!inCall) return; let elapsed = Math.floor((Date.now()-callStartTime)/1000); let timeStr = formatTime(elapsed); callTimer.textContent = timeStr; cmiTime.textContent = timeStr; }
    function resetCallBody() { callBody.querySelector('.call-avatar').style.display = ''; callTimer.style.display = ''; callHangup.style.display = ''; incActions.style.display = 'none'; callTitle.textContent = '通话中'; }
    function clearDialTimer() { if (dialTimer) { clearTimeout(dialTimer); dialTimer = null; } }
    function getCallAvatarHtml() {
        return ctAv && ctAv.startsWith('data:image') 
            ? `<img src="${ctAv}" style="width:100%;height:100%;object-fit:cover">` 
            : `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    }
    function startCall(fromSystem = false) {
        if (inCall) return;
        inCall = true; callStartTime = Date.now(); callMinimized = false; incomingWaiting = false; isDialing = false;
        clearDialTimer();
        callWindow.style.display = 'flex'; callWindow.style.width = '220px'; callWindow.style.height = 'auto'; callWindow.style.borderRadius = '24px';
        callHeader.style.display = 'flex'; callBody.style.display = 'flex'; cmiBar.style.display = 'none';
        resetCallBody();
        callAvatar.innerHTML = getCallAvatarHtml();
        callWindow.style.left = '50%'; callWindow.style.top = '50%'; callWindow.style.transform = 'translate(-50%,-50%)';
        callTimer.textContent = '00:00:00'; cmiTime.textContent = '00:00:00'; callMin.textContent = '—';
        callTimerId = setInterval(updateCallUI, 1000);
        if (!fromSystem) { msgs.push({ id:nid++, senderId:SYS, text:'通话开始', timestamp:Date.now() }); render(); saveAllData(); }
        render();
    }
    function endCall() {
        if (!inCall && !incomingWaiting && !isDialing) return;
        clearInterval(callTimerId); callTimerId = null;
        clearDialTimer();
        if (inCall) {
            let elapsed = Math.floor((Date.now()-callStartTime)/1000);
            msgs.push({ id:nid++, senderId:SYS, text:`通话结束，时长 ${formatTime(elapsed)}`, timestamp:Date.now() });
            saveAllData(); render();
        } else if (incomingWaiting) {
            msgs.push({ id:nid++, senderId:SYS, text:'未接来电', timestamp:Date.now() });
            saveAllData();
        } else if (isDialing) {
            msgs.push({ id:nid++, senderId:SYS, text:'对方未接听', timestamp:Date.now() });
            saveAllData();
        }
        callWindow.style.display = 'none'; inCall = false; callMinimized = false; incomingWaiting = false; isDialing = false;
        render();
    }
    function incomingCall() {
        if (inCall || incomingWaiting || isDialing) return;
        incomingWaiting = true;
        callWindow.style.display = 'flex'; callWindow.style.width = '220px'; callWindow.style.height = 'auto'; callWindow.style.borderRadius = '24px';
        callHeader.style.display = 'flex'; callBody.style.display = 'flex'; cmiBar.style.display = 'none';
        callTitle.textContent = '来电';
        callAvatar.innerHTML = getCallAvatarHtml();
        callTimer.style.display = 'none'; callHangup.style.display = 'none'; incActions.style.display = 'flex';
        callWindow.style.left = '50%'; callWindow.style.top = '50%'; callWindow.style.transform = 'translate(-50%,-50%)';
    }
    function startDialing() {
        if (inCall || incomingWaiting || isDialing) return;
        isDialing = true;
        callWindow.style.display = 'flex'; callWindow.style.width = '220px'; callWindow.style.height = 'auto'; callWindow.style.borderRadius = '24px';
        callHeader.style.display = 'flex'; callBody.style.display = 'flex'; cmiBar.style.display = 'none';
        callTitle.textContent = '正在呼叫...';
        callAvatar.innerHTML = getCallAvatarHtml();
        callTimer.style.display = 'none'; callHangup.style.display = 'none'; incActions.style.display = 'none';
        callWindow.style.left = '50%'; callWindow.style.top = '50%'; callWindow.style.transform = 'translate(-50%,-50%)';
        const delay = Math.floor(Math.random() * 2000) + 1000;
        dialTimer = setTimeout(() => {
            if (Math.random() < 0.6) { isDialing = false; startCall(true); }
            else { endCall(); }
        }, delay);
    }
    incAccept.onclick = () => { incomingWaiting = false; startCall(true); };
    incHangup.onclick = () => { endCall(); };
    callBtn.onclick = () => { if (inCall) { endCall(); } else if (incomingWaiting) { endCall(); } else if (isDialing) { endCall(); } else { startDialing(); } };
    callHangup.onclick = endCall;
    callMin.onclick = (e) => {
        e.stopPropagation();
        if (incomingWaiting || isDialing) return;
        if (!callMinimized) {
            callWindow.style.width = '160px'; callWindow.style.height = '40px'; callWindow.style.borderRadius = '20px';
            callHeader.style.display = 'none'; callBody.style.display = 'none'; cmiBar.style.display = 'flex'; callMinimized = true;
        } else {
            callWindow.style.width = '220px'; callWindow.style.height = 'auto'; callWindow.style.borderRadius = '24px';
            callHeader.style.display = 'flex'; callBody.style.display = 'flex'; cmiBar.style.display = 'none'; callMinimized = false;
        }
    };
    callRestore.onclick = () => { callMin.click(); };
    callMin.addEventListener('mousedown', (e) => { e.stopPropagation(); });
    callMin.addEventListener('touchstart', (e) => { e.stopPropagation(); }, {passive: false});
    callRestore.addEventListener('mousedown', (e) => { e.stopPropagation(); });
    callRestore.addEventListener('touchstart', (e) => { e.stopPropagation(); }, {passive: false});
    let dragInfo = null;
    function startDrag(e) {
        if (incomingWaiting || isDialing) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const rect = callWindow.getBoundingClientRect();
        callWindow.style.left = rect.left + 'px';
        callWindow.style.top = rect.top + 'px';
        callWindow.style.transform = 'none';
        dragInfo = { x: clientX - rect.left, y: clientY - rect.top };
        if (e.touches && e.cancelable) e.preventDefault();

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
        document.addEventListener('touchcancel', endDrag);
    }
    function onDrag(e) {
        if (!dragInfo) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        callWindow.style.left = (clientX - dragInfo.x) + 'px';
        callWindow.style.top = (clientY - dragInfo.y) + 'px';
        callWindow.style.transform = 'none';
        if (e.touches && e.cancelable) e.preventDefault();
    }
    function endDrag() {
        dragInfo = null;
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchend', endDrag);
        document.removeEventListener('touchcancel', endDrag);
    }
    callHeader.addEventListener('mousedown', startDrag);
    callHeader.addEventListener('touchstart', startDrag, { passive: false });
    cmiBar.addEventListener('mousedown', startDrag);
    cmiBar.addEventListener('touchstart', startDrag, { passive: false });

    let incomingCallTimer = null;
    function scheduleIncomingCall() {
        clearTimeout(incomingCallTimer);
        const minDelay = 10 * 60 * 1000;
        const maxDelay = 120 * 60 * 1000;
        const delay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;
        incomingCallTimer = setTimeout(() => {
            if (!inCall && !incomingWaiting && !isDialing) {
                incomingCall();
            }
            scheduleIncomingCall();
        }, delay);
    }
    scheduleIncomingCall();

    function renderHist() {
        let filtered = msgs.slice();
        const searchTerm = historySearch.value.trim().toLowerCase();
        if (searchTerm) filtered = filtered.filter(m => m.text.toLowerCase().includes(searchTerm));
        const dateVal = historyDate.value;
        if (dateVal) { const selectedDate = new Date(dateVal+'T00:00:00'); filtered = filtered.filter(m => { const d = new Date(m.timestamp); return d.getFullYear()===selectedDate.getFullYear()&&d.getMonth()===selectedDate.getMonth()&&d.getDate()===selectedDate.getDate() }); }
        filtered.sort((a,b) => a.timestamp - b.timestamp);
        let html = '';
        filtered.forEach(m => { const d = new Date(m.timestamp), time = `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`, date = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`, sender = m.senderId===MY ? (myName||'我') : m.senderId===CT ? (ctName||'对方') : '系统'; let preview = m.msgType==='image'?'[图片]':esc(m.text).substring(0,50);
            html += `<div class="history-msg" data-mid="${m.id}"><div class="meta"><span>${sender}</span><span>${date} ${time}</span></div><div class="preview">${preview}</div></div>`; });
        historyList.innerHTML = html || '<div class="eh">暂无匹配记录</div>';
        historyList.querySelectorAll('.history-msg').forEach(el => { el.onclick = () => { const mid = parseInt(el.dataset.mid); hp.classList.remove('show'); highlight(mid); }; });
    }
    historySearch.oninput = renderHist;
    jumpDateBtn.onclick = () => { if (historyDate.value) renderHist(); };
    clearDateFilter.onclick = () => { historyDate.value = ''; renderHist(); };

    /* 修复 ⑦: 释放 Blob URL 避免内存泄漏 (导出聊天记录) */
    exportHistoryBtn.onclick = () => { 
        const dataStr = JSON.stringify(msgs, null, 2); 
        const blob = new Blob([dataStr], { type:'application/json' }); 
        downloadOrShare(blob, 'chat_history.json');
    };

    importHistoryBtn.onclick = () => historyJSONInput.click();
    historyJSONInput.onchange = (e) => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                let data = JSON.parse(ev.target.result);
                let targetMsgs = null;
                if (Array.isArray(data)) targetMsgs = data;
                else if (data && Array.isArray(data.msgs)) targetMsgs = data.msgs;

                if (targetMsgs) {
                    customConfirm('导入将替换当前聊天记录，确定继续吗？', () => {
                        msgs = targetMsgs;
                        nid = Math.max(...msgs.map(m => m.id),0)+1;
                        render(); renderHist(); saveAllData();
                        customAlert('聊天记录导入成功');
                    });
                } else {
                    customAlert('无效的聊天记录文件（期望数组格式）');
                }
            } catch(ex) {
                customAlert('无效的JSON文件');
            }
        };
        reader.readAsText(file);
        historyJSONInput.value = '';
    };

    clearAllHistoryBtn.onclick = async () => {
        customConfirm('确定要永久清除所有聊天记录吗？此操作不可恢复。', async () => {
            msgs = []; nid = 1000;
            render();
            await clearIndexedDB();
            saveAllData();
            customAlert('聊天记录已清除');
        });
    };

    function renderGroupBar() {
        const newGrpBtn = document.getElementById('newGroupBtn');
        if (currentTab !== 'text') { groupBar.style.display = 'none'; if(newGrpBtn) newGrpBtn.style.display = 'none'; return; }
        if (newGrpBtn) newGrpBtn.style.display = 'inline-flex';
        groupBar.style.display = 'flex';
        const rightArrowSvg = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px;margin-right:2px"><polyline points="9 18 15 12 9 6"/></svg>`;
        const editSvg = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`;
        const closeSvg = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
        const plusSvg = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px;margin-right:2px"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
        const exportSvg = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px;margin-right:2px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`;
        const upArrowSvg = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px;margin-right:2px"><polyline points="18 15 12 9 6 15"/></svg>`;

        let h = groups.map(g => {
            let isActive = currentGroupFilter === g.id;
            return `<div class="group-tag ${isActive?'active':''}" data-group-id="${g.id}" style="border-color:${g.color}"><span class="group-color" style="background:${g.color}"></span>${g.name}<button class="group-edit-btn" data-edit-group="${g.id}">${editSvg}</button>${g.id!=='default'?`<button class="group-edit-btn" data-del-group="${g.id}">${closeSvg}</button>`:''}</div>`;
        }).join('');
        groupBar.innerHTML = h;
        document.querySelectorAll('.group-tag').forEach(el => { el.addEventListener('click', e => { if (!e.target.closest('button')) { currentGroupFilter = el.dataset.groupId; renderWB() } }) });
        document.querySelectorAll('[data-edit-group]').forEach(b => b.onclick = e => {
            e.stopPropagation(); let gid = b.dataset.editGroup, g = groups.find(g => g.id === gid);
            if (g) {
                customPrompt('修改分组名称', g.name, (nn) => {
                    if (nn !== null && nn.trim()) {
                        customPrompt('修改颜色代码 (如 #A9BD70)', g.color, (nc) => {
                            g.name = nn.trim(); g.color = nc || g.color; renderWB(); saveAllData();
                        });
                    }
                });
            }
        });
        document.querySelectorAll('[data-del-group]').forEach(b => b.onclick = e => {
            e.stopPropagation(); let gid = b.dataset.delGroup;
            customConfirm('确定要删除分组吗？卡片将移至默认分组', () => {
                groups = groups.filter(g => g.id !== gid);
                textCards.forEach(c => { if (c.groupId === gid) c.groupId = 'default' });
                if (currentGroupFilter === gid) currentGroupFilter = 'all';
                renderWB(); saveAllData();
            });
        });
    }

    /* 修复 ⑦: 释放 Blob URL 避免内存泄漏 (导出分组字卡) */
    function exportGroupJSON(groupId) {
        let group = groups.find(g => g.id === groupId);
        if (!group) return;
        let filteredTextCards = textCards.filter(c => c.groupId === groupId);
        let data = { text: filteredTextCards, emoji: emojiCards, image: imageCards, status: statusCards, groups, exportGroupId: groupId, exportGroupName: group.name };
        let blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        downloadOrShare(blob, 'wordbank_' + group.name + '.json');
    }

    function getCardListArray() { if (currentTab === 'text') return textCards; if (currentTab === 'emoji') return emojiCards; if (currentTab === 'image') return imageCards; if (currentTab === 'status') return statusCards; return []; }
    function renderWB() {
        renderGroupBar();
        let s = wbSearch.value.toLowerCase(), list = getCardListArray();
        if (currentTab === 'text' && currentGroupFilter !== 'all') list = list.filter(c => c.groupId === currentGroupFilter);
        let filtered = list.filter(c => c.content.toLowerCase().includes(s));
        cardList.classList.toggle('grid', currentTab === 'image');
        let h = '';
        const cardEditSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`;
        const cardTrashSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`;
        const cardCloseSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
        filtered.forEach(c => { let gc = '#ccc'; if (currentTab === 'text' && c.groupId) { let g = groups.find(g => g.id === c.groupId); if (g) gc = g.color } if (currentTab === 'image') { h += `<div class="card-item img-card" style="border-left-color:${gc}"><img class="card-img" src="${c.content}"><button class="img-del-btn" data-del="${c.id}">${cardCloseSvg}</button></div>` } else { h += `<div class="card-item" style="border-left-color:${gc}"><div class="card-content">${esc(c.content)}</div><div class="card-actions"><button class="ab" data-edit="${c.id}" title="编辑">${cardEditSvg}</button><button class="card-del" data-del="${c.id}" title="删除">${cardTrashSvg}</button></div></div>` } });
        cardList.innerHTML = h || '<div class="eh">暂无字卡</div>'
    }
    function addCard(content, type, groupId = 'default') {
        let arr = getCardArrByType(type);
        if (arr.some(c => c.content === content)) { customAlert('内容重复'); return false }
        arr.push({ id: Date.now()+Math.random(), content, groupId: (type==='text'||type==='status')?groupId:undefined });
        if (type === 'status') updateContactStatus(true);
        renderWB(); saveAllData(); return true;
    }
    function getCardArrByType(type) { if (type==='text') return textCards; if (type==='emoji') return emojiCards; if (type==='image') return imageCards; if (type==='status') return statusCards; return []; }
    function deleteCard(id, type) { 
        let arr = getCardArrByType(type); 
        let idx = arr.findIndex(c => c.id == id); 
        if (idx !== -1) arr.splice(idx,1); 
        if (type === 'status') updateContactStatus(true);
        renderWB(); saveAllData(); 
    }
    function importText(text, type, groupId='default') {
        let lines = text.split('\n').map(l => l.trim()).filter(l => l);
        let arr = getCardArrByType(type);
        let added = 0;
        lines.forEach(l => {
            if (!arr.some(c => c.content === l)) {
                arr.push({ id: Date.now()+Math.random(), content: l, groupId: (type==='text'||type==='status')?groupId:undefined });
                added++;
            }
        });
        if (added > 0) { 
            if (type === 'status') updateContactStatus(true);
            renderWB(); saveAllData(); 
        }
        customAlert(`导入了 ${added} 条`);
    }
    wbImportText.onclick = () => { if (currentTab === 'image') { imgUploadInput.click() } else { importArea.style.display = 'block'; importTextArea.value = ''; importTextArea.placeholder = currentTab==='text'?'每行一条主字卡':currentTab==='emoji'?'每行一条Emoji':currentTab==='status'?'每行一条状态':'每行一条' } };
    wbUploadImg.onclick = () => imgUploadInput.click();
    document.getElementById('newGroupBtn')?.addEventListener('click', () => {
        customPrompt('请输入分组名称', '新分组', (name) => {
            if (name && name.trim()) {
                customPrompt('颜色代码 (可选)', '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0'), (color) => {
                    groups.push({ id: Date.now()+'-'+Math.random(), name: name.trim(), color: color||'#90943f' });
                    renderWB(); saveAllData();
                });
            }
        });
    });

    function handleImportConfirm(e) {
        e.preventDefault();
        let gid = 'default';
        if (currentTab === 'text') gid = currentGroupFilter !== 'all' ? currentGroupFilter : 'default';
        importText(importTextArea.value, currentTab, gid);
        importTextArea.value = '';
        importArea.style.display = 'none';
    }
    function handleImportCancel(e) { if (e) e.preventDefault(); importArea.style.display = 'none'; }
    confirmImport.addEventListener('click', handleImportConfirm);
    cancelImport.addEventListener('click', handleImportCancel);

    imgUploadInput.onchange = e => {
        let files = e.target.files;
        if (!files.length) return;
        Array.from(files).forEach(f => {
            compressImage(f, (compressed) => { addCard(compressed, 'image'); });
        });
        renderWB(); imgUploadInput.value = '';
    };
    wbExport.onclick = () => {
        const choiceList = '0: 全部字卡\n' + groups.map((g, idx) => `${idx+1}: ${g.name}`).join('\n');
        customPrompt(`请选择导出方式 (输入数字)：\n${choiceList}`, '0', (choice) => {
            if (choice === null) return;
            const num = parseInt(choice);
            if (isNaN(num) || num < 0 || num > groups.length) { customAlert('无效选择'); return; }
            if (num === 0) { exportAllJSON(); } else { exportGroupJSON(groups[num-1].id); }
        });
    };

    /* 修复 ⑦: 释放 Blob URL 避免内存泄漏 (导出全部字卡) */
    function exportAllJSON() { 
        let data = { text: textCards, emoji: emojiCards, image: imageCards, status: statusCards, groups }; 
        let blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); 
        downloadOrShare(blob, 'wordbank.json');
    }

    wbImportJSON.onclick = () => jsonUploadInput.click();
    jsonUploadInput.onchange = e => { let f = e.target.files[0]; if (!f) return; let r = new FileReader(); r.onload = ev => { try { let data = JSON.parse(ev.target.result); textCards = data.text || []; emojiCards = data.emoji || []; imageCards = data.image || []; statusCards = data.status || []; groups = data.groups || [{ id: 'default', name: '未分组', color: '#90943f' }]; const defaultGroup = groups.find(g => g.id === 'default'); if (defaultGroup && defaultGroup.name === 'name') defaultGroup.name = '未分组'; if (!groups.some(g => g.id === 'default')) groups.unshift({ id: 'default', name: '未分组', color: '#90943f' }); updateContactStatus(true); renderWB(); saveAllData(); } catch(ex) { customAlert('无效JSON') } }; r.readAsText(f); jsonUploadInput.value = ''; };
    cardList.addEventListener('click', e => {
        let delBtn = e.target.closest('[data-del]');
        if (delBtn) {
            customConfirm('确定要删除这张卡片吗？', () => { deleteCard(delBtn.dataset.del, currentTab); });
            return;
        }
        let editBtn = e.target.closest('[data-edit]');
        if (editBtn) {
            let id = editBtn.dataset.edit, arr = getCardListArray(), c = arr.find(c => c.id == id);
            if (c) {
                customPrompt('编辑内容', c.content, (nv) => {
                    if (nv !== null && nv.trim()) {
                        if (arr.some(x => x.content === nv.trim() && x.id !== id)) customAlert('内容重复');
                        else {
                            c.content = nv.trim();
                            if (currentTab === 'text') {
                                let opts = groups.map(g => `${g.name}:${g.id}`).join(',');
                                customPrompt('分组ID (可选: '+opts+')', c.groupId, (ng) => {
                                    if (ng && groups.some(g => g.id === ng.trim())) c.groupId = ng.trim();
                                    renderWB(); saveAllData();
                                });
                            } else {
                                if (currentTab === 'status') updateContactStatus(true);
                                renderWB(); saveAllData();
                            }
                        }
                    }
                });
            }
        }
    });
    tabs.forEach(t => t.onclick = () => { tabs.forEach(tb => tb.classList.remove('active')); t.classList.add('active'); currentTab = t.dataset.tab; currentGroupFilter = 'all'; wbSearch.value = ''; renderWB() });
    wbSearch.oninput = renderWB;
    wbBack.onclick = () => wp.classList.remove('show');
    updateContactStatus(true);
    render(); updSlider(); applySet();

    function adjustLayout() {
        const c = document.querySelector('.c');
        if (!c) return;
        const availableHeight = window.innerHeight - 32;
        c.style.height = Math.min(availableHeight, 640) + 'px';
        c.style.transform = 'translateY(-24px)';
    }
    window.addEventListener('resize', adjustLayout);
    if (window.visualViewport) { window.visualViewport.addEventListener('resize', adjustLayout); }
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', adjustLayout); } else { adjustLayout(); }
})();
