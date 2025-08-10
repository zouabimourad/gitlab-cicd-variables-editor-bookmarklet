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
        // Load Monaco Editor from CDN
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js');

        // Configure require paths for Monaco
        window.require.config({
            paths: {
                'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs'
            }
        });

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
            if (editor) {
                textarea.value = editor.getValue();
            }
            closePopin();
            textarea.focus();
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
        // Create a div for Monaco editor
        const monacoContainer = document.createElement('div');
        monacoContainer.style.height = '100%';
        monacoContainer.style.width = '100%';
        editorContainer.appendChild(monacoContainer);
        
        // Detect language based on content
        let language = 'yaml'; // Default language

        function detectFormat(t) {
            t = t.trim();
            if (/^[\{\[]/.test(t) && (()=>{try{return JSON.parse(t),1}catch(e){}})()) return "json";
            if (/^\[.+\]\s*\n(?:.+\n)*?.+=.+$/m.test(t)) return /".*"|\[.*\]|\d+/.test(t) ? "toml" : "ini";
            if (/^[^:\n]+:\s*.+$/m.test(t)) return "yaml";
            return "unknown";
        }

        const content = textarea.value;
        language = detectFormat( content);

        // Initialize Monaco editor
        let editor;
        window.require(['vs/editor/editor.main'], function() {
            editor = monaco.editor.create(monacoContainer, {
                value: textarea.value,
                language: language,
                theme: 'vs-light',
                automaticLayout: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 11,
                tabSize: 2
            });
            
            // Focus the editor
            editor.focus();
        });

        function onEscape(e) {
            if (e.key === 'Escape' && document.body.contains(overlay)) {
                e.stopPropagation();
                e.preventDefault();
                closePopin();
            }
        }
        document.addEventListener('keydown', onEscape, true);

        // Monaco handles resize automatically with automaticLayout: true
        window.addEventListener('resize', () => {
            // No need to manually refresh as Monaco handles this
        });

        function closePopin() {
            document.removeEventListener('keydown', onEscape, true);
            window.removeEventListener('resize', () => {});
            if (editor) {
                editor.dispose(); // Properly dispose Monaco editor
            }
            overlay.remove();
        }
    }

    initEditor();
})();