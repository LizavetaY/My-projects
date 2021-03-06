const countriesList = {
    AB: 'Abkhazia',
    AU: 'Australia',
    AT: 'Austria',
    AZ: 'Azerbaijan',
    AL: 'Albania',
    DZ: 'Algeria',
    AS: 'American Samoa',
    AI: 'Anguilla',
    AO: 'Angola',
    AD: 'Andorra',
    AQ: 'Antarctica',
    AG: 'Antigua and Barbuda',
    AR: 'Argentina',
    AM: 'Armenia',
    AW: 'Aruba',
    AF: 'Afghanistan',
    BS: 'Bahamas',
    BD: 'Bangladesh',
    BB: 'Barbados',
    BH: 'Bahrain',
    BY: 'Belarus',
    BZ: 'Belize',
    BE: 'Belgium',
    BJ: 'Benin',
    BM: 'Bermuda',
    BG: 'Bulgaria',
    BO: 'Plurinational state of Bolivia',
    BQ: 'Bonaire, Sint Eustatius and Saba',
    BA: 'Bosnia and Herzegovina',
    BW: 'Botswana',
    BR: 'Brazil',
    IO: 'British Indian Ocean Territory',
    BN: 'Brunei Darussalam',
    BF: 'Burkina Faso',
    BI: 'Burundi',
    BT: 'Bhutan',
    VU: 'Vanuatu',
    HU: 'Hungary',
    VE: 'Venezuela',
    VG: 'Virgin Islands, British',
    VI: 'Virgin Islands, U.S.',
    VN: 'Vietnam',
    GA: 'Gabon',
    HT: 'Haiti',
    GY: 'Guyana',
    GM: 'Gambia',
    GH: 'Ghana',
    GP: 'Guadeloupe',
    GT: 'Guatemala',
    GN: 'Guinea',
    GW: 'Guinea-Bissau',
    DE: 'Germany',
    GG: 'Guernsey',
    GI: 'Gibraltar',
    HN: 'Honduras',
    HK: 'Hong Kong',
    GD: 'Grenada',
    GL: 'Greenland',
    GR: 'Greece',
    GE: 'Georgia',
    GU: 'Guam',
    DK: 'Denmark',
    JE: 'Jersey',
    DJ: 'Djibouti',
    DM: 'Dominica',
    DO: 'Dominican Republic',
    EG: 'Egypt',
    ZM: 'Zambia',
    EH: 'Western Sahara',
    ZW: 'Zimbabwe',
    IL: 'Israel',
    IN: 'India',
    ID: 'Indonesia',
    JO: 'Jordan',
    IQ: 'Iraq',
    IR: 'Islamic Republic of Iran',
    IE: 'Ireland',
    IS: 'Iceland',
    ES: 'Spain',
    IT: 'Italy',
    YE: 'Yemen',
    CV: 'Cape Verde',
    KZ: 'Kazakhstan',
    KH: 'Cambodia',
    CM: 'Cameroon',
    CA: 'Canada',
    QA: 'Qatar',
    KE: 'Kenya',
    CY: 'Cyprus',
    KG: 'Kyrgyzstan',
    KI: 'Kiribati',
    CN: 'China',
    CC: 'Cocos (Keeling) Islands',
    CO: 'Colombia',
    KM: 'Comoros',
    CG: 'Congo',
    CD: 'Democratic Republic of??the Congo',
    KP: 'Democratic People\'s republic of Korea',
    KR: 'Korea, Republic of',
    CR: 'Costa Rica',
    CI: 'Cote d\'Ivoire',
    CU: 'Cuba',
    KW: 'Kuwait',
    CW: 'Cura??ao',
    LA: 'Lao People\'s Democratic Republic',
    LV: 'Latvia',
    LS: 'Lesotho',
    LB: 'Lebanon',
    LY: 'Libyan Arab Jamahiriya',
    LR: 'Liberia',
    LI: 'Liechtenstein',
    LT: 'Lithuania',
    LU: 'Luxembourg',
    MU: 'Mauritius',
    MR: 'Mauritania',
    MG: 'Madagascar',
    YT: 'Mayotte',
    MO: 'Macao',
    MW: 'Malawi',
    MY: 'Malaysia',
    ML: 'Mali',
    UM: 'United States Minor Outlying Islands',
    MV: 'Maldives',
    MT: 'Malta',
    MA: 'Morocco',
    MQ: 'Martinique',
    MH: 'Marshall Islands',
    MX: 'Mexico',
    FM: 'Federated States of Micronesia',
    MZ: 'Mozambique',
    MD: 'Moldova',
    MC: 'Monaco',
    MN: 'Mongolia',
    MS: 'Montserrat',
    MM: 'Burma',
    NA: 'Namibia',
    NR: 'Nauru',
    NP: 'Nepal',
    NE: 'Niger',
    NG: 'Nigeria',
    NL: 'Netherlands',
    NI: 'Nicaragua',
    NU: 'Niue',
    NZ: 'New Zealand',
    NC: 'New Caledonia',
    NO: 'Norway',
    AE: 'United Arab Emirates',
    OM: 'Oman',
    BV: 'Bouvet Island',
    IM: 'Isle of Man',
    NF: 'Norfolk Island',
    CX: 'Christmas Island',
    HM: 'Heard Island and McDonald Islands',
    KY: 'Cayman Islands',
    CK: 'Cook Islands',
    TC: 'Turks and Caicos Islands',
    PK: 'Pakistan',
    PW: 'Palau',
    PS: 'Palestinian Territory, Occupied',
    PA: 'Panama',
    VA: 'Holy See (Vatican City State)',
    PG: 'Papua New Guinea',
    PY: 'Paraguay',
    PE: 'Peru',
    PN: 'Pitcairn',
    PL: 'Poland',
    PT: 'Portugal',
    PR: 'Puerto Rico',
    MK: 'The Former Yugoslav Republic Of Macedonia',
    RE: 'Reunion',
    RU: 'Russian Federation',
    RW: 'Rwanda',
    RO: 'Romania',
    WS: 'Samoa',
    SM: 'San Marino',
    ST: 'Sao Tome and Principe',
    SA: 'Saudi Arabia',
    SZ: 'Swaziland',
    SH: 'Saint Helena, Ascension And Tristan Da Cunha',
    MP: 'Northern Mariana Islands',
    BL: 'Saint Barth??lemy',
    MF: 'Saint Martin (French Part)',
    SN: 'Senegal',
    VC: 'Saint Vincent and the Grenadines',
    KN: 'Saint Kitts and Nevis',
    LC: 'Saint Lucia',
    PM: 'Saint Pierre and Miquelon',
    RS: 'Serbia',
    SC: 'Seychelles',
    SG: 'Singapore',
    SX: 'Sint Maarten',
    SY: 'Syrian Arab Republic',
    SK: 'Slovakia',
    SI: 'Slovenia',
    GB: 'United Kingdom',
    US: 'United States',
    SB: 'Solomon Islands',
    SO: 'Somalia',
    SD: 'Sudan',
    SR: 'Suriname',
    SL: 'Sierra Leone',
    TJ: 'Tajikistan',
    TH: 'Thailand',
    TW: 'Taiwan, Province of China',
    TZ: 'United Republic Of Tanzania',
    TL: 'Timor-Leste',
    TG: 'Togo',
    TK: 'Tokelau',
    TO: 'Tonga',
    TT: 'Trinidad and Tobago',
    TV: 'Tuvalu',
    TN: 'Tunisia',
    TM: 'Turkmenistan',
    TR: 'Turkey',
    UG: 'Uganda',
    UZ: 'Uzbekistan',
    UA: 'Ukraine',
    WF: 'Wallis and Futuna',
    UY: 'Uruguay',
    FO: 'Faroe Islands',
    FJ: 'Fiji',
    PH: 'Philippines',
    FI: 'Finland',
    FK: 'Falkland Islands (Malvinas)',
    FR: 'France',
    GF: 'French Guiana',
    PF: 'French Polynesia',
    TF: 'French Southern Territories',
    HR: 'Croatia',
    CF: 'Central African Republic',
    TD: 'Chad',
    ME: 'Montenegro',
    CZ: 'Czech Republic',
    CL: 'Chile',
    CH: 'Switzerland',
    SE: 'Sweden',
    SJ: 'Svalbard and Jan Mayen',
    LK: 'Sri Lanka',
    EC: 'Ecuador',
    GQ: 'Equatorial Guinea',
    AX: '??land Islands',
    SV: 'El Salvador',
    ER: 'Eritrea',
    EE: 'Estonia',
    ET: 'Ethiopia',
    ZA: 'South Africa',
    GS: 'South Georgia and the South Sandwich Islands',
    OS: 'South Ossetia',
    SS: 'South Sudan',
    JM: 'Jamaica',
    JP: 'Japan'
};

export const setCountriesListToLS = () => {
    localStorage.setItem('countriesList', JSON.stringify(countriesList))
};

export const getCountriesListToLS = () => {
    return JSON.parse(localStorage.getItem('countriesList'))
};