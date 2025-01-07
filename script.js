document.addEventListener('DOMContentLoaded', function () {
    // 初始化 Blockly 工作區
    const workspace = Blockly.inject('blocklyDiv', {
        toolbox: '<xml><category name="Dynamic Blocks"></category></xml>',
    });

    // 初始化 Ace.js 編輯器
    const codeEditor = ace.edit("codeEditor");
    codeEditor.setTheme("ace/theme/github");
    codeEditor.session.setMode("ace/mode/python");
    codeEditor.setOptions({
        fontSize: "14px",
        showPrintMargin: false,
    });

    // 使用 Skulpt 解析 Python 程式碼為 AST
    async function parsePythonToAST(pythonCode) {
        try {
            Sk.configure({
                output: console.log,
                read: function (filename) {
                    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][filename] === undefined) {
                        throw `File not found: '${filename}'`;
                    }
                    return Sk.builtinFiles["files"][filename];
                },
            });
    
            // 使用 Skulpt 提取 AST
            const ast = Sk.astFromString(pythonCode, "exec");
            console.log("AST 結果：", ast);
            return ast;
        } catch (error) {
            console.error("AST 解析失敗：", error);
            document.getElementById("output").innerText = "AST 解析失敗。";
        }
    }
    

    // 提取函數名稱和參數，並顯示在頁面上
    function extractFunctionDetailsFromAST(ast) {
        const functionDetails = [];

        function traverse(node) {
            if (node._astname === "FunctionDef") {
                const funcName = node.name; // 函數名稱
                const args = node.args.args.map(arg => arg.arg); // 參數名稱

                functionDetails.push({
                    name: funcName,
                    args: args,
                });
            }

            // 遞歸遍歷子節點
            if (node.body) {
                node.body.forEach(child => traverse(child));
            }
        }

        traverse(ast);
        return functionDetails;
    }

    // 轉換程式碼功能
    window.convertCode = async function () {
        const pythonCode = codeEditor.getValue();
        console.log("編輯器中的程式碼：", pythonCode);

        const ast = await parsePythonToAST(pythonCode);
        if (ast) {
            const functionDetails = extractFunctionDetailsFromAST(ast);
            console.log("提取的函數細節：", functionDetails);

            // 在頁面上顯示結果
            const outputElement = document.getElementById("output");
            if (functionDetails.length > 0) {
                outputElement.innerHTML = "<b>提取的函數：</b><br>" +
                    functionDetails.map(func => `${func.name}(${func.args.join(", ")})`).join("<br>");
            } else {
                outputElement.innerText = "未找到任何函數。";
            }
        }
    };

    // 執行 Blockly 程式碼並驗證是否與編輯器一致
    window.runBlockly = function () {
        console.log("runBlockly 函數被觸發");
        const workspaceCode = Blockly.Python.workspaceToCode(workspace).trim();
        const editorCode = codeEditor.getValue().trim();
        console.log("工作區程式碼：", workspaceCode);
        console.log("編輯器程式碼：", editorCode);

        if (workspaceCode === editorCode) {
            document.getElementById("output").innerText = "驗證成功：程式碼一致！";
        } else {
            document.getElementById("output").innerText = `驗證失敗：程式碼不一致。`;
        }
    };
});
