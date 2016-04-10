// 9999 * 9901 = 99000099
function reverse(s) {
  return s.split("").reverse().join("");
}

var bigger_result = 0;
var bigger_result_i = 0;
var bigger_result_j = 0;
for (var i = 9999; i >= 6000; i--) {
  for (var j = 9999; j >= 6000; j--) {
    var result = i * j;
    if (result.toString() === reverse(result.toString())) {
      // console.log(`${i} * ${j} = ${result}`);

      if(result >= bigger_result) {
        bigger_result_i = i;
        bigger_result_j = j;
        bigger_result = result;
      }
    }
  }
}

console.log('----------------------------');
console.log(`${bigger_result_i} * ${bigger_result_j} = ${bigger_result}`);
