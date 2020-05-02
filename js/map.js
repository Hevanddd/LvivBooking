'use strict';

var map = document.querySelector(".map");
var mapPins = document.querySelector('.map__pins');
var mainPin = document.querySelector('.map__pin--main');
var notice = document.querySelector('.notice__form');
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var mapFilters = document.querySelector('.map__filters-container');

var translateType = function (type) {
    switch (type) {
        case 'palace':
            return 'Палац';
        case 'bungalo':
            return 'Бунгало';
        case 'house':
            return 'Дом';
        case 'flat':
            return 'Квартира';
    }
}

var removeAllChild = function (parent) {
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
}

function createPin(marker) {
    var mapPinElement = mapPinTemplate.cloneNode(true);
    mapPinElement.querySelector('img').src = marker.author;
    mapPinElement.style.left = marker.location.x + 'px';
    mapPinElement.style.top = marker.location.y + 'px';
    mapPinElement.style.display = 'none';

    return mapPinElement;
}

function renderMapPin(advertisement) {
    var mapPinElementCard = mapCardTemplate.cloneNode(true);
    mapPinElementCard.style.display = "none";
    mapPinElementCard.querySelector('.popup__avatar').src = advertisement.author;
    mapPinElementCard.querySelector('.popup__avatar').alt = advertisement.title;
    mapPinElementCard.querySelector('.popup__title').textContent = advertisement.title;
    mapPinElementCard.querySelector('.popup__price').textContent = advertisement.price + 'грн/ніч';
    mapPinElementCard.querySelector('.popup__type').textContent = translateType(advertisement.type);
    mapPinElementCard.querySelector('.popup__text').textContent = advertisement.rooms + ' кімнати для ' + advertisement.guests + ' гостей';
    mapPinElementCard.querySelector('.popup__text-time').textContent = 'Заїзд после ' + advertisement.checkin + ', виїзд до ' + advertisement.checkout;
    mapPinElementCard.querySelector('.popup__description').textContent = advertisement.description;
    mapPinElementCard.querySelector('.popup__pictures').textContent = advertisement.description;

    var features = mapPinElementCard.querySelector('.popup__features');
    var wifi = mapPinElementCard.querySelector('.feature--wifi');
    var dishwasher = mapPinElementCard.querySelector('.feature--dishwasher');
    var parking = mapPinElementCard.querySelector('.feature--parking');
    var washer = mapPinElementCard.querySelector('.feature--washer');
    var elevator = mapPinElementCard.querySelector('.feature--elevator');
    var conditioner = mapPinElementCard.querySelector('.feature--conditioner');

    removeAllChild(features);

    for (var i = 0; i < advertisement.features.length; i++) {
        switch (advertisement.features[i]) {
            case 'wifi':
                features.appendChild(wifi);
                break;
            case 'dishwasher':
                features.appendChild(dishwasher);
                break;
            case 'parking':
                features.appendChild(parking);
                break;
            case 'washer':
                features.appendChild(washer);
                break;
            case 'elevator':
                features.appendChild(elevator);
                break;
            case 'conditioner':
                features.appendChild(conditioner);
                break;
        }
    }
    return mapPinElementCard;
}

var mapPins = document.querySelector('.map__pins');
var fragmentAdvertisements = document.createDocumentFragment();
var fragmentPins = document.createDocumentFragment();

window.render = function (adver) {

    for (var i = 0; i < adver.length; i++) {

        fragmentPins.appendChild(createPin(adver[i]));
        fragmentAdvertisements.appendChild(renderMapPin(adver[i]));
    }
    mapPins.appendChild(fragmentPins);
    map.insertBefore(fragmentAdvertisements, mapFilters);
}

window.render(window.advertisements);

window.removePins = function () {
    var mapPinsItems = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    mapPinsItems.forEach(function (it) {
        it.remove();
    })
};

var disabledInputs = document.querySelectorAll("[disabled]")
var addressInput = document.querySelector('#address');

addressInput.value = (mainPin.offsetLeft + mainPin.offsetWidth / 2) + ", " + (mainPin.offsetTop + mainPin.offsetHeight);

function activatePage() {
    for (let i = 0; i < disabledInputs.length; i++) {
        disabledInputs[i].removeAttribute("disabled");
    }
    map.classList.remove("map--faded");
    notice.classList.remove('notice__form--disabled');
}

function setAddressInput() {
    addressInput.value = (mainPin.offsetLeft + mainPin.offsetWidth / 2) + ", " + (mainPin.offsetTop + mainPin.offsetHeight);
}

window.showMap = function (evt) {
    var mapDisplayNone = document.querySelectorAll('.map__card');
    var target = evt.target.closest('BUTTON');
    if (!target) return;
    for (var i = 0; i < window.advertisements.length; i++) {
        mapDisplayNone[i].style.display = 'none';
        if (window.advertisements[i].location.x == target.offsetLeft && window.advertisements[i].location.y == target.offsetTop) {
            mapDisplayNone[i].style.display = "block";
        }
    }
}

window.showMapPins = function () {
    var mapPinsDisplayNone = document.querySelectorAll('.map__pin');
    for (var i = 0; i < mapPinsDisplayNone.length; i++) {
        mapPinsDisplayNone[i].style.display = "block";
    }
}
mainPin.addEventListener('mousedown', activatePage);
mainPin.addEventListener('mousedown', window.activateFilter);
map.addEventListener('click', showMap);
mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
        x: evt.clientX,
        y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = {
            x: startCoords.x - moveEvt.clientX,
            y: startCoords.y - moveEvt.clientY,
        }

        startCoords = {
            x: moveEvt.clientX,
            y: moveEvt.clientY
        };

        var mainPinPosition = {
            x: mainPin.offsetLeft - shift.x,
            y: mainPin.offsetTop - shift.y
        }

        var border = {
            top: mainPin.offsetWidth / 2,
            bottom: map.offsetHeight - mainPin.offsetHeight - 30,
            left: mainPin.offsetWidth / 2,
            right: map.offsetWidth - mainPin.offsetWidth / 2
        };
        if (mainPinPosition.x >= border.left && mainPinPosition.x <= border.right) {
            mainPin.style.left = mainPinPosition.x + 'px';
        }
        if (mainPinPosition.y >= border.top && mainPinPosition.y <= border.bottom) {
            mainPin.style.top = mainPinPosition.y + 'px';
        }
        mainPin.addEventListener('mousemove', setAddressInput);
    }

    var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});