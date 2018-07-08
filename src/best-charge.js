'use strict';

// function bestCharge(selectedItems) {
// }

function spiltIdAndCount(selectedItems){
  let idAndCounts = [];
  for(let item of selectedItems){
    let idAndCount = {};
    let div = item.split(" ");
    idAndCount.id = div[0];
    idAndCount.count = parseFloat(div[2]);
    idAndCounts.push(idAndCount);
  }
  //console.info(idAndCounts);
  return idAndCounts;
}

module.exports={
  spiltIdAndCount}
