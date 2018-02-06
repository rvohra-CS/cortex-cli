const fs = require('fs');
const debug = require('debug')('cortex:cli');
const { loadProfile } = require('../config');
const Catalog = require('../client/catalog');
const { printSuccess, printError, filterObject, parseObject } = require('./utils');

module.exports.SaveSkillCommand = class SaveSkillCommand {

    constructor(program) {
        this.program = program;
    }

    execute(skillDefinition, options) {
        debug('%s.executeSaveSkill(%s)', options.profile, skillDefinition);
        const profile = loadProfile(options.profile);
        const catalog = new Catalog(profile.url);

        const skillDefStr = fs.readFileSync(skillDefinition);
        const skill = parseObject(skillDefStr, options);

        catalog.saveSkill(profile.token, skill).then((response) => {
            if (response.success) {
                printSuccess(`Skill saved`, options);
            }
            else {
                printError(`Failed to save skill: ${response.status} ${response.message}`, options);
            }
        })
        .catch((err) => {
            printError(`Failed to save skill: ${err.status} ${err.message}`, options);
        });
    }
};

module.exports.ListSkillsCommand = class ListSkillsCommand {

    constructor(program) {
        this.program = program;
    }

    execute(options) {
        debug('%s.executeListSkills()', options.profile);
        const profile = loadProfile(options.profile);
        const catalog = new Catalog(profile.url);
        
        catalog.listSkills(profile.token).then((response) => {
            if (response.success) {
                let result = filterObject(response.skills, options);
                printSuccess(JSON.stringify(result, null, 2), options);
            }
            else {
                printError(`Failed to list skills: ${response.status} ${response.message}`, options);
            }
        })
        .catch((err) => {
            printError(`Failed to list skills ${skillName}: ${err.status} ${err.message}`, options);
        });
    }
};

module.exports.DescribeSkillCommand = class DescribeSkillCommand {

    constructor(program) {
        this.program = program;
    }

    execute(skillName, options) {
        debug('%s.executeDescribeSkill(%s)', options.profile, skillName);
        const profile = loadProfile(options.profile);
        const catalog = new Catalog(profile.url);

        catalog.describeSkill(profile.token, skillName).then((response) => {
            if (response.success) {
                let result = filterObject(response.skill, options);
                printSuccess(JSON.stringify(result, null, 2), options);
            }
            else {
                printError(`Failed to describe skill ${skillName}: ${response.message}`, options);
            }
        })
        .catch((err) => {
            printError(`Failed to describe skill ${skillName}: ${err.status} ${err.message}`, options);
        });
    }
}