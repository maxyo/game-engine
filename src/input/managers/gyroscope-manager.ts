import {Manager} from "../../core/manager/manager";

export class GyroscopeManager extends Manager{
    init() {
        navigator.permissions.query({name: "gyroscope"}).then(() => {

        });
    }
}
