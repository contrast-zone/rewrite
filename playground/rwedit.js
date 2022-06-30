var rwedit = function (node, options) {
    "use strict";
    if (!options)
        options = {
            font: "8pt monospace",
            colorText: "rgb(208,208,208)",
            colorTextBack: "black",
            colorKeyword: "rgb(104,104,104)",
            colorKeywordBack: "transparent",
            colorBracketMatch: "white",
            colorBracketMatchBack: "rgb(75,75,75)",
            colorStringAndComment: "rgb(128,128,128)",
            keywords: ["REWRITE", "READ", "WRITE", "VAR"],
            stringsAndComments: "(\"([^\"\\\\\\n]|(\\\\.))*((\")|(\n)|($)))|(\\/\\/((.*\\n)|(.*$)))|(\\/\\*[\\S\\s]*?((\\*\\/)|$))"
        }

    var ww, hh;
    var rndid = Math.round (Math.random () * 32768);
    var ed = document.getElementById(node);

    ed.innerHTML = 

    `
    <div id="container${rndid}" style="position: relative; width: inherit; height: inherit;">
      <div id="backdrop${rndid}" style = "width: inherit; height: inherit; overflow: hidden;">
        <div id="hilights${rndid}" style="wrap: none; font: ${options.font}; padding:5px; white-space: pre; color: ${options.colorText}; background-color: ${options.colorTextBack}; width: inherit; height: inherit; overflow: hidden;">
        </div>
      </div>
      <textarea id="input${rndid}" spellcheck="false" wrap="off" oninput="" style="width: inherit; height: inherit; border-radius: 0; outline: none; box-sizing: border-box; resize: none; display: block; border-style: none; /*background-color: black;*/ background-color: transparent; color: transparent; caret-color: white; font: ${options.font}; margin: 0; padding:5px; position: absolute; top: 0; left: 0; z-index: 0;">
      </textarea>
    </div>
    `

    var input = document.getElementById(`input${rndid}`);
    var hilights = document.getElementById(`hilights${rndid}`);
    var backdrop = document.getElementById(`backdrop${rndid}`);
    var container = document.getElementById(`container${rndid}`);
    
    container.style.width = "inherit";
    container.style.height = "inherit";
    
    function hilightAll() {
        const activeElement = document.activeElement
        if (activeElement && activeElement.id === `input${rndid}`) {
            var text = input.value;

            text = prepareBraces (text, "(", ")");
            text = prepareBraces (text, "[", "]");
            text = prepareBraces (text, "{", "}");
            
            text = text
            .replaceAll(/&/g, '&amp;')
            .replaceAll(/</g, '&lt;')
            .replaceAll(/>/g, '&gt;');

            text = hilightContents (text);

            text = hilightBraces (text, "(", ")");
            text = hilightBraces (text, "[", "]");
            text = hilightBraces (text, "{", "}");
            
            // scroll fix
            text = text
            .replace(/\n$/g, '\n\n')
            .replace(/\n/g, '     \n');

            text += "<br/><br/><br/><br/><br/> ";

            hilights.innerHTML = text;

            hilights.style.height = hh + "px";
            backdrop.style.height = hh + "px";
            container.style.height = hh + "px";
            input.style.height = hh + "px";
          
            hilights.style.width = ww + "px";
            backdrop.style.width = ww + "px";
            container.style.width = ww + "px";
            input.style.width = ww + "px";
        }
        
        handleScroll ();
    }
    
    function hilightContents (text) {
        var reg = new RegExp(options.stringsAndComments, "g");
        var result;
        var text1 = "";
        var pos1 = 0;
        while((result = reg.exec(text)) !== null) {
            text1 += hilightKeywords (text.substring(pos1, result.index));
            text1 += `<span style="color:${options.colorStringAndComment}">` + result[0] + '</span>';
            pos1 = result.index + result[0].length;
        }
        text1 += hilightKeywords (text.substring(pos1, text.length));
        
        return text1;
    }

    function hilightKeywords (text) {
        for (var i = 0; i < options.keywords.length; i++) {
            var reg = new RegExp(`\\b${options.keywords[i]}\\b`, "g");
            text = text.replaceAll (reg, `<span style="color: ${options.colorKeyword}; background-color: ${options.colorKeywordBack}; font-weight: bold;">${options.keywords[i]}</span>`);
        }
        
        return text;
    }
    
    function prepareBraces (text, open, close) {
        var st = input.selectionStart;
        var en = input.selectionEnd;
        var found, i1, i2;
        
        if (st === en) {
            if ("({[".indexOf (text.substr(st, 1)) === -1 && "}])".indexOf (text.substr(st, 1)) === -1)
                st--;
              
            if (text.substr(st, 1) === open) {
                var i = st, nb = 0;
                do {
                    if (text.substr(i, 1) == open)
                        nb++;
                    else if (text.substr(i, 1) == close)
                        nb--;
                
                    i++;
                } while (i < text.length && nb !== 0);

                if (nb === 0) {
                    found = true;
                    i1 = st;
                    i2 = i - 1;
                }
                
            } else if (text.substr(st, 1) === close) {
                var i = st, nb = 0;
                do {
                    if (text.substr(i, 1) == open)
                        nb--;
                    else if (text.substr(i, 1) == close)
                        nb++;
                  
                    i--;
                } while (i > -1 && nb !== 0);
              
                if (nb === 0) {
                    found = true;
                    i1 = i + 1;
                    i2 = st;
                }
            }
        }
        

        if (found) {
            var p0 = text.substring(0, i1);
            var p1 = text.substring(i1 + 1, i2);
            var p2 = text.substring(i2 + 1, text.length)
            text = p0 + `${open}\0x0000 ` + p1 + ` \0x0000${close}` + p2;
        }
        
        return text;
    }
    
    function hilightBraces (text, open, close) {
        return text
        .replaceAll(`${open}\0x0000 `, `<span style="color: ${options.colorBracketMatch}; background-color: ${options.colorBracketMatchBack};">${open}</span>`)
        .replaceAll(` \0x0000${close}`, `<span style="color: ${options.colorBracketMatch}; background-color: ${options.colorBracketMatchBack};">${close}</span>`);
    }

    function handleScroll () {
        hilights.scrollTop = input.scrollTop;
        hilights.scrollLeft = input.scrollLeft;
    }
    
    function handleInput () {
        hilightAll ();
    }

    function handleKeyPress (e) {
        if (e.key === "Enter") {
            e.preventDefault ();
            var c = input.selectionStart;
            var i = c;
            while (i >= 0) {
                i--;
                if (input.value.substr (i, 1) === "\n") {
                    var pre = "";
                    var j = i + 1;
                    while (j < c && j < input.value.length && " \t\v".indexOf (input.value.substr (j, 1)) > -1) {
                        pre += input.value.substr (j, 1);
                        j++;
                    }
                            
                    document.execCommand("insertText", false, '\n' + pre);
                    return;
                }
            }
            
        } else if (e.key === "Tab") {
            e.preventDefault ();
            if (e.shiftKey) {
                var c = input.selectionStart;
                var i = c;
                while (i >= -1) {
                    i--;
                    if (input.value.substr (i, 1) === "\n" || i === -1) {
                        i++;

                        input.selectionStart = i;

                        for (var j = 0; j < 4 && i + j < input.value.length; j++)
                            if (" \t\v".indexOf (input.value.substr (i + j, 1)) === -1)
                                break;
                                
                        if (j > 0) {
                            input.selectionEnd = i + j;

                            document.execCommand("delete");
                        }
                        
                        input.selectionStart = (c - j > i ? c - j: i);
                        input.selectionEnd = input.selectionStart;
                        
                        return;
                    }
                }
                
            } else {
                var c = input.selectionStart;
                var i = c;
                while (i >= -1) {
                    i--;
                    if (input.value.substr (i, 1) === "\n" || i === -1) {
                        i++
                        var n = 4 - ((c - i) % 4);

                        document.execCommand("insertText", false, " ".repeat (n));
                        return;
                    }
                }
            }
        }
    }

    onresize = function () {
        container.style.width = "0px";
        container.style.height = "0px";
        
        setTimeout (function () {
            hh = ed.clientHeight;
            ww = ed.clientWidth;
            handleInput ();
        }, 0);
    }
    
    document.addEventListener('selectionchange', hilightAll);

    input.addEventListener('input', handleInput);

    input.addEventListener('keydown', handleKeyPress);

    input.onscroll = handleScroll;

    setTimeout (function () {
        handleInput();
    }, 0);
    
    ed.addEventListener('resize', onresize);
    
    onresize();
    
    return {
        getValue: function () {
            return input.value;
        },
        setValue: function (value) {
            input.value = value;
        },
        getSelectionStart () {
            return input.selectionStart;
        },
        getSelectionEnd () {
            return input.selectionEnd;
        },
        setSelectionStart (v) {
            input.selectionStart = v;
        },
        setSelectionEnd (v) {
            input.selectionEnd = v;
        },
        setFocus: function () {
            input.focus ();
        }
    }
}

