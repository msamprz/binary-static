const createLanguageDropDown = require('./attach_dom/language_dropdown');
const BinarySocket           = require('../base/socket');
const getElementById         = require('../../_common/common_functions').getElementById;
const Crowdin                = require('../../_common/crowdin');
const Language               = require('../../_common/language');
const LocalStore             = require('../../_common/storage').LocalStore;
const State                  = require('../../_common/storage').State;
const applyToAllElements     = require('../../_common/utility').applyToAllElements;

const checkClientsCountry = () => {
    if (Crowdin.isInContext()) return;
    BinarySocket.wait('website_status', 'authorize').then(() => {
        const website_status = State.getResponse('website_status');
        if (!website_status) return;
        const clients_country = website_status.clients_country;
        // only limitLanguage for japanese if ip address is from japan and client is logged out or logged in with jp residence
        if (clients_country === 'jp' && (!LocalStore.get('active_loginid') || jpResidence())) {
            limitLanguage('JA');
        } else if (clients_country === 'id' && !/^(iom|malta|maltainvest)$/.test(getClientInfo().landing_company_shortcode)) {
            limitLanguage('ID');
        } else {
            createLanguageDropDown(website_status);
        }
    });
};

const limitLanguage = (lang) => {
    if (Language.get() !== lang) {
        window.location.href = Language.urlFor(lang); // need to redirect not using pjax
    }
    if (getElementById('select_language')) {
        $('.languages').remove();
        $('#gmt-clock').addClass('gr-6 gr-11-m').removeClass('gr-5 gr-6-m');
        $('#contact-us').addClass('gr-5').removeClass('gr-2');
    }
};

const jpClient = () => (Language.get() === 'JA' || jpResidence());

const getClientInfo = () => (LocalStore.getObject('client.accounts')[LocalStore.get('active_loginid')] || {});

const jpResidence = () => getClientInfo().residence === 'jp';

const checkLanguage = () => {
    if (Language.get() === 'ID') {
        const $academy_link = $('.academy a');
        const academy_href  = $academy_link.attr('href');
        const regex         = /id/;
        if (!regex.test(academy_href)) {
            $academy_link.attr('href', academy_href + regex);
        }
    }
    if (jpClient()) {
        $('.ja-hide').setVisibility(0);
        applyToAllElements('.ja-show', (el) => {
            if (!/client_logged_(in|out)/.test(el.classList)) {
                el.setVisibility(1);
            }
        });
        if (!jpResidence()) {
            $('#topMenuCashier').hide();
        }
    }
};

module.exports = {
    checkClientsCountry,
    jpClient,
    jpResidence,
    checkLanguage,
};
