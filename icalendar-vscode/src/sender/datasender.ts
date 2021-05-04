import axios from 'axios';
import { DayBitSet } from "../user/daybitset";
import { BitSet } from "../common/bitset";
import * as servers from "./serverinfo";
import { ConfigHelper } from "../utils/confighelper";
import { Logger } from "../common/logger";

export class DataSender {
    private lastPostDateMs: number | null;
    private lastPostData: BitSet;

    constructor() {
        this.lastPostDateMs = null;
        this.lastPostData = new DayBitSet().getBitSet();
        // init it!
        ConfigHelper.getInstance();
    }

    public postData(daybitset: DayBitSet): string {
        if (this.isNeedPost(daybitset)) {
            let result = this.doPostData(daybitset);
            this.lastPostDateMs = Date.now();
            this.lastPostData.or(daybitset.getBitSet());
            return result.msg;
        } else {
            return "No need to post!";
        }
    }

    private isNeedPost(daybitset: DayBitSet): boolean {        
        let timeLasped = 0;
        if (this.lastPostDateMs !== null) {
            timeLasped = Math.floor((Date.now() - this.lastPostDateMs) / 1000);
            Logger.debug(new Date(Date.now()), `timeLasped: ${timeLasped}s`);
        }

        if (this.lastPostDateMs === null
            || this.lastPostData === null
            || daybitset.countOfCodingSlot() !== this.lastPostData.cardinality()
            || (timeLasped) > 5 * 60  // 5分钟以上
        ) {
            return true;
        }

        return false;
    }

    private doPostData(daybitset: DayBitSet): { status: boolean, msg: string } {
        let serverInfo = this.getServerInfo();
        let token = ConfigHelper.getInstance().getToken();
        if (token === null) {
            return {
                status: false,
                msg: "token is null, doPostData failed."
            };
        }

        // TODO 如何检验token不合法的情况，免得频繁上报：可以上报结果加一个值，然后服务器判断
        Logger.info(`Posting data, url:${serverInfo.baseURL}, token:${token}, day: ${daybitset.getDay()}, slot: ${daybitset.countOfCodingSlot()}`);

        axios({
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
            if (resData.status) {
                // handle success
                Logger.info(resData);
                return {
                    status: true,
                    msg: 'post data success.'
                };
            } else {
                // handle error
                Logger.error(resData);
                return {
                    status: false,
                    msg: resData.msg
                };
            }
        }).catch((error: any) => {
            Logger.error(error);
            if (error.response) {
                return {
                    status: false,
                    msg: 'post data failed: server error'
                };
            } else {
                return {
                    status: false,
                    msg: error.message
                };
            }
        }).then(() => {
            // always executed
        });

        return {
            status: true,
            msg: 'post data finished, status: unknown.'
        };
    }

    private getServerInfo(): any {
        return servers.REMOTE_SERVER;
        // return servers.LOCAL_SERVER;
    }

}