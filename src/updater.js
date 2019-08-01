'use strict';

import pkgConfig from '../package.json';
    
export function checkUpdate() {
    return fetch("https://api.github.com/repos/Holusion/stargazer/releases/latest", {
        headers: new Headers({'User-Agent': 'request'})
    }).then(response => {
        if(response.status === 200) {
            return response.json()
        } else {
            return Promise.reject(new Error(response.status, response.statusText));
        }
    }).then(info => {
        if(info.tag_name.replace('v', '') != pkgConfig.version) {
            return info;
        }
        return null;
    }).catch((err) => {
        Promise.reject(err);
    })
}

