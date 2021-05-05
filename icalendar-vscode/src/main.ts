import { DayBitSet } from "./user/daybitset";
// import { DataSender } from "./datasender";
import { BitSet } from "./common/bitset";
import { UserInfo } from "./user/userinfo";
import { ValidateUtils } from "./utils/validateutils";
import { getDayInfo, formatTime } from "./utils/dateutils";
import axios from 'axios';

let obj = {"a":1, "b":1};
obj.a = 2;
console.log(`obj keys: ${Object.keys(obj).join(',')}`);
console.log('ins:' + (obj instanceof Object));

console.log('axios example start');
async function getUser() {
    try {
        const response = await axios.get('https://aborn.me/webx/status');
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
    return "ggggggggggooooooooooooo";
}

let ggo = getUser();
console.log(ggo.then((result) => {
    console.log(result);
}));

console.log('axios example end.');

let time = new Date();
console.log(new Date(Date.now()));
console.log(time);
console.log(Date.now());
console.log(JSON.stringify(new Date()));
console.log('format:' + formatTime(time));
console.log('local timestring:' + time.toLocaleTimeString());
console.log('local datestring:' + time.toLocaleDateString());
console.log('local string:' + time.toLocaleString());

console.log('a.txt=> ' + ("a.txt".includes('.')));
console.log('atxt=> ' + ("atxt".includes('.')));
console.log('atxt=> ' + ("atxt".startsWith('atx')));
console.log(' atxt=> ' + (" atxt".trim().startsWith('atx')));

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