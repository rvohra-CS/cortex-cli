/*
 * Copyright 2018 Cognitive Scale, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const request = require('superagent');
const debug = require('debug')('cortex:cli');

module.exports = class Connections {

    constructor(cortexUrl) {
        this.cortexUrl = cortexUrl;
        this.endpoint = `${cortexUrl}/v2/connections`;
    }

    listConnections(token) {
        const endpoint = `${this.endpoint}`;
        return request
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .then((res) => {
                if (res.ok) {
                    return {success: true, result: res.body};
                }
                return {success: false, status: res.status, message: res.body};
            });
    }

    saveConnection(token, {name, title, description, connectionType, allowWrite, tags, params}) {
        debug('saveConnection(%s) => %s', name, this.endpoint);
        return request
            .post(this.endpoint)
            .set('Authorization', `Bearer ${token}`)
            .send({name, title, description, connectionType, allowWrite, tags, params})
            .then((res) => {
                if (res.ok) {
                    return {success: true, message: res.body};
                }
                return {success: false, message: res.body, status: res.status};
            });
    }

    describeConnection(token, connectionName) {
        const endpoint = `${this.endpoint}/${connectionName}`;
        debug('describeConnection(%s) => %s', connectionName, endpoint);
        return request
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .then((res) => {
                if (res.ok) {
                    return {success: true, result: res.body};
                }
                else {
                    return {success: false, message: res.body, status: res.status};
                }
            });
    }

    testConnection(token, {name, title, description, connectionType, allowWrite, tags, params}) {
        const url = this.endpoint + '/test';
        debug('saveConnection(%s) => %s', name, url);
        return request
            .post(url)
            .set('Authorization', `Bearer ${token}`)
            .send({name, title, description, connectionType, allowWrite, tags, params})
            .then((res) => {
                if (res.ok) {
                    return {success: true, message: res.body};
                }
                return {success: false, message: res.message, status: res.status};
            });
    }

    listConnectionsTypes(token) {
        const endpoint = `${this.endpoint}/types`;
        return request
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .then((res) => {
                if (res.ok) {
                    return {success: true, result: res.body};
                }
                return {success: false, status: res.status, message: res.body};
            });
    }

}

