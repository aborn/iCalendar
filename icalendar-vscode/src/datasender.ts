import axios from 'axios';
import { DayBitSet } from "./daybitset";
import { BitSet } from "./bitset";
import * as servers from "./serverinfo";
import { ConfigHelper } from "./confighelper";

export class DataSender {
    private lastPostDate: Date | null;
    private lastPostData: BitSet;

    constructor() {
        this.lastPostDate = null;
        this.lastPostData = new DayBitSet().getBitSet();
        // init it!
        ConfigHelper.getInstance();
    }

    public postData(daybitset: DayBitSet): string {
        if (this.isNeedPost(daybitset)) {
            let result = this.doPostData(daybitset);
            this.lastPostDate = new Date();
            this.lastPostData.or(daybitset.getBitSet());
            return result.msg;
        } else {
            return "No need to post!";
        }
    }

    private isNeedPost(daybitset: DayBitSet): boolean {
        const now = new Date();
        let timeLasped = 0;
        if (this.lastPostDate !== null) {
            timeLasped = (now.getTime() - this.lastPostDate.getTime()) / 1000;
        }

        if (this.lastPostDate === null
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

        console.log(`token:${token}=>` + daybitset.getDay() + ":" + daybitset.countOfCodingSlot());
        console.log('post axios message:');
        
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
            // handle success
            let resData = response.data;
            console.log('http resData', resData);
            // TODO dealing code not 200!!
            return {
                status: true, 
                msg: 'post data success.'
            };
        }).catch((error: any) => {
            console.log(error);
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
            msg: 'finished post, status: unknown.'
        };
    }

    private getServerInfo(): any {
        return servers.REMOTE_SERVER;
        // return servers.LOCAL_SERVER;
    }

}