// 創建 Blockly 工作區，先不加積木到工具箱
var workspace = Blockly.inject('blocklyDiv', {
    toolbox: `<xml></xml>`,  // 開始時工具箱是空的
  });
  
  // 解析 Python 程式碼並生成對應的 Blockly 積木
  function parsePythonToBlockly(pythonCode) {
    var blocks = [];
    // 這裡的正則表達式將捕獲 print 內的字串
    var printRegex = /^print\(["'](.*)["']\)$/;
    var match = pythonCode.trim().match(printRegex);
  
    if (match && match[1]) {
      // 提取出來的字串並去除前後的空白
      var printText = match[1].trim();
      console.log('提取的字串:', printText); // 用來調試，確保字串被提取
  
      // 檢查提取的字串是否非空
      if (printText) {
        // 生成對應的 text 積木 (表示 "test" 字串)
        var textBlockXml = `
          <block type="text">
            <field name="TEXT">${printText}</field>
          </block>
        `;
  
        // 生成對應的 print 積木，這次 print 積木會引用上面的 text 積木
        var printBlockXml = `
          <block type="text_print">
            <value name="TEXT">
              ${textBlockXml}
            </value>
          </block>
        `;
  
        // 使用 DOMParser 解析 XML 字串
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(printBlockXml, "text/xml");
        var blockDom = xmlDoc.documentElement;
        blocks.push(blockDom);
  
        // 同樣需要創建一個獨立的 text 積木
        var textDom = parser.parseFromString(textBlockXml, "text/xml").documentElement;
        blocks.push(textDom);
      } else {
        console.log('字串為空，無法生成積木');
      }
    }
    return blocks;
  }
  
  // 複製程式碼到剪貼簿並生成對應積木
  function convertCode() {
    var clipboardContent = document.getElementById('clipboardContent').value.trim();
  
    // 檢查是否有 print("test")
    if (/print\(["'](.*)["']\)/.test(clipboardContent)) {
      // 生成 print 和字串積木塊
      var blocks = parsePythonToBlockly(clipboardContent);
  
      if (blocks.length > 0) {
        // 根據生成的積木更新工具箱
        var toolboxXml = '<xml>';
        blocks.forEach(function (blockDom) {
          var blockType = blockDom.getAttribute('type');
          toolboxXml += `<block type="${blockType}"></block>`;
        });
        toolboxXml += '</xml>';
  
        // 使用 DOMParser 解析工具箱的 XML
        var toolboxParser = new DOMParser();
        var toolboxXmlDoc = toolboxParser.parseFromString(toolboxXml, "text/xml");
        var toolboxDom = toolboxXmlDoc.documentElement;
  
        // 更新工具箱，這樣工具箱會有 "print" 積木
        workspace.updateToolbox(toolboxDom);
  
        // 將 Blockly 積木加到工作區
        blocks.forEach(function (blockDom) {
          Blockly.Xml.appendDomToWorkspace(blockDom, workspace);
        });
  
        alert('程式碼已轉換並添加到 Blockly!');
      } else {
        alert('無法識別程式碼!');
      }
    } else {
      alert('未找到有效的程式碼!');
    }
  }
  
  // 當按鈕被點擊時執行 Blockly 程式碼
  function runBlockly() {
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    try {
      var result = eval(code);
      document.getElementById('output').innerText = '結果: ' + result;
    } catch (e) {
      document.getElementById('output').innerText = '錯誤: ' + e.message;
    }
  }
  