'use strict';

const {spiltIdAndCount,
       addItemsDetailsWithSubtotal,
       calculateBeforeTotal,
       calculateSave,
       selectPromotion,
       bestCharge,     
      } = require('../src/best-charge')
    
const {loadAllItems} = require('../src/items')

const {loadPromotions} = require('../src/promotions')

describe('Unit Test', function() {

  it('should spilt id and count', function() {
    //given
    const selectedItems = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    //when
    const idAndCounts = spiltIdAndCount(selectedItems);
    //then
    let result = JSON.stringify([
      {"id":"ITEM0001","count":"1"},
      {"id":"ITEM0013","count":"2"},
      {"id":"ITEM0022","count":"1"}
    ]);
    expect(JSON.stringify(idAndCounts)).toBe(result)
  });
});

describe('Unit Test', function() {

  it('should add items details', function() {
    //given
    const idAndCounts = [
      {"id":"ITEM0001","count":"1"},
      {"id":"ITEM0013","count":"2"},
      {"id":"ITEM0022","count":"1"}
    ];
    //when
    const itemsDetails = addItemsDetailsWithSubtotal(idAndCounts,loadAllItems());
    //then
    let result = JSON.stringify([
      {"id":"ITEM0001","name":"黄焖鸡","count":"1","price":18,"subtotal":18},
      {"id":"ITEM0013","name":"肉夹馍","count":"2","price":6,"subtotal":12},
      {"id":"ITEM0022","name":"凉皮","count":"1","price":8,"subtotal":8}
    ])
    expect(JSON.stringify(itemsDetails)).toBe(result)
  });
});

describe('Unit Test', function() {
  it('should calculate total  before discount', function() {
    //given
    const inputs = [
      {"id":"ITEM0001","name":"黄焖鸡","count":"1","price":18,"subtotal":18},
      {"id":"ITEM0013","name":"肉夹馍","count":"2","price":6,"subtotal":12},
      {"id":"ITEM0022","name":"凉皮","count":"1","price":8,"subtotal":8}
    ];
    //when
    const output = calculateBeforeTotal(inputs)
    //then
    let result = 38;
    expect(output).toEqual(result)
  });
});

describe('Unit Test', function() {
  it('should calculate promotions of save', function() {
    //given
    const inputs = [
      {"id":"ITEM0001","name":"黄焖鸡","count":"1","price":18,"subtotal":18},
      {"id":"ITEM0013","name":"肉夹馍","count":"2","price":6,"subtotal":12},
      {"id":"ITEM0022","name":"凉皮","count":"1","price":8,"subtotal":8}
    ];
    const beforTotal = 38;
    //when
    const output = calculateSave(beforTotal,inputs,loadPromotions());
    //then
    let result = JSON.stringify([
      {"saveType":"满30减6元","saveCharge":6},
      {"saveType":"指定菜品半价(黄焖鸡，凉皮)","saveCharge":13}
    ]);
    expect(JSON.stringify(output)).toBe(result)
  });
});

describe('Unit Test', function() {
  it('should select promotions of save', function() {
    //given
    const inputs = [
      {"saveType":"满30减6元","saveCharge":6},
      {"saveType":"指定菜品半价(黄焖鸡，凉皮)","saveCharge":13}
    ];
    //when
    const output = selectPromotion(inputs);
    //then
    let result = JSON.stringify({saveType: "指定菜品半价(黄焖鸡，凉皮)", saveCharge: 13 });
    expect(JSON.stringify(output)).toEqual(result)
  });
});

describe('Take out food', function () {

  it('should generate best charge when best is 指定菜品半价', function() {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when best is 满30减6元', function() {
    let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：26元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when no promotion can be used', function() {
    let inputs = ["ITEM0013 x 4"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
-----------------------------------
总计：24元
===================================`.trim()
    expect(summary).toEqual(expected)
  });
});