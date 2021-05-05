import { DayBitSet } from "../user/daybitset";
import * as servers from "./serverinfo";
import { ConfigHelper } from "../utils/confighelper";
import { Logger } from "../common/logger";
import * as httpclient from "./httpclient";

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
                    Logger.error(result.data);
                }

                let time = (Date.now() - startTime);
                let info = "";
                if (time < 1000) {
                    info = `${time}ms`;
                } else {
                    info = Math.floor(time / 1000) + 's';
                }

                Logger.info(`Post finished! time spent:${info}, slot:${daybitset.countOfCodingSlot()}, status:${result.status}, msg:${result.msg}, httpcode:${result.httpCode}`);
            }, (error) => {
                Logger.error('post error', error);
            }).finally(() => {
                Logger.debug('finilly in post');
            });
        } else {
            Logger.info("No need to post!");
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
            || daybitset.countOfCodingSlot() !== this.lastPostData.countOfCodingSlot()
            || (timeLasped) > 5 * 60  // 5分钟以上
        ) {
            return true;
        }

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