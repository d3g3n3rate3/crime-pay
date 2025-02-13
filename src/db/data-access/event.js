const EventModel = require("../../model/event");
const EventTypes = require('../../enum/event-types');
const { Util } = require("../../lib/util");
const DataAccess = require("./data-access");
const phrase = require("../../const/phrase");

module.exports = class EventData extends DataAccess {

    constructor() {
        super('event');
    }

    one(type, message, success) {
        const self = this;

        self.event = new EventModel(type).setSuccess(success);

        self.message = message?.[success ? 'SUCCESS' : 'FAIL']?.randomOne() || phrase.NO_EVENT_MESSAGE;

        self.event.save = () => {
            return self.save(self.event.assert()).then((event) => {
                event.message = self.message;
                return event;
            })
        }

        return this.event;
    }

    static bribe(success) {
        return new EventData().one(EventTypes.PRISON_BRIBE, phrase.PRISON_BRIBE, success);
    }

    static escape(success) {
        return new EventData().one(EventTypes.PRISON_ESCAPE, phrase.PRISON_ESCAPE, success);
    }


    static robbery(success) {
        return new EventData().one(EventTypes.ROB, phrase.ROBBERY, success);
    }

    static marketDeal(success) {
        return new EventData().one(EventTypes.MARKET_BUY_ITEM, phrase.MARKET, success);
    }

    static clubHooker(success) {
        return new EventData().one(EventTypes.CLUB_HOOKER, phrase.CLUB_HOOKER, success);
    }

    static clubDrug(success) {
        return new EventData().one(EventTypes.CLUB_DRUG, phrase.CLUB_DRUG, success);
    }


}
