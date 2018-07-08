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
          "subtotal":parseFloat(item.count)*allItems[i].price
        });
      }
    }  
  }
  console.info(itemsDetails);
  return itemsDetails;
}

function calculateBeforeTotal(itemsDetails){
  let beforTotal = 0;
  for(let itemsDetail of itemsDetails){
    beforTotal += itemsDetail.subtotal;
  }
  console.info(beforTotal);
  return beforTotal;
}

function calculateSave(beforTotal,itemsDetails,promotions){
  let save = [];
  for(let promotion of promotions){
    if(promotion.type === "满30减6元"){
      if(beforTotal >= 30)
      save.push({
        "saveType":promotion.type,
        "saveCharge":6
      });
    }
    if(promotion.type ==="指定菜品半价"){
      let tempsave = 0;
      for(let i=0;i<itemsDetails.length;i++){
        for(let j=0;j<promotion.items.length;j++){
          if(itemsDetails[i].id === promotion.items[j])
            tempsave += itemsDetails[i].price/2;
        }
      }
      save.push({
        "saveType":promotion.type,
        "saveCharge":tempsave
      });
    }
  }
  console.log(save);
  return save;
}

function selectPromotion(save){
  const saveChargeArray = [];
  const saveArray = {};
  let maxSave = 0;
  for(let i=0;i<save.length;i++)
    saveChargeArray.push(save[i].saveCharge);
  maxSave = Math.max.apply(null,saveChargeArray);
  for(let i=0;i<save.length;i++){
    if(save[i].saveCharge === maxSave)
      saveArray.saveType = save[i].saveType;
  }
  saveArray.saveCharge = maxSave;
  console.log(saveArray);
  return saveArray;
}

module.exports={
  spiltIdAndCount,
  addItemsDetailsWithSubtotal,
  calculateBeforeTotal,
  calculateSave,
  selectPromotion}
