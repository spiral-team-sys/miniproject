

let itemConfig = {
    APPID: '',
    APPNAME: 'noProject',
    BRANDNAME: 'noBrand',
    URL_ROOT: '',
    PRIMARY_COLOR: '#2196F3',
    SECONDARY_COLOR: '#FFC107',
    TERTIARY_COLOR: '#0a72a0',
    ICON_TYPE: 'ionicon'
};
export const configByName = (PROJECT) => {
    switch (PROJECT) {
        case 'eoe':
            itemConfig.APPNAME = 'EOE 3.0';
            itemConfig.BRANDNAME = 'Heineken';
            itemConfig.URL_ROOT = 'https://eoe-api.sucbat.com.vn/';
            itemConfig.PRIMARY_COLOR = '#007F2D'
            itemConfig.SECONDARY_COLOR = '#007f6c'
            itemConfig.TERTIARY_COLOR = '#e7f5e6'
            break;
        case 'hmer':
            itemConfig.APPNAME = 'Heineken Mer';
            itemConfig.BRANDNAME = 'Heineken Mer';
            itemConfig.URL_ROOT = 'https://merh-api.sucbat.com.vn/';
            itemConfig.PRIMARY_COLOR = '#008200'
            itemConfig.SECONDARY_COLOR = '#205527'
            itemConfig.TERTIARY_COLOR = '#e3f2fd'
            break;
        case "stock":
            itemConfig.APPNAME = 'Kiểm kho';
            itemConfig.BRANDNAME = 'HVN';
            itemConfig.URL_ROOT = 'https://hvnstock-api.sucbat.com.vn/';
            itemConfig.PRIMARY_COLOR = '#2196F3'
            itemConfig.SECONDARY_COLOR = '#009688'
            itemConfig.TERTIARY_COLOR = '#e7f5e6'
            break;
        case 'adhoc':
            itemConfig.APPNAME = 'Adhoc';
            itemConfig.BRANDNAME = 'Adhoc';
            itemConfig.URL_ROOT = 'https://cbp-api.sucbat.com.vn/';
            itemConfig.PRIMARY_COLOR = '#2196F3'
            itemConfig.SECONDARY_COLOR = '#009688'
            itemConfig.TERTIARY_COLOR = '#e7f5e6'
            break;
        case 'acecook':
            itemConfig.APPNAME = 'Acecook';
            itemConfig.BRANDNAME = 'Acecook';
            itemConfig.URL_ROOT = 'https://acecook-api.sucbat.com.vn/';
            itemConfig.PRIMARY_COLOR = '#fa0102'
            itemConfig.SECONDARY_COLOR = '#ffa189'
            itemConfig.TERTIARY_COLOR = '#ffe7e6'
            break;
        case 'brs':
            itemConfig.APPNAME = 'Spiral BRS';
            itemConfig.BRANDNAME = 'Bridgetone Survey';
            itemConfig.URL_ROOT = 'https://bridgestone.sucbat.com.vn/';
            itemConfig.PRIMARY_COLOR = '#2196F3'
            itemConfig.SECONDARY_COLOR = '#009688'
            itemConfig.TERTIARY_COLOR = '#e7f5e6'
            break;
        case 'vpm':
            itemConfig.APPNAME = 'Spiral VPM';
            itemConfig.BRANDNAME = 'VPM';
            itemConfig.URL_ROOT = 'https://vpm-api.sucbat.com.vn/';
            itemConfig.PRIMARY_COLOR = '#154f7d'
            itemConfig.SECONDARY_COLOR = '#59b9df'
            itemConfig.TERTIARY_COLOR = '#e1f3fa'
            break;
        default:
            itemConfig.APPNAME = 'No Project';
            itemConfig.BRANDNAME = 'No Project';
            break;
    }
    return { ...itemConfig, APPID: PROJECT };
};

