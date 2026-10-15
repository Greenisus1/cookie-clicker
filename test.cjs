const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const url='file://'+path.resolve(__dirname,'index.html');
 await page.goto(url);await page.evaluate(()=>localStorage.clear());await page.reload();
 const snapshot=()=>page.evaluate(()=>({...state,clickValue:clickValue()}));
 assert.equal((await snapshot()).score,0);
 assert(await page.locator('#upgrade1').isDisabled());
 await page.locator('#cookie').focus();await page.keyboard.press('Space');assert.equal((await snapshot()).score,1);
 await page.locator('#cookie').click({clickCount:9});assert.equal((await snapshot()).score,10);
 await page.locator('#upgrade1').click();assert.equal((await snapshot()).score,0);assert.equal((await snapshot()).clickValue,3);
 assert.match(await page.locator('#upgrade1').innerText(),/15 cookies/);
 await page.locator('#cookie').click({clickCount:5});await page.locator('#upgrade1').click();assert.equal((await snapshot()).clickValue,5);
 assert.match(await page.locator('#upgrade1').innerText(),/23 cookies/);
 await page.locator('#cookie').click({clickCount:10});await page.locator('#buyAuto').click();assert.equal((await snapshot()).auto,1);
 assert(await page.locator('#buyAuto').isDisabled());
 await page.locator('#cookie').click({clickCount:40});await page.locator('#upgradeAuto').click();assert.equal((await snapshot()).auto,2);
 await page.locator('#upgradeAuto').click();assert.equal((await snapshot()).auto,3);
 assert.match(await page.locator('#upgradeAuto').innerText(),/68 cookies/);
 const before=await snapshot();await page.waitForTimeout(2200);const after=await snapshot();assert(after.score>before.score+20);
 await page.evaluate(()=>save());const saved=await snapshot();await page.reload();const loaded=await snapshot();assert.equal(loaded.auto,saved.auto);assert.equal(loaded.small,saved.small);assert(loaded.score>=saved.score);
 // Auto baking itself unlocks the 100-cookie achievement, and spending does not relock it.
 await page.evaluate(()=>{state=defaults();state.auto=1;state.earned=99;state.score=99;changed();});
 await page.waitForTimeout(1200);assert.equal((await snapshot()).achievements[0],true);
 await page.locator('#upgrade1').click();assert.equal((await snapshot()).achievements[0],true);
 await page.evaluate(()=>{state=defaults();state.score=1000;changed();});
 for(let i=0;i<5;i++)await page.locator('#upgrade1').click();assert.equal((await snapshot()).achievements[1],true);
 // A malformed save is safely rejected.
 await page.evaluate(()=>{localStorage.setItem(SAVE_KEY,'{"version":1,"score":-1}');state=defaults();load();render();});assert.equal((await snapshot()).score,0);
 // Storage failure is visible and does not prevent play.
 await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw Error('blocked')};save();});
 assert.match(await page.locator('#saveStatus').innerText(),/Saving unavailable/);await page.locator('#cookie').click();assert.equal((await snapshot()).score,1);
 await page.reload();await page.evaluate(()=>{state=defaults();changed();save();});
 page.once('dialog',d=>d.dismiss());await page.locator('#reset').click();
 await page.locator('#cookie').click();page.once('dialog',d=>d.accept());await page.locator('#reset').click();assert.equal((await snapshot()).score,0);
 await page.setViewportSize({width:1280,height:900});await page.screenshot({path:'/downloads/cookie-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/downloads/cookie-mobile.png',fullPage:true});
 for(const width of [320,390,1280]){await page.setViewportSize({width,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 assert.deepEqual(errors,[]);console.log('PASS: clicks, keyboard, prices, purchases, repeated auto upgrades, timed earnings, achievements, reload, invalid saves, storage failure, reset, no console errors, 320/390/1280px layout.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
