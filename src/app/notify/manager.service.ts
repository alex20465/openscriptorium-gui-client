import {Injectable} from '@angular/core';
export enum AlertLevel {
    DANGER,
    WARNING,
    SUCCESS,
    INFO,
}

export class Alert {

    constructor(public title: string, public message: string, public level: AlertLevel) {

    }
}


@Injectable()
export class ManagerService {
    private _alerts: Array<Alert> = [];

    get alerts(): Array<Alert> {
        return this._alerts;
    }

    set alerts(value: Array<Alert>) {
        this._alerts = value;
    }

    constructor() {

    }

    remove(alert: Alert): Alert {
        const i = this.alerts.indexOf(alert);
        if (i == -1) {
            throw new Error('Alert not found!');
        }

        return this.alerts.splice(i, 1).pop();
    }

    success(title: string, message: string) {
        this._alerts.push(new Alert(title, message, AlertLevel.SUCCESS));
    }

    warning(title: string, message: string) {
        this._alerts.push(new Alert(title, message, AlertLevel.WARNING));
    }

    danger(title: string, message: string) {
        this._alerts.push(new Alert(title, message, AlertLevel.DANGER));
    }

    info(title: string, message: string) {
        this._alerts.push(new Alert(title, message, AlertLevel.INFO));
    }
}
