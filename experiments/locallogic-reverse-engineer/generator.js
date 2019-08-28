function findThird(firstChar, secondChar) {
  var str = require("./strings.json");
  var arr = [];
  var count = 0;
  var flag = true;
  for (var i = 0; i < str.length; i++) {
    flag = true;
    if (
      str[i].sub.charAt(0) == firstChar &&
      str[i].sub.charAt(1) == secondChar
    ) {
      for (var j = 0; j < arr.length; j++)
        if (arr[j] === str[i].sub.charAt(2)) flag = false;
      if (flag === true) {
        arr[count] = str[i].sub.charAt(2);
        count++;
      }
    }
  }
  return arr;
}

var allChar = [];
var i_char = "";
var count = 0;
for (var i = 0; i <= 9; i++) {
  allChar[count] = i.toString();
  count++;
}
for (var i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
  i_char = String.fromCharCode(i);
  if (i_char === "a" || i_char === "i" || i_char === "l" || i_char === "o")
    continue;
  allChar[count] = i_char;
  count++;
}

var bf = { str: "bf", arr: findThird("b", "f") };
var bg = { str: "bg", arr: findThird("b", "g") };
var bu = { str: "bu", arr: findThird("b", "u") };
var c0 = { str: "c0", arr: findThird("c", "0") };
var c1 = { str: "c1", arr: findThird("c", "1") };
var c2 = { str: "c2", arr: findThird("c", "2") };
var c3 = { str: "c3", arr: findThird("c", "3") };
var c4 = { str: "c4", arr: findThird("c", "4") };
var c8 = { str: "c8", arr: findThird("c", "8") };
var c9 = { str: "c9", arr: findThird("c", "9") };
var cb = { str: "cb", arr: findThird("c", "b") };
var cc = { str: "cc", arr: findThird("c", "c") };
var dr = { str: "dr", arr: findThird("d", "r") };
var f0 = { str: "f0", arr: findThird("f", "0") };
var f1 = { str: "f1", arr: findThird("f", "1") };
var f2 = { str: "f2", arr: findThird("f", "2") };
var f3 = { str: "f3", arr: findThird("f", "3") };
var f8 = { str: "f8", arr: findThird("f", "8") };
var f9 = { str: "f9", arr: findThird("f", "9") };
var fb = { str: "fb", arr: findThird("f", "b") };
var fc = { str: "fc", arr: findThird("f", "c") };

var charArray = [
  bf,
  bg,
  bu,
  c0,
  c1,
  c2,
  c3,
  c4,
  c8,
  c9,
  cb,
  cc,
  dr,
  f0,
  f1,
  f2,
  f3,
  f8,
  f9,
  fb,
  fc
];

function main() {
  for (var i = 0; i < charArray.length; i++) {
    var word = "";
    word += charArray[i].str;
    for (var j = 0; j < charArray[i].arr.length; j++)
      for (var k = 0; k < allChar.length; k++)
        console.log(word + charArray[i].arr[j] + allChar[k]);
  }
}
main();
