document.addEventListener('DOMContentLoaded', function () {
  // 創建 Blockly 工作區
  var workspace = Blockly.inject('blocklyDiv', {
      toolbox: '<xml></xml>'
  });

  // 解析 Python 程式碼並生成對應的 Blockly 積木
  function parsePythonToBlockly(pythonCode) {
      var blocks = [];
      var printRegex = /^print\(["'](.*)["']\)$/;
      var match = pythonCode.trim().match(printRegex);

      if (match && match[1]) {
          var printText = match[1].trim();
          console.log('提取的字串:', printText);

          var textBlockXml = `
              <block type="text">
                  <field name="TEXT">${printText}</field>
              </block>`;
          var printBlockXml = `
              <block type="text_print">
                  <value name="TEXT">${textBlockXml}</value>
              </block>`;

          var parser = new DOMParser();
          var printDom = parser.parseFromString(printBlockXml, "text/xml").documentElement;
          blocks.push(printDom);

          var textDom = parser.parseFromString(textBlockXml, "text/xml").documentElement;
          blocks.push(textDom);
      }
      return blocks;
  }

  // 複製程式碼到剪貼簿並生成對應積木
  window.convertCode = function () {
      var clipboardContent = document.getElementById('clipboardContent').value.trim();
      if (/print\(["'](.*)["']\)/.test(clipboardContent)) {
          var blocks = parsePythonToBlockly(clipboardContent);
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
                  alert('程式碼已轉換並添加到 Blockly!');
              } else {
                  console.error('Workspace is not initialized or updateToolbox is unavailable.');
              }
          } else {
              alert('無法識別程式碼!');
          }
      } else {
          alert('未找到有效的程式碼!');
      }
  };

  window.runBlockly = function () {
    console.log('runBlockly 函數被觸發');

    // 提取 Blockly 工作區生成的程式碼
    var workspaceCode = Blockly.JavaScript.workspaceToCode(workspace).trim();
    console.log('工作區程式碼：', workspaceCode);

    // 提取剪貼簿中的程式碼
    var clipboardContent = document.getElementById('clipboardContent').value.trim();
    console.log('剪貼簿程式碼：', clipboardContent);

    // 定義轉換函數，將程式碼標準化
    function normalizeCode(code) {
        // 將 "print" 替換為 JavaScript 的 "alert"
        code = code.replace(/print\(["'](.*)["']\)/g, "window.alert('$1');").trim();
        return code;
    }

    // 標準化兩段程式碼
    var normalizedWorkspaceCode = normalizeCode(workspaceCode);
    var normalizedClipboardCode = normalizeCode(clipboardContent);

    console.log('標準化後的工作區程式碼：', normalizedWorkspaceCode);
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
