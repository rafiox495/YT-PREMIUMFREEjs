// ==UserScript==
// @name         YouTube Premium 1:1
// @namespace    http://tampermonkey.net/
// @version      23.0
// @description  YouTube Premium
// @author       Rafiox495
// @license      MIT
// @match        *://*.youtube.com/*
// @match        *://*.youtube-nocookie.com/*
// @exclude      *://*.youtube.com/live_chat*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      loader.to
// @connect      api.cobalt.tools
// @connect      cobalt.api.kuylar.dev
// @connect      api.wuk.sh
// @connect      i.ytimg.com
// @connect      *
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const uw = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    /* ==========================================================================
       1. ODTWARZANIE W TLE (BACKGROUND PLAY)
       ========================================================================== */
    try {
        Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
        Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
        Object.defineProperty(document, 'webkitVisibilityState', { get: () => 'visible', configurable: true });
        document.hasFocus = () => true;

        const stopProp = (e) => e.stopImmediatePropagation();
        ['visibilitychange', 'webkitvisibilitychange', 'blur'].forEach(evt => {
            window.addEventListener(evt, stopProp, true);
            document.addEventListener(evt, stopProp, true);
        });
    } catch (_) {}

    /* ==========================================================================
       2. SYSTEM POWIADOMIEŃ TOAST
       ========================================================================== */
    let toastTimer = null;
    let cachedToastEl = null;

    const showToast = (msg, bg = '#0f0f0f') => {
        if (!cachedToastEl || !document.body.contains(cachedToastEl)) {
            cachedToastEl = document.getElementById('yt-premium-direct-toast');
            if (!cachedToastEl) {
                cachedToastEl = document.createElement('div');
                cachedToastEl.id = 'yt-premium-direct-toast';
                Object.assign(cachedToastEl.style, {
                    position: 'fixed', bottom: '80px', left: '50%',
                    transform: 'translateX(-50%) translateY(10px)',
                    color: '#fff', padding: '10px 22px', borderRadius: '24px',
                    fontSize: '13px', fontWeight: '600', zIndex: '2147483647',
                    pointerEvents: 'none', fontFamily: 'Roboto, Arial, sans-serif',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    opacity: '0', transition: 'opacity 0.2s, transform 0.2s'
                });
                document.body.appendChild(cachedToastEl);
            }
        }
        cachedToastEl.textContent = msg;
        cachedToastEl.style.background = bg;
        cachedToastEl.style.opacity = '1';
        cachedToastEl.style.transform = 'translateX(-50%) translateY(0)';
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            if (cachedToastEl) {
                cachedToastEl.style.opacity = '0';
                cachedToastEl.style.transform = 'translateX(-50%) translateY(10px)';
            }
        }, 2800);
    };

    /* ==========================================================================
       3. BUDOWNICZY DOM
       ========================================================================== */
    const SVG_TAGS = new Set(['svg', 'g', 'path', 'polygon', 'text', 'rect']);

    const buildNode = (spec) => {
        if (typeof spec === 'string') return document.createTextNode(spec);
        const el = SVG_TAGS.has(spec.t)
            ? document.createElementNS('http://www.w3.org/2000/svg', spec.t)
            : document.createElement(spec.t);

        if (spec.a) {
            for (const key in spec.a) el.setAttribute(key, spec.a[key]);
        }
        if (spec.s) el.style.cssText = spec.s;
        if (spec.c) {
            for (let i = 0; i < spec.c.length; i++) {
                el.appendChild(buildNode(spec.c[i]));
            }
        }
        return el;
    };

    /* ==========================================================================
       4. LOGO YOUTUBE PREMIUM 1:1
       ========================================================================== */
    const createPremiumSvgNode = () => {
        return buildNode({
            t: 'svg',
            a: {
                viewBox: '0 0 97 20',
                preserveAspectRatio: 'xMidYMid meet',
                focusable: 'false',
                style: 'pointer-events: none; display: block; width: 97px; height: 20px;'
            },
            c: [
                {
                    t: 'g',
                    c: [
                        {
                            t: 'path',
                            a: {
                                d: 'M27.97 3.12C27.64 1.89 26.67.93 25.44.6 23.22 0 14.28 0 14.28 0S5.35 0 3.12.6C1.89.93.92 1.89.6 3.12 0 5.35 0 10 0 10s0 4.65.6 6.88c.32 1.23 1.29 2.19 2.52 2.52 2.23.6 11.16.6 11.16.6s8.94 0 11.16-.6c1.23-.33 2.2-1.29 2.53-2.52.6-2.23.6-6.88.6-6.88s0-4.65-.6-6.88z',
                                fill: '#FF0000'
                            }
                        },
                        {
                            t: 'polygon',
                            a: {
                                points: '11.43 14.29 18.85 10 11.43 5.72',
                                fill: '#FFFFFF'
                            }
                        }
                    ]
                },
                {
                    t: 'g',
                    a: { fill: 'var(--yt-spec-text-primary, currentColor)' },
                    c: [
                        { t: 'path', a: { d: 'M40.06 6.35v.69c0 3.45-1.53 5.47-4.88 5.47h-.51v6.05h-2.74V1.42h3.49c3.19 0 4.64 1.35 4.64 4.93zm-2.88.25c0-2.49-.45-3.09-2-3.09h-.51v6.97h.47c1.47 0 2.04-1.07 2.04-3.37v-.51z' } },
                        { t: 'path', a: { d: 'M46.53 5.83l-.14 3.25c-1.16-.25-2.12-.06-2.55.69v8.78h-2.72V6.04h2.17l.24 2.71h.11c.28-1.98 1.2-2.98 2.39-2.98.17 0 .34.02.5.06z' } },
                        { t: 'path', a: { d: 'M49.66 13.25v.63c0 2.21.12 2.96 1.06 2.96.9 0 1.1-.69 1.12-2.12l2.43.14c.18 2.7-1.23 3.9-3.61 3.9-2.9 0-3.76-1.9-3.76-5.35v-2.19c0-3.64.96-5.41 3.84-5.41 2.9 0 3.64 1.51 3.64 5.29v2.15h-4.72zm0-2.58h2.06v-.9c0-2.3-.16-2.96-1.03-2.96-.87 0-1.03.67-1.03 2.96v.9z' } },
                        { t: 'path', a: { d: 'M68.41 9.1v9.46h-2.82V9.31c0-1.02-.27-1.53-.88-1.53-.49 0-.94.28-1.25.81.02.17.03.34.03.51v9.46h-2.82V9.31c0-1.02-.27-1.53-.88-1.53-.49 0-.92.28-1.23.8v9.98h-2.82V6.04h2.23l.25 1.59h.04c.63-1.2 1.65-1.85 2.85-1.85 1.19 0 1.86.59 2.17 1.65.65-1.08 1.63-1.65 2.75-1.65 1.71 0 2.37 1.22 2.37 3.32z' } },
                        { t: 'path', a: { d: 'M69.82 2.83c0-1.35.49-1.73 1.53-1.73 1.06 0 1.53.45 1.53 1.73 0 1.39-.47 1.74-1.53 1.74-1.04 0-1.53-.35-1.53-1.74zm.16 3.21h2.7v12.52h-2.7V6.04z' } },
                        { t: 'path', a: { d: 'M81.89 6.04v12.52h-2.21l-.24-1.53h-.06c-.63 1.22-1.55 1.74-2.69 1.74-1.67 0-2.43-1.06-2.43-3.37V6.04h2.82v9.19c0 1.1.23 1.55.8 1.55.52 0 .98-.31 1.2-.78V6.04h2.81z' } },
                        { t: 'path', a: { d: 'M96.19 9.1v9.46h-2.82V9.31c0-1.02-.27-1.53-.88-1.53-.49 0-.94.28-1.25.81.02.17.02.34.02.51v9.46h-2.82V9.31c0-1.02-.27-1.53-.88-1.53-.49 0-.92.28-1.22.8v9.98h-2.82V6.04h2.23l.24 1.59h.04c.63-1.2 1.66-1.85 2.86-1.85 1.19 0 1.86.59 2.17 1.65.65-1.08 1.63-1.65 2.76-1.65 1.72 0 2.37 1.22 2.37 3.32z' } }
                    ]
                }
            ]
        });
    };

    let logoInjected = false;
    const injectLogo = () => {
        if (logoInjected) return;
        const logoTarget = document.querySelector('ytd-topbar-logo-renderer #logo-icon') ||
                           document.querySelector('ytd-logo.ytd-topbar-logo-renderer yt-icon') ||
                           document.querySelector('#logo-icon');

        if (logoTarget) {
            const currentSvg = logoTarget.querySelector('svg');
            if (!currentSvg || currentSvg.getAttribute('viewBox') !== '0 0 97 20') {
                logoTarget.textContent = '';
                logoTarget.appendChild(createPremiumSvgNode());
                logoTarget.style.width = '97px';
                logoTarget.style.minWidth = '97px';
                document.querySelector('#logo')?.setAttribute('is-red-logo', '');
                document.querySelector('ytd-topbar-logo-renderer')?.setAttribute('is-premium', '');
            }
            logoInjected = true;
        }
    };

    /* ==========================================================================
       5. SILNIK METADANYCH I TAGOWANIA ID3v2.3
       ========================================================================== */
    const encodeUtf16LE = (str) => {
        const len = str.length;
        const buf = new Uint8Array(2 + len * 2);
        buf[0] = 0xFF; buf[1] = 0xFE;
        for (let i = 0; i < len; i++) {
            const code = str.charCodeAt(i);
            const offset = 2 + (i << 1);
            buf[offset] = code & 0xFF;
            buf[offset + 1] = (code >> 8) & 0xFF;
        }
        return buf;
    };

    const createTextFrame = (frameId, text) => {
        if (!text) return null;
        const encodedText = encodeUtf16LE(text);
        const dataLen = 1 + encodedText.length;
        const frame = new Uint8Array(10 + dataLen);

        for (let i = 0; i < 4; i++) frame[i] = frameId.charCodeAt(i);
        frame[4] = (dataLen >> 24) & 0xFF;
        frame[5] = (dataLen >> 16) & 0xFF;
        frame[6] = (dataLen >> 8) & 0xFF;
        frame[7] = dataLen & 0xFF;

        frame[10] = 1;
        frame.set(encodedText, 11);
        return frame;
    };

    const createCoverArtFrame = (imageBuffer) => {
        if (!imageBuffer || imageBuffer.byteLength === 0) return null;
        const mimeStr = 'image/jpeg';
        const mimeBytes = new Uint8Array(mimeStr.length);
        for (let i = 0; i < mimeStr.length; i++) mimeBytes[i] = mimeStr.charCodeAt(i);

        const payloadLen = 1 + mimeBytes.length + 1 + 1 + 1 + imageBuffer.byteLength;
        const frame = new Uint8Array(10 + payloadLen);

        for (let i = 0; i < 4; i++) frame[i] = 'APIC'.charCodeAt(i);
        frame[4] = (payloadLen >> 24) & 0xFF;
        frame[5] = (payloadLen >> 16) & 0xFF;
        frame[6] = (payloadLen >> 8) & 0xFF;
        frame[7] = payloadLen & 0xFF;

        let ptr = 10;
        frame[ptr++] = 0;
        frame.set(mimeBytes, ptr);
        ptr += mimeBytes.length;
        frame[ptr++] = 0;
        frame[ptr++] = 3;
        frame[ptr++] = 0;
        frame.set(new Uint8Array(imageBuffer), ptr);

        return frame;
    };

    const buildFullId3v2Tag = (meta, coverBuffer) => {
        const frames = [
            createTextFrame('TIT2', meta.title),
            createTextFrame('TPE1', meta.artist),
            createTextFrame('TALB', meta.album),
            createTextFrame('TYER', meta.year),
            createTextFrame('TCOP', meta.copyright),
            createCoverArtFrame(coverBuffer)
        ].filter(Boolean);

        let totalFramesSize = 0;
        for (let i = 0; i < frames.length; i++) totalFramesSize += frames[i].length;

        const header = new Uint8Array(10 + totalFramesSize);
        header[0] = 0x49; header[1] = 0x44; header[2] = 0x33;
        header[3] = 0x03;

        header[6] = (totalFramesSize >> 21) & 0x7F;
        header[7] = (totalFramesSize >> 14) & 0x7F;
        header[8] = (totalFramesSize >> 7) & 0x7F;
        header[9] = totalFramesSize & 0x7F;

        let offset = 10;
        for (let i = 0; i < frames.length; i++) {
            header.set(frames[i], offset);
            offset += frames[i].length;
        }

        return header;
    };

    /* ==========================================================================
       6. POBIERANIE BEZPOŚREDNIE
       ========================================================================== */
    const sanitizeFilename = (name) => name.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, ' ').trim();

    const saveBlobAsFile = (blob, fileName) => {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            a.remove();
            URL.revokeObjectURL(blobUrl);
            showToast(`Pobrano: ${fileName}`, '#2e7d32');
        }, 1500);
    };

    const fetchCoverImage = (videoId) => {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
                responseType: 'arraybuffer',
                onload: (res) => {
                    if (res.status === 200 && res.response && res.response.byteLength > 3000) {
                        resolve(res.response);
                    } else {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                            responseType: 'arraybuffer',
                            onload: (r2) => resolve(r2.status === 200 ? r2.response : null),
                            onerror: () => resolve(null)
                        });
                    }
                },
                onerror: () => resolve(null)
            });
        });
    };

    const extractVideoMetadata = (videoId) => {
        const pr = uw.ytInitialPlayerResponse?.videoDetails;
        const title = pr?.title ||
                      document.querySelector('ytd-watch-metadata h1 yt-formatted-string')?.textContent?.trim() ||
                      document.querySelector('h1.title')?.textContent?.trim() ||
                      document.title.replace(/\s*-\s*YouTube$/i, '');

        const artist = pr?.author ||
                       document.querySelector('ytd-channel-name yt-formatted-string a')?.textContent?.trim() ||
                       document.querySelector('#owner #channel-name a')?.textContent?.trim() ||
                       'YouTube Artist';

        const year = uw.ytInitialPlayerResponse?.microformat?.playerMicroformatRenderer?.publishDate?.slice(0, 4) ||
                     new Date().getFullYear().toString();

        return {
            title,
            artist,
            album: `${artist} (YouTube)`,
            year,
            copyright: `https://www.youtube.com/watch?v=${videoId}`
        };
    };

    const executeDirectDownload = async (format) => {
        const videoId = new URLSearchParams(window.location.search).get('v');
        if (!videoId) {
            showToast('Otwórz najpierw film!', '#b71c1c');
            return;
        }

        const meta = extractVideoMetadata(videoId);
        const safeTitle = sanitizeFilename(`${meta.artist} - ${meta.title}`);
        const currentUrl = `https://www.youtube.com/watch?v=${videoId}`;

        showToast('Pobieranie okładki i przygotowanie...', '#065fd4');
        const coverBuffer = await fetchCoverImage(videoId);

        const formatCode = format === 'mp4' ? '1080' : (format === 'flac' ? 'flac' : 'mp3');
        const loaderEndpoint = `https://loader.to/ajax/download.php?button=1&start=1&end=1&format=${formatCode}&url=${encodeURIComponent(currentUrl)}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: loaderEndpoint,
            headers: { 'Accept': 'application/json' },
            timeout: 9000,
            onload: (res) => {
                try {
                    const data = JSON.parse(res.responseText);
                    if (data.id) {
                        pollDownloadProgress(data.id, meta, safeTitle, format, coverBuffer, currentUrl);
                        return;
                    }
                } catch (_) {}
                fallbackCobaltEngine(currentUrl, format, meta, safeTitle, coverBuffer);
            },
            onerror: () => fallbackCobaltEngine(currentUrl, format, meta, safeTitle, coverBuffer),
            ontimeout: () => fallbackCobaltEngine(currentUrl, format, meta, safeTitle, coverBuffer)
        });
    };

    const pollDownloadProgress = (taskId, meta, filename, format, coverBuffer, currentUrl) => {
        let count = 0;
        const timer = setInterval(() => {
            if (++count > 50) {
                clearInterval(timer);
                fallbackCobaltEngine(currentUrl, format, meta, filename, coverBuffer);
                return;
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://loader.to/ajax/progress.php?id=${taskId}`,
                headers: { 'Accept': 'application/json' },
                onload: (res) => {
                    try {
                        const info = JSON.parse(res.responseText);
                        if (info.progress && info.progress < 1000) {
                            showToast(`Przetwarzanie: ${Math.floor(info.progress / 10)}%...`, '#065fd4');
                        }
                        if (info.success === 1 && info.download_url) {
                            clearInterval(timer);
                            downloadAndMuxAudioFile(info.download_url, meta, filename, format, coverBuffer);
                        } else if (info.success === 0 && info.text?.includes('Error')) {
                            clearInterval(timer);
                            fallbackCobaltEngine(currentUrl, format, meta, filename, coverBuffer);
                        }
                    } catch (_) {}
                },
                onerror: () => {
                    clearInterval(timer);
                    fallbackCobaltEngine(currentUrl, format, meta, filename, coverBuffer);
                }
            });
        }, 1200);
    };

    const downloadAndMuxAudioFile = (streamUrl, meta, filename, format, coverBuffer) => {
        showToast('Zapisywanie tagów ID3...', '#065fd4');

        if (format === 'mp4') {
            saveDirectStream(streamUrl, `${filename}.mp4`);
            return;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: streamUrl,
            responseType: 'arraybuffer',
            onload: (res) => {
                if (res.status === 200 && res.response) {
                    const audioBuffer = res.response;
                    if (format === 'mp3') {
                        const id3TagHeader = buildFullId3v2Tag(meta, coverBuffer);
                        const finalBlob = new Blob([id3TagHeader, audioBuffer], { type: 'audio/mpeg' });
                        saveBlobAsFile(finalBlob, `${filename}.mp3`);
                    } else {
                        const finalBlob = new Blob([audioBuffer], { type: 'audio/flac' });
                        saveBlobAsFile(finalBlob, `${filename}.flac`);
                    }
                } else {
                    saveDirectStream(streamUrl, `${filename}.${format}`);
                }
            },
            onerror: () => saveDirectStream(streamUrl, `${filename}.${format}`)
        });
    };

    const saveDirectStream = (url, fullFileName) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = fullFileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => a.remove(), 1500);
    };

    const fallbackCobaltEngine = (currentUrl, format, meta, filename, coverBuffer) => {
        const nodes = ['https://cobalt.api.kuylar.dev', 'https://api.wuk.sh', 'https://api.cobalt.tools'];
        let idx = 0;

        const body = {
            url: currentUrl,
            videoQuality: "1080",
            downloadMode: format === 'mp4' ? "auto" : "audio",
            youtubeVideoMeta: true
        };
        if (format === 'mp3') body.audioFormat = 'mp3';
        if (format === 'flac') body.audioFormat = 'flac';

        const runNext = () => {
            if (idx >= nodes.length) {
                showToast('Błąd serwerów – spróbuj ponownie za chwilę!', '#b71c1c');
                return;
            }

            GM_xmlhttpRequest({
                method: 'POST',
                url: nodes[idx++],
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                data: JSON.stringify(body),
                timeout: 7000,
                onload: (res) => {
                    try {
                        const d = JSON.parse(res.responseText);
                        if (d && d.url) {
                            downloadAndMuxAudioFile(d.url, meta, filename, format, coverBuffer);
                            return;
                        }
                    } catch (_) {}
                    runNext();
                },
                onerror: runNext,
                ontimeout: runNext
            });
        };

        runNext();
    };

    /* ==========================================================================
       7. PRZYCISKI POBIERANIA
       ========================================================================== */
    const injectDownloadUI = () => {
        if (!document.getElementById('yt-player-dl-btn-v22')) {
            const playerControls = document.querySelector('.ytp-right-controls');
            if (playerControls) {
                const pBtn = buildNode({
                    t: 'button',
                    a: {
                        id: 'yt-player-dl-btn-v22',
                        class: 'ytp-button',
                        title: 'Pobierz wideo/audio'
                    },
                    c: [{
                        t: 'svg',
                        a: {
                            viewBox: '0 0 24 24',
                            width: '100%',
                            height: '100%',
                            fill: '#fff',
                            style: 'padding: 6px; box-sizing: border-box;'
                        },
                        c: [{
                            t: 'path',
                            a: { d: 'M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z' }
                        }]
                    }]
                });

                pBtn.onclick = (e) => {
                    e.stopPropagation();
                    const choice = prompt('Pobieranie:\n1 = Wideo MP4 (Max / 4K)\n2 = Audio MP3 (320 kbps + Okładka)\n3 = Audio FLAC (Bezstratne)', '1');
                    if (choice === '1') executeDirectDownload('mp4');
                    else if (choice === '2') executeDirectDownload('mp3');
                    else if (choice === '3') executeDirectDownload('flac');
                };

                playerControls.insertBefore(pBtn, playerControls.firstChild);
            }
        }

        if (!window.location.pathname.startsWith('/watch')) return;
        if (document.getElementById('yt-native-dl-wrapper-v22')) return;

        const actionAnchor =
            document.querySelector('ytd-watch-metadata #top-level-buttons-computed') ||
            document.querySelector('#actions-inner #top-level-buttons-computed') ||
            document.querySelector('ytd-segmented-like-dislike-button-renderer') ||
            document.querySelector('segmented-like-dislike-button-view-model');

        if (!actionAnchor) return;

        const wrap = buildNode({
            t: 'div',
            a: { id: 'yt-native-dl-wrapper-v22' },
            s: 'position: relative; display: inline-flex; align-items: center; margin-left: 8px; vertical-align: middle; z-index: 1000;',
            c: [
                {
                    t: 'button',
                    a: { id: 'yt-native-dl-trigger-btn' },
                    s: 'background-color: var(--yt-spec-badge-chip-background, rgba(255, 255, 255, 0.1)); color: var(--yt-spec-text-primary, #fff); border: none; border-radius: 18px; height: 36px; padding: 0 16px; display: inline-flex; align-items: center; font-family: Roboto, Arial, sans-serif; font-size: 14px; font-weight: 500; cursor: pointer;',
                    c: [
                        {
                            t: 'svg',
                            a: { viewBox: '0 0 24 24', width: '20', height: '20', fill: 'currentColor', style: 'margin-right: 6px;' },
                            c: [{ t: 'path', a: { d: 'M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z' } }]
                        },
                        'Pobierz'
                    ]
                },
                {
                    t: 'div',
                    a: { id: 'yt-native-dl-menu-box' },
                    s: 'display: none; position: absolute; top: 42px; left: 0; background: #212121; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.8); min-width: 250px; padding: 6px 0; z-index: 999999;',
                    c: [
                        { t: 'div', a: { class: 'dl-opt', 'data-fmt': 'mp4' }, s: 'padding: 10px 16px; font-size: 13px; color: #fff; cursor: pointer;', c: ['🎬 Wideo MP4 (Max / HD / 4K)'] },
                        { t: 'div', a: { class: 'dl-opt', 'data-fmt': 'mp3' }, s: 'padding: 10px 16px; font-size: 13px; color: #fff; cursor: pointer;', c: ['🎵 Audio MP3 (320 kbps + Okładka)'] },
                        { t: 'div', a: { class: 'dl-opt', 'data-fmt': 'flac' }, s: 'padding: 10px 16px; font-size: 13px; color: #fff; cursor: pointer;', c: ['🎧 Audio FLAC (Bezstratne)'] }
                    ]
                }
            ]
        });

        const triggerBtn = wrap.querySelector('#yt-native-dl-trigger-btn');
        const menuBox = wrap.querySelector('#yt-native-dl-menu-box');

        triggerBtn.onclick = (e) => {
            e.stopPropagation();
            menuBox.style.display = menuBox.style.display === 'block' ? 'none' : 'block';
        };

        document.addEventListener('click', () => {
            menuBox.style.display = 'none';
        }, { passive: true });

        wrap.querySelectorAll('.dl-opt').forEach(opt => {
            opt.onmouseover = () => opt.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
            opt.onmouseout = () => opt.style.backgroundColor = 'transparent';
            opt.onclick = (e) => {
                e.stopPropagation();
                menuBox.style.display = 'none';
                executeDirectDownload(opt.getAttribute('data-fmt'));
            };
        });

        if (actionAnchor.tagName.toLowerCase().includes('segmented')) {
            actionAnchor.parentElement.insertBefore(wrap, actionAnchor.nextSibling);
        } else {
            actionAnchor.appendChild(wrap);
        }
    };

    /* ==========================================================================
       8. WYKRYWANIE I BLOKADA
       ========================================================================== */
    const handleAds = () => {
        const skipBtn = document.querySelector('.ytp-skip-ad-button, .ytp-ad-skip-button, .ytp-ad-skip-button-modern');
        if (skipBtn) skipBtn.click();

        const enforcement = document.querySelector('tp-yt-paper-dialog:has(ytd-enforcement-message-view-model), ytd-enforcement-message-view-model');
        if (enforcement) {
            enforcement.closest('tp-yt-paper-dialog')?.remove();
            document.querySelectorAll('tp-yt-iron-overlay-backdrop').forEach(b => b.remove());
            const video = document.querySelector('video');
            if (video && video.paused) video.play().catch(() => {});
        }
    };

    /* ==========================================================================
       9. OPTYMALIZACJA JAKOŚCI
       ========================================================================== */
    const forceHighestQuality = () => {
        const player = uw.document.getElementById('movie_player') || document.getElementById('movie_player');
        if (player && typeof player.getAvailableQualityLevels === 'function') {
            const levels = player.getAvailableQualityLevels();
            if (levels && levels.length > 0) {
                const best = levels[0];
                if (typeof player.setPlaybackQualityRange === 'function') {
                    player.setPlaybackQualityRange(best, best);
                }
            }
        }
    };

    /* ==========================================================================
       10. REGUŁY CSS
       ========================================================================== */
    GM_addStyle(`
        ytd-topbar-logo-renderer #country-code { display: none !important; }

        ytd-rich-item-renderer:has(ytd-ad-slot-renderer),
        #player-ads,
        #panels:has(ytd-ads-engagement-panel-content-renderer),
        ytd-ad-slot-renderer,
        #masthead-ad,
        ytd-reel-video-renderer:has(ytd-ad-slot-renderer),
        ytd-player-legacy-desktop-watch-ads-renderer,
        .ytp-ad-player-overlay-layout,
        .ytp-ad-module, .ytp-ad-overlay-container,
        ytd-in-feed-ad-layout-renderer,
        ytd-banner-promo-renderer, ytd-statement-banner-renderer,
        ytd-mealbar-promo-renderer, ytd-merch-shelf-renderer,
        ytd-compact-promoted-item-renderer, ytd-promoted-video-renderer,
        tp-yt-paper-dialog:has(ytd-enforcement-message-view-model),
        ytd-guide-section-renderer:has(a[href*="/premium"]),
        ytd-compact-link-renderer:has(a[href*="/premium"]) {
            display: none !important;
        }
    `);

    /* ==========================================================================
       11. ZOPTYMALIZOWANY OBSERWATOR (DEBOUNCED)
       ========================================================================== */
    let debounceTimer = null;
    const processMutations = () => {
        handleAds();
        injectLogo();
        injectDownloadUI();
    };

    const observer = new MutationObserver(() => {
        if (debounceTimer) return;
        debounceTimer = setTimeout(() => {
            debounceTimer = null;
            processMutations();
        }, 150);
    });

    window.addEventListener('yt-navigate-finish', () => {
        logoInjected = false;
        setTimeout(() => {
            injectLogo();
            injectDownloadUI();
            forceHighestQuality();
        }, 200);
    }, { passive: true });

    observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
    });

})();
