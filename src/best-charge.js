'use strict';

const {loadAllItems} = require('../src/items')

const {loadPromotions} = require('../src/promotions')

function bestCharge(selectedItems) {
  const idAndCounts = spiltIdAndCount(selectedItems);
  const itemsDetails = addItemsDetailsWithSubtotal(idAndCounts,loadAllItems());
  const beforTotal = calculateBeforeTotal(itemsDetails);
  const save = calculateSave(beforTotal,itemsDetails,loadPromotions());
  const saveObject = selectPromotion(save);
  const finalOrderDetails = generateOrders(itemsDetails,beforTotal,saveObject);
  return finalOrderDetails;
}

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
    }else if(promotion.type ==="指定菜品半价"){
      let tempsave = 0;
      for(let i=0;i<itemsDetails.length;i++){
        for(let j=0;j<promotion.items.length;j++){
          if(itemsDetails[i].id === promotion.items[j])
            tempsave += itemsDetails[i].price/2;
        }
      }
      let str = `${promotion.type}(黄焖鸡，凉皮)`;
      save.push({
        "saveType":str,
        "saveCharge":tempsave
      });
    }
  }
  console.log(save);
  return save;
}

function selectPromotion(save){
  const saveChargeArray = [];
  const saveObject = {};
  let maxSave = 0;
  for(let i=0;i<save.length;i++)
    saveChargeArray.push(save[i].saveCharge);
  maxSave = Math.max.apply(null,saveChargeArray);
  for(let i=0;i<save.length;i++){
    if(maxSave != 0){
      if(save[i].saveCharge === maxSave)
        saveObject.saveType = save[i].saveType;
    }
    else saveObject.saveType = null;
  }
  saveObject.saveCharge = maxSave;
  console.log(saveObject);
  return saveObject;
}

function generateOrders(itemsDetails,beforTotal,saveObject){
    let finalOrderDetails="";
    let tempStr="";
    for (let items of itemsDetails){
    tempStr+=`\n${items.name} x ${items.count} = ${items.subtotal}元`;
    }
    if(saveObject.saveType === "满30减6元"){
      finalOrderDetails=`
============= 订餐明细 =============${tempStr}
-----------------------------------
使用优惠:
满30减6元，省${saveObject.saveCharge}元
-----------------------------------
总计：${beforTotal-(saveObject.saveCharge)}元
===================================`;
    }else if (saveObject.saveType === "指定菜品半价(黄焖鸡，凉皮)"){
      finalOrderDetails=`
============= 订餐明细 =============${tempStr}
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省${saveObject.saveCharge}元
-----------------------------------
总计：${beforTotal-saveObject.saveCharge}元
===================================`;
    }else{
      finalOrderDetails=`
============= 订餐明细 =============${tempStr}
-----------------------------------
总计：${beforTotal}元
===================================`;
        }
    return finalOrderDetails;
}


module.exports={
  spiltIdAndCount,
  addItemsDetailsWithSubtotal,
  calculateBeforeTotal,
  calculateSave,
  selectPromotion,
  bestCharge,
  generateOrders}
