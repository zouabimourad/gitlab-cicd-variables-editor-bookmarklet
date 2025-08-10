(function () {
    const textarea = document.querySelector('#ci-variable-value');
    if (!textarea) return;

    function loadScript(url) {
        return new Promise(resolve => {
            const s = document.createElement('script');
            s.src = url;
            s.onload = resolve;
            document.head.appendChild(s);
        });
    }

    function loadCSS(url) {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = url;
        document.head.appendChild(l);
    }

    async function initEditor() {
        const codeMirrorBaseUrl = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13';
        loadCSS(codeMirrorBaseUrl + '/codemirror.min.css');
        loadCSS(codeMirrorBaseUrl + '/theme/neo.min.css');
        await loadScript(codeMirrorBaseUrl + '/codemirror.min.js');
        await loadScript(codeMirrorBaseUrl + '//mode/yaml/yaml.min.js');

        const overlay = document.createElement('div');
        overlay.style = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9998; display: flex; align-items: center; justify-content: center;';

        const modal = document.createElement('div');
        modal.style = 'background: white; border: 2px solid #444; border-radius: 8px; width: 80%; height: 80%; display: flex; flex-direction: column; padding: 10px; box-sizing: border-box;';

        const editorContainer = document.createElement('div');
        editorContainer.style = 'flex: 1; display: flex; min-height: 0;';

        const buttonRow = document.createElement('div');
        buttonRow.style = 'margin-top: 10px; display: flex; justify-content: flex-end; gap: 6px;';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '💾 Save & Close';
        saveBtn.style = 'padding: 4px 10px; font-size: 12px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;';
        saveBtn.addEventListener('click', e => {
            e.stopPropagation();
            textarea.value = cm.getValue();
            closePopin();
            textarea.focus()
        });
        const exitBtn = document.createElement('button');
        exitBtn.textContent = '❌ Exit';
        exitBtn.style = 'padding: 4px 10px; font-size: 12px; background: #d9534f; color: white; border: none; border-radius: 4px; cursor: pointer;';
        exitBtn.addEventListener('click', e => {
            e.stopPropagation();
            closePopin();
        });
        buttonRow.appendChild(exitBtn);
        buttonRow.appendChild(saveBtn);
        modal.appendChild(editorContainer);
        modal.appendChild(buttonRow);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        const cm = CodeMirror(editorContainer, {
            value: textarea.value,
            mode: 'yaml',
            theme: 'neo',
            lineNumbers: true,
            tabSize: 2,
            indentUnit: 2
        });
        const wrapper = cm.getWrapperElement();
        wrapper.style.height = '100%';
        wrapper.style.width = '100%';
        wrapper.style.fontSize = '11px';
        cm.refresh();
        cm.focus();

        function onEscape(e) {
            if (e.key === 'Escape' && document.body.contains(overlay)) {
                e.stopPropagation();
                e.preventDefault();
                closePopin();
            }
        }
        document.addEventListener('keydown', onEscape, true);

        function onResize() {
            cm.refresh();
        }
        window.addEventListener('resize', onResize);

        function closePopin() {
            document.removeEventListener('keydown', onEscape, true);
            window.removeEventListener('resize', onResize);
            overlay.remove();
        }
    }

    initEditor();
})();