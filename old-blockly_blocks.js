// blockly_blocks.js

Blockly.defineBlocksWithJsonArray([
    {
        "type": "controls_if",
        "message0": "如果 %1 那麼",
        "args0": [
            {
                "type": "input_value",
                "name": "IF0"
            }
        ],
        "output": null,
        "colour": 210,
        "tooltip": "條件判斷",
        "helpUrl": ""
    },
    {
        "type": "controls_repeat_ext",
        "message0": "重複 %1 次",
        "args0": [
            {
                "type": "input_value",
                "name": "TIMES"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "重複執行指定次數",
        "helpUrl": ""
    },
    {
        "type": "math_number",
        "message0": "%1",
        "args0": [
            {
                "type": "field_number",
                "name": "NUM",
                "value": 0
            }
        ],
        "output": "Number",
        "colour": 230,
        "tooltip": "數字",
        "helpUrl": ""
    },
    {
        "type": "text_print",
        "message0": "打印 %1",
        "args0": [
            {
                "type": "input_value",
                "name": "TEXT"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "顯示文字",
        "helpUrl": ""
    },
    {
        "type": "variables_get",
        "message0": "%1",
        "args0": [
            {
                "type": "field_variable",
                "name": "VAR"
            }
        ],
        "output": null,
        "colour": 330,
        "tooltip": "獲取變數",
        "helpUrl": ""
    },
    {
        "type": "variables_set",
        "message0": "設置 %1 為 %2",
        "args0": [
            {
                "type": "field_variable",
                "name": "VAR"
            },
            {
                "type": "input_value",
                "name": "VALUE"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 330,
        "tooltip": "設置變數的值",
        "helpUrl": ""
    },
    {
        "type": "math_arithmetic",
        "message0": "%1 %2 %3",
        "args0": [
            {
                "type": "input_value",
                "name": "A"
            },
            {
                "type": "field_dropdown",
                "name": "OP",
                "options": [
                    ["加", "ADD"],
                    ["減", "MINUS"],
                    ["乘", "MULTIPLY"],
                    ["除", "DIVIDE"]
                ]
            },
            {
                "type": "input_value",
                "name": "B"
            }
        ],
        "output": "Number",
        "colour": 230,
        "tooltip": "數學運算",
        "helpUrl": ""
    },
    {
        "type": "logic_compare",
        "message0": "%1 %2 %3",
        "args0": [
            {
                "type": "input_value",
                "name": "A"
            },
            {
                "type": "field_dropdown",
                "name": "OP",
                "options": [
                    ["等於", "EQ"],
                    ["不等於", "NEQ"],
                    ["大於", "GT"],
                    ["小於", "LT"],
                    ["大於等於", "GTE"],
                    ["小於等於", "LTE"]
                ]
            },
            {
                "type": "input_value",
                "name": "B"
            }
        ],
        "output": "Boolean",
        "colour": 210,
        "tooltip": "邏輯比較",
        "helpUrl": ""
    },
    {
        "type": "text",
        "message0": "%1",
        "args0": [
            {
                "type": "field_input",
                "name": "TEXT",
                "text": "文字"
            }
        ],
        "output": "String",
        "colour": 160,
        "tooltip": "文字",
        "helpUrl": ""
    },
    {
        "type": "controls_repeat_ext",
        "message0": "重複 %1 次 %2",
        "args0": [
            {
                "type": "input_value",
                "name": "TIMES"
            },
            {
                "type": "input_statement",  // 使用 input_statement 類型來表示可執行的區塊
                "name": "DO"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "重複執行指定次數",
        "helpUrl": ""
    }
]);
