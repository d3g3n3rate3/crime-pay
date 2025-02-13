class MiniCards {

    constructor() {
        this.setLoadDelay(200);
    }

    setLastSelectedVar(lastSelectedVar) {
        this.lastSelected = lastSelectedVar;
        return this;
    }

    setLoadDelay(loadDelay) {
        this.loadDelay = loadDelay;
        return this;
    }

    setUrl(url) {
        this.url = url;
        return this;
    }

    setHolderSelector(selector) {
        this.holder = $(selector);

        return this.setCardsSelector(selector + ' .mini-card')
            .setPlaceHolderCardsSelector(selector + ' .mini-card-ph');
    }

    setCardsSelector(selector) {
        this.cardsSelector = selector;
        return this;
    }

    setPlaceHolderCardsSelector(selector) {
        this.placeHolderItemsSelector = selector;
        return this;
    }


    onBeforeLoad() {
        $(this.cardsSelector).remove();
        $(this.placeHolderItemsSelector).show();
    }

    onAfterLoad() {
        $(this.cardsSelector).hide().fadeIn();
        $(this.placeHolderItemsSelector).hide();
    }

    setOnCardSelected(onCardSelected) {
        this.onCardSelected = onCardSelected;
        return this;
    }

    onInnerCardSelected() {
        const self = this;
        return function (event) {
            event.stopPropagation();
            event.stopImmediatePropagation();

            const currentSelected = $(this).data('key');

            if ((self.lastSelected !== currentSelected) || ($(self.cardsSelector).find('.selected').length == 0)) {

                $('.mini-card-scroll-items .mini-card').removeClass('selected');
                $(this).addClass('selected')

                self.lastSelected = currentSelected;

                if (self.onCardSelected) {
                    self.onCardSelected(self.lastSelected);
                }
            }

            return true;
        }
    }


    load(autoSelect = true) {
        this.onBeforeLoad();

        setTimeout(() => {
            this.holder.load(this.url, () => {
                this.onAfterLoad();

                $(this.cardsSelector).unbind().click(this.onInnerCardSelected());

                if (autoSelect) {
                    //Select the last chosen or the first one
                    $(this.cardsSelector).first().add("[data-key='" + this.lastSelected + "']").last().click();
                }
            });
        }, this.loadDelay);
    }

}

