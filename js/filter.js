'use strict';

(function () {
    var PINS_LIMIT = 8;

    var PriceRange = {
        LOW: {
            MIN: 0,
            MAX: 500
        },
        MIDDLE: {
            MIN: 500,
            MAX: 2500
        },
        HIGH: {
            MIN: 5000,
            MAX: Infinity
        }
    };

    var filter = document.querySelector('.map__filters');
    var filterItems = filter.querySelectorAll('select, input');
    var typeSelect = filter.querySelector('#housing-type');
    var priceSelect = filter.querySelector('#housing-price');
    var roomsSelect = filter.querySelector('#housing-rooms');
    var guestsSelect = filter.querySelector('#housing-guests');
    var featuresFieldset = filter.querySelector('#housing-features');
    var filteredData = [];

    var filtrationItem = function (it, item, key) {
        return it.value === 'any' ? true : it.value === item[key].toString();
    };

    var filtrationByType = function (item) {
        return filtrationItem(typeSelect, item, "type");
    };

    var filtrationByPrice = function (item) {
        var filteringPrice = PriceRange[priceSelect.value.toUpperCase()];
        return filteringPrice ? item.price >= filteringPrice.MIN && item.price <= filteringPrice.MAX : true;
    };

    var filtrationByRooms = function (item) {

        return filtrationItem(roomsSelect, item, "rooms");
    };

    var filtrationByGuests = function (item) {
        return filtrationItem(guestsSelect, item, 'guests');
    };

    var filtrationByFeatures = function (item) {
        var checkedFeaturesItems = featuresFieldset.querySelectorAll('input:checked');
        return Array.from(checkedFeaturesItems).every(function (element) {
            return item.features.includes(element.value);
        });
    };

    var removePins = function () {
        var mapPinsItems = document.querySelectorAll('.map__pin:not(.map__pin--main)');
        mapPinsItems.forEach(function (it) {
            it.remove();
        });
    };

    var removeMapCard = function () {
        var mapCards = document.querySelectorAll('.map__card');
        mapCards.forEach(function (it) {
            it.style.display = "none";
        });
    };

    var onFilterChange = function () {
        filteredData = window.advertisements.slice(0);
        filteredData = filteredData.filter(filtrationByType).filter(filtrationByPrice).filter(filtrationByRooms).filter(filtrationByGuests).filter(filtrationByFeatures);
        removePins();
        // removeMapCard();
        window.render(filteredData.slice(0, PINS_LIMIT));
        window.showMapPins();
    };

    window.activateFilter = function () {
        filterItems.forEach(function (it) {
            it.disabled = false;
        });
        onFilterChange();
        filter.addEventListener('change', onFilterChange);
    };
})();