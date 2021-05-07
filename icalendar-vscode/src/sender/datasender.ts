import { DayBitSet } from "../user/daybitset";
import * as servers from "./serverinfo";
import { ConfigHelper } from "../utils/confighelper";
import { Logger } from "../common/logger";
import * as httpclient from "./httpclient";
import * as dateutils from "../utils/dateutils";
import * as consts from "../common/consts";

export class DataSender {
    private lastPostDateMs: number | null;
    private lastPostData: DayBitSet;
    private postIntervalS: number;

    constructor() {
        this.lastPostDateMs = null;
        this.lastPostData = new DayBitSet();
        this.postIntervalS = consts.DEFAULT_INTERVAL;

        // init it!
        ConfigHelper.getInstance();
    }

    public postData(daybitset: DayBitSet): void {
        let serverInfo = this.getServerInfo();
        let token = serverInfo.token;

        if (token === null || token.trim().length === 0) {
            Logger.error(`Post failed: token is illgal, token:${token}`);
            return;
        }

        if (this.isNeedPost(daybitset)) {
            let startTime = Date.now();
            Logger.debug('post start:', new Date(startTime));
            let promise = httpclient.doPostData(daybitset, serverInfo);
            promise.then((result) => {
                this.lastPostDateMs = Date.now();

                if (result.status) {
                    this.lastPostDateMs = Date.now();
                    this.lastPostData.clearIfNotToday(); // Note: clear if not today
                    this.lastPostData.getBitSet().or(daybitset.getBitSet());
                    this.scaleInterval(-1);
                } else {
                    let resData = result.data;
                    let bizCode = resData.code;

                    if (result.httpCode === 200) {
                        
                        this.scaleInterval(1);
                        this.lastPostData.clearIfNotToday(); // Note: clear if not today
                        this.lastPostData.getBitSet().or(daybitset.getBitSet());

                        // bizCode: 501--time error, 401--paramter error
                        if (bizCode === 501) {
                            daybitset.clearIfNotToday();
                        }
                    }
                }

                let info = dateutils.timeSpent(startTime);
                Logger.info(`Post finished! time spent:${info.humanReadable}, slot:${daybitset.countOfCodingSlot()}, status:${result.status}, msg:${result.msg}, httpcode:${result.httpCode}`);
            }, (error) => {
                Logger.error('Post error', error);
            }).finally(() => {
                Logger.debug('Finilly in post');
            });
        }
    }

    private scaleInterval(type: number = 0) {
        let after = this.postIntervalS + (consts.DEFAULT_INTERVAL * type);
        if (type === 1) {
            if (after < 12 * consts.DEFAULT_INTERVAL) {
                this.postIntervalS = after;
            }
        } else if (type === -1) {
            if (after > consts.DEFAULT_INTERVAL) {
                this.postIntervalS = after;
            }
        }
    }

    private isNeedPost(daybitset: DayBitSet): boolean {
        let timeLasped = 0;
        let timeInfo = null;
        if (this.lastPostDateMs !== null) {
            timeInfo = dateutils.timeSpent(this.lastPostDateMs);
            timeLasped = timeInfo.tS;
        }

        let postCountSlot = daybitset.countOfCodingSlot();
        if (this.lastPostDateMs !== null
            && (postCountSlot === this.lastPostData.countOfCodingSlot() || postCountSlot === 0)
            && (timeLasped) < this.postIntervalS  // 5分钟以上
        ) {
            Logger.info(`No need to post! timeLasped: ${timeInfo.humanReadable}, interval: ${this.postIntervalS}`);
            return false;
        }

        return true;
    }

    private getServerInfo(): servers.ServerInfo {
        let token = ConfigHelper.getInstance().getToken();
        let serverInfo = servers.REMOTE_SERVER;
        // let serverInfo = servers.LOCAL_SERVER;
        serverInfo.token = token;
        return serverInfo;
    }

}