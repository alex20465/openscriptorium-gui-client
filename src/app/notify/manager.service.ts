import {Injectable} from '@angular/core';
export enum AlertLevel {
    DANGER,
    WARNING,
    SUCCESS,
    INFO,
}

export class Alert {

    constructor(public id: string, public message: string, public level: AlertLevel) {

    }
}


@Injectable()
export class ManagerService {
    private _alerts: Array<Alert> = [];
    private _alert_map: Object = {};

    get alerts(): Array<Alert> {
        return this._alerts;
    }

    set alerts(value: Array<Alert>) {
        this._alerts = value;
    }

    private add(id: string, alert: Alert) {
        if (this._alert_map[id] !== undefined) {
            // replace
            let alertIndex = this._alerts.indexOf(this._alert_map[id]);
            this._alerts[alertIndex] = alert;

        } else {
            // add
            this._alerts.push(alert);
        }

        this._alert_map[id] = alert;
    }

    remove(alert: Alert): Alert {
        const i = this.alerts.indexOf(alert);
        if (i == -1) {
            throw new Error('Alert not found!');
        }
        delete this._alert_map[alert.id];
        return this.alerts.splice(i, 1).pop();
    }

    success(id: string, message: string) {
        this.add(id, new Alert(id, message, AlertLevel.SUCCESS));
    }

    warning(id: string, message: string) {
        this.add(id, new Alert(id, message, AlertLevel.WARNING));
    }

    danger(id: string, message: string) {
        this.add(id, new Alert(id, message, AlertLevel.DANGER));
    }

    info(id: string, message: string) {
        this.add(id, new Alert(id, message, AlertLevel.INFO));
    }
}
