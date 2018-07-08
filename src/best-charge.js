'use strict';

// function bestCharge(selectedItems) {
// }

function spiltIdAndCount(selectedItems){
  let idAndCounts = [];
  for(let item of selectedItems){
    let idAndCount = {};
    let div = item.split(" ");
    idAndCount.id = div[0];
    idAndCount.count = div[2];
    idAndCounts.push(idAndCount);
  }
  console.log(idAndCounts);
  return idAndCounts;
}

function addItemsDetailsWithSubtotal(idAndCounts,allItems){
  const itemsDetails = [];
  for(let item of idAndCounts){
    for(let i=0;i<allItems.length;i++){
      if(item.id === allItems[i].id){
        itemsDetails.push({
          "id":allItems[i].id,
          "name":allItems[i].name,
          "count":item.count,
          "price":allItems[i].price,
          "subtotal":parseFloat(item.count)*parseFloat(allItems[i].price)
        });
      }
    }  
  }
  console.info(itemsDetails);
  return itemsDetails;
}

module.exports={
  spiltIdAndCount,
  addItemsDetailsWithSubtotal}
