enum Status {win, loss, remake}

class GamerOverview {
    _ID: string
    _champID: string
    _status: Status

    constructor(ID: string, champID: string, status: Status) {
        this._ID = ID;
        this._champID = champID;
        this._status = status;
    }
}