document.addEventListener('DOMContentLoaded', function () {
    // 創建 Blockly 工作區
    var workspace = Blockly.inject('blocklyDiv', {
        toolbox: '<xml></xml>'
    });

    // 解析 Python 程式碼並生成對應的 Blockly 積木
    function parsePythonToBlocks(pythonCode) {
        var blocks = [];
        var lines = pythonCode.split('\n'); // 按行分割程式碼

        lines.forEach(function (line) {
            line = line.trim();

            // 支援 print 語句
            var printRegex = /^print\(["'](.*?)["']\)$/;
            if (printRegex.test(line)) {
                var match = line.match(printRegex);
                if (match) {
                    var printText = match[1];
                    console.log('提取的字串:', printText);

                    // 創建 text 積木的 XML
                    var textBlockXml = `
                        <block type="text">
                            <field name="TEXT">${printText}</field>
                        </block>`;

                    // 創建 text_print 積木的 XML
                    var printBlockXml = `
                        <block type="text_print"></block>`;

                    var parser = new DOMParser();
                    var printDom = parser.parseFromString(printBlockXml, "text/xml").documentElement;
                    var textDom = parser.parseFromString(textBlockXml, "text/xml").documentElement;
                    
                    // 分別加入積木清單
                    blocks.push(printDom);
                    blocks.push(textDom);
                }
            }

            // 支援 if 語句
            var ifRegex = /^if\s+(.*):$/;
            if (ifRegex.test(line)) {
                var match = line.match(ifRegex);
                if (match) {
                    var condition = match[1];
                    console.log('提取的條件:', condition);

                    var ifBlockXml = `
                        <block type="controls_if">
                            <mutation elseif="0" else="0"></mutation>
                            <value name="IF0">
                                <block type="logic_compare">
                                    <field name="OP">EQ</field>
                                    <value name="A">
                                        <block type="text">
                                            <field name="TEXT">${condition}</field>
                                        </block>
                                    </value>
                                </block>
                            </value>
                        </block>`;
                    var parser = new DOMParser();
                    var ifDom = parser.parseFromString(ifBlockXml, "text/xml").documentElement;
                    blocks.push(ifDom);
                }
            }

            // 支援 else 語句
            if (line === "else:") {
                var elseBlockXml = `
                    <block type="controls_if">
                        <mutation elseif="0" else="1"></mutation>
                    </block>`;
                var parser = new DOMParser();
                var elseDom = parser.parseFromString(elseBlockXml, "text/xml").documentElement;
                blocks.push(elseDom);
            }

            // 支援 for 迴圈
            var forRegex = /^for\s+(\w+)\s+in\s+range\((\d+),(\d+)\):$/;
            if (forRegex.test(line)) {
                var match = line.match(forRegex);
                if (match) {
                    var iterator = match[1];
                    var start = match[2];
                    var end = match[3];
                    console.log('提取的迴圈:', iterator, start, end);

                    var forBlockXml = `
                        <block type="controls_for">
                            <field name="VAR">${iterator}</field>
                            <value name="FROM">
                                <block type="math_number">
                                    <field name="NUM">${start}</field>
                                </block>
                            </value>
                            <value name="TO">
                                <block type="math_number">
                                    <field name="NUM">${end}</field>
                                </block>
                            </value>
                            <value name="BY">
                                <block type="math_number">
                                    <field name="NUM">1</field>
                                </block>
                            </value>
                        </block>`;
                    var parser = new DOMParser();
                    var forDom = parser.parseFromString(forBlockXml, "text/xml").documentElement;
                    blocks.push(forDom);
                }
            }

            // 支援 while 迴圈
            var whileRegex = /^while\s+(.*):$/;
            if (whileRegex.test(line)) {
                var match = line.match(whileRegex);
                if (match) {
                    var condition = match[1];
                    console.log('提取的條件:', condition);

                    var whileBlockXml = `
                        <block type="controls_whileUntil">
                            <field name="MODE">WHILE</field>
                            <value name="BOOL">
                                <block type="logic_compare">
                                    <field name="OP">EQ</field>
                                    <value name="A">
                                        <block type="text">
                                            <field name="TEXT">${condition}</field>
                                        </block>
                                    </value>
                                </block>
                            </value>
                        </block>`;
                    var parser = new DOMParser();
                    var whileDom = parser.parseFromString(whileBlockXml, "text/xml").documentElement;
                    blocks.push(whileDom);
                }
            }
        });

        return blocks;
    }

    // 複製程式碼到剪貼簿並生成對應積木
    window.convertCode = function () {
        var clipboardContent = document.getElementById('clipboardContent').value.trim();
        console.log('剪貼簿中的程式碼：', clipboardContent);

        // 將 Python 程式碼轉換為積木
        var blocks = parsePythonToBlocks(clipboardContent);
        if (blocks.length > 0) {
            var toolboxXml = '<xml>';
            blocks.forEach(function (blockDom) {
                toolboxXml += `<block type="${blockDom.getAttribute('type')}"></block>`;
            });
            toolboxXml += '</xml>';

            var toolboxParser = new DOMParser();
            var toolboxDom = toolboxParser.parseFromString(toolboxXml, "text/xml").documentElement;

            if (workspace && typeof workspace.updateToolbox === 'function') {
                workspace.updateToolbox(toolboxDom);
                blocks.forEach(function (blockDom) {
                    Blockly.Xml.appendDomToWorkspace(blockDom, workspace);
                });
                alert('程式碼已成功轉換為積木塊並添加到 Blockly！');
            } else {
                console.error('工作區未初始化或 updateToolbox 方法不可用。');
            }
        } else {
            alert('無法識別程式碼，無法生成積木！');
        }
    };

    // 執行 Blockly 程式碼並驗證是否與剪貼簿一致
    window.runBlockly = function () {
        console.log('runBlockly 函數被觸發');

        // 提取 Blockly 工作區生成的程式碼
        var workspaceCode = Blockly.Python.workspaceToCode(workspace).trim();
        console.log('工作區程式碼 (Python 生成器)：', workspaceCode);

        // 提取剪貼簿中的程式碼
        var clipboardContent = document.getElementById('clipboardContent').value.trim();
        console.log('剪貼簿程式碼：', clipboardContent);

        // 定義轉換函數，將程式碼標準化
        function normalizeCode(code) {
            // 去除空格和多餘換行
            code = code.replace(/\s+/g, ' ').trim();
            return code;
        }

        // 標準化兩段程式碼
        var normalizedWorkspaceCode = normalizeCode(workspaceCode);
        var normalizedClipboardCode = normalizeCode(clipboardContent);

        console.log('標準化後的工作區程式碼 (Python 生成器)：', normalizedWorkspaceCode);
        console.log('標準化後的剪貼簿程式碼：', normalizedClipboardCode);

        // 比較標準化後的程式碼
        if (normalizedWorkspaceCode === normalizedClipboardCode) {
            document.getElementById('output').innerText = '驗證成功：程式碼一致！';
        } else {
            document.getElementById('output').innerText =
                `驗證失敗：程式碼不一致。\n標準化後的工作區程式碼：\n${normalizedWorkspaceCode}\n\n標準化後的剪貼簿程式碼：\n${normalizedClipboardCode}`;
        }
    };
});