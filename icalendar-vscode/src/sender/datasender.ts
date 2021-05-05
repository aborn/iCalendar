import { DayBitSet } from "../user/daybitset";
import * as servers from "./serverinfo";
import { ConfigHelper } from "../utils/confighelper";
import { Logger } from "../common/logger";
import * as httpclient from "./httpclient";
import * as dateutils from "../utils/dateutils";

export class DataSender {
    private lastPostDateMs: number | null;
    private lastPostData: DayBitSet;

    constructor() {
        this.lastPostDateMs = null;
        this.lastPostData = new DayBitSet();
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
                if (result.status) {
                    this.lastPostDateMs = Date.now();
                    this.lastPostData.clearIfNotToday(); // Note: clear if not today
                    this.lastPostData.getBitSet().or(daybitset.getBitSet());
                } else {
                    // TODO 如何检验token不合法的情况，免得频繁上报：可以上报结果加一个值，然后服务器判断
                    Logger.error(result.data);
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

    private isNeedPost(daybitset: DayBitSet): boolean {
        let timeLasped = 0;
        let timeInfo = null;
        if (this.lastPostDateMs !== null) {
            timeInfo = dateutils.timeSpent(this.lastPostDateMs);
            timeLasped = timeInfo.tS;
        }

        if (this.lastPostDateMs === null
            || this.lastPostData === null
            || daybitset.countOfCodingSlot() !== this.lastPostData.countOfCodingSlot()
            || (timeLasped) > 5 * 60  // 5分钟以上
        ) {
            return true;
        }

        Logger.info(`No need to post! timeLasped: ${timeInfo.humanReadable}`);
        return false;
    }

    private getServerInfo(): servers.ServerInfo {
        let token = ConfigHelper.getInstance().getToken();
        let serverInfo = servers.REMOTE_SERVER;
        // let serverInfo = servers.LOCAL_SERVER;
        serverInfo.token = token;
        return serverInfo;
    }

}