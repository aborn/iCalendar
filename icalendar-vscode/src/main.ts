import { DayBitSet } from "./daybitset";
// import { DataSender } from "./datasender";
import { BitSet } from "./bitset";
import { UserInfo } from "./userinfo";
import { ValidateUtils } from "./validateutils";
import { getDayInfo, formatTime } from "./dateutils";

console.log('today:' + getDayInfo());
console.log(formatTime());

let arr: any[] = [{ "a": 1, "b": 'bvalue' }, "sss", 12];
console.log(arr);
console.log(JSON.stringify('sss'));

function ilog(level: string, ...optionalParams: any[]) {
    let arrParams = optionalParams.map((item) => {
        if (item instanceof Object) {
            return JSON.stringify(item);
        } else {
            return item;
        }
    });
    console.log('+++++++++++++++++++++++');
    console.log(arrParams.join(' '));
}

function info(...optionalParams: any[]) {
    console.log(optionalParams.length);
    ilog("info", ...optionalParams);
}

info("eee", "fff");

/**
ilog('info', 'eeeeeeee', 'ff');
ilog('info', arr);
ilog('info', { "data": "post succ", "status": true, "code": 200 });
 */

console.log('+++++++++++++++++++++');

console.log('0xa232585b:' + ValidateUtils.validateToken('0xa232585b'));
console.log('0xa232585C:' + ValidateUtils.validateToken('0xa232585C'));
console.log('1xa2325852:' + ValidateUtils.validateToken('1xa2325852'));
console.log('0a2325852:' + ValidateUtils.validateToken('0a2325852'));
console.log('a2325852:' + ValidateUtils.validateToken('a2325852'));
console.log('0a2325 852:' + ValidateUtils.validateToken('0a2325 852'));
console.log('0xa2325@52:' + ValidateUtils.validateToken('0xa2325@52'));


var userconfig = new UserInfo();
console.log('gettoken=' + userconfig.getToken());
userconfig.print();

console.log('start runing.');
console.log('start time==>' + new Date().getTime());
var daybitset = new DayBitSet();

daybitset.record();
var bitset = daybitset.getBitSet();
bitset.set(1);
bitset.set(8);
bitset.set(24 * 60 * 2 - 1, 1);
console.log(bitset.toBitSetSlotArray());
daybitset.print();

var bitset2 = new BitSet(24 * 60 * 2);
bitset2.set(1);
bitset2.set(100);
bitset2.and(bitset);
console.log(bitset2.toBitSetSlotArray());

console.log('cardinality:' + bitset.cardinality());
bitset.set(8, 0);
console.log('cardinality:' + bitset.cardinality());
bitset.clear();
console.log('cardinality:' + bitset.cardinality());

var byteArray = daybitset.getBitSet().toIntArray();
console.log('byte length=' + byteArray.length);

/**
var a = false;
if (a) {
    var datasender = new DataSender();
    var postResult = datasender.postData(daybitset);
    console.log(postResult);
}
 */

console.log('end time==>' + new Date().getTime());
console.log('end in main.');