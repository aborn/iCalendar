import { DayBitSet } from "./user/daybitset";
import { DataSender } from "./sender/datasender";
import * as DateUtils from "./utils/dateutils";
import { Logger } from "./common/logger";

export class TimeTrace {
    private daybitset: DayBitSet;
    private datasender: DataSender;
    // vs-code is active or inactive
    private isActive: boolean;
    private openTime: Date | null;
    private closeTime: Date | null;
    private timer: NodeJS.Timeout;

    constructor() {
        this.daybitset = new DayBitSet();

        // initial record when open.
        this.record();
        this.datasender = new DataSender();
        this.isActive = true;
        this.openTime = new Date();
        this.closeTime = null;

        // post data for each 30s 
        this.timer = setInterval((that) => {
            that.timerAction();
        }, 30 * 1000, this);
    }

    public record(): void {
        if (!this.isActive) {
            Logger.debug('vscode window deactived, do not record.');
            return;
        }

        let currentSlot = this.daybitset.record();
        Logger.debug(`slot:${currentSlot} active`);
        let openTimeSlot = this.getOpenedSlot();

        if (openTimeSlot >= 0) {
            // console.log('current slot:' + currentSlot + ", openedTimeSlot:" + openTimeSlot);
            let findVerIndex = -1;
            let i = currentSlot - 1;
            for (; i >= openTimeSlot; i--) {
                if (this.daybitset.getBitSet().get(i)) {
                    findVerIndex = i;
                    break;
                }
            }

            // only trace back 5 minutes, interval 10 slot.
            if (findVerIndex >= 0 && findVerIndex < currentSlot
                && (currentSlot - findVerIndex) < 10) {
                for (let j = findVerIndex + 1; j < currentSlot; j++) {
                    this.daybitset.getBitSet().set(j);
                    Logger.debug(`trace slot:${j} active`);
                }
            }
        }
    }

    private timerAction(): void {
        this.datasender.postData(this.daybitset);
    }

    public setVSCodeWindowState(state: boolean): void {
        Logger.debug('------ window ' + (state ? 'actived' : 'deactived') + ' ------', new Date());
        state ? this.active() : this.deactive();
    }

    private getOpenedSlot(): number {
        if (this.openTime === null) { return -1; }

        // ignore if not today
        if (!DateUtils.isToday(DateUtils.getDayInfo(this.openTime))) {
            return -1;
        }

        return DateUtils.getSlotIndex(this.openTime);
    }

    private active() {
        if (this.isActive) {
            if (this.openTime === null) {
                this.openTime = new Date();
            }
        } else {
            this.isActive = true;
            this.openTime = new Date();
        }
    }

    private deactive() {
        if (this.isActive) {
            this.isActive = false;
            this.closeTime = new Date();
        } else {
            if (this.closeTime === null) {
                this.closeTime = new Date();
            }
        }
    }

    public dispose() {
        clearInterval(this.timer);
    }
}