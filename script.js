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

  // 執行 Blockly 程式碼
  window.runBlockly = function () {
      var code = Blockly.JavaScript.workspaceToCode(workspace);
      try {
          var result = eval(code);
          document.getElementById('output').innerText = '結果: ' + result;
      } catch (e) {
          document.getElementById('output').innerText = '錯誤: ' + e.message;
      }
  };
});
