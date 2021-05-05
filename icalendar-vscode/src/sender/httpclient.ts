import axios from 'axios';
import { Logger } from '../common/logger';
import { DayBitSet } from "../user/daybitset";
import { ServerInfo } from "./serverinfo";
import * as structs from "./structs";

export async function doPostData(daybitset: DayBitSet, serverInfo: ServerInfo) {
    let token = serverInfo.token;
    Logger.debug(`Posting data, url:${serverInfo.baseURL}, token:${token}, day: ${daybitset.getDay()}, slot: ${daybitset.countOfCodingSlot()}`);

    return await axios({
        baseURL: serverInfo.baseURL,
        url: 'postUserAction',
        method: 'post',
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-type': 'application/json; charset=utf-8',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Accept': 'application/json'
        },
        data: {
            token: token,
            day: daybitset.getDay(),
            dayBitSetArray: daybitset.getDayBitSetByteArray()
        },
        timeout: serverInfo.timeout
    }).then((response: any) => {
        let resData = response.data;
        let result: structs.HttpResponse = {
            status: false,
            msg: resData.msg,
            statusText: response.statusText,
            httpCode: response.status,
            data: resData
        };

        if (response.status === 200 && resData.status) {
            // handle success
            Logger.info(resData);
            result.status = true;
            result.msg = 'Post success';
        } else {
            // handle error
            Logger.error(resData);
            result.status = false;
        }
        return result;
    }).catch((error: any) => {
        //simpleResult.status = false;
        //simpleResult.msg = "" + error;

        let resultError: structs.HttpResponse = {
            status: false,
            msg: "" + error,
            statusText: 'error',
            httpCode: 404,
            data: {}
        };
        
        return resultError;
    });
}